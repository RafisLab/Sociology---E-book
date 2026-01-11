
import React from 'react';
import { Chapter } from '../types';

interface HomeProps {
  chapters: Chapter[];
  onSelectChapter: (id: number) => void;
  onSearch: (q: string) => void;
  searchQuery: string;
  onRandom: () => void;
  questionsCount: number;
}

const Home: React.FC<HomeProps> = ({ chapters, onSelectChapter, onSearch, searchQuery, onRandom, questionsCount }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-700 dark:text-blue-400">সমসাময়িক সমাজতাত্বিক তত্ত্ব</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">সমাজবিজ্ঞানের আধুনিক তত্ত্বসমূহ পড়ার একটি সহজ মাধ্যম</p>
      </div>

      <div className="mb-12">
        <div className="relative group">
          <input 
            type="text"
            placeholder="প্রশ্ন, ট্যাগ বা বিষয়বস্তু দিয়ে সার্চ করুন..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all shadow-md group-hover:shadow-lg text-lg"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-4 w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button 
            onClick={onRandom}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            র‍্যান্ডম প্রশ্ন পড়ুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter, idx) => (
          <div 
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group flex items-start gap-4 animate-in fade-in duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-12 h-12 flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {idx + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{chapter.title}</h2>
              <p className="text-slate-500 text-sm">অধ্যায়ভিত্তিক বিস্তারিত আলোচনা</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-blue-600 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">সর্বমোট {questionsCount}টি প্রশ্ন যুক্ত আছে</h3>
          <p className="opacity-90">অফলাইনে পড়ার সুবিধা এবং ডার্ক মোড সাপোর্ট সহ</p>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-60 h-60 bg-white opacity-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default Home;
