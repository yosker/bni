import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ServicesResponse } from 'src/responses/response';
import { ChapterSessionDTO } from './dto/chapterSessions.dto';
import { ChapterSession } from './interfaces/chapterSessions.interface';
import { InjectModel } from '@nestjs/mongoose';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ChapterSessionsService {

    constructor(
        @InjectModel('ChapterSession') private readonly chapterSessionModel: Model<ChapterSession>,
        private servicesResponse: ServicesResponse,
    ) { }

    //ENDPOINT PARA LA CREACION MANUAL DE SESIONES POR CAPITULO
    async create(chapterSessionDTO: ChapterSessionDTO): Promise<ServicesResponse> {

        const { statusCode, message, result } = this.servicesResponse;
        try {
            const findSession = await this.chapterSessionModel.findOne({
                chapterId: ObjectId(chapterSessionDTO.chapterId),
                sessionDate: chapterSessionDTO.sessionDate,
                status: 'Active'
            });
            chapterSessionDTO = { ...chapterSessionDTO, chapterId: ObjectId(chapterSessionDTO.chapterId) }

            if (findSession == null) {
                await this.chapterSessionModel.create(chapterSessionDTO);
            } else {
                return { statusCode: 409, message: 'RECORD_DUPLICATED', result };
            }

            return { statusCode, message, result };
        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };

    //ENDPOINT QUE REGRESA UNA LISTA DE FECHAS DE SESION OOR CAPITULO
    async sessionList(chapterId: string) {

        let { message } = this.servicesResponse;
        try {
            const chapterSessionList = await this.chapterSessionModel.find({
                idChapter: ObjectId(chapterId),
                status: "Active"
            }, {
                _id: 0,
                sessionDate: 1
            });
            return { statusCode: 200, message, result: chapterSessionList };
        } catch (err) {
            throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
        }
    };
}
