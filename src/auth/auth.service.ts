import { HttpException, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
    const { password, idChapter } = registerAuthDto;
    const plainToHash = await hash(password, 10);
    registerAuthDto = {
      ...registerAuthDto,
      password: plainToHash,
      idChapter: ObjectId(idChapter),
    };
    return await this.usersModel.create(registerAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const findUser = await this.usersModel.findOne({ email });

    if (!findUser) throw new HttpException('USER_NOT_FOUND.', 404);

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new HttpException('PASSWORD_INCORRECT', 403);

    const payload = { id: findUser._id, name: findUser.name };
    const token = this.jwtService.sign(payload);
    const data = {
      user: findUser,
      token,
    };

    return data;
  }
}
