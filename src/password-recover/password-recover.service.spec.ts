import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoverService } from './password-recover.service';

describe('PasswordRecoverService', () => {
  let service: PasswordRecoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordRecoverService],
    }).compile();

    service = module.get<PasswordRecoverService>(PasswordRecoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
