import { PartialType } from '@nestjs/mapped-types';
import { CreateZoomDto } from './create-zoom.dto';
import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

const moment = require('moment-timezone');

export class UpdateZoomDto extends PartialType(CreateZoomDto) {
  @IsNotEmpty()
  chapterId: object;

  @IsNotEmpty()
  tokenChapter: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}
