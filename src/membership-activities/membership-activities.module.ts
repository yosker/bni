import { Module } from '@nestjs/common';
import { MembershipActivitiesService } from './membership-activities.service';
import { MembershipActivitiesController } from './membership-activities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  MembershipActivities,
  MembershipActivitiesSchema,
} from './schemas/membership-activity.schema';
import { ServicesResponse } from 'src/responses/response';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MembershipActivities.name, schema: MembershipActivitiesSchema },
    ]),
    AuthModule,
  ],
  controllers: [MembershipActivitiesController],
  providers: [MembershipActivitiesService, ServicesResponse],
})
export class MembershipActivitiesModule {}
