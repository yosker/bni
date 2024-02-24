import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Patch,
} from '@nestjs/common';
import { EvaluationPeriodService } from './evaluation-period.service';
import { EvaluationPeriodDTO } from './dto/evaluation-period.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Role } from 'src/auth/decorators/Role.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Evaluation Period')
@Controller('evaluation-period')
export class EvaluationPeriodController {
  constructor(private evaluationPeriodService: EvaluationPeriodService) {}
 
  @Role('Presidente','Vicepresidente','Tesorería','Membresías')
  @Post('/create')
  async create(
    @Body() evaluationPeriodDTO: EvaluationPeriodDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.evaluationPeriodService.create(
      evaluationPeriodDTO,
      res,
      jwtPayload,
    );
  }

  @Role('Presidente','Vicepresidente','Tesorería','Membresías')
  @Get('/list/:networkerId')
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Param('networkerId') networkerId: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.evaluationPeriodService.evaluationList(
      networkerId,
      jwtPayload,
      res,
    );
  }

  @Role('Presidente','Vicepresidente','Tesorería','Membresías')
  @Get('/detail/:id')
  @UseGuards(AuthGuard('jwt'))
  finDetail(
    @Param('id') id: string,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.evaluationPeriodService.evaluationDetail(id, jwtPayload, res);
  }

  @Role('Presidente','Vicepresidente','Tesorería','Membresías')
  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() evaluationPeriodDTO: EvaluationPeriodDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return await this.evaluationPeriodService.update(
      id,
      evaluationPeriodDTO,
      res,
      jwtPayload,
    );
  }

  @Role('Presidente','Vicepresidente','Tesorería','Membresías')
  @Patch('/delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    return await this.evaluationPeriodService.delete(id, res);
  }
}
