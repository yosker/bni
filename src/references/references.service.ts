import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { JWTPayload } from 'src/auth/jwt.payload';
import { ServicesResponse } from 'src/responses/response';
import { IReference } from './interfaces/references.interface';
import { Model } from 'mongoose';
import { References } from './schemas/references.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ReferencesService {
  constructor(
    private servicesResponse: ServicesResponse,
    @InjectModel(References.name)
    private readonly referenceModel: Model<IReference>,
  ) {}

  async create(
    createReferenceDto: CreateReferenceDto,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    createReferenceDto.chapterId = ObjectId(jwtPayload.idChapter);
    createReferenceDto.userId = ObjectId(jwtPayload.id);
    createReferenceDto.interviewId = ObjectId(createReferenceDto.interviewId);
    createReferenceDto.userInterviewId = ObjectId(
      createReferenceDto.userInterviewId,
    );
    const interviewUser = await this.referenceModel.create(createReferenceDto);
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: interviewUser,
    });
  }

  async findAll(skip = 0, limit?: number) {
    const query = this.referenceModel.find().sort({ _id: 1 }).skip(skip);

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findOne(userInterviewId: string) {
    return this.referenceModel.findOne({
      userInterviewId: ObjectId(userInterviewId),
    });
  }
}
