'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const quizCategories = [
  {
    id: 'knowledge',
    title: 'كويز المعرفة',
    subtitle: 'ماذا تعرف عن النوع الاجتماعي والمساواة؟',
    icon: '🧠',
    color: 'var(--primary)',
    questions: [
      {
        question: 'ما الفرق بين "الجنس" و"النوع الاجتماعي"؟',
        options: [
          'الجنس بيولوجي، والنوع الاجتماعي بناء اجتماعي',
          'الجنس بناء اجتماعي، والنوع الاجتماعي بيولوجي',
          'لا فرق بينهما'
        ],
        correctIndex: 0,
        feedback: 'صح! الجنس يتعلق بالاختلافات البيولوجية الفطرية، بينما النوع الاجتماعي هو الأدوار التي يحددها المجتمع.'
      },
      {
        question: 'أي العبارات التالية تعبر عن تصور نمطي جندري؟',
        options: [
          'الإناث أهدأ من الذكور في القسم',
          'كل طفل فريد في قدراته بغض النظر عن جنسه',
          'الاختلافات الفردية أهم من الاختلافات بين الجنسين'
        ],
        correctIndex: 0,
        feedback: 'صح! تعميم صفة "الهدوء" على جنس واحد هو تصور نمطي يغفل الفروق الفردية.'
      },
      {
        question: 'ماذا نقصد بـ "العدالة الجندرية" في التعليم؟',
        options: [
          'إعطاء نفس المعاملة تماماً للجميع',
          'توفير الوسائل اللازمة لكل جنس ليحقق نفس النجاح',
          'تمييز الإناث على الذكور'
        ],
        correctIndex: 1,
        feedback: 'صح! العدالة تعني إزالة الحواجز التي تمنع كل جنس من الوصول لكامل إمكاناته.'
      },
      {
        question: 'أي الممارسات التالية تعزز المساواة في الفصل؟',
        options: [
          'توزيع المهام بالتساوي بين الذكور والإناث',
          'تكليف الإناث بمهام تنظيمية والذكور بمهام حركية',
          'توجيه أسئلة أسهل للإناث'
        ],
        correctIndex: 0,
        feedback: 'صح! المساواة تبدأ من إعطاء نفس الفرص والمسؤوليات للجميع دون تمييز.'
      },
      {
        question: 'كيف تؤثر الصور النمطية في الكتب المدرسية على الأطفال؟',
        options: [
          'لا تؤثر عليهم أبداً',
          'تحد من طموحاتهم وتصوراتهم لأدوارهم المستقبلية',
          'تساعدهم على فهم الواقع كما هو'
        ],
        correctIndex: 1,
        feedback: 'صحيح، الصور النمطية تقيد خيال الطفل وتجعله يعتقد أن هناك مهناً محرمة عليه بسبب جنسه.'
      },
      {
        question: 'ما هو "المنهاج الخفي" في الممارسة التربوية؟',
        options: [
          'دروس تقوية سرية',
          'القيم والمواقف غير المعلنة التي ينقلها المعلم والمدرسة',
          'الكتب المدرسية القديمة'
        ],
        correctIndex: 1,
        feedback: 'رائع! المنهاج الخفي يشمل لغة الجسد، طريقة توزيع المقاعد، ونبرة الصوت التي قد تكرس التمييز دون وعي.'
      },
      {
        question: 'أي من هؤلاء يعتبر من وسطاء التنشئة الاجتماعية الأساسيين؟',
        options: [
          'المدرسة والأسرة والإعلام',
          'الألعاب الإلكترونية فقط',
          'المحلات التجارية'
        ],
        correctIndex: 0,
        feedback: 'صح، هؤلاء يشكلون وعي الطفل وهويته الجندرية منذ الصغر من خلال الرسائل التي يمررونها.'
      },
      {
        question: 'هل تتغير أدوار النوع الاجتماعي عبر الزمن والمكان؟',
        options: [
          'نعم، فهي ليست فطرية بل مكتسبة اجتماعياً',
          'لا، فهي ثابتة لا تتغير',
          'تتغير في مجتمعات معينة فقط'
        ],
        correctIndex: 0,
        feedback: 'أحسنت! ما كان يعتبر وظيفة للذكور سابقاً أصبح الآن متاحاً للجميع، وهذا يثبت أنها أدوار اجتماعية متغيرة.'
      }
    ]
  },
  {
    id: 'attitudes',
    title: 'كويز المواقف',
    subtitle: 'كيف ستتصرف كمعلم/ة واعي/ة؟',
    icon: '🎭',
    color: 'var(--secondary)',
    questions: [
      {
        question: 'تلاحظ أن الذكور يشاركون أكثر من الإناث في الإجابة عن الأسئلة. ماذا ستفعل؟',
        options: [
          'أترك الأمور كما هي، فهذا طبيعي',
          'أوجه أسئلة محددة للإناث لأشجعهن على المشاركة',
          'أطلب من الإناث رفع أيديهن قبل الإجابة'
        ],
        correctIndex: 1,
        feedback: 'صح! التدخل الواعي للمعلم يضمن توازن المشاركة ويكسر حاجز الصمت لدى بعض الفئات.'
      },
      {
        question: 'تلميذ يرفض العمل في مجموعة ترأسها تلميذة. كيف تتعامل معه؟',
        options: [
          'أغيره لمجموعة أخرى لنتفادى المشاكل',
          'أوضح له أهمية الكفاءة والقيادة بغض النظر عن الجنس',
          'أطلب من التلميذة التنازل عن القيادة'
        ],
        correctIndex: 1,
        feedback: 'أحسنت! هذا الموقف فرصة ذهبية لتعليم الأطفال احترام القيادة النسائية والعمل الجماعي العادل.'
      },
      {
        question: 'تلميذة تجيب على سؤال صعب إجابة صحيحة. كيف ستشجعها؟',
        options: [
          'ممتاز، أنت ذكية وقادرة على التحدي العالي',
          'أحسنت، هذا متوقع من إناث مجتهدات',
          'لا أعلق كي لا يغار الآخرون'
        ],
        correctIndex: 0,
        feedback: 'صح! ربط النجاح بالذكاء والقدرة يبني ثقة قوية لدى الإناث في قدراتهن العقلية.'
      },
      {
        question: 'تلميذ يبكي في الفصل، ويسخر منه زملاؤه قائلين "الرجال لا يبكون". ماذا تفعل؟',
        options: [
          'أطلب منه التوقف عن البكاء ليكون رجلاً',
          'أشرح للقسم أن التعبير عن المشاعر إنساني ولا علاقة له بالجنس',
          'أتجاهل الموقف تماماً'
        ],
        correctIndex: 1,
        feedback: 'صح! كسر الأنماط الرجولية القاسية يساعد الذكور على النمو بشكل سوي عاطفياً واجتماعياً.'
      },
      {
        question: 'أثناء حصة التربية البدنية، يرفض الذكور لعب الكرة مع الإناث. ما موقفك؟',
        options: [
          'أفصلهم في ملاعب مختلفة',
          'أنظم مباراة مختلطة وأضع قواعد تضمن مشاركة الجميع',
          'أترك الذكور يلعبون والإناث يراقبن'
        ],
        correctIndex: 1,
        feedback: 'ممتاز، الرياضة المختلطة وسيلة فعالة جداً لكسر الحواجز وبناء الاحترام المتبادل بين الجنسين.'
      },
      {
        question: 'تلميذة تريد الانضمام لنادي الروبوتات، لكن زملائها يقولون أنها هواية للذكور. ماذا تفعل؟',
        options: [
          'أنصحها بنادي الطبخ بدلاً من ذلك',
          'أشجعها وأعرض قصصاً لعالمات مشهورات في مجالات التقنية والعلوم',
          'لا أتدخل في نقاشات التلاميذ'
        ],
        correctIndex: 1,
        feedback: 'أحسنت! تشجيع الإناث على مجالات العلوم والتقنية والهندسة والرياضيات هو جوهر التعليم العادل.'
      },
      {
        question: 'تلميذ يطلب القيام بمهام تزيين القسم، فيضحك التلاميذ. كيف تتصرف؟',
        options: [
          'أطلب منه العودة لمقعده وتكليف الإناث بالمهمة',
          'أثني على ذوقه وأؤكد أن الحس الفني ليس له جنس',
          'أضحك معهم لتلطيف الجو'
        ],
        correctIndex: 1,
        feedback: 'صحيح، يجب تحرير الذكور من قيد "الصلابة" المفروضة والسماح لهم بالتعبير عن حسهم الجمالي.'
      },
      {
        question: 'عند توزيع الجوائز، تلاحظ أنك دائماً تختار الإناث للجوائز السلوكية والذكور للجوائز العلمية. ماذا ستغير؟',
        options: [
          'أستمر، فالنتائج هي التي تحدد',
          'أراجع معايير تقييمي للتأكد من خلوها من أي تحيز غير واعٍ',
          'أعطي الجوائز للجميع بالتساوي'
        ],
        correctIndex: 1,
        feedback: 'صح، الوعي بالتحيز الذاتي هو الخطوة الأولى نحو ممارسة تعليمية عادلة وشاملة.'
      }
    ]
  },
  {
    id: 'cases',
    title: 'كويز الحالات',
    subtitle: 'حالات واقعية لتحليل الممارسات',
    icon: '🏫',
    color: 'var(--accent)',
    questions: [
      {
        question: 'في كتاب القراءة، تظهر الأم دائماً في المطبخ والأب يقرأ الجريدة. ماذا تفعل؟',
        options: [
          'أدرس النص كما هو دون تعليق',
          'أفتح نقاشاً مع التلاميذ حول تقاسم الأدوار والمسؤوليات في البيت',
          'أمزق الصفحة من الكتاب'
        ],
        correctIndex: 1,
        feedback: 'رائع! النقد البناء للمناهج يساعد التلاميذ على تطوير تفكير نقدي تجاه القوالب الاجتماعية الجاهزة.'
      },
      {
        question: 'معلم يوجه أسئلة تحدي للذكور، وأسئلة سهلة للإناث. ما رأيك؟',
        options: [
          'أسلوب جيد لأن الذكور يحبون التحدي',
          'أسلوب يميز بين الجنسين ويحد من طموح الإناث',
          'أسلوب عادي، المهم أن الجميع يشارك'
        ],
        correctIndex: 1,
        feedback: 'صح! تخفيض سقف التوقعات للإناث يضر بتحصيلهن الدراسي وثقتهن المستقبلية.'
      },
      {
        question: 'ولي أمر يطلب عدم جلوس ابنه بجانب أنثى في القسم. كيف ترد؟',
        options: [
          'أوافق فوراً احتراماً لطلبه',
          'أوضح له فلسفة المدرسة في بناء مواطنين يحترمون بعضهم البعض',
          'أتجاهل طلبه وأتركه غاضباً'
        ],
        correctIndex: 1,
        feedback: 'صحيح، التواصل مع الأولياء ضروري لشرح أهداف التربية على قيم المساواة والعيش المشترك.'
      },
      {
        question: 'مدرسة تلاحظ أن الإناث دائماً هن من ينظفن القسم. ما الإجراء المناسب؟',
        options: [
          'أشجعهن لأنهن أكثر تنظيماً بطبيعتهن',
          'أوضع جدولاً دورياً للنظافة يشمل الذكور والإناث بالتساوي',
          'ألغي فكرة تنظيف القسم نهائياً'
        ],
        correctIndex: 1,
        feedback: 'بالضبط، تقاسم المسؤوليات داخل الفضاء المدرسي يعلم الأطفال المساواة الفعلية.'
      },
      {
        question: 'تلميذة متفوقة في الرياضيات يتم وصفها بأنها "تفكر مثل الرجال". ما هو الخطأ هنا؟',
        options: [
          'لا يوجد خطأ، فهذا يعتبر مدحاً لها',
          'الخطأ هو ربط التفوق العقلي بالذكورة فقط',
          'الخطأ أنها تدرس مادة صعبة'
        ],
        correctIndex: 1,
        feedback: 'صح! العقل لا جنس له، والذكاء ميزة إنسانية شاملة لا تحتكرها فئة دون أخرى.'
      },
      {
        question: 'يتم اختيار الذكور دائماً لحمل الأمتعة الثقيلة أو نقل الكراسي. هل هذا تمييز؟',
        options: [
          'لا، الذكور أقوى جسدياً بشكل طبيعي',
          'نعم، لأنه يكرس صورة النمطية للرجل كـ "قوة عضلية" والمرأة كـ "ضعف"',
          'لا، الإناث يرفضن القيام بذلك'
        ],
        correctIndex: 1,
        feedback: 'صح، القوة البدنية متفاوتة بين الأفراد وليس بين الأجناس، ويجب تشجيع روح التعاون الجماعي.'
      },
      {
        question: 'معلم ينادي الذكور بـ "يا أبطال" والإناث بـ "يا جميلات". ما أثر ذلك؟',
        options: [
          'أثر إيجابي، فالجميع يحب كلمات المديح',
          'أثر سلبي، يربط قيمة الذكر بالفعل والإنتاج وقيمة الأنثى بالمظهر',
          'لا يوجد أثر، مجرد كلمات عابرة'
        ],
        correctIndex: 1,
        feedback: 'رائع! اللغة تشكل الوعي، ومن المهم استخدام أوصاف تشجع الجميع على النجاح والمثابرة.'
      },
      {
        question: 'تلاحظ أن الذكور يحتلون وسط ساحة اللعب، بينما الإناث في الزوايا. ماذا تفعل؟',
        options: [
          'لا أتدخل، هكذا هي الفسحة دائماً',
          'أعيد تنظيم الفضاء المدرسي لضمان حق الجميع في الساحة بأمان',
          'أمنع اللعب العنيف في الساحة'
        ],
        correctIndex: 1,
        feedback: 'صح! "جغرافية الساحة" تعكس موازين القوى، وتدخل المعلم يضمن حق الجميع في التمتع بالفضاء العام.'
      }
    ]
  }
];

