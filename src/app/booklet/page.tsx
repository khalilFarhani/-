'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const bookletPages = [
  {
    type: 'cover',
    title: "كتيب التوعية بالنوع في التعليم",
    subtitle: "مفهوم النوع الاجتماعي والفرق بين الجنس والنوع الاجتماعي",
    authors: "رحمة علية وإسراء عروج",
    school: "المعهد العالي للدراسات التطبيقية في الإنسانيات بزغوان",
    date: "2025/20/6",
    bg: "var(--primary)"
  },
  {
    type: 'content',
    title: "مفهوم النوع الاجتماعي",
    sections: [
      {
        heading: "تعريف النوع الاجتماعي (الجندر):",
        text: "\"النوع الاجتماعي هو بناء اجتماعي وثقافي يشير إلى الأدوار والصفات والسلوكيات التي يحددها المجتمع لكل جنس، ويختلف باختلاف المجتمعات والعصور.\""
      },
      {
        heading: "الفرق بين الجنس والنوع الاجتماعي:",
        table: {
          headers: ["الجنس (Sex)", "النوع الاجتماعي (Gender)"],
          rows: [
            ["بيولوجي (خلقي)", "اجتماعي وثقافي (مكتسب)"],
            ["ثابت لا يتغير", "متغير باختلاف المجتمعات"],
            ["ذكر / أنثى", "ذكورة / أنوثة"]
          ]
        }
      },
      {
        heading: "مثال توضيحي:",
        items: [
          "المرأة تلد وترضع (جنس بيولوجي)",
          "المجتمع يتوقع من المرأة أن تكون حنونة ومهتمة بالمنزل (نوع اجتماعي)"
        ]
      }
    ]
  },
  {
    type: 'content',
    title: "كيف تتشكل التصورات الجندرية؟",
    sections: [
      {
        heading: "مؤسسات التنشئة الاجتماعية:",
        grid: [
          { title: "الأسرة", desc: "الألعاب، الألوان، توزيع المهام", icon: "🏠" },
          { title: "المدرسة", desc: "الكتب المدرسية، تفاعلات المعلمين، توزيع الأدوار", icon: "🏫" },
          { title: "الإعلام", desc: "الإعلانات، الأفلام، المسلسلات", icon: "📺" },
          { title: "الأقران", desc: "ضغط المجموعة والتوقعات الاجتماعية", icon: "👫" }
        ]
      },
      {
        heading: "النتيجة:",
        highlight: "تصبح التصورات الجندرية \"طبيعية\" و\"بديهية\" في وعينا، حتى وإن كانت مكتسبة وليست فطرية."
      }
    ]
  },
  {
    type: 'content',
    title: "تجليات النوع الاجتماعي داخل الفصل",
    sections: [
      {
        heading: "أين يظهر النوع الاجتماعي في ممارساتنا الصفية؟",
        table: {
          headers: ["المجال", "تجليات النوع الاجتماعي"],
          rows: [
            ["إدارة الصف", "توزيع المهام (تنظيمي للبنات / حركي للبنين)"],
            ["التفاعل", "توزيع الأسئلة، وقت الانتظار، المقاطعات"],
            ["اللغة", "لغة عاطفية مع البنات، لغة حازمة مع البنين"],
            ["التوقعات", "توقع تفوق البنات في اللغة والبنين في الرياضيات"],
            ["العلاقات", "معاملة البنات بحساسية زائدة، وتجاهل مشاعر البنين"]
          ]
        }
      }
    ]
  },
  {
    type: 'content',
    title: "أثر التصورات الجندرية على التلميذ",
    sections: [
      {
        table: {
          headers: ["التأثير", "التوضيح"],
          rows: [
            ["على الثقة بالنفس", "التلميذ الذي يتلقى رسائل نمطية قد يشك في قدراته"],
            ["على التحصيل الدراسي", "التوقعات المنخفضة قد تؤدي إلى أداء منخفض (النبوءة ذاتية التحقق)"],
            ["على الطموحات المهنية", "تتشكل التصورات الأولى عن المهن \"المناسبة\" لكل جنس"],
            ["على العلاقات الاجتماعية", "يتعلم الطفل أنماطاً نمطية في التعامل بين الجنسين"]
          ]
        }
      },
      {
        heading: "مثال:",
        highlight: "تلميذة ممتازة في الرياضيات قد تتراجع إذا تلقت رسائل بأن \"الرياضيات للبنين\"."
      }
    ]
  },
  {
    type: 'content',
    title: "حقائق تربوية وجندرية",
    sections: [
      {
        heading: "هل تعلم؟",
        grid: [
          { title: "القدرات العقلية", desc: "لا توجد فروق بيولوجية في القدرة على تعلم الرياضيات أو اللغات بين الجنسين.", icon: "🧠" },
          { title: "الألوان والألعاب", desc: "تصنيف الألوان (وردي/أزرق) هو اختيار اجتماعي حديث وليس فطرياً.", icon: "🎨" },
          { title: "التعبير عن المشاعر", desc: "تشجيع الأولاد على البكاء والتعبير يقلل من السلوك العدواني مستقبلاً.", icon: "❤️" },
          { title: "القدوة التعليمية", desc: "وجود معلمين ومعلمات يكسرون الصور النمطية يحفز التلاميذ على الإبداع.", icon: "🌟" }
        ]
      }
    ]
  },
  {
    type: 'content',
    title: "ممارسات عادلة داخل الفصل",
    sections: [
      {
        heading: "إدارة الصف والتفاعل:",
        items: [
          "وزع المهام بالتساوي بين البنين والبنات",
          "لا تفصل بين الجنسين في الجلوس",
          "استخدم أسلوباً مرناً مع الجميع",
          "وزع الأسئلة بالتساوي وأعط وقتاً متساوياً للإجابة"
        ]
      },
      {
        heading: "اللغة والتوقعات:",
        items: [
          "استخدم لغة عاطفية مع الجميع (تشجيع، مدح)",
          "تجنب العبارات النمطية (\"كن رجلاً\"، \"هذا لا يليق ببنت\")",
          "لا تفترض أن البنات أفضل في اللغة أو البنين أفضل في الرياضيات"
        ]
      },
      {
        heading: "الجانب العاطفي:",
        items: [
          "احتضن بكاء الجميع دون تمييز",
          "اظهر تعاطفاً مع الجميع"
        ]
      }
    ],
    cta: { text: "انتقل إلى الكويزات", href: "/quizzes" }
  }
];

