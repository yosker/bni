import { Document } from 'mongoose';
export interface EmailAccount extends Document {
  chapterId: { type: object };
  acceptedAccount: { type: boolean };
  email: { type: string };
  createdAt: { type: Date };
  status: { type: string; default: 'Active'; required: false };
}
