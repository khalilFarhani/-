import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get user from session
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    let userId = null;

    if (session) {
      const payload = await decrypt(session);
      if (payload?.userId) {
        userId = BigInt(payload.userId);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a minimal reflection entry to count as an "access" or "session"
    const newEntry = await prisma.reflectionEntry.create({
      data: {
        userId,
        date: new Date(),
        subject: 'جلسة تأمل', // Labeling it as a meditation session
        createdAt: new Date()
      }
    });

    console.log(`[VISIT API] Session recorded for User ${userId}, ID: ${newEntry.id}`);

    return NextResponse.json({ success: true, id: newEntry.id.toString() });
  } catch (error: any) {
    console.error('[VISIT API] Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
