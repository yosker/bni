import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  /**
   * @description Guarda respuestas de Entrevista
   * @param createInterviewDto Objeto de Preguntas
   * @returns Objeto Guardado
   */
  async save(createInterviewDto: CreateInterviewDto) {
    await this.interviewModel.create(createInterviewDto).then(() => {
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

  async update(id: number, _updateInterviewDto: UpdateInterviewDto) {
    await this.usersModel.findByIdAndUpdate(ObjectId(id), _updateInterviewDto);
    return _updateInterviewDto;
  }
}
