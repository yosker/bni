import { Injectable } from '@nestjs/common';
import { CreateZoomDto } from './dto/create-zoom.dto';
import { UpdateZoomDto } from './dto/update-zoom.dto';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ZoomService {
  constructor(private httpService: HttpService) {}
  create(createZoomDto: CreateZoomDto) {
    return 'This action adds a new zoom';
  }

  findAll() {
    return `This action returns all zoom`;
  }

  async findOne(token: string) {
    const headers = { Authorization: `Bearer ${token}` };

    return this.httpService
      .get('https://api.zoom.us/v2/meetings/88230093684/registrants', {
        headers,
      })
      .pipe(map((response: AxiosResponse) => response.data));
  }

  update(id: number, updateZoomDto: UpdateZoomDto) {
    return `This action updates a #${id} zoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} zoom`;
  }
}
