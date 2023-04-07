import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReferenceDto } from './create-reference.dto';

export class UpdateReferenceDto extends PartialType(CreateReferenceDto) {
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

  @ApiProperty({
    example: 'Email.',
  })
  email: string;

  @Prop({ default: new Date() })
  updatedAt: Date;
}
