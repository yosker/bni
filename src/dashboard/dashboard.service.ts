/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'src/users/interfaces/users.interface';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { ServicesResponse } from 'src/responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import moment from 'moment';


const ObjectId = require('mongodb').ObjectId;


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
    private readonly servicesResponse: ServicesResponse,
  ) {}

  async getFullData(jwtPayload: JWTPayload, res: Response): Promise<Response> {
    try {
      const objResult = {
        totalNets: 0,
        totalVisitors: 0,
        totalCash: 0,
        totalAbsences: {},
        totalVisotorLastSixMonths: {},
      };

      objResult.totalNets = await this.totalNetworkers(jwtPayload);
      objResult.totalVisitors = await this.totalVistors(jwtPayload);
      objResult.totalAbsences = await this.totalNetsAbsences(jwtPayload);
      objResult.totalVisotorLastSixMonths =
        await this.totalVistorsLastSixMonths(jwtPayload);

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

  //ENDPOINT QUE REGRESA EL TOTAL DE NETWORKWERS ////////////////////////////////////////////////////////////////////////////////////////
  async totalNetworkers(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalNetsResult(jwtPayload.idChapter);
      const totalNets = await this.usersModel.aggregate(pipeline);
      return totalNets[0].totalNetworkers;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalNetsResult(chapterId: string) {
    try {
      return [
        {
          $match: {
            idChapter: ObjectId(chapterId),
            status: EstatusRegister.Active,
            role: { $ne: 'Visitante' },
          },
        },
        { $group: { _id: null, totalNetworkers: { $sum: 1 } } },
        { $project: { _id: 0 } },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //SE OBITENE EL TOTAL DE VISITANTES DE CADA SESION ////////////////////////////////////////////////////////////////////////////////////

  async totalVistors(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalVisitorsResult(
        jwtPayload.idChapter,
      );
      const totalvisitors = await this.usersModel.aggregate(pipeline);
      const totalVisitors =
        totalvisitors[0] == undefined ? 0 : totalvisitors[0].totalVisitors;
      return totalVisitors;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalVisitorsResult(chapterId: string) {
    try {
      return [
        {
          $match: {
            idChapter: ObjectId(chapterId),
            status: EstatusRegister.Active,
            role: { $eq: 'Visitante' },
            createdAt: {
              $gte: moment('2023-02-12T00:00:00.000-06:00'),
              $lte: moment('2023-02-12T23:59:59.999-06:00'),
            },
          },
        },
        { $group: { _id: null, totalVisitors: { $sum: 1 } } },
        { $project: { _id: 0 } },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //SE OBITENE EL TOTAL DE FALTAS DE NETWORKERS //////////////////////////////////////////////////////////////////////////////////////////

  async totalNetsAbsences(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalAbsencesResult(
        jwtPayload.idChapter,
      );
      const totalAbsences = await this.attendanceModel.aggregate(pipeline);
      return totalAbsences;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalAbsencesResult(chapterId: string) {
    try {
      return [
        {
          $lookup: {
            from: 'users',
            localField: 'userId', //arriba -> attendances
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $match: {
            'users.role': {
              $ne: 'Visitante',
            },
            chapterId: ObjectId(chapterId),
            attended: false,
            status: 'Active',
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            totalAbsences: { $sum: 1 },
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //SE OBITENE EL TOTAL DE VISITANTES DE LOS ULTIMOS 6 MESES//////////////////////////////////////////////////////////////////////////////

  async totalVistorsLastSixMonths(jwtPayload: JWTPayload) {
    try {
      const pipeline: any = await this.totalVisitorsLastSixMonthsResult(
        jwtPayload.idChapter,
      );
      const totalvisitorsLastSixMonths = await this.usersModel.aggregate(
        pipeline,
      );
      return totalvisitorsLastSixMonths;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalVisitorsLastSixMonthsResult(chapterId: string) {
    try {
      return [
        {
          $match: {
            role: {
              $eq: 'Visitante',
            },
            idChapter: ObjectId(chapterId),
            status: 'Active',
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            total: { $sum: 1 },
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
}
