import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ILoginResponseInfo,
  IResponseInfo,
  TMongooseObjectIdType,
} from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string },
  ): Promise<IResponseInfo<ILoginResponseInfo>> {
    const { data: user } = await this.authService.validateUser(
      username,
      password,
    );

    if (user?._id && user?.userName) {
      const userId = user._id as TMongooseObjectIdType;

      return {
        message: 'Successfully logged in',
        data: {
          accessToken: await this.authService.generateToken({
            sub: userId.toString(),
            username: user.userName,
          }),
          user,
        },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
