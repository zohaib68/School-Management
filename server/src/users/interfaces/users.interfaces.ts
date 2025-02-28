import { Document } from 'mongoose';
import { GradesSchema } from 'src/grades/interfaces/grades.interfaces';
import { SectionSchema } from 'src/sections/interafces/sections.interfaces';
import {
  IResponseInfo,
  ITotalCountsResponse,
  TMongooseObjectIdType,
  UserRoleEnum,
  UserStatusEnum,
} from 'src/types';

export interface UserSchema extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly age: number;
  readonly dateOfBirth: string;
  readonly role: UserRoleEnum;
  readonly grade?: string;
  readonly dateOfEnrollMent: string;
  readonly userName?: string;
  readonly password?: string;
  readonly dateOfLeave?: string;
  readonly status: UserStatusEnum;
  readonly email?: string;
  readonly sectionIds?: TMongooseObjectIdType[];
  readonly gradeIds?: TMongooseObjectIdType[];
}

export interface IGetallUsersResponseInfo
  extends ITotalCountsResponse,
    IResponseInfo<UserSchema[]> {}

export type IGetallUsersResponse = Promise<IGetallUsersResponseInfo>;

export interface IValidateUserByCred {
  firstName?: string;
  lastName?: string;
  age?: string;
  dateOfBirth?: string;
  role?: UserRoleEnum;
  dateOfEnrollMent?: string;
  dateOfLeave?: string;
  status?: UserStatusEnum;
  email?: string;
  _id?: string;
  userName?: string;
  password?: string;
}

export interface IUpdateUsersIdsResponse {
  addedIdsCount: number;
  removedIdsCount: number;
}

export interface ICheckUsersIdsResponse {
  usersToRemove: UserSchema[];
  usersToAdd: UserSchema[];
}

export interface IUserScopes {
  grades: GradesSchema[];
  sections: SectionSchema[];
}

export type TGetUsersByGradeOrSectionIdsResponse = Promise<
  IResponseInfo<IUserScopes | undefined>
>;
