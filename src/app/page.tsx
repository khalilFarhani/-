'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (user) setIsLoggedIn(true);
  }, []);

  const navItems = [
    { name: 'الكتيب', href: '/booklet' },
    { name: 'الكويزات', href: '/quizzes' },
    { name: 'التشخيص', href: '/diagnostic' },
    { name: 'المنتدى', href: '/forum' },
    { name: 'اليوميات', href: '/reflections' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full selection:bg-primary/30" dir="rtl">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full px-4 py-2 flex justify-center animate-soft">
        <div className="w-full max-w-[1440px] smooth-glass px-6 py-3 flex justify-between items-center rounded-2xl mt-4">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm">✨</span>
            قيم <span className="text-gradient">وتعلم</span>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            {isLoggedIn && navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-bold opacity-70 hover:opacity-100 hover:text-primary transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}

            <div className="h-8 w-px bg-border mx-2" />
            <ThemeToggle />

            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-smooth btn-smooth-primary py-2 px-6">لوحة القيادة</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">دخول</Link>
                <Link href="/register" className="btn-smooth btn-smooth-primary py-2 px-6">ابدأ مجاناً</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full flex justify-center pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-[1440px] grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="animate-soft">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-inner">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              منصة تربوية شاملة برؤية جديدة
            </div>

            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              تعلم برؤية <br />
              <span className="text-gradient">عادلة وشاملة</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-xl font-medium leading-relaxed">
              اكتشف كيف تشكل التصورات الجندرية تجربة التعلم وكيف يمكنك تطوير مهاراتك لبناء فضاء مدرسي يحترم تنوع الجميع.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-smooth btn-smooth-primary !px-12 !py-5 text-xl">
                  متابعة رحلتك 🚀
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-smooth btn-smooth-primary !px-12 !py-5 text-xl">
                    ابدأ رحلتك الآن
                  </Link>
                  <Link href="/login" className="btn-smooth btn-smooth-outline !px-12 !py-5 text-xl group">
                    تسجيل الدخول
                    <span className="group-hover:-translate-x-2 transition-transform inline-block mr-2">←</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative animate-soft delay-200">
            <div className="w-full aspect-square bg-card/40 backdrop-blur-3xl rounded-[3rem] border border-card-border flex items-center justify-center relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                <div className="grid grid-cols-2 gap-6 w-full h-full">
                  <div className="bg-primary/20 rounded-3xl p-6 flex flex-col justify-end transform transition-transform group-hover:-translate-y-4 duration-500">
                    <span className="text-5xl mb-4 block">🧠</span>
                    <h4 className="font-black text-lg">وعي متقدم</h4>
                  </div>
                  <div className="bg-secondary/20 rounded-3xl p-6 flex flex-col justify-end transform transition-transform group-hover:translate-y-4 duration-500 mt-12">
                    <span className="text-5xl mb-4 block">⚖️</span>
                    <h4 className="font-black text-lg">عدالة وإنصاف</h4>
                  </div>
                  <div className="bg-accent/20 rounded-3xl p-6 flex flex-col justify-end transform transition-transform group-hover:-translate-y-4 duration-500">
                    <span className="text-5xl mb-4 block">🌱</span>
                    <h4 className="font-black text-lg">نمو مستمر</h4>
                  </div>
                  <div className="bg-success/20 rounded-3xl p-6 flex flex-col justify-end transform transition-transform group-hover:translate-y-4 duration-500 mt-12">
                    <span className="text-5xl mb-4 block">🤝</span>
                    <h4 className="font-black text-lg">بيئة دامجة</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -right-8 top-20 bg-card backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">💡</div>
                <div>
                  <div className="text-xs font-bold opacity-60">التشخيص</div>
                  <div className="text-sm font-black">تحليل دقيق</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-32 bg-card backdrop-blur-xl border border-border p-4 rounded-2xl shadow-xl animate-[float_8s_ease-in-out_infinite_reverse]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-xl">🎯</div>
                <div>
                  <div className="text-xs font-bold opacity-60">الكويزات</div>
                  <div className="text-sm font-black">تحديات يومية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full flex justify-center py-32 px-6 relative">
        <div className="w-full max-w-[1440px]">
          <div className="text-center mb-24 animate-soft">
            <h2 className="text-5xl md:text-6xl font-black mb-6">اكتشف رحلتك التعليمية</h2>
            <p className="text-2xl opacity-60 max-w-3xl mx-auto font-medium">أدوات ذكية ومبتكرة صممت خصيصاً لمساعدتك على تطوير وعيك التربوي والجندري، بأسلوب عصري وتفاعلي.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'الكتيب الرقمي', desc: 'دليل شامل وتفاعلي يغطي أهم المفاهيم التربوية الحديثة بطريقة سلسة.', color: 'var(--secondary)', href: '/booklet', icon: '📖', delay: 'delay-100' },
              { title: 'كويزات ذكية', desc: 'تحديات واقعية لاختبار مهاراتك وتطبيق معرفتك في سيناريوهات صفية.', color: 'var(--primary)', href: '/quizzes', icon: '🧩', delay: 'delay-200' },
              { title: 'التشخيص المهني', desc: 'احصل على تحليل دقيق لمستوى ممارساتك التعليمية مع توصيات مخصصة.', color: 'var(--accent)', href: '/diagnostic', icon: '📊', delay: 'delay-300' }
            ].map((f) => (
              <Link key={f.title} href={isLoggedIn ? f.href : '/login'} className={`group block relative animate-soft ${f.delay}`}>
                <div className="bubbly-card h-full flex flex-col items-start border-t-4" style={{ borderTopColor: f.color }}>
                  <div className="text-6xl mb-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 drop-shadow-xl">{f.icon}</div>
                  <h3 className="text-3xl font-black mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-primary to-secondary transition-all">{f.title}</h3>
                  <p className="text-lg opacity-70 leading-relaxed font-medium">{f.desc}</p>
                  <div className="mt-8 text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100">
                    اكتشف المزيد <span>←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full flex justify-center py-16 px-6 mt-20 border-t border-border bg-card/50 backdrop-blur-3xl relative z-10">
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px]">✨</span>
            <div className="text-2xl font-black tracking-tight">قيم <span className="text-gradient">وتعلم</span></div>
          </div>
          <p className="text-sm font-bold opacity-50">© {new Date().getFullYear()} مشروع تخرج: رحمة علية & إسراء عروج.</p>
          <div className="flex gap-10">
            <Link href="#" className="text-sm font-black opacity-60 hover:opacity-100 hover:text-primary transition-all">تويتر</Link>
            <Link href="#" className="text-sm font-black opacity-60 hover:opacity-100 hover:text-secondary transition-all">لينكد إن</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
