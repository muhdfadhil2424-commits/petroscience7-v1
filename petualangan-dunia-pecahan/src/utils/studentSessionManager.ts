import { StudentProfile, GameSession, TeacherAuth, UserProgress, AttemptRecord } from '../types';
import { CLASS_3_ASAH_STUDENTS } from '../data/class3AsahData';
import { CLASS_3_BERKELAH_STUDENTS } from '../data/class3BerkelahData';

const STUDENTS_STORAGE_KEY = 'wira_pecahan_students_v10';
const SESSIONS_STORAGE_KEY = 'wira_pecahan_sessions_v10';
const CURRENT_STUDENT_STORAGE_KEY = 'wira_pecahan_current_student_v10';
const CURRENT_SESSION_STORAGE_KEY = 'wira_pecahan_current_session_v10';
const TEACHER_AUTH_STORAGE_KEY = 'wira_pecahan_teacher_auth_v10';

// Helper to calculate Tahap Penguasaan (TP1 - TP6) based on stars & completed challenges
export function calculateStudentTP(stars: number, completed: number): string {
  if (stars >= 25 || completed >= 9) return 'TP5';
  if (stars >= 20 || completed >= 7) return 'TP4';
  if (stars >= 12 || completed >= 5) return 'TP3';
  if (stars >= 6 || completed >= 3) return 'TP2';
  return 'TP1';
}

// Helper to calculate Status (Menguasai, Sedang Berkembang, Perlukan Bimbingan)
export function calculateStudentStatus(tp: string, completed?: number): 'Menguasai' | 'Sedang Berkembang' | 'Perlukan Bimbingan' {
  if (completed !== undefined) {
    if (completed >= 9) return 'Menguasai';
    if (completed > 0) return 'Sedang Berkembang';
  }
  if (tp === 'TP6' || tp === 'TP5' || tp === 'TP4') return 'Menguasai';
  if (tp === 'TP3') return 'Sedang Berkembang';
  return 'Perlukan Bimbingan';
}

const DEFAULT_USER_PROGRESS: UserProgress = {
  completedChallenges: 0,
  earnedStars: 0,
  unlockedWorlds: ['arena'],
  worldStars: { arena: 0, dapur: 0, pixel: 0 },
  completedChallengeIds: [],
  challengeStars: {},
  badges: [],
  totalHintsUsed: 0,
  totalPlayTimeMinutes: 0,
  gameDetails: {
    arena_pecahan: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 0, masaMinit: 0 },
    dapur_pecahan: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 0, masaMinit: 0 },
    dunia_pixel: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 0, masaMinit: 0 },
  },
  attemptHistory: [],
};

export const ALL_CLASSES = [
  '3 Asah',
  '3 Berkelah',
  '4 Asah',
  '4 Berkelah',
  '5 Asah',
  '5 Berkelah',
  '6 Asah',
  '6 Berkelah',
  '6 Chamang',
];

