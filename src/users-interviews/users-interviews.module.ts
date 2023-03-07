import { Module } from '@nestjs/common';
import { UsersInterviewsService } from './users-interviews.service';
import { UsersInterviewsController } from './users-interviews.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import {
  UsersInterviews,
  UsersInterviewsSchema,
} from './schemas/interviews.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UsersInterviews.name,
        schema: UsersInterviewsSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersInterviewsController],
  providers: [
    UsersInterviewsService,
    ServicesResponse,
    JwtStrategy,
    SharedService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class UsersInterviewsModule {}
