import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  status: string;

  birthday: string;

  role: string;

  @Prop({ default: new Date() })
  @IsDate()
  updatedAt: Date;
}
