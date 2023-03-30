import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

import { CreateInterviewDto } from './create-interview.dto';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {
  @ApiProperty({
    example: 'Pregunta 1.',
  })
  @IsNotEmpty()
  @IsObject()
  question1: object;

  @ApiProperty({
    example: 'Pregunta 2.',
  })
  @IsNotEmpty()
  @IsObject()
  question2: object;

  @ApiProperty({
    example: 'Pregunta 3.',
  })
  @IsNotEmpty()
  @IsObject()
  question3: object;

  @ApiProperty({
    example: 'Pregunta 4.',
  })
  @IsNotEmpty()
  @IsObject()
  question4: object;

  @ApiProperty({
    example: 'Pregunta 5.',
  })
  @IsNotEmpty()
  @IsObject()
  question5: object;

  @ApiProperty({
    example: 'Pregunta 6.',
  })
  @IsNotEmpty()
  @IsObject()
  question6: object;

  @ApiProperty({
    example: 'Pregunta 7.',
  })
  @IsNotEmpty()
  @IsObject()
  question7: object;

  @ApiProperty({
    example: 'Pregunta 8.',
  })
  @IsNotEmpty()
  @IsObject()
  question8: object;

  @ApiProperty({
    example: 'Pregunta 9.',
  })
  @IsNotEmpty()
  @IsObject()
  question9: object;

  @ApiProperty({
    example: 'Pregunta 10.',
  })
  @IsNotEmpty()
  @IsObject()
  question10: object;

  @ApiProperty({
    example: 'Pregunta 11.',
  })
  @IsNotEmpty()
  @IsObject()
  question11: object;

  @ApiProperty({
    example: 'Pregunta 12.',
  })
  @IsNotEmpty()
  @IsObject()
  question12: object;

  @ApiProperty({
    example: 'Pregunta 13.',
  })
  @IsNotEmpty()
  @IsObject()
  question13: object;

  @Prop({ default: new Date() })
  updatedAt: Date;
}
