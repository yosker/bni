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
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
      { name: 'ChapterSession', schema: ChapterSessionSchema },
    ]),
    AuthModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, ServicesResponse, UsersModule, ChapterSessionsModule] 
})
export class AttendanceModule {}
