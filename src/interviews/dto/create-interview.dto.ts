import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

const moment = require('moment-timezone');

export class CreateInterviewDto {
  userId: object;

  chapterId: object;

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
  question4: Array<number>;

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
  question7: Array<number>;

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
  question12: Array<number>;

  @ApiProperty({
    example: 'Pregunta 13.',
  })
  @IsNotEmpty()
  @IsString()
  question13: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;
}
