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
      aria-label="تسجيل الخروج"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      className="text-red-400 hover:text-red-500 transition-colors"
    >
      {/* Desktop: outlined button with text */}
      <span className="hidden lg:flex items-center gap-2 border border-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-xl px-3 py-1.5 text-xs font-black transition-all">
        <LogOut size={13} />
        خروج
      </span>
      {/* Mobile: tiny icon only — absolutely non-obstructive */}
      <span className="flex lg:hidden items-center justify-center" style={{ width: 22, height: 22 }}>
        <LogOut size={12} strokeWidth={2.5} />
      </span>
    </button>
  );
}
