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
import { SharedService } from 'src/shared/shared.service';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class MembershipActivitiesService {
  constructor(
    @InjectModel(MembershipActivities.name)
    private readonly membershipActivity: Model<MembershipActivity>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) { }

  async create(
    createMembershipActivityDto: CreateMembershipActivityDto,
    jwtPayload: JWTPayload,
    res: Response,
  ) {
    try {
      createMembershipActivityDto = {
        ...createMembershipActivityDto,
        userId: ObjectId(jwtPayload.id),
        chapterId: ObjectId(jwtPayload.idChapter),
        concatDate: createMembershipActivityDto.startDate.replace(/\//g, "-") + ' al ' + createMembershipActivityDto.endDate.replace(/\//g, "-")
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

  async findAll(jwtPayload: JWTPayload, date: string, res: Response) {
    try {

      const activities = await this.membershipActivity.find({
        chapterId: ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active
      }).sort({createdAt :-1});
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
    id: string,
    updateMembershipActivityDto: UpdateMembershipActivityDto,
    dataBuffer: Buffer,
    filename: string,
    res: Response,
  ) {
    try {
      let s3Response = '';
      // if (String(updateMembershipActivityDto.fileRequire) === 'true') {
      //   s3Response = await (
      //     await this.sharedService.uploadFile(
      //       dataBuffer,
      //       filename,
      //       '.jpg',
      //       's3-bucket-users',
      //     )
      //   ).result.toString();
      // }

      // updateMembershipActivityDto = {
      //   ...updateMembershipActivityDto,
      //   imageURL: s3Response,
      // };

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

  async findDates(jwtPayload: JWTPayload, res: Response) {
    try {

      const dateList = await this.membershipActivity.find({
        chapterId: ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active
      }).distinct("concatDate");

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: dateList,
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
