import { Schema } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export const ChapterSessionSchema = new Schema({
  chapterId: { type: Object, required: true },
  sessionDate: { type: String, required: true },
  status: { type: String, default: EstatusRegister.Active, required: false },
});
