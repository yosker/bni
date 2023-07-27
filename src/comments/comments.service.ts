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

      createCommentDto.visitorId = ObjectId(createCommentDto.visitorId);

      if (comments?.length >= 4) {
        this.userModel.findByIdAndUpdate(createCommentDto.visitorId, {
          accepted: createCommentDto.accepted,
        });
      }
      createCommentDto.createdBy = ObjectId(jwtPayload.id);
      const newComment = await this.commentModel.create(createCommentDto);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: newComment,
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

  async findByUserInterviewId(userInterviewId: string, res: Response) {
    try {
      const pipeline = [
        {
          $match: {
            visitorId: ObjectId(userInterviewId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $unwind: '$userData',
        },
        {
          $project: {
            nameUserCreated: {
              $concat: ['$userData.name', ' ', '$userData.lastName'],
            },
            imageUrl: '$userData.imageURL',
            attendanceDate: '$attendanceDate',
            comment: '$comment',
            accepted: '$accepted',
          },
        },
      ];
      const comment = await this.commentModel.aggregate(pipeline);

      if (!comment)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException('COMMENT_NOT_FOUND.', HttpStatus.BAD_REQUEST),
          );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: comment,
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

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    res: Response,
    jwtPayload: JWTPayload,
  ) {
    try {
      updateCommentDto.createdBy = ObjectId(jwtPayload.id);
      updateCommentDto.visitorId = ObjectId(updateCommentDto.visitorId);

      await this.commentModel.updateOne(
        {
          _id: ObjectId(id),
        },
        updateCommentDto,
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

  async findById(visitorId: string, jwtPayload: JWTPayload, res: Response) {
    try {
      const comment = await this.commentModel.findOne({
        visitorId: ObjectId(visitorId),
        createdBy: ObjectId(jwtPayload.id),
      });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: comment,
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
