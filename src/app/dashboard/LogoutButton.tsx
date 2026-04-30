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
      style={{ minWidth: 36, minHeight: 36, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      aria-label="تسجيل الخروج"
    >
      {/* Desktop: text + icon */}
      <span className="hidden lg:flex items-center gap-2 px-4 py-2 text-xs font-black">
        <LogOut size={14} />
        تسجيل الخروج
      </span>
      {/* Mobile: tiny icon only */}
      <span className="flex lg:hidden items-center justify-center w-8 h-8">
        <LogOut size={16} />
      </span>
    </button>
  );
}
