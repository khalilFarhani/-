'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { Scale, BookOpen, GraduationCap, Mail, Lock, ArrowLeft, Sparkles, Pencil, Users } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30 bg-background" dir="rtl">
      {/* Theme Toggle in top corner */}
      <div className="absolute top-6 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Pedagogical Background Decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
         <div className="absolute top-[10%] right-[5%] animate-float"><Scale size={180} /></div>
         <div className="absolute top-[40%] left-[2%] animate-float-delayed"><GraduationCap size={200} /></div>
         <div className="absolute bottom-[20%] right-[8%] animate-float"><Users size={170} /></div>
         <div className="absolute bottom-[5%] left-[10%] animate-float-delayed"><BookOpen size={140} /></div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md flex justify-between items-center mb-10 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Scale size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-foreground leading-none tracking-tight">قيم <span className="text-primary">وتعلم</span></span>
          </div>
        </Link>
        <button onClick={() => router.push('/')} type="button" className="btn-smooth btn-smooth-outline !py-2 !px-4 !text-sm group flex items-center gap-2">
          <span>العودة</span>
          <ArrowLeft size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bubbly-card w-full max-w-md animate-soft relative z-10 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-4xl font-black mb-2">مرحباً <span className="text-gradient">بكم</span></h2>
          <p className="text-base font-bold opacity-60">سجل دخولك لمتابعة رحلتك التعليمية</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-shake">
            <Scale size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Mail size={14} className="text-primary" />
              البريد الإلكتروني
            </label>
            <input
              required
              type="email"
              placeholder="البريد الإلكتروني"
              className="input-smooth"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-black text-foreground/70 flex items-center gap-2 uppercase tracking-wider">
                <Lock size={14} className="text-secondary" />
                كلمة المرور
              </label>
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

          <button type="submit" disabled={loading} className="btn-smooth btn-smooth-primary w-full py-4 text-lg mt-4 group">
            {loading ? (
              <div className="flex items-center gap-3 justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الدخول...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>دخول</span>
                <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-border/50 text-center">
          <p className="text-xs font-black text-muted-foreground mb-4 uppercase tracking-widest">ليس لديك حساب؟</p>
          <Link href="/register" className="btn-smooth btn-smooth-outline w-full py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/5">
            <span>أنشئ حسابك الآن</span>
            <Sparkles size={14} className="text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
