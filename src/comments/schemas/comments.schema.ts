import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const moment = require('moment-timezone');

export type CommentsDocument = Comments & Document;

@Schema()
export class Comments {
  @Prop({ type: 'object' })
  createdBy: object;

  @Prop({ type: 'object' })
  visitorId: object;

  @Prop({ type: 'string' })
  comment: string;

  @Prop({ type: 'boolean' })
  accepted: boolean;

  @Prop({ default: moment().toISOString() })
  createdAt: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
