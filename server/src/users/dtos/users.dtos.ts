import {
  IsOptional,
  IsString,
  IsIn,
  ArrayMinSize,
  IsNumber,
  IsArray,
} from 'class-validator';

import {
  UserRoleEnum,
  UserRoleEnumForCreation,
  UserStatusEnum,
} from 'src/types';
import { PaginationQueryDto } from 'src/commonDtos/dtos.common';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  @IsIn([...Object.keys(UserRoleEnumForCreation)])
  role: UserRoleEnumForCreation;

  @IsString()
  dateOfEnrollMent: string;

  @IsOptional()
  @IsString()
  dateOfLeave?: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsIn([...Object.keys(UserStatusEnum).map((status) => status)])
  status: UserStatusEnum;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  gradeIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  sectionIds?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  role: UserRoleEnum;

  @IsOptional()
  @IsString()
  dateOfEnrollMent: string;

  @IsOptional()
  @IsString()
  dateOfLeave?: string;

  @IsOptional()
  @IsString()
  gradeId?: string;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  @IsIn([...Object.keys(UserStatusEnum).map((status) => status)])
  status: UserStatusEnum;
}

export class UpdateUserStatusDto {
  @IsString()
  @IsIn([...Object.keys(UserStatusEnum).map((status) => status)])
  status: UserStatusEnum;
}

export class ValidateUserEmailDto {
  @IsOptional()
  @IsString()
  email: string;
}

export class UserPaginationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn([...Object.keys(UserRoleEnum).map((role) => role)])
  role?: UserRoleEnum;

  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsString()
  gradeId?: string;
}
