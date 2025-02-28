import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as mongoose from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    mongoose.connection.on('connected', () =>
      console.log('DB is connected Ok'),
    );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
