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

const ObjectId = require('mongodb').ObjectId;

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
          emailConfig: chapter.email,
          password: chapter.password,
          name: newUser.name + ' ' + newUser.lastName,
          template: process.env.NETWORKERS_WELCOME_TEMPLATE,
          subject: process.env.SUBJECT_CHAPTER_WELCOME,
          urlPlatform: url,
          amount: '',
          to: newUser.email,
        };
        await this.sharedService.sendMailer(emailProperties);
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
      await this.usersModel.findByIdAndUpdate(ObjectId(userId), {
        status: EstatusRegister.Deleted,
      });

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
      if (filename != 'default') {
        s3Response = await (
          await this.sharedService.uploadFile(
            dataBuffer,
            now.getTime() + '_' + filename,
            '',
            's3-bucket-users',
          )
        ).result.toString();
        await this.sharedService.deleteObjectFromS3(
          's3-bucket-users',
          req.urlFile,
        );
      } else {
        if (req.deleteFile == 1) {
          await this.sharedService.deleteObjectFromS3(
            's3-bucket-users',
            req.urlFile,
          );
        } else {
          s3Response = req.urlFile;
        }
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
          $gte: new Date().toISOString(),
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
          createdAt: new Date().toISOString(),
        };
        await this.attendanceModel.create(attendance);
      });
    } catch {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }

  private async deleteUserSessions(userId: string, chapterId: string) {
    try {
      const date = new Date().toISOString().substring(0, 10);
      await this.attendanceModel.deleteMany({
        userId: ObjectId(userId),
        chapterId: ObjectId(chapterId),
        attended: false,
        createdAt: {
          $gte: date,
        },
      });
    } catch {
      throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
    }
  }
}
