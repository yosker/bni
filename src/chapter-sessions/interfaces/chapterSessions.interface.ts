import { Document } from 'mongoose';
import { EstatusRegister } from 'src/shared/enums/register.enum';
export interface ChapterSession extends Document {
  chapterId: { type: object };
  sessionDate: { type: string };
  sessionChapterDate: { type: Date };
  status: { type: string; default: EstatusRegister.Active; required: false };
}
