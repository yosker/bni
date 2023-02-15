import { Test, TestingModule } from '@nestjs/testing';
import { EmailAccountsService } from './email-accounts.service';

describe('EmailAccountsService', () => {
  let service: EmailAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailAccountsService],
    }).compile();

    service = module.get<EmailAccountsService>(EmailAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
