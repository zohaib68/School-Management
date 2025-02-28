import { Model, Types } from 'mongoose';
import {
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import {
  RETURN_SOME_THING_WENT_WRONG,
  USERS_MODEL_STRING,
} from 'src/constants';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserPaginationQueryDto,
} from './dtos/users.dtos';
import {
  ICheckUsersIdsResponse,
  IGetallUsersResponse,
  IUpdateUsersIdsResponse,
  IValidateUserByCred,
  TGetUsersByGradeOrSectionIdsResponse,
  UserSchema,
} from './interfaces/users.interfaces';
import {
  IPaginationParams,
  IResponseInfo,
  UserStatusEnum,
  IUpdateUserSectionAndGroupIdArgs,
  TMongooseObjectIdType,
  UserRoleEnumForCreation,
  TObjectWithPermitives,
} from 'src/types';
import {
  checkIfPermitivesExistsInObject,
  paginationParamsHandler,
} from 'src/helpers/helpers.index';
import { GradesService } from 'src/grades/grades.service';
import { SectionsService } from 'src/sections/sections.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_MODEL_STRING)
    readonly usersModel: Model<UserSchema>,
    @Inject(forwardRef(() => GradesService))
    private readonly gradesService: GradesService,
    @Inject(forwardRef(() => SectionsService))
    private readonly sectionService: SectionsService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    try {
      const updatedBody = { ...createUserDto, status: UserStatusEnum.ACTIVE };

      const { data: foundUser, message } = await this.validateUserByCred({
        email: updatedBody.email ?? '',
      });

      if (!foundUser) {
        const isOnlyGradedAdd =
          !!createUserDto?.gradeIds && !createUserDto?.sectionIds;

        const isGradeAndSectionBothAssigned = !!(
          createUserDto?.gradeIds && createUserDto?.sectionIds
        );

        const createdUserId = new Types.ObjectId();

        const gradeCountsUpdateHandler = async () => {
          await this.gradesService.performBulkOperationOnGrades(
            createUserDto?.gradeIds?.map((gradeId) => ({
              students: {
                usersToRemove: [],
                ...(createUserDto.role === UserRoleEnumForCreation.STUDENT
                  ? { usersToAdd: [createdUserId?.toString()] }
                  : {}),
              },
              gradeId,
              teachers: {
                usersToRemove: [],
                ...(createUserDto.role === UserRoleEnumForCreation.TEACHER
                  ? { usersToAdd: [createdUserId?.toString()] }
                  : {}),
              },
            })) ?? [],
          );
        };

        const sectionWRTgradesCountsHandler = async () => {
          await this.sectionService.updateSectionsAsBulk(
            createUserDto?.sectionIds?.map((sectionId) => ({
              sectionId,
              students: {
                usersToRemove: [],
                ...(createUserDto.role === UserRoleEnumForCreation.STUDENT
                  ? { usersToAdd: [createdUserId?.toString()] }
                  : {}),
              },
              teachers: {
                usersToRemove: [],
                ...(createUserDto.role === UserRoleEnumForCreation.TEACHER
                  ? { usersToAdd: [createdUserId?.toString()] }
                  : {}),
              },
            })) ?? [],
          );
        };

        const countsAdjustMents = () => {
          if (isOnlyGradedAdd) gradeCountsUpdateHandler();
          else if (isGradeAndSectionBothAssigned) {
            gradeCountsUpdateHandler();

            sectionWRTgradesCountsHandler();
          }
        };

        countsAdjustMents();

        const createUser = new this.usersModel({
          ...updatedBody,
          _id: createdUserId,
        });

        const savedUser = await createUser.save();

        return {
          message: 'User is created Successfully',
          data: savedUser,
        };
      }

      return { message };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    try {
      if (updateData?.email) {
        const { data: foundUser, message } = await this.validateUserByCred({
          email: updateData.email,
        });

        return foundUser
          ? { message }
          : this.updateUserHandler({ id, updateData });
      }

      return this.updateUserHandler({ id, updateData });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUserHandler({
    id,
    updateData,
  }: {
    id: string;
    updateData: Partial<UpdateUserDto>;
  }): Promise<IResponseInfo<UserSchema | undefined>> {
    try {
      const updatedUser = await this.usersModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          },
        )
        .lean();

      if (updatedUser)
        return {
          message: 'User is updated successfully',
          data: updatedUser,
        };

      return RETURN_SOME_THING_WENT_WRONG;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(userId: string): Promise<IResponseInfo<undefined>> {
    try {
      const deletedUser = await this.usersModel.deleteOne({ _id: userId });

      if (deletedUser.acknowledged)
        return { message: 'User is deleted successfully' };

      return RETURN_SOME_THING_WENT_WRONG;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllUsers(queryParams: UserPaginationQueryDto): IGetallUsersResponse {
    const {
      pageSize = 20,
      sortOption,
      skip,
    } = paginationParamsHandler(queryParams as IPaginationParams);

    const filters = checkIfPermitivesExistsInObject({
      role: queryParams.role,
      gradeIds: queryParams.gradeId,
      sectionIds: queryParams.sectionId,
    });

    const totalUsers = await this.usersModel.countDocuments(filters);

    try {
      const foundUsers = await this.usersModel
        .find({
          ...filters,
        })
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        message: 'All users are fetched',
        data: foundUsers,
        totalCounts: totalUsers,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUsersSectionAndGradeId(
    args: IUpdateUserSectionAndGroupIdArgs,
  ): Promise<IResponseInfo<IUpdateUsersIdsResponse | undefined>> {
    const {
      gradeId,
      updatReRule,
      usersIds = [],
      sectionId = '',
      userId = '',
    } = args;

    const updateSingleUserHandler = async (): Promise<
      IResponseInfo<IUpdateUsersIdsResponse | undefined>
    > => {
      if (sectionId) {
        await this.updateUserHandler({
          id: userId as string,
          updateData: {
            gradeId: gradeId?.toString() ?? '',
            sectionId: sectionId?.toString() ?? '',
          },
        });

        return {
          message: 'User has been updated successfully.',
        };
      }

      return {
        message: 'Section id is required',
      };
    };

    const updateUsersWithBulkGrade = async () => {
      await this.usersModel.bulkWrite(
        usersIds.map((update) => {
          const ids = {
            gradeIds: gradeId,
            sectionIds:
              updatReRule === 'BULK_WITH_GRADE'
                ? (update?.sectionId ?? '')
                : sectionId,
          };

          return {
            updateMany: {
              filter: { _id: update.userId },
              update: {
                ...(update.operation === 'ADD'
                  ? {
                      $addToSet: {
                        ...ids,
                      },
                    }
                  : {
                      $pull: {
                        ...ids,
                      },
                    }),
              },
              upsert: false,
            },
          };
        }),
      );

      return {
        message: 'Users have been updated successfully.',
      };
    };

    const removeUserFromSectionOrGradeHandler = async () => {
      try {
        await this.usersModel.updateMany(
          {
            gradeId: [gradeId],
            sectionId: [sectionId],
            ...(gradeId
              ? {
                  _id: {
                    $in: gradeId,
                  },
                }
              : {}),
            ...(sectionId
              ? {
                  _id: {
                    $in: sectionId,
                  },
                }
              : {}),
          },

          { $pull: { gradeIds: gradeId, sectionIds: sectionId } },
        );

        return {
          message: 'Users have been removed successfully.',
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    };

    try {
      switch (updatReRule) {
        case 'BULK_WITH_GRADE':
          return await updateUsersWithBulkGrade();

        case 'BULK_WITH_SECTION':
          return await updateUsersWithBulkGrade();

        case 'BULK_REMOVE_WITH_GRADE':
          return await removeUserFromSectionOrGradeHandler();

        case 'BULK_REMOVE_WITH_SECTION':
          return await removeUserFromSectionOrGradeHandler();

        case 'SINGLETON':
          return await updateSingleUserHandler();

        default:
          return {
            message: 'Please provide correct information',
          };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkUsersIdsForBulkOperation({
    gradeId,
    usersIds,
    sectionId,
  }: {
    usersIds: string[];
    gradeId: string;
    sectionId?: string;
  }): Promise<IResponseInfo<ICheckUsersIdsResponse | undefined>> {
    const usersToAdd = await this.usersModel.find({
      _id: { $in: usersIds },
      gradeIds: { $ne: gradeId },
      ...(sectionId ? { sectionIds: { $in: [sectionId] } } : {}),
    });

    const usersToRemove = await this.usersModel.find({
      _id: { $in: usersIds },
      gradeIds: gradeId,
      ...(sectionId ? { sectionIds: { $in: [sectionId] } } : {}),
    });

    return {
      message: 'Users fetched successfully',
      data: {
        usersToRemove,
        usersToAdd,
      },
    };
  }

  async getUsersBySectionOrGradeId({
    gradeId,
    sectionId,
  }: {
    gradeId?: TMongooseObjectIdType;
    sectionId?: TMongooseObjectIdType;
  }) {
    try {
      const foundUsers = await this.usersModel
        .find({
          ...(gradeId ? { gradeIds: gradeId } : {}),
          ...(sectionId ? { sectionIds: sectionId } : {}),
        })
        .exec();

      console.log(foundUsers, 'foundUsers');

      return foundUsers ?? [];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async validateUserByCred(
    args: IValidateUserByCred,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    const argsToSendKeys = Object.keys(
      checkIfPermitivesExistsInObject(args as unknown as TObjectWithPermitives),
    );

    const argsToSend = argsToSendKeys.map((arg) => ({
      [arg]: args[arg as keyof IValidateUserByCred],
    }));

    if (argsToSend.length) {
      console.log('donereachedhere', { argsToSend, args, argsToSendKeys });
      const foundUser = await this.usersModel
        .findOne({ $or: argsToSend })
        .exec();
      console.log('donereachedhere');
      if (foundUser) {
        return {
          message: 'User with given credentials already exists',
          data: foundUser,
        };
      }
    }

    return { message: 'Good to go.' };
  }

  async getUserScopes(id: string): TGetUsersByGradeOrSectionIdsResponse {
    try {
      const { data: foundUser } = await this.validateUserByCred({
        _id: id,
      });

      if (foundUser) {
        const gradeIds = foundUser.gradeIds ?? [];

        const sectionIds = foundUser?.sectionIds ?? [];

        const foundSections =
          await this.sectionService.getSectionsByIds(sectionIds);

        const foundGrades = await this.gradesService.getGradesByIds(gradeIds);

        if (foundGrades.data && foundSections.data) {
          return {
            message: 'User scopes are fetched',
            data: {
              grades: foundGrades.data,
              sections: foundSections.data,
            },
          };
        }

        if (!foundGrades.data || !foundSections.data)
          return {
            message: 'Some of the user scopes are not found',
          };
      }

      return { message: 'User is not found against the given id' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async toggleUserStatus(userId: string, { status }: UpdateUserStatusDto) {
    return await this.updateUserHandler({
      id: userId,
      updateData: { status },
    });
  }
}
