'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const diagnosticQuestions = [
  {
    axis: 'توزيع المشاركة',
    question: 'عند توجيه الأسئلة في الفصل، لمن توجه الأسئلة أكثر؟',
    options: [
      { text: 'للذكور والإناث بالتساوي', score: 2 },
      { text: 'للذكور أكثر', score: 1 },
      { text: 'للإناث أكثر', score: 1 },
      { text: 'للذكور فقط', score: 0 },
      { text: 'للإناث فقط', score: 0 }
    ]
  },
  {
    axis: 'توزيع المشاركة',
    question: 'هل تمنح وقتاً أطول للذكور للإجابة عن الأسئلة؟',
    options: [
      { text: 'أبداً', score: 2 },
      { text: 'نادراً', score: 2 },
      { text: 'أحياناً', score: 1 },
      { text: 'غالباً', score: 0 },
      { text: 'دائماً', score: 0 }
    ]
  },
  {
    axis: 'توزيع المشاركة',
    question: 'هل تمنح وقتاً أطول للإناث للإجابة عن الأسئلة؟',
    options: [
      { text: 'أبداً', score: 2 },
      { text: 'نادراً', score: 2 },
      { text: 'أحياناً', score: 1 },
      { text: 'غالباً', score: 0 },
      { text: 'دائماً', score: 0 }
    ]
  },
  {
    axis: 'التوقعات الأكاديمية',
    question: 'من تعتقد أنه الأفضل في الرياضيات في هذه المرحلة؟',
    options: [
      { text: 'لا فرق', score: 2 },
      { text: 'أحياناً الذكور وأحياناً الإناث', score: 1 },
      { text: 'الذكور فقط', score: 0 },
      { text: 'الإناث فقط', score: 0 }
    ]
  },
  {
    axis: 'التوقعات الأكاديمية',
    question: 'من تعتقد أنه الأفضل في اللغة العربية في هذه المرحلة؟',
    options: [
      { text: 'لا فرق', score: 2 },
      { text: 'أحياناً الذكور وأحياناً الإناث', score: 1 },
      { text: 'الإناث فقط', score: 0 },
      { text: 'الذكور فقط', score: 0 }
    ]
  },
  {
    axis: 'التوقعات الأكاديمية',
    question: 'هل تختلف توقعاتك الأكاديمية للذكور عن الإناث؟',
    options: [
      { text: 'لا، لا تختلف', score: 2 },
      { text: 'لم أفكر في ذلك من قبل', score: 1 },
      { text: 'نعم، تختلف قليلاً', score: 0.5 },
      { text: 'نعم، تختلف بشكل كبير', score: 0 }
    ]
  },
  {
    axis: 'السلوك والانضباط',
    question: 'كيف تصف سلوك الإناث داخل الفصل؟',
    options: [
      { text: 'لا يمكن التعميم', score: 2 },
      { text: 'عادي، مزيج بين الهدوء والحركة', score: 2 },
      { text: 'هادئ ومطيع دائماً', score: 0 },
      { text: 'كثير الحركة والشغب', score: 0 }
    ]
  },
  {
    axis: 'السلوك والانضباط',
    question: 'كيف تصف سلوك الذكور داخل الفصل؟',
    options: [
      { text: 'لا يمكن التعميم', score: 2 },
      { text: 'عادي، مزيج بين الهدوء والحركة', score: 2 },
      { text: 'كثير الحركة والشغب دائماً', score: 0 },
      { text: 'هادئ ومطيع جداً', score: 0 }
    ]
  },
  {
    axis: 'توزيع المهام',
    question: 'من تكلف عادة بمهام تنظيمية مثل ترتيب الفصل أو تنظيف السبورة؟',
    options: [
      { text: 'الذكور والإناث بالتساوي', score: 2 },
      { text: 'لا أوكل هذه المهام للتلاميذ', score: 2 },
      { text: 'الإناث فقط', score: 0 },
      { text: 'الذكور فقط', score: 0 }
    ]
  },
  {
    axis: 'توزيع المهام',
    question: 'من تكلف عادة بمهام حركية مثل حمل الكراسي أو نقل الأدوات؟',
    options: [
      { text: 'الذكور والإناث بالتساوي', score: 2 },
      { text: 'لا أوكل هذه المهام للتلاميذ', score: 2 },
      { text: 'الذكور فقط', score: 0 },
      { text: 'الإناث فقط', score: 0 }
    ]
  },
  {
    axis: 'الجانب العاطفي',
    question: 'من تواسي أكثر عند البكاء أو الحزن داخل الفصل؟',
    options: [
      { text: 'الذكور والإناث بالتساوي', score: 2 },
      { text: 'لا أواسي أحداً', score: 1 },
      { text: 'الإناث فقط', score: 0 },
      { text: 'الذكور فقط', score: 0 }
    ]
  },
  {
    axis: 'الجانب العاطفي',
    question: 'هل تعتقد أن الإناث أكثر حساسية وعاطفية من الذكور؟',
    options: [
      { text: 'لا، لا أعتقد ذلك', score: 2 },
      { text: 'ليس لدي رأي', score: 1 },
      { text: 'نعم، إلى حد ما', score: 0.5 },
      { text: 'نعم، بالتأكيد', score: 0 }
    ]
  }
];

