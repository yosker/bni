import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NetinterviewDTO {
  @ApiProperty({
    example: 'Id del capitulo.',
  })
  chapterId: object;

  @ApiProperty({
    example: 'Id del networker.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Nombre del entrevistador.',
  })
  createdBy: string;

  @ApiProperty({
    example: 'Fuerza 1.',
  })
  @IsNotEmpty()
  @IsString()
  strength1: string;

  @ApiProperty({
    example: 'Fuerza 2.',
  })
  @IsNotEmpty()
  @IsString()
  strength2: string;

  @ApiProperty({
    example: 'Desarrollo 1.',
  })
  @IsNotEmpty()
  @IsString()
  growth1: string;

  @ApiProperty({
    example: 'Desarrollo 2.',
  })
  @IsNotEmpty()
  @IsString()
  growth2: string;

  @ApiProperty({
    example: 'Tipo de entrevista.',
  })
  @IsNotEmpty()
  @IsString()
  interviewType: string;

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
  @IsString()
  question4: string;

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
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: new Date() })
  createdAt: Date;

  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @Prop({ default: 'Active', required: false })
  status?: string;
}
