import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const moment = require('moment-timezone');

export type QuestionsReferencesDocument = QuestionsReferences & Document;

@Schema()
export class QuestionsReferences {
  @Prop({ type: 'object' })
  referenceId: object;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  userInterviewId: object;

  @Prop({ type: 'object' })
  interviewId: object;

  @Prop({ type: 'string' })
  relationShip: string;

  @Prop({ type: 'string' })
  company: string;

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

  @Prop({ type: 'string' })
  question8: string;

  @Prop({ default: moment().toISOString() })
  updatedAt: string;
}

export const QuestionsReferencesSchema =
  SchemaFactory.createForClass(QuestionsReferences);
