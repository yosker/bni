import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export class CreateChapterDTO extends PartialType(RegisterAuthDto) {
 

  @ApiProperty({
    example: 'País de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    example: 'Región de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty({
    example: 'Nombre de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Correo de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @Prop({ default: '', required: false })
  password: string;

  @ApiProperty({
    example: 'Fecha de Sesión de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  sessionDate: string;

  @ApiProperty({
    example: 'Horario de Sesión de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  sessionSchedule: string;

  @ApiProperty({
    example: 'Tipo de Sesión de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  sessionType: string;

  @ApiProperty({
    example: 'Token del capítulo.',
  })
  @IsString()
  tokenChapter: string;

  @ApiProperty({
    example: 'Id del meeting de la sesión.',
  })
  @IsString()
  meetingId: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
