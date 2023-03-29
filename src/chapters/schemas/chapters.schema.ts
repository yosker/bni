import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export const ChapterSchema = new Schema({
  country: { type: String, required: true },
  region: { type: String, required: true },
  name: { type: String, required: true, length: 80, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  sessionDate: { type: String, required: true },
  sessionSchedule: { type: String, required: true },
  sessionType: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
