
import React, { useState, useRef, useEffect } from 'react';
import { Question, QuestionType, Chapter } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import { exportData, importData } from '../services/db';

interface AdminPanelProps {
  questions: Question[];
  chapters: Chapter[];
  onUpdateQuestions: (qs: Question[]) => void;
  onUpdateChapters: (overrides: Record<number, string>) => void;
  isAdmin: boolean;
  onLogin: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ questions, chapters, onUpdateQuestions, onUpdateChapters, isAdmin, onLogin }) => {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [tempChapterNames, setTempChapterNames] = useState<Record<number, string>>({});

  const editorRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    chapterId: number;
    type: QuestionType;
    content: string;
    tags: string;
  }>({
    title: '',
    chapterId: 1,
    type: 'সংক্ষিপ্ত',
    content: '',
    tags: ''
  });

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
      triggerToast("সফলভাবে লগইন করা হয়েছে");
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const exec = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.content || formData.content === '<br>') {
      alert("শিরোনাম এবং উত্তর অবশ্যই পূরণ করতে হবে!");
      return;
    }

    const newQuestion: Question = {
      id: editingId || crypto.randomUUID(),
      title: formData.title,
      chapterId: formData.chapterId,
      type: formData.type,
      answerHTML: formData.content,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      bookmarked: editingId ? (questions.find(q => q.id === editingId)?.bookmarked || false) : false,
      updatedAt: Date.now()
    };

    if (editingId) {
      onUpdateQuestions(questions.map(q => q.id === editingId ? newQuestion : q));
      triggerToast("প্রশ্নটি আপডেট করা হয়েছে");
    } else {
      onUpdateQuestions([...questions, newQuestion]);
      triggerToast("নতুন প্রশ্ন যুক্ত করা হয়েছে");
    }

    setFormData({ title: '', chapterId: 1, type: 'সংক্ষিপ্ত', content: '', tags: '' });
    if (editorRef.current) editorRef.current.innerHTML = '';
    setEditingId(null);
    setIsSaved(true);
  };

  const startEdit = (q: Question) => {
    setFormData({
      title: q.title,
      chapterId: q.chapterId,
      type: q.type,
      content: q.answerHTML,
      tags: q.tags.join(', ')
    });
    setEditingId(q.id);
    if (editorRef.current) editorRef.current.innerHTML = q.answerHTML;
    setIsSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChapterRenameSave = () => {
    onUpdateChapters(tempChapterNames);
    setShowChapterModal(false);
    triggerToast("অধ্যায়ের নাম আপডেট করা হয়েছে");
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center text-white shadow-lg">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">অ্যাডমিন প্রবেশ</h2>
        <p className="text-slate-400 text-center mb-8">কনটেন্ট ব্যবস্থাপনার জন্য পাসওয়ার্ড দিন</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input 
              type="password"
              autoFocus
              className={`w-full p-4 pl-12 rounded-2xl border-2 transition-all outline-none text-center text-xl tracking-widest ${loginError ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড"
            />
            <svg className="absolute left-4 top-4.5 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">লগইন করুন</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-medium">{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">কনটেন্ট ম্যানেজার</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-slate-500 font-medium">অ্যাডমিন হিসেবে লগইন আছেন</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              const overrides: Record<number, string> = {};
              chapters.forEach(c => overrides[c.id] = c.title);
              setTempChapterNames(overrides);
              setShowChapterModal(true);
            }} 
            className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md"
          >
            অধ্যায় রিনেম করুন
          </button>
          <button onClick={() => exportData(questions, tempChapterNames)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
            ব্যাকআপ (.json)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingId ? 'প্রশ্ন এডিট করুন' : 'নতুন প্রশ্ন যুক্ত করুন'}
                {!isSaved && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">পরিবর্তন সেভ করা হয়নি</span>}
                {isSaved && editingId && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded ml-2 uppercase tracking-wider">সংরক্ষিত</span>}
              </h3>
              {editingId && (
                <button 
                  onClick={() => {
                    setEditingId(null); 
                    setFormData({title: '', chapterId: 1, type: 'সংক্ষিপ্ত', content: '', tags: ''});
                    if (editorRef.current) editorRef.current.innerHTML = '';
                  }} 
                  className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  বাতিল
                </button>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">অধ্যায় নির্বাচন</label>
                  <select 
                    className="w-full p-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 outline-none transition-all font-bold"
                    value={formData.chapterId}
                    onChange={(e) => setFormData({...formData, chapterId: parseInt(e.target.value)})}
                  >
                    {chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 ml-1">প্রশ্নের ধরণ</label>
                  <select 
                    className="w-full p-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 outline-none transition-all font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as QuestionType})}
                  >
                    <option value="সংক্ষিপ্ত">সংক্ষিপ্ত প্রশ্ন</option>
                    <option value="রচনামূলক">রচনামূলক প্রশ্ন</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">প্রশ্নের শিরোনাম</label>
                <input 
                  type="text"
                  className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 outline-none transition-all text-lg font-bold"
                  placeholder="প্রশ্নের মূল শিরোনাম লিখুন..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* WYSIWYG EDITOR */}
              <div className="space-y-2 relative">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">বিস্তারিত উত্তর (এডিটর)</label>
                <div className="border-2 border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-900 flex flex-col">
                  {/* Sticky Toolbar */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap gap-1 md:gap-2">
                    <div className="flex gap-1 border-r border-slate-200 pr-2">
                      <button onClick={() => exec('undo')} className="p-2 hover:bg-slate-100 rounded" title="Undo"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg></button>
                      <button onClick={() => exec('redo')} className="p-2 hover:bg-slate-100 rounded" title="Redo"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/></svg></button>
                    </div>
                    <div className="flex gap-1 border-r border-slate-200 pr-2">
                      <button onClick={() => exec('bold')} className="p-2 hover:bg-slate-100 rounded font-bold" title="Bold">B</button>
                      <button onClick={() => exec('italic')} className="p-2 hover:bg-slate-100 rounded italic font-serif" title="Italic">I</button>
                      <button onClick={() => exec('underline')} className="p-2 hover:bg-slate-100 rounded underline" title="Underline">U</button>
                    </div>
                    <div className="flex gap-1 border-r border-slate-200 pr-2">
                      <select onChange={(e) => exec('fontSize', e.target.value)} className="bg-transparent text-sm font-bold p-1 outline-none" title="Font Size">
                        <option value="3">সাধারণ</option>
                        <option value="4">মাঝারি</option>
                        <option value="5">বড়</option>
                        <option value="6">অনেক বড়</option>
                        <option value="7">বিশাল</option>
                      </select>
                      <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-8 h-8 p-1 border-none bg-transparent cursor-pointer" title="Text Color" />
                      <input type="color" onChange={(e) => exec('hiliteColor', e.target.value)} className="w-8 h-8 p-1 border-none bg-transparent cursor-pointer" defaultValue="#ffff00" title="Highlight" />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-slate-100 rounded" title="Bullet List">• List</button>
                      <button onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-slate-100 rounded" title="Numbered List">1. List</button>
                      <button onClick={() => {
                        const url = prompt("লিঙ্ক দিন (URL):", "https://");
                        if (url) exec('createLink', url);
                      }} className="p-2 hover:bg-slate-100 rounded" title="Link">🔗</button>
                    </div>
                  </div>
                  
                  {/* Canvas */}
                  <div 
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => {
                      setFormData({...formData, content: e.currentTarget.innerHTML});
                      setIsSaved(false);
                    }}
                    className="min-h-[400px] p-8 focus:outline-none prose dark:prose-invert max-w-none bg-white dark:bg-slate-900 leading-relaxed font-serif"
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
                <input 
                  type="text"
                  className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-blue-500 outline-none transition-all"
                  placeholder="উদা: তত্ত্ব, সমাজতত্ত্ব, আধুনিকতা..."
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.98] text-lg"
              >
                {editingId ? 'পরিবর্তনগুলো সেভ করুন' : 'নতুন প্রশ্ন পাবলিশ করুন'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 h-fit">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
              সব প্রশ্নসমূহ
              <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">{questions.length} টি</span>
            </h3>
            <div className="space-y-3 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
              {questions.length > 0 ? (
                questions.sort((a,b) => b.updatedAt - a.updatedAt).map(q => (
                  <div key={q.id} className="group bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                    <div className="mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">অধ্যায় {q.chapterId} • {q.type}</span>
                      <h4 className="font-bold text-sm leading-snug line-clamp-2 mt-1">{q.title}</h4>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEdit(q)}
                        className="flex-1 text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white font-bold transition-all"
                      >
                        এডিট
                      </button>
                      <button 
                        onClick={() => { if(confirm("মুছে ফেলতে চান?")) onUpdateQuestions(questions.filter(item => item.id !== q.id)); }}
                        className="flex-1 text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded-lg hover:bg-red-600 hover:text-white font-bold transition-all"
                      >
                        ডিলিট
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 italic text-sm">কোন তথ্য পাওয়া যায়নি</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Rename Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-amber-50 dark:bg-amber-900/10">
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400">অধ্যায় রিনেম করুন</h3>
              <button onClick={() => setShowChapterModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
              {chapters.map(ch => (
                <div key={ch.id} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">অধ্যায় {ch.id}</label>
                  <input 
                    type="text"
                    className="w-full p-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-amber-500 outline-none transition-all font-bold"
                    defaultValue={ch.title}
                    onChange={(e) => setTempChapterNames({...tempChapterNames, [ch.id]: e.target.value})}
                  />
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button onClick={() => setShowChapterModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all">বাতিল</button>
              <button onClick={handleChapterRenameSave} className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">সেভ করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
