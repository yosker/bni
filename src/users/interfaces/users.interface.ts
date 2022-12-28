import { Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  name: string;
  password: string;
  status: string;
  birthday: string;
  rolename: string;
  createdAt: string;
  updatedAt: string;
};