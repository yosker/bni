import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';

export class CreateReferenceDto {
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
  name: string;

  @ApiProperty({
    example: 'Teléfono.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  email: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}
