'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReflectionsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    className: '',
    lessonTopic: '',
    boysNumber: '0',
    girlsNumber: '0',
    cognitiveGoal: '',
    skillGoal: '',
    emotionalGoal: '',
    girlsParticipation: '0',
    boysParticipation: '0',
    behaviorNotes: '',
    difficulties: '',
    genderReflection: '',
    suggestions: '',
    feeling: ''
  });

  const steps = [
    { id: 1, title: 'البيانات', icon: '📅', color: 'var(--primary)' },
    { id: 2, title: 'الأهداف', icon: '🎯', color: 'var(--secondary)' },
    { id: 3, title: 'التفاعل', icon: '👥', color: 'var(--accent)' },
    { id: 4, title: 'التحديات', icon: '⚠️', color: 'var(--danger)' },
    { id: 5, title: 'الخاتمة', icon: '✨', color: 'var(--success)' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => router.push('/reflections/history'), 2000);
    }
  }, [success, router]);

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] animate-pulse" />
        <div className="bubbly-card p-20 text-center max-w-2xl relative z-10 border-4 shadow-2xl animate-soft">
          <div className="w-40 h-40 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-xl">
             <span className="text-8xl">✅</span>
          </div>
          <h1 className="text-6xl font-black mb-6 text-gradient">تم الحفظ!</h1>
          <p className="text-3xl font-black opacity-70">شكراً لمشاركتك تأملاتك القيمة التي تساهم في بناء تعليم أكثر عدلاً. ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 flex flex-col items-center w-full px-4 py-6" dir="rtl">
      {/* Immersive Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      <main className="w-full max-w-[1440px] px-6 py-12 md:py-24 relative z-10">
        <header className="mb-20 animate-soft">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-right">
            <div className="space-y-6">
              <Link href="/dashboard" className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg group">
                العودة للوحة القيادة
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
              </Link>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight"><span className="text-gradient">يومية التأمل</span> البيداغوجي</h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-black border-r-4 border-primary/20 pr-6 inline-block">نحو ممارسة تعليمية عادلة وشاملة للجميع.</p>
            </div>
            <Link href="/reflections/history" className="btn-smooth btn-smooth-outline !px-12 !py-6 text-2xl group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-4">
                 📜 سجل التأملات السابقة
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Progress Steps */}
        <div className="bubbly-card !p-4 mb-20 flex justify-between items-center overflow-x-auto no-scrollbar gap-4 border-2 animate-soft shadow-xl">
          {steps.map((s) => (
            <button 
              key={s.id} 
              type="button" 
              onClick={() => setCurrentStep(s.id)} 
              className={`flex items-center gap-5 px-10 py-5 rounded-full transition-all whitespace-nowrap min-w-fit shadow-sm
                ${currentStep === s.id ? 'bg-primary text-white scale-110 shadow-xl' : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="font-black text-xl">{s.title}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="animate-soft">
          <div className="bubbly-card !p-6 md:!p-10 border border-border shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-md border border-primary/20">📅</div>
                   <div className="space-y-0.5">
                      <h2 className="text-2xl font-black">البيانات العامة</h2>
                      <p className="text-sm font-bold text-muted-foreground">التفاصيل الأساسية للحصة التعليمية</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-black text-xs text-foreground/70 px-2">📅 تاريخ الحصة</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-smooth !py-2.5 !px-5 !text-base !font-black !rounded-lg" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-black text-xs text-foreground/70 px-2">📚 المادة المدرّسة</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="input-smooth !py-2.5 !px-5 !text-base !font-black !rounded-lg" placeholder="مثال: لغة عربية، رياضيات..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-black text-xs text-foreground/70 px-2">🏫 القسم</label>
                    <input type="text" name="className" value={formData.className} onChange={handleChange} className="input-smooth !py-2.5 !px-5 !text-base !font-black !rounded-lg" placeholder="مثال: السنة الثالثة أ" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-black text-xs text-foreground/70 px-2">📖 موضوع الدرس</label>
                    <input type="text" name="lessonTopic" value={formData.lessonTopic} onChange={handleChange} className="input-smooth !py-2.5 !px-5 !text-base !font-black !rounded-lg" placeholder="مثال: العمليات الحسابية" />
                  </div>
                </div>
                
                <div className="p-6 rounded-xl bg-card border border-border shadow-inner space-y-6 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                  <h4 className="font-black text-lg flex items-center gap-3 relative z-10">
                    <span className="text-xl">😊</span>
                    <span>كيف تصف شعورك العام تجاه هذه الحصة؟</span>
                  </h4>
                  <div className="flex flex-wrap gap-3 relative z-10">
                    {['راضي جداً 😍', 'متعب قليلاً 😴', 'متحمس للغاية 🤩', 'قلق ومتردد 😟'].map(m => (
                      <label key={m} className={`px-4 py-2 rounded-lg cursor-pointer font-black border transition-all text-base shadow-sm flex items-center gap-2
                        ${formData.feeling === m ? "bg-primary border-primary text-white scale-105 shadow-md" : "bg-background border-border hover:border-primary/50"}`}>
                        <input type="radio" name="feeling" checked={formData.feeling === m} onChange={() => handleRadioChange('feeling', m)} className="hidden" /> 
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-soft">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-6 pb-8">
                  <h3 className="text-2xl font-black mb-6 text-white flex items-center justify-end gap-2">الأهداف <span className="text-3xl">🎯</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cognitive */}
                    <div className="bg-[#162032] border border-[#1e293b] rounded-3xl p-5 flex flex-col shadow-inner">
                      <h4 className="font-black text-base text-white/90 mb-6 text-center">الأهداف المعرفية</h4>
                      <div className="space-y-4 text-sm font-bold text-white/70 mt-auto">
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق بالكامل <span className="text-success">✅</span></span>
                           <input type="radio" name="cognitiveGoal" value="تحقق بالكامل ✅" checked={formData.cognitiveGoal === 'تحقق بالكامل ✅'} onChange={handleChange} className="w-5 h-5 accent-success" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق جزئياً <span className="text-warning">⚠️</span></span>
                           <input type="radio" name="cognitiveGoal" value="تحقق جزئياً ⚠️" checked={formData.cognitiveGoal === 'تحقق جزئياً ⚠️'} onChange={handleChange} className="w-5 h-5 accent-warning" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">لم يتحقق <span className="text-danger">❌</span></span>
                           <input type="radio" name="cognitiveGoal" value="لم يتحقق ❌" checked={formData.cognitiveGoal === 'لم يتحقق ❌'} onChange={handleChange} className="w-5 h-5 accent-danger" /> 
                         </label>
                      </div>
                    </div>
                    {/* Skill */}
                    <div className="bg-[#162032] border border-[#1e293b] rounded-3xl p-5 flex flex-col shadow-inner">
                      <h4 className="font-black text-base text-white/90 mb-6 text-center">الأهداف المهارية</h4>
                      <div className="space-y-4 text-sm font-bold text-white/70 mt-auto">
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق بالكامل <span className="text-success">✅</span></span>
                           <input type="radio" name="skillGoal" value="تحقق بالكامل ✅" checked={formData.skillGoal === 'تحقق بالكامل ✅'} onChange={handleChange} className="w-5 h-5 accent-success" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق جزئياً <span className="text-warning">⚠️</span></span>
                           <input type="radio" name="skillGoal" value="تحقق جزئياً ⚠️" checked={formData.skillGoal === 'تحقق جزئياً ⚠️'} onChange={handleChange} className="w-5 h-5 accent-warning" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">لم يتحقق <span className="text-danger">❌</span></span>
                           <input type="radio" name="skillGoal" value="لم يتحقق ❌" checked={formData.skillGoal === 'لم يتحقق ❌'} onChange={handleChange} className="w-5 h-5 accent-danger" /> 
                         </label>
                      </div>
                    </div>
                    {/* Emotional */}
                    <div className="bg-[#162032] border border-[#1e293b] rounded-3xl p-5 flex flex-col shadow-inner">
                      <h4 className="font-black text-base text-white/90 mb-6 text-center">الأهداف الوجدانية</h4>
                      <div className="space-y-4 text-sm font-bold text-white/70 mt-auto">
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق بالكامل <span className="text-success">✅</span></span>
                           <input type="radio" name="emotionalGoal" value="تحقق بالكامل ✅" checked={formData.emotionalGoal === 'تحقق بالكامل ✅'} onChange={handleChange} className="w-5 h-5 accent-success" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">تحقق جزئياً <span className="text-warning">⚠️</span></span>
                           <input type="radio" name="emotionalGoal" value="تحقق جزئياً ⚠️" checked={formData.emotionalGoal === 'تحقق جزئياً ⚠️'} onChange={handleChange} className="w-5 h-5 accent-warning" /> 
                         </label>
                         <label className="flex items-center justify-end gap-3 cursor-pointer group">
                           <span className="flex items-center gap-2 group-hover:text-white transition-colors">لم يتحقق <span className="text-danger">❌</span></span>
                           <input type="radio" name="emotionalGoal" value="لم يتحقق ❌" checked={formData.emotionalGoal === 'لم يتحقق ❌'} onChange={handleChange} className="w-5 h-5 accent-danger" /> 
                         </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-soft">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-6 pb-8">
                  <h3 className="text-2xl font-black mb-6 text-white flex items-center justify-end gap-2">المشاركة (التفاعل الجندري) <span className="text-3xl">⚖️</span></h3>
                  <div className="bg-[#0b1120] border border-[#1e293b] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-inner">
                    <div className="flex flex-col md:flex-row gap-8 items-center w-full md:w-auto">
                      <div className="flex items-center gap-4">
                         <span className="text-white font-black text-xl">ذكور</span>
                         <span className="text-3xl drop-shadow-md">👦</span>
                         <input type="number" name="boysNumber" value={formData.boysNumber} onChange={handleChange} className="w-24 bg-[#162032] border-2 border-[#1e293b] focus:border-cyan-500/50 rounded-xl py-2 px-3 text-center text-xl font-black text-cyan-400 outline-none transition-colors shadow-inner" />
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-white font-black text-xl">إناث</span>
                         <span className="text-3xl drop-shadow-md">👧</span>
                         <input type="number" name="girlsNumber" value={formData.girlsNumber} onChange={handleChange} className="w-24 bg-[#162032] border-2 border-[#1e293b] focus:border-pink-500/50 rounded-xl py-2 px-3 text-center text-xl font-black text-pink-400 outline-none transition-colors shadow-inner" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-black text-lg">عدد المشاركين الفعليين</span>
                      <span className="text-4xl opacity-80">👥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-6 pb-8">
                  <h3 className="text-2xl font-black mb-6 text-white flex items-center justify-end gap-2">الأنشطة (سير الحصة) <span className="text-3xl">🚀</span></h3>
                  <textarea name="behaviorNotes" value={formData.behaviorNotes} onChange={handleChange} className="w-full bg-[#0b1120] border border-[#1e293b] rounded-2xl p-6 text-white/80 text-right resize-none min-h-[180px] outline-none font-bold text-base shadow-inner focus:border-primary/50 transition-colors" placeholder="وصف مفصل لسير الأنشطة والتدخلات البيداغوجية..." />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-soft">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-6 pb-8">
                  <h3 className="text-2xl font-black mb-6 text-white flex items-center justify-end gap-2">الصعوبات <span className="text-3xl">⚠️</span></h3>
                  <textarea name="difficulties" value={formData.difficulties} onChange={handleChange} className="w-full bg-[#0b1120] border border-[#1e293b] rounded-2xl p-6 text-white/80 text-right resize-none min-h-[220px] outline-none font-bold text-base shadow-inner focus:border-primary/50 transition-colors" placeholder="ما هي العوائق أو الصعوبات التي واجهتها خلال هذه الحصة؟" />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6 animate-soft">
                <div className="bg-[#0f172a] border border-[#1e293b] rounded-[2rem] p-6 pb-8">
                  <h3 className="text-2xl font-black mb-6 text-white flex items-center justify-end gap-2">الخاتمة (التأمل والمقترحات) <span className="text-3xl">✨</span></h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-black text-sm text-white/70 mb-3 flex items-center justify-end gap-2 text-right w-full">تأملات جندرية نهائية <span className="text-lg">⚖️</span></h4>
                      <textarea name="genderReflection" value={formData.genderReflection} onChange={handleChange} className="w-full bg-[#0b1120] border border-[#1e293b] rounded-2xl p-6 text-white/80 text-right resize-none min-h-[160px] outline-none font-bold text-base shadow-inner focus:border-primary/50 transition-colors" placeholder="رؤيتك للتوازن الجندري في هذه الحصة..." />
                    </div>
                    
                    <div>
                      <h4 className="font-black text-sm text-white/70 mb-3 flex items-center justify-end gap-2 text-right w-full">مقترحات للحصة القادمة <span className="text-lg">💡</span></h4>
                      <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} className="w-full bg-[#0b1120] border border-[#1e293b] rounded-2xl p-6 text-white/80 text-right resize-none min-h-[160px] outline-none font-bold text-base shadow-inner focus:border-primary/50 transition-colors" placeholder="ما الذي سأغيره في المرة القادمة؟" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Navigation Controls */}
          <div className="flex justify-between items-center mt-16 gap-8">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={() => setCurrentStep(prev => prev - 1)} 
                className="btn-smooth btn-smooth-outline !px-10 !py-4 !text-lg font-black group"
              >
                 <span className="group-hover:translate-x-1 transition-transform inline-block ml-2">→</span>
                 السابق
              </button>
            )}
            
            {currentStep < 5 ? (
              <button 
                type="button" 
                onClick={() => setCurrentStep(prev => prev + 1)} 
                className="btn-smooth btn-smooth-primary !px-12 !py-4 !text-lg font-black mr-auto shadow-xl group"
              >
                 التالي
                 <span className="group-hover:-translate-x-1 transition-transform inline-block mr-2">←</span>
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-smooth !bg-success !text-white !px-16 !py-5 !text-xl font-black mr-auto shadow-xl group"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التأمل ✨'}
              </button>
            )}
          </div>
        </form>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes shimmer {
           0% { transform: translateX(100%); }
           100% { transform: translateX(-100%); }
        }
        .animate-shimmer {
           animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
