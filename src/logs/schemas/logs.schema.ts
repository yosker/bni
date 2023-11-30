import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const moment = require('moment-timezone');

export type LogsSchemaDocument = Logs & Document;

@Schema()
export class Logs {
  @Prop({ type: 'string' })
  message: string;

  @Prop({ type: 'string' })
  stackTrace: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;
}

export const LogsSchema = SchemaFactory.createForClass(Logs);
