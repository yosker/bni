import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const MonitoringLettersSchema = new Schema({
  userId: { type: Object, required: true },
  name: { type: String, required: true},
  visitorId: { type: Object, required: true },
  comment: { type: String, required: true },
  createdAt: {
    type: String,
    default: moment().toISOString(),
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
