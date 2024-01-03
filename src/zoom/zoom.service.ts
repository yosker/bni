import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { Response } from 'express';
import { ServicesResponse } from 'src/responses/response';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { JWTPayload } from 'src/auth/jwt.payload';
import { AttendanceType } from 'src/shared/enums/attendance.enum';
import { ChapterSession } from 'src/chapter-sessions/interfaces/chapterSessions.interface';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

const moment = require('moment-timezone');
const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class ZoomService {
  constructor(
    private httpService: HttpService,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    private servicesResponse: ServicesResponse,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
  ) {}

  /**
   * @description Obtiene el token atraves de Server-to-Server OAuth
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   
    Paso 1.- Obtener las credenciales de la colección chapters (filtro chapterId)
    Paso 2.- Generar un token en base64 Y Generar el access token 
    Paso 3.- Consultar la APi de zoom y obtener la lista de usuarios conectos (filtro meetingId)
    Paso 4.- Asignarle la asistencia a los nets y registro de visitantes
  */

  async handleAttendanceProcess(jwtPayload: JWTPayload, res: Response) {
    try {
      
      //OBTENEMOS EL OBJETO DEL CAPITULO
      const objChapter = await this.chapterModel.findById({_id: ObjectId(jwtPayload.idChapter)});

      //OBTENEMOS EL ACCES-TOKEN 
      const accessToken: any = await this.generateAccessToken(objChapter).catch(
        (error) => {
          throw new HttpException(error.message, error.status, error);
        },
      );
      
      //OBTENEMOS LA LISTA DE USUARIOS QUE ESTAN CONECTADOS
      const meeting: any = await this.getDataMeeting(
        objChapter.meetingId,
        accessToken,
      ).catch((error) => {
        console.log(error);
      });

      if (!meeting || meeting.length == 0) {
        return res.status(HttpStatus.OK).json({
          statusCode: this.servicesResponse.statusCode,
          message: 'No se encuentra la sesión enviada.',
          result: {},
        });
      }
      //REGISTRAMOS LA ASISTENCIA DE LOS NETS Y DE LOS INVITADOS (OBSERVADORES, INVITADOS Y )
      const obj = await this.setAttendanceUsers(meeting,ObjectId(jwtPayload.idChapter),jwtPayload);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
      });

    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  //PROMISE QUE REGRESA EL ACCESS TOKEN
  generateAccessToken = (objChapter: any): Promise<any> => {
    
    const clientID = objChapter.clientId; 
    const clientSecret = objChapter.clientSecret; 
    const accountID = objChapter.accountId;
    const authHeader = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

    return new Promise((resolve, rejected) => {
      this.httpService
        .post(`https://zoom.us/oauth/token`,
        {
          grant_type: 'account_credentials',
          account_id: accountID,
        }, 
        {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .forEach((value) => {
          resolve(value?.data.access_token);
        })
        .catch((error) => {
              rejected(`No se encuentra la sesión enviada, ${error.message}`);
        });
    });
  };

 //PROMISE QUE REGRESA LA LISTA DE USUARIOS REGISTRADOS
  getDataMeeting = (meetingId: any, tokenChapter: string): Promise<any> => {
    const headers = { Authorization: `Bearer ${tokenChapter}` };
    return new Promise((resolve, rejected) => {
      this.httpService
        .get(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
          headers,
        })
        .forEach((value) => {
          resolve(value?.data);
        })
        .catch((error) => {
          // Manejar el error de la solicitud
          rejected(`No se encuentra la sesión enviada, ${error.message}`);
        });
    });
  };

  //FUNCION QUE REGISTRA LA ASISTENCIA
  async setAttendanceUsers(
    meeting: any,
    chapterId: any,
    jwtPayload: JWTPayload
  ) {
    try {

      const dateAttendance = moment().format('YYYY-MM-DD');
      //SE VALIDA QUE EXISTA LA SESION (SE FILTRA POR CHAPTERID Y FECHA)
      const findChapterSession = await this.chapterSessionModel.findOne({
        chapterId: ObjectId(chapterId),
        sessionDate: dateAttendance,
      });

      if (!findChapterSession?._id)
        throw new HttpErrorByCode[404](
          'NOT_FOUND_CHAPTERSESSION',
          this.servicesResponse,
        );

      for (const element of meeting.registrants) {
        const registrant = element;

        const leaveTime = moment
          .utc(registrant.create_time)
          .tz(jwtPayload.timeZone)
          .toISOString();

        //BUSCAMOS AL USUARIO POR CORREO
        const user = await this.usersModel.findOne({
          email: registrant.email,
          idChapter: ObjectId(chapterId),
        });

        if (!user) {
          //SI NO SE ENCUENTRA EL USUARIO, SE CREA COMO VISITANTE
          const userVisitor = {
            idChapter: ObjectId(chapterId),
            email: registrant.email,
            name: registrant.first_name,
            role: 'Visitante',
            lastName: registrant.last_name,
            phoneNumber: registrant.phone,
            companyName: registrant.company,
            profession: registrant.profession,
            invitedBy: registrant.invitedBy,
            updatedAt: leaveTime,
          };
          const newUser = await this.usersModel.create(userVisitor);

          //SE CREA SU REGISTRO EN ATTENDANCE
          await this.attendanceModel.create(
            {
              userId: ObjectId(newUser._id),
              chapterId: ObjectId(chapterId),
              attendanceDate: dateAttendance,
              attendanceType: AttendanceType.OnZoom,
              chapterSessionId: ObjectId(findChapterSession._id),
            },
            {
              attended: true,
              updatedAt: leaveTime,
            },
          );
        } else {
          //DE LO CONTRARIO SE PASA ASISTENCIA AL NETWORKER O VISITANTE SI EXISTE
          if (user.role.toLowerCase() !== 'visitante') {

            await this.attendanceModel.findOneAndUpdate(
              {
                userId: ObjectId(user._id),
                chapterId: ObjectId(chapterId),
                attendanceDate: dateAttendance,
              },
              {
                attended: true,
                updatedAt: leaveTime,
                attendanceType: AttendanceType.OnZoom,
              },
            );
          } else if (user.role.toLowerCase() === 'visitante') {

            //SE VALIDA QUE SOLO EXISTA UN REGISTRO CON LA MISMA FECHA POR SESION EN ATTENDANCE 
            const attendanceRegister = await this.attendanceModel.findOne({  
              chapterId: ObjectId(chapterId),
              sessionDate: dateAttendance, 
              userId: user._id
             })

            if (attendanceRegister === null) //SE CREA SU ATTENDANCE 
              await this.attendanceModel.create({
                userId: ObjectId(user._id),
                chapterId: ObjectId(chapterId),
                attendanceDate: dateAttendance,
                attendanceType: AttendanceType.OnZoom,
                chapterSessionId: ObjectId(findChapterSession._id),
                attended: true,
                updatedAt: leaveTime,
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }



  async updateAttendaceNet(
    obj: any,
    jwtPayload: JWTPayload,
    res: Response): Promise<Response>{
      try {

        //BUSCAMOS EL ATTENDACEDATE DEL VISITANTE Y OBTENEMOS LA FECHA Y HORA DE REGISTRO
        const objAttendanceVisitor = await this.attendanceModel.findOne({
          userId: ObjectId(obj.idVisitor),
          chapterId: ObjectId(jwtPayload.idChapter),
          attendanceDate: obj.attendanceDate,
        })

      
       //ACTUALIZAMOS EL ROL DEL SUSTITUTO 
        await this.usersModel.updateOne({
          _id: ObjectId(obj.idVisitor),
          chapterId: ObjectId(jwtPayload.idChapter)
        }, 
        { 
           role:"Sustituto"
        });

        //ACTUALIZAMOS LA INFO DEL NETWORKER 
        await this.attendanceModel.updateOne({
          userId: ObjectId(obj.idNetworker),
          chapterId: ObjectId(jwtPayload.idChapter),
          attendanceDate: obj.attendanceDate,
        }, 
        { 
          attended: true,
          updatedAt: objAttendanceVisitor.updatedAt,
          attendanceType: AttendanceType.OnZoom,
        });

        return res.status(HttpStatus.OK).json({
          statusCode: this.servicesResponse.statusCode,
          message: this.servicesResponse.message,
          result: {},
        });
      }
      catch(error){
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


  ////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * @description Obtiene la Asistencia de los Usuarios del Meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async getUsersByMeetingId(createZoomDto: CreateZoomDto, res: Response) {
    try {
      const meeting = await this.getDataMeeting(
        createZoomDto.meetingId,
        createZoomDto.tokenChapter,
      ).catch(console.error);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meeting,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Actualiza Asistencia de los Usuarios que Ingresaron al Meet
   * @param createZoomDto Objecto para creación
   * @param res respuesta
   * @returns respuesta
   */
  async setUsersByMeetingId(
    jwtPayload: JWTPayload,
    res: Response,
    filters: any,
  ) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res.status(HttpStatus.OK).json({
          statusCode: 404,
          message: 'CHAPTER_TOKEN_NOT_FOUND.',
          result: {},
        });
      }

      const meeting: any = await this.getDataMeeting(
        chapter.meetingId,
        chapter.tokenChapter,
      ).catch((error) => {
        throw new HttpException(error.message, error.status, error);
      });

      if (!meeting || !meeting.length) {
        return res.status(HttpStatus.OK).json({
          statusCode: 404,
          message: 'No se encuentra la sesión enviada.',
          result: {},
        });
      }

      for (const element of meeting.registrants) {
        const registrant = element;
        //Buscamos al usuario por su email
        const user = await this.usersModel.findOne({
          email: registrant.email,
          idChapter: ObjectId(filters.chapterId),
        });

        const leaveTime = moment
          .utc(registrant.create_time)
          .tz(jwtPayload.timeZone)
          .toISOString();

        if (!user) {
          //Si no se Encuentra el Usuario, se Crea como Visitante
          const userVisitor = {
            idChapter: ObjectId(filters.chapterId),
            email: registrant.email,
            name: registrant.first_name,
            role: 'Visitante',
            lastName: registrant.last_name,
            phoneNumber: registrant.phone,
            companyName: registrant.company,
            profession: registrant.profession,
            invitedBy: registrant.invitedBy,
            updatedAt: leaveTime,
          };
          const newUser = await this.usersModel.create(userVisitor);

          //S le pasa asistencia al usuario nuevo
          const dateAttendance = moment().format('YYYY-MM-DD');
          const findChapterSession = await this.chapterSessionModel.findOne({
            chapterId: ObjectId(filters.chapterId),
            sessionDate: dateAttendance,
          });

          if (!findChapterSession?._id)
            throw new HttpErrorByCode[404](
              'NOT_FOUND_CHAPTERSESSION',
              this.servicesResponse,
            );

          await this.attendanceModel.create(
            {
              userId: ObjectId(newUser._id),
              chapterId: ObjectId(filters.chapterId),
              attendanceDate: dateAttendance,
              attendanceType: AttendanceType.OnZoom,
              chapterSessionId: ObjectId(findChapterSession._id),
            },
            {
              attended: true,
              updatedAt: leaveTime,
            },
          );
        } else {
          //De lo contrario se le pasa asistencia
          const dateAttendance = moment().format('YYYY-MM-DD');

          if (user.role.toLowerCase() !== 'visitante') {
            await this.attendanceModel.findOneAndUpdate(
              {
                userId: ObjectId(user._id),
                chapterId: ObjectId(filters.chapterId),
                attendanceDate: dateAttendance,
                attendanceType: AttendanceType.OnZoom,
              },
              {
                attended: true,
                updatedAt: leaveTime,
              },
            );
          } else if (user.role.toLowerCase() === 'visitante') {
            const findChapterSession = await this.chapterSessionModel.findOne({
              chapterId: ObjectId(filters.chapterId),
              sessionDate: dateAttendance,
            });

            if (!findChapterSession)
              throw new HttpErrorByCode[404](
                'NOT_FOUND_CHAPTERSESSION',
                this.servicesResponse,
              );

            await this.attendanceModel.create({
              userId: ObjectId(user._id),
              chapterId: ObjectId(filters.chapterId),
              attendanceDate: dateAttendance,
              attendanceType: AttendanceType.OnSite,
              chapterSessionId: ObjectId(findChapterSession._id),
              attended: true,
              updatedAt: leaveTime,
            });
          }
        }
      }

      // const sessionData = await this.getAttendanceUsersByDate(
      //   chapter.sessionDate,
      //   filters.chapterId,
      //   jwtPayload.timeZone,
      // );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {}, //sessionData,
      });
    } catch (error) {
      throw res.json(
        new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }

  /**
   * @description Obtiene el Token del Capítulo
   * @param chapterId Id de Capítulo
   * @param res token del Capítulo
   * @returns token
   */
  async findOne(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: chapter.tokenChapter,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Actualiza Token del Capítulo
   * @param id Id del Capítulo
   * @param updateZoomDto Objeto de Actualización
   * @param res respuesta
   * @returns respuesta
   */
  async updateTokenChapter(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId.toString(),
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      await this.chapterModel.findByIdAndUpdate(ObjectId(filters.chapterId), {
        $set: {
          tokenChapter: chapter.tokenChapter,
        },
      });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Valida si el Capítulo Existe
   * @param chapterId Id del Capítulo
   * @param session Fecha de la Sesión
   * @returns Capítulo
   */
  async validateChapterExist(chapterId: string, sessionDate: string) {
    try {
      const query = [
        {
          $match: {
            _id: ObjectId(chapterId),
          },
        },
        {
          $lookup: {
            from: 'chaptersessions',
            localField: '_id',
            foreignField: 'chapterId',
            as: 'chaptersessionsData',
          },
        },
        {
          $unwind: '$chaptersessionsData',
        },
        {
          $match: {
            'chaptersessionsData.sessionDate': sessionDate,
          },
        },
        {
          $project: {
            _id: 1,
            meetingId: '$meetingId',
            tokenChapter: '$tokenChapter',
            sessionDay: '$sessionDate',
            sessionSchedule: '$sessionSchedule',
            status: '$status',
            email: '$email',
            sessionDate: '$chaptersessionsData.sessionDate',
            sessionChapterDate: '$chaptersessionsData.sessionChapterDate',
          },
        },
      ];
      const chapter = await this.chapterModel.aggregate(query);
      if (!chapter || chapter.length == 0) return false;
      return chapter[0];
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * @description Obtiene la información de la sesión
   * @param chapterId Id del Capítulo
   * @param res Resultado
   * @returns Sesión por su Id
   */
  async getMeetings(res: Response, filters: any) {
    try {
      const chapter: any = await this.validateChapterExist(
        filters.chapterId,
        filters.sessionDate,
      );
      if (!chapter) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'CHAPTER_TOKEN_NOT_FOUND.',
              HttpStatus.BAD_REQUEST,
            ),
          );
      }

      const meetings = await this.getMeetingsList(chapter.tokenChapter);
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: meetings,
      });
    } catch (error) {
      throw res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
        );
    }
  }

  /**
   * @description Obtiene las sesiones dadas de alta por el usuario
   * @param tokenChapter Token del Capítulo
   * @returns Información del Mee
   */
  getMeetingsList = (tokenChapter: string): Promise<any> => {
    const headers = { Authorization: `Bearer ${tokenChapter}` };
    return new Promise((resolve, rejected) => {
      this.httpService
        .get(
          `https://api.zoom.us/v2/users/${
            process.env.ZOOM_USER_ID ?? 'jMOMCXLpRM6SuzoBtyyIQQ'
          }/meetings`,
          {
            headers,
          },
        )
        .forEach((value) => {
          resolve(value?.data);
        })
        .catch((error) => {
          // Manejar el error de la solicitud
          rejected(`No se encuentra la sesión enviada, ${error.message}`);
        });
    });
  };

  /**
   * @description Obtiene la Información de los Usuarios de por Fecha
   * @param attendanceDate Día de la Sesión
   * @param chapterId Id del Capítulo
   * @param timeZone Zona Horaria
   * @returns Arreglo de Usuarios
   */
  // async getAttendanceUsersByDate(
  //   attendanceDate: string,
  //   chapterId: string,
  //   timeZone: string,
  // ) {
  //   try {
  //     const query = [
  //       {
  //         $match: {
  //           chapterId: ObjectId(chapterId),
  //           attendanceDate,
  //           attended: true,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'users',
  //           localField: 'userId',
  //           foreignField: '_id',
  //           as: 'usersData',
  //         },
  //       },
  //       {
  //         $unwind: '$usersData',
  //       },
  //       {
  //         $project: {
  //           userId: '$usersData.id',
  //           name: '$usersData.name',
  //           lastName: '$usersData.lastName',
  //           email: '$usersData.email',
  //           imageURL: '$usersData.imageURL',
  //           phoneNumber: '$usersData.phoneNumber',
  //           attendanceDate: '$attendanceDate',
  //           updatedAt: '$updatedAt',
  //           localUpdatedAt: {
  //             $dateToString: {
  //               format: '%H:%M:%S',
  //               date: {
  //                 $dateFromString: {
  //                   dateString: '$updatedAt',
  //                   timezone: timeZone,
  //                   format: '%Y-%m-%dT%H:%M:%S.%LZ',
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ];
  //     return await this.attendanceModel.aggregate(query);
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  /**
   * @description Obtiene las Asistencias de los Usuarios
   * @param jwtPayload JSON para OBTENER INFORMACIÓN DEL USUARIO LOGUUEADO
   * @param res Resultado
   * @param filters Filtros
   * @returns Arreglo de usuarios
   */
  // async getUsersSessions(jwtPayload: JWTPayload, res: Response, filters: any) {
  //   try {
  //     const sessionData = await this.getAttendanceUsersByDate(
  //       filters.sessionDate,
  //       filters.chapterId,
  //       jwtPayload.timeZone,
  //     );

  //     return res.status(HttpStatus.OK).json({
  //       statusCode: this.servicesResponse.statusCode,
  //       message: this.servicesResponse.message,
  //       result: sessionData,
  //     });
  //   } catch (error) {
  //     throw res.json(
  //       new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR),
  //     );
  //   }
  // }
}
