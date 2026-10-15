export type UserRole = 'student' | 'lecturer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: string;
  progress: number; // 0-100
  locked: boolean;
  content: ModuleSection[];
  quizId: string;
}

export interface ModuleSection {
  id: string;
  heading: string;
  body: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  modulesCompleted: number;
  totalModules: number;
  quizScores: Record<string, number>; // moduleId -> score %
  lastActive: string;
}

export interface UploadedContent {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'test';
  moduleId: string;
  uploadedAt: string;
  size: string;
}

export type SouthAfricanLanguage =
  | 'zulu'
  | 'xhosa'
  | 'sotho'
  | 'tswana'
  | 'venda'
  | 'tsonga'
  | 'swati'
  | 'ndebele'
  | 'afrikaans';

export const SA_LANGUAGES: { code: SouthAfricanLanguage; label: string }[] = [
  { code: 'zulu',      label: 'isiZulu' },
  { code: 'xhosa',     label: 'isiXhosa' },
  { code: 'sotho',     label: 'Sesotho' },
  { code: 'tswana',    label: 'Setswana' },
  { code: 'venda',     label: 'Tshivenḓa' },
  { code: 'tsonga',    label: 'Xitsonga' },
  { code: 'swati',     label: 'siSwati' },
  { code: 'ndebele',   label: 'isiNdebele' },
  { code: 'afrikaans', label: 'Afrikaans' },
];
