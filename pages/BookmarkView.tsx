
import React from 'react';
import { Question } from '../types';

interface BookmarkViewProps {
  questions: Question[];
  onSelectQuestion: (q: Question) => void;
}

const BookmarkView: React.FC<BookmarkViewProps> = ({ questions, onSelectQuestion }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">সংরক্ষিত প্রশ্নসমূহ</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="text-left p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all flex gap-4 animate-in zoom-in duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold ${q.type === 'সংক্ষিপ্ত' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                    {q.type}
                  </span>
                  <span className="text-xs text-slate-400">অধ্যায় {q.chapterId}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{q.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {q.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
             <svg className="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-slate-400">আপনার কোন বুকমার্ক করা প্রশ্ন নেই।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkView;
