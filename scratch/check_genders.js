const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany({
    select: { id: true, fullName: true, gender: true }
  });
  console.log(JSON.stringify(users, (key, val) =>
    typeof val === 'bigint' ? val.toString() : val, 2));
  await p.$disconnect();
}

main().catch(console.error);
