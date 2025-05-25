import {
  PrismaClient,
  UserRole,
  UserStatus,
  AuthProvider,
  VendorStatus,
  CategoryStatus,
  ProductStatus,
  CartStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  TransactionType,
  TransactionStatus,
  WithdrawalStatus,
  WithdrawalPaymentMethod,
  Gender,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const NUM_USERS = 30;
const NUM_VENDORS = 5;
const NUM_CATEGORIES = 10;
const NUM_PRODUCTS_PER_VENDOR = 15;
const NUM_ADDRESSES_PER_USER = 1;
const NUM_CARTS_PER_USER = 1;
const NUM_ORDERS_FROM_CARTS = 15;
const NUM_REVIEWS = 50;
const NUM_WITHDRAWAL_REQUESTS_PER_VENDOR = 3;
const NUM_VENDOR_TRANSACTIONS = 20;

async function main() {
  console.log('Start seeding ...');

  // --- Clear existing data (Optional) ---
  // await prisma.review.deleteMany();
  // await prisma.payment.deleteMany();
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.cartItem.deleteMany();
  // await prisma.cart.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.vendorBankAccount.deleteMany();
  // await prisma.withdrawalRequest.deleteMany();
  // await prisma.vendorTransaction.deleteMany();
  // await prisma.vendorBalance.deleteMany();
  // await prisma.vendor.deleteMany();
  // await prisma.user.deleteMany();
  console.log('Cleaned up existing data.');

  // --- Seed Users ---
  const users = [];
  const salt = await bcrypt.genSalt();
  for (let i = 0; i < NUM_USERS; i++) {
    const isVendor = i < NUM_VENDORS;
    const password = await bcrypt.hash('password123', salt);
    // Corrected faker.phone.number usage
    const phoneNumber = `+2519${faker.string.numeric(8)}`; // Generate 8 digits and prepend prefix

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        phone_number: phoneNumber,
        password: password,
        role: isVendor ? UserRole.VENDOR : UserRole.CUSTOMER,
        first_name: isVendor
          ? faker.person.firstName('male')
          : faker.person.firstName(),
        last_name: isVendor
          ? faker.person.lastName('male')
          : faker.person.lastName(),
        date_of_birth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        gender: faker.helpers.arrayElement([Gender.male, Gender.female]),
        profile_picture: faker.image.avatar(),
        is_onboarding: !isVendor,
        need_reset_password: false,
        verify_status: faker.helpers.arrayElement([
          'UNVERIFIED',
          'VERIFIED',
          'REQUESTED',
          'DECLINED',
        ]), // Include all verify statuses
      },
    });
    users.push(user);
    console.log(`Created user with id: ${user.id}`);
  }
  const customerUsers = users.filter((user) => user.role === UserRole.CUSTOMER);
  const vendorUsers = users.filter((user) => user.role === UserRole.VENDOR);

  // --- Seed Vendors ---
  const vendors = [];
  for (let i = 0; i < NUM_VENDORS; i++) {
    const vendorUser = vendorUsers[i];
    // Corrected faker.phone.number usage
    const vendorPhoneNumber = `+2519${faker.string.numeric(8)}`;

    const vendor = await prisma.vendor.create({
      data: {
        business_name: faker.company.name(),
        business_email: faker.internet.email().toLowerCase(),
        phone_number: vendorPhoneNumber,
        logo_url: faker.image.urlLoremFlickr({
          category: 'business',
          width: 320,
          height: 240,
        }),
        status: faker.helpers.arrayElement([
          VendorStatus.APPROVED,
          VendorStatus.PENDING,
          VendorStatus.SUSPENDED,
        ]), // Include all vendor statuses
        have_bank_details: i % 2 === 0,
        userId: vendorUser.id,
        VendorBalance: {
          create: {
            // Corrected faker.number.float usage with fractionDigits
            total_earnings: faker.number.float({
              min: 1000,
              max: 100000,
              fractionDigits: 2,
            }),
            available_balance: faker.number.float({
              min: 500,
              max: 50000,
              fractionDigits: 2,
            }),
            withdrawn_amount: faker.number.float({
              min: 0,
              max: 10000,
              fractionDigits: 2,
            }),
            pending_withdrawals: faker.number.float({
              min: 0,
              max: 5000,
              fractionDigits: 2,
            }),
          },
        },
        ...(i % 2 === 0 && {
          VendorBankAccount: {
            create: {
              account_name: vendorUser.first_name + ' ' + vendorUser.last_name,
              account_number: faker.finance.accountNumber(10),
              bank_name: faker.helpers.arrayElement([
                'CBE',
                'Awash Bank',
                'Abyssinia Bank',
                'Dashen Bank',
              ]),
              currency: 'ETB',
            },
          },
        }),
      },
    });
    vendors.push(vendor);
    console.log(`Created vendor with id: ${vendor.id}`);
  }

  // --- Seed Categories ---
  const categories = [];
  for (let i = 0; i < NUM_CATEGORIES; i++) {
    const name = faker.commerce.department();
    const category = await prisma.category.create({
      data: {
        name: name,
        slug:
          faker.helpers.slugify(name).toLowerCase() +
          '-' +
          faker.string.alphanumeric(4),
        image_url: faker.image.url({
          width: 320,
          height: 240,
        }), // Updated image url method
        status: faker.helpers.arrayElement([
          CategoryStatus.ACTIVE,
          CategoryStatus.INACTIVE,
        ]),
      },
    });
    categories.push(category);
    console.log(`Created category with id: ${category.id}`);
  }

  // --- Seed Products ---
  const products = [];
  for (const vendor of vendors) {
    for (let i = 0; i < NUM_PRODUCTS_PER_VENDOR; i++) {
      const productName = faker.commerce.productName();
      // Corrected faker.number.float usage with fractionDigits
      const price = faker.number.float({
        min: 10,
        max: 1000,
        fractionDigits: 2,
      });
      const discountPriceValue =
        price > 50
          ? faker.number.float({ min: 1, max: price * 0.5, fractionDigits: 2 })
          : 0; // Corrected usage
      const product = await prisma.product.create({
        data: {
          name: productName,
          description: faker.commerce.productDescription(),
          price: price,
          discount_price: discountPriceValue > 0 ? discountPriceValue : null,
          unit: faker.helpers.arrayElement(['kg', 'liter', 'pcs', 'gram']),
          stock: faker.number.int({ min: 0, max: 1000 }),
          image_url: faker.image.url({
            width: 640,
            height: 480,
          }), // Updated image url method
          status: faker.helpers.arrayElement([
            ProductStatus.ACTIVE,
            ProductStatus.INACTIVE,
            ProductStatus.OUT_OF_STOCK,
          ]),
          is_featured: i % 5 === 0,
          vendorId: vendor.id,
          categories: {
            connect: faker.helpers
              .arrayElements(categories, { min: 1, max: 3 })
              .map((cat) => ({ id: cat.id })),
          },
        },
      });
      products.push(product);
      console.log(`Created product with id: ${product.id}`);
    }
  }

  // --- Seed Addresses (for Users) ---
  const userAddresses = [];
  for (const user of customerUsers) {
    const address = await prisma.address.create({
      data: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        sub_city: faker.location.county() + ' Subcity', // Use county as alternative
        zip_code: faker.location.zipCode(),
        country: 'Ethiopia',
        latitude: parseFloat(faker.location.latitude().toFixed(6)),
        longitude: parseFloat(faker.location.longitude().toFixed(6)),
        is_default: true,
        userId: user.id,
      },
    });
    userAddresses.push(address);
    console.log(`Created address with id: ${address.id} for user ${user.id}`);
  }

  // --- Seed Addresses (for Vendors) ---
  const vendorAddresses = [];
  for (const vendor of vendors) {
    const numVendorAddresses = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numVendorAddresses; i++) {
      const address = await prisma.address.create({
        data: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          sub_city: faker.location.county() + ' Subcity', // Use county as alternative
          zip_code: faker.location.zipCode(),
          country: 'Ethiopia',
          latitude: parseFloat(faker.location.latitude().toFixed(6)),
          longitude: parseFloat(faker.location.longitude().toFixed(6)),
          is_default: i === 0,
          vendorId: vendor.id,
        },
      });
      vendorAddresses.push(address);
      console.log(
        `Created address with id: ${address.id} for vendor ${vendor.id}`,
      );
    }
  }

  // --- Seed Carts ---
  const carts = [];
  for (const user of customerUsers) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        status: CartStatus.ACTIVE,
        total_price: 0,
      },
    });
    carts.push(cart);
    console.log(`Created cart with id: ${cart.id} for user ${user.id}`);

    const numItemsInCart = faker.number.int({ min: 1, max: 5 });
    let cartTotal = 0;
    const productsToAdd = faker.helpers.arrayElements(
      products.filter((p) => p.stock > 0),
      numItemsInCart,
    ); // Only add products with stock

    for (const product of productsToAdd) {
      const quantity = faker.number.int({
        min: 1,
        max: product.stock > 5 ? 5 : product.stock || 1,
      }); // Limit quantity
      const price =
        product.discount_price !== null
          ? product.discount_price
          : product.price;
      const subTotal = parseFloat(
        (parseFloat(price.toString()) * quantity).toFixed(2),
      );

      try {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: quantity,
            price: parseFloat(price.toString()),
            sub_total: subTotal,
          },
        });
        cartTotal += subTotal;
      } catch (e) {
        // Catch potential unique constraint errors if somehow the same product is added multiple times in this loop (shouldn't happen with arrayElements)
        console.error(
          `Failed to add item ${product.id} to cart ${cart.id}:`,
          e,
        );
      }
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: { total_price: parseFloat(cartTotal.toFixed(2)) },
    });
    console.log(
      `Added ${numItemsInCart} items to cart ${cart.id}, total: ${cartTotal.toFixed(2)}`,
    );
  }

  // --- Seed Orders (by checking out some carts) ---
  const orders = [];
  const cartsToCheckout = faker.helpers.arrayElements(
    carts.filter(
      (c) => c.CartItems?.length > 0 && c.status === CartStatus.ACTIVE,
    ),
    NUM_ORDERS_FROM_CARTS >
      carts.filter(
        (c) => c.CartItems?.length > 0 && c.status === CartStatus.ACTIVE,
      ).length
      ? carts.filter(
          (c) => c.CartItems?.length > 0 && c.status === CartStatus.ACTIVE,
        ).length
      : NUM_ORDERS_FROM_CARTS,
  ); // Select carts that have items and are active

  for (const cart of cartsToCheckout) {
    const user = customerUsers.find((u) => u.id === cart.userId);
    if (!user) continue;

    const userAddress = userAddresses.find((a) => a.userId === user.id);
    if (!userAddress) {
      console.warn(
        `User ${user.id} has a cart but no address, skipping order creation.`,
      );
      continue;
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { Product: true },
    });

    if (cartItems.length === 0) continue;

    const ordersToCreatePerVendor: {
      [vendorId: string]: { items: typeof cartItems; total: number };
    } = {};
    for (const item of cartItems) {
      const vendorId = item.Product!.vendorId;
      if (!ordersToCreatePerVendor[vendorId]) {
        ordersToCreatePerVendor[vendorId] = { items: [], total: 0 };
      }
      ordersToCreatePerVendor[vendorId].items.push(item);
      ordersToCreatePerVendor[vendorId].total += parseFloat(
        item.sub_total.toString(),
      );
    }

    for (const vendorId in ordersToCreatePerVendor) {
      const vendor = vendors.find((v) => v.id === vendorId);
      if (!vendor) continue;

      const orderItemsData = ordersToCreatePerVendor[vendorId].items;
      const orderTotal = parseFloat(
        ordersToCreatePerVendor[vendorId].total.toFixed(2),
      );
      // Corrected OrderStatus enum values
      const orderStatus = faker.helpers.arrayElement([
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
        OrderStatus.RETURNED,
        OrderStatus.REFUNDED, // Include REFUNDED
      ]);

      const order = await prisma.order.create({
        data: {
          cartId: cart.id,
          userId: user.id,
          vendorId: vendor.id,
          addressId: userAddress.id,
          total_price: orderTotal,
          status: orderStatus,
          shippedAt:
            orderStatus === OrderStatus.SHIPPED ||
            orderStatus === OrderStatus.DELIVERED ||
            orderStatus === OrderStatus.RETURNED
              ? faker.date.past({ years: 0.5 })
              : null,
          deliveredAt:
            orderStatus === OrderStatus.DELIVERED ||
            orderStatus === OrderStatus.RETURNED
              ? faker.date.past({ years: 0.2 })
              : null,
          receivedAt:
            orderStatus === OrderStatus.DELIVERED ||
            orderStatus === OrderStatus.RETURNED
              ? faker.date.past({ years: 0.1 })
              : null,
          OrderItems: {
            create: orderItemsData.map((item) => ({
              productId: item.productId,
              quantity: parseFloat(item.quantity.toString()), // Ensure Decimal type for quantity if schema is Decimal
              price: item.price,
              sub_total: item.sub_total,
              reviewed: false,
            })),
          },
        },
        include: { OrderItems: true },
      });
      orders.push(order);
      console.log(
        `Created order with id: ${order.id} for user ${user.id} and vendor ${vendor.id}`,
      );

      // Mark the cart as CHECKED_OUT
      await prisma.cart.update({
        where: { id: cart.id },
        data: { status: CartStatus.CHECKED_OUT },
      });
    }
  }

  // --- Seed Payments (for some PAID orders) ---
  // An order should be PAID if its status is not PENDING, CANCELLED, RETURNED, or REFUNDED
  const paidOrders = orders.filter(
    (order) =>
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CANCELLED &&
      order.status !== OrderStatus.RETURNED &&
      order.status !== OrderStatus.REFUNDED,
  );

  for (const order of paidOrders) {
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    });
    if (existingPayment) continue;

    const paymentMethod = faker.helpers.arrayElement([
      PaymentMethod.CHAPA,
      PaymentMethod.BANK_TRANSFER,
      PaymentMethod.STRIPE,
    ]); // Include all PaymentMethods
    // Payment status should align with order status. If order is DELIVERED/SHIPPED etc., payment should be PAID.
    const paymentStatus = PaymentStatus.PAID; // Assuming these paid orders have PAID payment

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total_price,
        status: paymentStatus,
        paymentMethod: paymentMethod,
        reference: faker.string.uuid(),
        paidAt: faker.date.past({ years: 0.1 }), // Paid in the past
      },
    });
    console.log(`Created payment for order ${order.id}`);
  }

  // --- Seed Reviews (for some DELIVERED orders/items) ---
  const deliveredOrders = orders.filter(
    (order) => order.status === OrderStatus.DELIVERED,
  );
  const reviewableItems = [];
  for (const order of deliveredOrders) {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });
    reviewableItems.push(...orderItems);
  }

  const itemsToReview = faker.helpers.arrayElements(
    reviewableItems.filter((item) => !item.reviewed),
    NUM_REVIEWS > reviewableItems.filter((item) => !item.reviewed).length
      ? reviewableItems.filter((item) => !item.reviewed).length
      : NUM_REVIEWS,
  );

  for (const item of itemsToReview) {
    const existingReview = await prisma.review.findUnique({
      where: { orderItemId: item.id },
    });
    if (existingReview) continue;

    const order = orders.find((o) => o.id === item.orderId);
    if (!order) continue;

    await prisma.review.create({
      data: {
        orderItemId: item.id,
        userId: order.userId,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    });
    console.log(
      `Created review for order item ${item.id} by user ${order.userId}`,
    );

    await prisma.orderItem.update({
      where: { id: item.id },
      data: { reviewed: true },
    });
  }

  // --- Seed Vendor Transactions and Withdrawal Requests ---
  const vendorBalances = await prisma.vendorBalance.findMany();
  for (const balance of vendorBalances) {
    // Seed some withdrawal requests
    for (let i = 0; i < NUM_WITHDRAWAL_REQUESTS_PER_VENDOR; i++) {
      const requestedAmount = faker.number.float({
        min: 100,
        max:
          parseFloat(balance.available_balance.toString()) > 100
            ? parseFloat(balance.available_balance.toString()) * 0.5
            : 100,
        fractionDigits: 2,
      }); // Request up to 50% or min 100
      if (requestedAmount > parseFloat(balance.available_balance.toString()))
        continue; // Don't request more than available

      await prisma.withdrawalRequest.create({
        data: {
          vendor_balance_id: balance.id,
          amount: requestedAmount,
          status: faker.helpers.arrayElement([
            WithdrawalStatus.PENDING,
            WithdrawalStatus.APPROVED,
            WithdrawalStatus.COMPLETED,
            WithdrawalStatus.REJECTED,
            WithdrawalStatus.FAILED,
            WithdrawalStatus.PROCESSING,
            WithdrawalStatus.CANCELLED,
          ]), // Include all statuses
          payment_method: faker.helpers.arrayElement([
            WithdrawalPaymentMethod.CHAPA,
            WithdrawalPaymentMethod.BANK_TRANSFER,
            WithdrawalPaymentMethod.MOBILE_MONEY,
          ]), // Include relevant payment methods
          notes: faker.lorem.sentence(),
          processed_at: faker.helpers.arrayElement([
            null,
            faker.date.past({ years: 0.1 }),
          ]),
          transaction_reference: faker.helpers.arrayElement([
            null,
            faker.string.uuid(),
          ]),
        },
      });
    }

    // Seed some vendor transactions
    for (let i = 0; i < NUM_VENDOR_TRANSACTIONS / vendors.length; i++) {
      const type = faker.helpers.arrayElement([
        TransactionType.ORDER_PAYMENT,
        TransactionType.WITHDRAWAL,
      ]);
      const status = faker.helpers.arrayElement([
        TransactionStatus.PENDING,
        TransactionStatus.COMPLETED,
        TransactionStatus.FAILED,
      ]);
      const amountValue =
        type === TransactionType.ORDER_PAYMENT
          ? faker.number.float({ min: 50, max: 1000, fractionDigits: 2 })
          : faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) * -1; // Generate positive amount, then negate for withdrawal

      await prisma.vendorTransaction.create({
        data: {
          vendor_balance_id: balance.id,
          amount: amountValue,
          type: type,
          status: status,
          description: faker.lorem.sentence(),
          reference_id: faker.string.uuid(), // Use uuid as a generic placeholder
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
