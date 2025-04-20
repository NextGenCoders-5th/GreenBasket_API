import { Injectable } from '@nestjs/common';
import { CheckOutDto } from './dtos/checkout.dto';
import { CheckOutProvider } from './providers/check-out.provider';

@Injectable()
export class OrdersService {
  constructor(private readonly checkOutProvider: CheckOutProvider) {}

  checkOut(checOutDto: CheckOutDto) {
    return this.checkOutProvider.checkOut(checOutDto);
  }
}
