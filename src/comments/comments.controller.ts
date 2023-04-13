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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.commentsService.create(createCommentDto, res, jwtPayload);
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.commentsService.findAll(res);
  }

  @Get(':userInterviewId')
  findByUserInterviewId(
    @Param('userInterviewId') userInterviewId: string,
    @Res() res: Response,
  ) {
    return this.commentsService.findByUserInterviewId(userInterviewId, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.commentsService.update(id, updateCommentDto, res, jwtPayload);
  }

  
  @Get('getComment/:visitorId')
  getCommentById(
    @Param('visitorId') visitorId: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return this.commentsService.findById(visitorId,jwtPayload, res);
  }
}
