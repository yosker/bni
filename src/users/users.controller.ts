import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from '../auth/decorators/Role.decorator';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto, projectionDto } from 'nestjs-search';

// @ApiBearerAuth()
// @Role('Admin')
// @UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('/createVistor')
  async createVisotors(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createVisitor(createUserDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll(@Body() params: PaginationDto) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/getInformation/:id/:chapterId')
  findNetworkerData(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.usersService.findNetworkerData(id, chapterId);
  }
}
