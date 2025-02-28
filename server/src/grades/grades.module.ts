import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { GradessProviders } from './grades.provider';
import { SectionsModule } from 'src/sections/sections.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => SectionsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [GradesController],
  providers: [GradesService, ...GradessProviders],
  exports: [GradesService, ...GradessProviders],
})
export class GradesModule {}
