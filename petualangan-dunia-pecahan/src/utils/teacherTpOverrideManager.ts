/**
 * Manager for Teacher TP (Tahap Penguasaan) Overrides
 * Ensures professional teacher sovereignty over AI suggestions:
 * "AI memberikan cadangan, tetapi GURU membuat keputusan akhir."
 *
 * Persists in localStorage key: 'kembara_teacher_tp_overrides'
 */

export interface TeacherTPRecord {
  studentId: string;
  studentClass?: string;
  systemTP: number;
  teacherTP: number; // 1 to 6
  teacherTPReason?: string;
  teacherTPUpdatedAt: string; // ISO string
  teacherName?: string;
}

export const TEACHER_TP_OVERRIDES_STORAGE_KEY = 'kembara_teacher_tp_overrides';
export const TEACHER_TP_UPDATED_EVENT = 'kembara:teacher_tp_updated';

export interface DskpTpInfo {
  level: number;
  title: string;
  shortDesc: string;
  standardCriteria: string;
  badgeColor: string;
}

export const DSKP_TP_DEFINITIONS: Record<number, DskpTpInfo> = {
  1: {
    level: 1,
    title: 'Tahap 1 — Tahu (Asas)',
    shortDesc: 'Menyatakan pecahan wajar asas',
    standardCriteria:
      'Murid tahu menyatakan pecahan wajar dan sebahagian daripada satu kumpulan objek asas dengan bimbingan bahan maujud.',
    badgeColor: 'bg-rose-100 text-rose-950 border-rose-400',
  },
  2: {
    level: 2,
    title: 'Tahap 2 — Tahu & Faham',
    shortDesc: 'Menerangkan pecahan wajar & bentuk asas',
    standardCriteria:
      'Murid boleh menamakan dan menulis pecahan wajar serta menukarkan pecahan tak wajar kepada nombor bercampur mudah.',
    badgeColor: 'bg-orange-100 text-orange-950 border-orange-400',
  },
  3: {
    level: 3,
    title: 'Tahap 3 — Tahu, Faham & Boleh Buat',
    shortDesc: 'Operasi asas pecahan & mempermudahkan',
    standardCriteria:
      'Murid boleh menambah dan menolak pecahan wajar berpenyebut sama, serta mempermudahkan pecahan kepada bentuk termudah.',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
  },
  4: {
    level: 4,
    title: 'Tahap 4 — Beradab (Rutin Kukuh)',
    shortDesc: 'Menyelesaikan masalah rutin harian pecahan',
    standardCriteria:
      'Murid menguasai konsep pecahan setara dan bentuk termudah, serta berupaya menyelesaikan operasi tambah dan tolak pecahan dalam situasi harian rutin.',
    badgeColor: 'bg-teal-100 text-teal-950 border-teal-400',
  },
  5: {
    level: 5,
    title: 'Tahap 5 — Beradab Terpuji (Cemerlang)',
    shortDesc: 'Menyelesaikan masalah rutin kompleks pelbagai strategi',
    standardCriteria:
      'Murid menunjukkan kefahaman mantap dalam operasi pecahan wajar serta berkebolehan menyelesaikan pelbagai bentuk masalah harian rutin dengan strategi berkesan dan yakin.',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400',
  },
  6: {
    level: 6,
    title: 'Tahap 6 — Beradab Mithali (Kreatif & Inovatif)',
    shortDesc: 'Menyelesaikan masalah bukan rutin (KBAT) & menaakul',
    standardCriteria:
      'Murid menguasai keseluruhan konsep pecahan Tahun 3 termasuk operasi tambah, tolak, pecahan setara, dan nombor bercampur secara kreatif dan inovatif serta boleh menerangkan proses penyelesaian.',
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-400',
  },
};

/**
 * Load all teacher TP overrides from localStorage
 */
export function loadTeacherTPOverrides(): Record<string, TeacherTPRecord> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(TEACHER_TP_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
  } catch (err) {
    console.warn('[TeacherTP] Error reading teacher TP overrides from localStorage:', err);
  }
  return {};
}

/**
 * Get teacher TP override for a specific student
 */
export function getTeacherTPOverride(studentId: string): TeacherTPRecord | null {
  if (!studentId) return null;
  const overrides = loadTeacherTPOverrides();
  return overrides[studentId] || null;
}

/**
 * Save or update teacher TP override for a student
 */
export function saveTeacherTPOverride(params: {
  studentId: string;
  studentClass?: string;
  systemTP: number;
  teacherTP: number;
  teacherTPReason?: string;
  teacherName?: string;
}): TeacherTPRecord {
  const { studentId, studentClass, systemTP, teacherTP, teacherTPReason, teacherName } = params;

  if (!studentId) {
    throw new Error('studentId is required to override TP');
  }

  // Ensure TP is valid between 1 and 6
  const validTP = Math.max(1, Math.min(6, Math.round(teacherTP)));

  const record: TeacherTPRecord = {
    studentId,
    studentClass,
    systemTP: Math.max(1, Math.min(6, Math.round(systemTP))),
    teacherTP: validTP,
    teacherTPReason: teacherTPReason?.trim() || undefined,
    teacherTPUpdatedAt: new Date().toISOString(),
    teacherName: teacherName || 'Guru',
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const overrides = loadTeacherTPOverrides();
      overrides[studentId] = record;
      window.localStorage.setItem(TEACHER_TP_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      window.dispatchEvent(new CustomEvent(TEACHER_TP_UPDATED_EVENT, { detail: { studentId, record } }));
    } catch (err) {
      console.error('[TeacherTP] Error saving teacher TP override to localStorage:', err);
    }
  }

  return record;
}

/**
 * Reset/Delete teacher TP override for a student (reverts back to AI suggested TP)
 */
export function resetTeacherTPOverride(studentId: string): boolean {
  if (!studentId || typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const overrides = loadTeacherTPOverrides();
    if (overrides[studentId]) {
      delete overrides[studentId];
      window.localStorage.setItem(TEACHER_TP_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      window.dispatchEvent(new CustomEvent(TEACHER_TP_UPDATED_EVENT, { detail: { studentId, reset: true } }));
      return true;
    }
  } catch (err) {
    console.error('[TeacherTP] Error resetting teacher TP override:', err);
  }
  return false;
}

/**
 * Calculates effective TP:
 * effectiveTP = teacherTP ?? systemTP
 */
export function getEffectiveTP(systemTP: number, studentId: string): {
  effectiveTP: number;
  isTeacherOverride: boolean;
  teacherTP: number | null;
  teacherReason?: string;
  updatedAt?: string;
} {
  const override = getTeacherTPOverride(studentId);
  if (override && typeof override.teacherTP === 'number') {
    return {
      effectiveTP: override.teacherTP,
      isTeacherOverride: true,
      teacherTP: override.teacherTP,
      teacherReason: override.teacherTPReason,
      updatedAt: override.teacherTPUpdatedAt,
    };
  }

  return {
    effectiveTP: systemTP,
    isTeacherOverride: false,
    teacherTP: null,
  };
}

/**
 * Subscribe to changes in teacher TP overrides
 */
export function subscribeToTeacherTPUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === TEACHER_TP_OVERRIDES_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(TEACHER_TP_UPDATED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(TEACHER_TP_UPDATED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}
