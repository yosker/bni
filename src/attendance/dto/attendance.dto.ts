import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

export class AttendanceDTO extends PartialType(RegisterAuthDto) {
  @IsNotEmpty()
  @IsString()
  idUser: object;

  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  @IsNotEmpty()
  @IsString()
  attendanceDate: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: 'Active', required: false })
  status?: string;
}
