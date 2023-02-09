import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { Treasury } from 'src/treasury/interfaces/treasury.interfaces';
import { TreasuryDTO } from 'src/treasury/dto/treasury.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { EmailProperties } from 'src/shared/emailProperties';
import { SharedService } from 'src/shared/shared.service';

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
  async create(treasuryDTO: TreasuryDTO): Promise<ServicesResponse> {
    let { statusCode, message, result } = this.servicesResponse;

    try {
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
          const emailProperties: EmailProperties = {
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
        return { statusCode: 200, message: 'PAYMENT_FOUND', result };
      }
      return { statusCode, message, result };
    } catch (err) {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  //ENDPOINT QUE REGRESA EL LISTADO DE APORTACIONES POR USUARIO
  async userPaymentList(id: string): Promise<ServicesResponse> {
    let { message } = this.servicesResponse;

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
      return { statusCode: 200, message, result: paymentList };
    } catch (err) {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }
}
