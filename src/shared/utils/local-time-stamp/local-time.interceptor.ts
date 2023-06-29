import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import * as moment from 'moment-timezone';
import * as geoip from 'geoip-lite';
import { JWTPayload } from 'src/auth/jwt.payload';

@Injectable()
export class LocalTimeInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    let clientIp: any = req.ip;

    if (clientIp === '::1') clientIp = req.headers['x-forwarded-for'] || req.ip;
    const geo = geoip.lookup(clientIp);

    let localTime;
    if (geo && geo.ll) {
      const zoneName = geo.timezone;
      localTime = moment().tz(zoneName).format('DD-MM-YYYY HH:mm:ss');
    }

    // Modifica la propiedad localTime del objeto global jwtPayload
    const jwtPayload = context.switchToHttp().getRequest().user as JWTPayload;
    jwtPayload.localTime = localTime;

    return next.handle().pipe(
      tap(() => {
        // código adicional que se ejecutará después de que el controlador maneje la solicitud
      }),
    );
  }
}
