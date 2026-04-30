'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  BookOpen, Brain, TrendingUp, BarChart3, Target,
  PenTool, Zap, Activity, Award, Star, PieChart as PieIcon,
  MessageSquare, MessageCircle, Heart, Share2, Scale, GraduationCap, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ProfessionalDashboard() {
   const [stats, setStats] = useState<any>(null);
   const [currentUser, setCurrentUser] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [isLight, setIsLight] = useState(false);

   useEffect(() => {
      const check = () => setIsLight(document.documentElement.classList.contains('light'));
      check();
      const obs = new MutationObserver(check);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => obs.disconnect();
   }, []);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // 1. Fetch real user data from DB (includes gender, image, etc.)
            const meRes = await fetch('/api/auth/me');
            if (!meRes.ok) { 
               await fetch('/api/auth/logout', { method: 'POST' });
               window.location.href = '/login'; 
               return; 
            }
            const meData = await meRes.json();
            const user = meData.user;
            setCurrentUser(user);

            // 2. Fetch stats using real userId
            const res = await fetch(`/api/stats?userId=${user.id}`);
            const data = await res.json();
            setStats(data);
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center gap-8 bg-background">
         <div className="w-24 h-24 border-8 border-primary border-t-accent rounded-full animate-spin shadow-2xl" />
         <p className="text-4xl font-black text-shiny animate-pulse">تحميل بياناتك الملونة...</p>
      </div>
   );

   const axisColor = isLight ? 'rgba(30,27,75,0.7)' : 'rgba(255,255,255,0.7)';
   const labelColor = isLight ? '#1e1b4b' : '#fff';

   // 1. Line Chart: Diagnostic Evaluations - Pink
   const lineOption = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.95)', textStyle: { color: '#000' } },
      xAxis: { type: 'category', data: (stats?.diagnostics || []).map((_: any, i: number) => `ت${i + 1}`), axisLabel: { color: axisColor, fontWeight: 'bold' } },
      yAxis: { type: 'value', max: 100, axisLabel: { color: axisColor }, splitLine: { show: false } },
      series: [{ 
         data: (stats?.diagnostics || []).map((d: any) => d.percentage), 
         type: 'line', smooth: true, symbolSize: 12, 
         itemStyle: { color: '#fb7185', borderColor: isLight ? '#6366f1' : '#fff', borderWidth: 3 },
         lineStyle: { width: 6, color: '#fb7185' },
         areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(251,113,133,0.4)' }, { offset: 1, color: 'transparent' }] } },
         label: { show: true, position: 'top', color: labelColor, fontWeight: 'bold' }
      }]
   };

   // 2. Bar Chart: Weekly Activity - Cyan
   const barOption = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', formatter: '{b}: {c} تأمل' },
      xAxis: { type: 'category', data: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], axisLabel: { color: axisColor, fontWeight: 'bold' } },
      yAxis: { type: 'value', minInterval: 1, axisLabel: { color: axisColor }, splitLine: { show: false } },
      series: [{ 
         data: stats?.weeklyActivity || [0,0,0,0,0,0,0], 
         type: 'bar', barWidth: '35%', 
         itemStyle: { borderRadius: [10, 10, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#22d3ee' }, { offset: 1, color: '#0ea5e9' }] } } 
      }]
   };

   // 3. Radar Chart
   const radarOption = {
      backgroundColor: 'transparent',
      tooltip: {
         trigger: 'item',
         backgroundColor: isLight ? 'rgba(238,242,255,0.97)' : 'rgba(15,23,42,0.92)',
         borderColor: '#22d3ee',
         borderWidth: 1,
         textStyle: { color: isLight ? '#1e1b4b' : '#fff', fontWeight: 'bold', fontSize: 13 },
         formatter: (params: any) => {
            const indicators = ['المشاركة', 'العاطفة', 'التوقعات', 'السلوك', 'المهام'];
            const values = params.value;
            let html = `<div style="font-weight:900;margin-bottom:8px;color:#22d3ee;font-size:14px;">📊 ممارساتي</div>`;
            indicators.forEach((name, i) => {
               html += `<div style="display:flex;justify-content:space-between;gap:20px;margin:4px 0;">
                  <span style="opacity:0.85">${name}</span>
                  <span style="color:#22d3ee;font-weight:900">${values[i]}%</span>
               </div>`;
            });
            return html;
         }
      },
      radar: {
         indicator: [
            { name: 'المشاركة', max: 100 },
            { name: 'العاطفة', max: 100 },
            { name: 'التوقعات', max: 100 },
            { name: 'السلوك', max: 100 },
            { name: 'المهام', max: 100 }
         ],
         center: ['50%', '55%'],
         radius: '65%',
         shape: 'polygon',
         splitNumber: 5,
         axisName: { color: labelColor, fontWeight: 'bold', fontSize: 14, padding: [10, 10] },
         splitLine: { lineStyle: { color: isLight ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.2)', width: 2 } }, 
         splitArea: { show: false },
         axisLine: { lineStyle: { color: isLight ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.2)' } }
      },
      series: [{ 
         type: 'radar', 
         data: [{ 
            value: [
               stats?.latestAxis?.['توزيع المشاركة'] || 0,
               stats?.latestAxis?.['الجانب العاطفي'] || 0,
               stats?.latestAxis?.['التوقعات الأكاديمية'] || 0,
               stats?.latestAxis?.['السلوك والانضباط'] || 0,
               stats?.latestAxis?.['توزيع المهام'] || 0
            ], 
            name: 'ممارساتي',
            itemStyle: { color: '#22d3ee' }, // Cyan points
            lineStyle: { width: 5, color: '#22d3ee' },
            areaStyle: { color: 'rgba(34, 211, 238, 0.2)' },
            symbol: 'circle',
            symbolSize: 12,
            emphasis: {
               itemStyle: { color: isLight ? '#6366f1' : '#fff', borderColor: '#22d3ee', borderWidth: 3, shadowBlur: 10, shadowColor: '#22d3ee' },
               lineStyle: { width: 7 }
            }
         }] 
      }]
   };

   // 4. Pie Chart: Quiz Performance
   const pieOption = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      legend: { bottom: '0', left: 'center', textStyle: { color: isLight ? '#1e1b4b' : 'rgba(255,255,255,0.9)', fontWeight: 'bold' } },
      series: [{
         name: 'أداء الكويزات',
         type: 'pie',
         radius: ['40%', '70%'],
         avoidLabelOverlap: false,
         itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
         label: { show: true, position: 'outside', color: isLight ? '#1e1b4b' : '#fff', fontWeight: 'bold', formatter: '{c}%' },
         data: (stats?.quizPerformance || []).map((q: any) => ({
            value: q.percentage,
            name: q.title.replace('كويز ', ''),
            itemStyle: { color: q.title === 'كويز المعرفة' ? '#fde047' : q.title === 'كويز المواقف' ? '#22d3ee' : '#fb7185' }
         }))
      }]
   };

   return (
      <div className="relative min-h-screen pb-20 selection:bg-primary/30" dir="rtl">


         <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bubbly-card !p-6 md:!p-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-primary to-indigo text-white border-none shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
               <div className="flex items-center gap-8 relative z-10">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2rem] border-4 border-white/20 p-1 bg-white/10 backdrop-blur-xl overflow-hidden shadow-lg">
                     <img src={currentUser?.image || `https://ui-avatars.com/api/?name=${currentUser?.fullName}&background=fff&color=7c3aed`} className="w-full h-full object-cover rounded-[1.5rem]" alt="P" />
                  </div>
                  <div className="space-y-2">
                     <h1 className="text-4xl lg:text-5xl font-black mb-1">مرحباً، {currentUser?.fullName?.trim().split(' ')[0] || '...'} ✨</h1>
                     <p className="text-xl font-bold flex items-center gap-3 opacity-90"><Award size={24} className="text-yellow-300" /><span>{['onthe', 'أنثى', 'female'].includes(currentUser?.gender) ? 'أنتِ معلمة ملهِمة!' : 'أنتَ معلّم ملهِم!'}</span></p>
                  </div>
               </div>
               <div className="relative z-10">
                  <Link href="/diagnostic" className="btn-smooth bg-white text-primary !px-8 !py-4 !text-xl hover:scale-105 shadow-xl font-black">ابدأ تشخيصاً 🚀</Link>
               </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
               {[
                  { label: 'أفضل تقييم', value: `${stats?.diagnostics?.length > 0 ? Math.max(...stats.diagnostics.map((d: any) => d.percentage)) : 0}%`, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
                  { label: 'اليوميات', value: stats?.engagement?.reflections || 0, icon: BookOpen, color: 'text-secondary', bg: 'bg-secondary/10' },
                  { label: 'الكويزات', value: stats?.engagement?.quizzes || 0, icon: Brain, color: 'text-accent', bg: 'bg-accent/10' },
                  { label: 'زيارات الكتيب', value: stats?.engagement?.bookletVisits || 0, icon: BookOpen, color: 'text-success', bg: 'bg-success/10' }
               ].map((stat, i) => (
                  <motion.div key={i} className="bubbly-card !p-6 flex flex-col items-center text-center">
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner", stat.bg, stat.color)}><stat.icon size={28} strokeWidth={3} /></div>
                     <p className="text-[10px] font-black text-muted-foreground uppercase mb-1 tracking-widest">{stat.label}</p>
                     <h3 className="text-3xl font-black">{stat.value}</h3>
                  </motion.div>
               ))}
            </div>

            {/* Stacked Charts */}
            <div className="flex flex-col gap-10 mb-12">
               
               {/* 1. Radar Chart - REVERTED TO DARK SLATE TO MATCH OTHERS */}
               <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bubbly-card !p-6 md:!p-12 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                  <div className="relative z-10 flex flex-col items-center gap-10">
                     <div className="text-center space-y-4">
                        <h2 className="text-5xl lg:text-6xl font-black flex items-center justify-center gap-6">
                           <span className="text-5xl">🎯</span>
                           <span>تحليل ممارساتك</span>
                        </h2>
                        <p className="text-xl font-bold opacity-80 italic">رؤية بيداغوجية مستوحاة من ألوان نظامك.</p>
                     </div>
                     <div className="w-full h-[500px]">
                        <ReactECharts option={radarOption} style={{ height: '100%' }} />
                     </div>
                  </div>
               </motion.div>

               {/* Other Charts - Already Dark Slate */}
               <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bubbly-card !p-6 md:!p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                     <div className="md:w-1/4 text-center md:text-right space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto md:mr-0 mb-4 shadow-lg"><PieIcon size={32} className="text-primary" /></div>
                        <h2 className="text-3xl font-black leading-tight">أداء الكويزات</h2>
                     </div>
                     <div className="md:w-3/4 w-full h-[320px]">
                        <ReactECharts option={pieOption} style={{ height: '100%' }} />
                     </div>
                  </div>
               </motion.div>

               <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bubbly-card !p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -ml-32 -mt-32" />
                  <div className="relative z-10 flex flex-col md:flex-row-reverse items-center gap-10">
                     <div className="md:w-1/4 text-center md:text-left space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto md:ml-0 mb-4 shadow-lg"><Activity size={32} className="text-secondary" /></div>
                        <h2 className="text-3xl font-black leading-tight">النشاط الأسبوعي</h2>
                     </div>
                     <div className="md:w-3/4 w-full h-[320px]">
                        <ReactECharts option={barOption} style={{ height: '100%' }} />
                     </div>
                  </div>
               </motion.div>

               <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bubbly-card !p-8 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] -mr-32 -mb-32" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                     <div className="md:w-1/4 text-center md:text-right space-y-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto md:mr-0 mb-4 shadow-lg"><TrendingUp size={32} className="text-pink-400" /></div>
                        <h2 className="text-3xl font-black leading-tight">تقييمات التشخيص</h2>
                     </div>
                     <div className="md:w-3/4 w-full h-[320px]">
                        <ReactECharts option={lineOption} style={{ height: '100%' }} />
                     </div>
                  </div>
               </motion.div>

            </div>

            {/* Social Engagement Summary */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bubbly-card !p-10 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden mb-12">
               <h2 className="text-3xl font-black mb-12 flex items-center gap-6"><Share2 size={36} className="text-primary" /><span>تفاعلك في المجتمع التربوي</span></h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { label: 'المنشورات', value: stats?.engagement?.posts || 0, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/20' },
                     { label: 'التعليقات', value: stats?.engagement?.comments || 0, icon: MessageCircle, color: 'text-secondary', bg: 'bg-secondary/20' },
                     { label: 'الإعجابات', value: stats?.engagement?.likes || 0, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/20' }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-slate-800/50 shadow-lg border border-white/5 group hover:border-primary transition-all">
                        <div className={cn("w-16 h-16 rounded-[1.2rem] flex items-center justify-center group-hover:scale-110 transition-transform", item.bg, item.color)}>
                           <item.icon size={32} strokeWidth={3} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                           <h3 className="text-4xl font-black mt-1">{item.value}</h3>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>

         </div>
      </div>
   );
}
