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
   * @description Obtiene los usuarios del meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async getUsersByMeetingId(createZoomDto: CreateZoomDto, res: Response) {
    try {
      const meeting = await this.getDataMeeting(
        createZoomDto.meetingId,
        createZoomDto.tokenChapter,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
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

  /**
   * @description Actualiza asistencias
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async setUsersByMeetingId(
    chapterId: string,
    meetingId: string,
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

      const meeting = await this.getDataMeeting(
        meetingId,
        chapter.tokenChapter,
      );

      meeting.registrants.forEach(async (registrant: { email: any }) => {
        //Buscamos al usuario por su email
        const user = await this.usersModel.findOne({
          email: registrant.email,
        });

        if (!user) {
          //Si no se Encuentra el Usuario, se Crea como Visitante
        } else {
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
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
          new HttpException(
            'INTERNAL_SERVER_ERROR.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
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
          new HttpException(
            'INTERNAL_SERVER_ERROR.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
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
      const chapter = await this.chapterModel.findOne(
        {
          _id: ObjectId(chapterId),
        },
        {
          tokenChapter: 1,
        },
      );
      if (!chapter) return false;
      return chapter;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   * @param meetingId Id del Meet
   * @param tokenChapter Token del Capítulo
   * @returns Información del Mee
   */
  getDataMeeting = (meetingId: string, tokenChapter: string): Promise<any> => {
    try {
      const headers = { Authorization: `Bearer ${tokenChapter}` };

      return new Promise((resolve) => {
        this.httpService
          .get(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
            headers,
          })
          .forEach((value) => {
            resolve(value.data);
          });
      });
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
