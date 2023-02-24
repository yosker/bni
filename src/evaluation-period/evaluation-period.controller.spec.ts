import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationPeriodController } from './evaluation-period.controller';

describe('EvaluationPeriodController', () => {
  let controller: EvaluationPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationPeriodController],
    }).compile();

    controller = module.get<EvaluationPeriodController>(EvaluationPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
