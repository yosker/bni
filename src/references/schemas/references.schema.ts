import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReferencesDocument = References & Document;

@Schema()
export class References {
  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  userInterviewId: object;

  @Prop({ type: 'object' })
  interviewId: object;

  @Prop({ type: 'string' })
  name: string;

  @Prop({ type: 'string' })
  relationShip: string;

  @Prop({ type: 'string' })
  position: string;

  @Prop({ type: 'string' })
  phoneNumber: string;

  @Prop({ type: 'string' })
  email: string;

  @Prop({ type: 'string' })
  question1: string;

  @Prop({ type: 'string' })
  question2: string;

  @Prop({ type: 'string' })
  question3: string;

  @Prop({ type: 'string' })
  question4: string;

  @Prop({ type: 'string' })
  question5: string;

  @Prop({ type: 'string' })
  question6: string;

  @Prop({ type: 'string' })
  question7: string;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const ReferencesSchema = SchemaFactory.createForClass(References);
