import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  createdBy: object;

  @ApiProperty({
    example: 'Usuario que Comenta.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Id Usuario invitado.',
  })
  @IsNotEmpty()
  userInterviewId: object;

  @ApiProperty({
    example: 'Comentario del usuario.',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    example: 'Aceptado Si-No.',
  })
  @IsBoolean()
  accepted: boolean;

  @ApiProperty({
    example: 'Fecha de Actualizaación del Registro.',
  })
  @Prop({ default: new Date().toISOString() })
  updatedAt: string;
}
