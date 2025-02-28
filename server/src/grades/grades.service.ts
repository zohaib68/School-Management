import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  GRADES_MODEL_STRING,
  SECTIONS_MODEL_STRING,
  USERS_MODEL_STRING,
} from 'src/constants';
import {
  GradesSchema,
  ICheckGradeByCredsArgs,
  IGetallGradesResponse,
  IUpdateGradeBody,
  IUpdateGradeInfo,
  TCreateGradeResponse,
} from './interfaces/grades.interfaces';
import {
  checkIfPermitivesExistsInObject,
  filterSectionOrGradeIdHandler,
  paginationParamsHandler,
  prepareUserIdFromUpdateSectionInfo,
  sectionUsersValidationsHandler,
  updatesSectionKeysMapHandler,
} from 'src/helpers/helpers.index';
import {
  IGradeCounts,
  IPaginationParams,
  IResponseInfo,
  IUpdateUserOperationsInfo,
  TMongooseObjectIdType,
  TObjectWithPermitives,
  TUserOperation,
} from 'src/types';
import {
  GradesCreationDto,
  GradesPaginationQueryDto,
  UpdateGradeBulkDto,
  UpdateGradeDto,
  UpdateSectionFromGradeDto,
} from './dtos/grades.dtos';
import {
  IUpdateSectionInfo,
  SectionSchema,
} from 'src/sections/interafces/sections.interfaces';
import { UserSchema } from 'src/users/interfaces/users.interfaces';
import { CreateSectionDto } from 'src/sections/dtos/sections.dtos';
import { UsersService } from 'src/users/users.service';
import { SectionsService } from 'src/sections/sections.service';

