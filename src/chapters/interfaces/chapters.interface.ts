import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Chapter extends Document {
  country: { type: string };
  region: { type: string };
  name: { type: string };
  chapterEmail: { type: string };
  sessionDate: { type: string };
  sessionSchedule: { type: string };
  sessionType: { type: string };
  createdAt: {
    type: Date;
  };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
