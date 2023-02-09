
import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { now } from 'mongoose';

export class TreasuryDTO extends PartialType(RegisterAuthDto) {
  @ApiProperty({
    example: 'Id del capitulo.',
  })
  @IsNotEmpty()
  chapterId: object;
 
  @ApiProperty({
    example: 'Id del Usuario.',
  })
  @IsNotEmpty()
  @IsString()
  userId: object;

  @ApiProperty({
    example: 'Monto de aportación.',
  })
  @IsNotEmpty()
  @IsNumber()
  payment: Number;

  @ApiProperty({
    example: 'Mes y año de la aportación',
  })
  @IsString()
  monthYear: string;

  @ApiProperty({
    example: 'Fecha de la aportación. DD/MM/AAAA',
  })
  @IsNotEmpty()
  @IsString()
  paymentDate: string;

  @ApiProperty({
    example: 'Fecha de Creación del Registro.',
  })
  @Prop({ default: now(), required: false })
  createdAt?: Date;
 
  @ApiProperty({
    example: 'Estatus del Registro.',
  })
  @Prop({ default: 'Active', required: false })
  status?: string;
}
