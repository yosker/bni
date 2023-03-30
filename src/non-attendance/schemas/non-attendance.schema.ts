import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export type NonAttendancesDocument = NonAttendances & Document;

@Schema()
export class NonAttendances {
  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'string' })
  attendanceType: string;

  @Prop({ default: new Date().toISOString() })
  attendanceDate: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @Prop({ type: 'string', default: EstatusRegister.Active })
  status: string;
}

export const NonAttendancesSchema =
  SchemaFactory.createForClass(NonAttendances);
