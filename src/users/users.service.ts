import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/users.schema';
import { ServicesResponse } from '../responses/response';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/interfaces/roles.interface';
import { Roles } from 'src/roles/schemas/roles.schema';
import { hash } from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { PaginationDto } from 'nestjs-search';
import { EmailProperties } from 'src/shared/emailProperties';
import { Response } from 'express';
import { object } from 'joi';

const QRCode = require('qrcode');
const ObjectId = require('mongodb').ObjectId;
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel(Roles.name) private readonly rolesModel: Model<Role>,
    private readonly sharedService: SharedService,
    private servicesResponse: ServicesResponse,
    private jwtService: JwtService,
  ) { }
  async findAll(_params: PaginationDto, res: Response): Promise<Response> {
    // params.skip,
    //   params.limit,
    //   params?.start_key,
    //   params?.sort?.field,
    //   params?.sort?.order,
    //   params?.filter,
    //   params?.projection;
    const user = this.usersModel.find(
      {},
      {
        idChapter: 1,
        role: 1,
        name: 1,
        lastName: 1,
        phoneNumber: 1,
        email: 1,
        imageURL: 1,
        companyName: 1,
        profession: 1,
        createdAt: 1,
        status: 1,
        completedApplication: 1,
        completedInterview: 1,
        invitedBy: 1,
      },
    );
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: user,
    });
  }

  async findOne(id: string, res: Response) {
    const user = this.usersModel.findById(id, {
      idChapter: 1,
      role: 1,
      name: 1,
      lastName: 1,
      phoneNumber: 1,
      email: 1,
      imageURL: 1,
      companyName: 1,
      profession: 1,
      createdAt: 1,
      status: 1,
      completedApplication: 1,
      completedInterview: 1,
      invitedBy: 1,
    });
    return res.status(HttpStatus.OK).json({
      statusCode: this.servicesResponse.statusCode,
      message: this.servicesResponse.message,
      result: user,
    });
  }

  async create(createUserDto: CreateUserDto, res: Response): Promise<Response> {
    const findRole = this.rolesModel.findOne({
      name: createUserDto.role,
    });
    const { result } = this.servicesResponse;
    if (!findRole)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(new HttpException('ROLE_NOT_FOUND.', HttpStatus.BAD_REQUEST));

    try {
      const pass = await this.sharedService.passwordGenerator(6);
      const plainToHash = await hash(pass, 10);
      createUserDto = {
        ...createUserDto,
        password: plainToHash,
        idChapter: ObjectId(createUserDto.idChapter),
        invitedBy: '-',
      };
      const newUser = await this.usersModel.create(createUserDto);
      if (newUser != null) {
        const url =
          process.env.URL_NET_PLATFORM +
          '?id=' +
          newUser._id.toString() +
          '&chapterId=' +
          newUser.idChapter.toString();

        //OBJETO PARA EL CORREO
        const emailProperties: EmailProperties = {
          email: newUser.email,
          password: '',
          name: newUser.name + ' ' + newUser.lastName,
          template: process.env.NETWORKERS_WELCOME_TEMPLATE,
          subject: process.env.SUBJECT_CHAPTER_WELCOME,
          urlPlatform: url,
          amount: '',
        };
        await this.sharedService.sendEmail(emailProperties);
      }
      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpErrorByCode[409]('RECORD_DUPLICATED');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

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
        idChapter: ObjectId(createUserDto.idChapter)
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

  async update(
    id: string,
    _updateUserDto: UpdateUserDto,
    res: Response,
  ): Promise<Response> {
    const { result } = this.servicesResponse;
    const findRole = this.rolesModel.findOne({
      name: _updateUserDto.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('ROLE_NOT_FOUND', this.servicesResponse);
    try {
      _updateUserDto = {
        ..._updateUserDto,
        idChapter: ObjectId(_updateUserDto.idChapter),
      };
      this.usersModel.findByIdAndUpdate(ObjectId(id), _updateUserDto);

      return res.status(HttpStatus.OK).json({
        statusCode: this.servicesResponse.statusCode,
        message: this.servicesResponse.message,
        result: result,
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
        status: 'Active',
      });
      const qrCreated = await QRCode.toDataURL(id.toString());

      const dataUser = {
        name: findUser.name + ' ' + findUser.lastName,
        companyName: findUser.companyName,
        profession: findUser.profession,
        imageURL: findUser.imageURL,
        qr: qrCreated,
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
}
