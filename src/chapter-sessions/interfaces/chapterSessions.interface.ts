import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';

export interface ChapterSession extends Document {
  _id?: { type: object };
  chapterId: { type: object };
  sessionDate: { type: string };
  sessionChapterDate: { type: string };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
