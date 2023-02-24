/* eslint-disable @typescript-eslint/no-var-requires */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EvaluationPeriod } from './interfaces/evaluation-period.interfaces';
import { EvaluationPeriodDTO } from './dto/evaluation-period.dto';


import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { ServicesResponse } from 'src/responses/response';
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class EvaluationPeriodService {
    constructor(
        @InjectModel('EvaluationPeriod')
        private readonly evaluationPeriodModel: Model<EvaluationPeriod>,
        private readonly servicesResponse: ServicesResponse,
    ) { }

    //ENDPOINT PARA ALMACENAR EL OBJETO DE LOS COMPROMISOS QUE SE LE ASIGNARON AL NET
    async create(
        evaluationPeriodDTO: EvaluationPeriodDTO,
        res: Response,
        jwtPayload: JWTPayload,
    ): Promise<Response> {
        try {

            evaluationPeriodDTO = {
                ...evaluationPeriodDTO,
                chapterId: ObjectId(jwtPayload.idChapter),
                networkerId: ObjectId(evaluationPeriodDTO.networkerId),
            };
            await this.evaluationPeriodModel.create(evaluationPeriodDTO);

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
    };

    async evaluationList(networkerId: string, jwtPayload: JWTPayload, res: Response): Promise<Response> {

        try {
            const objList = await this.evaluationPeriodModel.find({
                chapterId: ObjectId(jwtPayload.idChapter),
                networkerId: ObjectId(networkerId),
                status: EstatusRegister.Active
            }, { initialPeriod: 1, finalPeriod: 1, notes: 1 });

            return res.status(HttpStatus.OK).json({
                statusCode: this.servicesResponse.statusCode,
                message: this.servicesResponse.message,
                result: objList,
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
    };


    async evaluationDetail(id: string, jwtPayload: JWTPayload, res: Response): Promise<Response> {

        try {
            const objDetail = await this.evaluationPeriodModel.findOne({
                _id: ObjectId(id),
                chapterId: ObjectId(jwtPayload.idChapter),
                status: EstatusRegister.Active
            });

            return res.status(HttpStatus.OK).json({
                statusCode: this.servicesResponse.statusCode,
                message: this.servicesResponse.message,
                result: objDetail,
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
    };

    async update(
        id: string,
        evaluationPeriodDTO: EvaluationPeriodDTO,
        res: Response,
        jwtPayload: JWTPayload,
    ): Promise<Response> {
        try {

            evaluationPeriodDTO = {
                ...evaluationPeriodDTO,
                chapterId: ObjectId(jwtPayload.idChapter),
                networkerId: ObjectId(evaluationPeriodDTO.networkerId),
            };
            await this.evaluationPeriodModel.findByIdAndUpdate(ObjectId(id), evaluationPeriodDTO);

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
    };

    async delete(id: string, res: Response): Promise<Response> {

        try {
            await this.evaluationPeriodModel.findByIdAndUpdate(
                { _id: ObjectId(id) },
                { status: EstatusRegister.Deleted },
            );

            return res.status(HttpStatus.OK).json({
                statusCode: this.servicesResponse.statusCode,
                message: this.servicesResponse.message,
                result: {}
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
