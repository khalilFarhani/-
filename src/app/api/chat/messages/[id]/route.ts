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
    const messageId = BigInt(id);

    // Verify ownership
    const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    if (message.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.chatMessage.delete({ where: { id: messageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat DELETE Error:', error);
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
    const { content } = body;
    
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload = await decrypt(session);
    if (!payload?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const userId = BigInt(payload.userId);
    const messageId = BigInt(id);

    // Verify ownership
    const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    if (message.userId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { content }
    });

    const serialized = JSON.parse(JSON.stringify(updated, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Chat PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
