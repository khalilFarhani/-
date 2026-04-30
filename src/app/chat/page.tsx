'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Scale, GraduationCap, Users, BookOpen } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  image: string;
  gender: string;
}

interface Message {
  id: number;
  userId: number;
  content: string;
  type: 'text' | 'image' | 'audio' | 'emoji';
  fileUrl?: string;
  createdAt: string;
  user: {
    fullName: string;
    gender: string;
    image?: string;
  };
}

export default function ProChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiGrid, setShowEmojiGrid] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '🔥', '👏', '😮', '😍', '🤔', '🙌', '💡', '✅', '📚', '🤝', '🏫'];

  const fetchData = async () => {
    try {
      const [meRes, msgsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/chat/messages')
      ]);

      if (!meRes.ok) {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
        return;
      }

      const meData = await meRes.json();
      if (meData.user) setCurrentUser(meData.user);
      const msgsData = await msgsRes.json();
      if (Array.isArray(msgsData)) setMessages(msgsData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Removed automatic scroll to bottom per user request
  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  //   }
  // }, [messages]);

  const handleSendMessage = async (text: string, type: 'text' | 'emoji' | 'audio' | 'image' = 'text', fileUrl?: string) => {
    if ((!text.trim() && !fileUrl) || !currentUser) return;
    
    const temp: any = {
      id: Date.now(),
      userId: Number(currentUser.id),
      content: text,
      type: type,
      fileUrl: fileUrl,
      createdAt: new Date().toISOString(),
      user: { fullName: currentUser.fullName, gender: currentUser.gender, image: currentUser.image }
    };
    setMessages(prev => [...prev, temp]);

    await fetch('/api/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ content: text, userId: currentUser.id, type: type, fileUrl: fileUrl })
    });
    fetchData();
  };

  const handleUpdateMessage = async (id: number) => {
    if (!editValue.trim()) return;
    await fetch(`/api/chat/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editValue })
    });
    setEditingId(null);
    setEditValue('');
    fetchData();
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('حذف هذه الرسالة؟')) return;
    await fetch(`/api/chat/messages/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          await handleSendMessage('رسالة صوتية', 'audio', base64);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      const timer = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      (recorder as any).timer = timer;
    } catch (err) { alert('يجب السماح بالوصول للميكروفون'); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval((mediaRecorderRef.current as any).timer);
      setIsRecording(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden selection:bg-primary/30" dir="rtl">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Pedagogical Background Decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
         <div className="absolute top-[10%] left-[5%] animate-float"><Scale size={130} /></div>
         <div className="absolute top-[40%] right-[2%] animate-float-delayed"><GraduationCap size={150} /></div>
         <div className="absolute bottom-[20%] left-[8%] animate-float"><Users size={140} /></div>
         <div className="absolute bottom-[5%] right-[10%] animate-float-delayed"><BookOpen size={100} /></div>
      </div>

      {/* Modern Header */}
      <header className="px-8 py-6 smooth-glass border-b border-border/50 flex justify-between items-center z-50 animate-soft">
         <div className="flex items-center gap-8">
            <Link href="/forum" className="btn-smooth btn-smooth-outline !p-3 group">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-xl border-2 border-white/20">💬</div>
               <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-gradient">الدردشة الجماعية</h1>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                     {messages.length} رسالة تربوية
                  </p>
               </div>
            </div>
         </div>

         {currentUser && (
           <div className="flex items-center gap-4 bg-card border border-border p-2 pr-6 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer group">
              <div className="text-right">
                 <p className="text-sm font-black">{currentUser.fullName}</p>
                 <p className="text-[10px] font-bold text-muted-foreground">متصل الآن</p>
              </div>
              <div className="w-12 h-12 rounded-xl border-2 border-primary overflow-hidden shadow-lg relative">
                 <img src={currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=7c3aed&color=fff`} className="w-full h-full object-cover" />
              </div>
           </div>
         )}
      </header>

      {/* Chat Messages Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 md:px-[15%] space-y-10 no-scrollbar relative z-10 scroll-smooth">
         {loading ? (
           <div className="h-full flex flex-col justify-center items-center gap-6">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl" />
              <p className="font-black text-2xl text-muted-foreground animate-pulse">جاري تحضير المحادثة...</p>
           </div>
         ) : messages.length === 0 ? (
           <div className="h-full flex flex-col justify-center items-center text-center space-y-8 opacity-30">
              <div className="text-9xl">🌿</div>
              <h2 className="text-4xl font-black">المحادثة فارغة... كن أول من يترك بصمة تربوية!</h2>
           </div>
         ) : messages.map((msg, idx) => {
           const isMe = msg.userId === Number(currentUser?.id);
           const isEmoji = msg.type === 'emoji';

           return (
             <div key={msg.id} className={`flex ${isMe ? 'flex-row' : 'flex-row-reverse'} gap-6 animate-soft group items-end`}>
                <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 shadow-2xl transition-transform group-hover:scale-110 ${isMe ? 'border-primary' : 'border-secondary'}`}>
                   <img src={msg.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user.fullName)}`} className="w-full h-full object-cover" />
                </div>

                <div className={`flex flex-col ${isMe ? 'items-start' : 'items-end'} max-w-[80%] relative`}>
                   <div className={`flex items-center gap-3 mb-2 px-3 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                      <p className="text-xs font-black text-muted-foreground">{isMe ? 'أنت' : msg.user.fullName}</p>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground opacity-30" />
                      <p className="text-[10px] font-bold text-muted-foreground opacity-50">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                   
                   <div className={`transition-all duration-500 relative group/msg
                     ${isEmoji ? 'bg-transparent text-6xl py-2 hover:scale-110' : 
                       isMe ? 'bg-gradient-to-br from-primary to-accent text-white p-4 px-6 rounded-2xl rounded-tl-none shadow-lg' 
                            : 'bg-card text-foreground p-4 px-6 rounded-2xl rounded-tr-none shadow-lg border border-border/50'}
                   `}>
                      {editingId === msg.id ? (
                        <div className="flex flex-col gap-4 min-w-[280px]">
                           <textarea value={editValue} onChange={e => setEditValue(e.target.value)} className="input-smooth !bg-background/20 !border-white/30 !text-white !p-4 !text-xl !font-bold outline-none" />
                           <div className="flex gap-3 justify-end">
                              <button onClick={() => handleUpdateMessage(msg.id)} className="btn-smooth !bg-white !text-primary !py-2 !px-6 !text-sm font-black">حفظ</button>
                              <button onClick={() => setEditingId(null)} className="text-white/70 text-sm font-bold hover:text-white">إلغاء</button>
                           </div>
                        </div>
                      ) : (
                        <div className="relative">
                          {msg.type === 'text' && <p className="text-base font-bold leading-relaxed">{msg.content}</p>}
                          {msg.type === 'emoji' && <p className="animate-bounce-slow">{msg.content}</p>}
                          {msg.type === 'image' && (
                             <div className="rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
                                <img src={msg.fileUrl} className="max-h-[500px] w-full object-cover" />
                             </div>
                          )}
                          {msg.type === 'audio' && (
                            <div className="flex items-center gap-8 min-w-[300px]">
                               <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl shadow-inner animate-pulse">🎙️</div>
                               <audio controls className="h-10 filter invert opacity-90 w-full scale-110">
                                  <source src={msg.fileUrl} type="audio/webm" />
                               </audio>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!isEmoji && !editingId && (
                        <div className={`mt-4 flex items-center gap-2 opacity-50 text-[10px] font-black ${isMe ? 'justify-start' : 'justify-end'}`}>
                           <span>{isMe ? 'تم الإرسال' : 'تم الاستلام'}</span>
                           <span className="text-xs">✓✓</span>
                        </div>
                      )}
                   </div>

                   {/* Float Actions */}
                   {isMe && !editingId && (
                     <div className="absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => { setEditingId(msg.id); setEditValue(msg.content); }} className="w-10 h-10 rounded-xl bg-card border border-border shadow-xl flex items-center justify-center text-secondary hover:scale-110 transition-transform">✏️</button>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="w-10 h-10 rounded-xl bg-card border border-border shadow-xl flex items-center justify-center text-danger hover:scale-110 transition-transform">🗑️</button>
                     </div>
                   )}
                </div>
             </div>
           );
         })}
      </main>

      {/* Modern Input Bar */}
      <footer className="p-8 smooth-glass border-t border-border/50 z-50">
         <div className="max-w-5xl mx-auto space-y-6">
            {showEmojiGrid && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 p-8 bubbly-card border-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] grid grid-cols-8 gap-4 animate-soft">
                 {emojis.map(e => (
                   <button key={e} onClick={() => { handleSendMessage(e, 'emoji'); setShowEmojiGrid(false); }} className="text-4xl hover:scale-150 transition-all p-3 hover:bg-muted rounded-2xl transform active:scale-90">{e}</button>
                 ))}
              </div>
            )}

            {isRecording && (
              <div className="absolute inset-x-0 bottom-full bg-card/95 backdrop-blur-3xl p-10 flex items-center justify-between z-[60] animate-soft border-t-2 border-primary/30 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
                 <div className="flex items-center gap-10">
                    <div className="relative">
                       <div className="w-16 h-16 bg-red-500 rounded-full animate-ping opacity-30 absolute inset-0" />
                       <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl relative z-10 shadow-xl">🎙️</div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-3xl font-black text-gradient">جاري تسجيل فكرتك...</p>
                       <p className="text-xl font-bold opacity-50 tracking-widest">{recordingTime} ثانية</p>
                    </div>
                 </div>
                 <button onClick={stopRecording} className="btn-smooth btn-smooth-primary !px-16 !py-6 !text-2xl font-black shadow-[0_20px_40px_rgba(var(--primary-rgb),0.4)] animate-bounce">إيقاف وإرسال الآن 🚀</button>
              </div>
            )}

            <div className="flex items-center gap-6">
               <div className="flex gap-3">
                  <button type="button" onClick={() => setShowEmojiGrid(!showEmojiGrid)} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl border-2 transition-all ${showEmojiGrid ? 'bg-primary border-primary text-white' : 'bg-card border-border hover:border-primary/50'}`}>😊</button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-[1.5rem] bg-card border-2 border-border hover:border-primary/50 flex items-center justify-center text-3xl transition-all">📷</button>
               </div>
               
               <input type="file" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                     const reader = new FileReader();
                     reader.onload = async (ev) => handleSendMessage('صورة', 'image', ev.target?.result as string);
                     reader.readAsDataURL(file);
                  }
               }} className="hidden" accept="image/*" />

               <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="text" 
                    placeholder="شارك زملاءك فكرة تربوية أو موقفاً ملهماً..." 
                    className="w-full bg-card border-2 border-border rounded-[2rem] py-6 px-10 text-2xl font-bold focus:border-primary transition-all outline-none shadow-inner relative z-10"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (handleSendMessage(newMessage), setNewMessage(''))}
                  />
               </div>

               <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={startRecording}
                    className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl border-2 transition-all shadow-xl
                      ${isRecording ? 'bg-red-500 border-red-500 animate-pulse text-white' : 'bg-card border-border hover:border-primary/50'}
                    `}
                  >
                    🎙️
                  </button>

                  <button onClick={() => { handleSendMessage(newMessage); setNewMessage(''); }} className="w-20 h-20 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-2xl active:scale-90 transition-all group">
                     <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 group-hover:translate-x-2 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
               </div>
            </div>
         </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .smooth-glass {
           background: rgba(var(--card-rgb), 0.7);
           backdrop-filter: blur(20px) saturate(180%);
           -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-20px) scale(1.1); } }
      `}</style>
    </div>
  );
}