export default function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');

  const startQuiz = (index: number) => {
    setActiveQuiz(index);
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameState('playing');
  };

  const saveResults = async (finalScore: number, total: number) => {
    try {
      const percentage = (finalScore / total) * 100;
      const quiz = quizCategories[activeQuiz!];

      await fetch('/api/quizzes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizTitle: quiz.title,
          score: finalScore,
          totalQuestions: total,
          percentage: percentage
        })
      });
    } catch (error) {
      console.error('فشل في حفظ النتائج:', error);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    const quiz = quizCategories[activeQuiz!];
    if (optionIndex === quiz.questions[currentQuestionIdx].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    const quiz = quizCategories[activeQuiz!];
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setGameState('results');
      saveResults(score, quiz.questions.length);
    }
  };

  const getResultDetails = (percentage: number) => {
    if (percentage >= 80) return { msg: 'ممتاز! لديك وعي كبير جداً بقضايا النوع الاجتماعي.', emoji: '🌟', color: 'var(--success)' };
    if (percentage >= 50) return { msg: 'جيد، استمر في التعلم والتطوير.', emoji: '👍', color: 'var(--warning)' };
    return { msg: 'لا بأس، المحاولة فرصة للتعلم. جرب مرة أخرى.', emoji: '📚', color: 'var(--danger)' };
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen p-4 md:p-6 flex flex-col items-center w-full bg-background relative overflow-hidden" dir="rtl">
        {/* Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-6xl space-y-12 relative z-10">
          <div className="text-center space-y-6 animate-soft">
            <h1 className="text-5xl md:text-7xl font-black">عالم <span className="text-gradient">الكويزات</span> 🎮</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-black max-w-4xl mx-auto">تحدّ مستويات الوعي الجندري واختبر مهاراتك التربوية بأسلوب تفاعلي ممتع.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bubbly-card p-8 cursor-pointer group flex flex-col items-center text-center !border-b-6 hover:-translate-y-3 transition-all duration-500"
                style={{ borderBottomColor: cat.color }}
                onClick={() => startQuiz(idx)}
              >
                <div className="w-20 h-20 rounded-[1.8rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-115 transition-transform duration-500 shadow-xl" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>{cat.icon}</div>
                <h2 className="text-2xl font-black mb-3">{cat.title}</h2>
                <p className="text-base text-muted-foreground font-bold mb-8 leading-relaxed h-16">{cat.subtitle}</p>
                <button className="btn-smooth w-full py-3 text-lg" style={{ backgroundColor: cat.color, color: '#fff' }}>ابدأ الآن</button>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-10 animate-soft delay-300">
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg group">
              العودة للوحة القيادة
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quiz = quizCategories[activeQuiz!];
  const q = quiz.questions[currentQuestionIdx];

  if (gameState === 'results') {
    const percentage = (score / quiz.questions.length) * 100;
    const result = getResultDetails(percentage);
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-background relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 pointer-events-none" />
        <div className="bubbly-card max-w-xl w-full text-center p-8 space-y-8 animate-soft shadow-xl">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-primary/20 blur-[40px] animate-pulse" />
             <div className="text-8xl relative z-10 drop-shadow-xl">{result.emoji}</div>
          </div>
          <div className="space-y-2">
             <h2 className="text-3xl font-black">انتهى التحدي!</h2>
             <div className="text-6xl font-black text-gradient">{Math.round(percentage)}%</div>
          </div>
          <div className="p-6 rounded-[1.5rem] bg-muted/50 border border-border shadow-inner">
            <p className="text-lg font-black text-foreground leading-relaxed">{result.msg}</p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => setGameState('menu')} className="btn-smooth btn-smooth-primary !px-12 !py-6 text-2xl font-black shadow-2xl">العب مجدداً 🔄</button>
            <Link href="/dashboard" className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg group">
              العودة للوحة القيادة
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center bg-background relative overflow-hidden" dir="rtl">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-10 relative z-10">
        <div className="flex justify-between items-center px-4 animate-soft">
          <button onClick={() => setGameState('menu')} className="btn-smooth btn-smooth-outline !py-1.5 !px-4 !text-xs flex items-center gap-2 group">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
             إنهاء
          </button>
          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-sm">السؤال {currentQuestionIdx + 1} / {quiz.questions.length}</div>
        </div>

        <div className="bubbly-card !p-0 shadow-2xl border-2 overflow-hidden animate-soft">
          <div className="w-full h-2 bg-muted">
            <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-700" style={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }} />
          </div>
          
          <div className="p-6 md:p-10 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-black">{currentQuestionIdx + 1}</div>
                 <div className="h-0.5 flex-1 bg-border/20 rounded-full" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black leading-tight">{q.question}</h2>
            </div>

            <div className="grid gap-4">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback}
                  className={`w-full text-right p-6 rounded-2xl text-xl font-black transition-all border-2 flex items-center justify-between group
                    ${!showFeedback ? 'bg-muted/50 border-transparent hover:bg-card hover:border-primary hover:shadow-xl hover:-translate-y-1' : ''}
                    ${showFeedback && idx === q.correctIndex ? 'bg-success/10 border-success text-success shadow-[0_0_30px_-10px_var(--success)]' : ''}
                    ${showFeedback && idx === selectedOption && idx !== q.correctIndex ? 'bg-danger/10 border-danger text-danger' : ''}
                    ${showFeedback && idx !== q.correctIndex && idx !== selectedOption ? 'opacity-30 border-transparent' : ''}
                  `}
                >
                  <span className="flex-1">{option}</span>
                  {showFeedback && idx === q.correctIndex && <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center text-xl animate-bounce">✓</div>}
                  {showFeedback && idx === selectedOption && idx !== q.correctIndex && <div className="w-10 h-10 rounded-full bg-danger text-white flex items-center justify-center text-xl animate-shake">✕</div>}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className="p-8 rounded-2xl bg-card border border-border/50 space-y-8 animate-soft shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${selectedOption === q.correctIndex ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                     {selectedOption === q.correctIndex ? '✨' : '💡'}
                  </div>
                  <div className="space-y-1">
                     <p className="text-xl font-black text-foreground">{selectedOption === q.correctIndex ? 'إجابة عبقرية!' : 'لنتعلم معاً:'}</p>
                     <p className="text-base font-bold text-muted-foreground">توضication تربوي معمق</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-foreground/80 leading-relaxed relative z-10 border-r-4 border-primary/20 pr-6">{q.feedback}</p>
                <div className="pt-6 flex justify-end relative z-10">
                  <button onClick={nextQuestion} className="btn-smooth btn-smooth-primary !px-10 !py-4 text-xl font-black shadow-xl group">
                     {currentQuestionIdx < quiz.questions.length - 1 ? 'السؤال التالي' : 'عرض النتائج'}
                     <span className="group-hover:-translate-x-2 transition-transform inline-block mr-3">←</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
