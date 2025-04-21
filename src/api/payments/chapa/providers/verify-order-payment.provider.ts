import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, Payment, PaymentStatus } from '@prisma/client';
import { ChapaService } from 'chapa-nestjs';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { VerifyOrderPaymentDto } from '../dtos/verify-order-payment.dto';

@Injectable()
export class VerifyOrderPaymentProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chapaService: ChapaService,
  ) {}

  public async verifyOrderPayment(
    verifyOrderPaymentDto: VerifyOrderPaymentDto,
  ) {
    const { tx_ref } = verifyOrderPaymentDto;

    const response = await this.chapaService.verify({ tx_ref });

    if (response.status !== 'success') {
      throw new BadRequestException(
        'Invalid transaction or Transaction not found	',
      );
    }

    let payment: Payment;
    try {
      payment = await this.prisma.payment.findFirst({
        where: {
          reference: tx_ref,
          status: PaymentStatus.PENDING,
        },
      });
    } catch (err) {
      console.log('verifyPayment error', err);
      throw new BadRequestException(
        'Unable to find payment. please try again later.',
      );
    }

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    // if payment found update the status to paid
    try {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        }),
        this.prisma.order.update({
          where: { id: payment.orderId },
          data: {
            status: OrderStatus.CONFIRMED,
          },
        }),
      ]);
    } catch (err) {
      console.log('verifyPayment error', err);
      throw new BadRequestException(
        'Unable to update payment status. please try again later.',
      );
    }

    return CreateApiResponse({
      status: 'success',
      message: 'Payment verified successfully',
      data: null,
    });
  }
}
