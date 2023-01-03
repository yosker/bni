import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsEmail, IsDate } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'Correo Electrónico del Usuario.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
  password: string;

  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  role: string;

  @ApiProperty({
    example: 'Fecha de Actualización del Registro.',
  })
  @Prop({ default: new Date() })
  @IsDate()
  updatedAt: Date;
}
