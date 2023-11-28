import {
    Body,
    Controller,
    Get,
    Patch,
    Param,
    Post,
    Res,
    UseGuards,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { MonitoringLettersDTO } from './dto/monitoringletters.dto';
import { MonitoringlettersService } from './monitoringletters.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';


@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('monitoringletters')
@Controller('monitoringletters')
export class MonitoringlettersController {
    constructor(private monitoringlettersService: MonitoringlettersService) {}

    @Post('/create')
    async create(
      @Body() monitoringLettersDTO: MonitoringLettersDTO,
      @Res() res: Response,
      @Auth() jwtPayload: JWTPayload,
    ): Promise<Response> {
      return await this.monitoringlettersService.create(monitoringLettersDTO, res, jwtPayload);
    }

    
  @Get('/findAll/:visitorId')
  async findAll(
    @Param('visitorId') visitorId: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.monitoringlettersService.findAll(visitorId,jwtPayload, res);
  }

  
  @Get('findById/:commentId')
  getCommentById(
    @Param('commentId') commentId: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return this.monitoringlettersService.findById(commentId, jwtPayload, res);
  }

  @Patch('edit/:id')
  update(
    @Param('id') id: string,
    @Body() monitoringLettersDTO: MonitoringLettersDTO,
    @Res() res: Response
  ) {
    return this.monitoringlettersService.update(id, monitoringLettersDTO, res);
  }


}
