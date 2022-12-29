import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @IsNotEmpty()
  name: string;

  @IsObject()
  idChapter: Object;
}