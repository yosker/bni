import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Interviews')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.save(createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Patch('questionsReferences/:id')
  updateQuestionsReferences(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewsService.updateQuestionsReferences(
      id,
      updateInterviewDto,
    );
  }

  @Patch('interviewUser/:id')
  updateInterviewUser(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewsService.updateUserInterview(id, updateInterviewDto);
  }
}
