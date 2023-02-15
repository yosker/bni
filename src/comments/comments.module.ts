import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Comments, CommentsSchema } from './schemas/comments.schema';
import { ServicesResponse } from 'src/responses/response';
import { UsersModule } from 'src/users/users.module';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: CommentsSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, ServicesResponse, UsersModule],
  exports: [],
})
export class CommentsModule {}
