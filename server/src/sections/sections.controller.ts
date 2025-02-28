import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import {
  CreateSectionDto,
  GetSectionQueryDto,
  UpdateSectionDto,
} from './dtos/sections.dtos';
import { IResponseInfo } from 'src/types';
import { SectionSchema } from './interafces/sections.interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSection(
    @Query() queryParameters: GetSectionQueryDto,
  ): Promise<IResponseInfo<SectionSchema | SectionSchema[] | undefined>> {
    const { gradeId, sectionId } = queryParameters;

    return await this.sectionsService.findSectionByCreds(
      {
        gradeId,
        _id: sectionId,
      },
      !!gradeId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSection(
    @Body() body: CreateSectionDto,
  ): Promise<IResponseInfo<undefined | SectionSchema>> {
    return await this.sectionsService.createSections(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':sectionId/:gradeId')
  async updateSection(
    @Body() body: UpdateSectionDto,
    @Param('sectionId') sectionId: string,
    @Param('gradeId') gradeId: string,
  ) {
    return await this.sectionsService.updateSection(body, sectionId, gradeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':sectionId/:gradeId')
  async delteSection(
    @Param('sectionId') sectionId: string,
    @Param('gradeId') gradeId: string,
  ) {
    return await this.sectionsService.deleteSection({
      sectionId,
      gradeId,
      updateGrade: true,
      deleteMethod: 'SINGLETON',
    });
  }
}
