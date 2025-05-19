import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChapaService } from './chapa.service';
import { InitializeOrderPaymentDto } from './dtos/initialize-order-payment.dto';
import { ActiveUser, Auth } from 'src/api/auth/decorators';
import { AuthType } from 'src/api/auth/enums/auth-type.enum';
import { VerifyOrderPaymentDto } from './dtos/verify-order-payment.dto';

@ApiTags('Payments/Chapa')
@Controller('payments/chapa')
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
  @ApiBody({
    type: VerifyOrderPaymentDto,
    required: true,
  })
  @Auth(AuthType.NONE)
  @Get('chapa/webhook/verify')
  public verifyOrderPayment(
    @Body() verifyOrderPaymentDto: VerifyOrderPaymentDto,
    @Headers('x-chapa-signature') chapaSignature: string,
  ) {
    const hash = crypto
      .createHmac(
        'sha256',
        this.configService.get('appConfig.chapaWebhookSecret'),
      )
      .update(JSON.stringify(verifyOrderPaymentDto))
      .digest('hex');

    if (hash !== chapaSignature) {
      console.error(`Invalid chapa signature: ${hash}`);
      throw new BadRequestException('Invalid Chapa Signature');
    }

    return this.chapaService.verifyOrderPayment(verifyOrderPaymentDto);
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
