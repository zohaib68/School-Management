import { BadRequestException } from '@nestjs/common';
import { SortOrder, Types } from 'mongoose';
import { UpdateSectionFromGradeDto } from 'src/grades/dtos/grades.dtos';
import {
  UpdateSectionDto,
  UpdateSectionUsersDto,
} from 'src/sections/dtos/sections.dtos';
import {
  IPaginationParams,
  IReturnSomethingWrong,
  IUpdateUserOperationsInfo,
  IUpdateUsersCountInfo,
  IUsersValidationBeforeMutationArgs,
  SortEnum,
  TMongooseObjectIdType,
  TObjectWithPermitives,
  TUserOperation,
} from 'src/types';
import { UserSchema } from 'src/users/interfaces/users.interfaces';

export const returnSomethingWentWrong = (): IReturnSomethingWrong => {
  return { message: 'Something went wrong' };
};

export const checkIfPermitivesExistsInObject = (obj: TObjectWithPermitives) => {
  let objToGiveBack: TObjectWithPermitives = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key]) objToGiveBack = { ...objToGiveBack, [key]: obj[key] };
  });

  return objToGiveBack;
};

export const paginationParamsHandler = ({
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'createdAt',
  sortOrder = SortEnum.ASC,
}: IPaginationParams) => {
  const skip = (pageNumber - 1) * pageSize;

  const sortOption: { [key: string]: SortOrder } = {
    [sortBy]: sortOrder.toLowerCase() as SortOrder,
  };

  return { skip, sortOption, pageNumber, pageSize, sortBy, sortOrder };
};

export const updatesSectionKeysMapHandler = (
  section: UpdateSectionFromGradeDto | UpdateSectionDto,
  sectionId: string,
): IUpdateUsersCountInfo => {
  const counts = {
    teachers:
      (section?.teachers?.usersToAdd?.length ?? 0) -
      (section.teachers?.usersToRemove?.length ?? 0),
    students:
      (section?.students?.usersToAdd?.length ?? 0) -
      (section.students?.usersToRemove?.length ?? 0),
  };

  const keysToUpdate = {
    sectionId: sectionId ?? '',
    name: section?.name ?? '',
    teachersCount: counts.teachers,
    studentsCount: counts.students,
    activeTeachersCount: counts.teachers,
    activeStudentsCount: counts.students,
  };

  return keysToUpdate;
};

export const sectionUpdateUserMapper = (
  users: string[],
  operation: TUserOperation,
  gradeId: string,
  sectionId: string,
): IUpdateUserOperationsInfo[] => {
  return users.map((userId) => {
    const mappedGradId = gradeId ? new Types.ObjectId(gradeId) : '';

    const mappedSectionId = sectionId ? new Types.ObjectId(sectionId) : '';

    return {
      userId,
      operation,
      ...checkIfPermitivesExistsInObject({
        gradeId: mappedGradId,
        sectionId: mappedSectionId,
      }),
    };
  });
};

export const updateSectionUsersMapHandler = ({
  section,
  gradeId,
  sectionId,
}: {
  section: UpdateSectionFromGradeDto | UpdateSectionDto;
  gradeId: string;
  sectionId: string;
}): Record<'students' | 'teachers', IUpdateUserOperationsInfo[]> => {
  const mappedUsers = {
    students: [
      ...sectionUpdateUserMapper(
        section.students?.usersToAdd ?? [],
        'ADD',
        gradeId,
        sectionId,
      ),
      ...sectionUpdateUserMapper(
        section.students?.usersToRemove ?? [],
        'REMOVE',
        gradeId,
        sectionId,
      ),
    ],
    teachers: [
      ...sectionUpdateUserMapper(
        section.teachers?.usersToAdd ?? [],
        'ADD',
        gradeId,
        sectionId,
      ),
      ...sectionUpdateUserMapper(
        section.teachers?.usersToRemove ?? [],
        'REMOVE',
        gradeId,
        sectionId,
      ),
    ],
  };

  return mappedUsers;
};

