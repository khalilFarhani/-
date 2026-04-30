'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء تسجيل الدخول');

      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.userId,
        email: data.user.email,
        fullName: data.user.fullName
      }));

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex justify-between items-center mb-10 relative z-10">
        <Link href="/" className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg shadow-lg">✨</span>
          قيم <span className="text-gradient">وتعلم</span>
        </Link>
        <button onClick={() => router.back()} type="button" className="btn-smooth btn-smooth-outline !py-2 !px-4 !text-sm group">
          <span>العودة</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="bubbly-card w-full max-w-md animate-soft relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">مرحباً <span className="text-gradient">بمجدداً</span></h2>
          <p className="text-lg font-medium opacity-70">سجل دخولك لمتابعة رحلتك التعليمية</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-5 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/><path d="m22 12-4-4v8l4-4zM2 12l4 4V8l-4 4zM12 2l4 4H8l4-4zM12 22l-4-4h8l-4 4z"/></svg>
              البريد الإلكتروني
            </label>
            <input
              required
              type="email"
              placeholder="name@example.com"
              className="input-smooth"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-sm font-black text-foreground/80 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                كلمة المرور
              </label>
              <Link href="#" className="text-xs font-black text-primary hover:opacity-80 transition-opacity">نسيت كلمة المرور؟</Link>
            </div>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="input-smooth"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-smooth btn-smooth-primary w-full py-5 text-xl mt-4">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري التحقق...</span>
              </div>
            ) : 'دخول'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm font-bold text-muted-foreground mb-6">ليس لديك حساب بعد؟</p>
          <Link href="/register" className="btn-smooth btn-smooth-outline w-full py-4 font-black">إنشاء حساب جديد مجاناً</Link>
        </div>
      </div>

      <div className="mt-10 relative z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}
