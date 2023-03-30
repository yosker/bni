import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';
import { CreateReferenceDto } from './create-reference.dto';

export class UpdateReferenceDto extends PartialType(CreateReferenceDto) {
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
  name: string;

  @ApiProperty({
    example: 'Relación con el Networker.',
  })
  @IsNotEmpty()
  @IsString()
  relationShip: string;

  @ApiProperty({
    example: 'Relación con el Networker.',
  })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({
    example: 'Teléfono.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Email.',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

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
    example: 'Pregunta 7.',
  })
  @IsNotEmpty()
  @IsString()
  question7: string;

  @Prop({ default: new Date() })
  updatedAt: Date;
}
