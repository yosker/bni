import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');
export class AttendanceDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  chapterSessionId: object;

  @ApiProperty({
    example: 'Id de Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  userId: object;

  @Prop({ default: false, required: false })
  attended: boolean;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  attendanceDate: string;

  attendanceDateTime: string;

  @Prop({ default: false, required: false })
  letterSent: boolean;

  createdAt?: string;

  updatedAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
