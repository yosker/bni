import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
export class AttendanceDTO extends PartialType(RegisterAuthDto) {
  @ApiProperty({
    example: 'Id del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  idUser: object;

  @ApiProperty({
    example: 'Tipo de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceType: string;

  @ApiProperty({
    example: 'Fecha de asistencia.',
  })
  @IsNotEmpty()
  @IsString()
  attendanceDate: string;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: now() })
  createdAt: Date;

 
  @ApiProperty({
    example: 'Estatus del Registro.',
  })

  @Prop({ default: 'Active', required: false })
  status?: string;
}
