import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, Payment, PaymentStatus } from '@prisma/client';
import { ChapaService, VerifyResponse } from 'chapa-nestjs';
import { VendorBalanceService } from 'src/api/vendors/vendor_balance/vendor_balance.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class VerifyOrderPaymentProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chapaService: ChapaService,
    private readonly vendorBalanceService: VendorBalanceService,
  ) {}

  public async verifyOrderPayment(tx_ref: string) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${process.env.CHAPA_SECRET_KEY}`);
    const requestOptions: any = {
      method: 'GET',
      headers: myHeaders,
    };

    const res = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      requestOptions,
    );

    if (!res.ok) {
      console.log('network error');
    }
    const body = (await res.json()) as VerifyResponse;

    if (body.status !== 'success') {
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
      console.log('Payment not found...');
      throw new BadRequestException('Payment not found');
    }
    console.log({ payment });

    // if payment found update the status to paid
    try {
      const order = await this.prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        });
        return await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: OrderStatus.CONFIRMED,
          },
        });
      });
      await this.vendorBalanceService.updateBalanceAfterOrder(
        order.vendorId,
        order.total_price.toNumber(),
      );
    } catch (err) {
      console.log('verifyPayment error', err);
      throw new BadRequestException(
        'Unable to update payment status. please try again later.',
      );
    }

    return true;
  }
}
