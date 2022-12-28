import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './schemas/users.schema';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.usersModel(createUserDto);
    return await newUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async remove(id: string): Promise<User> {
    return await this.usersModel.findByIdAndDelete(id);
  }
}