@Injectable()
export class GradesService {
  constructor(
    @Inject(GRADES_MODEL_STRING)
    readonly gradesModel: Model<GradesSchema>,
    @Inject(SECTIONS_MODEL_STRING)
    readonly sectionsModel: Model<SectionSchema>,
    @Inject(USERS_MODEL_STRING)
    readonly usersModel: Model<UserSchema>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => SectionsService))
    private readonly sectionsService: SectionsService,
  ) {}

  async createGrade(createGradeDto: GradesCreationDto): TCreateGradeResponse {
    try {
      const { data: foundGrade } = await this.checkGradeByCreds({
        category: createGradeDto.grade,
        name: createGradeDto.name,
      });

      if (!foundGrade) {
        const newGradeObjectId = new Types.ObjectId();

        const mappedSections = createGradeDto.sections.map((section) => {
          const newSectionId = new Types.ObjectId();

          const counts = {
            students: section?.students?.length ?? 0,
            teachers: section.teachers.length,
          };

          return {
            ...section,
            studentsCount: counts.students,
            teachersCount: counts.teachers,
            activeTeachersCount: counts.teachers,
            activeStudentsCount: counts.students,
            inActiveTeachersCount: 0,
            inActiveStudentsCount: 0,
            _id: newSectionId,
            gradeId: newGradeObjectId,
          };
        });

        const gradeCounts: IGradeCounts = createGradeDto.sections.reduce(
          (prev: IGradeCounts, next: CreateSectionDto) => {
            const counts = {
              teachers: prev?.teachersCount + next?.teachers?.length,
              students: prev?.studentsCount + next?.students?.length,
            };

            return {
              teachersCount: counts.teachers,
              studentsCount: counts.students,
              activeTeachersCount: counts.teachers,
              activeStudentsCount: counts.students,
              inActiveTeachersCount: 0,
              inActiveStudentsCount: 0,
            };
          },
          {
            teachersCount: 0,
            studentsCount: 0,
            activeTeachersCount: 0,
            activeStudentsCount: 0,
            inActiveTeachersCount: 0,
            inActiveStudentsCount: 0,
          },
        );

        const userIds = mappedSections.reduce(
          (prev: IUpdateUserOperationsInfo[] | null, next) => {
            return [
              ...(prev ? [...prev] : []),
              ...[next.students, ...next.teachers].map((userId) => {
                return {
                  sectionId: next?._id,
                  operation: 'ADD',
                  userId,
                };
              }),
            ];
          },
          null,
        );

        const createdSections: SectionSchema[] =
          await this.sectionsModel.insertMany(mappedSections);

        await this.usersService.updateUsersSectionAndGradeId({
          gradeId: newGradeObjectId,
          updatReRule: 'BULK_WITH_GRADE',
          usersIds: userIds as IUpdateUserOperationsInfo[],
        });

        const createGrade = new this.gradesModel({
          grade: createGradeDto.grade,
          name: createGradeDto.name,
          _id: newGradeObjectId,
          ...gradeCounts,
        });

        const createdGrade = await createGrade.save();

        return {
          message: 'Grade is created successfully',
          data: {
            createdSections,
            grade: createdGrade,
            updatedUsers: 'Users updated successfully',
          },
        };
      }

      return {
        message: 'Grade with given slot already exists',
      };
    } catch (error) {
      console.log(error, 'whatisError', error.status);
      throw new BadRequestException(error.message);
    }
  }

  async updateGrade(
    gradeId: string,
    body: UpdateGradeDto,
  ): Promise<IResponseInfo<undefined>> {
    const { sections = [], name = '' } = body;

    let bodyToSend: IUpdateGradeInfo | null = null;

    if (name) bodyToSend = { name };

    const mappedUserIds: string[] = [
      ...(body?.sections?.reduce(
        (prev: string[], next: UpdateSectionFromGradeDto) => {
          return [
            ...prev,
            ...prepareUserIdFromUpdateSectionInfo({
              students: next.students,
              teachers: next.teachers,
            }),
          ];
        },
        [],
      ) ?? []),
    ];

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
      } = await this.usersService.checkUsersIdsForBulkOperation({
        usersIds: mappedUserIds,
        gradeId,
      });

      usersConfigs = { usersToAdd, usersToRemove };
    }

    if (sections.length) {
      const sectionsToMap: IUpdateSectionInfo[] = sections.map((section) => {
        const keysToUpdate = updatesSectionKeysMapHandler(
          section,
          section.sectionId,
        );

        sectionUsersValidationsHandler({
          usersToAdd: [
            ...(section?.students?.usersToAdd ?? []),
            ...(section.teachers.usersToAdd ?? []),
          ],
          usersToRemove: [
            ...(section?.students?.usersToRemove ?? []),
            ...(section?.teachers.usersToRemove ?? []),
          ],
          usersToAddFromConfig: usersConfigs.usersToAdd,
          usersToRemoveFromConfig: usersConfigs.usersToRemove,
        });

        return {
          ...checkIfPermitivesExistsInObject(
            keysToUpdate as Record<string, number>,
          ),
        };
      });

      bodyToSend = {
        ...bodyToSend,
        sections: sectionsToMap,
      };
    }

    const hasEditedUsersInsections = body?.sections?.some(
      (section) =>
        section.students?.usersToAdd?.length ??
        section.teachers?.usersToAdd?.length ??
        section.students?.usersToRemove?.length ??
        section.teachers?.usersToRemove?.length,
    );

    try {
      if (hasEditedUsersInsections) {
        const { usersToAdd, usersToRemove } = usersConfigs;

        const mappedUsers: IUpdateUserOperationsInfo[] = [
          ...usersToAdd.map((user, index) => {
            return {
              operation: 'ADD' as TUserOperation,
              userId: user._id as string,
              sectionId: new Types.ObjectId(body.sections[index].sectionId),
            };
          }),
          ...usersToRemove.map((user, index) => {
            return {
              operation: 'REMOVE' as TUserOperation,
              userId: user._id as string,
              sectionId:
                filterSectionOrGradeIdHandler({
                  fieldId: body.sections[index].sectionId,
                  fieldToFilter: 'sectionIds',
                  user,
                })?.[0] ?? '',
            };
          }),
        ];

        await this.usersService.updateUsersSectionAndGradeId({
          updatReRule: 'BULK_WITH_GRADE',
          gradeId: new Types.ObjectId(gradeId),
          usersIds: mappedUsers,
        });

        const counts = {
          student:
            usersToAdd.filter((user) => user.role === 'STUDENT').length -
            usersToRemove.filter((user) => user.role === 'STUDENT').length,
          teachers:
            usersToAdd.filter((user) => user.role === 'TEACHER').length -
            usersToRemove.filter((user) => user.role === 'TEACHER').length,
        };

        bodyToSend = {
          ...bodyToSend,
          activeStudentsCount: counts.student,
          activeTeachersCount: counts.teachers,
          studentsCount: counts.student,
          teachersCount: counts.teachers,
        };
      }

      if (bodyToSend?.sections?.length) {
        await this.sectionsModel.bulkWrite(
          bodyToSend?.sections?.map(
            ({
              sectionId = '',
              studentsCount = 0,
              teachersCount = 0,
              activeStudentsCount = 0,
              activeTeachersCount = 0,
              ...restValues
            }) => {
              return {
                updateMany: {
                  filter: { _id: sectionId },
                  update: {
                    $set: checkIfPermitivesExistsInObject(restValues),
                    $inc: {
                      studentsCount,
                      teachersCount,
                      activeTeachersCount,
                      activeStudentsCount,
                    },
                  },

                  upsert: false,
                },
              };
            },
          ),
        );
      }

      if (
        bodyToSend?.name ||
        bodyToSend?.studentsCount ||
        bodyToSend?.teachersCount
      ) {
        await this.findAndUpdateGrade({
          gradeId,
          activeStudentsCount: bodyToSend.activeStudentsCount,
          activeTeachersCount: bodyToSend.activeTeachersCount,
          name: bodyToSend.name,
          studentsCount: bodyToSend.studentsCount,
          teachersCount: bodyToSend.teachersCount,
        });
      }

      return { message: 'Grade has been updated successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteGrade(gradeId: string) {
    try {
      const { message, data: foundGrade } = await this.getGradeById(gradeId);

      if (foundGrade) {
        const gradeObjectId = new Types.ObjectId(gradeId);

        const foundUsers = await this.usersService.getUsersBySectionOrGradeId({
          gradeId: gradeObjectId,
        });

        await this.usersService.updateUsersSectionAndGradeId({
          gradeId: gradeObjectId,
          updatReRule: 'BULK_REMOVE_WITH_GRADE',
        });

        await this.sectionsService.deleteSection({
          gradeId,
          updateGrade: false,
          deleteMethod: 'MULTIPLE',
        });

        await this.gradesModel.findByIdAndDelete({ _id: gradeId });

        return {
          message: 'Grade deleted successfully.',
          data: foundUsers,
        };
      }

      return { message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAndUpdateGrade({
    gradeId,
    activeStudentsCount,
    activeTeachersCount,
    name,
    studentsCount,
    teachersCount,
    inActiveStudentsCount,
    inActiveTeachersCount,
  }: IUpdateGradeBody): Promise<IResponseInfo<undefined | GradesSchema>> {
    try {
      const updatedGrade = await this.gradesModel.findByIdAndUpdate(
        { _id: gradeId },
        {
          $set: checkIfPermitivesExistsInObject({
            name: name,
          }),
          $inc: {
            ...checkIfPermitivesExistsInObject({
              studentsCount: studentsCount ?? 0,
              teachersCount: teachersCount ?? 0,
              activeTeachersCount: activeTeachersCount ?? 0,
              activeStudentsCount: activeStudentsCount ?? 0,
              inActiveStudentsCount: inActiveStudentsCount ?? 0,
              inActiveTeachersCount: inActiveTeachersCount ?? 0,
            }),
          },
        },
        { new: true },
      );

      if (updatedGrade)
        return {
          message: 'Grade has been updated successfully',
          data: updatedGrade,
        };

      return { message: 'Some error in updating grade' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGradeById(
    gradeId: string,
  ): Promise<IResponseInfo<GradesSchema | undefined>> {
    try {
      const foundGrade = await this.gradesModel.findById(gradeId);

      if (foundGrade)
        return {
          message: 'Grade found.',
          data: foundGrade,
        };

      return {
        message: 'Grade not found',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGradesByIds(
    ids: TMongooseObjectIdType[],
  ): Promise<IResponseInfo<GradesSchema[]>> {
    try {
      const grades = await this.gradesModel
        .find({ _id: { $in: ids } })
        .lean()
        .exec();

      if (grades) {
        return {
          message: 'Grades found',
          data: grades,
        };
      }

      return {
        message: 'Grades not found',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllGrades(
    queryParams: GradesPaginationQueryDto,
  ): IGetallGradesResponse {
    const {
      pageSize = 20,
      sortOption,
      skip,
    } = paginationParamsHandler(queryParams as IPaginationParams);

    const totalUsers = await this.gradesModel.countDocuments();

    try {
      const foundGrades = await this.gradesModel
        .find({})
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        message: 'All grades are fetched',
        data: foundGrades,
        totalCounts: totalUsers,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkGradeByCreds(
    args: ICheckGradeByCredsArgs,
  ): Promise<IResponseInfo<GradesSchema>> {
    try {
      const argsToSendKeys = Object.keys(
        checkIfPermitivesExistsInObject(args as TObjectWithPermitives),
      );

      const argsToSend = argsToSendKeys.map((arg) => ({
        [arg]: args[arg as keyof ICheckGradeByCredsArgs],
      }));

      const foundGrade = await this.gradesModel.findOne({ $or: argsToSend });
      if (foundGrade)
        return {
          message: 'Grade with given slot already exists',
          data: foundGrade,
        };

      return {
        message: 'Good to go.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async performBulkOperationOnGrades(args: UpdateGradeBulkDto[]) {
    try {
      await this.gradesModel.bulkWrite(
        args.map((arg) => {
          const keysToUpdate = updatesSectionKeysMapHandler(
            {
              sectionId: '',
              students: {
                usersToAdd: arg?.students?.usersToAdd ?? [],
                usersToRemove: arg?.students?.usersToRemove ?? [],
              },
              teachers: {
                usersToAdd: arg?.teachers?.usersToAdd ?? [],
                usersToRemove: arg?.teachers?.usersToRemove ?? [],
              },
            },
            '',
          );

          console.log(keysToUpdate, 'keysToUpdateInBulk');

          return {
            updateMany: {
              filter: { _id: arg.gradeId },
              update: {
                $set: {
                  ...checkIfPermitivesExistsInObject({
                    name: arg?.name ?? '',
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
