import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    example: 'Id del Capítulo.',
  })
  @IsNotEmpty()
  idChapter: object;

  @ApiProperty({
    example: 'Id del Usuario que Invitó.',
  })
  @IsString()
  invitedBy: string;

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
    example: 'Estatus del Registro.',
  })
  @Prop({ default: 'Active', required: false })
  status: string;

  @ApiProperty({
    example: 'Solicitud Completada.',
  })
  @IsNotEmpty()
  @IsBoolean()
  completedApplication = false;

  @ApiProperty({
    example: 'Entrevista Completada.',
  })
  @IsNotEmpty()
  @IsBoolean()
  completedInterview = false;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: new Date() })
  createdAt: Date;
}
