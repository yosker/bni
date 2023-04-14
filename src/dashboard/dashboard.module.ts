import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service'
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { TreasurySchema } from 'src/treasury/schemas/treasury.schema';
import { ChargesSchema } from 'src/charges/schemas/charges.schema';
import { TreasuryModule } from 'src/treasury/treasury.module';
import { ChargesModule } from 'src/charges/charges.module';
import { MembershipActivitiesModule } from 'src/membership-activities/membership-activities.module';
import {
  MembershipActivities,
  MembershipActivitiesSchema,
} from 'src/membership-activities/schemas/membership-activity.schema';
@Module({
  imports: [
    MongooseModule.forFeature([

      {
        name: Users.name,
        schema: UsersSchema,
      },
      { name: 'Attendance', schema: AttendanceSchema },
      { name: 'Treasury', schema: TreasurySchema },
      { name: 'Charges', schema: ChargesSchema },
      { name: MembershipActivities.name, schema: MembershipActivitiesSchema },
    ]),
    AuthModule,
  ],

  controllers: [DashboardController],
  providers: [DashboardService, ServicesResponse, UsersModule, TreasuryModule, ChargesModule, MembershipActivitiesModule]
})
export class DashboardModule { }
