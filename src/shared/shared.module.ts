import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { SharedService } from './shared.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServicesResponse } from 'src/responses/response';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        console.log(process.env.EMAIL_HOST);
        return {
          transport: {
            host: process.env.EMAIL_HOST,
            // secure: process.env.EMAIL_SECURE,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          },
          template: {
            dir: join(__dirname, 'mails'),
            adapter: new HandlebarsAdapter(),
          },
        };
      },
      imports: undefined,
    }),
  ],
  controllers: [],
  providers: [SharedService, ServicesResponse],
})
export class SharedModule {}
