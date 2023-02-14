import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDTO } from './dto/attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/create')
  async create(@Body() attendanceDTO: AttendanceDTO, @Res() res: Response) {
    return await this.attendanceService.create(attendanceDTO, res);
  }

  @Get('/visitors/:chapterId/:sessionDate')
  async getVisitors(
    @Param('chapterId') chapterId: string,
    @Param('sessionDate') sessionDate: string,
    @Res() res: Response,
  ) {
    return await this.attendanceService.VisitorsList(
      chapterId,
      sessionDate,
      res,
    );
  }

  @Get('/networkers/:chapterId/:sessionDate')
  async getNetworkers(
    @Param('chapterId') chapterId: string,
    @Param('sessionDate') sessionDate: string,
    @Res() res: Response,
  ) {
    return await this.attendanceService.NetworkersList(
      chapterId,
      sessionDate,
      res,
    );
  }
}
