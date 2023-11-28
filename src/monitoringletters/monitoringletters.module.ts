import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringlettersController } from './monitoringletters.controller';
import { MonitoringlettersService } from './monitoringletters.service';
import { MonitoringLettersSchema } from './schemas/monitoringletters.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MonitoringLetters', schema: MonitoringLettersSchema }
      
    ]),
    AuthModule,
  ],
  controllers: [MonitoringlettersController],
  providers: [MonitoringlettersService, ServicesResponse, SharedService]
})
export class MonitoringlettersModule {}
