import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './schemas/comments.schema';
import { Response } from 'express';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'aws-sdk/clients/budgets';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Users.name) private readonly userModel: Model<User>,
    private servicesResponse: ServicesResponse,
  ) {}
  async create(
    createCommentDto: CreateCommentDto,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    try {
      const comments = await this.commentModel.find({
        interviewId: ObjectId(createCommentDto.interviewId),
      });

      if (comments?.length >= 5) {
        this.userModel.findByIdAndUpdate(ObjectId(createCommentDto.userId), {
          accepted: createCommentDto.accepted,
        });
      }
      createCommentDto.createdBy = ObjectId(jwtPayload.id);
      await this.commentModel.create(createCommentDto);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: createCommentDto,
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

  async findAll(res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.commentModel.find(),
    });
  }

  async findOne(userInterviewId: string, res: Response) {
    const comment = await this.commentModel.findOne({
      userInterviewId: ObjectId(userInterviewId),
    });

    if (!comment)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new HttpException('COMMENT_NOT_FOUND.', HttpStatus.BAD_REQUEST));

    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: comment,
    });
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    updateCommentDto.createdBy = ObjectId(jwtPayload.id);
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.commentModel.updateOne(
        {
          _id: ObjectId(id),
        },
        updateCommentDto,
      ),
    });
  }
}
