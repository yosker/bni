import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export class CreateMembershipActivityDto {
  chapterId: object;

  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Nombre del Networker a quien se le asigna tareas.',
  })
  @IsNotEmpty()
  @IsString()
  networkerName: string;

  @ApiProperty({
    example: 'Fecha inicio.',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    example: 'Fecha fin.',
  })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  concatDate: string;

  @ApiProperty({
    example: 'Actividad.',
  })
  @IsNotEmpty()
  @IsString()
  activity: string;

  @ApiProperty({
    example: 'Comentarios.',
  })
  @IsString()
  comments: string;

  @ApiProperty({
    example: 'Estatus de la actividad.',
  })
  @IsString()
  statusActivity: string;

  @Prop({ default: moment().toISOString(), required: false })
  createdAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
