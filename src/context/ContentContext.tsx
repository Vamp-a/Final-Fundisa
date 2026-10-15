/**
 * ContentContext — shared store for lecturer-uploaded content.
 * Seeded with mock data. Any upload from the lecturer dashboard
 * immediately appears in the student module viewer.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { MOCK_UPLOADED_CONTENT } from '../data/mockData';
import type { UploadedContent } from '../types';

interface ContentContextType {
  uploads: UploadedContent[];
  /** Called by the lecturer dashboard when a file is uploaded */
  addUpload: (item: Omit<UploadedContent, 'id'>) => void;
  /** Return all uploads for a specific module */
  getUploadsForModule: (moduleId: string) => UploadedContent[];
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadedContent[]>(MOCK_UPLOADED_CONTENT);

  const addUpload = (item: Omit<UploadedContent, 'id'>) => {
    setUploads(prev => [
      { ...item, id: `c${Date.now()}` },
      ...prev,
    ]);
  };

  const getUploadsForModule = (moduleId: string) =>
    uploads.filter(u => u.moduleId === moduleId);

  return (
    <ContentContext.Provider value={{ uploads, addUpload, getUploadsForModule }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
