import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  idChapter: object;

  @Prop({ default: null, type: Object })
  idInvitedBy?: object;

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
  imageURL = '';

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string;

  @IsString()
  status = '';

  @IsNotEmpty()
  @IsBoolean()
  completedApplication = false;

  @IsNotEmpty()
  @IsBoolean()
  completedInterview = false;

  @Prop({ default: new Date() })
  createdAt: Date;
}
