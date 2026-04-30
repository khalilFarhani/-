import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      include: {
        user: {
          select: { fullName: true, image: true, gender: true }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    });

    const serialized = JSON.parse(JSON.stringify(messages, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, userId, type, fileUrl } = body;

    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId: BigInt(userId || 1),
        type: type || 'text',
        fileUrl
      }
    });

    const serialized = JSON.parse(JSON.stringify(message, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
