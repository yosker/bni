import { Document } from 'mongoose';
export interface Chapter extends Document {
  country: { type: string };
  region: { type: string };
  chapterName: { type: string };
  sessionDate: { type: string };
  sessionSchedule: { type: string };
  sessionType: { type: string };
  createdAt: {
    type: Date;
  };
  status: { type: string; default: 'Active'; required: false };
}
