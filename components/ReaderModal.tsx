
import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface ReaderModalProps {
  question: Question;
  onClose: () => void;
  onBookmark: (id: string) => void;
}

const ReaderModal: React.FC<ReaderModalProps> = ({ question, onClose, onBookmark }) => {
  const [fontSize, setFontSize] = useState(18);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const synth = useRef<SpeechSynthesis | null>(window.speechSynthesis);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setReadingProgress(isNaN(progress) ? 0 : progress);
  };

  useEffect(() => {
    const el = contentRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(question.id);
  };

  const speak = () => {
    if (!synth.current) return;
    if (isSpeaking) {
      synth.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const tmp = document.createElement("DIV");
    tmp.innerHTML = question.answerHTML;
    const text = `${question.title}. ${tmp.textContent || tmp.innerText}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    synth.current.speak(utterance);
  };

  useEffect(() => {
    return () => {
      synth.current?.cancel();
    };
  }, []);

  const handleMouseUp = () => {
    if (!isHighlightMode) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.className = "highlight";
      range.surroundContents(span);
      selection.removeAllRanges();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden no-print">
          <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${readingProgress}%` }}></div>
        </div>

        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h4 className="font-bold text-slate-400 text-xs hidden sm:block uppercase tracking-widest">{question.type}</h4>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={speak} className={`p-2.5 rounded-2xl transition-all active:scale-90 ${isSpeaking ? 'bg-red-100 text-red-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 gap-1">
              <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-xl font-bold">A-</button>
              <button onClick={() => setFontSize(f => Math.min(32, f + 2))} className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-xl font-bold">A+</button>
            </div>
            <button onClick={toggleBookmark} className={`p-2.5 rounded-2xl transition-all active:scale-90 ${question.bookmarked ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:bg-slate-100'}`}>
              {question.bookmarked ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>}
            </button>
            <button onClick={() => window.print()} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
          </div>
        </div>

        <div ref={contentRef} onMouseUp={handleMouseUp} className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar bg-slate-50 dark:bg-slate-900">
          <article className="max-w-3xl mx-auto">
            <header className="mb-12 text-center">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {question.tags.map(t => <span key={t} className="text-[10px] px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-bold uppercase">#{t}</span>)}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white leading-[1.3] font-serif">{question.title}</h1>
            </header>
            <div className="prose prose-slate dark:prose-invert max-w-none leading-[1.8] font-serif text-slate-700 dark:text-slate-300" style={{ fontSize: `${fontSize}px` }} dangerouslySetInnerHTML={{ __html: question.answerHTML }} />
            <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-xs italic text-center no-print">সর্বশেষ আপডেট: {new Date(question.updatedAt).toLocaleDateString('bn-BD')}</div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ReaderModal;
