export interface WorldInfo {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    gradient: string;
  };
  visualElements: string[];
  bannerImage?: string;
  isLockedDefault: boolean;
}

export interface AttemptRecord {
  id: string;
  studentId: string;
  sessionId?: string;
  gameId: string; // 'arena' | 'dapur' | 'pixel' or 'arena_pecahan' etc.
  challengeId: string; // e.g. 'arena-1' or '1'
  questionId?: string; // e.g. 'ARENA_C1_Q08'
  dskpCode?: string; // e.g. '3.1.1'
  studentName?: string;
  class?: string;
  answer?: string;
  soalan: string; // e.g. '1/4 + 2/4'
  jawapanMurid: string; // e.g. '3/4'
  jawapanSebenar: string; // e.g. '3/4'
  isCorrect: boolean;
  percubaan: number; // e.g. 1
  attempts?: number;
  hintUsed: number; // e.g. 0
  masaSaat: number; // e.g. 12
  kemahiran: string; // e.g. 'Penambahan Pecahan Penyebut Sama'
  tarikh?: string;
  timestamp?: number;
}

export interface GameWorldDetail {
  completedChallenges: number; // Max 3
  earnedStars: number; // Max 9
  scorePercentage: number; // e.g. 100 (%)
  percubaan: number; // Total attempts
  hintUsed: number; // Total hints used
  masaMinit: number; // Time in minutes
}

export interface UserProgress {
  completedChallenges: number; // Max 9
  earnedStars: number; // Max 27
  score?: number; // Total points
  unlockedWorlds: string[]; // e.g. ['arena', 'dapur', 'pixel']
  worldStars: Record<string, number>; // e.g. { arena: 0, dapur: 0, pixel: 0 }
  completedChallengeIds?: string[]; // e.g. ['arena-1', 'arena-2', ...]
  challengeStars?: Record<string, number>; // e.g. { 'arena-1': 3, 'dapur-1': 2 }
  badges?: string[]; // e.g. ['Master Pecahan', 'Juara Arena']
  totalHintsUsed?: number;
  totalPlayTimeMinutes?: number;
  gameDetails?: Record<string, GameWorldDetail>; // 'arena_pecahan', 'dapur_pecahan', 'dunia_pixel'
  attemptHistory?: AttemptRecord[];
  certificateEarned?: boolean;
  certificateDate?: string;
  lastUpdated?: string; // ISO timestamp
  isSavedOffline?: boolean;
}

export interface StudentProfile {
  id: string; // e.g. "MURID-001"
  nama: string; // e.g. "Aiman Hakim"
  kelas: string; // e.g. "3 Asah", "4 Berkelah"
  name?: string; // compatibility alias
  className?: string; // compatibility alias
  tarikhDaftar: string; // ISO Date String
  progress?: UserProgress; // Student's saved progress
  lastUpdated?: string; // ISO timestamp
}

export interface GameSession {
  sessionId: string; // e.g. "SESI-17854..."
  studentId: string; // e.g. "MURID-001"
  nama: string;
  kelas: string;
  tarikh: string; // e.g. "2026-08-09"
  masaMula: string; // e.g. "08:30:15 AM"
  masaTamat?: string | null;
  worldId?: string;
  starsGained?: number;
}

export interface TeacherAuth {
  isLoggedIn: boolean;
  teacherName: string;
  loginTime?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  unlockAllWorlds: boolean; // Dev / Teacher mode toggle
}

export type {
  GameId,
  ChallengeId,
  DskpCode,
  QuestionDifficulty,
  VisualType,
  QuestionBankItem,
} from './data/questionBank/types';
