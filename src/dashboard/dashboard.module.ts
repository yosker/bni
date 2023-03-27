import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service'
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
@Module({
  imports: [
    MongooseModule.forFeature([

      {
        name: Users.name,
        schema: UsersSchema,
      },
      { name: 'Attendance', schema: AttendanceSchema },

    ]),
    AuthModule,
  ],

  controllers: [DashboardController],
  providers: [DashboardService, ServicesResponse, UsersModule]
})
export class DashboardModule { }
