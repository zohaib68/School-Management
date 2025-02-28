import {
  IsEnum,
  IsArray,
  IsString,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { SectionsEnum } from 'src/types';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/commonDtos/dtos.common';

export class CreateSectionDto {
  @IsEnum(SectionsEnum)
  category: SectionsEnum;

  @IsOptional()
  @IsString()
  gradeId: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  teachers: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  students: string[];
}

export class UpdateUsersInSectionDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  usersToAdd?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  usersToRemove: string[];
}

export class UpdateSectionUsersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUsersInSectionDto)
  teachers: UpdateUsersInSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUsersInSectionDto)
  students: UpdateUsersInSectionDto;
}

export class UpdateSectionDto extends UpdateSectionUsersDto {
  @IsOptional()
  @IsString()
  name?: string;
}

export class SectionPaginationQueryDto extends PaginationQueryDto {}

export class GetSectionQueryDto {
  @IsOptional()
  @IsString()
  sectionId?: string;

  @IsOptional()
  @IsString()
  gradeId?: string;
}
