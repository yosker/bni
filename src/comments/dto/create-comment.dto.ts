import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';

export class CreateCommentDto {
  createdBy: object;

  @ApiProperty({
    example: 'Id Usuario invitado.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Id Usuario Invitado.',
  })
  @IsNotEmpty()
  userInterviewId: object;

  @ApiProperty({
    example: 'Id de entrevista.',
  })
  @IsNotEmpty()
  interviewId: object;

  @ApiProperty({
    example: 'Comentario del usuario.',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    example: 'Aceptado true/false.',
  })
  @IsBoolean()
  accepted: boolean;

  @Prop({ default: new Date() })
  createdAt: Date;
}
