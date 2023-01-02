import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './schemas/attendance.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Attendance', schema: AttendanceSchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, ServicesResponse]
})
export class AttendanceModule {}
