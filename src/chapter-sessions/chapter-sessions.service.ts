import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { ChapterSessionDTO } from './dto/chapterSessions.dto';
import { ChapterSession } from './interfaces/chapterSessions.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { AttendanceType } from 'src/shared/enums/attendance.enum';
import { JWTPayload } from 'src/auth/jwt.payload';

const moment = require('moment-timezone');
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ChapterSessionsService {
  constructor(
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
    private servicesResponse: ServicesResponse,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
  ) {}

  //ENDPOINT PARA LA CREACION MANUAL DE SESIONES POR CAPITULO
  async create(
    chapterSessionDTO: ChapterSessionDTO,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      const dateSplit = chapterSessionDTO.sessionDate.split('-');
      chapterSessionDTO.sessionDate =
        dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
      const findSession = await this.chapterSessionModel.findOne({
        chapterId: ObjectId(chapterSessionDTO.chapterId),
        sessionDate: chapterSessionDTO.sessionDate,
        status: EstatusRegister.Active,
      });

      chapterSessionDTO = {
        ...chapterSessionDTO,
        chapterId: ObjectId(chapterSessionDTO.chapterId),
      };

      if (findSession == null) {
        const dateString = chapterSessionDTO.sessionDate;
        const dateObject = moment(dateString);

        // TODO: Se agregan 6 horas por la zona horaria MX, revisar en caso de cambiar de país
        chapterSessionDTO.sessionChapterDate = moment(dateObject)
          .add(6, 'h')
          .toISOString();

        const chapterSession = await this.chapterSessionModel.create(
          chapterSessionDTO,
        );

        if (chapterSession) {
          const usersChapter = await this.usersModel.find({
            idChapter: ObjectId(chapterSessionDTO.chapterId),
            role: {
              $ne: 'Visitantes',
            },
          });

          usersChapter.forEach(async (user) => {
            const attendance: any = {
              chapterId: ObjectId(user.idChapter),
              chapterSessionId: Object(chapterSession._id),
              userId: ObjectId(user._id),
              attended: false,
              attendanceType: AttendanceType.OnSite,
              attendanceDate: chapterSessionDTO.sessionDate,
              attendanceDateTime: moment(
                chapterSessionDTO.sessionDate,
              ).toISOString(),
              createdAt: moment().toISOString(),
            };
            await this.attendanceModel.create(attendance);
          });
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

  //ENDPOINT QUE REGRESA UNA LISTA DE FECHAS DE SESION POR CAPITULO
  async sessionList(
    chapterId: string,
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    try {
      const currentDate = moment().format('DD-MM-YYYY');

      let filter = {};
      if (chapterId != '0') {
        //DESDE EL BO SE ENVIAR CERO PARA QUE REGRESE TODAS LAS SESIONES
        filter = {
          chapterId: ObjectId(chapterId),
          status: EstatusRegister.Active,
          sessionDate: {
            $lte: currentDate,
          },
        };
      } else {
        filter = {
          chapterId: ObjectId(jwtPayload.idChapter),
          status: EstatusRegister.Active,
        };
      }

      const chapterSessionList = await this.chapterSessionModel
        .find(filter, {
          _id: 0,
          sessionDate: 1,
        })
        .sort({ sessionChapterDate: -1 });
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: chapterSessionList,
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

  //ENDPOINT PARA ELIMINAR (BAJA LOGICA) UN REGISTRO DE LA BASE DE DATOS (SESIONES DEL CAPITULO)
  async deleteDate(
    sessionDate: string,
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;

    try {
      const session = await this.chapterSessionModel.findOne({
        chapterId: ObjectId(jwtPayload.idChapter),
        sessionDate: sessionDate.toString(),
      });
      await this.chapterSessionModel.updateOne(
        {
          chapterId: ObjectId(jwtPayload.idChapter),
          sessionDate: sessionDate.toString(),
        },
        {
          $set: { status: EstatusRegister.Deleted },
        },
      );

      await this.attendanceModel.updateMany(
        { chapterSessionId: ObjectId(session._id) },
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
