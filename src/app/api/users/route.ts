import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        image: true,
        gender: true
      },
      orderBy: { fullName: 'asc' }
    });

    const serialized = JSON.parse(JSON.stringify(users, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));

    return NextResponse.json(serialized);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
