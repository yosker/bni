import { Prop } from '@nestjs/mongoose';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { now } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { CreateMembershipActivityDto } from './create-membership-activity.dto';

const moment = require('moment-timezone');

export class UpdateMembershipActivityDto extends PartialType(
  CreateMembershipActivityDto,
) {
  @ApiProperty({
    example: 'Comentarios.',
  })
  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsString()
  fileUrl: string;

  @ApiProperty({
    example: 'Fecha inicio.',
  })
  @Prop({ default: '', required: true })
  startDate: string;

  @ApiProperty({
    example: 'Fecha fin.',
  })
  @Prop({ default: '', required: true })
  endDate: string;

  @Prop({ default: moment().toISOString(), required: false })
  updatedAt?: string;

  @Prop({ default: EstatusRegister.Active, required: false })
  status?: string;
}
