/**
 * ProgressContext — tracks live reading progress + quiz scores.
 * Everything starts at 0. Reading each section advances progress.
 * Passing the quiz (≥60%) marks the module complete.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { MOCK_MODULES } from '../data/mockData';

export interface ModuleProgressEntry {
  moduleId:    string;
  progress:    number;       // 0–99 = reading; 100 = quiz passed
  sectionsRead: Set<string>; // section IDs the student has viewed
  quizScore:   number | null;
  completedAt: string | null;
}

interface ProgressContextType {
  entries: ModuleProgressEntry[];
  getEntry:       (moduleId: string) => ModuleProgressEntry;
  markSectionRead:(moduleId: string, sectionId: string, totalSections: number) => void;
  completeModule: (moduleId: string, score: number) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

function makeInitial(): ModuleProgressEntry[] {
  return MOCK_MODULES.map(m => ({
    moduleId:     m.id,
    progress:     0,
    sectionsRead: new Set<string>(),
    quizScore:    null,
    completedAt:  null,
  }));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ModuleProgressEntry[]>(makeInitial);

  const getEntry = (moduleId: string): ModuleProgressEntry =>
    entries.find(e => e.moduleId === moduleId) ?? {
      moduleId,
      progress:     0,
      sectionsRead: new Set(),
      quizScore:    null,
      completedAt:  null,
    };

  /**
   * Called each time the student moves to a section.
   * Advances reading progress proportionally (max 99 until quiz passed).
   */
  const markSectionRead = (moduleId: string, sectionId: string, totalSections: number) => {
    setEntries(prev =>
      prev.map(e => {
        if (e.moduleId !== moduleId) return e;
        if (e.progress >= 100) return e; // already complete
        const newRead = new Set(e.sectionsRead).add(sectionId);
        const readPct = Math.min(99, Math.round((newRead.size / totalSections) * 99));
        return { ...e, sectionsRead: newRead, progress: Math.max(e.progress, readPct) };
      })
    );
  };

  /** Pass the quiz → mark 100% */
  const completeModule = (moduleId: string, score: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setEntries(prev =>
      prev.map(e =>
        e.moduleId === moduleId
          ? { ...e, progress: 100, quizScore: score, completedAt: today }
          : e
      )
    );
  };

  return (
    <ProgressContext.Provider value={{ entries, getEntry, markSectionRead, completeModule }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
