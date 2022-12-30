import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  role: string;

  @MinLength(4)
  @MaxLength(12)
  password: string;
}
