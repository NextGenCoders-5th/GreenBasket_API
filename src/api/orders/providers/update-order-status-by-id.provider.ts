import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, UserRole } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateApiResponse } from 'src/lib/utils/create-api-response.util';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { FindOneOrderProvider } from './find-one-order.provider';

@Injectable()
export class UpdateOrderStatusByIdProvider {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findOneOrderProvider: FindOneOrderProvider,
  ) {}

  public async updateOrderStatusById(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    role: UserRole,
  ) {
    const { status: newStatus } = updateOrderStatusDto;

    const order = await this.findOneOrderProvider.findOneOrder({ id: orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const allowed = this.checkStatusTransition(order.status, newStatus, role);
    if (!allowed) {
      throw new ForbiddenException('Invalid status transition for your role.');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    return CreateApiResponse({
      status: 'success',
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  }

  private checkStatusTransition(
    current: OrderStatus,
    next: OrderStatus,
    role: UserRole,
  ): boolean {
    const matrix = {
      CUSTOMER: {
        PENDING: [OrderStatus.CANCELLED],
        DELIVERED: [OrderStatus.RETURNED],
      },
      VENDOR: {
        PENDING: [OrderStatus.CONFIRMED],
        CONFIRMED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      },
      ADMIN: {
        '*': [
          OrderStatus.CONFIRMED,
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
          OrderStatus.CANCELLED,
          OrderStatus.RETURNED,
          OrderStatus.REFUNDED,
        ],
      },
    };

    const allowed = matrix[role]?.[current] || matrix[role]?.['*'] || [];

    return allowed.includes(next);
  }
}
