import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Attendance extends Document {
  chapterId: { type: object };
  chapterSessionId: { type: object };
  userId: { type: object };
  attended: boolean;
  attendanceType: string;
  attendanceDate: string;
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
