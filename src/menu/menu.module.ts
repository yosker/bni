import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { ServicesResponse } from 'src/responses/response';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from 'src/chapters/schemas/chapters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [MenuController],
  providers: [MenuService, ServicesResponse, UsersModule]
})
export class MenuModule { }
