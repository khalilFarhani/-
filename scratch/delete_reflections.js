const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.reflectionEntry.deleteMany({});
  console.log(`Deleted ${deleted.count} reflection entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
