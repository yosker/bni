import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailAccountsDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  @ApiProperty({
    example: 'Envío de carta de aceptación.',
  })
  @IsNotEmpty()
  acceptedAccount: boolean;

  @ApiProperty({
    example: 'Cuenta del correo electrónico.',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @Prop({ default: 'Active', required: false })
  status?: string;
}