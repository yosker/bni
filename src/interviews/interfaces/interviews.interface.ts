import { Document } from 'mongoose';

export interface Interview extends Document {
  userId: object;
  chapterId: object;
  question1: string;
  question2: string;
  question3: string;
  question4: Array<number>;
  question5: string;
  question6: string;
  question7: Array<number>;
  question8: string;
  question9: string;
  question10: string;
  question11: string;
  question12: Array<number>;
  question13: string;
}
