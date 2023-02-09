import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ServicesResponse } from 'src/responses/response';
import { ChapterSessionsService } from './chapter-sessions.service';
import { ChapterSessionDTO } from './dto/chapterSessions.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('ChapterSession')
@Controller('chapter-sessions')
export class ChapterSessionsController {
  constructor(private chapterSessionService: ChapterSessionsService) { }

  @Post('/create')
  async create(
    @Body() chapterSessionDTO: ChapterSessionDTO,
  ): Promise<ServicesResponse> {
    return await this.chapterSessionService.create(chapterSessionDTO);
  }

  @Get('/:chapterId')
  async getVisitors(@Param('chapterId') chapterId: string): Promise<ServicesResponse> {
    return await this.chapterSessionService.sessionList(chapterId);
  }
}
