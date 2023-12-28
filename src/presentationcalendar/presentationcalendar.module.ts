import { Module } from '@nestjs/common';
import { PresentationcalendarController } from './presentationcalendar.controller';
import { PresentationcalendarService } from './presentationcalendar.service';
import { PresentationCalendarSchema } from './schemas/presentationcalendar.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';
import { UsersSchema } from 'src/users/schemas/users.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PresentationCalendar', schema: PresentationCalendarSchema },
      { name: 'Users', schema: UsersSchema },
      
    ]),
    AuthModule,
  ],
  
  controllers: [PresentationcalendarController],
  providers: [PresentationcalendarService,ServicesResponse, SharedService]
})
export class PresentationcalendarModule {}
