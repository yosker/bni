import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface MembershipActivity extends Document {
  chapterId: { type: object };
  userId: { type: object };
  networkerName: { type: string; required: true };
  startDate: { type: string; required: true };
  endDate: { type: string; required: true };
  concatDate: { type: string; required: true };
  activity: { type: string; required: true };
  comments: { type: string; required: false };
  fileUrl?: { type: string; };
  statusActivity: {
    type: string;
    default: EstatusRegister.Pending;
    required: false;
  };
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
