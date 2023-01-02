import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ChaptersModule } from './chapters/chapters.module';
import { SharedService } from './shared/shared.service';
import { SharedModule } from './shared/shared.module';
import { ServicesResponse } from 'src/responses/response';
import { AttendanceModule } from './attendance/attendance.module';
import { RolesModule } from './roles/roles.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/bni'),
    UsersModule,
    AuthModule,
    ChaptersModule,
    SharedModule,
    AuthModule,
    AttendanceModule,
    RolesModule,
  ],
  controllers: [],
  providers: [SharedService, ServicesResponse],
})
export class AppModule {}
