import { Controller } from '@nestjs/common';
import { OrderItemsService } from './order_items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}
}
