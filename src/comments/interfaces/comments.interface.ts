import { Document } from 'mongoose';

export interface Comment extends Document {
  createdBy: object;
  userId: object;
  userInterviewId: object;
  comment: string;
  accepted: boolean;
  createdAt: string;
}
