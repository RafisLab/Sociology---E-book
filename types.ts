
export type QuestionType = 'সংক্ষিপ্ত' | 'রচনামূলক';

export interface Question {
  id: string;
  chapterId: number;
  title: string;
  type: QuestionType;
  answerHTML: string;
  tags: string[];
  bookmarked: boolean;
  updatedAt: number;
}

export interface Chapter {
  id: number;
  title: string;
}

export type Page = 'HOME' | 'CHAPTER' | 'BOOKMARKS' | 'ADMIN' | 'ADMIN_DASHBOARD';

export interface AppState {
  questions: Question[];
  currentChapterId: number | null;
  darkMode: boolean;
  isAdmin: boolean;
  currentPage: Page;
  customChapterNames: Record<number, string>;
}
