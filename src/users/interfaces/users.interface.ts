import { Document } from 'mongoose';

export interface User extends Document {
  idChapter: object;
  role: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  imageURL: string;
  companyName: string;
  profession: string;
  createdAt: string;
  status: string;
  completedApplication: string;
  completedInterview: boolean;
  invitedBy: string;
  resetPassword: boolean;
  letterSent: boolean;
  accepted: boolean;
}
