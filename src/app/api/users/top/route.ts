import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        fullName: true,
        gender: true,
        _count: {
          select: {
            forumPosts: true,
            comments: true
          }
        }
      },
      orderBy: {
        forumPosts: { _count: 'desc' }
      }
    });

    const serialized = JSON.parse(JSON.stringify(topUsers, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Top Users Error:', error);
    return NextResponse.json({ error: 'Failed to fetch top users' }, { status: 500 });
  }
}
