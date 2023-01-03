// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateUserDto {

  @IsNotEmpty()
  idChapter: object;
  
  @IsNotEmpty()
  @IsString()
  role: string;

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
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string;

  @Prop({ default: new Date() })
  updatedAt: Date;
}
