import { Module } from '@nestjs/common';
import { ChapterSessionsController } from './chapter-sessions.controller';
import { ChapterSessionsService } from 'src/chapter-sessions/chapter-sessions.service';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChapterSessionSchema } from './schemas/chapterSessions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChapterSession', schema: ChapterSessionSchema },
    ]),
    AuthModule,
  ],
  controllers: [ChapterSessionsController],
  providers: [ChapterSessionsService, ServicesResponse],
})
export class ChapterSessionsModule {}
