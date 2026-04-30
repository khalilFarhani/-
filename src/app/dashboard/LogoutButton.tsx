'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
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
