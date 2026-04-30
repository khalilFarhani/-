'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      onTouchEnd={(e) => { e.preventDefault(); handleLogout(); }}
      className="btn-smooth btn-smooth-outline text-red-500 hover:!bg-red-500 hover:!text-white hover:!border-red-500 transition-all duration-300"
      style={{ minWidth: 44, minHeight: 44, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      aria-label="تسجيل الخروج"
    >
      {/* Icon only on mobile, text+icon on desktop */}
      <span className="hidden lg:flex items-center gap-2 px-4 py-2 text-xs font-black">
        <LogOut size={14} />
        تسجيل الخروج
      </span>
      <span className="flex lg:hidden items-center justify-center p-2">
        <LogOut size={20} />
      </span>
    </button>
  );
}
