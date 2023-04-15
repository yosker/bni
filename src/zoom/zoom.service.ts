import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { UpdateZoomDto } from './dto/update-zoom.dto';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { Response } from 'express';
import { ServicesResponse } from 'src/responses/response';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ZoomService {
  constructor(
    private httpService: HttpService,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    private servicesResponse: ServicesResponse,
  ) {}

  /**
   * @description Obtiene los usuarios del meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async getUsersByMeetingId(createZoomDto: CreateZoomDto, res: Response) {
    try {
      const headers = { Authorization: `Bearer ${createZoomDto.tokenChapter}` };

      const result = this.httpService
        .get(
          `https://api.zoom.us/v2/meetings/${createZoomDto.meetingId}/registrants`,
          {
            headers,
          },
        )
        .pipe(map((response: AxiosResponse) => response.data));

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
      const headers = { Authorization: `Bearer ${chapter.tokenChapter}` };

      const meeting = this.httpService
        .get(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
          headers,
        })
        .pipe(map((response: AxiosResponse) => response.data));

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
  async updateTokenChapterToken(updateZoomDto: UpdateZoomDto, res: Response) {
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
}
