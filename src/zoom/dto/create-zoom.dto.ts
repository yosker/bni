import { Prop } from '@nestjs/mongoose';
export class CreateZoomDto {
  meetingId: string;

  chapterId: object;

  tokenChapter: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}
