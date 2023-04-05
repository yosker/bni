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
import { SharedService } from 'src/shared/shared.service';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class EmailAccountsService {
  constructor(
    @InjectModel(EmailAccounts.name)
    private readonly emailAccount: Model<EmailAccount>,
    private servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) {}
  async create(
    createEmailAccountsDTO: CreateEmailAccountsDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    try {
      createEmailAccountsDTO.chapterId = ObjectId(jwtPayload.idChapter);
      const email = await this.emailAccount.create(createEmailAccountsDTO);
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

  async findAll(res: Response, page: string, jwtPayload: JWTPayload) {
    try {
      const accessGranted = await this.sharedService.validatePermissions(
        page,
        jwtPayload.role,
      );

      let { statusCode, message } = this.servicesResponse;
      let result = {};

      if (accessGranted) {
        result = await this.emailAccount.find({
          chapterId: ObjectId(jwtPayload.idChapter),
          status: EstatusRegister.Active,
        });
      } else {
        statusCode = 427;
        message = 'noPermission';
      }

      return res.status(HttpStatus.OK).json({
        statusCode: statusCode,
        message: message,
        result: result,
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

  async findOne(id: string, res: Response) {
    const comment = await this.emailAccount.findOne({
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
      result: await this.emailAccount.updateOne(
        {
          _id: ObjectId(id),
        },
        updateEmailAccountsDTO,
      ),
    });
  }

  async delete(id: string, res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.emailAccount.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          status: EstatusRegister.Deleted,
        },
      ),
    });
  }
}
