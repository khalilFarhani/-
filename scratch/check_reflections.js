const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const counts = await prisma.reflectionEntry.count();
    console.log('Total reflections:', counts);
    
    const latest = await prisma.reflectionEntry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('Latest 5 reflections:');
    latest.forEach(r => {
      console.log(`ID: ${r.id}, User: ${r.userId}, CreatedAt: ${r.createdAt}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
