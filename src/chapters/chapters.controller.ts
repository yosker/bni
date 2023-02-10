import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post('/create')
  async create(
    @Body() chapterDTO: CreateChapterDTO,
    @Res() res: Response
  ): Promise<Response> {
    return await this.chapterService.create(chapterDTO, res);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return this.chapterService.getChapters();
  }
}
