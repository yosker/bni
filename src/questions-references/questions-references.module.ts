import { Module } from '@nestjs/common';
import { QuestionsReferencesService } from './questions-references.service';
import { QuestionsReferencesController } from './questions-references.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/jwt.constants';
import { Users, UsersSchema } from 'src/users/schemas/users.schema';
import {
  QuestionsReferences,
  QuestionsReferencesSchema,
} from './schemas/questions-references.schema';
import { ServicesResponse } from 'src/responses/response';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PaginateResult } from 'src/shared/pagination/pagination-result';
import {
  References,
  ReferencesSchema,
} from 'src/references/schemas/references.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionsReferences.name,
        schema: QuestionsReferencesSchema,
      },
      {
        name: References.name,
        schema: ReferencesSchema,
      },
      {
        name: Users.name,
        schema: UsersSchema,
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
  controllers: [QuestionsReferencesController],
  providers: [
    QuestionsReferencesService,
    ServicesResponse,
    JwtStrategy,
    PaginateResult,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class QuestionsReferencesModule {}
