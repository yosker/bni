import { Test, TestingModule } from '@nestjs/testing';
import { MembershipActivitiesController } from './membership-activities.controller';
import { MembershipActivitiesService } from './membership-activities.service';

describe('MembershipActivitiesController', () => {
  let controller: MembershipActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipActivitiesController],
      providers: [MembershipActivitiesService],
    }).compile();

    controller = module.get<MembershipActivitiesController>(MembershipActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
