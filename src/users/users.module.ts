import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { ServicesResponse } from 'src/responses/response';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { RolesModule } from 'src/roles/roles.module';
import { Roles, RolesSchema } from 'src/roles/schemas/roles.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { SharedService } from 'src/shared/shared.service';
import { ChapterSessionSchema } from 'src/chapter-sessions/schemas/chapterSessions.schema';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { ChapterSchema } from 'src/chapters/schemas/chapters.schema';
import { UsersInterviewsSchema } from 'src/users-interviews/schemas/interviews.schema';
import { Logs, LogsSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Roles.name,
        schema: RolesSchema,
      },
      { name: 'ChapterSession', schema: ChapterSessionSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'UsersInterview', schema: UsersInterviewsSchema},
      { name: Logs.name, schema: LogsSchema },
    ]),
    AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    RolesModule,
    ServicesResponse,
    JwtStrategy,
    SharedService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
