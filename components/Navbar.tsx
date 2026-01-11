
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, darkMode, toggleDarkMode, isAdmin }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm no-print">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('HOME')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
              স
            </div>
            <span className="font-bold text-lg hidden md:block">সমাজতাত্ত্বিক তত্ত্ব</span>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={() => onNavigate('HOME')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'HOME' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              হোম
            </button>
            <button 
              onClick={() => onNavigate('BOOKMARKS')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'BOOKMARKS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              বুকমার্ক
            </button>
            <button 
              onClick={() => onNavigate('ADMIN')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              {isAdmin ? 'ম্যানেজার' : 'অ্যাডমিন'}
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
