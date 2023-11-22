import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Chapter extends Document {
  _id: { type: object };

  country: { type: string };
  region: { type: string };
  name: { type: string };
  email: { type: string };
  password: { type: string };
  attendanceDate: { type: string };
  sessionSchedule: { type: string };
  sessionType: { type: string };
  tokenChapter: { type: string; required: false; default:''}
  meetingId: { type: string; required: false; default:''}
  createdAt: {
    type: string;
  };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
