import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Response } from 'express';
import { DashboardService } from './dashboard.service'
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@Controller('dashboard')
export class DashboardController {

    constructor(private dashboardService: DashboardService) { }

    @Get('/getData')
    async getData(
        @Auth() jwtPayload: JWTPayload,
        @Res() res: Response

    ) {
        return await this.dashboardService.getFullData(jwtPayload, res);
    }
}
