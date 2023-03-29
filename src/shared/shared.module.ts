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
      
        return {
          transport: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secureConnection: false,
            service: "Outlook365",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
            //from: process.env.EMAIL_USER
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
