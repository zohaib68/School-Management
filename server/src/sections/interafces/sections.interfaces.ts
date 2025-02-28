import { Document } from 'mongoose';
import {
  IUpdateUsersCountInfo,
  SectionsEnum,
  TMongooseObjectIdType,
} from 'src/types';

export interface SectionSchema extends Document {
  readonly name: string;
  readonly category: string;
  readonly teachersCount: number;
  readonly studentsCount: number;
  readonly gradeId: TMongooseObjectIdType;
  readonly _id: TMongooseObjectIdType;
  readonly inActiveTeachersCount: number;
  readonly inActiveStudentsCount: number;
  readonly activeTeachersCount: number;
  readonly activeStudentsCount: number;
}

export interface IUpdateUsersInfo {
  usersToAdd?: string[];
  usersToRemove: string[];
}

export interface IUpdateSectionUsers {
  teachers: IUpdateUsersInfo;
  students: IUpdateUsersInfo;
}

export interface IUpdateSectionInfo extends IUpdateUsersCountInfo {
  name?: string;
  sectionId?: string;
}

export interface IFindSectionByCredArgs {
  name?: string;
  category?: SectionsEnum;
  _id?: string;
  gradeId?: string;
}
