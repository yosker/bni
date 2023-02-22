import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ChaptersModule } from './chapters/chapters.module';
import { SharedService } from './shared/shared.service';
import { SharedModule } from './shared/shared.module';
import { ServicesResponse } from 'src/responses/response';
import { AttendanceModule } from './attendance/attendance.module';
import { RolesModule } from './roles/roles.module';
import { ChapterSessionsModule } from './chapter-sessions/chapter-sessions.module';
import { InterviewsModule } from './interviews/interviews.module';
import { TreasuryModule } from './treasury/treasury.module';
import { EmailAccountsModule } from './email-accounts/email-accounts.module';
import { MenuModule } from './menu/menu.module';
import { CommentsModule } from './comments/comments.module';
import { NetinterviewModule } from './netinterview/netinterview.module';
import { NonAttendanceModule } from './non-attendance/non-attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const host = config.get('database.host');
        const credentials = config.get('database.credentials');
        const name = config.get('database.name');
        const uri = `mongodb+srv://${credentials}@${host}/${name}?retryWrites=true&w=majority`;
        console.log(uri);
        return { uri };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ChaptersModule,
    SharedModule,
    AuthModule,
    AttendanceModule,
    RolesModule,
    ChapterSessionsModule,
    InterviewsModule,
    TreasuryModule,
    EmailAccountsModule,
    MenuModule,
    CommentsModule,
    NetinterviewModule,
    NonAttendanceModule,
  ],
  controllers: [],
  providers: [SharedService, ServicesResponse],
})
export class AppModule {}
