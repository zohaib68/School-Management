import { Document } from 'mongoose';
import {
  IUpdateSectionInfo,
  SectionSchema,
} from 'src/sections/interafces/sections.interfaces';
import {
  GradesEnum,
  IResponseInfo,
  ITotalCountsResponse,
  IUpdateGradeUsersCountAndUsersInfo,
  TMongooseObjectIdType,
} from 'src/types';

export interface GradesSchema extends Document {
  readonly name: string;
  readonly teachersCount: number;
  readonly studentsCount: number;
  readonly grade: string;
  readonly activeTeachersCount: number;
  readonly activeStudentsCount: number;
  readonly inActiveTeachersCount: number;
  readonly inActiveStudentsCount: number;
  readonly _id: TMongooseObjectIdType;
}

interface IGetallGradesResponseInfo
  extends ITotalCountsResponse,
    IResponseInfo<GradesSchema[]> {}

export type IGetallGradesResponse = Promise<IGetallGradesResponseInfo>;

export type TCreateGradeResponse = Promise<
  IResponseInfo<{
    grade: GradesSchema;
    updatedUsers: string;
    createdSections: SectionSchema[];
  }>
>;

export interface IUpdateGradeInfo extends IUpdateGradeUsersCountAndUsersInfo {
  name?: string;
  sections?: IUpdateSectionInfo[];
}

export interface IUpdateGradeBody {
  gradeId: string;
  name?: string;
  studentsCount?: number;
  teachersCount?: number;
  activeTeachersCount?: number;
  activeStudentsCount?: number;
  inActiveTeachersCount?: number;
  inActiveStudentsCount?: number;
}

export interface ICheckGradeByCredsArgs {
  category?: GradesEnum;
  name?: string;
}
