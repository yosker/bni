import { Schema } from 'mongoose'

export const ChapterSessionSchema = new Schema({
    chapterId:{ type: Object, required: true },
    sessionDate: { type: String, required: true },
    status: { type: String, default: 'Active', required: false }
});