import { Document } from 'mongoose';
export interface Attendance extends Document {
    chapterId: { type: object };
    userId: { type: object };
    attendanceType: { type: string };
    attendanceDate: { type: string; default: ''; required: false };
    createdAt: { type: Date; };
    status: { type: string; default: 'Active'; required: false };
}
