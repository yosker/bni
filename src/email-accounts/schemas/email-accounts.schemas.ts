import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailAccountsDocument = EmailAccounts & Document;

@Schema()
export class EmailAccounts {
  @Prop({ type: 'object' })
  chapterId: object;

  @Prop({ type: 'string' })
  name: string;

  @Prop({ type: 'object' })
  userId: object;

  @Prop({ type: 'string' })
  email: string;

  @Prop({ type: 'boolean' })
  acceptedAccount: boolean;

  @Prop({ type: 'string' })
  status: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const EmailAccountsSchema = SchemaFactory.createForClass(EmailAccounts);
