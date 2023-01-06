import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Interviews, InterviewsSchema } from './schemas/interviews.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Interviews.name,
        schema: InterviewsSchema,
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
  controllers: [InterviewsController],
  providers: [InterviewsService, ServicesResponse, JwtStrategy, SharedService],
  exports: [JwtStrategy, PassportModule],
})
export class InterviewsModule {}
