import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Clean up
    await prisma.chatMessage.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.forumPost.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Teachers
    const user1 = await prisma.user.create({
      data: {
        fullName: 'أ. رحمة علية',
        email: 'rahma@school.tn',
        password: 'password123',
        gender: 'female',
        teachingStartYear: 2015
      }
    });

    const user2 = await prisma.user.create({
      data: {
        fullName: 'أ. إسراء عروج',
        email: 'israa@school.tn',
        password: 'password123',
        gender: 'female',
        teachingStartYear: 2018
      }
    });

    const user3 = await prisma.user.create({
      data: {
        fullName: 'أ. أحمد علي',
        email: 'ahmed@school.tn',
        password: 'password123',
        gender: 'male',
        teachingStartYear: 2010
      }
    });

    // Create some posts
    await prisma.forumPost.create({
      data: {
        userId: user1.id,
        title: 'مقاطعة الشرح بين البنين والبنات',
        content: 'اليوم لاحظت أن الأولاد يقاطعون أكثر أثناء الشرح، بينما البنات ينتظرن الإذن. كيف أتعامل مع هذا الوضع بطريقة عادلة؟',
        category: 'مواقف'
      }
    });

    await prisma.forumPost.create({
      data: {
        userId: user2.id,
        title: 'طريقة توزيع الأسئلة بالتناوب',
        content: 'استعملت طريقة توزيع الأسئلة بالتناوب بين البنات والبنين، ولاحظت تحسناً كبيراً في مستوى مشاركة البنات.',
        category: 'تجارب'
      }
    });

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Seed failed', details: error }, { status: 500 });
  }
}
