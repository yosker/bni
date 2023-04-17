import { Module } from '@nestjs/common';
import { TreasuryReportController } from './treasury-report.controller';
import { TreasuryReportService } from './treasury-report.service';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';
import { TreasurySchema } from 'src/treasury/schemas/treasury.schema';
import { ChargesSchema } from 'src/charges/schemas/charges.schema';

import { TreasuryModule } from 'src/treasury/treasury.module';
import { ChargesModule } from 'src/charges/charges.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Treasury', schema: TreasurySchema },
      { name: 'Charges', schema: ChargesSchema },
    ]),
    AuthModule,
  ],

  controllers: [TreasuryReportController],
  providers: [
    TreasuryReportService,
    ServicesResponse,
    TreasuryModule,
    ChargesModule,
  ],
})
export class TreasuryReportModule {}
