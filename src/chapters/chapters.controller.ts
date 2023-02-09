import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { ApiTags } from '@nestjs/swagger';
import { ServicesResponse } from 'src/responses/response';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post('/create')
  async create(
    @Body() chapterDTO: CreateChapterDTO,
  ): Promise<ServicesResponse> {
    return await this.chapterService.create(chapterDTO);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return this.chapterService.getChapters();
  }
}
