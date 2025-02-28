import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersProviders } from './users.provider';
import { GradesModule } from 'src/grades/grades.module';
import { SectionsModule } from 'src/sections/sections.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => GradesModule),
    forwardRef(() => SectionsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...UsersProviders],
  exports: [...UsersProviders, UsersService],
})
export class UsersModule {}
