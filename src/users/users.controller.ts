import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '../auth/decorators/Role.decorator';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'nestjs-search';
import { Response } from 'express';

@ApiBearerAuth()
@Role('Admin')
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return await this.usersService.create(createUserDto, res);
  }

  @Post('/createVistor')
  async createVisotors(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createVisitor(createUserDto, res);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Body() params: PaginationDto, @Res() res: Response) {
    return this.usersService.findAll(params, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.findOne(id, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.usersService.update(id, updateUserDto, res);
  }

  @Get('/getInformation/:id/:chapterId')
  findNetworkerData(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return this.usersService.findNetworkerData(id, chapterId, res);
  }
}
