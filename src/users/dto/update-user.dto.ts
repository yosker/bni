import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
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

  @ApiProperty({
    example: 'Teléfono.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Correo electrónico.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Nombre empresa.',
  })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({
    example: 'Profesión.',
  })
  @IsNotEmpty()
  @IsString()
  profession: string;

  @ApiProperty({
    example: 'Aceptado. true/false.',
  })
  @IsBoolean()
  accepted: boolean;
}
