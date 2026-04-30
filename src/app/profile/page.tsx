'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, BookOpen, Calendar, Camera, Lock,
  Save, LogOut, CheckCircle, AlertCircle, Edit3,
  Award, Brain, Activity, Target, ChevronRight,
  Scale, GraduationCap, Users
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    gender: '',
    teachingStartYear: '',
    image: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
           await fetch('/api/auth/logout', { method: 'POST' });
           window.location.href = '/login';
           return;
        }
        const { user: u } = await meRes.json();
        setUser(u);
        setForm(f => ({
          ...f,
          fullName: u.fullName ?? '',
          email: u.email ?? '',
          gender: u.gender ?? '',
          teachingStartYear: u.teachingStartYear?.toString() ?? '',
          image: u.image ?? ''
        }));

        const statsRes = await fetch(`/api/stats?userId=${u.id}`);
        const s = await statsRes.json();
        setStats(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتان' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          gender: form.gender,
          teachingStartYear: form.teachingStartYear,
          image: form.image,
          currentPassword: form.currentPassword || undefined,
          newPassword: form.newPassword || undefined,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ' });
      } else {
        setUser(data.user);
        setMessage({ type: 'success', text: 'تم تحديث المعلومات بنجاح ✅' });
        setEditMode(false);
        setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }
    } catch {
      setMessage({ type: 'error', text: 'فشل الاتصال بالخادم' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const isFemale = ['أنثى', 'onthe', 'female'].includes(user?.gender ?? '');

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label: 'التشخيصات', value: stats?.diagnostics?.length ?? 0, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'يوميات التأمل', value: stats?.engagement?.reflections ?? 0, icon: BookOpen, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'الكويزات', value: stats?.engagement?.quizzes ?? 0, icon: Brain, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'زيارات الكتيب', value: stats?.engagement?.bookletVisits ?? 0, icon: Activity, color: 'text-success', bg: 'bg-success/10' },
  ];

  const experienceYears = form.teachingStartYear
    ? new Date().getFullYear() - parseInt(form.teachingStartYear)
    : null;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" dir="rtl">
      {/* Pedagogical Background Decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
         <div className="absolute top-[15%] right-[5%] animate-float"><Scale size={140} /></div>
         <div className="absolute top-[45%] left-[2%] animate-float-delayed"><GraduationCap size={160} /></div>
         <div className="absolute bottom-[25%] right-[8%] animate-float"><Users size={150} /></div>
         <div className="absolute bottom-[8%] left-[10%] animate-float-delayed"><BookOpen size={110} /></div>
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          العودة
        </button>

        {/* Alert Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 p-4 rounded-2xl mb-6 font-bold text-lg ${
                message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bubbly-card !p-8 overflow-hidden mb-8 border-none shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Avatar - always clickable to change photo */}
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-28 h-28 rounded-[1.5rem] overflow-hidden shadow-2xl bg-card border-4 border-primary/20 group-hover:border-primary transition-all">
                  {form.image ? (
                    <img src={form.image} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-black">
                      {form.fullName?.charAt(0) || '؟'}
                    </div>
                  )}
                </div>
                {/* Camera overlay - always visible on hover */}
                <div className="absolute inset-0 bg-black/50 rounded-[1.5rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={26} className="text-white" />
                  <span className="text-white text-[10px] font-bold mt-1">تغيير</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <h1 className="text-2xl font-black">{user?.fullName ?? '—'}</h1>
                <p className="text-primary font-bold text-sm mt-1">{isFemale ? 'معلمة' : 'معلّم'}{experienceYears !== null ? ` · ${experienceYears} سنوات خبرة` : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`btn-smooth flex items-center gap-2 !px-5 !py-2.5 !text-sm ${editMode ? 'btn-smooth-outline' : 'btn-smooth-primary'}`}
              >
                <Edit3 size={16} />
                {editMode ? 'إلغاء' : 'تعديل المعلومات'}
              </button>
              <button
                onClick={handleLogout}
                className="btn-smooth btn-smooth-outline flex items-center gap-2 !px-5 !py-2.5 !text-sm text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="bubbly-card !p-5 flex flex-col items-center text-center">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${s.bg} ${s.color}`}><s.icon size={22} strokeWidth={2.5} /></div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-3xl font-black">{s.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bubbly-card !p-8 mb-8">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <Edit3 size={24} className="text-primary" />
                  تعديل المعلومات الشخصية
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-foreground/70 flex items-center gap-2"><User size={14} />الاسم الكامل</label>
                    <input className="input-smooth" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-foreground/70 flex items-center gap-2"><Mail size={14} />البريد الإلكتروني</label>
                    <input type="email" className="input-smooth" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-foreground/70 flex items-center gap-2"><Award size={14} />الجنس</label>
                    <select className="input-smooth appearance-none" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                      <option value="أنثى">أنثى</option>
                      <option value="ذكر">ذكر</option>
                    </select>
                  </div>

                  {/* Teaching Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-foreground/70 flex items-center gap-2"><Calendar size={14} />سنة بداية التدريس</label>
                    <input type="number" min="1970" max={new Date().getFullYear()} className="input-smooth" value={form.teachingStartYear} onChange={e => setForm(f => ({ ...f, teachingStartYear: e.target.value }))} />
                  </div>
                </div>

                {/* Password Section */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2"><Lock size={18} className="text-primary" />تغيير كلمة المرور <span className="text-muted-foreground text-sm font-normal">(اختياري)</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground/60">كلمة المرور الحالية</label>
                      <input type="password" placeholder="••••••••" className="input-smooth" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground/60">كلمة المرور الجديدة</label>
                      <input type="password" placeholder="••••••••" className="input-smooth" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground/60">تأكيد كلمة المرور</label>
                      <input type="password" placeholder="••••••••" className="input-smooth" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button onClick={handleSave} disabled={saving} className="btn-smooth btn-smooth-primary flex items-center gap-3 !px-8 !py-4 !text-lg shadow-xl">
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                    {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Display (View Mode) */}
        {!editMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bubbly-card !p-8">
            <h2 className="text-2xl font-black mb-6">معلوماتي الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: User, label: 'الاسم الكامل', value: user?.fullName ?? '—' },
                { icon: Mail, label: 'البريد الإلكتروني', value: user?.email ?? '—' },
                { icon: Award, label: 'الجنس', value: isFemale ? 'أنثى' : 'ذكر' },
                { icon: Calendar, label: 'سنة بداية التدريس', value: user?.teachingStartYear ? `${user.teachingStartYear} (${experienceYears} سنوات)` : '—' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border group hover:border-primary transition-all">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="font-bold text-lg mt-0.5">{item.value}</p>
                  </div>
                  <ChevronRight size={16} className="mr-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
