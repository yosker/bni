import { Schema } from 'mongoose'

export const AttendanceSchema = new Schema({
    idUser: { type: Object, required: true },
    attendanceType: { type: String, required: true },
    attendanceDate: { type: String },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    },
    status: { type: String, default: 'Active', required: false }
});