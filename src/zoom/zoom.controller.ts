import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { UpdateZoomDto } from './dto/update-zoom.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';

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

  @Patch(':meetingId/:chapterId')
  setUsersByMeetingId(
    @Param('meetingId') meetingId: string,
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return this.zoomService.setUsersByMeetingId(chapterId, meetingId, res);
  }

  @Get('token/:chapterId')
  findOne(@Param('chapterId') chapterId: string, @Res() res: Response) {
    return this.zoomService.findOne(chapterId, res);
  }

  @Patch()
  update(@Body() updateZoomDto: UpdateZoomDto, @Res() res: Response) {
    return this.zoomService.updateTokenChapterToken(updateZoomDto, res);
  }
}
