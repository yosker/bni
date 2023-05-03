import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export type NonAttendancesDocument = NonAttendances & Document;

@Schema()
export class NonAttendances {
  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'string' })
  attendanceType: string;

  @Prop({ default: moment().toISOString() })
  attendanceDate: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;

  @Prop({ type: 'string', default: EstatusRegister.Active })
  status: string;
}

export const NonAttendancesSchema =
  SchemaFactory.createForClass(NonAttendances);
