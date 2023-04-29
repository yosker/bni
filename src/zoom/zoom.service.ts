import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { UpdateZoomDto } from './dto/update-zoom.dto';
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
    chapterId: string,
    jwtPayload: JWTPayload,
    res: Response,
  ) {
    try {
      const chapter = await this.validateChapterExist(chapterId);
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
      );

      if (!meeting) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException('SESSION_NOT_FOUND.', HttpStatus.BAD_REQUEST),
          );
      }

      for (let index = 0; index < meeting.registrants.length; index++) {
        const registrant = meeting.registrants[index];
        //Buscamos al usuario por su email
        const user = await this.usersModel.findOne({
          email: registrant.email,
          idChapter: ObjectId(chapterId),
        });

        const leaveTime = moment
          .utc(registrant.create_time)
          .tz(jwtPayload.timeZone)
          .format();

        if (!user) {
          //Si no se Encuentra el Usuario, se Crea como Visitante
          const userVisitor = {
            idChapter: ObjectId(chapterId),
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
                chapterId: ObjectId(chapterId),
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

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
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
  async findOne(chapterId: string, res: Response) {
    try {
      const chapter = await this.validateChapterExist(chapterId);
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
  async updateTokenChapter(updateZoomDto: UpdateZoomDto, res: Response) {
    try {
      const chapter = await this.validateChapterExist(
        updateZoomDto.chapterId.toString(),
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

      await this.chapterModel.findByIdAndUpdate(
        ObjectId(updateZoomDto.chapterId),
        {
          $set: {
            tokenChapter: updateZoomDto.tokenChapter,
          },
        },
      );

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
   * @param chapterId Chapter Id
   * @returns Objeto Capítulo
   */
  async validateChapterExist(chapterId: string) {
    try {
      const chapter = await this.chapterModel.findOne({
        _id: ObjectId(chapterId),
      });
      if (!chapter) return false;
      return chapter;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMeetings(chapterId: string, res: Response) {
    try {
      const chapter = await this.validateChapterExist(chapterId);
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
}
