import { Document } from 'mongoose';
export interface Log extends Document {
  message: { type: string };
  stackTrace: { type: string };
  createdAt: {
    type: string;
  };
}
