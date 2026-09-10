import { ScannedStudentAnswer, AnswerOption } from '../types/interactiveClass';
import { CLASS_5_PIRUZ_STUDENTS } from './class5PiruzData';
import { INTERACTIVE_CLASS_15_QUESTIONS } from './interactiveClass30Questions';

export const DEMO_SESSION_ID = 'DEMO-SESSION-001';
export const DEMO_CLASS_NAME = '5 Piruz';
export const DEMO_SESSION_STORAGE_KEY = 'kembara_demo_class_session_v1';
export const DEMO_MODE_STORAGE_KEY = 'kembara_session_source_mode_v1';

/**
 * Predetermined realistic error mapping per student in 5 Piruz.
 * 7 students: 15/15 (0 wrong) -> Menguasai (100%)
 * 12 students: 14/15 (1 wrong) -> Menguasai (93%)
 * 10 students: 13/15 (2 wrong) -> Menguasai (87%)
 * 6 students: 12/15 (3 wrong) -> Menguasai (80%)
 * ----------------------------------------------------
 * Subtotal Menguasai = 35 murid (80% - 100%)
 * 
 * 2 students: 11/15 (4 wrong) -> Sedang Menguasai (73%)
 * 2 students: 10/15 (5 wrong) -> Sedang Menguasai (67%)
 * 1 student: 9/15 (6 wrong) -> Sedang Menguasai (60%)
 * ----------------------------------------------------
 * Subtotal Sedang Menguasai = 5 murid (60% - 79%)
 * 
 * 0 students: <9/15 (<60%) -> Perlu Bimbingan = 0 murid (0%)
 * Total = 40 murid, 600 respons (526 betul, 74 salah, purata 87.7% ~ 88%)
 */
export const STUDENT_WRONG_QUESTIONS: Record<string, string[]> = {
  // 🟢 15/15 — 8 MURID (100%)
  'KP-001': [], // Adam Hakimi
  'KP-005': [], // Arif Iman
  'KP-008': [], // Damia Qaisara
  'KP-012': [], // Iman Aqilah
  'KP-020': [], // Nur Aisyah
  'KP-027': [], // Syafiq Adam
  'KP-036': [], // Izzat Hakim (15/15 - 100% Menguasai)
  'KP-040': [], // Umar Hakimi

  // 🟢 14/15 — 12 MURID (93.3%)
  'KP-003': ['CLASS_Q11'], // Amir Danish
  'KP-006': ['CLASS_Q11'], // Balqis Humaira
  'KP-010': ['CLASS_Q12'], // Faris Zikri
  'KP-014': ['CLASS_Q12'], // Jannah Amani
  'KP-016': ['CLASS_Q13'], // Luqman Harith
  'KP-017': ['CLASS_Q12'], // Maisarah Imani
  'KP-021': ['CLASS_Q13'], // Nurin Qistina
  'KP-023': ['CLASS_Q13'], // Qaisara Humaira
  'KP-025': ['CLASS_Q13'], // Siti Aina
  'KP-028': ['CLASS_Q13'], // Umar Faris
  'KP-030': ['CLASS_Q14'], // Yasmin Aqilah
  'KP-033': ['CLASS_Q14'], // Aqil Rayyan

  // 🟢 13/15 — 10 MURID (86.7%)
  'KP-002': ['CLASS_Q07', 'CLASS_Q14'], // Aisyah Sofea
  'KP-007': ['CLASS_Q09', 'CLASS_Q14'], // Danish Irfan
  'KP-011': ['CLASS_Q07', 'CLASS_Q14'], // Hani Sofea
  'KP-015': ['CLASS_Q09', 'CLASS_Q14'], // Khairul Aiman
  'KP-019': ['CLASS_Q10', 'CLASS_Q15'], // Naufal Danish
  'KP-022': ['CLASS_Q11', 'CLASS_Q14'], // Puteri Aleesya
  'KP-026': ['CLASS_Q07', 'CLASS_Q14'], // Sofea Humaira
  'KP-032': ['CLASS_Q12', 'CLASS_Q15'], // Zikri Danish
  'KP-034': ['CLASS_Q06', 'CLASS_Q12'], // Danish Aiman (13/15 - 86.7% Menguasai)
  'KP-039': ['CLASS_Q12', 'CLASS_Q13'], // Syaqirah Amani

  // 🟢 12/15 — 6 MURID (80.0%)
  'KP-004': ['CLASS_Q04', 'CLASS_Q06', 'CLASS_Q13'], // Alya Maisarah
  'KP-018': ['CLASS_Q04', 'CLASS_Q05', 'CLASS_Q11'], // Muhammad Arman
  'KP-031': ['CLASS_Q04', 'CLASS_Q11', 'CLASS_Q15'], // Zara Qaisara
  'KP-035': ['CLASS_Q04', 'CLASS_Q07', 'CLASS_Q13'], // Hana Sofea (12/15 - 80.0% Menguasai)
  'KP-037': ['CLASS_Q04', 'CLASS_Q07', 'CLASS_Q13'], // Nur Amirah
  'KP-038': ['CLASS_Q07', 'CLASS_Q10', 'CLASS_Q15'], // Rayyan Danish

  // 🟡 11/15 — 2 MURID (73.3% - Sedang Menguasai)
  'KP-009': ['CLASS_Q04', 'CLASS_Q06', 'CLASS_Q11', 'CLASS_Q13'], // Ehsan Hakim
  'KP-024': ['CLASS_Q04', 'CLASS_Q05', 'CLASS_Q09', 'CLASS_Q13'], // Rayyan Akmal

  // 🟡 10/15 — 1 MURID (66.7% - Sedang Menguasai)
  'KP-013': ['CLASS_Q04', 'CLASS_Q06', 'CLASS_Q08', 'CLASS_Q13', 'CLASS_Q14'], // Irfan Hakimi

  // 🟡 9/15 — 1 MURID (60.0% - Sedang Menguasai, Tiada Markah Bawah 9/15)
  'KP-029': ['CLASS_Q02', 'CLASS_Q03', 'CLASS_Q04', 'CLASS_Q05', 'CLASS_Q08', 'CLASS_Q13'], // Wafi Hakim
};

