import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[REFLECTION API] Received body:', JSON.stringify(body));
    
    // Get user from session
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    let userId = null;

    if (session) {
      const payload = await decrypt(session);
      console.log('[REFLECTION API] Session payload:', payload);
      if (payload?.userId) {
        userId = BigInt(payload.userId);
      }
    } else {
      console.log('[REFLECTION API] No session cookie found');
    }

    if (!userId) {
      console.log('[REFLECTION API] Unauthorized: No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      date,
      subject,
      className,
      lessonTopic,
      boysNumber,
      girlsNumber,
      cognitiveGoal,
      skillGoal,
      emotionalGoal,
      girlsParticipation,
      boysParticipation,
      behaviorNotes,
      genderReflection,
      difficulties,
      suggestions,
      feeling
    } = body;

    let newEntry;
    try {
      newEntry = await (prisma.reflectionEntry as any).create({
        data: {
          userId,
          date: date ? new Date(date) : new Date(),
          subject: subject || '',
          className: className || '',
          lessonTopic: lessonTopic || '',
          boysNumber: parseInt(boysNumber) || 0,
          girlsNumber: parseInt(girlsNumber) || 0,
          cognitiveGoal: cognitiveGoal || '',
          skillGoal: skillGoal || '',
          emotionalGoal: emotionalGoal || '',
          girlsParticipation: parseInt(girlsParticipation) || 0,
          boysParticipation: parseInt(boysParticipation) || 0,
          behaviorNotes: behaviorNotes || '',
          genderReflection: genderReflection || '',
          difficulties: difficulties || '',
          suggestions: suggestions || '',
          feeling: feeling || '',
          createdAt: new Date()
        }
      });
      console.log('[REFLECTION API] Success via ORM: ID', newEntry.id.toString());
    } catch (ormError: any) {
      console.error('[REFLECTION API] ORM failed, trying Raw SQL:', ormError.message);
      
      // Fallback to Raw SQL if ORM fails (usually due to schema mismatch in client)
      await prisma.$executeRawUnsafe(`
        INSERT INTO reflection_entries (
          user_id, date, subject, class_name, lesson_topic, 
          boys_number, girls_number, cognitive_goal, skill_goal, emotional_goal,
          girls_participation, boys_participation, behavior_notes, gender_reflection, 
          difficulties, suggestions, feeling, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
        )`,
        userId, date ? new Date(date) : new Date(), subject || '', className || '', lessonTopic || '',
        parseInt(boysNumber) || 0, parseInt(girlsNumber) || 0, cognitiveGoal || '', skillGoal || '', emotionalGoal || '',
        parseInt(girlsParticipation) || 0, parseInt(boysParticipation) || 0, behaviorNotes || '', genderReflection || '',
        difficulties || '', suggestions || '', feeling || ''
      );
      console.log('[REFLECTION API] Success via Raw SQL');
      return NextResponse.json({ success: true, message: 'Saved via fallback' });
    }

    return NextResponse.json({ success: true, id: newEntry.id.toString() });
  } catch (error: any) {
    console.error('[REFLECTION API] Error:', error.message, error.stack);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
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

    const entries = await prisma.reflectionEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    // Serialize BigInt to string
    const serializedEntries = entries.map(entry => ({
      ...entry,
      id: entry.id.toString(),
      userId: entry.userId?.toString()
    }));

    return NextResponse.json(serializedEntries);
  } catch (error: any) {
    console.error('[REFLECTION API GET] Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

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

    await prisma.reflectionEntry.delete({
      where: { 
        id: BigInt(id),
        userId: userId // Security: ensure user owns the entry
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[REFLECTION API DELETE] Error:', error.message);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
