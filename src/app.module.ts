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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const host = config.get('database.host');
        const port = config.get('database.port');
        const name = config.get('database.name');
        const uri = `mongodb://${host}:${port}/${name}`;
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
  ],
  controllers: [],
  providers: [SharedService, ServicesResponse ],
})
export class AppModule {}
