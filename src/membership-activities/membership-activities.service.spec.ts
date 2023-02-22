import { Test, TestingModule } from '@nestjs/testing';
import { MembershipActivitiesService } from './membership-activities.service';

describe('MembershipActivitiesService', () => {
  let service: MembershipActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipActivitiesService],
    }).compile();

    service = module.get<MembershipActivitiesService>(MembershipActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
