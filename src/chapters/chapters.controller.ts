import { Controller, Post, Res, HttpStatus, Body } from '@nestjs/common';
import { CreateChapterDTO } from './dto/chapters.dto';
import { ChaptersService } from './chapters.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {

    constructor(private chapterService: ChaptersService) { }
    @Post('/createChapter')
    async createPost(@Res() res, @Body() chapterDTO: CreateChapterDTO) {

        const response = await this.chapterService.createChapter(chapterDTO)
      
        return res.status(HttpStatus.OK).json({
            response: response
        })
    }
}

/*
https://www.youtube.com/watch?v=jEKsD5f3Bqc
nest g module chapters 
nest g controller chapters 
nest g service chapteres
*/