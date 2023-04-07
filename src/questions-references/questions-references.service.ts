import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuestionsReferenceDto } from './dto/create-questions-reference.dto';
import { UpdateQuestionsReferenceDto } from './dto/update-questions-reference.dto';
import { ServicesResponse } from 'src/responses/response';
import { QuestionsReferences } from './schemas/questions-references.schema';
import { IQuestionsReference } from './interfaces/questions-references.interface';
import { User } from 'src/users/interfaces/users.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { IReference } from 'src/references/interfaces/references.interface';
import { References } from 'src/references/schemas/references.schema';
import { Response } from 'express';
import { PaginateResult } from 'src/shared/pagination/pagination-result';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class QuestionsReferencesService {
  constructor(
    private servicesResponse: ServicesResponse,
    @InjectModel(QuestionsReferences.name)
    private readonly questionsReferenceModel: Model<IQuestionsReference>,
    @InjectModel(References.name)
    private readonly referenceModel: Model<IReference>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly paginateResult: PaginateResult,
  ) {}

  async create(
    createQuestionsReferenceDto: CreateQuestionsReferenceDto,
    res: Response,
  ) {
    try {
      createQuestionsReferenceDto.interviewId = ObjectId(
        createQuestionsReferenceDto.interviewId,
      );
      createQuestionsReferenceDto.userInterviewId = ObjectId(
        createQuestionsReferenceDto.userInterviewId,
      );

      const reference = await this.referenceModel.findOne({
        chapterId: createQuestionsReferenceDto.referenceId,
        interviewId: createQuestionsReferenceDto.interviewId,
        userInterviewId: createQuestionsReferenceDto.userInterviewId,
      });

      if (!reference) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'QUESTION-REFERENCE_NOT_FOUND.',
              HttpStatus.NOT_FOUND,
            ),
          );
      }

      const questions = await this.questionsReferenceModel.create(
        createQuestionsReferenceDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: questions,
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

  async findAll(res: Response, skip = 0, limit?: number) {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'references',
            localField: 'referenceId',
            foreignField: '_id',
            as: 'referencesData',
          },
        },
        {
          $unwind: '$referencesData',
        },
        {
          $project: {
            _id: '$_id',
            referenceId: '$referencesData._id',
            name: '$referencesData.name',
            phoneNumber: '$referencesData.phoneNumber',
            chapterId: '$referencesData.letterSent',
            question1: '$question1',
            question2: '$question2',
            question3: '$question3',
            question4: '$question4',
            question5: '$question5',
            question6: '$question6',
            question7: '$question7',
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              {
                $skip: skip > 0 ? (skip - 1) * limit : 0,
              },
              { $limit: limit },
            ],
          },
        },
      ];
      const questions = await this.questionsReferenceModel.aggregate(pipeline);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: await this.paginateResult.getResult(questions),
        total: await this.paginateResult.getTotalResults(questions),
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

  async findOne(id: string, res: Response) {
    const pipeline = [
      {
        $match: {
          userInterviewId: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'references',
          localField: 'referenceId',
          foreignField: '_id',
          as: 'referencesData',
        },
      },
      {
        $unwind: '$referencesData',
      },
      {
        $project: {
          _id: '$_id',
          referenceId: '$referencesData._id',
          name: '$referencesData.name',
          phoneNumber: '$referencesData.phoneNumber',
          chapterId: '$referencesData.letterSent',
          question1: '$question1',
          question2: '$question2',
          question3: '$question3',
          question4: '$question4',
          question5: '$question5',
          question6: '$question6',
          question7: '$question7',
        },
      },
    ];
    const questions = await this.questionsReferenceModel.aggregate(pipeline);

    if (!questions) {
      throw res
        .status(HttpStatus.BAD_REQUEST)
        .json(
          new HttpException(
            'QUESTION-REFERENCE_NOT_FOUND.',
            HttpStatus.NOT_FOUND,
          ),
        );
    }
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: questions,
    });
  }

  async update(
    id: string,
    updateQuestionsReferenceDto: UpdateQuestionsReferenceDto,
    res: Response,
  ) {
    try {
      updateQuestionsReferenceDto.interviewId = ObjectId(
        updateQuestionsReferenceDto.interviewId,
      );
      updateQuestionsReferenceDto.userInterviewId = ObjectId(
        updateQuestionsReferenceDto.userInterviewId,
      );

      const reference = await this.referenceModel.findOne({
        chapterId: updateQuestionsReferenceDto.referenceId,
        interviewId: updateQuestionsReferenceDto.interviewId,
        userInterviewId: updateQuestionsReferenceDto.userInterviewId,
      });

      if (!reference) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'QUESTION-REFERENCE_NOT_FOUND.',
              HttpStatus.NOT_FOUND,
            ),
          );
      }
      await this.questionsReferenceModel.updateOne(
        {
          interviewId: updateQuestionsReferenceDto.interviewId,
          userInterviewId: updateQuestionsReferenceDto.userInterviewId,
        },
        updateQuestionsReferenceDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: updateQuestionsReferenceDto,
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
}
