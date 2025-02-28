import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UserPaginationQueryDto,
  ValidateUserEmailDto,
} from './dtos/users.dtos';
import {
  IGetallUsersResponse,
  TGetUsersByGradeOrSectionIdsResponse,
  UserSchema,
} from './interfaces/users.interfaces';
import { IResponseInfo } from 'src/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('scopes/:id')
  async getUserScopes(
    @Param('id') userId: string,
  ): TGetUsersByGradeOrSectionIdsResponse {
    return await this.usersService.getUserScopes(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers(
    @Query() queryParams: UserPaginationQueryDto,
  ): IGetallUsersResponse {
    return await this.usersService.getAllUsers(queryParams);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    return await this.usersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param('id') userId: string,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    return await this.usersService.updateUser(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteUser(
    @Param('id') userId: string,
  ): Promise<IResponseInfo<undefined>> {
    return await this.usersService.deleteUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/toggle-status')
  async toggleUserStatus(
    @Body() body: UpdateUserStatusDto,
    @Param('id') userId: string,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    console.log({ body, userId }, 'whatareparamss');
    return await this.usersService.toggleUserStatus(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('validate-email')
  async checkValidEmail(
    @Body() body: ValidateUserEmailDto,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    return await this.usersService.validateUserByCred({ email: body.email });
  }
}
