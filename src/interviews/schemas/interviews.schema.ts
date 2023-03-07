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
  question2: object;

  @Prop({ type: 'object' })
  question3: object;

  @Prop({ type: 'object' })
  question4: object;

  @Prop({ type: 'object' })
  question5: object;

  @Prop({ type: 'object' })
  question6: object;

  @Prop({ type: 'object' })
  question7: object;

  @Prop({ type: 'object' })
  question8: object;

  @Prop({ type: 'object' })
  question9: object;

  @Prop({ type: 'object' })
  question10: object;

  @Prop({ type: 'object' })
  question11: object;

  @Prop({ type: 'object' })
  question12: object;

  @Prop({ type: 'object' })
  question13: object;
}

export const InterviewsSchema = SchemaFactory.createForClass(Interviews);
