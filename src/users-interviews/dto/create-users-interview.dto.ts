import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';

export class CreateUsersInterviewDto {
  userId: object;

  chapterId: object;

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
    example: 'Nombre del Candidato.',
  })
  @IsNotEmpty()
  @IsString()
  candidate: string;

  @ApiProperty({
    example: 'Nombre de Empresa.',
  })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({
    example: 'Especialidad/Giro de la Empresa.',
  })
  @IsNotEmpty()
  @IsString()
  specialty: string;

  @ApiProperty({
    example: 'Fecha de Entrevista.',
  })
  @IsNotEmpty()
  @Prop({ default: new Date().toISOString() })
  dateOfInterview: string;

  @ApiProperty({
    example: 'Pregunta 1.',
  })
  @IsNotEmpty()
  @IsString()
  question1: string;

  @ApiProperty({
    example: 'Pregunta 2.',
  })
  @IsNotEmpty()
  @IsString()
  question2: string;

  @ApiProperty({
    example: 'Pregunta 3.',
  })
  @IsNotEmpty()
  @IsString()
  question3: string;

  @ApiProperty({
    example: 'Pregunta 4.',
  })
  @IsNotEmpty()
  @IsArray()
  question4: number[];

  @ApiProperty({
    example: 'Pregunta 5.',
  })
  @IsNotEmpty()
  @IsString()
  question5: string;

  @ApiProperty({
    example: 'Pregunta 6.',
  })
  @IsNotEmpty()
  @IsString()
  question6: string;

  @ApiProperty({
    example: 'Pregunta 7.',
  })
  @IsNotEmpty()
  @IsArray()
  question7: number[];

  @ApiProperty({
    example: 'Pregunta 8.',
  })
  @IsNotEmpty()
  @IsString()
  question8: string;

  @ApiProperty({
    example: 'Pregunta 9.',
  })
  @IsNotEmpty()
  @IsString()
  question9: string;

  @ApiProperty({
    example: 'Pregunta 10.',
  })
  @IsNotEmpty()
  @IsString()
  question10: string;

  @ApiProperty({
    example: 'Pregunta 11.',
  })
  @IsNotEmpty()
  @IsString()
  question11: string;

  @ApiProperty({
    example: 'Pregunta 12.',
  })
  @IsNotEmpty()
  @IsArray()
  question12: number[];

  @ApiProperty({
    example: 'Pregunta 13.',
  })
  @IsNotEmpty()
  @IsString()
  question13: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}
