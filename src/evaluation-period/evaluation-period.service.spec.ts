import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationPeriodService } from './evaluation-period.service';

describe('EvaluationPeriodService', () => {
  let service: EvaluationPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationPeriodService],
    }).compile();

    service = module.get<EvaluationPeriodService>(EvaluationPeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
