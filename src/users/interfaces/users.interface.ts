import { Document } from "mongoose";
export interface User extends Document {
  idChapter: Object,
  roleName: string,
  name: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  password: string,
  imageURL: string,
  companyName: string,
  profession: string,
  createdAt: Date,
  status: string
};