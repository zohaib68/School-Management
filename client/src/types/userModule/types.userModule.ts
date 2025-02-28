export enum UserRoleEnum {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  HEAD = "HEAD",
}

export enum UserRoleEnumForCreation {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}
export enum UserStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  role: UserRoleEnum;
  grade?: string;
  dateOfEnrollMent: string;
  userName?: string;
  password?: string;
  dateOfLeave?: string;
  status: UserStatusEnum;
  email?: string;
  sectionIds?: string[];
  gradeIds?: string[];
}
