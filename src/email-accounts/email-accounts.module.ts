import { Module } from '@nestjs/common';
import { EmailAccountsController } from './email-accounts.controller';
import { EmailAccountsService } from './email-accounts.service';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  EmailAccounts,
  EmailAccountsSchema,
} from './schemas/email-accounts.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EmailAccounts.name,
        schema: EmailAccountsSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [],
  controllers: [EmailAccountsController],
  providers: [EmailAccountsService, ServicesResponse],
})
export class EmailAccountsModule {}
