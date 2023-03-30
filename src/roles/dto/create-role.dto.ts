import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Nombre del Rol.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descripción del Rol.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}
