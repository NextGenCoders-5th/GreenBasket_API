import { OrderStatus, UserRole } from '@prisma/client';

export function checkStatusTransition(
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
