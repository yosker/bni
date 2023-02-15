import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesResponse } from 'src/responses/response';
import { Roles, RolesSchema } from './schemas/roles.schema';
import { RolesService } from './roles.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RolesSchema,
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService, ServicesResponse],
  exports: [],
})
export class RolesModule {}
