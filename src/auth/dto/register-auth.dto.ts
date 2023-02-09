import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty({
    example: 'Nombre del Usuario.',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Id del Capítulo.',
  })
  @IsString()
  idChapter: object;

  @ApiProperty({
    example: 'Nombre del Rol Asignado al Usuario.',
  })
  @IsString()
  role: string;
}
