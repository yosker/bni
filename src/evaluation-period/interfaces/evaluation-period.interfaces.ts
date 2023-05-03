import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
import { Commitments } from './commitments.interface';

export interface EvaluationPeriod extends Document {
  chapterId: { type: object };
  networkerId: { type: string };
  networkerName: { type: string };
  initialPeriod: { type: string };
  finalPeriod: { type: string };
  notes: { type: string };
  commitments: Array<Commitments>;
  createdAt: { type: string };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
