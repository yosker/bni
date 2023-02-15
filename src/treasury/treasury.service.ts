import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { Treasury } from 'src/treasury/interfaces/treasury.interfaces';
import { TreasuryDTO } from 'src/treasury/dto/treasury.dto';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class TreasuryService {
  constructor(
    @InjectModel('Treasury') private readonly treasuryModel: Model<Treasury>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) {}

  //ENDPOINT PARA GUARDAR UNA APORTACIÓN
  async create(
    treasuryDTO: TreasuryDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      treasuryDTO.userId = ObjectId(jwtPayload.id);
      treasuryDTO.chapterId = ObjectId(jwtPayload.idChapter);
      //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS
      const findUser = await this.usersModel.findOne({
        _id: ObjectId(treasuryDTO.userId),
        idChapter: ObjectId(treasuryDTO.chapterId),
        status: 'Active',
      });
      if (!findUser) throw new HttpException('USER_NOT_FOUND.', 404);

      //VALIDAMOS QUE LA APORTACIÓN NO SE HAYA REALIZADO ANTERIORMENTE (USUARIO MES-AÑO)
      const findPayment = await this.treasuryModel.findOne({
        userId: ObjectId(treasuryDTO.userId),
        monthYear: treasuryDTO.monthYear,
        status: 'Active',
      });

      if (findPayment == null) {
        treasuryDTO = {
          ...treasuryDTO,
          chapterId: ObjectId(treasuryDTO.chapterId),
          userId: ObjectId(treasuryDTO.userId),
        };
        const paymentCreated = await this.treasuryModel.create(treasuryDTO);

        if (paymentCreated != null) {
          //ENVIO DE CORREO CON CONPROBANTE DE APORTACIÓN
          const emailProperties = {
            email: findUser.email,
            name: findUser.name + ' ' + findUser.lastName,
            template: process.env.RECEIPT_TEMPLATE,
            subject: process.env.SUBJECT_RECEIPT,
            urlPlatform: '',
            amount:
              treasuryDTO.payment.toString() +
              ' pesos de ' +
              treasuryDTO.monthYear,
            password: '',
          };

          await this.sharedService.sendEmail(emailProperties);
        }
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('PAYMENT_FOUND.', HttpStatus.NOT_FOUND));
      }
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
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

  //ENDPOINT QUE REGRESA EL LISTADO DE APORTACIONES POR USUARIO
  async userPaymentList(id: string, res: Response): Promise<Response> {
    try {
      const paymentList = await this.treasuryModel
        .find(
          {
            userId: ObjectId(id),
            status: 'Active',
          },
          {
            _id: 0,
            payment: 1,
            monthYear: 1,
            paymentDate: 1,
          },
        )
        .sort({ createdAt: 1 });
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: paymentList,
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
}
