import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
