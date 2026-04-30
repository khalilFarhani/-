const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found in the database. Please create a user first.");
    return;
  }

  console.log(`Seeding activity for user: ${user.fullName} (ID: ${user.id})`);

  const now = new Date('2026-04-27T10:00:00Z'); // Current time in the system context
  
  // Create some reflection entries for the last 7 days
  const activities = [
    { dayOffset: 0, count: 5 }, // Monday (Today)
    { dayOffset: 1, count: 3 }, // Sunday
    { dayOffset: 2, count: 8 }, // Saturday
    { dayOffset: 3, count: 2 }, // Friday
    { dayOffset: 4, count: 6 }, // Thursday
    { dayOffset: 5, count: 4 }, // Wednesday
    { dayOffset: 6, count: 7 }, // Tuesday
  ];

  for (const activity of activities) {
    const date = new Date(now);
    date.setDate(now.getDate() - activity.dayOffset);
    
    for (let i = 0; i < activity.count; i++) {
      await prisma.reflectionEntry.create({
        data: {
          userId: user.id,
          date: date,
          subject: `Détails du cours - ${date.toDateString()}`,
          className: "Classe 101",
          lessonTopic: "Introduction aux Valeurs",
          createdAt: date
        }
      });
    }
  }

  // Create some diagnostic attempts
  const diagnosticData = [
    { percentage: 65, totalScore: 130, level: JSON.stringify({ p1: 60, p2: 70, p3: 65, p4: 55, p5: 75 }), offset: 10 },
    { percentage: 72, totalScore: 144, level: JSON.stringify({ p1: 70, p2: 75, p3: 70, p4: 65, p5: 80 }), offset: 5 },
    { percentage: 85, totalScore: 170, level: JSON.stringify({ p1: 85, p2: 80, p3: 90, p4: 80, p5: 90 }), offset: 1 },
  ];

  for (const diag of diagnosticData) {
    const date = new Date(now);
    date.setDate(now.getDate() - diag.offset);
    await prisma.diagnosticAttempt.create({
      data: {
        userId: user.id,
        percentage: diag.percentage,
        totalScore: diag.totalScore,
        level: diag.level,
        createdAt: date
      }
    });
  }

  // Create some forum engagement
  for (let i = 0; i < 3; i++) {
    await prisma.forumPost.create({
      data: {
        userId: user.id,
        title: `Post ${i + 1}`,
        content: `Contenu du post ${i + 1}`,
        category: "Pédagogie",
        createdAt: new Date(now.getTime() - i * 3600000)
      }
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
