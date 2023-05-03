import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

const moment = require('moment-timezone');

export class UpdateQuestionsReferenceDto {
  @ApiProperty({
    example: 'Id de Registro.',
  })
  @IsNotEmpty()
  _id: object;

  @ApiProperty({
    example: 'Id de Referencia.',
  })
  @IsNotEmpty()
  referenceId: object;

  @ApiProperty({
    example: 'Id de Usuario Entrevistado.',
  })
  @IsNotEmpty()
  userInterviewId: object;

  @ApiProperty({
    example: 'Id de Entrevista.',
  })
  @IsNotEmpty()
  interviewId: object;

  @ApiProperty({
    example: 'Relación.',
  })
  @IsString()
  relationShip: string;

  @ApiProperty({
    example: 'Empresa.',
  })
  @IsString()
  company: string;

  @ApiProperty({
    example: 'Pregunta 1.',
  })
  @IsString()
  question1: string;

  @ApiProperty({
    example: 'Pregunta 2.',
  })
  @IsString()
  question2: string;

  @ApiProperty({
    example: 'Pregunta 3.',
  })
  @IsString()
  question3: string;

  @ApiProperty({
    example: 'Pregunta 4.',
  })
  @IsString()
  question4: string;

  @ApiProperty({
    example: 'Pregunta 5.',
  })
  @IsString()
  question5: string;

  @ApiProperty({
    example: 'Pregunta 6.',
  })
  @IsString()
  question6: string;

  @ApiProperty({
    example: 'Pregunta 7.',
  })
  @IsString()
  question7: string;

  @ApiProperty({
    example: 'Pregunta 8.',
  })
  @IsString()
  question8: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}
