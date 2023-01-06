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
import { ChapterSession } from 'src/chapter-sessions/interfaces/chapterSessions.interface';

const moment = require('moment');
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class AttendanceService {
    constructor(
        @InjectModel('Attendance') private readonly attendanceModel: Model<Attendance>,
        @InjectModel(Users.name) private readonly usersModel: Model<User>,
        @InjectModel('ChapterSession') private readonly chapterSessionModel: Model<ChapterSession>,
        private readonly servicesResponse: ServicesResponse,
    ) { }

    //ENDPOINT PARA ALMACENAR EL PASE DE LISTA DE LOS USUARIOS
    async create(attendanceDTO: AttendanceDTO): Promise<ServicesResponse> {

        let { statusCode, message, result } = this.servicesResponse;
        try {
            //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS 
            const existUser = await this.usersModel.findById({ _id: ObjectId(attendanceDTO.userId) });
            if (!existUser) {
                statusCode = 404;
                message = 'USER_NOT_FOUND';
                return { statusCode, message, result };
            };

            const currentDate = moment().format("DD/MM/YYYY");
            let authAttendance = false;

            //VALIDAMOS QUE LA SESION EXISTA EXISTA Y QUE ESTE ACTIVA
            const chapterSession = await this.chapterSessionModel.findOne({
                chapterId: ObjectId(attendanceDTO.chapterId),
                sessionDate: currentDate,
                status: 'Active'
            });
            if (chapterSession != null) { authAttendance = true; }

            if (authAttendance) {
                //VALIDAMOS QUE EL USUARIO NO SE REGISTRE DOS VECES EL MISMO DIA EN LA COLECCION DE ASISTENCIA
                const userSession = await this.attendanceModel.findOne({
                    userId: ObjectId(attendanceDTO.userId),
                    attendanceDate: currentDate,
                    chapterId: ObjectId(attendanceDTO.chapterId),
                    status: 'Active'
                });

                if (userSession) {
                    statusCode = 409;
                    message = 'RECORD_DUPLICATED';
                    return { statusCode, message, result };
                };

                attendanceDTO = { ...attendanceDTO, attendanceDate: currentDate, userId: ObjectId(attendanceDTO.userId), chapterId: ObjectId(attendanceDTO.chapterId) };
                await this.attendanceModel.create(attendanceDTO);

                let pipeline = await this.AttendanceResult(attendanceDTO.chapterId, currentDate, attendanceDTO.userId, 1);
                const userData = await this.attendanceModel.aggregate(pipeline);

                return { statusCode, message, result: userData[0] };
            } else {
                statusCode = 401;
                message = 'ATTENDANCE_NOT_AUTHORIZED';
                return { statusCode, message, result };
            }
        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };

    //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE SE REGISTRARON EN LA SESION
    async VisitorsList(chapterId: string) {

        let { message } = this.servicesResponse;
        try {
            const currentDate = moment().format("YYYY-MM-DD");
            const visitorList = await this.usersModel.find({
                idChapter: ObjectId(chapterId),
                role: "Visitante",
                status: "Active",
                createdAt: { $gte: moment(`${currentDate}T00:00:00`), $lt: moment(`${currentDate}T23:59:59`) }
            }, {
                name: 1,
                lastName: 1,
                companyName: 1,
                profession: 1,
                invitedBy: 1,
                completedApplication: 1,
                completedInterview: 1
            });

            return { statusCode: 200, message, result: visitorList };

        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };

    //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE REGISTRARON ASISNTENCIA
    async NetworkersList(chapterId: string) {

        let { message } = this.servicesResponse;
        try {
            const currentDate = moment().format("DD/MM/YYYY");
            let pipeline = await this.AttendanceResult(ObjectId(chapterId), currentDate, ObjectId(0), 0);
            const userData = await this.attendanceModel.aggregate(pipeline);

            return { statusCode: 200, message, result: userData };

        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };

    //PIPELINE PARA REGRESAR LOS DATOS DEL USUARIO (NETWORKER) CUANDO SE REGISTRA 
    async AttendanceResult(chapterId: object, attendaceDate: string, userId: object, queryType: number) {

        let filter = {
            ["chapterId"]: ObjectId(chapterId),
            ["attendanceDate"]: attendaceDate,
        };
        if (queryType == 1) { filter["userId"] = ObjectId(userId); }

        const result = [
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $project: {
                    name: '$userData.name',
                    imageUrl: '$userData.imageURL',
                    attendanceDate: '$attendanceDate',
                    createdAt: '$createdAt',
                    attendanceHour: { $concat: [{ "$toString": { $hour: '$createdAt' } }, ':', { "$toString": { $minute: '$createdAt' } }] },
                    companyName: '$userData.companyName',
                    profession: '$userData.profession'
                }
            },
        ];
        return result;
    };

}
