import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const moment = require('moment-timezone');

export type RolesDocument = Roles & Document;

@Schema()
export class Roles {
  @Prop({ type: 'string', length: 20 })
  name: string;

  @Prop({ type: 'string' })
  description: string;

  @Prop({ type: 'string' })
  status: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
