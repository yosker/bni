import { Test, TestingModule } from '@nestjs/testing';
import { NetinterviewService } from './netinterview.service';

describe('NetinterviewService', () => {
  let service: NetinterviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetinterviewService],
    }).compile();

    service = module.get<NetinterviewService>(NetinterviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
