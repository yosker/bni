import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoverController } from './password-recover.controller';

describe('PasswordRecoverController', () => {
  let controller: PasswordRecoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordRecoverController],
    }).compile();

    controller = module.get<PasswordRecoverController>(PasswordRecoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
