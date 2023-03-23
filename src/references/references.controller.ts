import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { ReferencesService } from './references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JWTPayload } from 'src/auth/jwt.payload';
import { Response } from 'express';
import { PaginationParams } from 'src/shared/pagination/paginationParams';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('References')
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  create(
    @Body() createReferenceDto: CreateReferenceDto,
    @Res() res: Response,
    @Auth() jwtPayload: JWTPayload,
  ) {
    return this.referencesService.create(createReferenceDto, res, jwtPayload);
  }

  @Get()
  findAll(@Query() { skip, limit }: PaginationParams) {
    return this.referencesService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referencesService.findOne(id);
  }
}
