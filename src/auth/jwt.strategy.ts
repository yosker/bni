import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';
import { JWTPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * @description Se obtiene la información del token recibido
   * @param payload
   * @returns
   */
  async validate(payload: JWTPayload) {
    const user = await this.usersModel.findById(payload.id);
    if (!user?._id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
