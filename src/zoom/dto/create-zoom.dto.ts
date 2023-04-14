import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateZoomDto {
  @ApiProperty({
    example: 'Id de Reunion',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  token: string;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: new Date() })
  createdAt: Date;
}
