import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './schemas/attendance.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { ChapterSessionsModule } from 'src/chapter-sessions/chapter-sessions.module';
import { ChapterSessionSchema } from 'src/chapter-sessions/schemas/chapterSessions.schema';
import { PaginateResult } from 'src/shared/pagination/pagination-result';
import { ChapterSchema } from 'src/chapters/schemas/chapters.schema';
import { SharedService } from 'src/shared/shared.service';
import { Logs, LogsSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
      { name: 'ChapterSession', schema: ChapterSessionSchema },
      { name: 'Chapter', schema: ChapterSchema },
      { name: Logs.name, schema: LogsSchema },
    ]),
    AuthModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    ServicesResponse,
    UsersModule,
    ChapterSessionsModule,
    PaginateResult,
    SharedService,
  ],
})
export class AttendanceModule {}
