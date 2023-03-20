import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { References } from '../interfaces/references.interface';
import { CreateUsersInterviewDto } from './create-users-interview.dto';

export class UpdateUsersInterviewDto extends PartialType(
  CreateUsersInterviewDto,
) {
  @ApiProperty({
    example: 'Id de Usuario Invitado.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Id de Capítulo.',
  })
  @IsNotEmpty()
  @IsString()
  chapterId: object;

  @ApiProperty({
    example: 'Id de Entrevista.',
  })
  @IsNotEmpty()
  @IsString()
  interviewId: object;

  @ApiProperty({
    example: 'Referencias del Usuario Invitado (solo 2 obligatorios).',
  })
  @IsNotEmpty()
  references: References;

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
  @Prop({ default: new Date() })
  dateOfInterview: Date = new Date();

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
  @Prop({ default: new Date() })
  updatedAt: Date;
}
