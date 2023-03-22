/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDTO } from './dto/attendance.dto';
import { ServicesResponse } from '../responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { ChapterSession } from 'src/chapter-sessions/interfaces/chapterSessions.interface';
import * as moment from 'moment';

const ObjectId = require('mongodb').ObjectId;
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { PaginateResult } from 'src/shared/pagination/pagination-result';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<any>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
    private readonly servicesResponse: ServicesResponse,
    private readonly paginateResult: PaginateResult,
  ) {}

  //ENDPOINT PARA ALMACENAR EL PASE DE LISTA DE LOS USUARIOS
  async create(
    attendanceDTO: AttendanceDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    try {
      attendanceDTO.userId = ObjectId(jwtPayload.id);
      //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS
      const existUser = await this.usersModel.findOne({
        _id: ObjectId(jwtPayload.id),
        idChapter: ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active,
      });

      if (!existUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('USER_NOT_FOUND.', HttpStatus.BAD_REQUEST));
      }
      attendanceDTO.chapterId = ObjectId(jwtPayload.idChapter);
      const currentDate = moment().format('DD-MM-YYYY');
      let authAttendance = false;

      //VALIDAMOS QUE LA SESION EXISTA EXISTA Y QUE ESTE ACTIVA
      const chapterSession = await this.chapterSessionModel.findOne({
        chapterId: ObjectId(attendanceDTO.chapterId),
        sessionDate: currentDate,
        status: EstatusRegister.Active,
      });
      if (chapterSession != null) {
        authAttendance = true;
      }

      if (authAttendance) {
        //VALIDAMOS QUE EL USUARIO NO SE REGISTRE DOS VECES EL MISMO DIA EN LA COLECCION DE ASISTENCIA
        const userSession = await this.attendanceModel.findOne({
          userId: ObjectId(jwtPayload.id),
          attendanceDate: currentDate,
          chapterId: ObjectId(attendanceDTO.chapterId),
          status: EstatusRegister.Active,
          attended: true,
        });

        if (userSession) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json(new HttpException('RECORD_DUPLICATED.', HttpStatus.CONFLICT));
        }

        attendanceDTO = {
          ...attendanceDTO,
          attendanceDate: currentDate,
          userId: ObjectId(attendanceDTO.userId),
          chapterId: ObjectId(attendanceDTO.chapterId),
          attended: true,
        };
        await this.attendanceModel.findOneAndUpdate(
          {
            userId: ObjectId(attendanceDTO.userId),
          },
          attendanceDTO,
        );

        const pipeline = await this.AttendanceResult(
          attendanceDTO.chapterId,
          currentDate,
          attendanceDTO.userId,
          1,
        );
        const userData = await this.attendanceModel.aggregate(pipeline);

        return res.status(HttpStatus.OK).json({
          statusCode: this.servicesResponse.statusCode,
          message: this.servicesResponse.message,
          result: userData[0],
        });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'ATTENDANCE_NOT_AUTHORIZED.',
              HttpStatus.UNAUTHORIZED,
            ),
          );
      }
    } catch (err) {
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

  //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE SE REGISTRARON EN LA SESION
  async VisitorsList(
    chapterId: string,
    sessionDate: string,
    res: Response,
  ): Promise<Response> {
    try {
      const currentDate = sessionDate.split('-');
      const newDate =
        currentDate[2] + '-' + currentDate[1] + '-' + currentDate[0];

      const visitorList = await this.usersModel.find(
        {
          idChapter: ObjectId(chapterId),
          role: 'Visitante',
          status: EstatusRegister.Active,
          createdAt: {
            $gte: moment(`${newDate}T00:00:00.000`),
            $lt: moment(`${newDate}T23:59:59.999`),
          },
        },
        {
          name: 1,
          lastName: 1,
          companyName: 1,
          profession: 1,
          invitedBy: 1,
          completedApplication: 1,
          completedInterview: 1,
        },
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: visitorList,
      });
    } catch (err) {
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

  //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE REGISTRARON ASISNTENCIA
  async NetworkersList(
    chapterId: string,
    sessionDate: string,
    res: Response,
  ): Promise<Response> {
    try {
      const pipeline = await this.AttendanceResult(
        ObjectId(chapterId),
        sessionDate,
        ObjectId(0),
        0,
      );
      console.log(JSON.stringify(pipeline));
      const userData = await this.attendanceModel.aggregate(pipeline);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: userData,
      });
    } catch (err) {
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

  //PIPELINE PARA REGRESAR LOS DATOS DEL USUARIO (NETWORKER) CUANDO SE REGISTRA
  private async AttendanceResult(
    chapterId: object,
    attendaceDate: string,
    userId: object,
    queryType: number,
  ) {
    try {
      const filter = {
        chapterId: ObjectId(chapterId),
        attendanceDate: attendaceDate,
      };
      if (queryType == 1) {
        filter['userId'] = ObjectId(userId);
      }

      return [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $unwind: '$userData',
        },
        {
          $project: {
            name: {
              $concat: ['$userData.name', ' ', '$userData.lastName'],
            },
            imageUrl: '$userData.imageURL',
            attendanceDate: '$attendanceDate',
            createdAt: '$createdAt',
            attendanceHour: {
              $concat: [
                {
                  $toString: {
                    $hour: { date: '$createdAt', timezone: '+1800' },
                  },
                },
                ':',
                { $toString: { $minute: '$createdAt' } },
              ],
            },
            companyName: '$userData.companyName',
            profession: '$userData.profession',
          },
        },
      ];
    } catch (error) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  async getNoAttendances(
    attendaceDate: string,
    res: Response,
    jwtPayload: JWTPayload,
    skip = 0,
    limit?: number,
  ) {
    try {
      const pipeline: any = await this.noAttendanceResult(
        jwtPayload.idChapter,
        attendaceDate,
        attendaceDate,
        skip,
        limit,
      );

      const noAttendances = await this.attendanceModel.aggregate(pipeline);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: await this.paginateResult.getResult(noAttendances),
        total: await this.paginateResult.getTotalResults(noAttendances),
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

  private async noAttendanceResult(
    chapterId: string,
    lteAttendaceDate: string,
    gteAttendaceDate: string,
    skip: number,
    limit: number,
  ) {
    const lte = moment(lteAttendaceDate).add(24, 'h').toISOString();
    const gte = moment(gteAttendaceDate).add(-6, 'M').toISOString();
    const filter = {
      chapterId: ObjectId(chapterId),
      createdAt: {
        $lte: new Date(lte),
        $gte: new Date(gte),
      },
      attended: false,
    };

    return [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'usersData',
        },
      },
      {
        $unwind: '$usersData',
      },
      {
        $match: {
          'usersData.role': {
            $nin: ['Visitante'],
          },
        },
      },
      {
        $project: {
          _id: '$usersData._id',
          attendanceDate: '$attendanceDate',
          attended: '$attended',
          name: '$usersData.name',
          lastName: '$usersData.lastName',
          companyName: '$usersData.companyName',
          role: '$usersData.role',
        },
      },
      {
        $sort: {
          attendanceDate: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $skip: skip > 0 ? (skip - 1) * limit : 0,
            },
            { $limit: limit },
          ],
        },
      },
    ];
  }
}
