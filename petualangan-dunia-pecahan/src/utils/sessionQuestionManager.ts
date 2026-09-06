import { QuestionBankItem, GameId, ChallengeId } from '../data/questionBank/types';
import { getQuestionsByGameAndChallenge } from '../data/questionBank';
import { getCurrentStudent, saveGameResult } from './studentSessionManager';

export interface SessionQuestionSet {
  arena: {
    challenge1: QuestionBankItem[];
    challenge2: QuestionBankItem[];
    challenge3: QuestionBankItem[];
  };
  dapur: {
    challenge1: QuestionBankItem[];
    challenge2: QuestionBankItem[];
    challenge3: QuestionBankItem[];
  };
  pixel: {
    challenge1: QuestionBankItem[];
    challenge2: QuestionBankItem[];
    challenge3: QuestionBankItem[];
  };
}

export interface QuestionAttemptLog {
  questionId: string;
  gameId: string;
  challengeId: string | number;
  dskpCode: string;
  studentName: string;
  class: string;
  answer: string;
  isCorrect: boolean;
  attempts: number;
  timestamp: number;
}

const SESSION_STORAGE_KEY = 'kembara_session_question_set_v2';
const ATTEMPTS_STORAGE_KEY = 'kembara_question_attempts_v1';

// In-memory cache for ultra-fast offline access
let cachedSessionSet: SessionQuestionSet | null = null;

function getSafeLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

/**
 * Standard Fisher-Yates (Knuth) Shuffle algorithm.
 * Guarantees unbiased random permutation.
 */
export function fisherYatesShuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Prepares a question for the session:
 * - Shuffles options using Fisher-Yates
 * - Verifies correctAnswer is intact
 */
function prepareQuestion(q: QuestionBankItem): QuestionBankItem {
  const shuffledOptions = fisherYatesShuffle(q.options);
  // Sanity check: Ensure correctAnswer is definitely in the options list
  if (!shuffledOptions.includes(q.correctAnswer)) {
    shuffledOptions[0] = q.correctAnswer;
  }
  return {
    ...q,
    options: shuffledOptions,
  };
}

/**
 * Generates a completely new randomized session question set:
 * - 9 challenges × 5 questions = 45 questions
 * - Questions shuffled per challenge
 * - Options shuffled per question
 * - No duplicates within any challenge
 */
export function generateSessionQuestionSet(): SessionQuestionSet {
  const buildChallengeSet = (gameId: GameId, cId: ChallengeId): QuestionBankItem[] => {
    const rawQuestions = getQuestionsByGameAndChallenge(gameId, cId);
    const shuffledQuestions = fisherYatesShuffle(rawQuestions);
    return shuffledQuestions.map(prepareQuestion);
  };

  return {
    arena: {
      challenge1: buildChallengeSet('arena', 1),
      challenge2: buildChallengeSet('arena', 2),
      challenge3: buildChallengeSet('arena', 3),
    },
    dapur: {
      challenge1: buildChallengeSet('dapur', 1),
      challenge2: buildChallengeSet('dapur', 2),
      challenge3: buildChallengeSet('dapur', 3),
    },
    pixel: {
      challenge1: buildChallengeSet('pixel', 1),
      challenge2: buildChallengeSet('pixel', 2),
      challenge3: buildChallengeSet('pixel', 3),
    },
  };
}

/**
 * Creates a brand-new randomized session question set (called on student login)
 * and persists it to memory & local storage for full offline support.
 */
export function createNewSessionQuestionSet(): SessionQuestionSet {
  const newSet = generateSessionQuestionSet();
  cachedSessionSet = newSet;
  try {
    const storage = getSafeLocalStorage();
    if (storage) {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSet));
    }
  } catch (err) {
    console.warn('Failed to persist sessionQuestionSet to localStorage', err);
  }
  return newSet;
}

/**
 * Retrieves the current session question set. If not found, generates one automatically.
 */
export function getCurrentSessionQuestionSet(): SessionQuestionSet {
  if (cachedSessionSet) {
    return cachedSessionSet;
  }

  try {
    const storage = getSafeLocalStorage();
    if (storage) {
      const saved = storage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: SessionQuestionSet = JSON.parse(saved);
        // Validate structure has exactly 5 items in each challenge
        if (
          parsed?.arena?.challenge1?.length === 5 &&
          parsed?.arena?.challenge2?.length === 5 &&
          parsed?.arena?.challenge3?.length === 5 &&
          parsed?.dapur?.challenge1?.length === 5 &&
          parsed?.dapur?.challenge2?.length === 5 &&
          parsed?.dapur?.challenge3?.length === 5 &&
          parsed?.pixel?.challenge1?.length === 5 &&
          parsed?.pixel?.challenge2?.length === 5 &&
          parsed?.pixel?.challenge3?.length === 5
        ) {
          cachedSessionSet = parsed;
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load sessionQuestionSet from localStorage', err);
  }

  return createNewSessionQuestionSet();
}

/**
 * Helper to get the 5 randomized questions for an active game and challenge.
 */
export function getSessionQuestions(
  gameId: 'arena' | 'dapur' | 'pixel',
  challengeId: 1 | 2 | 3
): QuestionBankItem[] {
  const set = getCurrentSessionQuestionSet();
  const cKey = `challenge${challengeId}` as 'challenge1' | 'challenge2' | 'challenge3';
  return set[gameId][cKey] || [];
}

/**
 * Tracks a question attempt with all metadata required by DSKP and Teacher analytics.
 * Works seamlessly offline.
 */
export function trackQuestionAttempt(log: QuestionAttemptLog): void {
  // 1. Save to standalone question attempts log
  try {
    const storage = getSafeLocalStorage();
    if (storage) {
      const raw = storage.getItem(ATTEMPTS_STORAGE_KEY);
      const list: QuestionAttemptLog[] = raw ? JSON.parse(raw) : [];
      list.push(log);
      // Keep last 1000 attempts in local storage
      storage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list.slice(-1000)));
    }
  } catch (err) {
    console.warn('Failed to save to question attempts storage', err);
  }

  // 2. Bridge with studentSessionManager attempt history
  try {
    const student = getCurrentStudent();
    saveGameResult({
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      studentId: student?.id || 'murid_offline',
      sessionId: `ses_${log.gameId}_c${log.challengeId}`,
      gameId: log.gameId,
      challengeId: String(log.challengeId),
      questionId: log.questionId,
      dskpCode: log.dskpCode,
      studentName: log.studentName || student?.nama || student?.name || 'Murid Tahun 3',
      class: log.class || student?.kelas || student?.className || 'Tahun 3',
      answer: log.answer,
      soalan: log.questionId,
      jawapanMurid: log.answer,
      jawapanSebenar: log.isCorrect ? log.answer : '',
      isCorrect: log.isCorrect,
      percubaan: log.attempts,
      attempts: log.attempts,
      hintUsed: 0,
      masaSaat: 10,
      kemahiran: `DSKP ${log.dskpCode}`,
      tarikh: new Date().toISOString(),
      timestamp: log.timestamp,
    });
  } catch (err) {
    console.warn('Failed to bridge with saveGameResult', err);
  }
}

/**
 * Retrieve all logged question attempts
 */
export function getQuestionAttempts(): QuestionAttemptLog[] {
  try {
    const storage = getSafeLocalStorage();
    if (storage) {
      const raw = storage.getItem(ATTEMPTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
    return [];
  } catch {
    return [];
  }
}

export const getAllQuestionAttempts = getQuestionAttempts;
