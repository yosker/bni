import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { PasswordRecoverService } from './password-recover.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('password-recover')
@Controller('password-recover')
export class PasswordRecoverController {
  constructor(private passwordRecoverService: PasswordRecoverService) { }

  @Get('/:email')
  async getNetworkers(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    return await this.passwordRecoverService.getNewPassword(
      email,
      res
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard(), JwtGuard)
  @Post()
  async updatePass(
    @Body() pass: string,
    @Auth() jwtPayload: JWTPayload,
    @Res() res: Response,
  ) {
    return await this.passwordRecoverService.updatePassword(
      pass,
      jwtPayload,
      res
    );
  }
}
