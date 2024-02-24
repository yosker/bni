import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { JWTPayload } from 'src/auth/jwt.payload';
import { TreasuryReportService } from './treasury-report.service';
import { Response } from 'express';
import { Role } from 'src/auth/decorators/Role.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@Controller('treasury-report')
export class TreasuryReportController {
  constructor(private treasuryReportService: TreasuryReportService) {}

  @Role('Presidente','Vicepresidente','Tesorería')
  @Get('/getData')
  async getData(@Auth() jwtPayload: JWTPayload, @Res() res: Response) {
    return await this.treasuryReportService.getFullData(jwtPayload, res);
  }
}
