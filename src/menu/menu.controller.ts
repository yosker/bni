import { Controller, UseGuards, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { MenuService } from 'src/menu/menu.service';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('/getMenu/:chapterId/:userId/:role')
  async getMenu(
    @Param('userId') userId: string,
    @Param('role') role: string,
    @Param('chapterId') chapterId: string,
    @Res() res: Response,
  ) {
    return await this.menuService.menu(userId, role, chapterId, res);
  }
}
