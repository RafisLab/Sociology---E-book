
import React, { useState } from 'react';
import { Chapter, Question, QuestionType } from '../types';

interface ChapterViewProps {
  chapter: Chapter;
  questions: Question[];
  onSelectQuestion: (q: Question) => void;
}

const ChapterView: React.FC<ChapterViewProps> = ({ chapter, questions, onSelectQuestion }) => {
  const [activeTab, setActiveTab] = useState<QuestionType>('সংক্ষিপ্ত');

  const filtered = questions.filter(q => q.type === activeTab);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{chapter.title}</h1>
        <div className="w-20 h-1 bg-blue-600 rounded"></div>
      </div>

      <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        {(['সংক্ষিপ্ত', 'রচনামূলক'] as QuestionType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            {tab} প্রশ্ন
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? (
          filtered.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="group text-left p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all flex justify-between items-center animate-in fade-in slide-in-from-left-4 duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">{q.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {q.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-400">এই বিভাগে কোন প্রশ্ন পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterView;
