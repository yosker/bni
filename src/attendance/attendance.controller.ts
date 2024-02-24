import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Query,
  UseInterceptors,
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
import { LocalTimeInterceptor } from 'src/shared/utils/local-time-stamp/local-time.interceptor';
import { LocalTime } from 'src/shared/utils/local-time-stamp/local-time.decorator';
import { Role } from 'src/auth/decorators/Role.decorator';

@LocalTime()
@UseInterceptors(LocalTimeInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('/update')
  async updateNetAttendance(
    @Body() attendanceDTO: any,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ): Promise<Response> {
    return await this.attendanceService.update(attendanceDTO, res, jwtPayload);
  }

  @Get('/visitors/:chapterId/:sessionDate')
  async getVisitors(
    @Param('chapterId') chapterId: string,
    @Param('sessionDate') sessionDate: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.attendanceService.VisitorsListApp(
      chapterId,
      sessionDate,
      res,
      jwtPayload,
    );
  }
  
  @Get('/visitorsBackOffice/:chapterId/:sessionDate')
  async getVisitorsBackOffice(
    @Param('chapterId') chapterId: string,
    @Param('sessionDate') sessionDate: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.attendanceService.VisitorsListBackOffice(
      chapterId,
      sessionDate,
      res,
      jwtPayload,
    );
  }

  @Get('/networkers/:chapterId/:sessionDate')
  async getNetworkers(
    @Param('chapterId') chapterId: string,
    @Param('sessionDate') sessionDate: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.attendanceService.NetworkersList(
      chapterId,
      sessionDate,
      res,
      jwtPayload,
    );
  }
  @Role('Presidente','Vicepresidente','Tesorería','Tesorería','Membresías')
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

  @Get('/updateLetter/:id/:attendanceNumber')
  async updatLetterSend(
    @Param('id') id: string,
    @Param('attendanceNumber') attendanceNumber: number,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return await this.attendanceService.sendLetter(
      id,
      attendanceNumber,
      jwtPayload,
      res,
    );
  }

  @Role('Presidente','Vicepresidente','Tesorería','Anfitriones','Membresías')
  @Get('/getUsersAttendancesList')
  async UsersAttendancesList(
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return await this.attendanceService.getUsersAttendances(
      jwtPayload,
      res,
    );
  }
}
