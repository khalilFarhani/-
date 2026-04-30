import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quizTitle, score, totalQuestions, percentage } = body;

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

    // 1. Find or create the quiz record
    let quiz = await prisma.quiz.findFirst({
      where: { title: quizTitle }
    });

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          title: quizTitle,
          type: 'interactive'
        }
      });
    }

    // 2. Save the attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score: parseInt(score),
        percentage: parseFloat(percentage),
        createdAt: new Date()
      }
    });

    console.log(`[QUIZ API] Saved attempt for User ${userId}, Quiz: ${quizTitle}, Score: ${percentage}%`);

    return NextResponse.json({ success: true, id: attempt.id.toString() });
  } catch (error: any) {
    console.error('[QUIZ API] Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
