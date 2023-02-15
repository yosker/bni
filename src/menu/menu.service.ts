import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class MenuService {
    constructor(
        @InjectModel(Users.name) private readonly usersModel: Model<User>,
        @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
        private servicesResponse: ServicesResponse,
    ) { }

    //ENDPOINT QUE REGRESA EL MENU PARA EL BACKOFFICE Y APP 
    async menu(userId: string, role: string, chapterId: string, res: Response): Promise<Response> {
        try {
            let objMenu = {};

            //OBTENEMOS LA INFORMACIÓN GENERAL DEL USUARIO
            const objUser = await this.usersModel.findOne({
                _id: ObjectId(userId),
                idChapter: ObjectId(chapterId),
                role: role,
                status: 'Active',
            });
            const chapter = await this.chapterModel.findOne({ _id: ObjectId(chapterId) });
            if (role == 'Presidente') {
                objMenu = await this.administratorMenu(chapter.name, objUser);
            }
            if (role == 'Membresias') {
                objMenu = await this.membershipsMenu(chapter.name, objUser);
            }

            return res.status(HttpStatus.OK).json({
                statusCode: this.servicesResponse.statusCode,
                message: this.servicesResponse.message,
                result: objMenu,
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

    async administratorMenu(chapter: any, objUser: any) {

        const menu = {
            perfil: {
                "idUsuario": 0,
                "nombreUsuario": objUser.name + ' ' + objUser.lastName,
                "avatar": objUser.imageURL,
                "rol": objUser.role,
                "idJerarquia": 0,
                "nombreCompania": chapter,
            },
            modulos: [{
                "nombre": "Networkers",
                "estilo": "contact_page",
                "ordenModulo": 1,
                "subModulos": [
                    {
                        "idSubModulo": 1,
                        "nombre": "Agregar Networker",
                        "urlPagina": "usersform.html",
                        "ordenModulo": 1,
                        "estilo": ""
                    },
                    {
                        "idSubModulo": 2,
                        "nombre": "Consultar Networkers",
                        "urlPagina": "userslist.html",
                        "ordenModulo": 2,
                        "estilo": ""
                    }]
            },
            {
                "nombre": "Visitantes",
                "estilo": "contact_page",
                "ordenModulo": 2,
                "subModulos": [
                    {
                        "idSubModulo": 3,
                        "nombre": "Consultar Visitantes",
                        "urlPagina": "visitorslist.html",
                        "ordenModulo": 1,
                        "estilo": ""
                    }]
            }
        ],
            notificaciones: []
        }
        return menu;
    };

    async membershipsMenu(chapter: any, objUser: any) {

        const menu = {
            perfil: {
                "idUsuario": 0,
                "nombreUsuario": objUser.name + ' ' + objUser.lastName,
                "avatar": objUser.imageURL,
                "rol": objUser.role,
                "idJerarquia": 0,
                "nombreCompania": chapter,
            },
            modulos: [{
                "nombre": "Networkers",
                "estilo": "contact_page",
                "ordenModulo": 1,
                "subModulos": [
                    {
                        "idSubModulo": 1,
                        "nombre": "Agregar Networker",
                        "urlPagina": "usersform.html",
                        "ordenModulo": 1,
                        "estilo": ""
                    },
                    {
                        "idSubModulo": 2,
                        "nombre": "Consultar Networkers",
                        "urlPagina": "userslist.html",
                        "ordenModulo": 2,
                        "estilo": ""
                    }]
            }],
            notificaciones: []
        }
        return menu;
    };
};