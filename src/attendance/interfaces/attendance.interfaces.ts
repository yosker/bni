import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface Attendance extends Document {
  chapterId: { type: object };
  userId: { type: object };
  attendanceType: { type: string };
  attendanceDate: { type: string; default: ''; required: false };
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
