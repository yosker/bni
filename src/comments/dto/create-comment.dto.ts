import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Usuario que hace comentario.',
  })
  @IsNotEmpty()
  userId: object;

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
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: new Date() })
  createdAt: Date;
}
