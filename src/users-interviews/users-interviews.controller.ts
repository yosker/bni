import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersInterviewsService } from './users-interviews.service';
import { CreateUsersInterviewDto } from './dto/create-users-interview.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationParams } from 'src/shared/pagination/paginationParams';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Users Interviews')
@Controller('users-interviews')
export class UsersInterviewsController {
  constructor(
    private readonly usersInterviewsService: UsersInterviewsService,
  ) {}

  @Post()
  create(
    @Body() createUsersInterviewDto: CreateUsersInterviewDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.usersInterviewsService.create(
      createUsersInterviewDto,
      res,
      jwtPayload,
    );
  }

  @Get()
  findAll(@Query() { skip, limit }: PaginationParams) {
    return this.usersInterviewsService.findAll(skip, limit);
  }

  @Get(':userInterviewId')
  findOne(@Param('userInterviewId') userInterviewId: string) {
    return this.usersInterviewsService.findOne(userInterviewId);
  }
}
