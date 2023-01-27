import { Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './interfaces/interviews.interface';
import { Interviews } from './schemas/interviews.schema';

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
  async save(createInterviewDto: CreateInterviewDto) {
    let { chapterId, userId } = createInterviewDto;
    chapterId = ObjectId(chapterId);
    userId = ObjectId(userId);
    createInterviewDto = {
      ...createInterviewDto,
      chapterId,
      userId,
    };
    await this.interviewModel.create(createInterviewDto).then(async () => {
      this.usersModel.findByIdAndUpdate(ObjectId(createInterviewDto.userId), {
        completedInterview: true,
      });
    });
  }

  findAll() {
    return `This action returns all interviews`;
  }

  async findOne(id: string) {
    return await this.interviewModel.findById(id);
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
  ) {
    const interview = await this.interviewModel.findById(id).catch(() => {
      throw new HttpErrorByCode[404](
        'INTERVIEW_NOT_FOUND',
        this.servicesResponse,
      );
    });

    let index = 0;
    for (const reference of interview.references) {
      if (typeof _updateInterviewDto.references[index] != 'undefined') {
        const referenceModel = _updateInterviewDto.references[index];
        if (reference.email == referenceModel.email) {
          reference.questions = _updateInterviewDto.references[index].questions;
          index++;
        }
      }
    }

    await this.interviewModel.findByIdAndUpdate(ObjectId(id), interview);
    return _updateInterviewDto;
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
  ) {
    await this.interviewModel.findById(id).catch(() => {
      throw new HttpErrorByCode[404](
        'INTERVIEW_NOT_FOUND',
        this.servicesResponse,
      );
    });

    await this.interviewModel.findByIdAndUpdate(
      ObjectId(id),
      _updateInterviewDto,
    );
    return _updateInterviewDto;
  }
}
