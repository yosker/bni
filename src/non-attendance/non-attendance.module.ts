import { Module } from '@nestjs/common';
import { NonAttendanceService } from './non-attendance.service';
import { NonAttendanceController } from './non-attendance.controller';
import { UsersModule } from 'src/users/users.module';
import { ServicesResponse } from 'src/responses/response';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NonAttendances,
  NonAttendancesSchema,
} from './schemas/non-attendance.schema';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonAttendances.name, schema: NonAttendancesSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    AuthModule,
  ],
  controllers: [NonAttendanceController],
  providers: [NonAttendanceService, ServicesResponse, UsersModule],
})
export class NonAttendanceModule {}
