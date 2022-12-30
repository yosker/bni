import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from './schemas/chapters.schema';
import { UsersSchema } from 'src/users/schemas/users.schema';
import { SharedService } from 'src/shared/shared.service';

@Module({
  imports:[ 
    MongooseModule.forFeature([
      {name: 'Chapter', schema: ChapterSchema},
      {name: 'Users', schema: UsersSchema}
    ]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService, SharedService]
})
export class ChaptersModule {}
