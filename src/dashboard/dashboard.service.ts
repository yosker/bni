/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'src/users/interfaces/users.interface';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { Treasury } from 'src/treasury/interfaces/treasury.interfaces';
import { Charges } from 'src/charges/interfaces/charges.interfaces';
import { MembershipActivity } from 'src/membership-activities/interfaces/membership-activity.interfaces';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { ServicesResponse } from 'src/responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { MembershipActivities } from 'src/membership-activities/schemas/membership-activity.schema';

const ObjectId = require('mongodb').ObjectId;
const moment = require('moment-timezone');

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
    private readonly servicesResponse: ServicesResponse,
    @InjectModel('Treasury')
    private readonly treasuryModel: Model<Treasury>,
    @InjectModel('Charges')
    private readonly chargesModel: Model<Charges>,

    @InjectModel(MembershipActivities.name)
    private readonly membershipActivityModel: Model<MembershipActivity>,
  ) {}

  async getFullData(jwtPayload: JWTPayload, res: Response): Promise<Response> {
    try {
      const objResult = {
        totalNets: 0,
        totalVisitors: 0,
        totalCash: 0,
        totalAbsences: {},
        totalVisotorLastSixMonths: {},
        totalPendingActivities: [],
      };

      objResult.totalNets = await this.totalNetworkers(jwtPayload);
      objResult.totalVisitors = await this.totalVistors(jwtPayload);
      objResult.totalCash = await this.totalCash(jwtPayload);
      objResult.totalAbsences = await this.totalNetsAbsences(jwtPayload);
      objResult.totalVisotorLastSixMonths =
        await this.totalVistorsLastSixMonths(jwtPayload);
      objResult.totalPendingActivities = await this.totalPendingActivities(
        jwtPayload.idChapter,
      );

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
          }
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
      const gte = moment().add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment().format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        role: {
          $eq: 'Visitante',
        },
        idChapter: ObjectId(chapterId),
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
      const totalAbsences = await this.attendanceModel.aggregate(pipeline).sort({_id:-1});
      return totalAbsences;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalAbsencesResult(chapterId: string) {
    try {
      const gte = moment().add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment().format('YYYY-MM-DD') + 'T23:59:59.999';

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
            status: EstatusRegister.Active,
            attendanceDateTime: {
              $gte: moment(gte).toISOString(),
              $lt: moment(lte).toISOString(),
            },
          },
        },
        {
          $group: {
              _id: {
                  $month: { date: { $toDate: "$attendanceDateTime" } },
              },
              totalAbsences: { $sum: 1 }
          }
      }
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
      const gte = moment().add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment().format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        role: {
          $eq: 'Visitante',
        },
        idChapter: ObjectId(chapterId),
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
              _id: {
                  $month: { date: { $toDate: "$createdAt" } },
              },
              total: { $sum: 1 }
          }
      }
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //OBTENEMOS EL TOTAL DE INGRESOS DEL CAPITULO DE LOS ULTIMOS 6 MESES////////////////////////////////////////////////////////////////////

  async totalCash(jwtPayload: JWTPayload) {
    try {
      const pipelineIncome = await this.totalIncomeResult(jwtPayload.idChapter);
      const pipelineCharges = await this.totalChargesResult(
        jwtPayload.idChapter,
      );

      const objIncome = await this.treasuryModel.aggregate(pipelineIncome);
      const objCharge = await this.chargesModel.aggregate(pipelineCharges);

      let totalCash = 0;
      let totalIncome = 0; 
      let totalAmount = 0;

      totalIncome = objIncome.length > 0 ? objIncome[0].totalAmount : 0; 
      totalAmount = objCharge.length > 0 ? objCharge[0].totalAmount : 0;
      totalCash = totalIncome - totalAmount;

      return totalCash;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalIncomeResult(chapterId: string) {
    try {
      const now = moment().toISOString();
      const gte =
        moment(now).add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment(now).format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        chapterId: ObjectId(chapterId),
        status: EstatusRegister.Active,
        // createdAt: {
        //   $gte: moment(gte).toISOString(),
        //   $lt: moment(lte).toISOString(),
        // },
      };
      return [
        {
          $match: filter,
        },
        {
          $group: {
            _id: 1,
            totalAmount: { $sum: '$payment' },
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  private async totalChargesResult(chapterId: string) {
    try {
      const now = moment().toISOString();
      const gte =
        moment(now).add(-6, 'M').format('YYYY-MM-DD') + 'T00:00:00.000';
      const lte = moment(now).format('YYYY-MM-DD') + 'T23:59:59.999';

      const filter = {
        chapterId: ObjectId(chapterId),
        status: EstatusRegister.Active,
        // createdAt: {
        //   $gte: moment(gte).toISOString(),
        //   $lt: moment(lte).toISOString(),
        // },
      };
      return [
        {
          $match: filter,
        },
        {
          $group: {
            _id: 1,
            totalAmount: { $sum: '$amount' },
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //OBTENEMOS LAS ACTIVIDADES PENDIENTES
  async totalPendingActivities(chapterId: string) {
    try {
      const objList = await this.membershipActivityModel.find({
        chapterId: ObjectId(chapterId),
        status: EstatusRegister.Active,
        statusActivity: 'Pending',
      });
      return objList;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
}
