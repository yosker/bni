import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  createdBy: object;

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
  @Prop({ default: new Date() })
  updatedAt: Date;
}
