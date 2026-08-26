import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const adminPassword = await bcrypt.hash('1234', 10);
  const userPassword = await bcrypt.hash('password123', 10);
  
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { username: 'school' },
    update: { password: adminPassword },
    create: {
      username: 'school',
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin User',
    },
  });

  // Create Teacher
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher' },
    update: { password: userPassword },
    create: {
      username: 'teacher',
      password: userPassword,
      role: 'TEACHER',
      name: 'Teacher User',
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: { password: userPassword },
    create: {
      username: 'student',
      password: userPassword,
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
