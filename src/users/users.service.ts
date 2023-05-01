import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './schemas/users.schema';
import { ServicesResponse } from '../responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/interfaces/roles.interface';
import { Roles } from 'src/roles/schemas/roles.schema';
import { hash } from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { Response } from 'express';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { JWTPayload } from 'src/auth/jwt.payload';
import { ChapterSession } from 'src/chapter-sessions/interfaces/chapterSessions.interface';
import { Attendance } from 'src/attendance/interfaces/attendance.interfaces';
import { AttendanceType } from 'src/shared/enums/attendance.enum';
import { Chapter } from 'src/chapters/interfaces/chapters.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersInterview } from 'src/users-interviews/interfaces/users-interview.interface';
import { join } from 'path';

const moment = require('moment-timezone');
const ObjectId = require('mongodb').ObjectId;
const PDFDocument = require('pdfkit-table');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel(Roles.name) private readonly rolesModel: Model<Role>,
    private readonly sharedService: SharedService,
    private servicesResponse: ServicesResponse,
    private jwtService: JwtService,
    @InjectModel('ChapterSession')
    private readonly chapterSessionModel: Model<ChapterSession>,
    @InjectModel('Attendance')
    private readonly attendanceModel: Model<Attendance>,
    @InjectModel('Chapter') private readonly chapterModel: Model<Chapter>,
    @InjectModel('UsersInterview')
    private readonly usersInterviewModel: Model<UsersInterview>,
  ) {}

  //ENDPOINT QUE REGRESA UNA LISTA DE TODOS LOS USUARIOS
  async findAll(
    chapterId: string,
    role: string,
    res: Response,
  ): Promise<Response> {
    try {
      const filter = {
        ['idChapter']: ObjectId(chapterId),
        ['status']: EstatusRegister.Active,
      };
      filter['role'] =
        role == 'nets' ? { $ne: 'Visitante' } : { $eq: 'Visitante' };

      const user = await this.usersModel.aggregate([
        {
          $match: filter,
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: user,
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

  //ENDPOINT QUE REGRESA LA INFORAMCION DE UN USUARIO Y LA BUSQUEDA ES POR ID
  async findOne(id: string, res: Response): Promise<Response> {
    try {
      const user = await this.usersModel.findById({ _id: ObjectId(id) });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: user,
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

  //ENDPOINT PARA DAR DE ALTA NUEVOS USUARIOS
  async create(
    dataBuffer: Buffer,
    filename: string,
    req,
    res: Response,
  ): Promise<Response> {
    const findRole = this.rolesModel.findOne({
      name: req.role,
    });
    const { result } = this.servicesResponse;
    if (!findRole)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new HttpException('ROLE_NOT_FOUND.', HttpStatus.BAD_REQUEST));

    try {
      const pass = await this.sharedService.passwordGenerator(6);
      const plainToHash = await hash(pass, 10);
      let createUserDto = req;

      const s3Response =
        filename != 'avatar.jpg'
          ? await (
              await this.sharedService.uploadFile(
                dataBuffer,
                filename,
                '.jpg',
                's3-bucket-users',
              )
            ).result
          : '';
      createUserDto = {
        ...createUserDto,
        password: plainToHash,
        idChapter: ObjectId(createUserDto.idChapter),
        invitedBy: '-',
        imageURL: s3Response,
      };

      const newUser = await this.usersModel.create(createUserDto);
      if (newUser != null) {
        const url =
          process.env.URL_NET_PLATFORM +
          '?id=' +
          newUser._id.toString() +
          '&chapterId=' +
          newUser.idChapter.toString();

        const chapter = await this.chapterModel.findById(newUser.idChapter);
        // OBJETO PARA EL CORREO
        const emailProperties = {
          emailConfigAut: chapter.email,
          passwordAut: chapter.password,
          template: process.env.NETWORKERS_WELCOME_TEMPLATE,
          subject: process.env.SUBJECT_CHAPTER_WELCOME,
          name: newUser.name + ' ' + newUser.lastName,
          user: newUser.email,
          pass: pass,
          urlPlatform: url,
          amount: '',
          to: newUser.email,
        };
        await this.sharedService.sendMailer(emailProperties, false);
      }

      if (newUser.role.toLowerCase() != 'visitante') {
        //Setea las fechas de sesion del usuario
        await this.setUserSessions(newUser._id, newUser.idChapter.toString());
      }

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(HttpStatus.OK).json({
          statusCode: 409,
          message: 'RECORD_DUPLICATED',
          result: result,
        });
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  //ENDPOINT PARA GUARDAR EL REGISTRO DE LOS VISITANTES
  async createVisitor(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<Response> {
    const findRole = this.rolesModel.findOne({
      name: createUserDto.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('NOT_FOUND_ROLE', this.servicesResponse);

    try {
      createUserDto = {
        ...createUserDto,
        idChapter: ObjectId(createUserDto.idChapter),
        resetPassword: false,
      };
      await this.usersModel.create(createUserDto);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: {},
      });
    } catch (error) {
      if (error.code === 11000) {
        throw res
          .status(HttpStatus.BAD_REQUEST)
          .json(new HttpException('DUPLICATED_REGISTER.', HttpStatus.CONFLICT));
      } else {
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

  //ENDPOINT PARA ACTUALIZAR LA INFORMACIÓN DE LOS USUARIOS
  async update(
    dataBuffer: Buffer,
    filename: string,
    req,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    const findRole = this.rolesModel.findOne({
      name: req.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('ROLE_NOT_FOUND', this.servicesResponse);
    try {
      let _updateUserDto = req;
      let s3Response = '';

      if (filename != 'avatar.jpg') {
        s3Response = await (
          await this.sharedService.uploadFile(
            dataBuffer,
            filename,
            '.jpg',
            's3-bucket-users',
          )
        ).result.toString();
        await this.sharedService.deleteObjectFromS3(
          's3-bucket-users',
          req.s3url,
        );
      } else {
        if (req.deleteAll) {
          await this.sharedService.deleteObjectFromS3(
            's3-bucket-users',
            req.s3url,
          );
        } else {
          s3Response = req.s3url;
        }
      }

      _updateUserDto = {
        ..._updateUserDto,
        imageURL: s3Response,
      };
      await this.usersModel.findByIdAndUpdate(
        ObjectId(_updateUserDto.id),
        _updateUserDto,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(HttpStatus.OK).json({
          statusCode: 409,
          message: 'RECORD_DUPLICATED',
          result: result,
        });
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async updateVisitor(
    id: string,
    updateUserDto: UpdateUserDto,
    res: Response,
  ): Promise<Response> {
    try {
      updateUserDto = {
        ...updateUserDto,
        idChapter: ObjectId(updateUserDto.idChapter),
      };

      await this.usersModel.findByIdAndUpdate(ObjectId(id), updateUserDto);

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

  //ENDPOIT QUE REGRESA LA INFO GENERAL DEL USUARIO JUNTO CON UN QR PARA LA ASISTENCIA
  async findNetworkerData(
    id: string,
    chapterId: string,
    res: Response,
  ): Promise<Response> {
    try {
      const findUser = await this.usersModel.findOne({
        _id: ObjectId(id),
        idChapter: ObjectId(chapterId),
        status: EstatusRegister.Active,
      });

      const dataUser = {
        name: findUser.name + ' ' + findUser.lastName,
        companyName: findUser.companyName,
        profession: findUser.profession,
        imageURL: findUser.imageURL,
        // qr: qrCreated,
      };
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: dataUser,
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

  //ENDPOINT PARA ELIMINAR (BAJA LOGICA) UN REGISTRO DE LA BASE DE DATOS
  async delete(
    userId: string,
    chapterId: string,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;

    try {
      await this.usersModel.deleteOne({ _id: ObjectId(userId) });

      await this.deleteUserSessions(userId, chapterId);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (error) {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  //ENDPOINT QUE REGRESA UNA LISTA DE USUARIOS (TIPO NETS)
  async findUsersMembership(
    jwtPayload: JWTPayload,
    res: Response,
  ): Promise<Response> {
    try {
      const users = await this.usersModel.find(
        {
          idChapter: ObjectId(jwtPayload.idChapter),
          status: EstatusRegister.Active,
          role: ['Membresías', 'Vicepresidente'],
        },
        { _id: 1, name: 1, lastName: 1 },
      );

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: users,
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

  //ENDPOINT PARA ACTUALIZAR LA URL DE LA SOLICIUD
  async updateAplicationField(
    id: string,
    req,
    dataBuffer: Buffer,
    filename: string,
    res: Response,
  ) {
    try {
      const userDTO = await this.usersModel.findOne({
        _id: ObjectId(id),
      });

      if (!userDTO)
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new HttpException(
              'Lo sentimos, invitado no encontrado.',
              HttpStatus.BAD_REQUEST,
            ),
          );

      let s3Response = '';
      const now = new Date();

      // ESCENARIO 1 SE GUARDA CON ARCHIVO
      // ESCENARIO 2 SE GUARDA SIN ARCHIVO
      // ESCENARIO 3 SE EDITA CON EL MISMO ARCHIVO
      // ESCENARIO 4 SE EDITA SIN ARCHIVO
      // ESCENARIO 5 SE EDITA ELIMINANDO EL ARCHIVO
      // ESCENARIO 6 SE EDITA CON OTRO ARCHIVO Y SE ELIMINA EL QUE TENIA

      if (req.scenario == 1) {
        s3Response = await (
          await this.sharedService.uploadFile(
            dataBuffer,
            now.getTime() + '_' + filename,
            '',
            's3-bucket-users',
          )
        ).result.toString();
      }
      if (req.scenario == 3) {
        s3Response = req.urlFile;
      }
      if (req.scenario == 5) {
        await this.sharedService.deleteObjectFromS3(
          's3-bucket-users',
          req.urlFile,
        );
        s3Response = '';
      }
      if (req.scenario == 6) {
        await this.sharedService.deleteObjectFromS3(
          's3-bucket-users',
          req.urlFile,
        );
        s3Response = await (
          await this.sharedService.uploadFile(
            dataBuffer,
            now.getTime() + '_' + filename,
            '',
            's3-bucket-users',
          )
        ).result.toString();
      }

      await this.usersModel.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          completedApplication: s3Response,
        },
      );

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

  //ENDPOINT QUE REGRESA LA URL DE ARCHIVO (SOLICITUD)
  async getApplicationFile(id: string, res: Response): Promise<Response> {
    try {
      const user = await this.usersModel.findById({ _id: ObjectId(id) });

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: user.completedApplication,
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

  private async setUserSessions(userId: string, chapterId: string) {
    try {
      const chapterSessions = await this.chapterSessionModel.find({
        sessionChapterDate: {
          $gte: moment().toISOString(),
        },
      });

      chapterSessions.forEach(async (session) => {
        const attendance: any = {
          chapterId: ObjectId(chapterId),
          chapterSessionId: Object(session._id),
          userId: ObjectId(userId),
          attended: false,
          attendanceType: AttendanceType.OnSite,
          attendanceDate: session.sessionDate,
          createdAt: moment().toISOString(),
        };
        await this.attendanceModel.create(attendance);
      });
    } catch {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  private async deleteUserSessions(userId: string, chapterId: string) {
    try {
      await this.attendanceModel.deleteMany({
        userId: ObjectId(userId),
        chapterId: ObjectId(chapterId),
      });
    } catch {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  //ENDPOINT PARA EXPORTAR LA ENTREVISTA A PDF

  public async createFile(userInterviewId: string): Promise<Buffer> {
    try {
      const pipeline: any = await this.resultQuery(userInterviewId);
      const objInterview = await this.usersInterviewModel.aggregate(pipeline);

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

        doc.addPage();

        doc.text('', 0, 60);
        doc.font('Helvetica-Bold').fontSize(12);
        doc.text(`Entrevista Candidatos`, {
          width: doc.page.width,
          align: 'center',
        });

        const dateInterview = objInterview[0].dateOfInterview;
        const table = {
          headers: ['', ''],
          rows: [
            [`Fecha:${dateInterview}`, `Hora Fin:${objInterview[0].finalDate}`],
            [
              `Nombre: ${objInterview[0].interviwedName}`,
              `Empresa: ${objInterview[0].companyName}`,
            ],
            [`5. Especialidad / Giro: ${objInterview[0].profession}`, ``],
          ],
          options: {
            divider: {
              header: { disabled: false, width: 0.5, opacity: 0.5 },
              vertical: { disabled: false, width: 1, opacity: 0.5 },
            },
          },
        };
        doc.moveDown();
        doc.table(table, { columnSize: [150, 300] });

        //PREGUNTA 1
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('1. ¿Qué fue lo que más te gustó de la junta?', {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question1}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 2
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('2. ¿Por qué?', {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question2}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 3
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(
          '3. ¿Por qué crees que BNI puede ser benéfico para ti y para tu negocio?',
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question3}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 4
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(
          '4. ¿Sabes para qué estamos aquí? ¿Sabes lo que es una entrevista en BNI? Sin importar quién realice la entrevista, no podrá aceptar la solicitud, si no tiene la certeza de que:',
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`a.- Eres un gran profesional. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`b.- Entiendes perfectamente los compromisos. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`c.-Puedes cumplir con los mismos. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 5
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text('¿Estás cómodo con esto? ', {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question5}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 6
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(
          'En caso de ser aceptado. ¿Estás en posibilidad de pagar tu membresía de inmediato? ',
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question6}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 7
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`5. Los compromisos y explicación.`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`a.- Asistencia-Puntualidad. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`b.- Capacitación. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`c.- Aportación-Participación. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`d.- Lista 40 contactos. OK`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 6
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`6. ¿Hay algún motivo por el cual no puedas cumplir esto? `, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question8}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 7
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`7. ¿Cuál es tu Producto estrella? `, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question9}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 8
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`8. ¿Quién podría ser un buen cliente / Conector para ti? `, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question10}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 9
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`9. ¿Cómo podría iniciar una conversación sobre ti?  `, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question11}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 10
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(
          `10. Del 1 al 10 Valora el compromiso de los demás miembros del capítulo, en relación a:`,
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(
          `Asistencia / Puntualidad: ${objInterview[0].question12[0]} `,
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`Capacitación:  ${objInterview[0].question12[1]}`, {
          width: doc.page.width - 115,
          align: 'left',
        });
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(
          `Aportación-Participación:  ${objInterview[0].question12[2]}`,
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`Lista 40 contactos:  ${objInterview[0].question12[3]}`, {
          width: doc.page.width - 115,
          align: 'left',
        });

        //PREGUNTA 11
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(
          `11. En caso de ser trabajador por cuenta ajena, la empresa ha de estar enterada y conforme con los compromisos y los tiempos de cada uno`,
          {
            width: doc.page.width - 115,
            align: 'left',
          },
        );
        doc.moveDown();
        doc.font('Times-Roman').fontSize(9);
        doc.text(`${objInterview[0].question13} `, {
          width: doc.page.width - 115,
          align: 'left',
        });

        doc.moveDown();
        const table1 = {
          headers: ['', ''],
          rows: [
            [`Entrevistador`, `Entrevistado`],
            [`${objInterview[0].interviwer}`, `${objInterview[0].interviwed}`],
          ],
          options: {
            divider: {
              header: { disabled: false, width: 0.5, opacity: 0.5 },
              vertical: { disabled: false, width: 1, opacity: 0.5 },
            },
          },
        };
        doc.moveDown();
        doc.table(table1, { columnSize: [150, 300] });

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
      console.log('err...', err);
    }
  }

  private async resultQuery(userInterviewId: string) {
    try {
      return [
        {
          $match: { userInterviewId: ObjectId(userInterviewId) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userInterviewId',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInterview',
          },
        },
        {
          $unwind: '$userInterview',
        },
        {
          $project: {
            dateOfInterview: {
              $dateToString: { format: '%Y-%m-%d', date: '$dateOfInterview' },
            },
            finalDate: '$dateOfInterview',
            interviwedName: {
              $toUpper: { $concat: ['$users.name', ' ', '$users.lastName'] },
            },
            profession: '$users.profession',
            companyName: '$users.companyName',
            question1: '$question1',
            question2: '$question2',
            question3: '$question3',
            question4: '$question4',
            question5: '$question5',
            question6: '$question6',
            question7: '$question7',
            question8: '$question8',
            question9: '$question9',
            question10: '$question10',
            question11: '$question11',
            question12: '$question12',
            question13: '$question13',
            interviwer: {
              $toUpper: {
                $concat: [
                  '$userInterview.name',
                  ' ',
                  '$userInterview.lastName',
                ],
              },
            },
            interviwed: {
              $toUpper: { $concat: ['$users.name', ' ', '$users.lastName'] },
            },
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  //ENDPOINT PARA ARMAR LA CARTA Y ENVIAR POR CORREO. TAMBIÉN SE EDITA EL ESTATUS A CARTA ENVIADA
  async sendLetter(id: string, type: string, res: Response): Promise<Response> {
    try {
      await this.usersModel.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          letterSent: true,
        },
      );

      const pipeline: any = await this.resultQueryLetter(id);
      const objUser = await this.usersModel.aggregate(pipeline);
      //CREAMOS EL ARCHIVO
      const pdfBuffer =
        type == 'aceptacion'
          ? await this.createAcceptedPdfFile(objUser)
          : await this.createDeniedPdfFile(objUser);
      //ENVIAMOS EL CORREO CON LA CARTA ADJUNTA
      await this.sendEmail(objUser, type, pdfBuffer);

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

  async sendEmail(objUser: any, type: string, pdfBuffer: any) {
    try {
      const chapter = await this.chapterModel.findById(objUser[0].idChapter);
      const subject =
        type == 'aceptacion' ? 'Carta de aceptación' : 'Carta de no aceptación';

      const emailProperties = {
        emailConfigAut: chapter.email,
        passwordAut: chapter.password,
        template: 'empty',
        subject: subject,
        amount: '',
        name: '',
        to: objUser[0].email,
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

  async createAcceptedPdfFile(objUser: any) {
    try {
      let arrEmails = '';
      objUser[0].emailAccounts.forEach(async (obj) => {
        if (
          obj.status == 'Active' &&
          (obj.acceptedAccount == 'Ambos' || obj.acceptedAccount == 'Acepetado')
        ) {
          arrEmails = obj.email + ', ' + arrEmails;
        }
      });
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

        doc.addPage();
        doc.text('', 0, 50);

        const currentDate = moment().format('DD-MM-YYYY');
        doc.text('', 80, 80);
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`Fecha: ${currentDate}`, {
          width: doc.page.width - 125,
          align: 'right',
        });

        doc.moveDown();
        doc.moveDown();
        doc.text(`Estimado ${objUser[0].interviwedName}`, {
          width: doc.page.width,
          align: 'left',
        });

        const startText = `El presente además de saludarte, es para informarte que tu solicitud de INGRESO en nuestro Capítulo BNI ${objUser[0].chapterName}, ha sido ACEPTADA, con el giro de ${objUser[0].profession} `;
        doc.moveDown();
        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.fillColor('black').text(startText.slice(0, 72), {
          width: doc.page.width - 125,
          align: 'justify',
          continued: true,
        });

        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .text(startText.slice(72, 80), {
            //ingreso
            continued: true,
          })

          .fillColor('black');
        doc.font('Times-Roman').fontSize(11).text(startText.slice(80, 100), {
          continued: true,
        });

        doc
          .font('Helvetica-Bold')
          .fontSize(11) //BNI Alianza Empresarial
          .text(startText.slice(100, 124), {
            continued: true,
          })

          .fillColor('black');
        doc.font('Times-Roman').fontSize(11).text(startText.slice(124, 133), {
          continued: true,
        });

        doc
          .font('Helvetica-Bold')
          .fontSize(11) //ACEPTADA
          .text(startText.slice(133, 142), {
            continued: true,
          })

          .fillColor('black');
        doc.font('Times-Roman').fontSize(11).text(startText.slice(142, 158), {
          continued: true,
        });

        doc
          .font('Helvetica-Bold')
          .fontSize(11) //giro
          .text(startText.slice(158, 178), {
            continued: false,
            link: null,
          });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          `Estamos seguros que a partir de tu incorporación contaremos con tu compromiso para el cumplimiento de políticas de BNI y lograr nuestro objetivo de “Ganar Dando”.`,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(`Las cuotas vigentes desde febrero 2021 son las siguientes:`, {
          width: doc.page.width - 125,
          align: 'justify',
        });

        const table = {
          headers: ['', ''],
          rows: [
            [`Membresía 1 año:`, `$11,900.00`],
            [`Membresía 2 años:`, `$19,900.00`],
          ],
          options: {
            divider: {
              header: { disabled: true, width: 0, opacity: 0.0 },
              vertical: { disabled: true, width: 0, opacity: 0.5 },
              horizontal: { disabled: true, width: 0.5, opacity: 0.5 },
            },
            hideHeader: true,
          },
        };
        doc.moveDown();
        doc.table(table, { columnSize: [150, 200] });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(`Contamos con las siguientes formas de pago:`, {
          width: doc.page.width - 125,
          align: 'justify',
        });

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.list(['BBVA Bancomer a nombre de Mexlion Networks, S.A. de C.V.'], {
          bulletIndent: 20,
          textIndent: 20,
          width: doc.page.width - 125,
          align: 'justify',
          listType: 'bullet',
          bulletRadius: 2,
        });

        doc.font('Times-Roman').fontSize(11);
        doc.text(`       Cuenta: 0191 788 744`, {
          width: doc.page.width - 125,
          align: 'justify',
        });
        doc.font('Times-Roman').fontSize(11);
        doc.text(`       Clabe: 0121 8000 1917 887 443`, {
          width: doc.page.width - 125,
          align: 'justify',
        });

        doc.list(
          [
            'En línea con Tarjeta de Crédito a través de Pay Pal http://www.pagosenlineabni.com',
            'Billpocket',
          ],
          {
            bulletIndent: 20,
            textIndent: 20,
            width: doc.page.width - 125,
            align: 'justify',
            listType: 'bullet',
            bulletRadius: 2,
          },
        );

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          `Te solicitamos que una vez realizado el pago, envíes copia del comprobante de pago a los siguientes correos: ${arrEmails} para el control interno del capítulo, en los proximos 4 días hábiles, vigencia de esta carta de aceptación.`,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          `Las políticas de BNI establecen que sólo se permite a una persona por especialidad, motivo por el cual, hasta no completar el proceso de inscripción y pago de membresía, la especialidad para la cual aplicaste seguirá abierta en el capítulo.`,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          `Nuevamente muchas gracias por su interés de participar en BNI.`,
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
        doc.text('BNI Alianza Empresarial', {
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

  private async resultQueryLetter(userInterviewId: string) {
    try {
      return [
        {
          $match: { _id: ObjectId(userInterviewId) },
        },
        {
          $lookup: {
            from: 'chapters',
            localField: 'idChapter',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $unwind: '$users',
        },
        {
          $lookup: {
            from: 'emailaccounts',
            localField: 'idChapter', //arriba -> attendances
            foreignField: 'chapterId',
            as: 'emailaccounts',
          },
        },
        {
          $project: {
            interviwedName: {
              $toUpper: { $concat: ['$name', ' ', '$lastName'] },
            },
            profession: '$profession',
            companyName: '$companyName',
            chapterName: '$users.name',
            emailAccounts: '$emailaccounts',
            email: '$email',
            idChapter: '$idChapter',
          },
        },
      ];
    } catch (err) {
      throw new HttpErrorByCode[500](
        'Lo sentimos, ocurrió un error al procesar la información, inténtelo de nuevo o más tarde.',
      );
    }
  }

  async createDeniedPdfFile(objUser: any) {
    try {
      let arrEmails = '';
      objUser[0].emailAccounts.forEach(async (obj) => {
        if (obj.status == 'Active' && obj.acceptedAccount == 'Rechazado') {
          arrEmails = obj.email + ', ' + arrEmails;
        }
      });
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

        doc.addPage();
        doc.text('', 80, 80);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(`Carta de Control #1 — Conflicto con la clasificación`, {
          width: doc.page.width,
          align: 'left',
        });
        doc.moveDown();
        const currentDate = moment().format('DD-MM-YYYY');
        doc.font('Helvetica-Bold').fontSize(9);
        doc.text(`Fecha: ${currentDate}`, {
          width: doc.page.width - 125,
          align: 'right',
        });

        doc.text(`Estimado ${objUser[0].interviwedName}`, {
          width: doc.page.width,
          align: 'left',
        });

        doc.moveDown();
        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(
          ` Agradecemos su interés en unirse a nuestro Capítulo de BNI®. El Comité de Membresías revisó su Solicitud de Membresía y ha decidido regresarle su solicitud y cuotas. Nosotros determinamos que su clasificación de negocio entra en conflicto con la de un miembro actual y como la política de BNI® sólo permite a una persona por clasificación profesional, no podemos aceptar su solicitud.
          `,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.font('Times-Roman').fontSize(11);
        doc.text(
          `Guardaremos sus datos para contactarlo en caso de que la clasificación llegue a estar disponible. Si desea ser considerado para otro Capítulo de BNI®, por favor póngase en contacto con la Oficina Regional de BNI®`,
          {
            width: doc.page.width - 125,
            align: 'justify',
          },
        );

        doc.moveDown();
        doc.font('Times-Roman').fontSize(11);
        doc.text(`De nuevo, gracias por su interés en BNI®.`, {
          width: doc.page.width - 125,
          align: 'justify',
        });

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
        doc.text(`Capítulo BNI® ${objUser[0].chapterName}`, {
          width: doc.page.width,
          align: 'left',
        });

        doc.moveDown();
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
}
