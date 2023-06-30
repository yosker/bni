import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const ChapterSchema = new Schema({
  country: { type: String, required: true },
  region: { type: String, required: true },
  name: { type: String, required: true, length: 80, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: false,length: 80 },
  sessionDate: { type: String, required: true },
  attendanceDate: { type: String, required: false },
  sessionSchedule: { type: String, required: true },
  sessionType: { type: String, required: true },
  tokenChapter: { type: String, required: false },
  meetingId: { type: String, required: false },
  createdAt: {
    type: String,
    default: moment().toISOString(),
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
