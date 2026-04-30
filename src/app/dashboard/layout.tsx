import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AppNavbar from '@/components/AppNavbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  const payload = await decrypt(sessionToken);

  if (!payload || !payload.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({ where: { id: BigInt(payload.userId) } });

  return (
    <div className="min-h-screen bg-muted/10">
      <AppNavbar />
      <main className="max-w-6xl mx-auto px-[2px] py-8 animate-soft">
        {children}
      </main>
    </div>
  );
}
