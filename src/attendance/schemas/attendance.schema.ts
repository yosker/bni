import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const AttendanceSchema = new Schema({
  chapterId: { type: Object, required: true },
  chapterSessionId: { type: Object, required: true },
  userId: { type: Object, required: true },
  attended: { type: Boolean, default: false, required: false },
  attendanceType: { type: String, required: true },
  attendanceDate: { type: String, required: false },
  attendanceDateTime: { type: String, required: false },
  letterSent: { type: Boolean, default: false, required: false },
  createdAt: {
    type: String,
    default: moment().toISOString(),
    required: false,
  },
  updatedAt: {
    type: String,
    default: moment().toISOString(),
    required: false,
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
