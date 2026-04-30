import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'غير مصرح لك بالدخول' }, { status: 401 });
  }

  const payload = await decrypt(sessionToken);

  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(payload.userId) }
  });

  if (!user) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id.toString(),
      fullName: user.fullName ?? '',
      email: user.email,
      gender: user.gender ?? '',
      image: user.image ?? '',
      teachingStartYear: user.teachingStartYear,
    }
  });
}
