import { Prop } from '@nestjs/mongoose';

const moment = require('moment-timezone');
export class CreateZoomDto {
  meetingId: string;

  chapterId: object;

  tokenChapter: string;

  @Prop({ default: moment().toISOString() })
  createdAt: string;
}
