import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export class CreateNonAttendanceDto {
  chapterId: object;

  @ApiProperty({
    example: 'Id del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  userId: object;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  @ApiProperty({
    example: 'Fecha de asistencia.',
  })
  @Prop({ default: '', required: false })
  attendanceDate: string;

  @Prop({ default: moment().toISOString(), required: false })
  createdAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
