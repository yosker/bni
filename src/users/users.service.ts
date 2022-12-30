import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/users.schema';

import { ServicesResponse } from '../responses/response'
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
    private servicesResponse: ServicesResponse,
  ) { }
  async findAll(): Promise<Users[]> {
    return await this.usersModel.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<ServicesResponse> {
    let { status, message, result } = this.servicesResponse;

    const newUser = new this.usersModel(createUserDto);

    try {
      await newUser.save();
      return { status, message, result };
    }
    catch (err) {
      if (err.code === 11000) {
        throw new HttpErrorByCode[409]('DUPLICATED_REGISTER');
      } else {
        throw new HttpErrorByCode[500]('INTERNAL_SERVER_ERROR');
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: string): Promise<User> {
    return await this.usersModel.findByIdAndDelete(id);
  }
}