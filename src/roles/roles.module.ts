import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesResponse } from 'src/responses/response';
import { Roles, RolesSchema } from './schemas/roles.schema';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RolesSchema,
      },
    ]),
  ],
  exports: [],
  controllers: [RolesController],
  providers: [RolesService, ServicesResponse],
})
export class RolesModule {}
