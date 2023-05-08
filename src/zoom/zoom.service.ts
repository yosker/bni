import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { Response } from 'express';
import { ServicesResponse } from 'src/responses/response';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { JWTPayload } from 'src/auth/jwt.payload';

const moment = require('moment-timezone');
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ZoomService {
  constructor(
    private httpService: HttpService,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    private servicesResponse: ServicesResponse,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
  ) {}

  /**
   * @description Obtiene la Asistencia de los Usuarios del Meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async getUsersByMeetingId(createZoomDto: CreateZoomDto, res: Response) {
    try {
      const meeting = await this.getDataMeeting(
        createZoomDto.meetingId,
        createZoomDto.tokenChapter,
      ).catch(console.error);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Actualiza Asistencia de los Usuarios que Ingresaron al Meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async setUsersByMeetingId(
    jwtPayload: JWTPayload,
    res: Response,
    filters: any,
  ) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      const meeting: any = await this.getDataMeeting(
        chapter.meetingId,
        chapter.tokenChapter,
      ).catch((error) => {
        throw new HttpException(error.message, error.status, error);
      });

      if (!meeting || !meeting.length) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'No se encuentra la sesión enviada.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      for (const element of meeting.registrants) {
        const registrant = element;
        //Buscamos al usuario por su email
        const user = await this.usersModel.findOne({
          email: registrant.email,
          idChapter: ObjectId(filters.chapterId),
        });

        const leaveTime = moment
          .utc(registrant.create_time)
          .tz(jwtPayload.timeZone)
          .toISOString();

        if (!user) {
          //Si no se Encuentra el Usuario, se Crea como Visitante
          const userVisitor = {
            idChapter: ObjectId(filters.chapterId),
            email: registrant.email,
            name: registrant.first_name,
            role: 'Visitante',
            lastName: registrant.last_name,
            phoneNumber: registrant.phone,
            companyName: registrant.company,
            profession: registrant.profession,
            invitedBy: registrant.invitedBy,
            updatedAt: leaveTime,
          };
          await this.usersModel.create(userVisitor);
        } else {
          if (user.role.toLowerCase() !== 'visitante') {
            //De lo contrario se le pasa asistencia
            const dateAttendance = moment().format('YYYY-MM-DD');

            await this.attendanceModel.findOneAndUpdate(
              {
                userId: ObjectId(user._id),
                chapterId: ObjectId(filters.chapterId),
                attendanceDate: dateAttendance,
              },
              {
                attended: true,
                updatedAt: leaveTime,
              },
            );
          }
        }
      }

      const sessionData = await this.getAttendanceUsersByDate(
        chapter.sessionDate,
        filters.chapterId,
        jwtPayload.timeZone,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: sessionData,
      });
    } catch (error) {
      throw res.json(
        new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }

  /**
   * @description Obtiene el Token del Capítulo
   * @param chapterId Id de Capítulo
   * @param res token del Capítulo
   * @returns token
   */
  async findOne(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: chapter.tokenChapter,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Actualiza Token del Capítulo
   * @param id Id del Capítulo
   * @param updateZoomDto Objeto de Actualización
   * @param res respuesta
   * @returns respuesta
   */
  async updateTokenChapter(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId.toString(),
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      await this.chapterModel.findByIdAndUpdate(ObjectId(filters.chapterId), {
        $set: {
          tokenChapter: chapter.tokenChapter,
        },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Valida si el Capítulo Existe
   * @param chapterId Id del Capítulo
   * @param session Fecha de la Sesión
   * @returns Capítulo
   */
  async validateChapterExist(chapterId: string, sessionDate: string) {
    try {
      const query = [
        {
          $match: {
            _id: ObjectId(chapterId),
          },
        },
        {
          $lookup: {
            from: 'chaptersessions',
            localField: '_id',
            foreignField: 'chapterId',
            as: 'chaptersessionsData',
          },
        },
        {
          $unwind: '$chaptersessionsData',
        },
        {
          $match: {
            'chaptersessionsData.sessionDate': sessionDate,
          },
        },
        {
          $project: {
            _id: 1,
            meetingId: '$meetingId',
            tokenChapter: '$tokenChapter',
            sessionDay: '$sessionDate',
            sessionSchedule: '$sessionSchedule',
            status: '$status',
            email: '$email',
            sessionDate: '$chaptersessionsData.sessionDate',
            sessionChapterDate: '$chaptersessionsData.sessionChapterDate',
          },
        },
      ];
      const chapter = await this.chapterModel.aggregate(query);
      if (!chapter || chapter.length == 0) return false;
      return chapter[0];
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description Obtiene la información de la sesión
   * @param chapterId Id del Capítulo
   * @param res Resultado
   * @returns Sesión por su Id
   */
  async getMeetings(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      const meetings = await this.getMeetingsList(chapter.tokenChapter);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meetings,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Obtiene la información de la sesión enviada
   * @param meetingId Id del Meet
   * @param tokenChapter Token del Capítulo
   * @returns Información del Mee
   */
  getDataMeeting = (meetingId: string, tokenChapter: string): Promise<any> => {
    const headers = { Authorization: `Bearer ${tokenChapter}` };
    return new Promise((resolve, rejected) => {
      this.httpService
        .get(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
          headers,
        })
        .forEach((value) => {
          resolve(value?.data);
        })
        .catch((error) => {
          // Manejar el error de la solicitud
          rejected(`No se encuentra la sesión enviada, ${error.message}`);
        });
    });
  };

  /**
   * @description Obtiene las sesiones dadas de alta por el usuario
   * @param tokenChapter Token del Capítulo
   * @returns Información del Mee
   */
  getMeetingsList = (tokenChapter: string): Promise<any> => {
    const headers = { Authorization: `Bearer ${tokenChapter}` };
    return new Promise((resolve, rejected) => {
      this.httpService
        .get(
          `https://api.zoom.us/v2/users/${
            process.env.ZOOM_USER_ID ?? 'jMOMCXLpRM6SuzoBtyyIQQ'
          }/meetings`,
          {
            headers,
          },
        )
        .forEach((value) => {
          resolve(value?.data);
        })
        .catch((error) => {
          // Manejar el error de la solicitud
          rejected(`No se encuentra la sesión enviada, ${error.message}`);
        });
    });
  };

  /**
   * @description Obtiene la Información de los Usuarios de por Fecha
   * @param attendanceDate Día de la Sesión
   * @param chapterId Id del Capítulo
   * @param timeZone Zona Horaria
   * @returns Arreglo de Usuarios
   */
  async getAttendanceUsersByDate(
    attendanceDate: string,
    chapterId: string,
    timeZone: string,
  ) {
    try {
      const query = [
        {
          $match: {
            chapterId: ObjectId(chapterId),
            attendanceDate,
            attended: true,
          },
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
          $project: {
            userId: '$usersData.id',
            name: '$usersData.name',
            lastName: '$usersData.lastName',
            email: '$usersData.email',
            imageURL: '$usersData.imageURL',
            phoneNumber: '$usersData.phoneNumber',
            attendanceDate: '$attendanceDate',
            updatedAt: '$updatedAt',
            localUpdatedAt: {
              $dateToString: {
                format: '%H:%M:%S',
                date: {
                  $dateFromString: {
                    dateString: '$updatedAt',
                    timezone: timeZone,
                    format: '%Y-%m-%dT%H:%M:%S.%LZ',
                  },
                },
              },
            },
          },
        },
      ];
      return await this.attendanceModel.aggregate(query);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description Obtiene las Asistencias de los Usuarios
   * @param jwtPayload JSON para OBTENER INFORMACIÓN DEL USUARIO LOGUUEADO
   * @param res Resultado
   * @param filters Filtros
   * @returns Arreglo de usuarios
   */
  async getUsersSessions(jwtPayload: JWTPayload, res: Response, filters: any) {
    try {
      const sessionData = await this.getAttendanceUsersByDate(
        filters.sessionDate,
        filters.chapterId,
        jwtPayload.timeZone,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: sessionData,
      });
    } catch (error) {
      throw res.json(
        new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }
}
