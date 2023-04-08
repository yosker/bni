import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionsReferenceDto } from './create-questions-reference.dto';
import { IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';

export class UpdateQuestionsReferenceDto extends PartialType(
  CreateQuestionsReferenceDto,
) {
  @ApiProperty({
    example: 'Id de Referencia.',
  })
  referenceId: object;

  @ApiProperty({
    example: 'Id de Usuario Entrevistado.',
  })
  userInterviewId: object;

  @ApiProperty({
    example: 'Id de Entrevista.',
  })
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

  @Prop({ default: new Date() })
  updatedAt: Date;
}
