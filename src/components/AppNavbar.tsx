import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LogoutButton from '@/app/dashboard/LogoutButton';
import ThemeToggle from '@/components/ThemeToggle';
import { Scale } from 'lucide-react';
import MobileNavMenu from './MobileNavMenu';

const navItems = [
  { name: 'الرئيسية', href: '/dashboard',  icon: '🏠' },
  { name: 'الكتيب',   href: '/booklet',    icon: '📖' },
  { name: 'الكويزات', href: '/quizzes',    icon: '🎮' },
  { name: 'التشخيص',  href: '/diagnostic', icon: '✨' },
  { name: 'التأمل',   href: '/reflections',icon: '🧘' },
  { name: 'المنتدى',  href: '/forum',      icon: '💬' },
];

export default async function AppNavbar() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  let user = null;
  if (sessionToken) {
    const payload = await decrypt(sessionToken);
    if (payload?.userId) {
      user = await prisma.user.findUnique({ where: { id: BigInt(payload.userId) } });
    }
  }

  return (
    <nav className="sticky top-0 z-50">
      <div className="smooth-glass px-6 py-3 flex justify-between items-center">

        {/* Left: Logo + Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Scale size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground leading-none tracking-tight">قيم <span className="text-primary">وتعلم</span></span>
              <span className="text-[11px] font-bold text-muted-foreground tracking-widest mt-1">منصة الوعي الجندري</span>
            </div>
          </Link>
          <div className="hidden lg:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-lg font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Theme + Profile + Logout + Mobile Menu */}
        <div className="flex items-center gap-3">
          <MobileNavMenu items={navItems} />
          <ThemeToggle />
          <div className="h-7 w-px bg-border/60" />
          {user && (
            <Link href="/profile" className="flex items-center gap-2.5 group px-2 py-1.5 rounded-xl hover:bg-muted/60 transition-all">
              {user.image ? (
                <img src={user.image} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-all shadow-sm" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl group-hover:bg-primary/20 transition-colors shadow-sm">
                  {user.fullName?.charAt(0)}
                </div>
              )}

            </Link>
          )}
          <LogoutButton />
        </div>

      </div>
    </nav>
  );
}
