
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicesResponse } from 'src/responses/response';
import { Charges } from './interfaces/charges.interfaces';
import { ChargesDTO } from './dto/charges.dto';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Model } from 'mongoose';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';


const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class ChargesService {

    constructor(
        @InjectModel('Charges') private readonly chargesModel: Model<Charges>,
        private readonly servicesResponse: ServicesResponse,
        private readonly sharedService: SharedService,
    ) { }

    //ENDPOINT PARA GUARDAR LOS GASTOS (DATA Y FILES)
    async create(
        jwtPayload: JWTPayload,
        req,
        dataBuffer: Buffer,
        filename: string,
        res: Response
    ): Promise<Response> {
        try {

            let s3Response = '';
            let now = new Date();
            if (filename != 'default') {
                s3Response = await (await this.sharedService.uploadFile(dataBuffer, now.getTime() + '_' + filename, '', 's3-bucket-users')).result.toString();
                await this.sharedService.deleteObjectFromS3('s3-bucket-users', req.urlFile);
            } else {
                if (req.deleteFile == 1) {
                    await this.sharedService.deleteObjectFromS3('s3-bucket-users', req.urlFile);
                    s3Response = '';
                } else {
                    s3Response = req.urlFile;
                }
            }

            let createChargeDto = req;
            createChargeDto = {
                ...createChargeDto,
                chapterId: ObjectId(jwtPayload.idChapter),
                userId: ObjectId(jwtPayload.id),
                urlFile: s3Response,
            };
            if (createChargeDto.idCharge != ""){
                await this.chargesModel.findByIdAndUpdate(ObjectId(createChargeDto.idCharge),
                createChargeDto)
            }else{
                await this.chargesModel.create(createChargeDto);
            }

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

    //ENDPOINT QUE REGRESA UN LISTADO GENERAL DE TODAS LAS APORTACIONES 
    async findAll(
        jwtPayload: JWTPayload,
        res: Response,
    ): Promise<Response> {
        try {

            const charges = await this.chargesModel.aggregate([
                {
                    $match: {
                        chapterId: ObjectId(jwtPayload.idChapter),
                        status: 'Active'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'users',
                    }
                },
                {
                    $unwind: '$users'
                },
                {
                    $project: {
                        userId: '$users._id',
                        name: { $concat: ["$users.name", " ", "$users.lastName"] },
                        ammount: '$amount',
                        concept: '$concept',
                        urlFile: '$urlFile',
                        createdAt: '$createdAt',
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);

            return res.status(HttpStatus.OK).json({
                statusCode: this.servicesResponse.statusCode,
                message: this.servicesResponse.message,
                result: charges,
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

    //ENDPOINT PARA OBTENER UN GASTO EN ESPECIFICO
    async findOne(id: string, jwtPayload: JWTPayload, res: Response) {
        const charge = await this.chargesModel.findOne({
            _id: ObjectId(id),
        });

        if (!charge)
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(
                    new HttpException('EMAIL-ACCOUNT_NOT_FOUND.', HttpStatus.BAD_REQUEST),
                );

        return res.status(HttpStatus.OK).json({
            statusCode: this.servicesResponse.statusCode,
            message: this.servicesResponse.message,
            result: charge,
        });
    }


    //ENDPOINT PARA ELIMIAR UN GASTO
    async delete(id: string, res: Response): Promise<Response> {
        try {


            const objDelete = await this.chargesModel.findByIdAndUpdate(
                { _id: ObjectId(id) },
                { status: EstatusRegister.Deleted },
            );

            if (objDelete != null) {
                const objCharge = await this.chargesModel.find({ _id: ObjectId(id) });
                await this.sharedService.deleteObjectFromS3(
                    's3-bucket-users',
                    objCharge[0].urlFile.toString()
                );
            }

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

}
