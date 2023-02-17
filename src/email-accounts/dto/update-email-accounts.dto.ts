import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class UpdateEmailAccountsDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  @ApiProperty({
    example: 'Nombre de la cuenta de correo.',
  })
  @IsNotEmpty()
  name: string;

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
  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
