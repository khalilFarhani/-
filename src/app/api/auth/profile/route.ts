import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, email, gender, teachingStartYear, image, currentPassword, newPassword } = body;

    const updateData: any = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (gender) updateData.gender = gender;
    if (teachingStartYear) updateData.teachingStartYear = parseInt(teachingStartYear);
    if (image) updateData.image = image;

    // Handle password change
    if (newPassword && currentPassword) {
      const user = await prisma.user.findUnique({
        where: { id: BigInt(payload.userId) }
      });
      if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where: { id: BigInt(payload.userId) },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id.toString(),
        fullName: updated.fullName,
        email: updated.email,
        gender: updated.gender,
        image: updated.image,
        teachingStartYear: updated.teachingStartYear,
      }
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 });
    }
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
