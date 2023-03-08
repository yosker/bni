import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { References } from '../interfaces/references.interface';

export type InterviewsDocument = UsersInterviews & Document;

@Schema()
export class UsersInterviews {
  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  interviewId: object;

  @Prop({ type: 'object' })
  references: References;

  @Prop({ type: 'string' })
  question1: string;

  @Prop({ type: 'string' })
  question2: string;

  @Prop({ type: 'string' })
  question3: string;

  @Prop({ type: 'object' })
  question4: object;

  @Prop({ type: 'string' })
  question5: string;

  @Prop({ type: 'string' })
  question6: string;

  @Prop({ type: 'object' })
  question7: object;

  @Prop({ type: 'string' })
  question8: string;

  @Prop({ type: 'string' })
  question9: string;

  @Prop({ type: 'object' })
  question10: object;

  @Prop({ type: 'string' })
  question11: string;

  @Prop({ type: 'object' })
  question12: object;

  @Prop({ type: 'string' })
  question13: string;
}

export const UsersInterviewsSchema =
  SchemaFactory.createForClass(UsersInterviews);
