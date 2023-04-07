import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';
export class CreateInterviewDto {
  userId: object;

  chapterId: object;

  @ApiProperty({
    example: 'Pregunta 1.',
  })
  @IsNotEmpty()
  @IsObject()
  question1: string;

  @ApiProperty({
    example: 'Pregunta 2.',
  })
  @IsNotEmpty()
  @IsObject()
  question2: string;

  @ApiProperty({
    example: 'Pregunta 3.',
  })
  @IsNotEmpty()
  @IsObject()
  question3: string;

  @ApiProperty({
    example: 'Pregunta 4.',
  })
  @IsNotEmpty()
  @IsObject()
  question4: string;

  @ApiProperty({
    example: 'Pregunta 5.',
  })
  @IsNotEmpty()
  @IsObject()
  question5: string;

  @ApiProperty({
    example: 'Pregunta 6.',
  })
  @IsNotEmpty()
  @IsObject()
  question6: string;

  @ApiProperty({
    example: 'Pregunta 7.',
  })
  @IsNotEmpty()
  @IsObject()
  question7: string;

  @ApiProperty({
    example: 'Pregunta 8.',
  })
  @IsNotEmpty()
  @IsObject()
  question8: string;

  @ApiProperty({
    example: 'Pregunta 9.',
  })
  @IsNotEmpty()
  @IsObject()
  question9: string;

  @ApiProperty({
    example: 'Pregunta 10.',
  })
  @IsNotEmpty()
  @IsObject()
  question10: string;

  @ApiProperty({
    example: 'Pregunta 11.',
  })
  @IsNotEmpty()
  @IsObject()
  question11: string;

  @ApiProperty({
    example: 'Pregunta 12.',
  })
  @IsNotEmpty()
  @IsObject()
  question12: string;

  @ApiProperty({
    example: 'Pregunta 13.',
  })
  @IsNotEmpty()
  @IsObject()
  question13: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}
