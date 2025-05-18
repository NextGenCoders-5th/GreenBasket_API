import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { EmailService } from 'src/common/email/email.service';
import { MessageService } from 'src/common/message/message.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetResetPassEmailHtmlTemplate } from 'src/lib/helpers/get-reset-password-email-template.helper';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { ForgotPasswordDto } from '../../dtos/forgot-password.dto';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly messageService: MessageService,
  ) {}

  public async forgotMyPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email, phoneNumber } = forgotPasswordDto;
    const isEmail = Boolean(email);

    let user: User;
    try {
      user = await this.prisma.user.findFirst({
        where: isEmail ? { email } : { phone_number: phoneNumber },
      });
    } catch (err) {
      console.log('forgot-password: error: ', err);
      throw new InternalServerErrorException(
        'Unable to find a user please try again later.',
      );
    }

    if (!user) throw new NotFoundException('User not found.');

    const resetToken = isEmail
      ? crypto.randomBytes(32).toString('hex')
      : String(Math.random()).slice(-6);
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    const appName = this.configService.get('appConfig.appName');
    const resetUrl = `${this.configService.get('appConfig.resetPasswordFrontendUrl')}/${resetToken}`;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: {
            reset_password_token: resetTokenHash,
            reset_password_token_expires_at: resetTokenExpires,
          },
        });
      });

      if (isEmail) {
        const message = `
          Dear ${user.first_name} ${user.last_name},
          We received a request to reset your password for your account at ${appName}.
          To reset your password, please use the link below. This link will expire in 10 minutes for your security: ${resetUrl}
          If you did not request a password reset, please disregard this email. Your account is safe, and no action is needed.
          For any questions or assistance, feel free to reach out to our support team. We're here to help!
          Hotelify Team`;
        const html = GetResetPassEmailHtmlTemplate({
          appName,
          resetUrl,
          user,
        });

        await this.emailService.sendEmail({
          html,
          message,
          recipient_email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
        });
      } else if (phoneNumber) {
        await this.messageService.sendSMS({
          message: `${appName} Token to reset your password ${resetToken}`,
          recieptPhoneNumber: phoneNumber,
        });
      }
    } catch (err) {
      console.log('forgot-password error: ', err);
      throw new InternalServerErrorException(
        'Error happened when sending reset token. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: `Password reset url is sent to your ${isEmail ? 'email' : 'phone number'} successfully. please check you email.`,
      data: null,
    });
  }
}