const WRONG_OPTION_MAP: Record<string, AnswerOption[]> = {
  CLASS_Q01: ['B', 'C', 'D'],
  CLASS_Q02: ['C', 'A', 'D'],
  CLASS_Q03: ['A', 'B', 'D'],
  CLASS_Q04: ['A', 'B', 'C'],
  CLASS_Q05: ['B', 'C', 'D'],
  CLASS_Q06: ['A', 'C', 'D'],
  CLASS_Q07: ['B', 'A', 'D'],
  CLASS_Q08: ['A', 'B', 'C'],
  CLASS_Q09: ['C', 'B', 'D'],
  CLASS_Q10: ['A', 'C', 'D'],
  CLASS_Q11: ['A', 'B', 'D'],
  CLASS_Q12: ['A', 'B', 'C'],
  CLASS_Q13: ['C', 'D', 'B'],
  CLASS_Q14: ['A', 'D', 'C'],
  CLASS_Q15: ['A', 'D', 'B'],
};

/**
 * Generate the 600 response records for 5 Piruz
 */
export function buildDemo600Responses5Piruz(): {
  records: ScannedStudentAnswer[];
  nestedAnswers: Record<string, Record<string, ScannedStudentAnswer>>;
} {
  const records: ScannedStudentAnswer[] = [];
  const nestedAnswers: Record<string, Record<string, ScannedStudentAnswer>> = {};

  const baseTime = new Date('2025-06-15T09:00:00Z').getTime();

  // Initialize nested structure for all 15 questions
  INTERACTIVE_CLASS_15_QUESTIONS.forEach((q) => {
    nestedAnswers[q.questionId] = {};
  });

  CLASS_5_PIRUZ_STUDENTS.forEach((st, sIdx) => {
    const padded = String(sIdx + 1).padStart(3, '0');
    const studentId = `KP-${padded}`;
    const studentName = st.nama;
    const wrongList = STUDENT_WRONG_QUESTIONS[studentId] || [];

    INTERACTIVE_CLASS_15_QUESTIONS.forEach((q, qIdx) => {
      const isWrong = wrongList.includes(q.questionId);
      const isCorrect = !isWrong;

      let answerLetter: AnswerOption;
      if (isCorrect) {
        answerLetter = q.correctAnswerLetter as AnswerOption;
      } else {
        const distractors = WRONG_OPTION_MAP[q.questionId] || ['A', 'B', 'C', 'D'];
        answerLetter = distractors[sIdx % distractors.length];
        if (answerLetter === q.correctAnswerLetter) {
          answerLetter = distractors[(sIdx + 1) % distractors.length];
        }
      }

      const letterIndex = answerLetter.charCodeAt(0) - 65;
      const answerText = q.options[letterIndex] || answerLetter;
      const timestamp = baseTime + qIdx * 90000 + sIdx * 2000;

      const record: ScannedStudentAnswer = {
        sessionId: DEMO_SESSION_ID,
        studentId,
        studentName,
        class: DEMO_CLASS_NAME,
        questionId: q.questionId,
        dskpCode: q.dskpCode,
        answerOption: answerLetter,
        answerLetter,
        orientation: answerLetter,
        answer: answerText,
        correctAnswer: q.correctAnswer,
        angleDeg: 0,
        scannedAt: timestamp,
        timestamp,
        isCorrect,
      };

      records.push(record);
      nestedAnswers[q.questionId][studentId] = record;
    });
  });

  return { records, nestedAnswers };
}

// Pre-generated pristine demo dataset for 5 Piruz
const pristineDemo5Piruz = buildDemo600Responses5Piruz();
export const DEMO_600_RESPONSES_5PIRUZ = pristineDemo5Piruz.records;
export const DEMO_SESSION_NESTED_ANSWERS_5PIRUZ = pristineDemo5Piruz.nestedAnswers;

/**
 * Load demo session answers from localStorage or fallback to pristine 5 Piruz
 */
export function getStoredDemoSessionAnswers5Piruz(): Record<string, Record<string, ScannedStudentAnswer>> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEMO_SESSION_NESTED_ANSWERS_5PIRUZ;
  }

  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(DEMO_SESSION_NESTED_ANSWERS_5PIRUZ));
      return DEMO_SESSION_NESTED_ANSWERS_5PIRUZ;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      // Check if any answers belong to '3 Asah', migrate them to '5 Piruz'
      let needsMigration = false;
      for (const qKey of Object.keys(parsed)) {
        for (const stKey of Object.keys(parsed[qKey] || {})) {
          if (parsed[qKey][stKey].class === '3 Asah') {
            parsed[qKey][stKey].class = '5 Piruz';
            needsMigration = true;
          }
        }
      }
      if (needsMigration) {
        window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(DEMO_SESSION_NESTED_ANSWERS_5PIRUZ));
    return DEMO_SESSION_NESTED_ANSWERS_5PIRUZ;
  } catch (err) {
    console.warn('Failed to parse demo session from storage, restoring pristine demo', err);
    return DEMO_SESSION_NESTED_ANSWERS_5PIRUZ;
  }
}

export function resetDemoSessionStorage5Piruz(): Record<string, Record<string, ScannedStudentAnswer>> {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(DEMO_SESSION_NESTED_ANSWERS_5PIRUZ));
  }
  return DEMO_SESSION_NESTED_ANSWERS_5PIRUZ;
}
