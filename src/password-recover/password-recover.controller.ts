import {  
  Controller,
  Get,
  Param,
  Res} from '@nestjs/common';
import { PasswordRecoverService } from './password-recover.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('password-recover')
@Controller('password-recover')
export class PasswordRecoverController {
    constructor(private passwordRecoverService: PasswordRecoverService) {}

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
}
