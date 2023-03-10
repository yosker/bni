import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersInterviewDto } from './dto/create-users-interview.dto';
import { UpdateUsersInterviewDto } from './dto/update-users-interview.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterviews } from './schemas/interviews.schema';
import { UsersInterview } from './interfaces/users-interview.interface';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';
import { ServicesResponse } from 'src/responses/response';
import { Users } from 'src/users/schemas/users.schema';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class UsersInterviewsService {
  constructor(
    @InjectModel(UsersInterviews.name)
    private readonly usersInterview: Model<UsersInterview>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private servicesResponse: ServicesResponse,
  ) {}

  async create(
    createUsersInterviewDto: CreateUsersInterviewDto,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    createUsersInterviewDto.chapterId = ObjectId(jwtPayload.idChapter);
    createUsersInterviewDto.userId = ObjectId(jwtPayload.id);
    createUsersInterviewDto.interviewId = ObjectId(
      createUsersInterviewDto.interviewId,
    );
    await this.usersInterview.create(createUsersInterviewDto);
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: createUsersInterviewDto,
    });
  }

  async findAll(skip = 0, limit?: number) {
    const query = this.usersInterview.find().sort({ _id: 1 }).skip(skip);

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findOne(id: string) {
    return this.usersInterview.findById({
      interviewId: ObjectId(id),
    });
  }

}
