'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReflectionEntry {
  id: string;
  date: string;
  subject: string;
  className: string;
  lessonTopic: string;
  boysNumber: number;
  girlsNumber: number;
  cognitiveGoal: string;
  skillGoal: string;
  emotionalGoal: string;
  girlsParticipation: number;
  boysParticipation: number;
  behaviorNotes: string;
  genderReflection: string;
  difficulties: string;
  suggestions: string;
  feeling: string;
  createdAt: string;
}

export default function ReflectionsHistoryPage() {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<ReflectionEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/reflections');
      const data = await res.json();
      if (Array.isArray(data)) setEntries(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذه اليومية نهائياً؟')) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/reflections?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedEntry?.id === id) setSelectedEntry(null);
        await fetchEntries();
      } else {
        alert('فشل الحذف');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePrint = async () => {
    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.querySelector('.print-area') as HTMLElement;
      
      if (!element) return;

      const opt = {
        margin:       10, // top, left, bottom, right
        filename:     `سجل_التأمل_${selectedEntry?.lessonTopic?.replace(/\s+/g, '_') || 'عام'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#020817' }, // ensure dark background
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error, falling back to print:', err);
      window.print();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', numberingSystem: 'latn'
    });
  };

  const goalOptions = [
    { text: 'تحقق بالكامل ✅', val: 'تحقق بالكامل ✅' },
    { text: 'تحقق جزئياً ⚠️', val: 'تحقق جزئياً ⚠️' },
    { text: 'لم يتحقق ❌', val: 'لم يتحقق ❌' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/30 flex flex-col items-center w-full p-6 md:p-12" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <style jsx global>{`
        @media print {
          nav, button, .no-print { display: none !important; }
          .print-area { display: block !important; background: white !important; color: black !important; padding: 40px !important; border-radius: 0 !important; width: 100% !important; }
          body { background: white !important; }
          .bubbly-card { background: white !important; border: 1px solid #eee !important; box-shadow: none !important; color: black !important; }
          .text-gradient { background: none !important; color: black !important; -webkit-text-fill-color: black !important; }
        }
      `}</style>

      <div className="w-full max-w-[1440px] space-y-12 relative z-10 no-print">
        <header className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-border/50 pb-12 animate-soft">
          <div className="space-y-4 text-right">
            <h1 className="text-3xl md:text-5xl font-black"><span className="text-gradient">سجل التأملات</span> المهنية 📚</h1>
            <p className="text-lg text-muted-foreground font-black italic">إدارة وعرض ممارساتك التعليمية بذكاء وألوان.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/reflections" className="btn-smooth btn-smooth-outline !px-8 !py-4 !text-base font-black">+ يومية جديدة</Link>
            <Link href="/dashboard" className="btn-smooth btn-smooth-primary !px-8 !py-4 !text-base font-black shadow-xl">العودة للوحة القيادة</Link>
          </div>
        </header>

        {entries.length === 0 ? (
          <div className="bubbly-card text-center py-20 border-4 border-dashed border-border/50 animate-soft">
            <span className="text-[8rem] block mb-8 opacity-20">🏝️</span>
            <h3 className="text-2xl font-black text-muted-foreground mb-6">لا توجد سجلات تأمل حتى الآن</h3>
            <Link href="/reflections" className="btn-smooth btn-smooth-primary !px-10 !py-5 !text-lg font-black shadow-2xl">ابدأ تأملك الأول الآن ✨</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar List */}
            <div className="lg:col-span-4 space-y-6 max-h-[900px] overflow-y-auto pr-4 no-scrollbar animate-soft">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`bubbly-card !p-8 transition-all cursor-pointer group relative overflow-hidden
                    ${selectedEntry?.id === entry.id 
                      ? 'border-primary ring-4 ring-primary/20 bg-primary/5' 
                      : 'hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2'}`}
                >
                  <button
                    onClick={(e) => handleDelete(e, entry.id)}
                    disabled={deleteLoading === entry.id}
                    className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-danger/10 hover:bg-danger text-danger hover:text-white flex items-center justify-center transition-all z-20 border border-danger/20"
                    title="حذف"
                  >
                    {deleteLoading === entry.id ? '...' : '🗑️'}
                  </button>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black opacity-40 tracking-widest">{formatDate(entry.date)}</span>
                  </div>
                  <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{entry.subject}</h3>
                  <p className="text-sm font-bold text-muted-foreground">{entry.className} • {entry.lessonTopic}</p>
                </div>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-8 animate-soft">
              {selectedEntry ? (
                <div className="bubbly-card !p-8 md:!p-12 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.1)] border-2 print-area space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#a78bfa0d] rounded-full blur-[100px] -z-10" />
                  
                  <div className="flex justify-between items-center no-print" data-html2canvas-ignore="true">
                    <div className="flex gap-4">
                      <button onClick={handlePrint} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f172a] text-white hover:bg-[#1e293b] border border-[#334155] transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-cyan-500/20 group">
                        تحميل كـ PDF <span className="text-xl group-hover:-translate-y-1 transition-transform">📄</span>
                      </button>
                    </div>
                    <div className="px-6 py-2 rounded-full bg-[#a78bfa1a] text-primary font-black text-sm border border-[#a78bfa33] shadow-sm">{selectedEntry.feeling}</div>
                  </div>

                  <div className="space-y-12">
                    <div className="text-center space-y-4">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-muted border border-border text-muted-foreground font-black text-xs uppercase tracking-widest">{selectedEntry.subject}</div>
                      <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">{selectedEntry.lessonTopic}</h2>
                      <div className="flex items-center justify-center gap-4">
                         <span className="w-8 h-0.5 bg-border rounded-full" />
                         <p className="text-lg font-black text-[#a78bfab3]">{formatDate(selectedEntry.date)}</p>
                         <span className="w-8 h-0.5 bg-border rounded-full" />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'ذكور', val: selectedEntry.boysNumber, color: 'text-secondary', bg: 'bg-[#22d3ee0d]' },
                        { label: 'إناث', val: selectedEntry.girlsNumber, color: 'text-primary', bg: 'bg-[#a78bfa0d]' },
                        { label: 'مشاركة ♂️', val: selectedEntry.boysParticipation, color: 'text-secondary', bg: 'bg-[#22d3ee1a]' },
                        { label: 'مشاركة ♀️', val: selectedEntry.girlsParticipation, color: 'text-primary', bg: 'bg-[#a78bfa1a]' }
                      ].map((s, i) => (
                        <div key={i} className={`${s.bg} p-6 rounded-[2rem] text-center border-2 border-white shadow-xl`}>
                          <p className="text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-widest">{s.label}</p>
                          <p className={`text-4xl font-black ${s.color} drop-shadow-sm`}>{s.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Goals Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'الأهداف المعرفية', val: selectedEntry.cognitiveGoal, icon: '🧠' },
                        { label: 'الأهداف المهارية', val: selectedEntry.skillGoal, icon: '🛠️' },
                        { label: 'الأهداف الوجدانية', val: selectedEntry.emotionalGoal, icon: '❤️' }
                      ].map((g, i) => (
                        <div key={i} className="bubbly-card !p-8 border-2 space-y-6 bg-[#0f172a4d] backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                             <span className="text-3xl">{g.icon}</span>
                             <p className="font-black text-lg text-[#f8fafccc]">{g.label}</p>
                          </div>
                          <div className="space-y-3">
                            {goalOptions.map((opt, idx) => {
                              const isChecked = g.val === opt.val;
                              return (
                                <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${isChecked ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-[#1e293b80] border-transparent opacity-40'}`}>
                                  <span className="text-xs font-black">{opt.text}</span>
                                  {isChecked && <div className="w-3 h-3 bg-white rounded-full shadow-inner" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detailed Notes */}
                    <div className="space-y-8">
                      <div className="bubbly-card !p-8 border-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-full bg-primary" />
                        <h3 className="text-xl font-black text-primary mb-4 flex items-center gap-3"><span>🚀</span> سير الأنشطة والبيداغوجيا</h3>
                        <p className="text-base leading-relaxed text-[#f8fafccc] font-bold">{selectedEntry.behaviorNotes || 'لا توجد ملاحظات مسجلة'}</p>
                      </div>

                      <div className="bubbly-card !p-8 border-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-danger" />
                        <h3 className="text-xl font-black text-danger mb-4 flex items-center gap-3"><span>⚠️</span> الصعوبات والعوائق المرصودة</h3>
                        <p className="text-base leading-relaxed text-[#f8fafccc] font-bold">{selectedEntry.difficulties || 'لا توجد صعوبات مسجلة'}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bubbly-card !p-8 border-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-secondary" />
                          <h3 className="text-xl font-black text-secondary mb-4 flex items-center gap-3"><span>⚖️</span> التأمل الجندري النقدي</h3>
                          <p className="text-base leading-relaxed text-[#f8fafccc] font-bold">{selectedEntry.genderReflection || 'لا يوجد تأمل مسجل لهذه الحصة'}</p>
                        </div>
                        <div className="bubbly-card !p-8 border-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-success" />
                          <h3 className="text-xl font-black text-success mb-4 flex items-center gap-3"><span>💡</span> مقترحات التطوير المستقبلي</h3>
                          <p className="text-base leading-relaxed text-[#f8fafccc] font-bold">{selectedEntry.suggestions || 'لا توجد مقترحات مسجلة'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bubbly-card border-4 border-dashed border-border/50 opacity-40">
                  <div className="text-center space-y-8 animate-pulse">
                     <span className="text-[10rem] block">👈</span>
                     <p className="text-4xl font-black">اختر سجل تأمل من القائمة لعرضه</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