// INITIAL SEED DATA FOR PROTOTYPE DEMO
const DEMO_STUDENTS: StudentProfile[] = [
  ...CLASS_3_ASAH_STUDENTS,
  ...CLASS_3_BERKELAH_STUDENTS,
  // 4 Asah
  {
    id: 'MURID-001',
    nama: 'Aiman Hakim',
    kelas: '4 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 3).toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 27,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 9, dapur: 9, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan'],
      certificateEarned: true,
      certificateDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      totalHintsUsed: 2,
      totalPlayTimeMinutes: 24,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 8 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 9 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 7 },
      },
      attemptHistory: [
        {
          id: 'ATT-101',
          studentId: 'MURID-001',
          sessionId: 'SESI-101',
          gameId: 'dapur_pecahan',
          challengeId: 'dapur-1',
          soalan: '1/4 + 2/4',
          jawapanMurid: '3/4',
          jawapanSebenar: '3/4',
          isCorrect: true,
          percubaan: 1,
          hintUsed: 0,
          masaSaat: 12,
          kemahiran: 'Penambahan Pecahan Penyebut Sama',
          tarikh: '09/08/2026',
        },
        {
          id: 'ATT-102',
          studentId: 'MURID-001',
          sessionId: 'SESI-101',
          gameId: 'arena_pecahan',
          challengeId: 'arena-2',
          soalan: 'Cari pecahan setara bagi 1/2',
          jawapanMurid: '2/4',
          jawapanSebenar: '2/4',
          isCorrect: true,
          percubaan: 1,
          hintUsed: 0,
          masaSaat: 10,
          kemahiran: 'Pecahan Setara',
          tarikh: '09/08/2026',
        },
      ],
    },
  },
  {
    id: 'MURID-002',
    nama: 'Siti Aisyah',
    kelas: '4 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 2).toISOString(),
    progress: {
      completedChallenges: 8,
      earnedStars: 22,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 9, dapur: 8, pixel: 5 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 2, 'pixel-1': 3, 'pixel-2': 2 },
      badges: ['Juara Arena', 'Chef Handal'],
      totalHintsUsed: 5,
      totalPlayTimeMinutes: 30,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 10 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 8, scorePercentage: 88, percubaan: 4, hintUsed: 2, masaMinit: 12 },
        dunia_pixel: { completedChallenges: 2, earnedStars: 5, scorePercentage: 75, percubaan: 3, hintUsed: 2, masaMinit: 8 },
      },
      attemptHistory: [
        {
          id: 'ATT-201',
          studentId: 'MURID-002',
          sessionId: 'SESI-102',
          gameId: 'dapur_pecahan',
          challengeId: 'dapur-2',
          soalan: '3/5 - 1/5',
          jawapanMurid: '2/5',
          jawapanSebenar: '2/5',
          isCorrect: true,
          percubaan: 1,
          hintUsed: 0,
          masaSaat: 14,
          kemahiran: 'Penolakan Pecahan Penyebut Sama',
          tarikh: '08/08/2026',
        },
      ],
    },
  },
  {
    id: 'MURID-003',
    nama: 'Danish Amir',
    kelas: '4 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 1).toISOString(),
    progress: {
      completedChallenges: 4,
      earnedStars: 10,
      unlockedWorlds: ['arena', 'dapur'],
      worldStars: { arena: 7, dapur: 3, pixel: 0 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1'],
      challengeStars: { 'arena-1': 3, 'arena-2': 2, 'arena-3': 2, 'dapur-1': 3 },
      badges: ['Juara Arena'],
      totalHintsUsed: 8,
      totalPlayTimeMinutes: 22,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 7, scorePercentage: 75, percubaan: 5, hintUsed: 4, masaMinit: 12 },
        dapur_pecahan: { completedChallenges: 1, earnedStars: 3, scorePercentage: 50, percubaan: 4, hintUsed: 3, masaMinit: 10 },
        dunia_pixel: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 1, masaMinit: 0 },
      },
      attemptHistory: [],
    },
  },
  {
    id: 'MURID-004',
    nama: 'Nur Sarah Balqis',
    kelas: '4 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 2).toISOString(),
    progress: {
      completedChallenges: 5,
      earnedStars: 14,
      unlockedWorlds: ['arena', 'dapur'],
      worldStars: { arena: 9, dapur: 5, pixel: 0 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 2 },
      badges: ['Juara Arena'],
      totalHintsUsed: 4,
      totalPlayTimeMinutes: 26,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 11 },
        dapur_pecahan: { completedChallenges: 2, earnedStars: 5, scorePercentage: 70, percubaan: 3, hintUsed: 2, masaMinit: 12 },
        dunia_pixel: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 1, masaMinit: 3 },
      },
      attemptHistory: [],
    },
  },
  {
    id: 'MURID-005',
    nama: 'Muhammad Rayyan',
    kelas: '4 Asah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 1).toISOString(),
    progress: {
      completedChallenges: 2,
      earnedStars: 5,
      unlockedWorlds: ['arena'],
      worldStars: { arena: 5, dapur: 0, pixel: 0 },
      completedChallengeIds: ['arena-1', 'arena-2'],
      challengeStars: { 'arena-1': 3, 'arena-2': 2 },
      badges: [],
      totalHintsUsed: 6,
      totalPlayTimeMinutes: 15,
      gameDetails: {
        arena_pecahan: { completedChallenges: 2, earnedStars: 5, scorePercentage: 55, percubaan: 4, hintUsed: 4, masaMinit: 12 },
        dapur_pecahan: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 1, hintUsed: 2, masaMinit: 3 },
        dunia_pixel: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 0, masaMinit: 0 },
      },
      attemptHistory: [],
    },
  },

  // 4 Berkelah
  {
    id: 'MURID-006',
    nama: 'Adam Harith',
    kelas: '4 Berkelah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 4).toISOString(),
    progress: {
      completedChallenges: 7,
      earnedStars: 19,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 8, dapur: 7, pixel: 4 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 2, 'dapur-1': 3, 'dapur-2': 2, 'dapur-3': 2, 'pixel-1': 2 },
      badges: ['Juara Arena'],
      totalHintsUsed: 4,
      totalPlayTimeMinutes: 28,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 8, scorePercentage: 88, percubaan: 3, hintUsed: 1, masaMinit: 9 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 7, scorePercentage: 78, percubaan: 4, hintUsed: 2, masaMinit: 11 },
        dunia_pixel: { completedChallenges: 1, earnedStars: 4, scorePercentage: 65, percubaan: 2, hintUsed: 1, masaMinit: 8 },
      },
      attemptHistory: [],
    },
  },
  {
    id: 'MURID-007',
    nama: 'Nur Arissa',
    kelas: '4 Berkelah',
    tarikhDaftar: new Date(Date.now() - 86400000 * 3).toISOString(),
    progress: {
      completedChallenges: 3,
      earnedStars: 7,
      unlockedWorlds: ['arena'],
      worldStars: { arena: 7, dapur: 0, pixel: 0 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 2, 'arena-3': 2 },
      badges: ['Juara Arena'],
      totalHintsUsed: 7,
      totalPlayTimeMinutes: 18,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 7, scorePercentage: 70, percubaan: 4, hintUsed: 3, masaMinit: 10 },
        dapur_pecahan: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 2, hintUsed: 2, masaMinit: 5 },
        dunia_pixel: { completedChallenges: 0, earnedStars: 0, scorePercentage: 0, percubaan: 0, hintUsed: 2, masaMinit: 3 },
      },
      attemptHistory: [],
    },
  },
];

