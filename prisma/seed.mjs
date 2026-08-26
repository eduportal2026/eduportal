import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123',
      role: 'ADMIN',
      name: 'Admin User',
    },
  });

  // Create Teacher
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: 'password123',
      role: 'TEACHER',
      name: 'Teacher User',
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: {
      username: 'student',
      password: 'password123',
      role: 'STUDENT',
      name: 'Student User',
    },
  });

  console.log('Seeding finished.');
  console.log({ admin, teacher, student });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
