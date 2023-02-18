import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmailAccountsService } from './email-accounts.service';
import { CreateEmailAccountsDTO } from './dto/create-email-accounts.dto';
import { UpdateEmailAccountsDTO } from './dto/update-email-accounts.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Email Accounts')
@Controller('email-accounts')
export class EmailAccountsController {
  constructor(private readonly emailAccountsService: EmailAccountsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateEmailAccountsDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.emailAccountsService.create(createCommentDto, res, jwtPayload);
  }

  @Get()
  findAll(@Res() res: Response, @Auth() jwtPayload: JWTPayload) {
    return this.emailAccountsService.findAll(res, jwtPayload);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.emailAccountsService.findOne(id, res);
  }

  @Patch('edit/:id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateEmailAccountsDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.emailAccountsService.update(
      id,
      updateCommentDto,
      res,
      jwtPayload,
    );
  }

  @Patch(':id')
  delete(@Param('id') id: string, @Res() res: Response) {
    return this.emailAccountsService.delete(id, res);
  }
}
