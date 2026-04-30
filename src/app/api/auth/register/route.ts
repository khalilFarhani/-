import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, gender, image, teachingStartYear } = body;

    if (!email || !password || !fullName || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const avatarUrl = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        gender,
        image: avatarUrl,
        teachingStartYear: teachingStartYear ? parseInt(teachingStartYear.toString()) : null,
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id.toString(), email: user.email, gender: user.gender, image: user.image } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 });
  }
}
