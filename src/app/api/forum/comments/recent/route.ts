import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recentComments = await prisma.comment.findMany({
      take: 5,
      include: {
        user: {
          select: { fullName: true, image: true }
        },
        post: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const serialized = JSON.parse(JSON.stringify(recentComments, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
