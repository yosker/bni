import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { SharedService } from './shared.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServicesResponse } from 'src/responses/response';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'chi56.grupocopydata.com',
                auth: {
                    user: 'soporte@prasyde.com',
                    pass: 'QTOrBXigf94lwJy'
                }
            },
            template: {
                dir: join(__dirname, 'mails'),
                adapter: new HandlebarsAdapter()
            }
        })
    ],
    controllers: [],
    providers: [SharedService, ServicesResponse],
})
export class SharedModule { }