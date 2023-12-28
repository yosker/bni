import { Test, TestingModule } from '@nestjs/testing';
import { PresentationcalendarService } from './presentationcalendar.service';

describe('PresentationcalendarService', () => {
  let service: PresentationcalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationcalendarService],
    }).compile();

    service = module.get<PresentationcalendarService>(PresentationcalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
