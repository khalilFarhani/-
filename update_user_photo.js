const fs = require('fs');
const path = 'C:\\Users\\Khali\\.gemini\\antigravity\\brain\\8e2ab550-1137-4f38-99e0-abde310f1fc7\\teacher_profile_rahma_1777315263632.png';
const base64 = fs.readFileSync(path, {encoding: 'base64'});
const dataUri = `data:image/png;base64,${base64}`;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { id: 1 },
    data: { image: dataUri }
  });
  console.log('User 1 profile picture updated successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
