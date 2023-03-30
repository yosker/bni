import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document } from 'mongoose';

export type CommentsDocument = Comments & Document;

@Schema()
export class Comments {
  @Prop({ type: 'object' })
  createdBy: object;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  userInterviewId: object;

  @Prop({ type: 'string' })
  comment: string;

  @Prop({ type: 'boolean' })
  accepted: boolean;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;

  @Prop({ default: new Date().toISOString() })
  updatedAt: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
