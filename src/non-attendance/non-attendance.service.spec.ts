import { Test, TestingModule } from '@nestjs/testing';
import { NonAttendanceService } from './non-attendance.service';

describe('NonAttendanceService', () => {
  let service: NonAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NonAttendanceService],
    }).compile();

    service = module.get<NonAttendanceService>(NonAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
