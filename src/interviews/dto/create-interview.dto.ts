import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({
    example: 'Usuario que aplica la entrevista.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Fecha de Entrevista.',
  })
  @IsNotEmpty()
  @IsDate()
  dateOfInterview: Date;

  @ApiProperty({
    example: 'Hora dde Entrevista.',
  })
  @IsNotEmpty()
  @IsString()
  timeEnd: string;

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
}
