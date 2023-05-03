import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

const moment = require('moment-timezone');

export const ChapterSessionSchema = new Schema({
  chapterId: { type: Object, required: true },
  sessionDate: { type: String, required: true },
  sessionChapterDate: {
    type: String,
    default: moment().toISOString(),
  },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
