import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { ChapterSessionDTO } from './dto/chapterSessions.dto';
import { ChapterSession } from './interfaces/chapterSessions.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import * as moment from 'moment';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ChapterSessionsService {
  constructor(
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
    private servicesResponse: ServicesResponse,
  ) {}

  //ENDPOINT PARA LA CREACION MANUAL DE SESIONES POR CAPITULO
  async create(
    chapterSessionDTO: ChapterSessionDTO,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
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
        await this.chapterSessionModel.create(chapterSessionDTO);
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('RECORD_DUPLICATED.', HttpStatus.CONFLICT));
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
  async sessionList(chapterId: string, res: Response): Promise<Response> {
    try {
      const currentDate = moment().format('DD-MM-YYYY');
      const chapterSessionList = await this.chapterSessionModel
        .find(
          {
            chapterId: ObjectId(chapterId),
            status: EstatusRegister.Active,
            sessionDate: {
              $lte: currentDate,
            },
          },
          {
            _id: 0,
            sessionDate: 1,
          },
        )
        .sort({ sessionDate: -1 });
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
}
