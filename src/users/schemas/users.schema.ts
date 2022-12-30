import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ type: 'string', length: 50, unique: true })
  email: string;

  @Prop({ type: 'string', length: 20 })
  name: string;

  @Prop({ type: 'string' })
  password: string;

  @Prop({ type: 'string' })
  status: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop({ type: 'object' })
  idChapter: object;

  @Prop({ type: 'string' })
  role: string;

  @Prop({ type: 'string' })
  lastName: string;

  @Prop({ type: 'string' })
  phoneNumber: string;

  @Prop({ type: 'string' })
  imageURL: string;

  @Prop({ type: 'string' })
  companyName: string;

  @Prop({ type: 'string' })
  profession: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
