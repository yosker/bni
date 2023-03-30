import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export class TreasuryDTO extends PartialType(RegisterAuthDto) {
  chapterId: object;

  userId: object;

  @ApiProperty({
    example: 'Monto de aportación.',
  })
  @IsNotEmpty()
  @IsNumber()
  payment: number;

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

  @Prop({ default: new Date().toISOString(), required: false })
  createdAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
