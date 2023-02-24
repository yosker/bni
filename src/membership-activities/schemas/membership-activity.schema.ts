import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export type MembershipActivitiesDocument = MembershipActivities & Document;

@Schema()
export class MembershipActivities {
  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  userNetworkerId: object;

  @Prop({ type: 'boolean' })
  fileRequire: boolean;

  @Prop({ type: 'string' })
  comments: string;

  @Prop({ default: new Date() })
  startDate: Date;

  @Prop({ default: new Date() })
  endDate: Date;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ type: 'string', default: EstatusRegister.Active })
  status: string;
}

export const MembershipActivitiesSchema =
  SchemaFactory.createForClass(MembershipActivities);
