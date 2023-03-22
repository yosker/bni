import { Module } from '@nestjs/common';
import { ChapterSessionsController } from './chapter-sessions.controller';
import { ChapterSessionsService } from 'src/chapter-sessions/chapter-sessions.service';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChapterSessionSchema } from './schemas/chapterSessions.schema';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ChapterSession', schema: ChapterSessionSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [ChapterSessionsController],
  providers: [ChapterSessionsService, ServicesResponse],
})
export class ChapterSessionsModule {}
