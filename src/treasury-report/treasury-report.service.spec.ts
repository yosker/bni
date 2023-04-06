import { Test, TestingModule } from '@nestjs/testing';
import { TreasuryReportService } from './treasury-report.service';

describe('TreasuryReportService', () => {
  let service: TreasuryReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreasuryReportService],
    }).compile();

    service = module.get<TreasuryReportService>(TreasuryReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