const DEMO_SESSIONS: GameSession[] = [
  {
    sessionId: 'SESI-101',
    studentId: 'MURID-001',
    nama: 'Aiman Hakim',
    kelas: '4 Bestari',
    tarikh: new Date(Date.now() - 86400000 * 2).toLocaleDateString('ms-MY'),
    masaMula: '09:15 AM',
    masaTamat: '09:45 AM',
    worldId: 'dapur_pecahan',
    starsGained: 9,
  },
  {
    sessionId: 'SESI-102',
    studentId: 'MURID-002',
    nama: 'Nur Sarah Balqis',
    kelas: '4 Bestari',
    tarikh: new Date(Date.now() - 86400000 * 1).toLocaleDateString('ms-MY'),
    masaMula: '10:30 AM',
    masaTamat: '11:00 AM',
    worldId: 'arena_pecahan',
    starsGained: 6,
  },
];

// Helper to seed prototype demo data if local storage is fresh or outdated
export function initializeStorageWithSeed(): void {
  try {
    // Clear old versions from previous iterations
    for (let i = 1; i <= 9; i++) {
      localStorage.removeItem(`wira_pecahan_students_v${i}`);
      localStorage.removeItem(`wira_pecahan_sessions_v${i}`);
    }

    const existing = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(DEMO_STUDENTS));
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(DEMO_SESSIONS));
    } else {
      const parsed: StudentProfile[] = JSON.parse(existing);
      const class3Asah = parsed.filter((s) => s.kelas === '3 Asah');
      const is3AsahComplete = class3Asah.length === 40 && class3Asah.every((s) => (s.progress?.completedChallenges || 0) === 9);
      // Ensure no 5 Asah, 5 Berkelah, 6 Asah, 6 Berkelah, 6 Chamang records exist in seed
      const hasOldSeniorClasses = parsed.some((s) => ['5 Asah', '5 Berkelah', '6 Asah', '6 Berkelah', '6 Chamang'].includes(s.kelas));
      
      if (!is3AsahComplete || hasOldSeniorClasses) {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(DEMO_STUDENTS));
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(DEMO_SESSIONS));
      }
    }
  } catch (err) {
    console.error('Failed to initialize seed data', err);
  }
}

// Get all registered students
export function getAllStudents(): StudentProfile[] {
  initializeStorageWithSeed();
  try {
    const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEMO_STUDENTS;
  } catch {
    return DEMO_STUDENTS;
  }
}

