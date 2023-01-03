// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

<<<<<<< HEAD
export class UpdateUserDto {

=======
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'Correo Electrónico del Usuario.',
  })
>>>>>>> 94a099156c587316d79aeef531e4281c7a61a45b
  @IsNotEmpty()
  idChapter: object;
  
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
    example: 'Password.',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

<<<<<<< HEAD
  @IsNotEmpty()
=======
  @ApiProperty({
    example: 'Estatus del Registro.',
  })
>>>>>>> 94a099156c587316d79aeef531e4281c7a61a45b
  @IsString()
  phoneNumber: string; 

<<<<<<< HEAD
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string;
=======
  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  role: string;
>>>>>>> 94a099156c587316d79aeef531e4281c7a61a45b

  @ApiProperty({
    example: 'Fecha de Actualización del Registro.',
  })
  @Prop({ default: new Date() })
  updatedAt: Date;
}
