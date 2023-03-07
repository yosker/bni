import { Document } from 'mongoose';

export interface UsersInterview extends Document {
  userId: object;
  chapterId: object;
  interviewId: object;
  question1: string;
  question2: string;
  question3: string;
  question4: object;
  question5: string;
  question6: string;
  question7: object;
  question8: string;
  question9: string;
  question10: object;
  question11: string;
  question12: object;
  question13: string;
}
