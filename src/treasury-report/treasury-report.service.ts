/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { ServicesResponse } from 'src/responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { Treasury } from 'src/treasury/interfaces/treasury.interfaces';
import { Charges } from 'src/charges/interfaces/charges.interfaces';

const moment = require('moment-timezone');
const ObjectId = require('mongodb').ObjectId;
 
@Injectable()
export class TreasuryReportService {
  constructor(
    @InjectModel('Charges')
    private readonly chargesModel: Model<Charges>,
    @InjectModel('Treasury')
    private readonly treasuryModel: Model<Treasury>,
    private readonly servicesResponse: ServicesResponse,
  ) {}

  async getFullData(jwtPayload: JWTPayload, res: Response): Promise<Response> {
    try {
      let objResult = {
        totalIncomeGraph: {},
        totalChargesGraph: {},
      };

      objResult.totalIncomeGraph = await this.totaIncome(jwtPayload);
      objResult.totalChargesGraph = await this.totalCharges(jwtPayload);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: objResult,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  //ENDPOINT QUE REGRESA EL TOTAL DE INGRESOS ////////////////////////////////////////////////////////////////////////////////////////
  async totaIncome(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalIncomeResult(jwtPayload.idChapter);
      const totalIncomes = await this.treasuryModel.aggregate(pipeline);
      return totalIncomes;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalIncomeResult(chapterId: string) {
    try {
      const gte = moment().add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment().format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        chapterId: ObjectId(chapterId),
        status: EstatusRegister.Active,
        createdAt: {
          $gte: moment(gte).toISOString(),
          $lt: moment(lte).toISOString(),
        },
      };
      return [
        {
          $match: filter,
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            totalAmount: { $sum: '$payment' },
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //ENDPOINT QUE REGRESA EL TOTAL DE EGRESOS ////////////////////////////////////////////////////////////////////////////////////////
  async totalCharges(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalChargesResult(jwtPayload.idChapter);
      const totalCharges = await this.chargesModel.aggregate(pipeline);
      return totalCharges;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  async totalChargesResult(chapterId: string) {
    try {
      const gte = moment().add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment().format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        chapterId: ObjectId(chapterId),
        status: EstatusRegister.Active,
        createdAt: {
          $gte: moment(gte).toISOString(),
          $lt: moment(lte).toISOString(),
        },
      };
      return [
        {
          $match: filter,
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            totalAmount: { $sum: '$amount' },
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
}
