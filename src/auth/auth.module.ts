import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ServicesResponse } from 'src/responses/response';
import { IpService } from 'src/shared/utils/ip/ip.service';
import { Logs, LogsSchema } from 'src/logs/schemas/logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      { name: Logs.name, schema: LogsSchema },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ServicesResponse, IpService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
