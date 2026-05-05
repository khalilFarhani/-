'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { Scale, GraduationCap, Users, BookOpen, Menu, X, School, Venus, Mars } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user') || localStorage.getItem('currentUser');
      if (user) setIsLoggedIn(true);
    } catch (e) {}
  }, []);

  const navItems = [
    { name: 'الكتيب', href: '/booklet' },
    { name: 'الكويزات', href: '/quizzes' },
    { name: 'التشخيص', href: '/diagnostic' },
    { name: 'المنتدى', href: '/forum' },
    { name: 'اليوميات', href: '/reflections' }
  ];

  return (
    <div className="min-h-screen text-foreground flex flex-col items-center w-full selection:bg-primary/30 relative overflow-hidden" dir="rtl">

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full px-4 py-2 flex justify-center">
        <div className="w-full max-w-[1440px] smooth-glass px-6 py-3 flex justify-between items-center rounded-2xl mt-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <Scale size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground leading-none tracking-tight">قيم <span className="text-primary">وتعلم</span></span>
              <span className="text-[11px] font-bold text-muted-foreground tracking-widest mt-1">منصة الوعي الجندري</span>
            </div>
          </Link>

          {/* Desktop Nav */}
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
              <Link href="/dashboard" className="btn-smooth btn-smooth-primary py-2 px-6">تسجيل الدخول</Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="btn-smooth btn-smooth-primary py-2 px-6">تسجيل الدخول</Link>
                <Link href="/register" className="text-sm font-bold hover:text-primary transition-colors">ابدأ مجاناً</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onTouchEnd={(e) => { e.preventDefault(); setIsMobileMenuOpen(v => !v); }}
              style={{ minWidth: 44, minHeight: 44, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              className="text-foreground focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 smooth-glass rounded-2xl p-4 flex flex-col gap-4 shadow-2xl md:hidden animate-soft border border-border">
            {isLoggedIn && navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold opacity-80 hover:opacity-100 hover:text-primary transition-colors py-2 border-b border-border/50 last:border-0"
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="btn-smooth btn-smooth-primary py-3 px-6 text-center mt-2">تسجيل الدخول</Link>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-smooth btn-smooth-primary py-3 px-6 text-center">تسجيل الدخول</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-smooth btn-smooth-outline py-3 px-6 text-center">ابدأ مجاناً</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="w-full flex justify-center pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="w-full max-w-[1440px] flex flex-col items-center text-center relative z-10">
          <div className="animate-soft flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-inner">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              منصة تربوية شاملة برؤية جديدة
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black mb-8 leading-[1.2] md:leading-[1.1] tracking-tight relative">
              تعلم برؤية <br />
              <span className="text-gradient">عادلة وشاملة</span>
            </h1>

            <p className="text-xl md:text-2xl opacity-80 mb-12 max-w-3xl font-medium leading-relaxed">
              اكتشف كيف تشكل التصورات الجندرية تجربة التعلم وكيف يمكنك تطوير مهاراتك لبناء فضاء مدرسي يحترم تنوع الجميع.
            </p>

            <div className="flex flex-wrap gap-6 items-center justify-center">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-smooth btn-smooth-primary !px-12 !py-5 text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                  متابعة رحلتك 🚀
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn-smooth btn-smooth-primary !px-12 !py-5 text-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                    ابدأ رحلتك الآن
                  </Link>
                  <Link href="/login" className="btn-smooth btn-smooth-outline !px-12 !py-5 text-xl group hover:-translate-y-1 transition-all">
                    تسجيل الدخول
                    <span className="group-hover:-translate-x-2 transition-transform inline-block mr-2">←</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="w-full flex justify-center pb-24 px-6 relative z-20 -mt-16 md:-mt-8">
        <div className="w-full max-w-[1440px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="group relative bg-card/60 backdrop-blur-2xl border border-border rounded-[2rem] p-8 overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary/10 cursor-default animate-soft delay-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">🧠</div>
            <h4 className="font-black text-2xl mb-3 text-foreground group-hover:text-primary transition-colors">وعي متقدم</h4>
            <p className="text-base opacity-70 leading-relaxed font-medium">إدراك عميق للديناميكيات الجندرية وتأثيرها المباشر على البيئة التعليمية.</p>
          </div>

          <div className="group relative bg-card/60 backdrop-blur-2xl border border-border rounded-[2rem] p-8 overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-secondary/10 cursor-default animate-soft delay-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/10 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">⚖️</div>
            <h4 className="font-black text-2xl mb-3 text-foreground group-hover:text-secondary transition-colors">عدالة وإنصاف</h4>
            <p className="text-base opacity-70 leading-relaxed font-medium">تبني ممارسات بيداغوجية تضمن تكافؤ الفرص لجميع المتعلمين والمتعلمات.</p>
          </div>

          <div className="group relative bg-card/60 backdrop-blur-2xl border border-border rounded-[2rem] p-8 overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-accent/10 cursor-default animate-soft delay-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">🌱</div>
            <h4 className="font-black text-2xl mb-3 text-foreground group-hover:text-accent transition-colors">نمو مستمر</h4>
            <p className="text-base opacity-70 leading-relaxed font-medium">تطوير مستدام للمهارات والأساليب التربوية لمواكبة التغيرات المجتمعية.</p>
          </div>

          <div className="group relative bg-card/60 backdrop-blur-2xl border border-border rounded-[2rem] p-8 overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-success/10 cursor-default animate-soft delay-400">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/10 flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">🤝</div>
            <h4 className="font-black text-2xl mb-3 text-foreground group-hover:text-success transition-colors">بيئة دامجة</h4>
            <p className="text-base opacity-70 leading-relaxed font-medium">بناء فضاء مدرسي يحترم ويقدر التنوع ويوفر الأمان النفسي للجميع.</p>
          </div>

        </div>
      </section>

      {/* Context Section */}
      <section className="w-full flex justify-center py-24 px-6 relative bg-gradient-to-b from-transparent to-primary/5">
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 animate-soft">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-black uppercase tracking-widest mb-2 shadow-inner">
              سياق المشروع
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              لماذا منصة <span className="text-gradient">قيم وتعلّم</span>؟
            </h2>
            <div className="space-y-6 text-xl opacity-80 leading-relaxed font-medium">
              <p>
                تأتي منصة <strong>"قيم وتعلّم"</strong> كاستجابة للحاجة الماسة إلى تعزيز الوعي الجندري في الممارسات التربوية. من خلال أدوات تفاعلية وتقييمية، نهدف إلى مساعدة الفاعلين التربويين على تطوير أساليبهم التعليمية لتكون أكثر شمولية وعدالة.
              </p>
              <p>
                هذا المشروع هو ثمرة عمل دؤوب (مشروع تخرج) يهدف إلى إحداث تأثير إيجابي في البيئة المدرسية، عبر دمج التكنولوجيا المتقدمة بالمعرفة البيداغوجية المتخصصة لتفكيك الصور النمطية وبناء فضاء مدرسي يحترم تنوع الجميع.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full relative animate-soft delay-200">
            <div className="aspect-video w-full rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border shadow-2xl p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
               <span className="text-8xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">🏫</span>
               <h3 className="text-3xl font-black relative z-10 mb-4">نحو بيئة مدرسية دامجة</h3>
               <p className="text-lg opacity-70 relative z-10 max-w-sm">
                 تمكين المعلمين والمعلمات من بناء فضاءات تعلم خالية من النمطية، حيث يحظى كل متعلم بفرص متكافئة للنجاح والتألق.
               </p>
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
      {/* How it Works Section */}
      <section className="w-full flex justify-center py-32 px-6 relative bg-background">
        <div className="w-full max-w-[1440px]">
          <div className="text-center mb-20 animate-soft">
            <h2 className="text-4xl md:text-5xl font-black mb-4">كيف تبدأ <span className="text-gradient">رحلتك؟</span></h2>
            <p className="text-xl opacity-60 font-medium">خطوات بسيطة لتطوير ممارساتك التربوية</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 relative animate-soft delay-100">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
            
            {[
              { step: '1', title: 'إنشاء حساب', desc: 'سجل مجاناً وانضم لمجتمعنا التربوي.', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
              { step: '2', title: 'إجراء التشخيص', desc: 'قيم مستوى وعيك الجندري الحالي بصدق.', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
              { step: '3', title: 'التعلم والتطور', desc: 'تفاعل مع الكتيب والكويزات بانتظام.', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center max-w-xs group w-full">
                <div className={`w-20 h-20 rounded-full ${item.bg} ${item.color} border-4 border-background flex items-center justify-center text-3xl font-black mb-6 shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 ring-2 ring-offset-4 ring-offset-background ${item.border}`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="opacity-70 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full flex justify-center py-24 px-6 relative bg-gradient-to-t from-primary/5 to-transparent border-t border-border/50">
        <div className="w-full max-w-[1440px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: '+100', label: 'مستخدم مسجل', icon: '👥' },
              { number: '+50', label: 'مورد تعليمي', icon: '📚' },
              { number: '100%', label: 'توافق تربوي', icon: '✨' },
              { number: '+20', label: 'تحدي تفاعلي', icon: '🎯' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-card/40 backdrop-blur-md rounded-3xl border border-border shadow-lg hover:-translate-y-2 hover:bg-card/80 transition-all duration-300 group">
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</span>
                <span className="text-4xl md:text-5xl font-black text-gradient mb-2">{stat.number}</span>
                <span className="text-sm md:text-base font-bold opacity-70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="w-full flex justify-center py-24 px-6 relative overflow-hidden bg-background">
        <div className="w-full max-w-[1440px]">
          <div className="text-center mb-16 animate-soft">
            <h2 className="text-4xl md:text-5xl font-black mb-4">أصوات <span className="text-gradient">من الميدان</span></h2>
            <p className="text-xl opacity-60 font-medium">تجارب حقيقية لمعلمين ومعلمات استخدموا منصتنا</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'أ. فاطمة أحمد', role: 'معلمة مرحلة ابتدائية', text: 'المنصة غيرت نظرتي للتعامل مع طلابي. الكويزات اليومية جعلتني أدرك تحيزات لم أكن منتبهة لها من قبل.', rating: 5, color: 'text-primary' },
              { name: 'أ. محمد العبدالله', role: 'مدير مدرسة', text: 'أداة التشخيص المهني ساعدتنا كثيراً في وضع خطط تدريبية للهيئة التعليمية. مشروع جبار يستحق الدعم.', rating: 5, color: 'text-secondary' },
              { name: 'أ. سارة خالد', role: 'مشرفة تربوية', text: 'الكتيب الرقمي شامل ومصمم بطريقة عصرية جذابة. أستخدمه كمرجع أساسي في ورش العمل التي أقدمها.', rating: 4, color: 'text-accent' }
            ].map((t, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-lg hover:-translate-y-3 transition-all duration-300 relative group">
                <div className={`absolute top-6 right-6 text-7xl opacity-10 font-serif ${t.color}`}>"</div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < t.rating ? 'text-yellow-400' : 'text-gray-400 opacity-30'}>★</span>
                  ))}
                </div>
                <p className="text-lg opacity-80 leading-relaxed font-medium mb-10 relative z-10 min-h-[100px]">{t.text}</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-card to-background border-2 border-border flex items-center justify-center text-xl font-bold ${t.color} shadow-inner`}>
                    {t.name.charAt(3)}
                  </div>
                  <div>
                    <h5 className="font-black text-sm">{t.name}</h5>
                    <span className="text-xs opacity-60">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full flex justify-center py-24 px-6 relative bg-card/20 border-y border-border/50">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-16 animate-soft">
            <h2 className="text-4xl md:text-5xl font-black mb-4">الأسئلة <span className="text-gradient">الشائعة</span></h2>
            <p className="text-xl opacity-60 font-medium">كل ما تحتاج معرفته عن منصة قيم وتعلّم</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'هل منصة "قيم وتعلّم" مجانية بالكامل؟', a: 'نعم، المنصة متاحة مجاناً لجميع الفاعلين التربويين والمهتمين بتطوير البيئة المدرسية، إيماناً منا بحق الجميع في الوصول للمعرفة.' },
              { q: 'كيف أستفيد من أداة التشخيص المهني؟', a: 'يقدم لك التشخيص استبياناً علمياً مبنياً على مواقف صفية واقعية. بعد الإجابة، ستحصل على تحليل مفصل لممارساتك مع توصيات مخصصة للتحسين.' },
              { q: 'هل يمكنني التفاعل مع معلمين آخرين؟', a: 'بالتأكيد! المنصة تضم منتدى تفاعلياً يتيح لك طرح الأسئلة، مشاركة تجاربك، والنقاش مع مجتمع من التربويين لتبادل الخبرات.' },
              { q: 'ما هو الهدف الأساسي من هذا المشروع؟', a: 'يهدف المشروع (وهو مشروع تخرج) إلى كسر القوالب النمطية الجندرية في التعليم وتوفير بيئة دامجة وعادلة، من خلال أدوات رقمية تفاعلية.' }
            ].map((faq, i) => (
              <details key={i} className="group bg-card/60 backdrop-blur-md border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg hover:bg-primary/5 transition-colors select-none">
                  {faq.q}
                  <span className="transition duration-300 group-open:-rotate-180 bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary text-sm shadow-inner">▼</span>
                </summary>
                <div className="p-6 pt-0 opacity-80 leading-relaxed font-medium text-base border-t border-border/30 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="w-full flex justify-center py-16 px-6 mt-20 border-t border-border bg-card/50 backdrop-blur-3xl relative z-10">
        <div className="w-full max-w-[1440px] flex justify-center items-center">
          <p className="text-sm font-bold opacity-50 text-center">© 2026 مشروع تخرج: إسراء عروج & رحمة علية.</p>
        </div>
      </footer>
    </div>
  );
}
