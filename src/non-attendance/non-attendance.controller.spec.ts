import { Test, TestingModule } from '@nestjs/testing';
import { NonAttendanceController } from './non-attendance.controller';
import { NonAttendanceService } from './non-attendance.service';

describe('NonAttendanceController', () => {
  let controller: NonAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NonAttendanceController],
      providers: [NonAttendanceService],
    }).compile();

    controller = module.get<NonAttendanceController>(NonAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
