import { Schema } from 'mongoose';

export const ChapterSchema = new Schema({
  country: { type: String, required: true },
  region: { type: String, required: true },
  name: { type: String, required: true, length: 80, unique: true },
  sessionDate: { type: String, required: true },
  sessionSchedule: { type: String, required: true },
  sessionType: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  status: { type: String, default: 'Active', required: false },
});
