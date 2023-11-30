import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Response, Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() registerAuthDto: RegisterAuthDto, @Res() res: Response) {
    return this.authService.register(registerAuthDto, res);
  }

  @Post('login')
  loginUser(
    @Body() loginAuthDto: LoginAuthDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    let ip: any = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress;

    // Para casos específicos donde el proxy agrega varias direcciones IP en 'x-forwarded-for'
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    return this.authService.login(loginAuthDto, res, ip);
  }
}
