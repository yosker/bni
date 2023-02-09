import { Decimal128, Document } from 'mongoose';

export interface Treasury extends Document {
    chapterId: { type: object };
    userId: { type: object };
    payment: { type: number };
    monthYear: { type: string; };
    paymentDate: { type: string };
    createdAt: { type: Date; };
    status: { type: string; default: 'Active'; required: false };
}
