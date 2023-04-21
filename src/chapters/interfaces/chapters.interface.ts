import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Chapter extends Document {
  _id: { type: object };
  country: { type: string };
  region: { type: string };
  name: { type: string };
  email: { type: string };
  password: { type: string };
  sessionDate: { type: string };
  sessionSchedule: { type: string };
  sessionType: { type: string };
  tokenChapter: string;
  createdAt: {
    type: Date;
  };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
