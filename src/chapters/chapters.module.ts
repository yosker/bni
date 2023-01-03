import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from './schemas/chapters.schema';
import { UsersSchema } from 'src/users/schemas/users.schema';
import { SharedService } from 'src/shared/shared.service';
import { ServicesResponse } from 'src/responses/response';
import { AuthModule } from 'src/auth/auth.module';
import { EmailProperties } from 'src/shared/emailProperties'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Users', schema: UsersSchema },
    ]),
    AuthModule,
  ],
  controllers: [ChaptersController],
  providers: [
    ChaptersService,
    SharedService,
    ServicesResponse,
    EmailProperties,
  ],
})
export class ChaptersModule {}
