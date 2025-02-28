import { SectionsEnum } from "../enums/types.enums";

export interface ISectionInfo {
  name: string;
  category: string;
  teachersCount: number;
  studentsCount: number;
  gradeId: string;
  _id: string;
  inActiveTeachersCount: number;
  inActiveStudentsCount: number;
  activeTeachersCount: number;
  activeStudentsCount: number;
}

export interface ICreateSectionBody {
  category: SectionsEnum;
  name: string;
  teachers: string[];
  students: string[];
}
