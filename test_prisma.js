const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
