import { StudentProfile, AttemptRecord } from '../types';

export const IPG_PROGRAMS = ['PPISMP', 'PISMP'] as const;

export const IPG_SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
] as const;

export const IPG_OPSYEN = [
  'MATH',
] as const;

export const IPG_KUMPULAN = [...IPG_OPSYEN];

// Helper to generate 29 complete perfect attempt history records for each student
function generate29PerfectAttempts(studentId: string): AttemptRecord[] {
  const attempts: AttemptRecord[] = [
    // World 1: Arena Pecahan (10 Soalan / Cabaran)
    { id: `${studentId}-ATT-01`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-1', soalan: 'Tentukan pecahan bahagian berlorek 1/2', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Mengenal Pecahan Wajar', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-02`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-1', soalan: 'Pecahan wajar 2 daripada 3 bahagian', jawapanMurid: '2/3', jawapanSebenar: '2/3', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 4, kemahiran: 'Mengenal Pecahan Wajar', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-03`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-1', soalan: 'Bahagian berlorek 3 daripada 4', jawapanMurid: '3/4', jawapanSebenar: '3/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Mengenal Pecahan Wajar', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-04`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-2', soalan: 'Pecahan setara bagi 1/2', jawapanMurid: '2/4', jawapanSebenar: '2/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Pecahan Setara', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-05`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-2', soalan: 'Pecahan setara bagi 2/3', jawapanMurid: '4/6', jawapanSebenar: '4/6', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Pecahan Setara', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-06`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-2', soalan: 'Pecahan setara bagi 3/4', jawapanMurid: '6/8', jawapanSebenar: '6/8', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 7, kemahiran: 'Pecahan Setara', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-07`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-3', soalan: 'Permudahkan pecahan 2/4', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Pecahan Bentuk Termudah', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-08`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-3', soalan: 'Permudahkan pecahan 3/6', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Pecahan Bentuk Termudah', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-09`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-3', soalan: 'Permudahkan pecahan 4/8', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 4, kemahiran: 'Pecahan Bentuk Termudah', tarikh: '12/08/2026' },
    { id: `${studentId}-ATT-10`, studentId, gameId: 'arena_pecahan', challengeId: 'arena-3', soalan: 'Permudahkan pecahan 6/9', jawapanMurid: '2/3', jawapanSebenar: '2/3', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Pecahan Bentuk Termudah', tarikh: '12/08/2026' },

    // World 2: Dapur Pecahan (10 Soalan / Cabaran)
    { id: `${studentId}-ATT-11`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-1', soalan: '1/4 + 2/4 = ?', jawapanMurid: '3/4', jawapanSebenar: '3/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Penambahan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-12`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-1', soalan: '2/5 + 1/5 = ?', jawapanMurid: '3/5', jawapanSebenar: '3/5', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 4, kemahiran: 'Penambahan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-13`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-1', soalan: '1/6 + 3/6 = ?', jawapanMurid: '4/6', jawapanSebenar: '4/6', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Penambahan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-14`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-2', soalan: '1/2 + 1/4 = ?', jawapanMurid: '3/4', jawapanSebenar: '3/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 7, kemahiran: 'Penambahan Pecahan Penyebut Berbeza', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-15`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-2', soalan: '1/3 + 1/6 = ?', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Penambahan Pecahan Penyebut Berbeza', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-16`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-2', soalan: '2/5 + 3/10 = ?', jawapanMurid: '7/10', jawapanSebenar: '7/10', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 8, kemahiran: 'Penambahan Pecahan Penyebut Berbeza', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-17`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-3', soalan: '3/4 - 1/4 = ?', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Penolakan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-18`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-3', soalan: '5/6 - 2/6 = ?', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Penolakan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-19`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-3', soalan: '7/8 - 3/8 = ?', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Penolakan Pecahan Penyebut Sama', tarikh: '13/08/2026' },
    { id: `${studentId}-ATT-20`, studentId, gameId: 'dapur_pecahan', challengeId: 'dapur-3', soalan: '4/5 - 2/5 = ?', jawapanMurid: '2/5', jawapanSebenar: '2/5', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 5, kemahiran: 'Penolakan Pecahan Penyebut Sama', tarikh: '13/08/2026' },

    // World 3: Dunia Pixel (9 Soalan / Cabaran)
    { id: `${studentId}-ATT-21`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-1', soalan: '3/4 - 1/2 = ?', jawapanMurid: '1/4', jawapanSebenar: '1/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 7, kemahiran: 'Penolakan Pecahan Penyebut Berbeza', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-22`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-1', soalan: '5/6 - 1/3 = ?', jawapanMurid: '1/2', jawapanSebenar: '1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Penolakan Pecahan Penyebut Berbeza', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-23`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-1', soalan: '7/10 - 2/5 = ?', jawapanMurid: '3/10', jawapanSebenar: '3/10', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Penolakan Pecahan Penyebut Berbeza', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-24`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-2', soalan: 'Pecahan Tak Wajar 5/4 kepada Nombor Bercampur', jawapanMurid: '1 1/4', jawapanSebenar: '1 1/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 7, kemahiran: 'Pecahan Tak Wajar & Nombor Bercampur', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-25`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-2', soalan: 'Nombor Bercampur 1 2/3 kepada Pecahan Tak Wajar', jawapanMurid: '5/3', jawapanSebenar: '5/3', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Pecahan Tak Wajar & Nombor Bercampur', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-26`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-2', soalan: 'Pecahan Tak Wajar 7/2 kepada Nombor Bercampur', jawapanMurid: '3 1/2', jawapanSebenar: '3 1/2', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 6, kemahiran: 'Pecahan Tak Wajar & Nombor Bercampur', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-27`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-3', soalan: 'Alya ada 1/2 kek, Adam beri 1/4 kek. Berapakah jumlah kek?', jawapanMurid: '3/4', jawapanSebenar: '3/4', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 8, kemahiran: 'Penyelesaian Masalah Pecahan Harian', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-28`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-3', soalan: 'Sebiji pizza dipotong 8. Faris makan 3/8 dan Harith makan 2/8. Berapa baki pizza?', jawapanMurid: '3/8', jawapanSebenar: '3/8', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 9, kemahiran: 'Penyelesaian Masalah Pecahan Harian', tarikh: '14/08/2026' },
    { id: `${studentId}-ATT-29`, studentId, gameId: 'dunia_pixel', challengeId: 'pixel-3', soalan: 'Panjang tali 4/5 m. Dipotong 1/2 m. Berapakah baki tali?', jawapanMurid: '3/10', jawapanSebenar: '3/10', isCorrect: true, percubaan: 1, hintUsed: 0, masaSaat: 10, kemahiran: 'Penyelesaian Masalah Pecahan Harian', tarikh: '14/08/2026' },
  ];
  return attempts;
}

// 8 PELAJAR IPG DENGAN PRESTASI SEMPURNA (29/29 Stars, 29/29 Betul, 100% Ketepatan, 100% Progress, COMPLETED)
export const IPG_STUDENTS_DATA: StudentProfile[] = [
  // DATA 1
  {
    id: 'IPG-001',
    nama: 'Amir Hakim',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PPISMP',
    semester: 'Semester 2',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-10T08:00:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T10:00:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 20,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-001'),
    },
  },

  // DATA 2
  {
    id: 'IPG-002',
    nama: 'Nur Aisyah',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PPISMP',
    semester: 'Semester 1',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-10T08:30:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T10:15:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 21,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-002'),
    },
  },

  // DATA 3
  {
    id: 'IPG-003',
    nama: 'Muhammad Danish',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PISMP',
    semester: 'Semester 3',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-11T09:00:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T10:30:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 19,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-003'),
    },
  },

  // DATA 4
  {
    id: 'IPG-004',
    nama: 'Siti Hajar',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PPISMP',
    semester: 'Semester 2',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-11T09:30:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T11:00:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 22,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 8 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-004'),
    },
  },

  // DATA 5
  {
    id: 'IPG-005',
    nama: 'Adam Firdaus',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PISMP',
    semester: 'Semester 4',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-12T10:00:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T11:20:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 20,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-005'),
    },
  },

  // DATA 6
  {
    id: 'IPG-006',
    nama: 'Nur Iman Sofea',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PISMP',
    semester: 'Semester 3',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-12T10:30:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T11:45:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 18,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 5 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-006'),
    },
  },

  // DATA 7
  {
    id: 'IPG-007',
    nama: 'Hakim Zulfadli',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PPISMP',
    semester: 'Semester 2',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-13T11:00:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T12:00:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 20,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-007'),
    },
  },

  // DATA 8
  {
    id: 'IPG-008',
    nama: 'Aina Syahirah',
    kelas: 'MATH',
    studentCategory: 'IPG',
    program: 'PISMP',
    semester: 'Semester 1',
    opsyen: 'MATH',
    kumpulan: 'MATH',
    tarikhDaftar: new Date('2026-08-13T11:30:00.000Z').toISOString(),
    progress: {
      completedChallenges: 9,
      earnedStars: 29,
      unlockedWorlds: ['arena', 'dapur', 'pixel'],
      worldStars: { arena: 10, dapur: 10, pixel: 9 },
      completedChallengeIds: ['arena-1', 'arena-2', 'arena-3', 'dapur-1', 'dapur-2', 'dapur-3', 'pixel-1', 'pixel-2', 'pixel-3'],
      challengeStars: { 'arena-1': 3, 'arena-2': 3, 'arena-3': 3, 'dapur-1': 3, 'dapur-2': 3, 'dapur-3': 3, 'pixel-1': 3, 'pixel-2': 3, 'pixel-3': 3 },
      badges: ['Juara Arena', 'Chef Handal', 'Piksel Maestro', 'Penguasa Pecahan', 'Pendidik Unggul IPG'],
      certificateEarned: true,
      certificateDate: new Date('2026-08-14T12:15:00.000Z').toISOString(),
      totalHintsUsed: 0,
      totalPlayTimeMinutes: 19,
      gameDetails: {
        arena_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dapur_pecahan: { completedChallenges: 3, earnedStars: 10, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 6 },
        dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 0, masaMinit: 7 },
      },
      attemptHistory: generate29PerfectAttempts('IPG-008'),
    },
  },
];
