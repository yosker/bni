import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { TreasuryDTO } from './dto/treasury.dto';
import { TreasuryService } from './treasury.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Role } from 'src/auth/decorators/Role.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('treasury')
@Controller('treasury')
export class TreasuryController {
  constructor(private treasusyService: TreasuryService) {}

  @Role('Presidente','Vicepresidente','Tesorería')
  @Post('/create')
  async create(
    @Body() treasuryDTO: TreasuryDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ): Promise<Response> {
    return await this.treasusyService.create(treasuryDTO, res, jwtPayload);
  }
 
  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/userPayments/:userId')
  async getVisitors(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.treasusyService.userPaymentList(userId, res);
  }

  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/findAll')
  async findAll(
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.treasusyService.findAll(jwtPayload, res);
  }

  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/deleteContribution/:id')
  async delete(
    @Param('id') id: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.treasusyService.deleteRow(id, jwtPayload, res);
  }
}
