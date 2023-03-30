import moment from 'moment';
import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export const TreasurySchema = new Schema({
  chapterId: { type: Object, required: true },
  userId: { type: Object, required: true },
  payment: { type: Number, required: true },
  monthYear: { type: String, required: true },
  paymentDate: { type: String, required: true },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
    required: false,
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
