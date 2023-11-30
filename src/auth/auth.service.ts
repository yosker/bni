import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { ServicesResponse } from '../responses/response';
import { Response } from 'express';
import * as moment from 'moment-timezone';
import { IpService } from 'src/shared/utils/ip/ip.service';
import { Logs } from 'src/logs/schemas/logs.schema';
import { Log } from 'src/logs/interfaces/logs.interface';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel(Logs.name) private readonly logModel: Model<Log>,
    private jwtService: JwtService,
    private readonly servicesResponse: ServicesResponse,
    private readonly ipService: IpService,
  ) {}

  /**
   * @description Registro de nuevo usuario
   * @param registerAuthDto
   * @returns User
   */
  async register(
    registerAuthDto: RegisterAuthDto,
    res: Response,
  ): Promise<Response> {
    try {
      const { password, idChapter } = registerAuthDto;
      const plainToHash = await hash(password, 10);

      registerAuthDto = {
        ...registerAuthDto,
        password: plainToHash,
        idChapter: ObjectId(idChapter),
      };
      const findUser = await this.usersModel.create(registerAuthDto);
      const payload = {
        id: findUser._id,
        name: registerAuthDto.name,
        role: registerAuthDto.role,
        email: registerAuthDto.email,
      };
      const token = this.jwtService.sign(payload);
      const data = {
        user: findUser,
        token,
      };

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: data,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(
            'INTERNAL_SERVER_ERROR.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  /**
   * @description Login de usuario
   * @param loginAuthDto
   * @returns user-token
   */
  async login(
    loginAuthDto: LoginAuthDto,
    res: Response,
    ip: string,
  ): Promise<Response> {
    const { email, password } = loginAuthDto;

    try {
      await this.logModel.create({
        message: `ip:::: ${ip}`,
        stackTrace: `loginAuthDto:::: ${JSON.stringify(loginAuthDto)}`,
        createdAt: new Date().toISOString(),
      });
      const timeZone = await this.ipService.getTimeZone(ip);
      const findUser = await this.usersModel.findOne(
        { email },
        {
          _id: 1,
          idChapter: 1,
          name: 1,
          lastName: 1,
          imageURL: 1,
          role: 1,
          password: 1,
          resetPassword: 1,
        },
      );
      if (!findUser)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('USER_NOT_FOUND.', HttpStatus.NOT_FOUND));

      const checkPassword = await compare(password, findUser.password);
      if (!checkPassword)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException('PASSWORD_INCORRECT.', HttpStatus.BAD_REQUEST),
          );

      const payload = {
        idChapter: findUser.idChapter,
        id: findUser._id,
        name: findUser.name + ' ' + findUser.lastName,
        role: findUser.role,
        email,
        language: 'esMX',
        localTime: moment().toISOString(),
        timeZone,
      };

      const token = this.jwtService.sign(payload);
      const data = {
        user: findUser,
        token,
      };
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: data,
      });
    } catch (err) {
      await this.logModel.create({
        message: err.message,
        stackTrace: err.stack,
        createdAt: new Date().toISOString(),
      });
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(
            'INTERNAL_SERVER_ERROR.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
