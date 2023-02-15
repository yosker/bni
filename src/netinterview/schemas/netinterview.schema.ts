import { Schema } from 'mongoose'

export const NetinterviewSchema = new Schema({

    chapterId: { type: Object, required: true },
    userId: { type: Object, required: true },
    createdBy: { type: String, required: true },
    strength1: { type: String, required: false },
    strength2: { type: String, required: false },
    growth1: { type: String, required: false },
    growth2: { type: String, required: false },
    interviewType: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    question4: { type: String, required: true },
    question5: { type: String, required: true },
    question6: { type: String, required: true },
    createdAt: { type: Date, required: false, default: new Date() },
    status: { type: String, default: 'Active', required: false },
});