export default function BookletPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const hasTracked = useRef(false); // Guard against StrictMode double-fire

  // Record this visit in the database (only once per page load)
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackVisit = async () => {
      try {
        const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const userId = user.id || user.userId;
        if (!userId) return;
        await fetch(`/api/booklet-visit?userId=${userId}`, { method: 'POST' });
      } catch (e) {
        console.error('Could not track booklet visit', e);
      }
    };
    trackVisit();
  }, []);

  const nextPage = () => {
    if (currentPage < bookletPages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const page = bookletPages[currentPage];

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden selection:bg-primary/30" dir="rtl">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col gap-6 relative z-10">
        {/* Navigation Info */}
        <div className="flex justify-between items-center px-4 animate-soft">
          <Link href="/dashboard" className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg group">
            العودة للوحة القيادة
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
          </Link>
          <div className="px-4 py-1.5 rounded-full bg-card border border-border shadow-lg text-xs font-black text-primary flex items-center gap-2">
             <span className="opacity-50 text-foreground">التقدم:</span>
             <span>{currentPage + 1} / {bookletPages.length}</span>
          </div>
        </div>

        {/* Booklet Card */}
        <div className="bubbly-card min-h-[500px] flex flex-col relative overflow-hidden animate-soft shadow-xl !p-0 border-2">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-muted z-30">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 ease-out"
              style={{ width: `${((currentPage + 1) / bookletPages.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col">
            {page.type === 'cover' ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center relative py-12">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                   <div className="grid grid-cols-4 gap-12 w-full h-full p-10">
                      {[..."♀️♂️⚧️👦👧🏫📚✏️🎨🌟"].map((emoji, i) => (
                         <div key={i} className="text-8xl opacity-30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>{emoji}</div>
                      ))}
                   </div>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest mb-2">الدليل المعرفي الشامل</div>
                  <h1 className="text-4xl md:text-5xl font-black leading-tight">
                    <span className="text-gradient">كتيب التوعية</span> <br/>
                    بالممارسات الجندرية
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground font-black max-w-2xl mx-auto leading-relaxed">{page.subtitle}</p>
                  
                  <div className="pt-8 space-y-2">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">إعداد وتطوير</p>
                     <p className="text-2xl md:text-3xl font-black text-gradient">{page.authors}</p>
                  </div>

                  <div className="pt-12 flex flex-col items-center gap-3">
                     <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                     <p className="text-lg font-black text-foreground/70">{page.school}</p>
                     <p className="text-base font-bold text-primary/50 uppercase tracking-widest">{page.date}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-soft">
                <div className="flex items-center justify-between border-b border-border/50 pb-8">
                   <h2 className="text-4xl font-black text-gradient">{page.title}</h2>
                   <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-xl flex items-center justify-center text-4xl">📖</div>
                </div>

                <div className="space-y-12">
                  {page.sections?.map((section: any, idx: number) => (
                    <div key={idx} className="space-y-6">
                      {section.heading && (
                        <h3 className="text-2xl font-black text-foreground flex items-center gap-4">
                          <span className="w-4 h-10 rounded-xl bg-gradient-to-b from-primary to-secondary shadow-lg shadow-primary/20" />
                          {section.heading}
                        </h3>
                      )}

                      {section.text && (
                        <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] text-xl leading-relaxed font-bold shadow-inner relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl group-hover:opacity-10 transition-opacity">“</div>
                          {section.text}
                        </div>
                      )}

                      {section.items && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-2">
                          {section.items.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                              <span className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✓</span>
                              <span className="text-lg font-bold">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.table && (
                        <div className="overflow-hidden rounded-[2rem] border-2 border-border shadow-2xl">
                          <table className="w-full text-right border-collapse">
                            <thead>
                              <tr className="bg-muted/50 backdrop-blur-xl">
                                {section.table.headers.map((h: string, i: number) => (
                                  <th key={i} className="p-6 font-black text-xl text-foreground border-l border-border/50">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.table.rows.map((row: string[], i: number) => (
                                <tr key={i} className="border-t border-border/30 hover:bg-card/50 transition-colors">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-6 text-lg font-bold border-l border-border/20">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.grid && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {section.grid.map((item: any, i: number) => (
                            <div key={i} className="bubbly-card !p-8 group hover:!border-primary transition-all">
                              <div className="text-5xl mb-6 transform group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-500">{item.icon}</div>
                              <h4 className="text-2xl font-black mb-3">{item.title}</h4>
                              <p className="text-lg font-bold opacity-70 leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.highlight && (
                        <div className="bg-gradient-to-br from-accent/20 to-transparent border-2 border-accent/30 p-10 rounded-[2.5rem] text-center shadow-xl relative overflow-hidden group">
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                          <p className="text-2xl font-black text-accent relative z-10 leading-relaxed">{section.highlight}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {page.cta && (
                  <div className="pt-12 flex justify-center animate-bounce">
                    <Link href={page.cta.href} className="btn-smooth btn-smooth-primary !px-16 !py-6 text-2xl shadow-2xl">
                      {page.cta.text} 🚀
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-8 bg-card/50 backdrop-blur-2xl flex justify-between items-center border-t border-border/50">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`btn-smooth !py-4 !px-8 text-lg ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'btn-smooth-outline'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-3"><path d="m9 18 6-6-6-6" /></svg>
              السابق
            </button>
            
            <div className="hidden md:flex gap-2">
               {bookletPages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-500 ${i === currentPage ? 'w-12 bg-primary' : 'w-2 bg-muted'}`} 
                  />
               ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === bookletPages.length - 1}
              className={`btn-smooth !py-4 !px-8 text-lg ${currentPage === bookletPages.length - 1 ? 'opacity-0 pointer-events-none' : 'btn-smooth-primary shadow-xl'}`}
            >
              التالي
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
