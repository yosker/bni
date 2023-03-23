import { Module } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { References, ReferencesSchema } from './schemas/references.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { ServicesResponse } from 'src/responses/response';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: References.name,
        schema: ReferencesSchema,
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
  controllers: [ReferencesController],
  providers: [ReferencesService, ServicesResponse, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class ReferencesModule {}
