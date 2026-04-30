'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear localStorage first
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    
    await fetch('/api/auth/logout', { method: 'POST' });
    
    // Force a full page reload to the landing page so middleware resets
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="btn-smooth btn-smooth-outline !py-2 !px-4 text-xs font-black text-red-500 hover:!bg-red-500 hover:!text-white hover:!border-red-500 transition-all duration-300"
    >
      تسجيل الخروج
    </button>
  );
}
