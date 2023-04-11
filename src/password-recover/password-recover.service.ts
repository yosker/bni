/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { Response } from 'express';
import { hash } from 'bcrypt';


@Injectable()
export class PasswordRecoverService {
   

    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<User>,
        private readonly servicesResponse: ServicesResponse,
        private readonly sharedService: SharedService,
    ) { }

    async getNewPassword(email: string, res: Response): Promise<Response> {
        try {
            const user = await this.usersModel.findOne({
                email: email,
            });

            if (user) {
               
                await this.usersModel.updateOne(
                    { email: email }, { resetPassword: false },
                );
                
                //GENERAMOS UNA NUEVA CONTRASEÑA TEMPORAL 
                const pass = await this.sharedService.passwordGenerator(6);
                const plainToHash = await hash(pass, 10);

            } else {
                return res.status(HttpStatus.OK).json({
                    statusCode: 204,
                    message: 'USUARIO NO ENCONTRADO',
                    result: {},
                });
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
                        'INTERNAL_SERVER_ERROR.',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    ),
                );
        }
    }


}
function hash(pass: any, arg1: number) {
    throw new Error('Function not implemented.');
}

