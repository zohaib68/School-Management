import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { SECTIONS_MODEL_STRING } from 'src/constants';
import {
  IFindSectionByCredArgs,
  SectionSchema,
} from './interafces/sections.interfaces';
import {
  IResponseInfo,
  IUpdateUsersCountInfo,
  TMongooseObjectIdType,
  TObjectWithPermitives,
} from 'src/types';
import {
  CreateSectionDto,
  UpdateSectionDto,
  UpdateUsersInSectionDto,
} from './dtos/sections.dtos';
import {
  checkIfPermitivesExistsInObject,
  prepareUserIdFromUpdateSectionInfo,
  sectionUsersValidationsHandler,
  toNegative,
  updateSectionUsersMapHandler,
  updatesSectionKeysMapHandler,
} from 'src/helpers/helpers.index';
import { UsersService } from 'src/users/users.service';
import { GradesService } from 'src/grades/grades.service';
import { UserSchema } from 'src/users/interfaces/users.interfaces';
import { UpdateSectionFromGradeDto } from 'src/grades/dtos/grades.dtos';

@Injectable()
export class SectionsService {
  constructor(
    @Inject(SECTIONS_MODEL_STRING)
    readonly sectionsModel: Model<SectionSchema>,
    @Inject(forwardRef(() => UsersService))
    private readonly UsersService: UsersService,
    @Inject(forwardRef(() => GradesService))
    private readonly gradesService: GradesService,
  ) {}

