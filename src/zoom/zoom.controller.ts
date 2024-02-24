import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { LocalTime } from 'src/shared/utils/local-time-stamp/local-time.decorator';
import { LocalTimeInterceptor } from 'src/shared/utils/local-time-stamp/local-time.interceptor';
import { Role } from 'src/auth/decorators/Role.decorator';

@LocalTime()
@UseInterceptors(LocalTimeInterceptor)
@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Zoom')
@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @Post()
  getUsersByMeetingId(
    @Body() createZoomDto: CreateZoomDto,
    @Res() res: Response,
  ) {
    return this.zoomService.getUsersByMeetingId(createZoomDto, res);
  }

  @Patch('/setUsersMeeting')
  setUsersByMeetingId(
    @Body() filters: any,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return this.zoomService.setUsersByMeetingId(jwtPayload, res, filters);
  }

  @Get('token')
  findOne(@Body() filters: any, @Res() res: Response) {
    return this.zoomService.findOne(res, filters);
  }

  @Patch('/updateTokenChapter')
  updateTokenChapter(@Body() filters: any, @Res() res: Response) {
    return this.zoomService.updateTokenChapter(res, filters);
  }

  @Get('meetings/')
  getMeetings(@Body() filters: any, @Res() res: Response) {
    return this.zoomService.getMeetings(res, filters);
  }
  
  @Role('Presidente','Vicepresidente','Tesorería','Anfitriones')
  @Get('getZoomData')
  getData( 
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response) {
    return this.zoomService.handleAttendanceProcess(jwtPayload, res);
  }
  
  @Role('Presidente','Vicepresidente','Tesorería','Anfitriones')
  @Post('updateAttendaceNetworker')
  async updateNetworkerAttendance(
    @Body() obj: any,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ): Promise<Response> {
    return await this.zoomService.updateAttendaceNet(obj,jwtPayload, res);
  }

}
