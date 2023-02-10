import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
} from '@nestjs/common';
import { ServicesResponse } from 'src/responses/response';
import { AttendanceService } from './attendance.service';
import { AttendanceDTO } from './dto/attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
// @ApiBearerAuth()
// @UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/create')
  async create(@Body() attendanceDTO: AttendanceDTO, @Res() res: Response) {
    return await this.attendanceService.create(attendanceDTO, res);
  }

  @Get('/visitors/:chapterId')
  async getVisitors(
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return await this.attendanceService.VisitorsList(chapterId, res);
  }

  @Get('/networkers/:chapterId')
  async getNetworkers(
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return await this.attendanceService.NetworkersList(chapterId, res);
  }
}
