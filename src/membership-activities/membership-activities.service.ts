import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { CreateMembershipActivityDto } from './dto/create-membership-activity.dto';
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
        userId: ObjectId(createMembershipActivityDto.userId),
        chapterId: ObjectId(jwtPayload.idChapter),
        concatDate:
          createMembershipActivityDto.startDate.replace(/\//g, '-') +
          ' al ' +
          createMembershipActivityDto.endDate.replace(/\//g, '-')
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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  async findAll(jwtPayload: JWTPayload, date: string, res: Response) {
    try {

      const activities = await this.membershipActivity
        .find({
          chapterId: ObjectId(jwtPayload.idChapter),
          concatDate: date,
          status: EstatusRegister.Active,
        })
        .sort({ createdAt: -1 });
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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  async fileUpdate(
    id: string,
    req,
    dataBuffer: Buffer,
    filename: string,
    res: Response,
  ) {
    try {
      const updateMembershipActivityDto = await this.membershipActivity.findOne(
        {
          _id: ObjectId(id),
        },
      );

      if (!updateMembershipActivityDto)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'Lo sentimos, actividad no encontrada.',
              HttpStatus.BAD_REQUEST,
            ),
          );

      let s3Response = '';

      if (filename != 'default') {
        s3Response = await (await this.sharedService.uploadFile(dataBuffer, filename, '', 's3-bucket-users')).result.toString();
        await this.sharedService.deleteObjectFromS3('s3-bucket-users', req.urlFile);
      } else {
        if (req.deleteFile == 1) {
          await this.sharedService.deleteObjectFromS3('s3-bucket-users', req.urlFile);
          s3Response = '';
        } else {
          s3Response = req.urlFile;
        }
      }

      await this.membershipActivity.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          fileUrl: s3Response,
          comments: req.comments,
          statusActivity: req.statusActivity
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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  async findDates(jwtPayload: JWTPayload, res: Response) {
    try {
      const dateList = await this.membershipActivity
        .find({
          chapterId: ObjectId(jwtPayload.idChapter),
          status: EstatusRegister.Active,
        })
        .distinct('concatDate');

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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  async delete(id: string, res: Response): Promise<Response> {
    try {
      await this.membershipActivity.findByIdAndUpdate(
        { _id: ObjectId(id) },
        { status: EstatusRegister.Deleted },
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (err) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  async update(
    id: string,
    createMembershipActivityDto: CreateMembershipActivityDto,
    res: Response,
  ): Promise<Response> {
    try {
      createMembershipActivityDto = {
        ...createMembershipActivityDto,
        userId: ObjectId(createMembershipActivityDto.userId),
        concatDate:
          createMembershipActivityDto.startDate.replace(/\//g, '-') +
          ' al ' +
          createMembershipActivityDto.endDate.replace(/\//g, '-'),
        statusActivity: createMembershipActivityDto.statusActivity,
      };
      await this.membershipActivity.findByIdAndUpdate(
        ObjectId(id),
        createMembershipActivityDto,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (err) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }

  //SERVICIOS PARA LAS ACTIVIDADES DEL COMITE DE MEMBRESIAS (POR USUARIO)


  async findUserActivities(jwtPayload: JWTPayload, date: string, res: Response) {
    try {


      const activities = await this.membershipActivity
        .find({
          chapterId: ObjectId(jwtPayload.idChapter),
          concatDate: date,
          userId: ObjectId(jwtPayload.id),
          status: EstatusRegister.Active,
        })
        .sort({ createdAt: -1 });
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
            'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }


}
