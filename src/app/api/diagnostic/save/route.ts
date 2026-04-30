import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, score, percentage, axisScores } = body;

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload?.userId) {
          userId = payload.userId;
        }
      } catch (e) {}
    }

    if (!userId || userId === 'undefined' || userId === 'null') {
       return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    
    let parsedUserId;
    try {
      parsedUserId = BigInt(userId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
    }

    const shortKeys: Record<string, string> = {
      'توزيع المشاركة': 'p1',
      'التوقعات الأكاديمية': 'p2',
      'السلوك والانضباط': 'p3',
      'توزيع المهام': 'p4',
      'الجانب العاطفي': 'p5'
    };
    const mappedAxis: any = {};
    if (axisScores) {
      Object.keys(axisScores).forEach(k => {
        if (shortKeys[k]) mappedAxis[shortKeys[k]] = axisScores[k];
      });
    }

    const result = await prisma.diagnosticAttempt.create({
      data: {
        userId: parsedUserId,
        totalScore: parseInt(score),
        percentage: parseFloat(percentage),
        level: JSON.stringify(mappedAxis)
      }
    });


    return NextResponse.json({ success: true, id: result.id.toString() });
  } catch (error) {
    console.error('Diagnostic Save Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
