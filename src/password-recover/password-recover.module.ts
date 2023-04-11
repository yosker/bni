import { Module } from '@nestjs/common';
import { PasswordRecoverController } from './password-recover.controller';
import { PasswordRecoverService } from './password-recover.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import { UsersModule  } from 'src/users/users.module';
import { ServicesResponse } from 'src/responses/response';
import { SharedService } from 'src/shared/shared.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
     
    ]),
    AuthModule,
  ],
  controllers: [PasswordRecoverController],
  providers: [PasswordRecoverService, UsersModule, ServicesResponse, SharedService],
})
export class PasswordRecoverModule {}
