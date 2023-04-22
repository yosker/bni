import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Query,
  Req
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

  @Post('/update')
  async update(
    @Body() attendanceDTO: AttendanceDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
    @Req() req,
  ) {
    return await this.attendanceService.update(req, attendanceDTO, res, jwtPayload);
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

  @Get('/noAttendances/')
  async getNoAttendances(
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
    @Query() { skip = 0, limit = 200 }: PaginationParams,
  ) {
    return await this.attendanceService.getNoAttendances(
      res,
      jwtPayload,
      skip,
      limit,
    );
  }

  @Get('/updateLetter/:id')
  async updatLetterSend(
    @Param('id') id: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return await this.attendanceService.sendLetter(id, jwtPayload, res);
  }
}
