import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GradesModule } from './grades/grades.module';
import { SectionsModule } from './sections/sections.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, GradesModule, SectionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
