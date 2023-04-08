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
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Interviews')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(
    @Body() createInterviewDto: CreateInterviewDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.interviewsService.save(createInterviewDto, res, jwtPayload);
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.interviewsService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.interviewsService.findOne(id, res);
  }

  @Patch('interviewUser/:id')
  updateInterviewUser(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Res() res: Response,
  ) {
    return this.interviewsService.updateInterview(id, updateInterviewDto, res);
  }
}
