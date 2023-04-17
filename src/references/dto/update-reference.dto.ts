import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReferenceDto } from './create-reference.dto';

export class UpdateReferenceDto extends PartialType(CreateReferenceDto) {
  @ApiProperty({
    example: 'Id de la referencia.',
  })
  @IsNotEmpty()
  id: string;

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

  @Prop({ default: new Date() })
  updatedAt: Date;
}
