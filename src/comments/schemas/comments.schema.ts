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

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
