import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateMembershipActivityDto } from './dto/create-membership-activity.dto';
import { UpdateMembershipActivityDto } from './dto/update-membership-activity.dto';
import { MembershipActivity } from './interfaces/membership-activity.interfaces';
import { MembershipActivities } from './schemas/membership-activity.schema';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class MembershipActivitiesService {
  constructor(
    @InjectModel(MembershipActivities.name)
    private readonly membershipActivity: Model<MembershipActivity>,
    private readonly servicesResponse: ServicesResponse,
  ) {}

  async create(
    createMembershipActivityDto: CreateMembershipActivityDto,
    jwtPayload: JWTPayload,
    res: Response,
  ) {
    try {
      createMembershipActivityDto = {
        ...createMembershipActivityDto,
        userId: ObjectId(jwtPayload.id),
      };

      const membershipActivity = await this.membershipActivity.create(
        createMembershipActivityDto,
      );
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: membershipActivity,
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
    try {
      const activities = await this.membershipActivity.find();
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: activities,
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
    try {
      const activity = await this.membershipActivity.findById(id);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: activity,
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
    id: number,
    updateMembershipActivityDto: UpdateMembershipActivityDto,
    res: Response,
  ) {
    try {
      await this.membershipActivity.findOneAndUpdate(
        {
          _id: ObjectId(id),
        },
        updateMembershipActivityDto,
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
}
