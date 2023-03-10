import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export const AttendanceSchema = new Schema({
  chapterId: { type: Object, required: true },
  userId: { type: Object, required: true },
  attendanceType: { type: String, required: true },
  attendanceDate: { type: String, required: false },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
    required: false,
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
