import { Document } from 'mongoose';

export interface Comment extends Document {
  createdBy: object;
  visitorId: object;
  comment: string;
  accepted: boolean;
  createdAt: Date;
}
