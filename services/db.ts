
import { Question, Chapter } from '../types';
import { STORAGE_KEYS, DEFAULT_CHAPTERS } from '../constants';

export const saveQuestions = (questions: Question[]) => {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const loadQuestions = (): Question[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveChapterNames = (overrides: Record<number, string>) => {
  localStorage.setItem(STORAGE_KEYS.CHAPTER_NAMES, JSON.stringify(overrides));
};

export const loadChapters = (): Chapter[] => {
  const overridesStr = localStorage.getItem(STORAGE_KEYS.CHAPTER_NAMES);
  const overrides: Record<number, string> = overridesStr ? JSON.parse(overridesStr) : {};
  
  return DEFAULT_CHAPTERS.map(ch => ({
    ...ch,
    title: overrides[ch.id] || ch.title
  }));
};

export const exportData = (questions: Question[], chapters: Record<number, string>) => {
  const dataStr = JSON.stringify({ questions, chapters }, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `sociology_backup_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importData = async (file: File): Promise<{questions: Question[], chapters: Record<number, string>} | null> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data && Array.isArray(data.questions)) {
      return data;
    }
    // Fallback for old version
    if (Array.isArray(data)) {
      return { questions: data, chapters: {} };
    }
    return null;
  } catch (error) {
    console.error('Import failed:', error);
    return null;
  }
};