export default function DiagnosticPage() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');

  const startDiagnostic = () => {
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setGameState('playing');
  };

  const handleAnswer = async (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestionIdx < diagnosticQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const maxScore = diagnosticQuestions.length * 2;
      const percentage = Math.round((totalScore / maxScore) * 100);

      const axes: Record<string, { current: number, max: number }> = {};
      diagnosticQuestions.forEach((q, i) => {
        if (!axes[q.axis]) axes[q.axis] = { current: 0, max: 0 };
        axes[q.axis].current += newAnswers[i];
        axes[q.axis].max += 2;
      });

      const axisResults: Record<string, number> = {};
      Object.keys(axes).forEach(key => {
        axisResults[key] = Math.round((axes[key].current / axes[key].max) * 100);
      });

      try {
        let userIdToUse = null;
        try {
          const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
          if (userStr) {
            const user = JSON.parse(userStr);
            userIdToUse = user.id || user.userId;
          }
        } catch (e) {
          console.warn("localStorage parse error");
        }

        await fetch('/api/diagnostic/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userIdToUse,
            score: totalScore,
            percentage: percentage,
            axisScores: axisResults
          })
        });
      } catch (e) {
        console.error("Save failed", e);
      }
      setGameState('results');
    }
  };

  if (gameState === 'results') {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = diagnosticQuestions.length * 2;
    const percentage = Math.round((totalScore / maxScore) * 100);

    const RecommendationEngine = (pct: number) => {
      if (pct >= 80) return { title: 'أداء متميز واستثنائي! 🌟', advice: 'أنت تظهر وعياً جندرياً عالياً جداً. استمر في كونك نموذجاً ملهماً لزملائك.', color: 'text-success' };
      if (pct >= 60) return { title: 'أداء جيد جداً مع فرص للتطوير 👍', advice: 'لديك أساس قوي. حاول التركيز أكثر على "توزيع المهام" لتعزيز التوازن التام.', color: 'text-secondary' };
      return { title: 'بداية جيدة للتحول التربوي 🌱', advice: 'هذا التقييم خطوتك الأولى للتغيير. ننصحك بمراجعة الكتيب الرقمي باستمرار.', color: 'text-primary' };
    };

    const rec = RecommendationEngine(percentage);

    return (
      <div className="min-h-screen py-10 px-4 bg-background relative overflow-hidden selection:bg-primary/30" dir="rtl">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bubbly-card p-8 md:p-12 text-center animate-soft shadow-xl border-2">
            <p className="text-sm font-black text-muted-foreground mb-4 uppercase tracking-[0.2em]">نتيجتك النهائية</p>
            <div className="text-6xl md:text-8xl font-black leading-none mb-6 text-gradient drop-shadow-xl">{percentage}%</div>
            <h2 className={`text-2xl md:text-3xl font-black mb-6 ${rec.color}`}>{rec.title}</h2>
            <p className="text-lg text-muted-foreground font-bold max-w-xl mx-auto leading-relaxed mb-10 border-r-4 border-primary/20 pr-6">{rec.advice}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg group">
                العودة للوحة القيادة
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
              </Link>
              <button onClick={startDiagnostic} className="btn-smooth btn-smooth-primary !px-8 !py-3 text-lg font-black shadow-lg">إعادة التقييم 🔄</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 flex flex-col items-center w-full" dir="rtl">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl px-6 relative z-10 py-12 flex-1 flex flex-col justify-center">
        {gameState === 'intro' && (
          <div className="text-center space-y-8 animate-soft">
            <div className="mx-auto w-32 h-32 bg-card rounded-[2.5rem] border border-border flex items-center justify-center mb-6 shadow-xl relative group mt-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition-opacity" />
              <span className="text-6xl relative z-10">✨</span>
            </div>
            <div className="space-y-4">
               <h1 className="text-4xl md:text-5xl font-black">
                 التشخيص <span className="text-gradient">الجندري الذكي</span>
               </h1>
               <p className="text-lg md:text-xl text-muted-foreground font-black max-w-3xl mx-auto leading-relaxed">
                 تقييم تفاعلي متقدم يهدف إلى تحليل ممارساتك التربوية داخل الفصل وتقديم رؤى علمية دقيقة لتعزيز بيئة تعليمية متوازنة وشاملة.
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
              <button
                onClick={startDiagnostic}
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 text-lg font-bold shadow-lg shadow-cyan-400/30 group"
              >
                ابدأ رحلة التقييم
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-lg font-bold shadow-lg group">
                العودة للوحة القيادة
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
              </Link>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-4xl mx-auto animate-soft">
            {/* Progress */}
            <div className="mb-10 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-primary font-black uppercase tracking-[0.1em] text-xs">مرحلة التقييم</p>
                   <h3 className="text-xl font-black">سؤال {currentQuestionIdx + 1} <span className="opacity-30 text-lg">/ {diagnosticQuestions.length}</span></h3>
                </div>
                <div className="text-2xl font-black text-gradient">{Math.round(((currentQuestionIdx + 1) / diagnosticQuestions.length) * 100)}%</div>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden shadow-inner border border-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                  style={{ width: `${((currentQuestionIdx + 1) / diagnosticQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bubbly-card !p-8 md:!p-12 shadow-xl border-2 mb-8 text-center group">
               <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest mb-6">{diagnosticQuestions[currentQuestionIdx].axis}</div>
               <h2 className="text-2xl md:text-3xl font-black leading-tight drop-shadow-sm group-hover:scale-[1.01] transition-transform duration-500">
                 {diagnosticQuestions[currentQuestionIdx].question}
               </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticQuestions[currentQuestionIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="bubbly-card !p-6 text-center md:text-right text-lg font-black transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
