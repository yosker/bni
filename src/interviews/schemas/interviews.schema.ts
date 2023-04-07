import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterviewsDocument = Interviews & Document;

@Schema()
export class Interviews {
  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'object' })
  question1: object;

  @Prop({ type: 'object' })
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

  @Prop({ type: 'string' })
  question12: string;

  @Prop({ type: 'string' })
  question13: string;
}

export const InterviewsSchema = SchemaFactory.createForClass(Interviews);
