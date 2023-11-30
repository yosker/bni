import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

const moment = require('moment-timezone');

export class CreateLogDto {
  @ApiProperty({
    example: 'Error no reconocido',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'stackTrace no reconocido',
  })
  @IsString()
  stackTrace: string;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: moment().toISOString() })
  createdAt: string;
}
