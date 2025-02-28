import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_AUTH_SECRET_KEY } from 'src/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersServcie: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? JWT_AUTH_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    try {
      const { data: foundUser } = await this.usersServcie.validateUserByCred({
        _id: payload?.sub,
      });

      if (foundUser?._id?.toString() !== payload?.sub)
        throw new UnauthorizedException();

      return { userId: payload.sub, username: payload.username };
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
