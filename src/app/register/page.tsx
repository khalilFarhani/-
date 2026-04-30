'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { Scale, BookOpen, GraduationCap, Users, ShieldCheck, ArrowLeft, Mail, Lock, User, Calendar, Image as ImageIcon, ChevronDown, Sparkles, Pencil } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden py-24 selection:bg-primary/30 bg-background" dir="rtl">
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
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl flex justify-between items-center mb-10 relative z-10">
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

      <div className="bubbly-card w-full max-w-2xl animate-soft relative z-10 p-8 md:p-12">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-2xl bg-secondary/10 text-secondary mb-4">
            <Users size={28} />
          </div>
          <h2 className="text-4xl font-black mb-2">إنشاء <span className="text-gradient">حساب جديد</span></h2>
          <p className="text-base font-bold opacity-60">انضم إلى مجتمعنا من المعلمين المبدعين</p>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3 animate-shake">
            <ShieldCheck size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <User size={14} className="text-primary" />
              الاسم واللقب
            </label>
            <input required type="text" placeholder="الاسم الكامل" className="input-smooth" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Mail size={14} className="text-secondary" />
              البريد الإلكتروني
            </label>
            <input required type="email" placeholder="البريد الإلكتروني" className="input-smooth" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Users size={14} className="text-accent" />
              الجنس
            </label>
            <div className="relative">
              <select className="input-smooth appearance-none cursor-pointer" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="onthe">أنثى</option>
                <option value="dhakar">ذكر</option>
              </select>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <ChevronDown size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Calendar size={14} className="text-success" />
              سنة بداية التدريس
            </label>
            <input type="number" min="1900" max={new Date().getFullYear()} placeholder="2015" className="input-smooth" value={formData.teachingStartYear} onChange={e => setFormData({ ...formData, teachingStartYear: e.target.value })} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <ImageIcon size={14} className="text-primary" />
              صورة شخصية
            </label>
            <div className="relative">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }} />
              <div className="input-smooth flex items-center gap-3 overflow-hidden border-2 border-dashed border-border/40 hover:border-primary transition-all">
                <span className="text-muted-foreground truncate text-sm font-bold">{formData.image ? 'تم اختيار صورة ✅' : 'اختر صورة شخصية...'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Lock size={14} className="text-secondary" />
              كلمة المرور
            </label>
            <input required type="password" placeholder="••••••••" className="input-smooth" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-foreground/70 px-2 flex items-center gap-2 uppercase tracking-wider">
              <Lock size={14} className="text-accent" />
              تأكيد كلمة المرور
            </label>
            <input required type="password" placeholder="••••••••" className="input-smooth" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-smooth btn-smooth-primary w-full py-4 text-lg md:col-span-2 mt-6 group">
            {loading ? (
              <div className="flex items-center gap-3 justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري التسجيل...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>إنشاء حساب جديد</span>
                <ArrowLeft size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-xs font-black text-muted-foreground mb-4 uppercase tracking-widest">لديك حساب بالفعل؟</p>
          <Link href="/login" className="btn-smooth btn-smooth-outline w-full py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/5">
            <span>سجل دخولك الآن</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
