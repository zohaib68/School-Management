import {
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GradesEnum } from 'src/types';
import {
  CreateSectionDto,
  UpdateSectionDto,
  UpdateSectionUsersDto,
} from 'src/sections/dtos/sections.dtos';
import { PaginationQueryDto } from 'src/commonDtos/dtos.common';

export class GradesPaginationQueryDto extends PaginationQueryDto {}

export class GradesCreationDto {
  @IsString()
  name: string;

  @IsEnum(GradesEnum)
  @IsIn([...Object.values(GradesEnum)])
  grade: GradesEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections: CreateSectionDto[];
}

export class UpdateSectionFromGradeDto extends UpdateSectionDto {
  @IsString()
  sectionId: string;
}

export class UpdateGradeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gradeId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSectionFromGradeDto)
  sections: UpdateSectionFromGradeDto[];
}

export class UpdateGradeBulkDto extends UpdateSectionUsersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  gradeId?: string;
}
