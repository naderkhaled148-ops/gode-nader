export type SubjectId = 'science' | 'math' | 'arabic' | 'english' | 'social_studies';

export type Priority = 'high' | 'medium' | 'low';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subTitle: string;
  pageRange: string;
  unit: string;
  character: 'الفطن' | 'الذكي' | 'العبقري';
  characterQuote: string;
  summary: {
    overview: string;
    keyPoints: string[];
    coreRule: string;
    experimentGuide?: {
      title: string;
      testedFactor: string;
      fixedFactors: string[];
      steps: string[];
      conclusion: string;
    };
    diagrams?: {
      title: string;
      description: string;
      labels: { name: string; info: string }[];
    }[];
  };
  workedExamples: {
    id: string;
    question: string;
    context: string;
    howToThink: string;
    solution: string;
    scientificRule: string;
  }[];
  quiz: {
    title: string;
    description: string;
    timeLimitMinutes: number;
    questions: QuizQuestion[];
  };
  video: {
    id: string;
    title: string;
    duration: string;
    thumbnailUrl: string;
    videoUrl: string;
    takeaways: string[];
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  skillTested: 'observation' | 'analysis' | 'fairExperiment' | 'conceptRetention';
  hint?: string;
}

export interface WorkedExample {
  id: string;
  question: string;
  context: string;
  howToThink: string;
  solution: string;
  scientificRule: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  takeaways: string[];
  chapterNumber?: number;
  chapterTitle?: string;
  chapterId?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  subjectId: SubjectId;
  chapterId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  completed: boolean;
  reminderEnabled: boolean;
  priority: Priority;
  notes?: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  current: number;
  target: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'quiz' | 'streak' | 'focus' | 'science' | 'sync';
}

export interface StudentProfile {
  name: string;
  age: number;
  grade: string;
  school: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  totalStudyMinutes: number;
  lastStudyDate: string;
  avatar: string;
  badges: string[]; // badge IDs
  theme: 'light' | 'dark' | 'system';
  skills: {
    observation: number;       // الملاحظة العلمية (0-100)
    analysis: number;          // التحليل والاستنتاج (0-100)
    fairExperiment: number;    // التجارب العادلة (0-100)
    conceptRetention: number;  // استيعاب المفاهيم (0-100)
    examReadiness: number;     // الجاهزية للامتحانات (0-100)
  };
  quizScores: Record<string, { score: number; total: number; date: string; passed: boolean }>;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  sheetName?: string;
  lastSynced?: string;
  autoSync: boolean;
  connectedEmail?: string;
}
