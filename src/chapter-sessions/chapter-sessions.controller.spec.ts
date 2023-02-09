import { Test, TestingModule } from '@nestjs/testing';
import { ChapterSessionsController } from './chapter-sessions.controller';

describe('ChapterSessionsController', () => {
  let controller: ChapterSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterSessionsController],
    }).compile();

    controller = module.get<ChapterSessionsController>(ChapterSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
