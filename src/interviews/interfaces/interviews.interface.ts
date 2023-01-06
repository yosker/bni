import { Document } from 'mongoose';

export interface Interview extends Document {
  dateOfInterview: Date;
  timeEnd: string;
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
