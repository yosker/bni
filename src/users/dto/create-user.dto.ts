import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import {now } from "mongoose";

export class CreateUserDto {

  @IsNotEmpty()
  idChapter: Object;

  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  imageURL: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string;

  @Prop({default: now()})
  createdAt: Date;

  @IsNotEmpty()
  @IsNumber()
  status: number;

}
