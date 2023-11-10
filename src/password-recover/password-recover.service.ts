/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class PasswordRecoverService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
    @InjectModel('Chapters')
    private readonly chapterModel: Model<Chapter>,
  ) {}

  async getNewPassword(obj: any, res: Response): Promise<Response> {
    try {
      const user = await this.usersModel.findOne({
        email: obj.email,
      });
      if (user) {
        //GENERAMOS UNA NUEVA CONTRASEÑA TEMPORAL
        const password = await this.sharedService.passwordGenerator(6);
        const plainToHash = await hash(password, 10);

        await this.usersModel.updateOne(
          { email:  obj.email },
          { resetPassword: false, password: plainToHash },
        );
        //ENVIO DE CORREO CON CONPROBANTE DE APORTACIÓN
        const emailProperties = {
          email:  obj.email,
          from: 'net_session_manager@outlook.com',
          name: '',
          template: 'temporalPassword',
          subject: 'Contraseña Temporal',
          urlPlatform: '',
          amount: '',
          password: password,
        };
        console.log('password...', password);
        await this.sharedService.sendEmail(emailProperties);
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: 204,
          message: 'USUARIO NO ENCONTRADO',
          result: {},
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (err) {
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

  async updatePassword(
    newPass: any,
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    try {
      const plainToHash = await hash(newPass.password, 10);

      await this.usersModel.updateOne(
        { _id: ObjectId(jwtPayload.id) },
        { resetPassword: true, password: plainToHash.toString() },
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (err) {
      console.log('errrr...', err);
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
