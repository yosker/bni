import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import moment from 'moment';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export class CreateUserDto {
  @ApiProperty({
    example: 'Id del Capítulo.',
  })
  @IsNotEmpty()
  idChapter: object;

  @ApiProperty({
    example: 'Id del Usuario que Invitó.',
  })
  @ValidateIf((o) => '' in o)
  @IsString()
  @Prop({ default: '-', required: false })
  invitedBy?: string;

  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    example: 'Nombre del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Apellido del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Teléfono del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Correo Electrónico del Usuario.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password.',
  })
  @ValidateIf((o) => '' in o)
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Imágen del Usuario.',
  })
  @IsString()
  imageURL = '';

  @ApiProperty({
    example: 'Nombre de la Empresa.',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    example: 'Profesión del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  profession: string;

  @ApiProperty({
    example: 'Aceptado true/false.',
  })
  @Prop({ default: false, required: false })
  accepted: boolean;

  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @Prop({ default: EstatusRegister.Active, required: false })
  status: string;

  @ApiProperty({
    example: 'Solicitud Completada.',
  })

  @Prop({ default: '', required: false })
  completedApplication: string;

  @ApiProperty({
    example: 'Entrevista Completada.',
  })
  @IsNotEmpty()
  @IsBoolean()
  completedInterview = false;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}