// Generate unique automatic student ID (MURID-001, MURID-002, ...)
export function generateNextStudentId(): string {
  const students = getAllStudents();
  let maxNum = 0;
  students.forEach((s) => {
    const match = s.id.match(/^MURID-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const nextNum = maxNum + 1;
  return `MURID-${String(nextNum).padStart(3, '0')}`;
}

// Create or Register student profile
export function registerStudent(nama: string, kelas: string): StudentProfile {
  const students = getAllStudents();
  const trimmedNama = nama.trim();
  const trimmedKelas = kelas.trim();

  // Check if a student with exact same name and class already exists
  const existing = students.find(
    (s) => s.nama.toLowerCase() === trimmedNama.toLowerCase() && s.kelas.toLowerCase() === trimmedKelas.toLowerCase()
  );

  if (existing) {
    setCurrentStudent(existing);
    return existing;
  }

  const newStudent: StudentProfile = {
    id: generateNextStudentId(),
    nama: trimmedNama,
    kelas: trimmedKelas,
    tarikhDaftar: new Date().toISOString(),
    progress: DEFAULT_USER_PROGRESS,
  };

  const updatedStudents = [newStudent, ...students];
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(updatedStudents));
  setCurrentStudent(newStudent);
  return newStudent;
}

// Current active student
export function getCurrentStudent(): StudentProfile | null {
  try {
    const saved = localStorage.getItem(CURRENT_STUDENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function setCurrentStudent(student: StudentProfile | null): void {
  if (student) {
    localStorage.setItem(CURRENT_STUDENT_STORAGE_KEY, JSON.stringify(student));
  } else {
    localStorage.removeItem(CURRENT_STUDENT_STORAGE_KEY);
  }
}

// Save & Sync student progress to students list
export function saveStudentProgress(studentId: string, progress: UserProgress): void {
  const students = getAllStudents();
  const idx = students.findIndex((s) => s.id === studentId);

  // Auto attach certificate metadata if 9 challenges completed
  if (progress.completedChallenges >= 9) {
    if (!progress.certificateEarned) {
      progress.certificateEarned = true;
    }
    if (!progress.certificateDate) {
      progress.certificateDate = new Date().toISOString();
    }
  }

  if (idx !== -1) {
    students[idx].progress = progress;
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));

    // Update current active student if matches
    const current = getCurrentStudent();
    if (current && current.id === studentId) {
      current.progress = progress;
      setCurrentStudent(current);
    }
  }
}

// GAME SESSION MANAGEMENT
export function startNewGameSession(student: StudentProfile): GameSession {
  const now = new Date();
  const newSession: GameSession = {
    sessionId: `SESI-${Date.now().toString().slice(-6)}`,
    studentId: student.id,
    nama: student.nama,
    kelas: student.kelas,
    tarikh: now.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    masaMula: now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
    masaTamat: null,
  };

  try {
    const sessions = getAllSessions();
    const updated = [newSession, ...sessions];
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_SESSION_STORAGE_KEY, JSON.stringify(newSession));
  } catch (err) {
    console.error('Failed to create session', err);
  }

  return newSession;
}

export function getAllSessions(): GameSession[] {
  initializeStorageWithSeed();
  try {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEMO_SESSIONS;
  } catch {
    return DEMO_SESSIONS;
  }
}

export function getCurrentSession(): GameSession | null {
  try {
    const saved = localStorage.getItem(CURRENT_SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function endCurrentGameSession(): void {
  const currentSession = getCurrentSession();
  if (currentSession) {
    const now = new Date();
    currentSession.masaTamat = now.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });
    
    // Update list
    const sessions = getAllSessions();
    const idx = sessions.findIndex((s) => s.sessionId === currentSession.sessionId);
    if (idx !== -1) {
      sessions[idx] = currentSession;
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
    localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY);
  }
}

// TEACHER AUTH MANAGEMENT
export function getTeacherAuth(): TeacherAuth {
  try {
    const saved = localStorage.getItem(TEACHER_AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { isLoggedIn: false, teacherName: '' };
  } catch {
    return { isLoggedIn: false, teacherName: '' };
  }
}

export function setTeacherAuth(isLoggedIn: boolean, teacherName: string = 'Cikgu Math'): void {
  const auth: TeacherAuth = {
    isLoggedIn,
    teacherName: isLoggedIn ? teacherName : '',
    loginTime: isLoggedIn ? new Date().toISOString() : undefined,
  };
  localStorage.setItem(TEACHER_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

// RESET ALL DATA
export function resetAllData(): void {
  localStorage.removeItem(STUDENTS_STORAGE_KEY);
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
  localStorage.removeItem(CURRENT_STUDENT_STORAGE_KEY);
  localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY);
  localStorage.removeItem(TEACHER_AUTH_STORAGE_KEY);
  initializeStorageWithSeed();
}
