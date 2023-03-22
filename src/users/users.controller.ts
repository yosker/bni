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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
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

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
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

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Post('/createVistor')
  async createVisotors(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.createVisitor(createUserDto, res);
  }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('/networkersList/:chapterId/:role')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Param('chapterId') chapterId: string,
    @Param('role') role: string,
    @Res() res: Response,
  ) {
    return this.usersService.findAll(chapterId, role, res);
  }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('/userById/:id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.findOne(id, res);
  }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('auhtuser')
  findAuth(@Auth() jwtPayload: JWTPayload) {
    console.log(jwtPayload);
    return jwtPayload;
  }

  @Get('/getInformation/:id/:chapterId')
  findNetworkerData(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return this.usersService.findNetworkerData(id, chapterId, res);
  }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('/deleteUser/:userId')
  delete(@Param('userId') userId: string, @Res() res: Response) {
    return this.usersService.delete(userId, res);
  }

  @ApiBearerAuth()
  // @Role('Admin')
  @UseGuards(AuthGuard(), JwtGuard)
  @Get('/findAllMembership')
  findAllMembership(@Auth() jwtPayload: JWTPayload, @Res() res: Response) {
    return this.usersService.findUsersMembership(jwtPayload, res);
  }



  @ApiBearerAuth()
  @UseGuards(AuthGuard(), JwtGuard)
  @Patch('/updateAplicationFile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAplication(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Res() res: Response,
  ): Promise<any> {
    return await this.usersService.updateAplicationField(
      id,
      req.body,
      file.buffer,
      file.originalname,
      res,
    );
  }

  @Get('/getApplicationFile/:id')
  findApplicationFile(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.usersService.getApplicationFile(id, res);
  }

}
