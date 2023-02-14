import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './schemas/comments.schema';
import { Response } from 'express';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentModel: Model<Comment>,
    private servicesResponse: ServicesResponse,
  ) {}
  async create(createCommentDto: CreateCommentDto, res: Response) {
    await this.commentModel.create(createCommentDto);
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: createCommentDto,
    });
  }

  async findAll(res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: await this.commentModel.find(),
    });
  }

  async findOne(id: string, res: Response) {
    const comment = await this.commentModel.findOne({
      _id: ObjectId(id),
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

  async update(id: string, updateCommentDto: UpdateCommentDto, res: Response) {
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
