import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { ServicesResponse } from 'src/responses/response';
import { TreasuryDTO } from './dto/treasury.dto';
import { TreasuryService } from './treasury.service';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('treasury')

@Controller('treasury')
export class TreasuryController {

    constructor(private treasusyService: TreasuryService) {}

    @Post('/create')
    async create(
      @Body() treasuryDTO: TreasuryDTO,
    ): Promise<ServicesResponse> {
      return await this.treasusyService.create(treasuryDTO);
    }


    @Get('/userPayments/:userId')
    async getVisitors(@Param('userId') userId: string): Promise<ServicesResponse> {
      return await this.treasusyService.userPaymentList(userId);
    }
    
}
