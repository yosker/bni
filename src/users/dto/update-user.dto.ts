// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { Prop } from '@nestjs/mongoose';
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

  @IsNotEmpty()
  @IsString()
  phoneNumber: string; 

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  profession: string

}