import { Schema } from 'mongoose';

export const emailAccountsSchema = new Schema({
    chapterId: { type: Object, required: true },
    acceptedAccount: { type: Boolean, required: true },
    email: { type: String, required: true, length: 80, unique: true },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
    },
    status: { type: String, default: 'Active', required: false },
});
