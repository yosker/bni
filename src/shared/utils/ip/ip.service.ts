import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment-timezone';

@Injectable()
export class IpService {
  async getLocalTime(ip: string, dateTime: string): Promise<string> {
    try {
      const response = await axios.get(`http://worldtimeapi.org/api/ip/${ip}`);
      const { timezone } = response.data;
      return moment.tz(dateTime, timezone).toISOString();
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching local time');
    }
  }

  async getTimeZone(ip: string): Promise<string> {
    try {
      const response = await axios.get(`http://worldtimeapi.org/api/ip/${ip}`);
      const { timezone } = response.data;
      return timezone;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error (puede incluir información sobre la solicitud y la respuesta)
        console.error('Axios error:', error.toJSON());

        if (error.response) {
          throw new Error(error.response.toString());
        }
      } else {
        throw new Error(error.response.toString());
      }
      throw new Error('Error fetching local time');
    }
  }
}
