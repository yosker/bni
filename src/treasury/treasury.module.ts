import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreasuryController } from './treasury.controller';
import { TreasuryService } from './treasury.service';
import { TreasurySchema } from './schemas/treasury.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailProperties } from 'src/shared/emailProperties';
import { SharedService } from 'src/shared/shared.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Treasury', schema: TreasurySchema },
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [TreasuryController],
  providers: [TreasuryService, UsersModule, ServicesResponse, EmailProperties, SharedService]
})
export class TreasuryModule { }
