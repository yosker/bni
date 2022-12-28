import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

export type UsersDocument = Users & Document; 

@Schema() 
export class Users {
  genre: string;

  @Prop({ type: 'string', length: 20, unique: true })
  username: string;

  @Prop({ type: 'string', length: 50, unique: true })
  email: string;

  @Prop({ type: 'string', length: 20, unique: true })
  name: string;

  @Prop({ type: 'string' })
  password: string;

  status: string;

  birthday: string;

  rolename: string;

  @Prop({ type: 'string', default: new Date().toISOString() })
  createdAt: string

  updatedAt: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users); 