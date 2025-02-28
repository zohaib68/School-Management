import { Types } from 'mongoose';
import { UserSchema } from 'src/users/interfaces/users.interfaces';

export type TObjectWithPermitives = Record<
  string,
  string | null | undefined | number | TMongooseObjectIdType
>;

export interface IResponseInfo<DataType> {
  message: string;
  data?: DataType;
}

export interface IReturnSomethingWrong {
  message: 'Something went wrong';
}

export enum SortEnum {
  ASC = 'ASC',
  DSC = 'DESC',
}

export interface IPaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: SortEnum;
  sortBy?: string;
}

export enum UserRoleEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  HEAD = 'HEAD',
}

export enum UserRoleEnumForCreation {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum StudentPermissionsEnum {
  EVENTS = 'EVENTS',
  MEETINGS = 'MEETINGS',
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export interface IUserInfo {
  name: string;
  age: number;
  dateOfBirth: string;
  role: UserRoleEnum;
  grade?: string;
  dateOfEnrollMent: string;
  dateOfLeave?: string;
  status: UserStatusEnum;
}

export interface ITotalCountsResponse {
  totalCounts: number;
}

export enum SectionsEnum {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum GradesEnum {
  SIXTH = '6',
  SEVENTH = '7',
  EIGHTH = '8',
  NINTH = '9',
  TENTH = '10',
}
export interface IGradeCounts {
  teachersCount: number;
  studentsCount: number;
  activeTeachersCount: number;
  activeStudentsCount: number;
  inActiveTeachersCount: number;
  inActiveStudentsCount: number;
}

export type TMongooseObjectIdType = Types.ObjectId;

export interface IUserUpdateGradeOrSectionId {
  sectionId: TMongooseObjectIdType;
  gradeId?: TMongooseObjectIdType;
  userIds: string[];
}

export interface ICreateSectionPayload {
  readonly gradeId: TMongooseObjectIdType;
  readonly studentsCount: number;
  readonly teachersCount: number;
  readonly _id: TMongooseObjectIdType;
  readonly category: SectionsEnum;
  readonly name: string;
  readonly teachers: string[];
  readonly students: string[];
}

export interface IUpdateUsersCountInfo {
  teachersCount?: number;
  studentsCount?: number;
  activeTeachersCount?: number;
  activeStudentsCount?: number;
  inActiveTeachersCount?: number;
  inActiveStudentsCount?: number;
}

export type TUserOperation = 'ADD' | 'REMOVE';

export interface IUpdateUserOperationsInfo {
  operation: TUserOperation;
  userId: string;
  sectionId?: TMongooseObjectIdType;
  gradeId?: TMongooseObjectIdType;
}

export interface IUpdateGradeUsersCountAndUsersInfo
  extends IUpdateUsersCountInfo {
  usersToupdate?: IUpdateUserOperationsInfo[];
}

export type TUpdateUserSectionAndGroupIdOpertaiontype =
  | 'BULK_WITH_GRADE'
  | 'SINGLETON'
  | 'BULK_WITH_SECTION'
  | 'BULK_REMOVE_WITH_GRADE'
  | 'BULK_REMOVE_WITH_SECTION';

export interface IUpdateUserSectionAndGroupIdArgs {
  updatReRule: TUpdateUserSectionAndGroupIdOpertaiontype;
  usersIds?: IUpdateUserOperationsInfo[];
  gradeId?: TMongooseObjectIdType;
  sectionId?: TMongooseObjectIdType;
  userId?: TMongooseObjectIdType;
}

export interface IUsersValidationBeforeMutationArgs {
  usersToCheckFrom: string[];
  usersToMutate: string[];
}

export interface ILoginResponseInfo {
  accessToken: string;
  user: UserSchema;
}
