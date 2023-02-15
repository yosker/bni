import { Module } from '@nestjs/common';
import { NetinterviewController } from './netinterview.controller';
import { NetinterviewService } from './netinterview.service';
import { ServicesResponse } from 'src/responses/response'
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { NetinterviewSchema } from 'src/netinterview/schemas/netinterview.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Netinterview', schema: NetinterviewSchema },

    ]),
    AuthModule,
  ],

  controllers: [NetinterviewController],
  providers: [NetinterviewService, ServicesResponse]
})
export class NetinterviewModule { }
