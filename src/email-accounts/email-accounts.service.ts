import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateEmailAccountsDTO } from './dto/create-email-accounts.dto';
import { UpdateEmailAccountsDTO } from './dto/update-email-accounts.dto';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EmailAccount } from './interfaces/email-accounts.interfaces';
import { EmailAccounts } from './schemas/email-accounts.schemas';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class EmailAccountsService {
  constructor(
    @InjectModel(EmailAccounts.name)
    private readonly emailModel: Model<EmailAccount>,
    private servicesResponse: ServicesResponse,
  ) {}
  async create(
    createEmailAccountsDTO: CreateEmailAccountsDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    try {
      createEmailAccountsDTO.chapterId = ObjectId(jwtPayload.idChapter);
      const email = await this.emailModel.create(createEmailAccountsDTO);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: email,
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

  async findAll(res: Response, jwtPayload: JWTPayload) {
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.emailModel.find({
        chapterId: ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active,
      }),
    });
  }

  async findOne(id: string, res: Response) {
    const comment = await this.emailModel.findOne({
      _id: ObjectId(id),
    });

    if (!comment)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpException('EMAIL-ACCOUNT_NOT_FOUND.', HttpStatus.BAD_REQUEST),
        );

    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: comment,
    });
  }

  async update(
    id: string,
    updateEmailAccountsDTO: UpdateEmailAccountsDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    updateEmailAccountsDTO.chapterId = ObjectId(jwtPayload.idChapter);
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.emailModel.updateOne(
        {
          _id: ObjectId(id),
        },
        updateEmailAccountsDTO,
      ),
    });
  }
}
