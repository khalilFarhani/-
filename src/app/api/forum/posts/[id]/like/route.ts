import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await req.json();
    const params = await context.params;
    
    // Fallback: If params.id is undefined, try to extract from URL
    let idStr = params?.id;
    if (!idStr) {
      const url = new URL(req.url);
      const parts = url.pathname.split('/');
      // Expected path: /api/forum/posts/[id]/like
      idStr = parts[parts.length - 2]; 
    }

    if (!idStr) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }

    const postId = BigInt(idStr);
    const uId = BigInt(userId || 1);

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId: uId }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { postId, userId: uId }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Like Toggle Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
