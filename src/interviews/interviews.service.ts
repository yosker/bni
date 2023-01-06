import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { Interview } from './interfaces/interviews.interface';
import { Interviews } from './schemas/interviews.schema';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interviews.name)
    private readonly interviewModel: Model<Interview>,
  ) {}

  /**
   * @description Guarda respuestas de Entrevista
   * @param createInterviewDto Objeto de Preguntas
   * @returns Objeto Guardado
   */
  async save(createInterviewDto: CreateInterviewDto) {
    return await this.interviewModel.create(createInterviewDto);
  }

  findAll() {
    return `This action returns all interviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interview`;
  }

  update(id: number, updateInterviewDto: UpdateInterviewDto) {
    return updateInterviewDto;
  }

  remove(id: number) {
    return `This action removes a #${id} interview`;
  }
}
