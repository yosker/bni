import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { MonitoringLetters } from 'src/monitoringletters/interfaces/monitoringletters.interface';
import { MonitoringLettersDTO } from 'src/monitoringletters/dto/monitoringletters.dto';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class MonitoringlettersService {
  constructor(
    @InjectModel('MonitoringLetters')
    private readonly monitoringLettersModel: Model<MonitoringLetters>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) {}

  //ENDPOINT PARA GUARDAR UN COMENTARIO DE SEGUIMIENTO
  async create(
    monitoringLettersDTO: MonitoringLettersDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
      monitoringLettersDTO.userId = ObjectId(jwtPayload.id);
      monitoringLettersDTO.name = jwtPayload.name;
      monitoringLettersDTO.visitorId = ObjectId(monitoringLettersDTO.visitorId);
      await this.monitoringLettersModel.create(monitoringLettersDTO);

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

  async findAll(visitorId: string, jwtPayload: JWTPayload, res: Response) {
    try {
      let { statusCode, message } = this.servicesResponse;
      let result = {};

      result = await this.monitoringLettersModel.find({
        visitorId: ObjectId(visitorId),
        status: EstatusRegister.Active,
      }).sort({ _id: -1 });

      return res.status(HttpStatus.OK).json({
        statusCode: statusCode,
        message: message,
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

  
  async findById(commentId: string, jwtPayload: JWTPayload, res: Response) {
    try {
      let { statusCode, message } = this.servicesResponse;
      let result = {};

      result = await this.monitoringLettersModel.findOne({
        _id: ObjectId(commentId),
      });

      return res.status(HttpStatus.OK).json({
        statusCode: statusCode,
        message: message,
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

  async update(
    id: string,
    monitoringLettersDTO: MonitoringLettersDTO,
    res: Response
  ) {
    try {
      await this.monitoringLettersModel.updateOne(
        { _id: ObjectId(id) },
        { comment: monitoringLettersDTO.comment },
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
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
