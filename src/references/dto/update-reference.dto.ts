import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReferenceDto } from './create-reference.dto';

const moment = require('moment-timezone');

export class UpdateReferenceDto extends PartialType(CreateReferenceDto) {
  @ApiProperty({
    example: 'Id de la referencia.',
  })
  @IsNotEmpty()
  id: object;

  @ApiProperty({
    example: 'Nombre de la referencia.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Teléfono.',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}
