import { IsNotEmpty, IsString } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'Id del Capítulo.',
  })
  @IsNotEmpty()
  idChapter: object;

  @ApiProperty({
    example: 'Nombre del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Password.',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  role: string;

  @ApiProperty({
    example: 'Fecha de Actualización del Registro.',
  })
  @Prop({ default: new Date() })
  updatedAt: Date;
}