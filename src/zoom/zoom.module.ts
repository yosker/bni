import { Module } from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { ZoomController } from './zoom.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChapterSchema } from 'src/chapters/schemas/chapters.schema';
import { UsersSchema } from 'src/users/schemas/users.schema';
import { ServicesResponse } from 'src/responses/response';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/jwt.constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Users } from '../users/schemas/users.schema';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { IpService } from 'src/shared/utils/ip/ip.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chapter', schema: ChapterSchema },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Users', schema: UsersSchema },
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
    HttpModule,
  ],
  controllers: [ZoomController],
  providers: [
    ZoomService,
    HttpModule,
    ServicesResponse,
    JwtStrategy,
    IpService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class ZoomModule {}
