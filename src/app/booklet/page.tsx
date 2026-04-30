'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Scale, GraduationCap, Users, BookOpen, Brain, School, Sparkles, Bookmark, ArrowRight, ArrowLeft, Venus, Mars } from 'lucide-react';

const bookletPages = [
  {
    type: 'cover',
    title: "كتيب التوعية بالنوع في التعليم",
    subtitle: "مفهوم النوع الاجتماعي والفرق بين الجنس والنوع الاجتماعي",
    authors: "رحمة علية وإسراء عروج",
    school: "المعهد العالي للدراسات التطبيقية في الإنسانيات بزغوان",
    date: "2025/20/6",
    iconType: 'book'
  },
  {
    type: 'content',
    title: "مفهوم النوع الاجتماعي",
    iconType: 'users',
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
    iconType: 'brain',
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
    iconType: 'school',
    sections: [
      {
        heading: "أين يظهر النوع الاجتماعي في ممارساتنا الصفية؟",
        table: {
          headers: ["المجال", "تجليات النوع الاجتماعي"],
          rows: [
            ["إدارة الصف", "توزيع المهام (تنظيمي للإناث / حركي للذكور)"],
            ["التفاعل", "توزيع الأسئلة، وقت الانتظار، المقاطعات"],
            ["اللغة", "لغة عاطفية مع الإناث، لغة حازمة مع الذكور"],
            ["التوقعات", "توقع تفوق الإناث في اللغة والذكور في الرياضيات"],
            ["العلاقات", "معاملة الإناث بحساسية زائدة، وتجاهل مشاعر الذكور"]
          ]
        }
      }
    ]
  },
  {
    type: 'content',
    title: "أثر التصورات الجندرية على التلميذ",
    iconType: 'scale',
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
        highlight: "تلميذة ممتازة في الرياضيات قد تتراجع إذا تلقت رسائل بأن \"الرياضيات للذكور\"."
      }
    ]
  },
  {
    type: 'content',
    title: "حقائق تربوية وجندرية",
    iconType: 'sparkles',
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
    iconType: 'cap',
    sections: [
      {
        heading: "إدارة الصف والتفاعل:",
        items: [
          "وزع المهام بالتساوي بين الذكور والإناث",
          "لا تفصل بين الجنسين في الجلوس",
          "استخدم أسلوباً مرناً مع الجميع",
          "وزع الأسئلة بالتساوي وأعط وقتاً متساوياً للإجابة"
        ]
      },
      {
        heading: "اللغة والتوقعات:",
        items: [
          "استخدم لغة عاطفية مع الجميع (تشجيع، مدح)",
          "تجنب العبارات النمطية (\"كن رجلاً\"، \"هذا لا يليق بأنثى\")",
          "لا تفترض أن الإناث أفضل في اللغة أو الذكور أفضل في الرياضيات"
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

const renderIcon = (type: string, size = 24) => {
  switch (type) {
    case 'book': return <BookOpen size={size} />;
    case 'users': return <Users size={size} />;
    case 'brain': return <Brain size={size} />;
    case 'school': return <School size={size} />;
    case 'scale': return <Scale size={size} />;
    case 'sparkles': return <Sparkles size={size} />;
    case 'cap': return <GraduationCap size={size} />;
    default: return <BookOpen size={size} />;
  }
};

export default function BookletPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const hasTracked = useRef(false);

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
    if (currentPage < bookletPages.length - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const page = bookletPages[currentPage];

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center text-foreground relative overflow-hidden" dir="rtl">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />
      


      {/* Header Actions */}
      <div className="w-full max-w-[950px] flex justify-between items-center mb-8 relative z-20">
        <Link href="/dashboard" className="btn-smooth btn-smooth-outline !px-6 !py-2 !text-sm flex items-center gap-2 bg-card/80 backdrop-blur-md shadow-lg border-border">
          <ArrowRight size={16} />
          العودة للوحة القيادة
        </Link>
        <div className="px-5 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg font-black text-primary flex items-center gap-2">
          <span className="opacity-50 text-foreground">صفحة</span>
          <span>{currentPage + 1} / {bookletPages.length}</span>
        </div>
      </div>

      {/* Realistic Book Container */}
      <div className="relative w-full max-w-[950px] flex perspective-[2500px] mb-10 drop-shadow-2xl z-10 animate-soft">

        {/* Underlying pages to give thickness (Right Side) */}
        <div className="absolute inset-y-1 -right-1 w-1/2 bg-[#d1c6b4] rounded-r-3xl z-[-2] border border-[#a89f8f]"></div>
        <div className="absolute inset-y-2 -right-2 w-1/2 bg-[#e0d6c4] rounded-r-3xl z-[-3] border border-[#a89f8f]"></div>

        {/* Underlying pages to give thickness (Left Side) */}
        <div className="hidden md:block absolute inset-y-1 -left-1 w-1/2 bg-[#d1c6b4] rounded-l-3xl z-[-2] border border-[#a89f8f]"></div>
        <div className="hidden md:block absolute inset-y-2 -left-2 w-1/2 bg-[#e0d6c4] rounded-l-3xl z-[-3] border border-[#a89f8f]"></div>

        {/* Right Page (Main Content) */}
        <div className="w-full md:w-1/2 bg-[#fdfbf7] rounded-3xl md:rounded-l-none md:rounded-r-3xl relative z-10 shadow-[-15px_0_30px_rgba(0,0,0,0.1)_inset] border border-[#e5d9c5]">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply rounded-r-3xl pointer-events-none"></div>

          {/* Inner shadow for spine */}
          <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>

          {/* Content Container */}
          <div className="p-8 md:p-10 relative z-20 h-[600px] overflow-y-auto book-scrollbar flex flex-col">

            {page.type === 'cover' ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center relative py-8">
                {/* Decorative watermark */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <Scale size={350} className="text-[#8b2c3e]" />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-block px-6 py-2 rounded-full border-2 border-[#8b2c3e] text-[#8b2c3e] font-black text-sm uppercase tracking-widest mb-4">كتاب إرشادي</div>
                  <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#1a252f]">
                    كتيب التوعية <br />
                    <span className="text-[#8b2c3e]">بالنوع في التعليم</span>
                  </h1>
                  <div className="w-20 h-1 bg-[#8b2c3e] mx-auto rounded-full my-6" />
                  <p className="text-lg md:text-xl font-bold max-w-sm mx-auto leading-relaxed text-[#4a5f73]">{page.subtitle}</p>

                  <div className="pt-10 space-y-2">
                    <p className="text-xs font-black text-[#8b2c3e] uppercase tracking-[0.2em]">تأليف وإعداد</p>
                    <p className="text-2xl font-black text-[#1a252f]">{page.authors}</p>
                  </div>

                  <div className="pt-8 flex flex-col items-center gap-2">
                    <p className="text-base font-bold text-[#4a5f73]">{page.school}</p>
                    <p className="text-xs font-bold text-[#8b2c3e]/60">{page.date}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in relative z-10">
                {/* Chapter Header */}
                <div className="flex items-center justify-between border-b-2 border-[#e5d9c5] pb-5">
                  <h2 className="text-2xl md:text-3xl font-black text-[#1a252f] leading-tight">{page.title}</h2>
                  <div className="w-14 h-14 rounded-full bg-[#f4ebd8] text-[#8b2c3e] flex items-center justify-center shadow-inner flex-shrink-0">
                    {renderIcon(page.iconType || 'book', 28)}
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-10 pb-20">
                  {page.sections?.map((section: any, idx: number) => (
                    <div key={idx} className="space-y-5">
                      {section.heading && (
                        <h3 className="text-xl font-black text-[#2c3e50] flex items-center gap-3">
                          <span className="w-2 h-6 rounded-full bg-[#8b2c3e]" />
                          {section.heading}
                        </h3>
                      )}

                      {section.text && (
                        <div className="bg-[#f4ebd8] border-r-4 border-[#8b2c3e] p-5 rounded-l-xl text-lg leading-relaxed font-bold text-[#34495e] relative">
                          <div className="absolute top-2 left-4 text-5xl text-[#8b2c3e] opacity-10">"</div>
                          {section.text}
                        </div>
                      )}

                      {section.items && (
                        <ul className="space-y-3 pr-2">
                          {section.items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 p-3 hover:bg-[#f4ebd8]/50 rounded-xl transition-colors">
                              <span className="w-6 h-6 rounded-full bg-[#8b2c3e]/10 text-[#8b2c3e] flex items-center justify-center font-bold shrink-0 mt-0.5 text-sm">✓</span>
                              <span className="text-base font-bold text-[#34495e]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.table && (
                        <div className="overflow-hidden rounded-xl border-2 border-[#e5d9c5]">
                          <table className="w-full text-right border-collapse bg-white/50">
                            <thead>
                              <tr className="bg-[#f4ebd8]">
                                {section.table.headers.map((h: string, i: number) => (
                                  <th key={i} className="p-3 font-black text-base text-[#1a252f] border-l border-[#e5d9c5] last:border-l-0">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.table.rows.map((row: string[], i: number) => (
                                <tr key={i} className="border-t border-[#e5d9c5]">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-3 text-base font-bold text-[#34495e] border-l border-[#e5d9c5] last:border-l-0">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.grid && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {section.grid.map((item: any, i: number) => (
                            <div key={i} className="bg-white/60 border border-[#e5d9c5] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                              <div className="text-3xl mb-3">{item.icon}</div>
                              <h4 className="text-lg font-black text-[#1a252f] mb-2">{item.title}</h4>
                              <p className="text-sm font-bold text-[#4a5f73] leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.highlight && (
                        <div className="bg-[#1a252f] text-white p-6 rounded-2xl text-center shadow-xl relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                          <p className="text-xl font-black relative z-10 leading-relaxed text-[#fdfbf7]">{section.highlight}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Call to Action at the end */}
                {page.cta && (
                  <div className="pt-8 pb-20 flex justify-center">
                    <Link href={page.cta.href} className="px-10 py-4 bg-[#8b2c3e] text-white rounded-full font-black text-xl shadow-[0_10px_20px_rgba(139,44,62,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(139,44,62,0.4)] transition-all flex items-center gap-3">
                      {page.cta.text}
                      <ArrowLeft size={20} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Book Pagination Controls - Inside the right page at the bottom */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7] to-transparent flex justify-between items-center rounded-b-3xl border-t border-[#e5d9c5]/50 z-30">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${currentPage === 0 ? 'opacity-30 pointer-events-none' : 'bg-[#e5d9c5] text-[#2c3e50] hover:bg-[#d1c6b4]'}`}
            >
              <ArrowRight size={16} />
              الصفحة السابقة
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === bookletPages.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${currentPage === bookletPages.length - 1 ? 'opacity-30 pointer-events-none' : 'bg-[#8b2c3e] text-white shadow-lg hover:bg-[#6b2230]'}`}
            >
              الصفحة التالية
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>

        {/* Spine / Book Binding in the middle */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 bg-gradient-to-r from-[#b3a48f] via-[#dcd2c0] to-[#b3a48f] z-30 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] rounded-full border-x border-[#8a7f6f]">
          {/* Binding stitches */}
          <div className="absolute top-12 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute top-16 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>

          <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute top-[calc(50%+12px)] -translate-y-1/2 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>

          <div className="absolute bottom-16 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>
          <div className="absolute bottom-12 inset-x-2 border-b-[3px] border-[#4a3f32] opacity-40 shadow-[0_1px_1px_rgba(255,255,255,0.5)]"></div>
        </div>

        {/* Left Page (Table of Contents) */}
        <div className="hidden md:flex w-1/2 bg-[#fdfbf7] rounded-l-3xl relative z-10 shadow-[15px_0_30px_rgba(0,0,0,0.1)_inset] border border-[#e5d9c5]">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply rounded-l-3xl pointer-events-none"></div>

          {/* Inner shadow for spine */}
          <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-black/10 to-transparent pointer-events-none"></div>

          {/* Ribbon Bookmark */}
          <div className="absolute top-0 left-12 w-10 h-32 bg-[#8b2c3e] shadow-[0_10px_10px_rgba(0,0,0,0.3)] rounded-b-sm z-40 transition-all duration-500 hover:h-40 cursor-pointer" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}></div>

          {/* Index Content */}
          <div className="p-10 pl-20 relative z-20 w-full flex flex-col text-[#2c3e50] h-[600px] overflow-y-auto book-scrollbar">
            <h2 className="text-3xl font-black mb-8 border-b-2 border-[#e5d9c5] pb-4 flex items-center gap-3">
              <Bookmark size={28} className="text-[#8b2c3e]" />
              فهرس الفصول
            </h2>

            <div className="flex flex-col gap-2">
              {bookletPages.map((p, i) => (
                <button
                  onClick={() => setCurrentPage(i)}
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all border-2 ${currentPage === i ? 'bg-[#f4ebd8] border-[#8b2c3e] shadow-md scale-[1.02]' : 'border-transparent hover:bg-[#f4ebd8]/50 hover:border-[#e5d9c5]'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition-colors ${currentPage === i ? 'bg-[#8b2c3e] shadow-md' : 'bg-[#4a5f73]'}`}>
                      {renderIcon(p.iconType || 'book', 18)}
                    </span>
                    <span className={`text-lg text-right ${currentPage === i ? 'font-black text-[#8b2c3e]' : 'font-bold text-[#34495e]'}`}>
                      {p.title}
                    </span>
                  </div>
                  <span className={`text-base font-black shrink-0 ${currentPage === i ? 'text-[#8b2c3e]' : 'text-[#a89f8f]'}`}>
                    0{i + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Decorative Book Info at bottom */}
            <div className="mt-auto pt-8 flex flex-col items-center opacity-30 pointer-events-none text-center">
              <GraduationCap size={60} className="mb-3" />
              <p className="font-black text-base">النسخة الرقمية التفاعلية</p>
              <p className="font-bold text-xs">2026 © جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .book-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .book-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .book-scrollbar::-webkit-scrollbar-thumb {
          background: #c2b29c;
          border-radius: 10px;
        }
        .book-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b2c3e;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
