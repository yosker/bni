import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

const moment = require('moment-timezone');

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    example: 'Nombre del Rol.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descripción del Rol.',
  })
  description: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}
