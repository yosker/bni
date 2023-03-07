import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Query,
} from '@nestjs/common';
import { UsersInterviewsService } from './users-interviews.service';
import { CreateUsersInterviewDto } from './dto/create-users-interview.dto';
import { UpdateUsersInterviewDto } from './dto/update-users-interview.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationParams } from 'src/shared/pagination/paginationParams';

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
  ) {
    return this.usersInterviewsService.create(createUsersInterviewDto, res);
  }

  @Get()
  findAll(@Query() { skip, limit }: PaginationParams) {
    return this.usersInterviewsService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersInterviewsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersInterviewDto: UpdateUsersInterviewDto,
  ) {
    return this.usersInterviewsService.update(id, updateUsersInterviewDto);
  }
}
