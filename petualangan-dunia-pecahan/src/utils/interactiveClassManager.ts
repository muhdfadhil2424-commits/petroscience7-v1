import { InteractiveClassStudent } from '../types/interactiveClass';
import { ALL_CLASSES } from './studentSessionManager';
import { CLASS_3_ASAH_STUDENTS } from '../data/class3AsahData';
import { CLASS_5_PIRUZ_STUDENTS } from '../data/class5PiruzData';
import { CLASS_3_BERKELAH_STUDENTS } from '../data/class3BerkelahData';

const INTERACTIVE_STUDENTS_KEY = 'kembara_kelas_interaktif_murid_v1';
const INTERACTIVE_SELECTED_CLASS_KEY = 'kembara_kelas_interaktif_selected_class_v1';

export const INTERACTIVE_CLASSES = ALL_CLASSES;

function getSafeStorage(): Storage | null {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

/**
 * Formats an integer index into KP-001 format
 */
export function formatStudentId(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `KP-${padded}`;
}

/**
 * Parses numeric sequence from studentId like KP-005 -> 5
 */
export function parseStudentIdIndex(studentId: string): number {
  const match = studentId.match(/KP-(\d+)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 0;
}

/**
 * Generates the default initial seed of students for 5 Piruz and 3 Berkelah
 * (3 Asah remains as a class option in the selector with 0 students)
 */
function buildInitialSeed(): InteractiveClassStudent[] {
  const now = new Date().toISOString();
  const seedList: InteractiveClassStudent[] = [];

  // Seed 5 Piruz with KP-001 to KP-040
  CLASS_5_PIRUZ_STUDENTS.forEach((st, idx) => {
    const studentId = formatStudentId(idx + 1);
    seedList.push({
      studentId,
      studentName: st.nama,
      class: '5 Piruz',
      cardId: studentId,
      cardStatus: 'active',
      createdAt: now,
    });
  });

  // 3 Asah has 0 students
  CLASS_3_ASAH_STUDENTS.forEach((st, idx) => {
    const studentId = formatStudentId(idx + 1);
    seedList.push({
      studentId,
      studentName: st.nama,
      class: '3 Asah',
      cardId: studentId,
      cardStatus: 'active',
      createdAt: now,
    });
  });

  // Seed 3 Berkelah with KP-001 to KP-020
  CLASS_3_BERKELAH_STUDENTS.forEach((st, idx) => {
    const studentId = formatStudentId(idx + 1);
    seedList.push({
      studentId,
      studentName: st.nama,
      class: '3 Berkelah',
      cardId: studentId,
      cardStatus: 'active',
      createdAt: now,
    });
  });

  return seedList;
}

/**
 * Get all interactive class students from localStorage
 */
export function getAllInteractiveStudents(): InteractiveClassStudent[] {
  const storage = getSafeStorage();
  if (!storage) {
    return buildInitialSeed();
  }

  try {
    const raw = storage.getItem(INTERACTIVE_STUDENTS_KEY);
    if (!raw) {
      const initial = buildInitialSeed();
      storage.setItem(INTERACTIVE_STUDENTS_KEY, JSON.stringify(initial));
      return initial;
    }
    let parsed: InteractiveClassStudent[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let needsSave = false;

      // Migrate any 3 Asah students to 5 Piruz
      const has3Asah = parsed.some((s) => s.class === '3 Asah');
      const piruzStudents = parsed.filter((s) => s.class === '5 Piruz');

      if (has3Asah) {
        parsed = parsed.map((s) => {
          if (s.class === '3 Asah') {
            needsSave = true;
            return { ...s, class: '5 Piruz' };
          }
          return s;
        });
      }

      // Ensure 5 Piruz has all 40 students
      if (piruzStudents.length < 40) {
        CLASS_5_PIRUZ_STUDENTS.forEach((st, idx) => {
          const studentId = formatStudentId(idx + 1);
          if (!parsed.some((s) => s.studentId === studentId && s.class === '5 Piruz')) {
            parsed.push({
              studentId,
              studentName: st.nama,
              class: '5 Piruz',
              cardId: studentId,
              cardStatus: 'active',
              createdAt: new Date().toISOString(),
            });
            needsSave = true;
          }
        });
      }

      // LANGKAH 3: Delete students from 3 Asah (0 students in 3 Asah)
      const cleaned = parsed.filter((s) => s.class !== '3 Asah');
      if (cleaned.length !== parsed.length) {
        parsed = cleaned;
        needsSave = true;
      }

      if (needsSave) {
        storage.setItem(INTERACTIVE_STUDENTS_KEY, JSON.stringify(parsed));
      }

      return parsed;
    }
    const initial = buildInitialSeed();
    storage.setItem(INTERACTIVE_STUDENTS_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.warn('Failed to read interactive students from storage', err);
    return buildInitialSeed();
  }
}

/**
 * Save all interactive students to localStorage
 */
export function saveAllInteractiveStudents(students: InteractiveClassStudent[]): void {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(INTERACTIVE_STUDENTS_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn('Failed to save interactive students to storage', err);
  }
}

/**
 * Get students filtered by class
 */
export function getStudentsByClass(className: string): InteractiveClassStudent[] {
  const all = getAllInteractiveStudents();
  return all.filter((s) => s.class.toLowerCase() === className.toLowerCase());
}

/**
 * Generates the next sequential student ID for a given class (e.g. KP-001 to KP-040)
 */
export function generateNextStudentIdForClass(className: string): string {
  const classStudents = getStudentsByClass(className);
  if (classStudents.length === 0) {
    return 'KP-001';
  }

  const existingIndices = classStudents
    .map((s) => parseStudentIdIndex(s.studentId))
    .filter((num) => num > 0);

  const maxIndex = existingIndices.length > 0 ? Math.max(...existingIndices) : 0;
  return formatStudentId(maxIndex + 1);
}

/**
 * Adds a new student to a class
 */
export function addInteractiveStudent(
  studentName: string,
  className: string,
  customNotes?: string
): InteractiveClassStudent {
  const trimmedName = studentName.trim();
  const trimmedClass = className.trim() || '5 Piruz';
  const newStudentId = generateNextStudentIdForClass(trimmedClass);

  const newStudent: InteractiveClassStudent = {
    studentId: newStudentId,
    studentName: trimmedName,
    class: trimmedClass,
    cardId: newStudentId,
    cardStatus: 'active',
    createdAt: new Date().toISOString(),
    notes: customNotes,
  };

  const all = getAllInteractiveStudents();
  all.push(newStudent);
  saveAllInteractiveStudents(all);

  return newStudent;
}

/**
 * Updates an existing student's details (e.g. name or status)
 */
export function updateInteractiveStudent(
  studentId: string,
  className: string,
  updates: Partial<InteractiveClassStudent>
): InteractiveClassStudent | null {
  const all = getAllInteractiveStudents();
  const index = all.findIndex(
    (s) => s.studentId === studentId && s.class.toLowerCase() === className.toLowerCase()
  );

  if (index === -1) return null;

  const updated: InteractiveClassStudent = {
    ...all[index],
    ...updates,
  };

  all[index] = updated;
  saveAllInteractiveStudents(all);
  return updated;
}

/**
 * Toggles a student's cardStatus between 'active' and 'inactive'
 */
export function toggleInteractiveStudentStatus(
  studentId: string,
  className: string
): InteractiveClassStudent | null {
  const all = getAllInteractiveStudents();
  const index = all.findIndex(
    (s) => s.studentId === studentId && s.class.toLowerCase() === className.toLowerCase()
  );

  if (index === -1) return null;

  const newStatus: 'active' | 'inactive' =
    all[index].cardStatus === 'active' ? 'inactive' : 'active';

  all[index] = {
    ...all[index],
    cardStatus: newStatus,
  };

  saveAllInteractiveStudents(all);
  return all[index];
}

/**
 * Regenerates / resets card IDs for a class in sequential order KP-001, KP-002, ...
 */
export function regenerateCardsForClass(className: string): InteractiveClassStudent[] {
  const all = getAllInteractiveStudents();
  const otherStudents = all.filter((s) => s.class.toLowerCase() !== className.toLowerCase());
  const classStudents = all.filter((s) => s.class.toLowerCase() === className.toLowerCase());

  const renumbered: InteractiveClassStudent[] = classStudents.map((st, idx) => {
    const newId = formatStudentId(idx + 1);
    return {
      ...st,
      studentId: newId,
      cardId: newId,
    };
  });

  const merged = [...otherStudents, ...renumbered];
  saveAllInteractiveStudents(merged);
  return renumbered;
}

/**
 * Get/Set selected class in localStorage
 */
export function getSavedSelectedClass(): string {
  const storage = getSafeStorage();
  if (!storage) return '5 Piruz';
  return storage.getItem(INTERACTIVE_SELECTED_CLASS_KEY) || '5 Piruz';
}

export function saveSelectedClass(className: string): void {
  const storage = getSafeStorage();
  if (!storage) return;
  try {
    storage.setItem(INTERACTIVE_SELECTED_CLASS_KEY, className);
  } catch (err) {
    console.warn('Failed to save selected class', err);
  }
}
