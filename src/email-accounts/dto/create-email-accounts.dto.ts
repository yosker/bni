import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { now } from 'mongoose';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailAccountsDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  @ApiProperty({
    example: 'Nombre de la Cuenta de correo.',
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

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: 'Active', required: false })
  status?: string;
}
