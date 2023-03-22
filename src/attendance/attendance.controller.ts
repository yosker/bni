import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDTO } from './dto/attendance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { PaginationParams } from 'src/shared/pagination/paginationParams';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/create')
  async create(
    @Body() attendanceDTO: AttendanceDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.attendanceService.create(attendanceDTO, res, jwtPayload);
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

  @Get('/noAttendances/:attendaceDate')
  async getNoAttendances(
    @Param('attendaceDate') attendaceDate: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
    @Query() { skip, limit }: PaginationParams,
  ) {
    return await this.attendanceService.getNoAttendances(
      attendaceDate,
      res,
      jwtPayload,
      skip,
      limit,
    );
  }
}
