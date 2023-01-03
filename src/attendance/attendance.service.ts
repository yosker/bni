/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from './interfaces/attendance.interfaces';
import { AttendanceDTO } from './dto/attendance.dto';
import { ServicesResponse } from '../responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { string } from 'joi';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel('Attendance') private readonly attendanceModel: Model<Attendance>,
        @InjectModel(Users.name) private readonly usersModel: Model<User>,
        private readonly servicesResponse: ServicesResponse,

    ) { }

    //ENDPOINT PARA ALMACENAR EL PASE DE LISTA DE LOS USUARIOS
    async create(attendanceDTO: AttendanceDTO): Promise<ServicesResponse> {

        let { statusCode, message, result } = this.servicesResponse;
        try {
            //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS 
            const existUser = await this.usersModel.findById({ _id: ObjectId(attendanceDTO.idUser) });
            if (!existUser) {
                statusCode = 404;
                message = 'USER_NOT_FOUND';
                return { statusCode, message, result };
            };

            //VALIDAMOS QUE EL USUARIO NO SE REGISTRE DOS VECES EL MISMO DIA EN LA COLECCION DE ASISTENCIA
            const userSession = await this.attendanceModel.findOne({
                idUser: ObjectId(attendanceDTO.idUser),
                attendanceDate: attendanceDTO.attendanceDate,
                status: 'Active'
            });

            if (userSession) {
                statusCode = 409;
                message = 'RECORD_DUPLICATED';
                return { statusCode, message, result };
            };

            attendanceDTO = { ...attendanceDTO, idUser: ObjectId(attendanceDTO.idUser) };
            await this.attendanceModel.create(attendanceDTO);
            return { statusCode, message, result };
        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };



    async networkersList() {

        const pipeline = [
            {
                $match: {
                    idChapter: ObjectId('63b3a4cbc9c2c1527ad9975a')
                }
            },
            {
                $lookup: {
                    from: 'attendances',
                    localField: 'idUser',
                    foreignField: 'id',
                    as: 'userData'
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $project: {
                    name: '$name',
                    email: '$email',
                    attendanceDate: '$userData.attendanceDate',
                    hour: {$hour: '$userData.createdAt'},
                    date:'$userData.createdAt',
                    date2:  { $hour: { date: "$userData.createdAt", timezone: "GMT" }},
                    attendanceHour: { $concat: [ { "$toString": {$hour: '$userData.createdAt'}}, ':',  { "$toString": {$minute: '$userData.createdAt'}} ] },
                }
            }
        ];

        const userList = await this.usersModel.aggregate(pipeline);

        console.log('userList....', userList);

        return userList;
    }
}
