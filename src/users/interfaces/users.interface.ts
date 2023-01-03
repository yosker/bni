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
  createdAt: Date;
  status: string;
  completedApplication: boolean;
  completedInterview: boolean;
  invitedBy?:{ Type:string, default:''}
}
