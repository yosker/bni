import { Module } from '@nestjs/common';
import { EmailAccountsController } from './email-accounts.controller';
import { EmailAccountsService } from './email-accounts.service';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [EmailAccountsController],
  providers: [EmailAccountsService]
})
export class EmailAccountsModule {}
