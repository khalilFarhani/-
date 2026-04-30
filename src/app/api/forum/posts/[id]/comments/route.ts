import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    let idStr = params?.id;
    if (!idStr) {
      const url = new URL(req.url);
      const parts = url.pathname.split('/');
      idStr = parts[parts.length - 2]; 
    }

    if (!idStr) return NextResponse.json([], { status: 200 });

    const comments = await prisma.comment.findMany({
      where: { postId: BigInt(idStr) },
      include: {
        user: { select: { fullName: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const serialized = JSON.parse(JSON.stringify(comments, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, content } = await req.json();
    const params = await context.params;
    
    let idStr = params?.id;
    if (!idStr) {
      const url = new URL(req.url);
      const parts = url.pathname.split('/');
      idStr = parts[parts.length - 2]; 
    }

    if (!idStr) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: BigInt(idStr),
        userId: BigInt(userId || 1)
      }
    });

    const serialized = JSON.parse(JSON.stringify(comment, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Comment Create Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
