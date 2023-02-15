import { Document } from 'mongoose';

export interface Netinterview extends Document {
    chapterId: { type: object };
    userId: { type: object };
    createdBy: { type: string };
    strength1: { type: string };
    strength2: { type: string };
    growth1: { type: string };
    growth2: { type: string };
    interviewType: { type: string };
    question1: { type: string };
    question2: { type: string };
    question3: { type: string };
    question4: { type: string };
    question5: { type: string };
    question6: { type: string };
    createdAt: { type: Date; };
    status: { type: string; default: 'Active'; required: false };
}
