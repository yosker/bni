import { Document } from 'mongoose';
export interface ChapterSession extends Document {
    chapterId: { type: object };
    sessionDate: { type: string };
    status: { type: string; default: 'Active'; required: false };
}
