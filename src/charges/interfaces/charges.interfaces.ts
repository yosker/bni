import { integer } from 'aws-sdk/clients/cloudfront';
import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface Charges extends Document {
  chapterId: { type: object };
  userId: { type: object };
  concept: { type: string  };
  amount: { type: integer };
  urlFile: { type: string  };
  createdAt: { type: string };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
