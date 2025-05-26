// prisma/seed.ts

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
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

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const admin = await prisma.user.upsert({
    where: { phone_number: '+251908005801' },
    update: {
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@test.com',
      password: await bcrypt.hash('adminpassword', 10),
      phone_number: '+251908005801',
      need_reset_password: false,
      first_name: 'Edmealem',
      last_name: 'Kassahun',
      role: UserRole.ADMIN,
      is_onboarding: false,
      profile_picture:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1714690850/default_profile_image.png',
    },
  });

  const user = await prisma.user.upsert({
    where: { phone_number: '+251948006129' },
    update: {
      role: UserRole.CUSTOMER,
    },
    create: {
      email: 'test@test.com',
      password: await bcrypt.hash('test1234', 10),
      phone_number: '+251948006129',
      need_reset_password: false,
      first_name: 'Abebe',
      last_name: 'Kebede',
      role: UserRole.CUSTOMER,
      is_onboarding: false,
      profile_picture:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1714690850/default_profile_image.png',
    },
  });

  // create a vendor
  const vendorOwner = await prisma.user.upsert({
    where: { phone_number: '+251908005802' },
    update: {
      role: UserRole.VENDOR,
    },
    create: {
      email: 'vendor@test.com',
      password: await bcrypt.hash('test1234', 10),
      phone_number: '+251908005802',
      need_reset_password: false,
      first_name: 'VAbebe',
      last_name: 'Kebede',
      role: UserRole.VENDOR,
      is_onboarding: false,
      profile_picture:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1714690850/default_profile_image.png',
    },
  });

  const busines = await prisma.vendor.upsert({
    where: {
      business_email: 'busines@test.com',
      phone_number: '+251908005802',
    },
    update: {},
    create: {
      business_email: 'busines@test.com',
      phone_number: '+251908005802',
      business_name: 'Test Business',
      logo_url:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1744938281/ysmaqbtkrwaftn40j6i2.png',
      status: 'APPROVED',
      userId: vendorOwner.id,
    },
  });

  // create category
  const category = await prisma.category.upsert({
    where: { slug: 'test_category' },
    update: {},
    create: {
      name: 'Test Category',
      slug: 'test_category',
    },
  });

  // create 2 products
  const product1 = await prisma.product.create({
    data: {
      name: 'Test Product 1',
      description: 'Test Product 1 Description',
      price: 100,
      unit: 'kg',
      stock: 100,
      vendorId: busines.id,
      image_url:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1744938280/axrcyeudhipiu0e1mvem.jpg',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Test Product 2',
      description: 'Test Product 2 Description',
      price: 200,
      unit: 'kg',
      stock: 100,
      vendorId: busines.id,
      image_url:
        'https://res.cloudinary.com/dvp1mjhd9/image/upload/v1744938280/d8fbhim9ixedbebaxf28.jpg',
    },
  });

  console.log('admin: ', admin);
  console.log('user: ', user);
  console.log('vendorOwner: ', vendorOwner);
  console.log('busines: ', busines);
  console.log('category: ', category);
  console.log('product1: ', product1);
  console.log('product2: ', product2);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
