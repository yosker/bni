import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'Correo Electrónico del Usuario.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  role: string;

  @ApiProperty({
    example: 'Password.',
  })
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
