import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { Request } from 'express';
import { ActiveUser, Auth } from 'src/api/auth/decorators';
import { AuthType } from 'src/api/auth/enums/auth-type.enum';
import { ChapaService } from './chapa.service';
import { InitializeOrderPaymentDto } from './dtos/initialize-order-payment.dto';

@ApiTags('Payments/Chapa')
@Controller('payments')
export class ChapaController {
  constructor(
    private readonly chapaService: ChapaService,
    private readonly configService: ConfigService,
  ) {}

  // initialize payment
  @ApiOperation({
    summary: 'Initialize Order Payment',
  })
  @ApiBody({
    type: InitializeOrderPaymentDto,
    required: true,
  })
  @ApiBearerAuth()
  @Post('initialize')
  initializeOrderPayment(
    @Body() initializeOrderPaymentDto: InitializeOrderPaymentDto,
    @ActiveUser('sub') userId: string,
  ) {
    initializeOrderPaymentDto.userId = userId;
    return this.chapaService.initializeOrderPayment(initializeOrderPaymentDto);
  }
  // web hook URL for verifying
  @ApiOperation({
    summary: 'Chapa Webhook url',
    description:
      'Chapa webhook url, this route is called by chapa when their is an event. it helps us to verify the payment.',
  })
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  @Post('chapa/webhook/verify')
  public verifyOrderPayment(@Req() req: Request) {
    const hash = crypto
      .createHmac(
        'sha256',
        this.configService.get('paymentConfig.chapaWebhookSecret'),
      )
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash == req.headers['x-chapa-signature']) {
      // Retrieve the request's body
      const event = req.body;
      // Do something with event
      return this.chapaService.verifyOrderPayment(event.tx_ref);
    } else {
      console.log('Unable to verify payment with webhook callback');
      throw new InternalServerErrorException(
        'Unable to verify payment with webhook callback',
      );
    }
  }

  @ApiOperation({
    summary: 'Find All Supported Banks.',
    description: 'Find All Supported Banks and bank codes.',
  })
  @ApiBearerAuth()
  @Get('chapa/supported-banks')
  findSupportedBankInfos() {
    return this.chapaService.findSupportedBankInfos();
  }
}
