import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ChapterSessionsService } from './chapter-sessions.service';
import { ChapterSessionDTO } from './dto/chapterSessions.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('ChapterSession')
@Controller('chapterSessions')
export class ChapterSessionsController {
  constructor(private chapterSessionService: ChapterSessionsService) {}

  @Post('/create')
  async create(
    @Body() chapterSessionDTO: ChapterSessionDTO,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.chapterSessionService.create(chapterSessionDTO, res);
  }

  @Get('/:chapterId')
  async getVisitors(
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.chapterSessionService.sessionList(chapterId, res);
  }
}
