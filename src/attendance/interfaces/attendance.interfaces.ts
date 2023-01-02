import { Document } from 'mongoose';
export interface Attendance extends Document {
    idUser: { type: object };
    attendanceType: { type: string };
    attendanceDate: { type: string };
    createdAt: { type: Date; };
    status: { type: string; default: 'Active'; required: false };
}
