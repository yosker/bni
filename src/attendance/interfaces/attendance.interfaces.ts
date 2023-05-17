import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Attendance extends Document {
  chapterId: { type: object };
  chapterSessionId: { type: object };
  userId: { type: object };
  attended: boolean;
  attendanceType: string;
  attendanceDate: string;
  attendanceDateTime: string;
  letterSent: boolean;
  createdAt: { type: string };
  updatedAt: { type: string };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
