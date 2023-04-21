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
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class TreasuryService {
  constructor(
    @InjectModel('Treasury') private readonly treasuryModel: Model<Treasury>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) { }

  //ENDPOINT PARA GUARDAR UNA APORTACIÓN
  async create(
    treasuryDTO: TreasuryDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      treasuryDTO.userId = ObjectId(treasuryDTO.userId);
      treasuryDTO.chapterId = ObjectId(jwtPayload.idChapter);
   
      //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS
      const findUser = await this.usersModel.findOne({
        _id: ObjectId(treasuryDTO.userId),
        idChapter: ObjectId(treasuryDTO.chapterId),
        status: EstatusRegister.Active,
      });
      if (!findUser) throw new HttpException('USER_NOT_FOUND.', 404);

      //VALIDAMOS QUE LA APORTACIÓN NO SE HAYA REALIZADO ANTERIORMENTE (USUARIO MES-AÑO)
      const findPayment = await this.treasuryModel.findOne({
        userId: ObjectId(treasuryDTO.userId),
        monthYear: treasuryDTO.monthYear,
        status: EstatusRegister.Active,
        chapterId: ObjectId(jwtPayload.idChapter)
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

          await this.sharedService.sendMailer(emailProperties);
        }
      } else {
        return res.status(200).json({
          statusCode: 409,
          message: 'RECORD_DUPLICATED',
          result: {},
        });
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
            status: EstatusRegister.Active,
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

  //ENDPOINT QUE REGRESA UN LISTADO GENERAL DE TODAS LAS APORTACIONES 
  async findAll(
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    try {

      const payments = await this.treasuryModel.aggregate([
        {
          $match: {
            chapterId: ObjectId(jwtPayload.idChapter),
            status: 'Active'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users',
          }
        },
        {
          $unwind: '$users'
        },
        {
          $project: {
            userId: '$users._id',
            name: { $concat: ["$users.name", " ", "$users.lastName"] },
            email: '$users.email',
            companyName: '$users.companyName',
            ammount: '$payment',
            monthYear: '$monthYear',
            paymentDate: '$createdAt',
          }
        },
        {
          $sort: { createdAt : -1 }    
        }
      ]);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: payments,
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

  //ENDPOINT PARA ELIMINAR (BAJA LOGICA) UN REGISTRO DE LA BASE DE DATOS (APORTACIONES)
  async deleteRow(
    id: string,
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      await this.treasuryModel.updateOne(
        {
          chapterId: ObjectId(jwtPayload.idChapter),
          _id: ObjectId(id),
        },
        {
          $set: { status: EstatusRegister.Deleted },
        },
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
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
}
