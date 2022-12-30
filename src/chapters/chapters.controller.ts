import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { ApiTags } from '@nestjs/swagger';
import { TokenJwt } from '../auth/decorators/token-jwt.decorator';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { ServicesResponse } from 'src/responses/response';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post('/create')
  @TokenJwt('test')
  // @UseGuards(AuthGuard(), JwtGuard)
  async createPost(
    @Body() chapterDTO: CreateChapterDTO,
  ): Promise<ServicesResponse> {
    return await this.chapterService.createChapter(chapterDTO);
  }
}
