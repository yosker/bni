import { Controller, Post, Body, Get, Res, UseGuards, Patch } from '@nestjs/common';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private chapterService: ChaptersService) { }

  @Post('/create')
  async create(
    @Body() chapterDTO: CreateChapterDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ): Promise<Response> {
    return await this.chapterService.create(chapterDTO, jwtPayload, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('/getChapterData')
  findChapterData(
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return this.chapterService.getChapter(jwtPayload, res);
  }

  
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), JwtGuard)
  @Patch('/editConfigChapter')
  async updateChapter(
    @Auth() jwtPayload: JWTPayload,
    @Body() createChapterDTO: CreateChapterDTO,
    @Res() res: Response,
  ): Promise<any> {
    return await this.chapterService.updateChapter(
      jwtPayload,
      createChapterDTO,
      res,
    );
  }

}
