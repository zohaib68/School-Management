import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SectionsProviders } from './sections.provider';
import { UsersModule } from 'src/users/users.module';
import { GradesModule } from 'src/grades/grades.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => UsersModule),
    forwardRef(() => GradesModule),
  ],
  controllers: [SectionsController],
  providers: [SectionsService, ...SectionsProviders],
  exports: [...SectionsProviders, SectionsService],
})
export class SectionsModule {}
