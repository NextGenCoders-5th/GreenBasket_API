import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { ISendSMS } from './interfaces/send-sms.interface';

@Injectable()
export class MessageService {
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get('twilio.account_sid');
    const authtoken = this.configService.get('twilio.authtoken');

    this.twilioClient = new Twilio(accountSid, authtoken);
  }

  public async sendSMS({ message, recieptPhoneNumber }: ISendSMS) {
    console.log('sending sms message to: ', recieptPhoneNumber);

    const response = await this.twilioClient.messages.create({
      body: message,
      from: this.configService.get('twilio.phoneNumber'),
      to: recieptPhoneNumber,
    });

    console.log('message sent successfully to: ', recieptPhoneNumber);
    console.log(response.body);
  }
}
