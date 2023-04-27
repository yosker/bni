import { Injectable } from '@nestjs/common';
import requestIp from 'request-ip';
import axios from 'axios';
import * as moment from 'moment-timezone';

@Injectable()
export class IpService {
  async getLocalTime(ip: string, dateTime: string): Promise<Date> {
    try {
      const response = await axios.get(`http://worldtimeapi.org/api/ip/${ip}`);
      const { timezone } = response.data;
      const mexicoCityTime = moment.tz(dateTime, timezone).toDate();
      return mexicoCityTime;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching local time');
    }
  }

  getClientIp(req): string {
    return requestIp.getClientIp(req);
  }

  async getTimeZone(ip: string): Promise<string> {
    try {
      const response = await axios.get(`http://worldtimeapi.org/api/ip/${ip}`);
      const { timezone } = response.data;
      return timezone;
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching local time');
    }
  }
}
