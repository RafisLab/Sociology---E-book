
import React, { useState, useEffect, useMemo } from 'react';
import { Page, Question, Chapter } from './types';
import { loadQuestions, saveQuestions, loadChapters, saveChapterNames } from './services/db';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChapterView from './pages/ChapterView';
import BookmarkView from './pages/BookmarkView';
import AdminPanel from './pages/AdminPanel';
import ReaderModal from './components/ReaderModal';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize data
  useEffect(() => {
    setQuestions(loadQuestions());
    setChapters(loadChapters());
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    saveQuestions(newQuestions);
  };

  const handleUpdateChapters = (newChapterOverrides: Record<number, string>) => {
    saveChapterNames(newChapterOverrides);
    setChapters(loadChapters());
  };

  const handleBookmark = (id: string) => {
    const updated = questions.map(q => q.id === id ? { ...q, bookmarked: !q.bookmarked } : q);
    handleUpdateQuestions(updated);
  };

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    const lowerQuery = searchQuery.toLowerCase();
    return questions.filter(q => 
      q.title.toLowerCase().includes(lowerQuery) ||
      q.answerHTML.toLowerCase().includes(lowerQuery) ||
      q.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }, [questions, searchQuery]);

  const navigateTo = (page: Page, chapterId: number | null = null) => {
    setCurrentPage(page);
    setCurrentChapterId(chapterId);
    window.scrollTo(0, 0);
  };

  const handleRandomQuestion = () => {
    if (questions.length === 0) return alert("কোন প্রশ্ন পাওয়া যায়নি!");
    const randomIdx = Math.floor(Math.random() * questions.length);
    setSelectedQuestion(questions[randomIdx]);
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar 
        currentPage={currentPage}
        onNavigate={navigateTo}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        isAdmin={isAdmin}
      />

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'HOME' && (
          <Home 
            chapters={chapters}
            onSelectChapter={(id) => navigateTo('CHAPTER', id)}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
            onRandom={handleRandomQuestion}
            questionsCount={questions.length}
          />
        )}

        {currentPage === 'CHAPTER' && currentChapterId && (
          <ChapterView 
            chapter={chapters.find(c => c.id === currentChapterId)!}
            questions={filteredQuestions.filter(q => q.chapterId === currentChapterId)}
            onSelectQuestion={setSelectedQuestion}
          />
        )}

        {currentPage === 'BOOKMARKS' && (
          <BookmarkView 
            questions={filteredQuestions.filter(q => q.bookmarked)}
            onSelectQuestion={setSelectedQuestion}
          />
        )}

        {currentPage === 'ADMIN' && (
          <AdminPanel 
            questions={questions}
            chapters={chapters}
            onUpdateQuestions={handleUpdateQuestions}
            onUpdateChapters={handleUpdateChapters}
            isAdmin={isAdmin}
            onLogin={() => setIsAdmin(true)}
          />
        )}
      </main>

      {selectedQuestion && (
        <ReaderModal 
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onBookmark={handleBookmark}
        />
      )}

      {currentPage !== 'HOME' && currentPage !== 'ADMIN' && (
        <button 
          onClick={() => navigateTo('HOME')}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-40 no-print"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;
