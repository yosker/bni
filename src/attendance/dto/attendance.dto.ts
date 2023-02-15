import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
export class AttendanceDTO extends PartialType(RegisterAuthDto) {
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

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: 'Active', required: false })
  status?: string;
}
