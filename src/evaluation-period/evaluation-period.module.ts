import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ServicesResponse } from 'src/responses/response';
import { EvaluationPeriodController } from './evaluation-period.controller';
import { EvaluationPeriodService } from './evaluation-period.service';
import { EvaluationPeriodSchema } from './schemas/evaluation-period.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EvaluationPeriod', schema: EvaluationPeriodSchema }

    ]),
    AuthModule,
  ],
  controllers: [EvaluationPeriodController],
  providers: [EvaluationPeriodService, ServicesResponse]
})
export class EvaluationPeriodModule { }
