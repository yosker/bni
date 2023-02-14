import { Controller, UseGuards, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
// @ApiBearerAuth()
// @UseGuards(AuthGuard(), JwtGuard)

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post('create')
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.rolesService.create(createRoleDto, res);
  }

  @Get('rolesList')
  findAll(@Res() res: Response) {
    return this.rolesService.findAll(res);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    return await this.rolesService.findOne(+id, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ): Promise<Response> {
    return this.rolesService.update(+id, updateRoleDto, res);
  }
}
