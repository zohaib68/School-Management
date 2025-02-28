import { IsOptional, Min, IsInt, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { SortEnum } from 'src/types';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsIn([SortEnum.ASC, SortEnum.DSC])
  sortOrder?: SortEnum = SortEnum.ASC;
}
