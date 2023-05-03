import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

const moment = require('moment-timezone');

export class CreateCommentDto {
  createdBy: object;

  @ApiProperty({
    example: 'Id Usuario Invitado.',
  })
  @IsNotEmpty()
  visitorId: object;

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

  @Prop({ default: moment().toISOString() })
  createdAt: string;
}
