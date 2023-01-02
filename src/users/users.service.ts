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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    @InjectModel(Roles.name) private readonly rolesModel: Model<Role>,
    private servicesResponse: ServicesResponse,
    private jwtService: JwtService,
  ) {}
  async findAll() {
    return this.usersModel.find();
  }

  async findOne(id: string) {
    return this.usersModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<ServicesResponse> {
    const { statusCode, message } = this.servicesResponse;
    const findRole = await this.rolesModel.findOne({
      name: createUserDto.role,
    });

    if (!findRole)
      throw new HttpErrorByCode[404]('NOT_FOUND_ROLE', this.servicesResponse);

    const _newUser = new this.usersModel(createUserDto);

    try {
      const newUser = await _newUser.save();

      const payload = {
        id: newUser._id,
        name: createUserDto.name,
        role: createUserDto.role,
        email: createUserDto.email,
      };

      const token = this.jwtService.sign(payload);
      const data = {
        user: newUser,
        token,
      };

      return { statusCode, message, result: data };
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('DUPLICATED_REGISTER');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async update(id: string, _updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(id, _updateUserDto, { new: true });
  }

  async remove(id: string) {
    return this.usersModel.findByIdAndDelete(id);
  }
}
