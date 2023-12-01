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
      let url = '';

      if (ip && ip.includes('::ffff:')) {
        url = 'https://api.ipify.org/?format=json';
      } else {
        url = `http://worldtimeapi.org/api/ip/${ip}`;
      }

      const response = await axios.get(url);
      const { timezone } = response.data;
      return timezone;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error (puede incluir información sobre la solicitud y la respuesta)
        console.error('Axios error:', error.toJSON());

        if (error.response) {
          // Puedes acceder a información específica de la respuesta
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          throw new Error(
            `Error fetching local time. Status: ${error.response.status}`,
          );
        } else {
          // Si no hay respuesta, lanza una excepción general
          throw new Error('Error fetching local time. No response.');
        }
      } else {
        // Otro tipo de error, lanza una excepción general
        console.error('General error:', error);
        throw new Error('Error fetching local time. General error.');
      }
    }
  }
}
