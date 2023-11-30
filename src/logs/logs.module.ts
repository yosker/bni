import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { LogsSchema, Logs } from './schemas/logs.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Logs.name, schema: LogsSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class LogsModule {}
