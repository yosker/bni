import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChapterSchema } from './schemas/chapters.schema';
import { UsersSchema } from 'src/users/schemas/users.schema';
import { SharedService } from 'src/shared/shared.service';
import { ServicesResponse } from 'src/responses/response';
import { Logs, LogsSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Users', schema: UsersSchema },
      { name: Logs.name, schema: LogsSchema },
    ]),
    AuthModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, SharedService, ServicesResponse],
  exports: [ServicesResponse],
})
export class ChaptersModule {}
