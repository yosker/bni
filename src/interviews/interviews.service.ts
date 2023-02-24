import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './interfaces/interviews.interface';
import { Interviews } from './schemas/interviews.schema';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interviews.name)
    private readonly interviewModel: Model<Interview>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private servicesResponse: ServicesResponse,
  ) {}

  /**
   * @description Guarda Respuestas de Entrevista
   * @param createInterviewDto Objeto de Preguntas
   * @returns Objeto Guardado
   */
  async save(
    createInterviewDto: CreateInterviewDto,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    createInterviewDto.chapterId = ObjectId(jwtPayload.idChapter);
    createInterviewDto.userId = ObjectId(jwtPayload.id);

    await this.interviewModel.create(createInterviewDto).then(async () => {
      this.usersModel.findByIdAndUpdate(ObjectId(createInterviewDto.userId), {
        completedInterview: true,
      });
    });
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: {},
    });
  }

  async findAll(res: Response): Promise<Response> {
    try {
      const interviews = await this.interviewModel.find();
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interviews,
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

  async findOne(id: string, res: Response): Promise<Response> {
    try {
      const interview = await this.interviewModel.findById(id);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: interview,
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
   * @description Actualizacion de Preguntas de Personas Referenciadas
   * @param id Id del Registro a Actualizar
   * @param _updateInterviewDto Objeto con las Preguntas a Actualizar
   * @returns Objeto Actualizado
   */
  async updateQuestionsReferences(
    id: string,
    _updateInterviewDto: UpdateInterviewDto,
    res: Response,
  ): Promise<Response> {
    try {
      const interview = await this.interviewModel.findById(id).catch(() => {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException('INTERVIEW_NOT_FOUND.', HttpStatus.NOT_FOUND),
          );
      });

      let index = 0;
      for (const reference of interview.references) {
        if (typeof _updateInterviewDto.references[index] != 'undefined') {
          const referenceModel = _updateInterviewDto.references[index];
          if (reference.email == referenceModel.email) {
            reference.questions =
              _updateInterviewDto.references[index].questions;
            index++;
          }
        }
      }

      await this.interviewModel.findByIdAndUpdate(ObjectId(id), interview);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: _updateInterviewDto,
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
   * @description Actualiza a un Invitado
   * @param id Id del Registro a Actualizar
   * @param _updateInterviewDto Objeto del Invitado
   * @returns Objeto Actualizado
   */
  async updateUserInterview(
    id: string,
    _updateInterviewDto: UpdateInterviewDto,
    res: Response,
  ): Promise<Response> {
    try {
      await this.interviewModel.findById(id).catch(() => {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException('INTERVIEW_NOT_FOUND.', HttpStatus.NOT_FOUND),
          );
      });

      await this.interviewModel.findByIdAndUpdate(
        ObjectId(id),
        _updateInterviewDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: _updateInterviewDto,
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
