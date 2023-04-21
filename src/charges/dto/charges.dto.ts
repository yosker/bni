import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { now } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class ChargesDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;
  userId: object;

  @ApiProperty({
    example: 'Concepto',
  })
  @IsNotEmpty()
  concept: string;

  @ApiProperty({
    example: 'Monto de aportación.',
  })
  @IsNotEmpty()
  amount: number;

  urlFile: string;

  @Prop({ default: now(), required: false })
  createdAt?: Date;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
