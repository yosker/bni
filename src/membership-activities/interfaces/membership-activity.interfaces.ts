import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface MembershipActivity extends Document {
  userId: { type: object };
  userNetworkerId: { type: object };
  fileRequire: { type: boolean };
  imageURL: { type: string; required: false };
  comments: { type: string; required: true };
  startDate: { type: Date; required: true };
  endDate: { type: Date; required: true };
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
