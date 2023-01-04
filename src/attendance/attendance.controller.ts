import { Controller, Post, Body, Get, UseGuards  } from '@nestjs/common';
import { ServicesResponse } from 'src/responses/response';
import { AttendanceService } from './attendance.service'
import { AttendanceDTO } from './dto/attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {

    constructor(private attendanceService: AttendanceService) {}

    @Post('/create')
    async create(
      @Body() attendanceDTO: AttendanceDTO,
    ): Promise<ServicesResponse> {
      return await this.attendanceService.create(attendanceDTO);
    }

    @Get('/networkers')
    async get(): Promise<any> {
      return await this.attendanceService.networkersList();
    }
    
}
