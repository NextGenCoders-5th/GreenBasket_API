import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { ChapaService } from 'chapa-nestjs';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { InitializeOrderPaymentDto } from '../dtos/initialize-order-payment.dto';

@Injectable()
export class InitializeOrderPaymentProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chapaService: ChapaService,
    private readonly configService: ConfigService,
  ) {}

  public async initializeOrderPayment(
    initializeOrderPaymentDto: InitializeOrderPaymentDto,
  ) {
    const { orderId, userId } = initializeOrderPaymentDto;
    let order: Prisma.OrderGetPayload<{ include: { User: true } }>;

    try {
      order = await this.prisma.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
        include: {
          User: true,
        },
      });
    } catch (err) {
      console.log('initializeOrderPayment: ', err);
      throw new InternalServerErrorException(
        'Unablet to fetch the order.  please try again later.',
      );
    }

    if (!order) {
      throw new NotFoundException(
        'The order you are trying to pay for does not exist.',
      );
    }

    // We create a text reference for the Chapa Service
    let txRef: string | undefined;
    try {
      txRef = await this.chapaService.generateTransactionReference();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Error occured when generating a transaction reference',
      );
    }

    try {
      // First we create payment with status of PENDING
      await this.prisma.payment.create({
        data: {
          orderId,
          amount: order.total_price,
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.CHAPA,
          reference: txRef,
        },
      });
    } catch (err) {
      console.log('initializeOrderPayment: ', err);
      throw new InternalServerErrorException(
        'Unable to create payment. Please try again later.',
      );
    }
    // Then we initialize the payment with ChapaService
    const { first_name, last_name, email } = order.User;
    try {
      const response = await this.chapaService.initialize({
        first_name,
        last_name,
        email,
        currency: 'ETB',
        amount: order.total_price.toString(),
        tx_ref: txRef,
        callback_url: this.configService.get('paymentConfig.chapaWebhookUrl'),
      });

      // return response
      return response;
    } catch (err) {
      console.log('initializeOrderPayment: ', err);
      throw new InternalServerErrorException(
        'Unable to initialize payment. Please try again later.',
      );
    }
  }
}
