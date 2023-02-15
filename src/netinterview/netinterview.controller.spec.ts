import { Test, TestingModule } from '@nestjs/testing';
import { NetinterviewController } from './netinterview.controller';

describe('NetinterviewController', () => {
  let controller: NetinterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetinterviewController],
    }).compile();

    controller = module.get<NetinterviewController>(NetinterviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
