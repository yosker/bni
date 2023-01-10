import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { References } from '../interfaces/references.interface';

export type InterviewsDocument = Interviews & Document;

@Schema()
export class Interviews {
  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  references: References;

  @Prop({ type: 'Date' })
  dateOfInterview: Date;

  @Prop({ type: 'string' })
  candidate: string;

  @Prop({ type: 'string' })
  company: string;

  @Prop({ type: 'string' })
  specialty: string;

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

  @Prop({ type: 'string' })
  question9: string;

  @Prop({ type: 'string' })
  question10: string;

  @Prop({ type: 'string' })
  question11: string;
}

export const InterviewsSchema = SchemaFactory.createForClass(Interviews);
