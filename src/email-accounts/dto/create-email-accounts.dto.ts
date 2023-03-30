import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class CreateEmailAccountsDTO extends PartialType(RegisterAuthDto) {
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
  acceptedAccount: string;

  @ApiProperty({
    example: 'Cuenta del correo electrónico.',
  })
  @IsNotEmpty()
  email: string;

  @Prop({ default: new Date().toISOString(), required: false })
  createdAt?: string;

  @Prop({ default: EstatusRegister.Active })
  status?: string;
}
