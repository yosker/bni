import { Controller, Get, Post, Body, Patch, Param, Res } from '@nestjs/common';
import { NonAttendanceService } from './non-attendance.service';
import { CreateNonAttendanceDto } from './dto/create-non-attendance.dto';
import { UpdateNonAttendanceDto } from './dto/update-non-attendance.dto';
import { Response } from 'express';

interface FindRegisters {
  dateFrom: string;
  dateTo: string;
}

@Controller('non-attendance')
export class NonAttendanceController {
  constructor(private readonly nonAttendanceService: NonAttendanceService) {}

  @Post()
  create(
    @Body() createNonAttendanceDto: CreateNonAttendanceDto,
    @Res() res: Response,
  ) {
    return this.nonAttendanceService.create(createNonAttendanceDto, res);
  }

  @Get()
  findAll(@Body() find: FindRegisters) {
    return this.nonAttendanceService.findAll(find.dateFrom, find.dateTo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nonAttendanceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNonAttendanceDto: UpdateNonAttendanceDto,
  ) {
    return this.nonAttendanceService.update(id, updateNonAttendanceDto);
  }
}
