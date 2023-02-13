import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Comments, CommentsSchema } from './schemas/comments.schema';
import { ServicesResponse } from 'src/responses/response';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, ServicesResponse],
  exports: [],
})
export class CommentsModule {}
