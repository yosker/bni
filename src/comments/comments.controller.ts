import { Controller, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Res() res: Response) {
    return this.commentsService.create(createCommentDto, res);
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.commentsService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.commentsService.findOne(id, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Res() res: Response,
  ) {
    return this.commentsService.update(id, updateCommentDto, res);
  }
}
