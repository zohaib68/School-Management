import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IResponseInfo } from 'src/types';
import { UserSchema } from 'src/users/interfaces/users.interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateToken(payload: {
    sub: string;
    username: string;
  }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(
    userName: string,
    password: string,
  ): Promise<IResponseInfo<UserSchema | undefined>> {
    try {
      const { data: foundUser } = await this.usersService.validateUserByCred({
        userName,
        password,
      });

      if (foundUser) {
        return {
          message: 'User found',
          data: foundUser,
        };
      }
      return { message: 'No user found against given credentials' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
