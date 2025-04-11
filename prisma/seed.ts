// prisma/seed.ts

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { phone_number: '+251908005801' },
    update: {},
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
    update: {},
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

  console.log('admin: ', admin);
  console.log('user: ', user);
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
