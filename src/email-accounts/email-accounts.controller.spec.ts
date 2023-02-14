import { Test, TestingModule } from '@nestjs/testing';
import { EmailAccountsController } from './email-accounts.controller';

describe('EmailAccountsController', () => {
  let controller: EmailAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailAccountsController],
    }).compile();

    controller = module.get<EmailAccountsController>(EmailAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
