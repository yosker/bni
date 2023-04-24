import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ServicesResponse } from 'src/responses/response';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const ObjectId = require('mongodb').ObjectId;

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    private servicesResponse: ServicesResponse,
  ) {}

  //ENDPOINT QUE REGRESA EL MENU PARA EL BACKOFFICE Y APP
  async menu(
    userId: string,
    role: string,
    chapterId: string,
    res: Response,
  ): Promise<Response> {
    try {
      let objMenu = {};

      //OBTENEMOS LA INFORMACIÓN GENERAL DEL USUARIO
      const objUser = await this.usersModel.findOne({
        _id: ObjectId(userId),
        idChapter: ObjectId(chapterId),
        role: role,
        status: EstatusRegister.Active,
      });
      const chapter = await this.chapterModel.findOne({
        _id: ObjectId(chapterId),
      });
      if (role == 'Presidente') {
        objMenu = await this.administratorMenu(chapter.name, objUser);
      }
      if (role == 'Membresías') {
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
    let lastName = objUser.lastName == undefined ? '' : objUser.lastName;
    const menu = {
      perfil: {
        idUsuario: 0,
        nombreUsuario: objUser.name + ' ' + lastName,
        avatar: objUser.imageURL,
        rol: objUser.role,
        idJerarquia: 0,
        nombreCompania: chapter,
      },
      modulos: [
        {
          nombre: 'Capítulo',
          estilo: 'settings',
          ordenModulo: 0,
          subModulos: [
            {
              idSubModulo: 0,
              nombre: 'Configuración capítulo',
              urlPagina: 'chapterform.html',
              ordenModulo: 1,
              estilo: '',
            },
            {
              idSubModulo: 1,
              nombre: 'Usuarios Sesión Online',
              urlPagina: 'onlineUsersform.html',
              ordenModulo: 2,
              estilo: '',
            },
          ],
        },

        {
          nombre: 'Networkers',
          estilo: 'groups',
          ordenModulo: 1,
          subModulos: [
            {
              idSubModulo: 1,
              nombre: 'Agregar Networker',
              urlPagina: 'usersform.html',
              ordenModulo: 1,
              estilo: '',
            },
            {
              idSubModulo: 2,
              nombre: 'Consultar Networkers',
              urlPagina: 'userslist.html',
              ordenModulo: 2,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Visitantes',
          estilo: 'contact_page',
          ordenModulo: 2,
          subModulos: [
            {
              idSubModulo: 3,
              nombre: 'Consultar Visitantes',
              urlPagina: 'visitorslist.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Cuentas de correo',
          estilo: 'contact_mail',
          ordenModulo: 3,
          subModulos: [
            {
              idSubModulo: 4,
              nombre: 'Cuentas de correo',
              urlPagina: 'emailaccounts.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Periodos de prueba',
          estilo: 'engineering',
          ordenModulo: 4,
          subModulos: [
            {
              idSubModulo: 5,
              nombre: 'Periodo de pruebas',
              urlPagina: 'evaluationperiod.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Actividad membresías',
          estilo: 'checklist',
          ordenModulo: 5,
          subModulos: [
            {
              idSubModulo: 6,
              nombre: 'Asignar actividad',
              urlPagina: 'activities.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },

        {
          nombre: 'Carta por faltas',
          estilo: 'outgoing_mail',
          ordenModulo: 6,
          subModulos: [
            {
              idSubModulo: 7,
              nombre: 'Carta por faltas',
              urlPagina: 'absencesform.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Tesorería',
          estilo: 'payments',
          ordenModulo: 7,
          subModulos: [
            {
              idSubModulo: 8,
              nombre: 'Aportaciones',
              urlPagina: 'contributionList.html',
              ordenModulo: 1,
              estilo: '',
            },
            {
              idSubModulo: 9,
              nombre: 'Gastos',
              urlPagina: 'chargesList.html',
              ordenModulo: 2,
              estilo: '',
            },
            {
              idSubModulo: 10,
              nombre: 'Ingresos - Gastos',
              urlPagina: 'report.html',
              ordenModulo: 2,
              estilo: '',
            },
          ],
        },
      ],
      notificaciones: [],
    };
    return menu;
  }

  async membershipsMenu(chapter: any, objUser: any) {
    const menu = {
      perfil: {
        idUsuario: 0,
        nombreUsuario: objUser.name + ' ' + objUser.lastName,
        avatar: objUser.imageURL,
        rol: objUser.role,
        idJerarquia: 0,
        nombreCompania: chapter,
      },
      modulos: [
        {
          nombre: 'Networkers',
          estilo: 'contact_page',
          ordenModulo: 1,
          subModulos: [
            {
              idSubModulo: 1,
              nombre: 'Agregar Networker',
              urlPagina: 'usersform.html',
              ordenModulo: 1,
              estilo: '',
            },
            {
              idSubModulo: 2,
              nombre: 'Consultar Networkers',
              urlPagina: 'userslist.html',
              ordenModulo: 2,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Visitantes',
          estilo: 'contact_page',
          ordenModulo: 2,
          subModulos: [
            {
              idSubModulo: 3,
              nombre: 'Consultar Visitantes',
              urlPagina: 'visitorslist.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Periodos de prueba',
          estilo: 'engineering',
          ordenModulo: 4,
          subModulos: [
            {
              idSubModulo: 5,
              nombre: 'Periodo de pruebas',
              urlPagina: 'evaluationperiod.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
        {
          nombre: 'Trabajo membresías',
          estilo: 'checklist',
          ordenModulo: 6,
          subModulos: [
            {
              idSubModulo: 7,
              nombre: 'Actividades membresías',
              urlPagina: 'activitiesform.html',
              ordenModulo: 1,
              estilo: '',
            },
          ],
        },
      ],
      notificaciones: [],
    };
    return menu;
  }
}
