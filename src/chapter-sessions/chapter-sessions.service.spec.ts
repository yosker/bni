import { Test, TestingModule } from '@nestjs/testing';
import { ChapterSessionsService } from './chapter-sessions.service';

describe('ChapterSessionsService', () => {
  let service: ChapterSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapterSessionsService],
    }).compile();

    service = module.get<ChapterSessionsService>(ChapterSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
