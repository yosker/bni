import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface Treasury extends Document {
  chapterId: { type: object };
  userId: { type: object };
  payment: { type: number  };
  monthYear: { type: string };
  createdAt: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
