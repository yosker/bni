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
import { PresentationCalendarDTO } from './dto/presentationcalendar.dto';
import { PresentationcalendarService } from './presentationcalendar.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Role } from 'src/auth/decorators/Role.decorator';


@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('presentationcalendar')
@Controller('presentationcalendar')
export class PresentationcalendarController {

  constructor(private presentationcalendarService: PresentationcalendarService) {}
  @Role('Presidente','Vicepresidente','Tesorería')
  @Post('/create')
  async create(
    @Body() presentationCalendarDTO: PresentationCalendarDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ): Promise<Response> {
    return await this.presentationcalendarService.create(presentationCalendarDTO, res, jwtPayload);
  }
  
  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/findAll')
  async findAll(
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.presentationcalendarService.findAll(jwtPayload, res);
  }
  
  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('delete/:id')
  async deleteRecord(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    return this.presentationcalendarService.delete(id, res);
  }
  
  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/findUsersAndPresentationsCalendar')
  async findUsersAndPresentations(
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.presentationcalendarService.getUsersAndPresentationsCalendar(jwtPayload, res);
  }
  


}
