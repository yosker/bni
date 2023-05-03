import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { CreateNonAttendanceDto } from './dto/create-non-attendance.dto';
import { UpdateNonAttendanceDto } from './dto/update-non-attendance.dto';
import { User } from 'src/users/interfaces/users.interface';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Response } from 'express';
import { NonAttendance } from './interfaces/non-attendance.interfaces';
import { ServicesResponse } from 'src/responses/response';
import { NonAttendances } from './schemas/non-attendance.schema';

const ObjectId = require('mongodb').ObjectId;
const moment = require('moment-timezone');

@Injectable()
export class NonAttendanceService {
  constructor(
    @InjectModel(NonAttendances.name)
    private readonly nonAttendanceModel: Model<NonAttendance>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private readonly servicesResponse: ServicesResponse,
  ) {}
  async create(
    createNonAttendanceDto: CreateNonAttendanceDto,
    res: Response,
  ): Promise<Response> {
    try {
      //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS
      const existUser = await this.usersModel.findOne({
        _id: ObjectId(createNonAttendanceDto.userId),
        idChapter: ObjectId(createNonAttendanceDto.chapterId),
        status: EstatusRegister.Active,
      });

      if (!existUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('USER_NOT_FOUND.', HttpStatus.BAD_REQUEST));
      }

      createNonAttendanceDto = {
        ...createNonAttendanceDto,
        userId: ObjectId(createNonAttendanceDto.userId),
        chapterId: ObjectId(createNonAttendanceDto.chapterId),
      };
      await this.nonAttendanceModel.create(createNonAttendanceDto);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: createNonAttendanceDto,
      });
    } catch (err) {
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
    const dateFrom = moment().add(-6, 'M').format();
    const dateTo = moment().format();

    const pipeline = await this.nonAttendanceQuery(dateFrom, dateTo);
    const resNonAttendances = await this.usersModel
      .aggregate(pipeline)
      .sort({ attended: 1 });
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: resNonAttendances,
    });
  }

  async findOne(id: string) {
    return await this.nonAttendanceModel.findById(id);
  }

  async update(
    id: string,
    updateNonAttendanceDto: UpdateNonAttendanceDto,
    res: Response,
  ) {
    await this.nonAttendanceModel.findByIdAndUpdate(id, updateNonAttendanceDto);

    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: {},
    });
  }

  async nonAttendanceQuery(dateFrom: string, dateTo: string) {
    return [
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'userId',
          as: 'attendancesData',
        },
      },
      {
        $unwind: {
          path: '$attendancesData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          createdAt: {
            $gte: moment(dateFrom).toISOString(),
            $lte: moment(dateTo).toISOString(),
          },
        },
      },
      {
        $project: {
          _id: 1,
          chapterId: '$attendances.DatachapterId',
          userId: '$attendancesData.userId',
          attendanceType: '$attendancesData.attendanceType',
          attended: {
            $cond: {
              if: { $gte: ['$attendancesData.attendanceType', ''] },
              then: true,
              else: false,
            },
          },
          createdAt: '$attendancesData.createdAt',
          status: '$attendancesData.status',
          sessionDate: '$chapterSessionsData.sessionDate',
          sessionStatus: '$chapterSessionsData.status',
          email: '$email',
          name: '$name',
          userStatus: '$status',
          role: '$role',
          lastName: '$lastName',
          phoneNumber: '$phoneNumber',
          imageUrl: '$imageUrl',
          companyName: '$companyName',
          profession: '$profession',
          completedApplication: '$completedApplication',
          completedInterview: '$completedInterview',
          invitedBy: '$invitedBy',
        },
      },
    ];
  }

  async formatDate(date) {
    const d = moment(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
