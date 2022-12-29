import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/users.schema';

import { ServicesResponse } from '../responses/response'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<User>,
  ) {}
  async findAll(): Promise<Users[]> {
    return await this.usersModel.find();
  }

  async findOne(id: string): Promise<User> {
    return await this.usersModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<ServicesResponse> {
    let response = new ServicesResponse;
    let status = 0;
    let message = "";
    let result = {};
    const newUser = new this.usersModel(createUserDto);
   
    try {
      await newUser.save();
      status = 200;
      message = "OK";
    }
    catch (err) {
      if (err.code === 11000) {
        status = 401;
        message = "DUPLICATED";
      } else {
        status = 500;
        message = "INTERNAL_SERVER_ERROR";
      }
    }
    
    response.status = status;
    response.message = message;
    response.result = result;
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: string): Promise<User> {
    return await this.usersModel.findByIdAndDelete(id);
  }
}
