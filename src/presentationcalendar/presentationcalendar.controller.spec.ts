import { Test, TestingModule } from '@nestjs/testing';
import { PresentationcalendarController } from './presentationcalendar.controller';

describe('PresentationcalendarController', () => {
  let controller: PresentationcalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationcalendarController],
    }).compile();

    controller = module.get<PresentationcalendarController>(PresentationcalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
