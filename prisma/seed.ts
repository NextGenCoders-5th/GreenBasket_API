import {
  PrismaClient,
  UserRole,
  // UserStatus,
  // AuthProvider,
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
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const NUM_USERS = 30;
const NUM_VENDORS = 5;
// const NUM_CATEGORIES = 2; // Fruits, Vegetables
const NUM_PRODUCTS_PER_VENDOR = 10;
// const NUM_ADDRESSES_PER_USER = 1;
// const NUM_CARTS_PER_USER = 1;
const NUM_ORDERS_FROM_CARTS = 15;
const NUM_REVIEWS = 30;
const NUM_WITHDRAWAL_REQUESTS_PER_VENDOR = 2;
const NUM_VENDOR_TRANSACTIONS = 10;

// --- Real Fruits and Vegetables Data ---
const FRUITS = [
  {
    name: 'Apple',
    image_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    description: 'Fresh and juicy apples, perfect for snacking.',
    unit: 'kg',
  },
  {
    name: 'Banana',
    image_url:
      'https://images.unsplash.com/photo-1543218024-57a70143c369?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sweet bananas, rich in potassium.',
    unit: 'kg',
  },
  {
    name: 'Orange',
    image_url:
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9yYW5nZXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Citrus oranges, full of vitamin C.',
    unit: 'kg',
  },
  {
    name: 'Mango',
    image_url:
      'https://images.unsplash.com/photo-1713273576831-a81cb528853a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbmdvfGVufDB8fDB8fHww',
    description: 'Tropical mangoes, sweet and delicious.',
    unit: 'kg',
  },
  {
    name: 'Strawberry',
    image_url:
      'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U3RyYXdiZXJyeXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Fresh strawberries, perfect for desserts.',
    unit: 'kg',
  },
  {
    name: 'Pineapple',
    image_url:
      'https://images.unsplash.com/photo-1572859704906-ab0716da285f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFBpbmVhcHBsZXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Tropical pineapples, sweet and tangy.',
    unit: 'kg',
  },
  {
    name: 'Watermelon',
    image_url:
      'https://plus.unsplash.com/premium_photo-1674382739371-57254fd9a9e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFdhdGVybWVsb258ZW58MHx8MHx8fDA%3D',
    description: 'Juicy watermelons, great for summer.',
    unit: 'kg',
  },
  {
    name: 'Avocado',
    image_url:
      'https://images.unsplash.com/photo-1573566291259-fd494a326b60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEF2b2NhZG98ZW58MHx8MHx8fDA%3D',
    description: 'Creamy avocados, perfect for toast and salads.',
    unit: 'kg',
  },
  {
    name: 'Papaya',
    image_url:
      'https://plus.unsplash.com/premium_photo-1664391808687-55acdf5c7317?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UGFwYXlhfGVufDB8fDB8fHww',
    description: 'Sweet papayas, rich in vitamins.',
    unit: 'kg',
  },
  {
    name: 'Grape',
    image_url:
      'https://images.unsplash.com/photo-1631299106224-aae61c217164?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEdyYXBlfGVufDB8fDB8fHww',
    description: 'Fresh grapes, perfect for snacking.',
    unit: 'kg',
  },
];

const VEGETABLES = [
  {
    name: 'Tomato',
    image_url:
      'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VG9tYXRvfGVufDB8fDB8fHww',
    description: 'Ripe tomatoes, great for salads and cooking.',
    unit: 'kg',
  },
  {
    name: 'Potato',
    image_url:
      'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UG90YXRvfGVufDB8fDB8fHww',
    description: 'Organic potatoes, versatile for many dishes.',
    unit: 'kg',
  },
  {
    name: 'Carrot',
    image_url:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2Fycm90fGVufDB8fDB8fHww',
    description: 'Crunchy carrots, rich in beta-carotene.',
    unit: 'kg',
  },
  {
    name: 'Cabbage',
    image_url:
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2FiYmFnZXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Fresh cabbage, perfect for salads and stir-fries.',
    unit: 'kg',
  },
  {
    name: 'Onion',
    image_url:
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8T25pb258ZW58MHx8MHx8fDA%3D',
    description: 'Flavorful onions, essential for cooking.',
    unit: 'kg',
  },
  {
    name: 'Lettuce',
    image_url:
      'https://images.unsplash.com/photo-1693667660375-653320dbebb4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TGV0dHVjZXxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Crisp lettuce, ideal for salads.',
    unit: 'kg',
  },
  {
    name: 'Spinach',
    image_url:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Nutritious spinach, great for health.',
    unit: 'kg',
  },
  {
    name: 'Cucumber',
    image_url:
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEN1Y3VtYmVyfGVufDB8fDB8fHww',
    description: 'Fresh cucumbers, perfect for salads.',
    unit: 'kg',
  },
  {
    name: 'Eggplant',
    image_url:
      'https://images.unsplash.com/photo-1613881553903-4543f5f2cac9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEVnZ3BsYW50fGVufDB8fDB8fHww',
    description: 'Purple eggplants, great for grilling.',
    unit: 'kg',
  },
  {
    name: 'Broccoli',
    image_url:
      'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJvY2NvbGl8ZW58MHx8MHx8fDA%3D',
    description: 'Green broccoli, rich in vitamins.',
    unit: 'kg',
  },
];

async function main() {
  console.log('Start seeding ...');

  // --- Clear existing data (Optional - uncomment if you need to clear) ---
  console.log('Cleaning up existing data...');
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendorBankAccount.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.vendorTransaction.deleteMany();
  await prisma.vendorBalance.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned up existing data.');

  // --- Seed Categories ---
  console.log('Seeding Categories...');

  const categories = [
    await prisma.category.create({
      data: {
        name: 'Fruits',
        slug: 'fruits',
        image_url:
          'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RnJ1aXRzfGVufDB8fDB8fHww',
        status: CategoryStatus.ACTIVE,
      },
    }),
    await prisma.category.create({
      data: {
        name: 'Vegetables',
        slug: 'vegetables',
        image_url:
          'https://media.istockphoto.com/id/2163456407/photo/fresh-vegetables-and-fruits-for-sale-in-asian-farmer-market-stall.webp?a=1&b=1&s=612x612&w=0&k=20&c=2PwZIdiOKMsrvmnRRi1NeSTURkHc8cuqE2uV4dVYZFw=',
        status: CategoryStatus.ACTIVE,
      },
    }),
  ];
  console.log('Seeded Categories.');

  // --- Seed Users ---
  console.log('Seeding Users...');
  const users = [];
  const salt = await bcrypt.genSalt();
  for (let i = 0; i < NUM_USERS; i++) {
    const isVendor = i < NUM_VENDORS;
    const password = await bcrypt.hash('password123', salt);
    const phoneNumber = `+2519${faker.string.numeric(8)}`;
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        phone_number: phoneNumber,
        password: password,
        role: isVendor ? UserRole.VENDOR : UserRole.CUSTOMER,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
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
        ]),
      },
    });
    users.push(user);
  }
  const customerUsers = users.filter((user) => user.role === UserRole.CUSTOMER);
  const vendorUsers = users.filter((user) => user.role === UserRole.VENDOR);
  console.log(`Seeded ${users.length} Users.`);

  // --- Seed Vendors ---
  console.log('Seeding Vendors...');
  const vendors = [];
  for (let i = 0; i < NUM_VENDORS; i++) {
    const vendorUser = vendorUsers[i];
    const vendor = await prisma.vendor.create({
      data: {
        business_name: faker.company.name(),
        business_email: faker.internet.email().toLowerCase(),
        phone_number: `+2519${faker.string.numeric(8)}`,
        logo_url: faker.image.urlLoremFlickr({
          category: 'business',
          width: 320,
          height: 240,
        }),
        status: VendorStatus.APPROVED,
        have_bank_details: true,
        userId: vendorUser.id,
        VendorBalance: {
          create: {
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
      },
    });
    vendors.push(vendor);
  }
  console.log(`Seeded ${vendors.length} Vendors.`);

  // --- Seed Products ---
  console.log('Seeding Products...');
  const products = [];
  const fruitCategory = categories.find((c) => c.name === 'Fruits')!;
  const vegetableCategory = categories.find((c) => c.name === 'Vegetables')!;

  for (const vendor of vendors) {
    // Each vendor gets a mix of fruits and vegetables
    const vendorFruits = faker.helpers.arrayElements(
      FRUITS,
      Math.min(NUM_PRODUCTS_PER_VENDOR / 2, FRUITS.length),
    );
    const vendorVegetables = faker.helpers.arrayElements(
      VEGETABLES,
      Math.min(NUM_PRODUCTS_PER_VENDOR / 2, VEGETABLES.length),
    );

    for (const productData of [...vendorFruits, ...vendorVegetables]) {
      const isFruit = FRUITS.some((f) => f.name === productData.name);
      const categoryToConnect = isFruit ? fruitCategory : vegetableCategory;

      const price = faker.number.float({
        min: 10,
        max: 100,
        fractionDigits: 2,
      });
      const discountPriceValue =
        price > 20
          ? faker.number.float({ min: 1, max: price * 0.5, fractionDigits: 2 })
          : 0;
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: price,
          discount_price: discountPriceValue > 0 ? discountPriceValue : null,
          unit: productData.unit,
          stock: faker.number.int({ min: 10, max: 1000 }), // Ensure some stock for carts/orders
          image_url: productData.image_url,
          status: ProductStatus.ACTIVE,
          is_featured: faker.datatype.boolean(),
          vendorId: vendor.id,
          categories: {
            connect: [{ id: categoryToConnect.id }],
          },
        },
      });
      products.push(product);
    }
  }
  console.log(`Seeded ${products.length} Products.`);

  // --- Seed Addresses (for Users) ---
  console.log('Seeding User Addresses...');
  const userAddresses = [];
  for (const user of customerUsers) {
    const address = await prisma.address.create({
      data: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        sub_city: faker.location.county() + ' Subcity',
        zip_code: faker.location.zipCode(),
        country: 'Ethiopia',
        latitude: parseFloat(faker.location.latitude().toFixed(6)),
        longitude: parseFloat(faker.location.longitude().toFixed(6)),
        is_default: true,
        userId: user.id,
      },
    });
    userAddresses.push(address);
  }
  console.log(`Seeded ${userAddresses.length} User Addresses.`);

  // --- Seed Addresses (for Vendors) ---
  console.log('Seeding Vendor Addresses...');
  const vendorAddresses = [];
  for (const vendor of vendors) {
    const address = await prisma.address.create({
      data: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        sub_city: faker.location.county() + ' Subcity',
        zip_code: faker.location.zipCode(),
        country: 'Ethiopia',
        latitude: parseFloat(faker.location.latitude().toFixed(6)),
        longitude: parseFloat(faker.location.longitude().toFixed(6)),
        is_default: true,
        vendorId: vendor.id,
      },
    });
    vendorAddresses.push(address);
  }
  console.log(`Seeded ${vendorAddresses.length} Vendor Addresses.`);

  // --- Seed Carts ---
  console.log('Seeding Carts...');
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

    const numItemsInCart = faker.number.int({ min: 1, max: 5 });
    let cartTotal = 0;
    const productsToAdd = faker.helpers.arrayElements(
      products.filter((p) => p.stock > 0),
      Math.min(numItemsInCart, products.filter((p) => p.stock > 0).length),
    );

    for (const product of productsToAdd) {
      const quantity = faker.number.int({
        min: 1,
        max: product.stock > 5 ? 5 : product.stock || 1,
      });
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
        // Handle potential unique constraint errors if a product is somehow selected twice for the same cart
        if ((e as any).code === 'P2002') {
          console.warn(
            `Attempted to add duplicate product ${product.id} to cart ${cart.id}, skipping.`,
          );
        } else {
          console.error(
            `Error adding item ${product.id} to cart ${cart.id}:`,
            e,
          );
        }
      }
    }
    await prisma.cart.update({
      where: { id: cart.id },
      data: { total_price: parseFloat(cartTotal.toFixed(2)) },
    });
  }
  console.log(`Seeded ${carts.length} Carts.`);

  // --- Seed Orders (by checking out some carts) ---
  console.log('Seeding Orders...');
  const orders = [];
  // Only checkout carts that have items and are still active
  const cartsToCheckout = faker.helpers.arrayElements(
    carts.filter((c) => c.total_price > 0 && c.status === CartStatus.ACTIVE),
    Math.min(
      NUM_ORDERS_FROM_CARTS,
      carts.filter((c) => c.total_price > 0 && c.status === CartStatus.ACTIVE)
        .length,
    ),
  );

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
      const orderStatus = faker.helpers.arrayElement([
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPED,
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
        OrderStatus.RETURNED,
        OrderStatus.REFUNDED,
      ]);

      try {
        const order = await prisma.order.create({
          data: {
            cartId: cart.id, // Unique cartId per order
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
                quantity: parseFloat(item.quantity.toString()),
                price: item.price,
                sub_total: item.sub_total,
                reviewed: false,
              })),
            },
          },
          include: { OrderItems: true },
        });
        orders.push(order);
      } catch (e) {
        // Handle potential unique constraint errors if the same cart somehow creates multiple orders
        if ((e as any).code === 'P2002') {
          console.warn(
            `Attempted to create duplicate order for cart ${cart.id}, skipping.`,
          );
        } else {
          console.error(`Error creating order for cart ${cart.id}:`, e);
        }
      }

      // Mark the cart as CHECKED_OUT
      await prisma.cart.update({
        where: { id: cart.id },
        data: { status: CartStatus.CHECKED_OUT },
      });
    }
  }
  console.log(`Seeded ${orders.length} Orders.`);

  // --- Seed Payments (for some PAID orders) ---
  console.log('Seeding Payments...');
  const paidOrders = orders.filter(
    (order) =>
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CANCELLED &&
      order.status !== OrderStatus.RETURNED && // Refunded/Returned might not have a simple "PAID" status initially
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
    ]);
    const paymentStatus = PaymentStatus.PAID; // Assuming these paid orders have PAID payment

    try {
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
    } catch (e) {
      // Handle potential unique constraint errors for orderId on Payment
      if ((e as any).code === 'P2002') {
        console.warn(
          `Attempted to create duplicate payment for order ${order.id}, skipping.`,
        );
      } else {
        console.error(`Error creating payment for order ${order.id}:`, e);
      }
    }
  }
  console.log('Seeded Payments.');

  // --- Seed Reviews (for some DELIVERED orders/items) ---
  console.log('Seeding Reviews...');
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
    Math.min(
      NUM_REVIEWS,
      reviewableItems.filter((item) => !item.reviewed).length,
    ),
  );

  for (const item of itemsToReview) {
    const existingReview = await prisma.review.findUnique({
      where: { orderItemId: item.id },
    });
    if (existingReview) continue;

    const order = orders.find((o) => o.id === item.orderId);
    if (!order) continue;

    try {
      await prisma.review.create({
        data: {
          orderItemId: item.id,
          userId: order.userId,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });

      await prisma.orderItem.update({
        where: { id: item.id },
        data: { reviewed: true },
      });
    } catch (e) {
      // Handle potential unique constraint errors for orderItemId on Review
      if ((e as any).code === 'P2002') {
        console.warn(
          `Attempted to create duplicate review for order item ${item.id}, skipping.`,
        );
      } else {
        console.error(`Error creating review for order item ${item.id}:`, e);
      }
    }
  }
  console.log('Seeded Reviews.');

  // --- Seed Vendor Transactions and Withdrawal Requests ---
  console.log('Seeding Vendor Transactions and Withdrawal Requests...');
  const vendorBalances = await prisma.vendorBalance.findMany();
  for (const balance of vendorBalances) {
    // Seed some withdrawal requests
    for (let i = 0; i < NUM_WITHDRAWAL_REQUESTS_PER_VENDOR; i++) {
      const requestedAmount = faker.number.float({
        min: 100,
        max:
          parseFloat(balance.available_balance.toString()) > 100
            ? parseFloat(balance.available_balance.toString()) * 0.5
            : parseFloat(balance.available_balance.toString()) || 100, // Request up to 50% or minimum 100 (if available)
        fractionDigits: 2,
      });
      if (
        requestedAmount <= 0 ||
        requestedAmount > parseFloat(balance.available_balance.toString())
      ) {
        // Skip if requested amount is zero or exceeds available balance
        continue;
      }

      await prisma.withdrawalRequest.create({
        data: {
          vendor_balance_id: balance.id,
          amount: requestedAmount,
          status: faker.helpers.arrayElement([
            WithdrawalStatus.PENDING,
            WithdrawalStatus.APPROVED,
            WithdrawalStatus.COMPLETED,
            WithdrawalStatus.REJECTED,
            WithdrawalStatus.PROCESSING,
            WithdrawalStatus.FAILED,
            WithdrawalStatus.CANCELLED,
          ]),
          payment_method: faker.helpers.arrayElement([
            WithdrawalPaymentMethod.BANK_TRANSFER,
            WithdrawalPaymentMethod.MOBILE_MONEY,
            WithdrawalPaymentMethod.CHAPA,
            WithdrawalPaymentMethod.OTHER,
          ]),
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
        TransactionType.ADJUSTMENT, // Include ADJUSTMENT as per schema
      ]);
      const status = faker.helpers.arrayElement([
        TransactionStatus.PENDING,
        TransactionStatus.COMPLETED,
        TransactionStatus.FAILED,
        TransactionStatus.CANCELLED, // Include CANCELLED as per schema
      ]);
      let amountValue;
      if (type === TransactionType.ORDER_PAYMENT) {
        amountValue = faker.number.float({
          min: 50,
          max: 1000,
          fractionDigits: 2,
        });
      } else if (type === TransactionType.WITHDRAWAL) {
        amountValue =
          faker.number.float({ min: 50, max: 500, fractionDigits: 2 }) * -1; // Negative for withdrawal
      } else {
        // ADJUSTMENT
        amountValue = faker.number.float({
          min: -200,
          max: 200,
          fractionDigits: 2,
        }); // Can be positive or negative
      }

      await prisma.vendorTransaction.create({
        data: {
          vendor_balance_id: balance.id,
          amount: amountValue,
          type: type,
          status: status,
          description: faker.lorem.sentence(),
          reference_id: faker.string.uuid(),
        },
      });
    }
  }
  console.log('Seeded Vendor Transactions and Withdrawal Requests.');

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
