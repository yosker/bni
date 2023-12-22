import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { PresentationCalendar } from 'src/presentationcalendar/interfaces/presentationcalendar.interface';
import { PresentationCalendarDTO } from 'src/presentationcalendar/dto/presentationcalendar.dto';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Users } from 'src/users/schemas/users.schema';
import { User } from 'src/users/interfaces/users.interface';
import { UsersType } from 'src/shared/enums/usersType';

const ObjectId = require('mongodb').ObjectId;
const moment = require('moment-timezone');

@Injectable()
export class PresentationcalendarService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('PresentationCalendar')
    private readonly presentationCalendarModel: Model<PresentationCalendar>,
    private readonly servicesResponse: ServicesResponse,
    private readonly sharedService: SharedService,
  ) {}

  //ENDPOINT PARA AGENDAR UNA PRESENTACIÓN DEL ORADOR PRINCIPAL

  async create(
    presentationCalendarDTO: PresentationCalendarDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    try {
        //GUADARMOS EL NUEVO REGISTRO
        if (presentationCalendarDTO.networkerName !== '' && presentationCalendarDTO.presentationDate !== ''){

            const findRecord = await this.presentationCalendarModel.find({
              chapterId:ObjectId(jwtPayload.idChapter),
              status: EstatusRegister.Active,
              presentationDate:  moment.utc(presentationCalendarDTO.presentationDate, 'YYYY-MM-DD').toISOString()
            });

            //VLIDAMOS QUE NO HAYA UN REGISTRO IGUAL (POR FECHA)
            if (findRecord.length > 0){
              return res.status(HttpStatus.OK).json({
                statusCode: 203,
                message: "Data Repeted",
                result: result,
              });
            }
            presentationCalendarDTO.chapterId = ObjectId(jwtPayload.idChapter);
            presentationCalendarDTO.createdBy = jwtPayload.name;
            presentationCalendarDTO.networkerId = ObjectId(presentationCalendarDTO.networkerId);
            presentationCalendarDTO.presentationDate = moment.utc(presentationCalendarDTO.presentationDate, 'YYYY-MM-DD').toISOString();
            await this.presentationCalendarModel.create(presentationCalendarDTO);

        }else if (presentationCalendarDTO.networkerName == '' && presentationCalendarDTO.presentationDate == '' && presentationCalendarDTO.comments !=='') { 

            //OBTENEMOS EL ULTIMO REGISTRO 
            const lastRecord = await this.presentationCalendarModel.findOne({
                chapterId:ObjectId(jwtPayload.idChapter),
                status: EstatusRegister.Active,
              }).sort({ _id: -1 });

            //ACTUALIZAMOS EL ULTIMO COMENTARIO
              await this.presentationCalendarModel.updateOne(
                { _id: ObjectId(lastRecord._id) },
                { comments: presentationCalendarDTO.comments },
              );
        }else if (presentationCalendarDTO.networkerName == '' && presentationCalendarDTO.presentationDate == '' && presentationCalendarDTO.comments ==''){
          return res.status(HttpStatus.OK).json({
            statusCode: 202,
            message: "Debes enviar por lo menos uno de lo tres campos",
            result: result,
          });
        }

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
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

  async findAll(jwtPayload: JWTPayload, res: Response) {
    try {
      let { statusCode, message } = this.servicesResponse;
      let result = {};

      const pipeline: any = await this.getQuery(jwtPayload.idChapter);
      const presentationList = await this.presentationCalendarModel.aggregate(pipeline).sort({ presentationDate: -1 });

      return res.status(HttpStatus.OK).json({
        statusCode: statusCode,
        message: message,
        result: presentationList,
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

  async getUsersAndPresentationsCalendar(jwtPayload: JWTPayload, res: Response){
   
    try {

      let { statusCode, message } = this.servicesResponse;
      const pipeline: any = await this.getQuery(jwtPayload.idChapter);
      const presentationList = await this.presentationCalendarModel.aggregate(pipeline).sort({ presentationDate: -1 });

      const objUserList = await this.usersModel.find({ idChapter: ObjectId(jwtPayload.idChapter), status: EstatusRegister.Active, role: { $ne: UsersType.Visitante }})
      
      const lastRecord = await this.presentationCalendarModel.findOne({
        chapterId:ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active,
      }).sort({ _id: -1 }).limit(1);

      const obj = {
        presentationCalendarList: presentationList, 
        usersList: objUserList,
        comments: lastRecord == null ? '' : lastRecord.comments
      }
      
      return res.status(HttpStatus.OK).json({
        statusCode: statusCode,
        message: message,
        result: obj,
      });
    }
    catch (err) {
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

  async getQuery(chapterId: string){
      return[
        {
          $match: {
              chapterId: ObjectId(chapterId),
              status: EstatusRegister.Active,
          }
      },
      {
          $lookup: {
              from: 'users',
              localField: 'networkerId',
              foreignField: '_id',
              as: 'users',
          },
      },
      {
          $unwind: '$users',
      },
      {
          $project: {
              _id: "$_id",
              networkerName: "$networkerName",
              presentationDate: "$presentationDate",
              comments: "$comments",
              url: "$users.imageURL"  
          }
      }
      ]
  }
  
  async delete(
    id: string,
    res: Response
  ) {
    try {
      await this.presentationCalendarModel.updateOne(
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
            'INTERNAL_SERVER_ERROR.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
