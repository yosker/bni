import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { now } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class TreasuryDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  @ApiProperty({
    example: 'Id del usuario que realiza la aportación.',
  })
  @IsNotEmpty()
  userId: object;

  @ApiProperty({
    example: 'Monto de aportación.',
  })
 
  @IsNotEmpty()
  payment: number;

  @ApiProperty({
    example: 'Mes y año de la aportación',
  })
  @IsString()
  monthYear: string;

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