export const prepareUserCountsForGradeUpdate = (
  bodyToSend: IUpdateUsersCountInfo,
  keysToUpdate: IUpdateUsersCountInfo,
) => {
  return {
    studentsCount:
      (bodyToSend?.studentsCount ?? 0) + (keysToUpdate.studentsCount ?? 0),
    teachersCount:
      (bodyToSend?.teachersCount ?? 0) + (keysToUpdate.teachersCount ?? 0),
    activeStudentsCount:
      (bodyToSend?.activeStudentsCount ?? 0) +
      (keysToUpdate?.activeStudentsCount ?? 0),
    activeTeachersCount:
      (bodyToSend?.activeTeachersCount ?? 0) +
      (keysToUpdate?.activeTeachersCount ?? 0),
  };
};

export const toNegative = (value: number) => (value > 0 ? -value : value);

export const filterSectionOrGradeIdHandler = ({
  fieldToFilter,
  fieldId,
  user,
}: {
  fieldId: string;
  user: UserSchema;
  fieldToFilter: 'gradeIds' | 'sectionIds';
}) => {
  return (
    user?.[fieldToFilter]?.filter(
      (fieldIdFromLoop) => fieldIdFromLoop.toString() === fieldId,
    ) ?? []
  );
};

export const isIncludedInUsersForAddition = ({
  usersToCheckFrom,
  usersToMutate,
}: IUsersValidationBeforeMutationArgs) => {
  const isIncludedInUsersForAddition = usersToCheckFrom.find((id) =>
    usersToMutate.includes(id),
  );

  if (!isIncludedInUsersForAddition)
    return {
      isValid: false,
      reason: `Invalid usersToAdd array passed`,
    };

  return { isValid: true, reason: null };
};

export const isUserAlreadyIncludedForRemoval = ({
  usersToCheckFrom,
  usersToMutate,
}: IUsersValidationBeforeMutationArgs) => {
  const isUserAlreadyIncluded = usersToCheckFrom.find((id) =>
    usersToMutate.includes(id),
  );

  console.log(
    { usersToCheckFrom, isUserAlreadyIncluded, usersToMutate },
    'isUserAlreadyIncluded???????????again',
  );
  if (!isUserAlreadyIncluded)
    return {
      isValid: false,
      reason: `Invalid usersToRemove array passed`,
    };

  return { isValid: true, reason: null };
};

export const sectionUsersValidationsHandler = ({
  usersToRemove,
  usersToAdd,
  usersToAddFromConfig,
  usersToRemoveFromConfig,
}: {
  usersToAdd: string[];
  usersToRemove: string[];
  usersToAddFromConfig: UserSchema[];
  usersToRemoveFromConfig: UserSchema[];
}) => {
  if (usersToAdd.length) {
    const { isValid: isValidToAdd, reason: notToAddReason } =
      isIncludedInUsersForAddition({
        usersToCheckFrom: usersToAddFromConfig.map((user) =>
          (user._id as TMongooseObjectIdType).toString(),
        ),
        usersToMutate: [...(usersToAdd ?? []), ...(usersToAdd ?? [])],
      });

    if (!isValidToAdd) throw new BadRequestException(notToAddReason);
  }

  if (usersToRemove.length) {
    const { isValid: isValidToRemove, reason: notToRemoveReason } =
      isUserAlreadyIncludedForRemoval({
        usersToCheckFrom: usersToRemoveFromConfig.map((user) =>
          (user._id as TMongooseObjectIdType).toString(),
        ),
        usersToMutate: [...(usersToRemove ?? []), ...(usersToRemove ?? [])],
      });

    if (!isValidToRemove) throw new BadRequestException(notToRemoveReason);
  }
};

export const prepareUserIdFromUpdateSectionInfo = (
  users: UpdateSectionUsersDto,
) => {
  const { students, teachers } = users;

  return [
    ...(students?.usersToAdd ?? []),
    ...(teachers?.usersToAdd ?? []),
    ...(students?.usersToRemove ?? []),
    ...(teachers?.usersToRemove ?? []),
  ];
};
