import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';

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

  async validate(payload: any) {
    const { id, name } = payload;
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id, name };
  }
}
