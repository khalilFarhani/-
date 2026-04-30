import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload?.userId) userId = payload.userId;
      } catch (e) {}
    }

    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let uId: bigint;
    try {
      uId = BigInt(userId);
    } catch {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    // Record visit
    await prisma.bookletVisit.create({ data: { userId: uId } });

    // Return updated count
    const count = await prisma.bookletVisit.count({ where: { userId: uId } });

    return NextResponse.json({ visits: count });
  } catch (error) {
    console.error('Booklet Visit API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
