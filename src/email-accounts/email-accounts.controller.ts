import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  UseGuards,
  Headers,
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
import { Role } from 'src/auth/decorators/Role.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Email Accounts')
@Controller('email-accounts')
export class EmailAccountsController {
  constructor(private readonly emailAccountsService: EmailAccountsService) {}

  @Post()
  @Role('Presidente','Vicepresidente','Tesorería')
  create(
    @Body() createCommentDto: CreateEmailAccountsDTO,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.emailAccountsService.create(createCommentDto, res, jwtPayload);
  }

  @Get()
  @Role('Presidente','Vicepresidente','Tesorería')
  findAll(@Res() res: Response,
         @Headers('page') page: string, 
         @Auth() jwtPayload: JWTPayload) {
    return this.emailAccountsService.findAll(res,page, jwtPayload);
  }
  
  @Get(':id')
  @Role('Presidente','Vicepresidente','Tesorería')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.emailAccountsService.findOne(id, res);
  }

  @Patch('edit/:id')
  @Role('Presidente','Vicepresidente','Tesorería')
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
  @Role('Presidente','Vicepresidente','Tesorería')
  delete(@Param('id') id: string, @Res() res: Response) {
    return this.emailAccountsService.delete(id, res);
  }
}
