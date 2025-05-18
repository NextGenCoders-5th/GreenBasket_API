import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ISendEmailOptions } from './interfaces/send-email.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public async sendEmail(options: ISendEmailOptions) {
    // create transporter

    // const transporter = nodemailer.createTransport({
    //   host: this.configService.get('email.host'),
    //   port: this.configService.get('email.port'), // Port must be a number
    //   auth: {
    //     user: this.configService.get('email.username'),
    //     pass: this.configService.get('email.password'),
    //   },
    //   debug: true,
    //   logger: true,
    // });
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: this.configService.get('email.sendgrid_username'),
        pass: this.configService.get('email.sendgrid_password'),
      },
    });

    // send the email
    await transporter.sendMail({
      from: {
        name: this.configService.get('appConfig.appName'),
        address: this.configService.get('email.from'),
      },
      to: options.recipient_email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });
  }
}
