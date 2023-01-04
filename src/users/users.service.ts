import { Injectable } from '@nestjs/common';
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
  async findAll() {
    return this.usersModel.find();
  }

  async findOne(id: string) {
    return this.usersModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<ServicesResponse> {
    const { statusCode, message, result } = this.servicesResponse;
    const findRole = this.rolesModel.findOne({
      name: createUserDto.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('ROLE_NOT_FOUND', this.servicesResponse);

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
      if (newUser != null) console.log('Envio  de correo');

      return { statusCode, message, result };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('RECORD_DUPLICATED');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async createVisitor(createUserDto: CreateUserDto): Promise<ServicesResponse> {
    const { statusCode, message, result } = this.servicesResponse;
    const findRole = this.rolesModel.findOne({
      name: createUserDto.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('NOT_FOUND_ROLE', this.servicesResponse);

    try {
      const _newUser = new this.usersModel(createUserDto);
      await _newUser.save();

      return { statusCode, message, result };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('DUPLICATED_REGISTER');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async update(id: string, _updateUserDto: UpdateUserDto,): Promise<ServicesResponse> {
    const { statusCode, message, result } = this.servicesResponse;
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
      await this.usersModel.findByIdAndUpdate(ObjectId(id), _updateUserDto);

      return { statusCode, message, result };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('RECORD_DUPLICATED');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async remove(id: string) {
    return this.usersModel.findByIdAndDelete(id);
  }
}
