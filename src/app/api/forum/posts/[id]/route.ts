import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await decrypt(session);
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userId = BigInt(payload.userId);
    const postId = BigInt(id);

    // Verify ownership
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.forumPost.delete({ where: { id: postId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await req.json();
    const { title, content, category } = body;
    
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await decrypt(session);
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userId = BigInt(payload.userId);
    const postId = BigInt(id);

    // Verify ownership
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.forumPost.update({
      where: { id: postId },
      data: { title, content, category }
    });

    const serialized = JSON.parse(JSON.stringify(updated, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Forum PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
