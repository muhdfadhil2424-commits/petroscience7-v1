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
  gameId: string; // 'arena_pecahan' | 'dapur_pecahan' | 'dunia_pixel'
  challengeId: string; // e.g. 'arena-1'
  soalan: string; // e.g. '1/4 + 2/4'
  jawapanMurid: string; // e.g. '3/4'
  jawapanSebenar: string; // e.g. '3/4'
  isCorrect: boolean;
  percubaan: number; // e.g. 1
  hintUsed: number; // e.g. 0
  masaSaat: number; // e.g. 12
  kemahiran: string; // e.g. 'Penambahan Pecahan Penyebut Sama'
  tarikh?: string;
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
}

export interface StudentProfile {
  id: string; // e.g. "MURID-001"
  nama: string; // e.g. "Aiman Hakim"
  kelas: string; // e.g. "4 Bestari"
  tarikhDaftar: string; // ISO Date String
  progress?: UserProgress; // Student's saved progress
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
