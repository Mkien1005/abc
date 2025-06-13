import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MyMailerService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'pharmacypjmn@gmail.com',
          pass: 'hlbwweiwraghhwem',
        },
      },
      defaults: {
        from: '"Tcophar" pharmacypjmn@gmail.com',
      },
    }),
  ],
  providers: [MyMailerService],
  exports: [MyMailerService],
})
export class MailerConfigModule {}
