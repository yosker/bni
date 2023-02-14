import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/decorators/Role.decorator';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';

@ApiBearerAuth()
@Role('Admin')
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ): Promise<any> {
    return await this.usersService.create(
      file.buffer,
      file.originalname,
      req.body,
      res,
    );
  }

  @Patch('/updateUser')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ): Promise<any> {
    return this.usersService.update(
      file.buffer,
      file.originalname,
      req.body,
      res,
    );
  }

  @Post('/createVistor')
  async createVisotors(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createVisitor(createUserDto, res);
  }

  @Get('/networkersList/:chapterId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Param('chapterId') chapterId: string, @Res() res: Response) {
    return this.usersService.findAll(chapterId, res);
  }

  @Get('/userById/:id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.findOne(id, res);
  }

  @Get('auhtuser')
  findAuth(@Auth() jWTPayload: JWTPayload) {
    console.log(jWTPayload);
    return jWTPayload;
  }

  @Get('/getInformation/:id/:chapterId')
  findNetworkerData(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return this.usersService.findNetworkerData(id, chapterId, res);
  }

  @Get('/deleteUser/:userId')
  delete(@Param('userId') userId: string, @Res() res: Response) {
    return this.usersService.delete(userId, res);
  }
}
