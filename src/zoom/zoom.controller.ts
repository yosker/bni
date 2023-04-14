import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ZoomService } from './zoom.service';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { UpdateZoomDto } from './dto/update-zoom.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Zoom')
@Controller('zoom')
export class ZoomController {
  constructor(private readonly zoomService: ZoomService) {}

  @Post()
  create(@Body() createZoomDto: CreateZoomDto) {
    return this.zoomService.create(createZoomDto);
  }

  @Get()
  findAll() {
    return this.zoomService.findAll();
  }

  @Get(':token')
  findOne(@Param('token') token: string) {
    return this.zoomService.findOne(token);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZoomDto: UpdateZoomDto) {
    return this.zoomService.update(+id, updateZoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zoomService.remove(+id);
  }
}
