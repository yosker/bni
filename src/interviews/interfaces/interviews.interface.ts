import { Document } from 'mongoose';
import { References } from './references.interface';

export interface Interview extends Document {
  userId: object;
  chapterId: object;
  references: Array<References>;
  dateOfInterview: Date;
  candidate: string;
  company: string;
  specialty: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  question6: string;
  question7: string;
  question8: string;
  question9: string;
  question10: string;
  question11: string;
}
