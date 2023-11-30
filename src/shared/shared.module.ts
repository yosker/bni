import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { SharedService } from './shared.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServicesResponse } from 'src/responses/response';
import { MongooseModule } from '@nestjs/mongoose';
import { Logs, LogsSchema } from 'src/logs/schemas/logs.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logs.name, schema: LogsSchema }]),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com', //process.env.EMAIL_HOST,
        port: 587, //parseInt(process.env.EMAIL_PORT),
        secure: false,
        service: 'Outlook365',
        auth: {
          user: 'net_session_manager@outlook.com', //process.env.EMAIL_USER,
          pass: 'n3tSessi0n2023', //process.env.EMAIL_PASS,
        },
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [],
  providers: [SharedService, ServicesResponse],
})
export class SharedModule {}
