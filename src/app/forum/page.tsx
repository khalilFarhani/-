'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  user: { fullName: string; image: string };
  createdAt: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    fullName: string;
    image: string;
    gender: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface TopUser {
  id: number;
  fullName: string;
  gender: string;
  image: string;
  _count: {
    forumPosts: number;
  };
}

interface RecentComment {
  id: number;
  content: string;
  user: { fullName: string };
  post: { title: string };
  createdAt: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser, setCurrentUser] = useState<{ id: string, fullName: string, image: string, gender: string } | null>(null);

  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [postComments, setPostComments] = useState<Record<number, Comment[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>({});

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'مواقف من الفصل' });

  const tabs = [
    { name: 'الكل', icon: '🌐' },
    { name: 'مواقف من الفصل', icon: '📌' },
    { name: 'تجارب ناجحة', icon: '💡' },
    { name: 'أسئلة جندرية', icon: '❓' },
    { name: 'نقاشات الكتيب', icon: '📖' }
  ];

  const fetchData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      const [postsRes, topRes, commentsRes] = await Promise.all([
        fetch('/api/forum/posts'),
        fetch('/api/users/top'),
        fetch('/api/forum/comments/recent')
      ]);
      const postsData = await postsRes.json();
      const topData = await topRes.json();
      const commentsData = await commentsRes.json();
      if (Array.isArray(postsData)) setPosts(postsData);
      if (Array.isArray(topData)) setTopUsers(topData);
      if (Array.isArray(commentsData)) setRecentComments(commentsData);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }

    const url = isEditing ? `/api/forum/posts/${editingPostId}` : '/api/forum/posts';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPost, userId: currentUser.id })
    });

    if (res.ok) {
      setShowCreateModal(false);
      setIsEditing(false);
      setEditingPostId(null);
      setNewPost({ title: '', content: '', category: 'مواقف من الفصل' });
      fetchData();
    } else {
      alert('فشلت العملية');
    }
  };

  const handleEditClick = (post: Post) => {
    setNewPost({ title: post.title, content: post.content, category: post.category });
    setEditingPostId(post.id);
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

    const res = await fetch(`/api/forum/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
    } else {
      alert('فشل الحذف');
    }
  };

  const handleLike = async (postId: number) => {
    if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }

    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === postId) {
        return { ...p, _count: { ...p._count, likes: p._count.likes + 1 } };
      }
      return p;
    }));

    try {
      await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      fetchData();
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const toggleComments = async (postId: number) => {
    if (expandedComments[postId]) {
      setExpandedComments({ ...expandedComments, [postId]: false });
      return;
    }

    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPostComments({ ...postComments, [postId]: data });
        setExpandedComments({ ...expandedComments, [postId]: true });
      }
    } catch (error) { console.error(error); }
  };

  const handleAddComment = async (postId: number) => {
    if (!currentUser) { alert('يرجى تسجيل الدخول أولاً'); return; }
    const text = newCommentText[postId];
    if (!text?.trim()) return;

    const tempText = text;
    setNewCommentText({ ...newCommentText, [postId]: '' });

    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === postId) {
        return { ...p, _count: { ...p._count, comments: p._count.comments + 1 } };
      }
      return p;
    }));

    try {
      const resPost = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, content: tempText })
      });

      if (resPost.ok) {
        const res = await fetch(`/api/forum/posts/${postId}/comments`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setPostComments({ ...postComments, [postId]: data });
        }
        fetchData();
      }
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  const filteredPosts = posts
    .filter(p => activeTab === 'الكل' || p.category === activeTab)
    .filter(p => p.title.includes(searchQuery) || p.content.includes(searchQuery));

  return (
    <div className="min-h-screen bg-background text-foreground text-right font-sans selection:bg-primary/30 flex flex-col items-center w-full" dir="rtl">
      
      {/* Immersive Header */}
      <header className="w-full smooth-glass border-b border-border p-6 md:p-10 sticky top-0 z-50 animate-soft">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="space-y-2">
               <Link href="/dashboard" className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  لوحة القيادة
               </Link>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight"><span className="text-gradient">المنتدى</span> التفاعلي 🤝</h1>
            </div>
            <div className="hidden lg:flex relative group">
              <input 
                type="text" 
                placeholder="ابحث في النقاشات..." 
                className="input-smooth !py-3 !px-12 w-96 !rounded-full" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/chat" className="btn-smooth btn-smooth-outline !px-8 !py-4 group">
               <span>الدردشة الحية</span>
               <div className="relative">
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-2xl group-hover:animate-bounce inline-block">💬</span>
               </div>
            </Link>
            <button 
              onClick={() => { setIsEditing(false); setNewPost({ title: '', content: '', category: 'مواقف من الفصل' }); setShowCreateModal(true); }} 
              className="btn-smooth btn-smooth-primary !px-10 !py-4 shadow-xl"
            >
              + منشور جديد
            </button>

            {currentUser && (
              <div className="border-r border-border/50 pr-6 mr-2">
                <div className="w-14 h-14 rounded-2xl border-2 border-primary overflow-hidden shadow-2xl hover:scale-110 transition-transform cursor-pointer relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-0 group-hover:opacity-30 transition-opacity" />
                  <img src={currentUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=7c3aed&color=fff`} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-12 p-6 md:p-12 relative z-10">
        
        {/* Main Feed Content */}
        <div className="flex-1 space-y-12">
          {/* Navigation Tabs */}
          <nav className="flex gap-4 overflow-x-auto no-scrollbar pb-6 sticky top-32 z-40 animate-soft">
            {tabs.map((tab) => (
              <button 
                key={tab.name} 
                onClick={() => setActiveTab(tab.name)} 
                className={`px-8 py-4 rounded-full font-black transition-all border-2 whitespace-nowrap flex items-center gap-3 shadow-sm
                  ${activeTab === tab.name 
                    ? 'bg-primary border-primary text-white shadow-xl scale-105' 
                    : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:shadow-lg'}`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>

          <main className="space-y-12">
            {loading ? (
              <div className="space-y-12">
                {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[3rem] bg-card animate-pulse border border-border" />)}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bubbly-card text-center py-24 space-y-6">
                 <div className="text-9xl opacity-10">🏜️</div>
                 <h2 className="text-3xl font-black opacity-50">لا يوجد منشورات في هذا التصنيف حالياً</h2>
                 <button onClick={() => setActiveTab('الكل')} className="btn-smooth btn-smooth-outline !px-10">عرض كل المنشورات</button>
              </div>
            ) : filteredPosts.map((post) => (
              <article key={post.id} className="bubbly-card !p-0 hover:border-primary/50 transition-all duration-500 group animate-soft overflow-hidden">
                {/* Header Info */}
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                         <div className={`absolute inset-0 bg-gradient-to-tr ${post.user.gender === 'onthe' ? 'from-primary to-accent' : 'from-secondary to-primary'} rounded-3xl blur opacity-20`} />
                         <div className={`w-20 h-20 rounded-3xl border-2 ${post.user.gender === 'onthe' ? 'border-primary' : 'border-secondary'} overflow-hidden shadow-2xl relative z-10`}>
                            <img src={post.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.fullName)}`} className="w-full h-full object-cover" />
                         </div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">{post.user.fullName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{post.category}</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                           <span className="text-xs font-bold text-muted-foreground">{new Date(post.createdAt).toLocaleDateString('ar-TN')}</span>
                        </div>
                      </div>
                    </div>

                    {currentUser && Number(currentUser.id) === post.userId && (
                      <div className="flex gap-3">
                        <button onClick={() => handleEditClick(post)} className="w-12 h-12 rounded-2xl bg-muted/50 hover:bg-secondary/20 flex items-center justify-center text-xl transition-all border border-border/50 shadow-sm" title="تعديل">✏️</button>
                        <button onClick={() => handleDeletePost(post.id)} className="w-12 h-12 rounded-2xl bg-muted/50 hover:bg-danger/20 flex items-center justify-center text-xl transition-all border border-border/50 shadow-sm text-danger" title="حذف">🗑️</button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-4xl font-black leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-500">{post.title}</h2>
                    <p className="text-muted-foreground text-2xl font-bold leading-relaxed border-r-4 border-muted/20 pr-8">{post.content}</p>
                    {post.imageUrl && (
                      <div className="rounded-[3rem] overflow-hidden border-2 border-border shadow-2xl transform transition-transform group-hover:scale-[1.01] duration-700">
                        <img src={post.imageUrl} className="w-full max-h-[600px] object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 md:px-12 py-8 bg-card/50 backdrop-blur-2xl border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex gap-10 items-center">
                    <button 
                      onClick={() => handleLike(post.id)} 
                      className="flex items-center gap-4 group/like transition-all hover:scale-110 active:scale-90"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all border-2 
                        ${(post._count?.likes || 0) > 0 ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' : 'bg-muted border-transparent group-hover/like:border-primary/30'}`}>
                        <span className={(post._count?.likes || 0) > 0 ? 'animate-bounce' : ''}>❤️</span>
                      </div>
                      <span className={`text-xl font-black ${(post._count?.likes || 0) > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{post._count?.likes || 0}</span>
                    </button>

                    <button 
                      onClick={() => toggleComments(post.id)} 
                      className={`flex items-center gap-4 transition-all hover:scale-110 group/comment ${expandedComments[post.id] ? 'text-primary' : ''}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all border-2 
                        ${expandedComments[post.id] ? 'bg-primary/20 border-primary' : 'bg-muted border-transparent group-hover/comment:border-primary/30'}`}>
                        💬
                      </div>
                      <span className="text-xl font-black">{post._count?.comments || 0}</span>
                    </button>
                  </div>

                  <div className="flex-1 w-full max-w-xl">
                    <div className="relative group/input">
                      <input
                        type="text"
                        placeholder="أضف تعليقك التربوي..."
                        className="input-smooth !py-4 !px-8 !rounded-2xl !bg-background !border-2 group-hover/input:!border-primary/50"
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 btn-smooth btn-smooth-primary !py-2 !px-6 !rounded-xl !text-sm"
                      >
                        نشر
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Comments */}
                {expandedComments[post.id] && (
                  <div className="p-8 md:p-12 pt-0 animate-soft space-y-6">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-4">
                      {postComments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-4 bg-muted/50 p-6 rounded-[2rem] border border-border shadow-inner">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-md">
                            <img src={comment.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.fullName)}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-center">
                               <p className="text-sm font-black text-primary">{comment.user.fullName}</p>
                               <p className="text-[10px] font-bold text-muted-foreground">{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <p className="text-lg font-bold text-foreground/80 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {postComments[post.id]?.length === 0 && (
                         <div className="text-center py-10 opacity-30 font-black">لا توجد تعليقات بعد... كن الأول! 🌟</div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </main>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/80 backdrop-blur-3xl animate-soft">
          <div className="bubbly-card w-full max-w-2xl !p-12 border-2 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-5xl font-black text-gradient">{isEditing ? 'تعديل المنشور' : 'منشور جديد'}</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl hover:bg-danger/20 text-muted-foreground hover:text-danger transition-all">✕</button>
            </div>
            <form onSubmit={handleCreateOrUpdatePost} className="space-y-8">
              <div className="space-y-2">
                 <label className="text-sm font-black opacity-50 px-2">عنوان المنشور</label>
                 <input required type="text" placeholder="ماذا يدور في ذهنك؟" className="input-smooth !py-5 !px-8 !text-2xl !font-black !rounded-3xl" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-black opacity-50 px-2">التصنيف</label>
                 <select className="input-smooth !py-5 !px-8 !text-xl !font-black !rounded-3xl appearance-none cursor-pointer" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}>
                   {tabs.slice(1).map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-black opacity-50 px-2">المحتوى</label>
                 <textarea required rows={6} placeholder="اكتب بالتفصيل هنا..." className="input-smooth !py-6 !px-8 !text-2xl !font-black !rounded-[2rem] resize-none" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
              </div>
              <button type="submit" className="w-full btn-smooth btn-smooth-primary !py-8 !text-2xl !font-black !rounded-3xl shadow-2xl">
                {isEditing ? 'حفظ التعديلات' : 'نشر المنشور الآن ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
