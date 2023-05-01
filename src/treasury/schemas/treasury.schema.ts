import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const TreasurySchema = new Schema({
  chapterId: { type: Object, required: true },
  userId: { type: Object, required: true },
  payment: { type: Number, required: true },
  monthYear: { type: String, required: true },
  createdAt: {
    type: String,
    default: moment().toISOString(),
    required: false,
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
