import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface EmailAccount extends Document {
  chapterId: { type: object };
  acceptedAccount: { type: boolean };
  email: { type: string };
  name: { type: string };
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
