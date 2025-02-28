import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { IGetallGradesResponse } from './interfaces/grades.interfaces';
import {
  GradesCreationDto,
  GradesPaginationQueryDto,
  UpdateGradeDto,
} from './dtos/grades.dtos';
import { AuthGuard } from '@nestjs/passport';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createGrade(@Body() body: GradesCreationDto) {
    return await this.gradesService.createGrade(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateGrade(
    @Body() body: UpdateGradeDto,
    @Param('id') gradeId: string,
  ) {
    return await this.gradesService.updateGrade(gradeId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteGrade(@Param('id') gradeId: string) {
    return await this.gradesService.deleteGrade(gradeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllGrades(
    @Query() queryParams: GradesPaginationQueryDto,
  ): IGetallGradesResponse {
    return await this.gradesService.getAllGrades(queryParams);
  }
}
