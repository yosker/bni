import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ServicesResponse],
})
export class UsersModule {}
