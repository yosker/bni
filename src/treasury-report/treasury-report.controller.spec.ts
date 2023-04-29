import { Test, TestingModule } from '@nestjs/testing';
import { TreasuryReportController } from './treasury-report.controller';

describe('TreasuryReportController', () => {
  let controller: TreasuryReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreasuryReportController],
    }).compile();

    controller = module.get<TreasuryReportController>(TreasuryReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
