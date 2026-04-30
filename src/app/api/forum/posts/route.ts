import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.forumPost.findMany({
      include: {
        user: {
          select: { fullName: true, image: true, gender: true }
        },
        _count: {
          select: { comments: true, likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const serialized = JSON.parse(JSON.stringify(posts, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Forum GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, category, userId, imageUrl, fileUrl } = body;

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        userId: BigInt(userId || 1),
        imageUrl,
        fileUrl
      }
    });

    const serialized = JSON.parse(JSON.stringify(post, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Forum POST Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
