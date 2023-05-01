import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export type MembershipActivitiesDocument = MembershipActivities & Document;

@Schema()
export class MembershipActivities {
  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'string' })
  networkerName: string;

  @Prop({ type: 'string' })
  fileUrl: string;

  @Prop({ type: 'string' })
  startDate: string;

  @Prop({ type: 'string' })
  endDate: string;

  @Prop({ type: 'string' })
  concatDate: string;

  @Prop({ type: 'string' })
  activity: string;

  @Prop({ type: 'string' })
  comments: string;

  @Prop({ type: 'string' })
  statusActivity: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;

  @Prop({ type: 'string', default: EstatusRegister.Active })
  status: string;
}

export const MembershipActivitiesSchema =
  SchemaFactory.createForClass(MembershipActivities);
