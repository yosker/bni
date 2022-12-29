import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/bni'),
    UsersModule,
    AuthModule,
    ChaptersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
