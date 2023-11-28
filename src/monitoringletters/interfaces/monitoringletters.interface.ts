import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface MonitoringLetters extends Document {
  userId: { type: object };
  name: { type: string };
  visitorId: { type: object };
  comment: { type: string };
  createdAt: {
    type: string;
  };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
