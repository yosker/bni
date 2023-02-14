import { Document } from 'mongoose';

export interface Comment extends Document {
  userId: object;
  comment: string;
  accepted: boolean;
  createdAt: Date;
}
