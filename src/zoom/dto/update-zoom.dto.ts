import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateZoomDto } from './create-zoom.dto';
import { Prop } from '@nestjs/mongoose';

export class UpdateZoomDto extends PartialType(CreateZoomDto) {
  @ApiProperty({
    example: 'Fecha de Actualización del Registro.',
  })
  @Prop({ default: new Date() })
  updatedAt: Date;
}
