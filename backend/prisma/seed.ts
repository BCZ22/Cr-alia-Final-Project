/*
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash the common password
  const passwordHash = await bcrypt.hash('password', 10);

  // Create an Admin user
  await prisma.user.upsert({
    where: { email: 'admin@crealia.com' },
    update: {},
    create: {
      email: 'admin@crealia.com',
      username: 'admin',
      name: 'Admin Créalia',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  // Create a standard user
  await prisma.user.upsert({
    where: { email: 'user@crealia.com' },
    update: {},
    create: {
      email: 'user@crealia.com',
      username: 'user',
      name: 'User Créalia',
      passwordHash: passwordHash,
      role: 'USER',
    },
  });

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
*/
