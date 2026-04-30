const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Fix خليل فرحاني (id:5) -> ذكر
  const updated = await p.user.update({
    where: { id: 5n },
    data: { gender: 'ذكر' }
  });
  console.log('✅ Updated:', updated.fullName, '→ gender:', updated.gender);
  await p.$disconnect();
}

main().catch(console.error);
