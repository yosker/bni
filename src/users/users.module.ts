import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schema';
import { ServicesResponse } from 'src/responses/response';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { RolesModule } from 'src/roles/roles.module';
import { Roles, RolesSchema } from 'src/roles/schemas/roles.schema';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { SharedService } from 'src/shared/shared.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Roles.name,
        schema: RolesSchema,
      },
    ]),
    AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesModule, ServicesResponse, JwtStrategy, SharedService],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
