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
  // @IsNotEmpty()
  //  @IsString()
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
<<<<<<< HEAD
  @IsString()
  status = 'Active';
=======
  @Prop({ default: 'Active', required: false })
  status: string;
>>>>>>> 94a099156c587316d79aeef531e4281c7a61a45b

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
