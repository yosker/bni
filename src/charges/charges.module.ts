import { Module } from '@nestjs/common';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChargesSchema } from './schemas/charges.schema';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Charges', schema: ChargesSchema }]),
    AuthModule,
  ],

  controllers: [ChargesController],
  providers: [ChargesService, ServicesResponse, SharedService],
})
export class ChargesModule {}
