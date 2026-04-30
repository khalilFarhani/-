import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (session) {
      try {
        const payload = await decrypt(session);
        if (payload?.userId) {
          userId = payload.userId;
        }
      } catch (e) { }
    }

    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let uId;
    try {
      uId = BigInt(userId);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
    }

    // 1. Diagnostic Evolution (Latest 10 attempts, ordered chronologically for the graph)
    const diagnosticsData = await prisma.diagnosticAttempt.findMany({
      where: { userId: uId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    // Reverse to show from oldest to newest in the evolution chart
    const diagnostics = diagnosticsData.reverse();

    // Latest Axis Scores for Radar (Mocked or pulled if stored)
    const latestDiag = await prisma.diagnosticAttempt.findFirst({
      where: { userId: uId },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Weekly Activity - Reflections per day (Current Week starting Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    // getDay() returns 0 for Sunday. We set the date to (now - day of week) to get Sunday.
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const reflections = await prisma.reflectionEntry.findMany({
      where: { 
        userId: uId, 
        date: { gte: startOfWeek } 
      },
      select: { date: true }
    });
    
    console.log(`[STATS API] User: ${uId}, Reflections found since ${startOfWeek.toISOString()}: ${reflections.length}`);

    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    reflections.forEach((r: any) => {
      if (r.date) {
        // Use the date field which is stored as @db.Date
        const dayIdx = new Date(r.date).getDay();
        weeklyData[dayIdx]++;
      }
    });

    // 3. Engagement Metrics (Real Count)
    const postCount = await prisma.forumPost.count({ where: { userId: uId } });
    const commentCount = await prisma.comment.count({ where: { userId: uId } });
    const likeCount = await prisma.like.count({ where: { userId: uId } });
    const reflectionCount = await prisma.reflectionEntry.count({ where: { userId: uId } });

    // 4. Global Ranking (Top 3 Users)
    const topUsers = await prisma.user.findMany({
      take: 3,
      select: { fullName: true, image: true }
    });

    let latestAxisData = {
      'توزيع المشاركة': 0,
      'التوقعات الأكاديمية': 0,
      'السلوك والانضباط': 0,
      'توزيع المهام': 0,
      'الجانب العاطفي': 0
    };

    if (latestDiag && latestDiag.level) {
      try {
        const parsed = JSON.parse(latestDiag.level);
        if (parsed.p1 !== undefined) latestAxisData['توزيع المشاركة'] = parsed.p1;
        if (parsed.p2 !== undefined) latestAxisData['التوقعات الأكاديمية'] = parsed.p2;
        if (parsed.p3 !== undefined) latestAxisData['السلوك والانضباط'] = parsed.p3;
        if (parsed.p4 !== undefined) latestAxisData['توزيع المهام'] = parsed.p4;
        if (parsed.p5 !== undefined) latestAxisData['الجانب العاطفي'] = parsed.p5;
      } catch (e) {
        console.error("Failed to parse axis scores", e);
      }
    }

    // 5. Quiz Performance (Latest per Category for Pie Chart)
    const categories = ['كويز المعرفة', 'كويز المواقف', 'كويز الحالات'];
    const quizPerformance = await Promise.all(categories.map(async (cat) => {
      const lastAttempt = await prisma.quizAttempt.findFirst({
        where: { 
          userId: uId,
          quiz: { title: cat }
        },
        orderBy: { createdAt: 'desc' },
        select: { percentage: true }
      });
      const p = lastAttempt?.percentage || 0;
      return { title: cat, percentage: Math.round(p * 100) / 100 };
    }));

    const quizCount = await prisma.quizAttempt.count({ where: { userId: uId } });
    const bookletVisitCount = await prisma.bookletVisit.count({ where: { userId: uId } });

    return NextResponse.json({
      diagnostics: diagnostics.map((d: any) => ({
        date: d.createdAt,
        percentage: Math.round(d.percentage * 100) / 100,
        score: d.totalScore
      })),
      latestAxis: latestAxisData,
      weeklyActivity: weeklyData,
      engagement: {
        posts: postCount,
        comments: commentCount,
        likes: likeCount,
        reflections: reflectionCount,
        quizzes: quizCount,
        bookletVisits: bookletVisitCount
      },
      quizPerformance,
      topUsers: topUsers.map((u: any, idx: number) => ({
        ...u,
        reputationPoints: 100 - (idx * 10) // Mocked since reputationPoints isn't in User schema
      }))
    }, {
      headers: { 'Content-Type': 'application/json' }
    });


  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
