import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly usersModel: Model<Users>,
  ) {}
  async findAll(): Promise<Users[]> {
    return await this.usersModel.find();
  }

  async findOne(id: string): Promise<Users> {
    return await this.usersModel.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const newUser = new this.usersModel(createUserDto);
    return await newUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: string): Promise<Users> {
    return await this.usersModel.findByIdAndDelete(id);
  }
}
