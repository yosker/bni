import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { NetinterviewDTO } from './dto/netinterview.dto';
import { Netinterview } from './interfaces/neinterview.interface';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class NetinterviewService {

  constructor(
    @InjectModel('Netinterview')
    private readonly netinterviewModel: Model<Netinterview>,
    private servicesResponse: ServicesResponse,
  ) { }

  //ENDPOINT PARA LA GUARDAR ENTREVISTAS DE 7 Y 1O MESES 
  async createInterview(
    netinterviewDTO: NetinterviewDTO,
    JWTPayload: any,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {

      netinterviewDTO = {
        ...netinterviewDTO,
        chapterId: ObjectId(JWTPayload.chapterId),
        userId: ObjectId(netinterviewDTO.userId),
        createdBy: JWTPayload.name,
      };

      await this.netinterviewModel.create(netinterviewDTO);

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
  };

  //ENDPOINT QUE REGRESA UNA LISTA DE TODAS LAS ENTREVISTAS
  async findAll(userId: string, res: Response): Promise<Response> {
    try {

      const interview = await this.netinterviewModel.find({ userId: ObjectId(userId), status: "Active" })

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interview,
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
  };

  //ENDPOINT QUE REGRESA LA INFORMACIÓN DE UNA ENTREVISTA EN PARTICULAR
  async findOne(interviewId:string, res: Response): Promise<Response> {
    try {
      const interview = await this.netinterviewModel.findById({ _id: ObjectId(interviewId) });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interview,
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
