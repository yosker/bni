import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
export class CreateUserDto {
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
  password: string;

  @IsString()
  imageURL: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
