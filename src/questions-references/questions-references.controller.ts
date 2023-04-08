import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsReferencesService } from './questions-references.service';
import { CreateQuestionsReferenceDto } from './dto/create-questions-reference.dto';
import { UpdateQuestionsReferenceDto } from './dto/update-questions-reference.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { Response } from 'express';
import { PaginationParams } from 'src/shared/pagination/paginationParams';

@ApiBearerAuth()
@UseGuards(AuthGuard(), JwtGuard)
@ApiTags('Questions References')
@Controller('questions-references')
export class QuestionsReferencesController {
  constructor(
    private readonly questionsReferencesService: QuestionsReferencesService,
  ) {}

  @Post()
  create(
    @Body() createQuestionsReferenceDto: CreateQuestionsReferenceDto,
    @Res() res: Response,
  ) {
    return this.questionsReferencesService.create(
      createQuestionsReferenceDto,
      res,
    );
  }

  @Get()
  findAll(
    @Res() res: Response,
    @Query() { skip = 0, limit = 200 }: PaginationParams,
  ) {
    return this.questionsReferencesService.findAll(res, skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.questionsReferencesService.findOne(id, res);
  }

  @Patch()
  update(
    @Body() updateQuestionsReferenceDto: UpdateQuestionsReferenceDto,
    @Res() res: Response,
  ) {
    return this.questionsReferencesService.update(
      updateQuestionsReferenceDto,
      res,
    );
  }
}
