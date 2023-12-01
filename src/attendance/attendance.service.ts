/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDTO } from './dto/attendance.dto';
import { ServicesResponse } from '../responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { User } from 'src/users/interfaces/users.interface';
import { Users } from 'src/users/schemas/users.schema';
import { ChapterSession } from 'src/chapter-sessions/interfaces/chapterSessions.interface';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { JWTPayload } from 'src/auth/jwt.payload';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { PaginateResult } from 'src/shared/pagination/pagination-result';
import { join } from 'path';

const ObjectId = require('mongodb').ObjectId;
const PDFDocument = require('pdfkit-table');
const moment = require('moment-timezone');

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<any>,
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
    private readonly servicesResponse: ServicesResponse,
    private readonly paginateResult: PaginateResult,
    private readonly sharedService: SharedService,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
  ) {}

  //ENDPOINT PARA ALMACENAR EL PASE DE LISTA DE LOS USUARIOS
  async update(
    attendanceDTO: AttendanceDTO,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    try {
      //VALIDAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS
      const existUser = await this.usersModel.findOne({
        _id: ObjectId(attendanceDTO.userId),
        idChapter: ObjectId(jwtPayload.idChapter),
        status: EstatusRegister.Active,
      });

      if (!existUser) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('USER_NOT_FOUND.', HttpStatus.BAD_REQUEST));
      }

      const currentDateZone = moment().tz(jwtPayload.timeZone);
      const currentDate = currentDateZone.format('YYYY-MM-DD');
      let authAttendance = false;

      //VALIDAMOS QUE LA SESION EXISTA EXISTA Y QUE ESTE ACTIVA
      const chapterSession = await this.chapterSessionModel.findOne({
        chapterId: ObjectId(jwtPayload.idChapter),
        sessionDate: currentDate,
        status: EstatusRegister.Active,
      });
      if (chapterSession != null) {
        authAttendance = true;
      }

      if (authAttendance) {
        //VALIDAMOS QUE EL USUARIO NO SE REGISTRE DOS VECES EL MISMO DIA EN LA COLECCION DE ASISTENCIA
        const userSession = await this.attendanceModel.findOne({
          userId: ObjectId(attendanceDTO.userId),
          attendanceDate: currentDate,
          chapterId: ObjectId(jwtPayload.idChapter),
          status: EstatusRegister.Active,
          attended: true,
        });

        if (userSession) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json(new HttpException('RECORD_DUPLICATED.', HttpStatus.CONFLICT));
        }

        attendanceDTO = {
          ...attendanceDTO,
          userId: ObjectId(attendanceDTO.userId),
          attended: true,
          updatedAt: jwtPayload.timeZone,
        };
        await this.attendanceModel.findOneAndUpdate(
          {
            userId: ObjectId(attendanceDTO.userId),
            attendanceDate: currentDate,
            chapterId: ObjectId(jwtPayload.idChapter),
          },
          attendanceDTO,
        );

        const pipeline = await this.AttendanceResult(
          jwtPayload.idChapter,
          currentDate,
          attendanceDTO.userId.toString(),
          1,
          jwtPayload.timeZone,
        );

        const userData = await this.attendanceModel.aggregate(pipeline);

        return res.status(HttpStatus.OK).json({
          statusCode: this.servicesResponse.statusCode,
          message: this.servicesResponse.message,
          result: userData[0],
        });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'ATTENDANCE_NOT_AUTHORIZED.',
              HttpStatus.UNAUTHORIZED,
            ),
          );
      }
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

  //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE SE REGISTRARON EN LA SESION
  async VisitorsList(
    chapterId: string,
    sessionDate: string,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    try {
      const dateMexico = moment(sessionDate, 'YYYY-MM-DD').tz(
        jwtPayload.timeZone,
      );
      const dateUTC = dateMexico.clone().tz('UTC');
      const sessionDateUTC = dateUTC.format('YYYY-MM-DD');
      const startDate = moment.utc(sessionDateUTC, 'YYYY-MM-DD').toISOString();
      const endDate = moment
        .utc(sessionDateUTC, 'YYYY-MM-DD')
        .endOf('day')
        .toISOString();

      const visitorList = await this.usersModel.find(
        {
          idChapter: ObjectId(chapterId),
          role: 'Visitante',
          status: EstatusRegister.Active,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        {
          name: 1,
          lastName: 1,
          companyName: 1,
          profession: 1,
          invitedBy: 1,
          completedApplication: 1,
          completedInterview: 1,
          email: 1,
          createdAt: 1,
        },
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: visitorList,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw res.status(err.getStatus()).json(err.getResponse());
      } else {
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

  //ENDPOINT QUE REGRESA EL LISTADO DE USUARIOS QUE REGISTRARON ASISNTENCIA
  async NetworkersList(
    chapterId: string,
    sessionDate: string,
    res: Response,
    jwtPayload: JWTPayload,
  ): Promise<Response> {
    try {
      const pipeline = await this.AttendanceResult(
        ObjectId(chapterId),
        sessionDate,
        ObjectId(0),
        0,
        jwtPayload.timeZone,
      );

      const userData = await this.attendanceModel.aggregate(pipeline);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: userData,
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

  //PIPELINE PARA REGRESAR LOS DATOS DEL USUARIO (NETWORKER) CUANDO SE REGISTRA
  private async AttendanceResult(
    chapterId: string,
    attendaceDate: string,
    userId: string,
    queryType: number,
    timeZone: string,
  ) {
    try {
      const filter = {
        chapterId: ObjectId(chapterId),
        attendanceDate: attendaceDate,
        attended: true,
      };
      if (queryType == 1) {
        filter['userId'] = ObjectId(userId);
      }

      return [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData',
          },
        },
        {
          $unwind: '$userData',
        },
        {
          $match: {
            role: {
              $ne: 'Visitante',
            },
          },
        },
        {
          $project: {
            name: {
              $concat: ['$userData.name', ' ', '$userData.lastName'],
            },
            imageUrl: '$userData.imageURL',
            attendanceDate: '$attendanceDate',
            createdAt: {
              $toDate: '$createdAt', // Convertir a tipo Date
            },
            attendanceHour: {
              $dateToString: {
                format: '%H:%M:%S',
                date: {
                  $toDate: '$createdAt', // Convertir a tipo Date nuevamente
                },
                timezone: timeZone,
              },
            },
            companyName: '$userData.companyName',
            profession: '$userData.profession',
          },
        },
      ];
    } catch (error) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  async getNoAttendances(
    res: Response,
    jwtPayload: JWTPayload,
    skip = 0,
    limit?: number,
  ) {
    try {
      const pipeline: any = await this.noAttendanceResult(
        jwtPayload.idChapter,
        skip,
        limit,
      );

      const noAttendances = await this.attendanceModel.aggregate(pipeline);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: await this.paginateResult.getResult(noAttendances),
        total: await this.paginateResult.getTotalResults(noAttendances),
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

  private async noAttendanceResult(
    chapterId: string,
    skip: number,
    limit: number,
  ) {
    const now = moment().toISOString();
    const lte = moment(now).toISOString();
    const filter = {
      chapterId: ObjectId(chapterId),
      attendanceDate: {
        $lte: lte.split('T').shift(),
      },
      attended: false,
    };

    return [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'usersData',
        },
      },
      {
        $unwind: '$usersData',
      },
      {
        $match: {
          'usersData.role': {
            $nin: ['Visitante'],
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          userId: '$usersData._id',
          attendanceDate: '$attendanceDate',
          attended: '$attended',
          name: '$usersData.name',
          lastName: '$usersData.lastName',
          companyName: '$usersData.companyName',
          letterSent: '$letterSent',
        },
      },
      {
        $sort: {
          name: 1,
          attendanceDate: 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            {
              $skip: skip > 0 ? (skip - 1) * limit : 0,
            },
            { $limit: limit },
          ],
        },
      },
    ];
  }

  //ENDPOINT PARA ARMAR LA CARTA Y ENVIAR POR CORREO. TAMBIÉN SE EDITA EL ESTATUS A CARTA ENVIADA

  async sendLetter(
    id: string,
    attendanceNumber: number,
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    try {
      await this.attendanceModel.updateOne(
        {
          _id: ObjectId(id),
          chapterId: ObjectId(jwtPayload.idChapter),
        },
        {
          letterSent: true,
        },
      );

      const attendance = await this.attendanceModel.findById({
        _id: ObjectId(id),
      });
      const objUser = await this.usersModel.findById({
        _id: ObjectId(attendance.userId),
      });

      //CREAMOS EL ARCHIVO
      const pdfBuffer = await this.createLetter(objUser, attendanceNumber);
      //ENVIAMOS EL CORREO CON LA CARTA ADJUNTA
      await this.sendEmail(objUser, pdfBuffer);

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

  async createLetter(objUser: any, attendanceNumber: number) {
    try {
      const pdfBuffer: Buffer = await new Promise((resolve) => {
        const doc = new PDFDocument({
          size: 'LETTER',
          bufferPages: true,
          autoFirstPage: false,
        });

        doc.on('pageAdded', () => {
          doc.image(join(process.cwd(), 'src/assets/logo.png'), 20, 15, {
            width: 67,
          });
          doc.moveTo(50, 55);

          const bottom = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;
          doc.image(
            join(process.cwd(), 'src/assets/footer.png'),
            (doc.page.width - -165) * 0.5,
            doc.page.height - 105,
            { width: 200 },
          );
          doc.page.margins.bottom = bottom;
        });

        const attendanceDescriptionHeader =
          attendanceNumber == 2 ? 'Segunda' : 'Tercera';

        doc.addPage();
        doc.text('', 0, 50);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(
          `Carta de Advertencia sobre la Asistencia: ${attendanceDescriptionHeader} Falta`,
          {
            width: doc.page.width,
            align: 'center',
          },
        );

        const currentDate = moment().format('YYYY-MM-DD');
        doc.text('', 80, 80);
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`Fecha: ${currentDate}`, {
          width: doc.page.width - 125,
          align: 'right',
        });
        doc.moveDown();
        doc.text(`Estimada ${objUser.name + ' ' + objUser.lastName}:`, {
          width: doc.page.width,
          align: 'left',
        });

        const attendanceDescription = attendanceNumber == 2 ? 'dos' : 'tres';

        doc.moveDown();
        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          ` Hemos asumido un compromiso con nosotros mismos y con los demás Miembros para crear una organización positiva que resulte en el incremento del volumen de negocios para todos. Con la finalidad de lograrlo, todos tenemos que cumplir con la política de asistencia. Por favor consulta la Política General de BNI® #5.“La asistencia es fundamental para el Capítulo. Si un Miembro no puede asistir, deberá mandar a un sustituto (no un Miembro de su Capítulo) a la junta. 
        Esto no contará como falta. A cada Miembro se le permitirán tres faltas en un periodo de seis meses. Más de esto y la clasificación del miembro está sujeta a ser abierta por el Comité de Membresías”. La experiencia demuestra que el éxito de un Capítulo puede estar estrechamente relacionado con la asistencia.
        Después de revisar los registros de asistencia del Capítulo, nos dimos cuenta de que has faltado ${attendanceDescription} veces en los últimos seis meses. La política de BNI®, la cual te comprometiste a cumplir, establece que un Miembro puede tener tres faltas cada seis meses. No te es permitido acumular más faltas durante el periodo actual.
        Para revisar cuanto haz faltado, entra en BNI Connect®. Ve a Reportes > Reporte de asistencia PALMS. La fecha dada por default será aproximadamente los últimos 6 meses. Puedes editar el rango de las fechas. Podrás ver cada fecha y con una letra A en color rojo las fechas que has faltado.
        Te invitamos a buscar un sustituto que participe en tu lugar en caso de que te sea imposible asistir. Primero, un sustituto apropiado en este caso podría no contarte como falta. Segundo, ¡tener un sustituto adecuado daría continuidad en el Capítulo para pasar referencias! Finalmente, otros Miembros apreciarían tu consideración y reconocerían tu compromiso. Cuando pienses en quién puede ser tu sustituto, no olvides a tus clientes. ¿Quién mejor para darte a conocer en nuestro Capítulo?
        La asistencia, por lo tanto, es crítica para el Capítulo y es un requisito para mantener la membresía. Tenemos que recordarte que fallar en el cumplimiento de las políticas de BNI® podría resultar en la finalización de tu membresía actual. Por ese motivo, por favor haz todo lo posible para estar presente en las juntas o buscar un sustituto. ¡Gracias por tu entusiasta participación!
         `,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('Atentamente,', {
          width: doc.page.width,
          align: 'left',
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(10);
        doc.text('El Comité de Membresías', {
          width: doc.page.width,
          align: 'left',
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(10);
        doc.text('Capítulo BNI® Alianza Empresarial', {
          width: doc.page.width,
          align: 'left',
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(10);
        doc.text('CC: Presidente del Capítulo', {
          width: doc.page.width,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(10);
        doc.text('Oficina Regional de BNI®', {
          width: doc.page.width,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(10);
        doc.text('Director /Director Consultor de BNI®', {
          width: doc.page.width,
          align: 'left',
        });

        const buffer = [];

        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
        doc.end();
      });

      return pdfBuffer;
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  async sendEmail(objUser: any, pdfBuffer: any) {
    try {
      const chapter = await this.chapterModel.findById(objUser.idChapter);

      const emailProperties = {
        emailConfigAut: chapter.email,
        passwordAut: chapter.password,
        template: 'empty',
        subject: 'Carta de inasistencia',
        amount: '',
        name: '',
        to: objUser.email,
        user: '',
        pass: '',
        urlPlatform: '',
        file: pdfBuffer,
      };
      await this.sharedService.sendMailer(emailProperties, true);
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }
}
