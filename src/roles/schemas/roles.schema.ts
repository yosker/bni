import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import { Document } from 'mongoose';

export type RolesDocument = Roles & Document;

@Schema()
export class Roles {
  @Prop({ type: 'string', length: 20 })
  name: string;

  @Prop({ type: 'string' })
  description: string;

  @Prop({ type: 'string' })
  status: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
