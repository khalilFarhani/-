'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'onthe',
    image: '',
    teachingStartYear: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء التسجيل');

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (loginRes.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden py-24 selection:bg-primary/30" dir="rtl">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl flex justify-between items-center mb-10 relative z-10">
        <Link href="/" className="text-3xl font-black tracking-tight flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg shadow-lg">✨</span>
          قيم <span className="text-gradient">وتعلم</span>
        </Link>
        <button onClick={() => router.back()} type="button" className="btn-smooth btn-smooth-outline !py-2 !px-4 !text-sm group">
          <span>العودة</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="bubbly-card w-full max-w-2xl animate-soft relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">إنشاء <span className="text-gradient">حساب جديد</span></h2>
          <p className="text-lg font-medium opacity-70">انضم إلى مجتمعنا من المعلمين المبدعين</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-5 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 col-span-2">
            <label className="text-sm font-black text-foreground/80 px-2">الاسم واللقب</label>
            <input required type="text" placeholder="الاسم الكامل" className="input-smooth" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">البريد الإلكتروني</label>
            <input required type="email" placeholder="name@example.com" className="input-smooth" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">الجنس</label>
            <div className="relative">
              <select className="input-smooth appearance-none cursor-pointer" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="onthe">أنثى</option>
                <option value="dhakar">ذكر</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">سنة بداية التدريس</label>
            <input type="number" min="1900" max={new Date().getFullYear()} placeholder="2015" className="input-smooth" value={formData.teachingStartYear} onChange={e => setFormData({ ...formData, teachingStartYear: e.target.value })} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">صورة شخصية</label>
            <div className="relative">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              <div className="input-smooth flex items-center gap-3 overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                <span className="text-muted-foreground truncate text-sm font-bold">{formData.image ? 'تم اختيار صورة ✅' : 'اسحب صورة هنا أو اضغط...'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">كلمة المرور</label>
            <input required type="password" placeholder="••••••••" className="input-smooth" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-foreground/80 px-2">تأكيد كلمة المرور</label>
            <input required type="password" placeholder="••••••••" className="input-smooth" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-smooth btn-smooth-primary w-full py-5 text-xl col-span-2 mt-6">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </div>
            ) : 'إنشاء حساب جديد'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm font-bold text-muted-foreground mb-6">لديك حساب بالفعل؟</p>
          <Link href="/login" className="btn-smooth btn-smooth-outline w-full py-4 font-black">تسجيل الدخول الآن</Link>
        </div>
      </div>

      <div className="mt-12 relative z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}
