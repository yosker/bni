import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsersInterviewDto } from './dto/create-users-interview.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { UsersInterviews } from './schemas/interviews.schema';
import { UsersInterview } from './interfaces/users-interview.interface';
import { Model } from 'mongoose';
import { User } from 'src/users/interfaces/users.interface';
import { ServicesResponse } from 'src/responses/response';
import { Users } from 'src/users/schemas/users.schema';
import { JWTPayload } from 'src/auth/jwt.payload';
import { UpdateUsersInterviewDto } from './dto/update-users-interview.dto';

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
    createUsersInterviewDto.userInterviewId = ObjectId(
      createUsersInterviewDto.userInterviewId,
    );
    const interviewUser = await this.usersInterview.create(
      createUsersInterviewDto,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: interviewUser,
    });
  }

  async update(
    updateUsersInterviewDto: UpdateUsersInterviewDto,
    res: Response,
  ) {
    try {
      updateUsersInterviewDto.userInterviewId = ObjectId(
        updateUsersInterviewDto.userInterviewId,
      );
      updateUsersInterviewDto.interviewId = ObjectId(
        updateUsersInterviewDto.interviewId,
      );
      updateUsersInterviewDto._id = ObjectId(updateUsersInterviewDto._id);

      const userInterview = await this.usersInterview.findOne({
        _id: updateUsersInterviewDto._id,
      });

      if (!userInterview) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'USERS-INTERVIEWS_NOT_FOUND.',
              HttpStatus.NOT_FOUND,
            ),
          );
      }

      await this.usersInterview.updateOne(
        {
          _id: updateUsersInterviewDto._id,
        },
        updateUsersInterviewDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (error) {
      throw res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpException(
            'QUESTION-REFERENCE_NOT_FOUND.',
            HttpStatus.NOT_FOUND,
          ),
        );
    }
  }

  async findAll(skip = 0, limit?: number) {
    const query = this.usersInterview.find().sort({ _id: 1 }).skip(skip);

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findOne(id: string) {
    return this.usersInterview.findOne({
      userInterviewId: ObjectId(id),
    });
  }
}