  async createSections(
    body: CreateSectionDto,
  ): Promise<IResponseInfo<undefined | SectionSchema>> {
    try {
      const { data: foundGrade } = await this.gradesService.getGradeById(
        body.gradeId,
      );

      if (!foundGrade)
        return {
          message: 'No grade found against given gradeId',
        };

      const { message, data: foundSection } = await this.findSectionByCreds({
        name: body.name,
        category: body.category,
      });

      if (!foundSection) {
        const sectionId = new Types.ObjectId();

        const gradeId = body.gradeId;

        const { data: counts } = await this.sectionRelatedDependenciesHandlings(
          {
            gradeId,
            sectionId,
            students: { usersToRemove: [], usersToAdd: body?.students ?? [] },
            teachers: { usersToRemove: [], usersToAdd: body?.teachers ?? [] },
          },
        );

        if (counts) {
          const {
            activeStudentsCount,
            activeTeachersCount,
            inActiveStudentsCount,
            inActiveTeachersCount,
            studentsCount,
            teachersCount,
          } = counts;

          const creatSection = new this.sectionsModel({
            ...body,
            gradeId,
            _id: sectionId,
            activeStudentsCount,
            activeTeachersCount,
            inActiveStudentsCount,
            inActiveTeachersCount,
            studentsCount,
            teachersCount,
          });

          const createdSection = await creatSection.save();

          return {
            message: 'Section is created successfully',
            data: createdSection,
          };
        }

        return {
          message: 'Please provide correct information',
        };
      }

      return {
        message,
        data: foundSection as SectionSchema,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSection(
    body: UpdateSectionDto,
    sectionId: string,
    gradeId: string,
  ): Promise<IResponseInfo<SectionSchema | undefined>> {
    try {
      if (body?.students || body?.teachers || body?.name) {
        const mappedUserIds: string[] = prepareUserIdFromUpdateSectionInfo({
          students: body.students,
          teachers: body.teachers,
        });

        let usersConfigs: {
          usersToAdd: UserSchema[];
          usersToRemove: UserSchema[];
        } = {
          usersToAdd: [],
          usersToRemove: [],
        };

        if (mappedUserIds.length) {
          const {
            data: { usersToAdd, usersToRemove } = {
              usersToAdd: [],
              usersToRemove: [],
            },
          } = await this.UsersService.checkUsersIdsForBulkOperation({
            usersIds: mappedUserIds,
            gradeId,
          });
          usersConfigs = { usersToAdd, usersToRemove };
        }

        sectionUsersValidationsHandler({
          usersToAdd: [
            ...(body?.students?.usersToAdd ?? []),
            ...(body?.teachers?.usersToAdd ?? []),
          ],
          usersToRemove: [
            ...(body?.students?.usersToRemove ?? []),
            ...(body?.teachers?.usersToRemove ?? []),
          ],
          usersToAddFromConfig: usersConfigs.usersToAdd,
          usersToRemoveFromConfig: usersConfigs.usersToRemove,
        });

        const { data: counts, message } =
          await this.sectionRelatedDependenciesHandlings({
            gradeId,
            sectionId: new Types.ObjectId(sectionId),
            students: body?.students,
            teachers: body?.teachers,
          });

        if (counts) {
          const {
            activeStudentsCount,
            activeTeachersCount,
            inActiveStudentsCount,
            inActiveTeachersCount,
            studentsCount,
            teachersCount,
          } = counts;

          const updatedSection = await this.sectionsModel
            .findByIdAndUpdate(
              { _id: sectionId },

              {
                $inc: {
                  ...checkIfPermitivesExistsInObject({
                    studentsCount,
                    activeTeachersCount,
                    activeStudentsCount,
                    inActiveStudentsCount,
                    inActiveTeachersCount,
                    teachersCount,
                  }),
                },
                $set: {
                  ...checkIfPermitivesExistsInObject({
                    name: body?.name ?? '',
                  }),
                },
              },
              { new: true },
            )
            .lean()
            .exec();

          if (updatedSection) return { message, data: updatedSection };

          return {
            message: 'There is bug in updating counts please try again later',
          };
        }

        return {
          message: 'There is bug in updating counts please try again later',
        };
      }

      return { message: 'Please updae something' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findSectionByCreds(
    args: IFindSectionByCredArgs,
    shouldFindAll?: boolean,
  ): Promise<IResponseInfo<undefined | SectionSchema | SectionSchema[]>> {
    try {
      const argsToSendKeys = Object.keys(
        checkIfPermitivesExistsInObject(args as TObjectWithPermitives),
      );

      const argsToSend = argsToSendKeys.map((arg) => ({
        [arg]: args[arg as keyof IFindSectionByCredArgs],
      }));

      if (shouldFindAll) {
        console.log(argsToSend, 'argsToSend');
        const foundSections = await this.sectionsModel
          .find({
            $or: argsToSend,
          })
          .lean()
          .exec();

        if (foundSections)
          return {
            message: 'Sections already exists against given credentials',
            data: foundSections,
          };
      } else {
        const foundSection = await this.sectionsModel
          .findOne({
            $or: argsToSend,
          })
          .lean()
          .exec();

        if (foundSection)
          return {
            message: 'Section already exists against given credentials',
            data: foundSection,
          };
      }

      return { message: 'Good to go.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSectionById(
    sectionId: string,
  ): Promise<IResponseInfo<undefined | SectionSchema>> {
    try {
      const { data: foundSection } = await this.findSectionByCreds({
        _id: sectionId,
      });

      if (foundSection)
        return {
          message: 'Section found.',
          data: foundSection as SectionSchema,
        };

      return { message: 'Section not found against the given section id' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSectionsByIds(
    ids: TMongooseObjectIdType[],
  ): Promise<IResponseInfo<SectionSchema[]>> {
    try {
      const grades = await this.sectionsModel
        .find({ _id: { $in: ids } })
        .lean()
        .exec();

      if (grades) {
        return {
          message: 'Sections found',
          data: grades,
        };
      }

      return {
        message: 'Sections not found',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sectionRelatedDependenciesHandlings({
    gradeId,
    sectionId,
    ...body
  }: {
    students?: UpdateUsersInSectionDto;
    teachers?: UpdateUsersInSectionDto;
    gradeId: string;
    sectionId: TMongooseObjectIdType;
  }): Promise<IResponseInfo<IUpdateUsersCountInfo>> {
    try {
      const keysToUpdate = updatesSectionKeysMapHandler(
        {
          sectionId: '',
          students: {
            usersToAdd: body?.students?.usersToAdd ?? [],
            usersToRemove: body?.students?.usersToRemove ?? [],
          },
          teachers: {
            usersToAdd: body?.teachers?.usersToAdd ?? [],
            usersToRemove: body?.teachers?.usersToRemove ?? [],
          },
        },
        '',
      );

      const mappedUsers = updateSectionUsersMapHandler({
        gradeId: '',
        section: {
          sectionId: '',
          students: {
            usersToAdd: body?.students?.usersToAdd ?? [],
            usersToRemove: body?.students?.usersToRemove ?? [],
          },
          teachers: {
            usersToAdd: body?.teachers?.usersToAdd ?? [],
            usersToRemove: body?.teachers?.usersToRemove ?? [],
          },
        },
        sectionId: '',
      });

      const countsFromBodyToSend = {
        activeStudentsCount: keysToUpdate?.activeStudentsCount ?? 0,
        activeTeachersCount: keysToUpdate?.activeTeachersCount ?? 0,
        inActiveStudentsCount: 0,
        inActiveTeachersCount: 0,
        studentsCount: keysToUpdate?.studentsCount ?? 0,
        teachersCount: keysToUpdate?.teachersCount ?? 0,
      };

      const shouldUpdateGradeCounts = !!(
        body.teachers?.usersToRemove?.length ??
        body.students?.usersToAdd?.length ??
        body.students?.usersToRemove?.length ??
        body.teachers?.usersToAdd?.length
      );

      if (shouldUpdateGradeCounts) {
        await this.gradesService.findAndUpdateGrade({
          ...countsFromBodyToSend,
          gradeId,
        });
      }

      await this.UsersService.updateUsersSectionAndGradeId({
        updatReRule: 'BULK_WITH_SECTION',
        gradeId: new Types.ObjectId(gradeId),
        sectionId: new Types.ObjectId(sectionId),
        usersIds: [...mappedUsers.teachers, ...mappedUsers.students],
      });

      return {
        message: 'Section realted updates done successfully.',
        data: countsFromBodyToSend,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSectionCounts(
    counts: IUpdateUsersCountInfo,
    sectionId: string,
  ): Promise<IResponseInfo<undefined | SectionSchema>> {
    const updatedSection = await this.sectionsModel
      .findByIdAndUpdate(
        {
          _id: sectionId,
        },
        {
          $inc: {
            ...checkIfPermitivesExistsInObject(counts as TObjectWithPermitives),
          },
        },
      )
      .lean()
      .exec();

    if (updatedSection)
      return {
        message: 'Section counts updates successfully',
        data: updatedSection,
      };

    return { message: 'No section found against given section id' };
  }

  async deleteSection({
    gradeId,
    sectionId,
    updateGrade,
    updateUsersWithIds = false,
    deleteMethod,
  }: {
    gradeId: string;
    sectionId?: string;
    updateGrade?: boolean;
    updateUsersWithIds?: boolean;
    deleteMethod: 'MULTIPLE' | 'SINGLETON';
  }): Promise<IResponseInfo<undefined>> {
    try {
      if (deleteMethod === 'SINGLETON') {
        const { data: foundSection } = await this.findSectionByCreds({
          _id: sectionId,
        });

        if (foundSection) {
          if (!updateUsersWithIds)
            await this.UsersService.updateUsersSectionAndGradeId({
              updatReRule: 'BULK_REMOVE_WITH_SECTION',
              sectionId: new Types.ObjectId(sectionId),
            });

          await this.sectionsModel.deleteOne({
            gradeId,
            _id: sectionId,
          });

          if (updateGrade) {
            const {
              activeStudentsCount,
              activeTeachersCount,
              studentsCount,
              teachersCount,
            } = foundSection as SectionSchema;
            await this.gradesService.findAndUpdateGrade({
              gradeId,
              activeStudentsCount: toNegative(activeStudentsCount),
              activeTeachersCount: toNegative(activeTeachersCount),
              studentsCount: toNegative(studentsCount),
              teachersCount: toNegative(teachersCount),
            });
          }

          return {
            message: 'Section has been deleted sucessfully',
          };
        }

        return { message: 'No section found against given section id' };
      } else if (deleteMethod === 'MULTIPLE') {
        await this.sectionsModel.deleteMany({
          gradeId,
        });

        return {
          message: 'Sections have been deleted sucessfully',
        };
      }

      return { message: 'Please provide correct information' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSectionsAsBulk(body: UpdateSectionFromGradeDto[]) {
    try {
      await this.sectionsModel.bulkWrite(
        body.map((section) => {
          const keysToUpdate = updatesSectionKeysMapHandler(
            {
              sectionId: '',
              students: {
                usersToAdd: section?.students?.usersToAdd ?? [],
                usersToRemove: section?.students?.usersToRemove ?? [],
              },
              teachers: {
                usersToAdd: section?.teachers?.usersToAdd ?? [],
                usersToRemove: section?.teachers?.usersToRemove ?? [],
              },
            },
            '',
          );
          return {
            updateMany: {
              filter: { _id: section.sectionId },
              update: {
                $set: {
                  ...checkIfPermitivesExistsInObject({
                    name: section?.name ?? '',
                  }),
                },
                $inc: {
                  ...checkIfPermitivesExistsInObject({
                    studentsCount: keysToUpdate?.studentsCount ?? 0,
                    teachersCount: keysToUpdate?.teachersCount ?? 0,
                    activeStudentsCount: keysToUpdate?.activeStudentsCount ?? 0,
                    activeTeachersCount: keysToUpdate?.activeTeachersCount ?? 0,
                  }),
                },
              },
            },
          };
        }),
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
