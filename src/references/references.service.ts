import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { JWTPayload } from 'src/auth/jwt.payload';
import { ServicesResponse } from 'src/responses/response';
import { IReference } from './interfaces/references.interface';
import { Model } from 'mongoose';
import { References } from './schemas/references.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'src/users/interfaces/users.interface';
import { UpdateReferenceDto } from './dto/update-reference.dto';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ReferencesService {
  constructor(
    private servicesResponse: ServicesResponse,
    @InjectModel(References.name)
    private readonly referenceModel: Model<IReference>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
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

    // const reference = await this.referenceModel.findOne({
    //   chapterId: createReferenceDto.chapterId,
    //   userId: createReferenceDto.userId,
    //   interviewId: createReferenceDto.interviewId,
    //   userInterviewId: createReferenceDto.userInterviewId,
    // });

    // let interviewUser;
    // if (!reference) {
    const interviewUser = await this.referenceModel.create(createReferenceDto);
    // } else {
    //   await this.referenceModel.findOneAndUpdate(
    //     {
    //       chapterId: createReferenceDto.chapterId,
    //       userId: createReferenceDto.userId,
    //       interviewId: createReferenceDto.interviewId,
    //       userInterviewId: createReferenceDto.userInterviewId,
    //     },
    //     createReferenceDto,
    //   );
    // }

    await this.usersModel.findByIdAndUpdate(
      createReferenceDto.userInterviewId,
      {
        completedInterview: true,
      },
    );
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: interviewUser,
    });
  }

  async update(updateReferenceDto: UpdateReferenceDto, res: Response) {
    try {
      await this.referenceModel.updateOne(
        {
          _id: ObjectId(updateReferenceDto.id),
        },
        {
          $set: {
            name: updateReferenceDto.name,
            phoneNumber: updateReferenceDto.phoneNumber,
          },
        },
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
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

  async findAll(skip = 0, limit?: number) {
    const query = this.referenceModel.find().sort({ _id: 1 }).skip(skip);

    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async findById(userInterviewId: string) {
    return this.referenceModel.find({
      userInterviewId: ObjectId(userInterviewId),
    });
  }
}
