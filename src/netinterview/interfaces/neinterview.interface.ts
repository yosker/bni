import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface Netinterview extends Document {
  chapterId: { type: object };
  userId: { type: object };
  createdBy: { type: string };
  strength1: { type: string };
  strength2: { type: string };
  growth1: { type: string };
  growth2: { type: string };
  interviewType: { type: string };
  question1: { type: string };
  question2: { type: string };
  question3: { type: string };
  question4: { type: string };
  question5: { type: string };
  question6: { type: string };
  question7: { type: string };
  createdAt: { type: string };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
