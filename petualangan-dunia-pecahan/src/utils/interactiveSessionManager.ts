import { ScannedStudentAnswer, AnswerOption } from '../types/interactiveClass';
import {
  DEMO_SESSION_STORAGE_KEY,
  DEMO_MODE_STORAGE_KEY,
  getStoredDemoSessionAnswers,
  resetDemoSessionStorage,
  clearDemoSessionStorage,
} from '../data/demoClass3AsahSession';

const STORAGE_SESSION_KEY = 'kembara_interactive_session_v1';

export type SessionDataMode = 'demo' | 'live';

/**
 * Gets currently active session data mode (defaults to 'demo' for 3 Asah initial state)
 */
export function getSessionDataMode(): SessionDataMode {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'demo';
  }
  const mode = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY);
  if (mode === 'live' || mode === 'demo') {
    return mode;
  }
  return 'demo';
}

/**
 * Sets session data mode ('demo' or 'live')
 */
export function setSessionDataMode(mode: SessionDataMode): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, mode);
  }
}

/**
 * Checks if real live scanning session has any recorded answers
 */
export function hasLiveSessionAnswers(className?: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return false;
    for (const qKey of Object.keys(parsed)) {
      const qMap = parsed[qKey];
      if (qMap && typeof qMap === 'object') {
        const entries = Object.values(qMap) as ScannedStudentAnswer[];
        if (entries.length > 0) {
          if (!className) return true;
          if (entries.some((ans) => ans.class.toLowerCase() === className.toLowerCase())) {
            return true;
          }
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

export interface ClassroomQuestionStats {
  totalStudents: number;
  totalAnswered: number;
  totalUnanswered: number;
  percentAnswered: number;
  counts: Record<AnswerOption, number>;
  percentages: Record<AnswerOption, number>;
  correctCount: number;
  wrongCount: number;
  correctPercentage: number;
}

/**
 * Loads answers according to active mode ('demo' or 'live')
 */
export function loadAnswersForDashboard(
  mode: SessionDataMode = getSessionDataMode()
): Record<string, Record<string, ScannedStudentAnswer>> {
  if (mode === 'demo') {
    return getStoredDemoSessionAnswers();
  }
  return loadAllSessionAnswers();
}

/**
 * Reset Demo session data strictly without touching real data
 */
export function resetDemoSessionData(): Record<string, Record<string, ScannedStudentAnswer>> {
  return resetDemoSessionStorage();
}

/**
 * Clear Demo session data strictly without touching real data
 */
export function clearDemoSessionData(): void {
  clearDemoSessionStorage();
}

/**
 * Loads all saved answers for interactive sessions (live real session)
 */
export function loadAllSessionAnswers(): Record<string, Record<string, ScannedStudentAnswer>> {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load interactive session answers:', err);
    return {};
  }
}

/**
 * Saves all session answers
 */
export function saveAllSessionAnswers(data: Record<string, Record<string, ScannedStudentAnswer>>) {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save interactive session answers:', err);
  }
}

/**
 * Records or updates a student answer.
 * Enforces rule: Same student on same question OVERWRITES with latest answer!
 * If question is locked (isLocked === true), rejects modifications.
 */
export function recordStudentAnswer(
  questionId: string,
  studentId: string,
  studentName: string,
  className: string,
  answerOption: AnswerOption,
  angleDeg = 0,
  correctAnswerLetter?: string,
  extraParams?: {
    sessionId?: string;
    dskpCode?: string;
    answerText?: string;
    correctAnswerText?: string;
    isLocked?: boolean;
  }
): {
  answer: ScannedStudentAnswer;
  isUpdate: boolean;
  previousLetter?: string;
  rejectedLocked?: boolean;
} {
  const allAnswers = loadAllSessionAnswers();
  if (!allAnswers[questionId]) {
    allAnswers[questionId] = {};
  }

  const existing = allAnswers[questionId][studentId];

  // If question is locked, do not allow changes!
  if (extraParams?.isLocked) {
    if (existing) {
      return { answer: existing, isUpdate: false, rejectedLocked: true };
    }
  }

  const previousLetter = existing?.answerLetter;
  const isUpdate = !!existing && existing.answerLetter !== answerOption;

  const isCorrect = correctAnswerLetter ? answerOption === correctAnswerLetter : undefined;
  const now = Date.now();

  const record: ScannedStudentAnswer = {
    sessionId: extraParams?.sessionId || 'SESSION_' + className.replace(/\s+/g, '_'),
    studentId,
    studentName,
    class: className,
    questionId,
    dskpCode: extraParams?.dskpCode,
    answerOption,
    answerLetter: answerOption,
    orientation: answerOption,
    answer: extraParams?.answerText || answerOption,
    correctAnswer: extraParams?.correctAnswerText,
    angleDeg,
    scannedAt: now,
    timestamp: now,
    isCorrect,
  };

  allAnswers[questionId][studentId] = record;
  saveAllSessionAnswers(allAnswers);

  return { answer: record, isUpdate, previousLetter };
}

/**
 * Computes overall summary across all questions in the session
 */
export function computeSessionOverallSummary(
  questionIds: string[],
  totalStudents: number
): {
  totalQuestions: number;
  totalStudents: number;
  totalResponsesCollected: number;
  averageClassAccuracy: number;
  questionStats: Record<string, { totalAnswered: number; correctCount: number; accuracy: number }>;
} {
  const allAnswers = loadAllSessionAnswers();
  let totalResponses = 0;
  let totalCorrect = 0;
  let scoredResponses = 0;

  const questionStats: Record<string, { totalAnswered: number; correctCount: number; accuracy: number }> = {};

  questionIds.forEach((qId) => {
    const qAnswers = allAnswers[qId] ? Object.values(allAnswers[qId]) : [];
    const answered = qAnswers.length;
    let correct = 0;

    qAnswers.forEach((ans) => {
      totalResponses++;
      if (ans.isCorrect !== undefined) {
        scoredResponses++;
        if (ans.isCorrect) {
          correct++;
          totalCorrect++;
        }
      }
    });

    questionStats[qId] = {
      totalAnswered: answered,
      correctCount: correct,
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    };
  });

  const averageClassAccuracy =
    scoredResponses > 0 ? Math.round((totalCorrect / scoredResponses) * 100) : 0;

  return {
    totalQuestions: questionIds.length,
    totalStudents,
    totalResponsesCollected: totalResponses,
    averageClassAccuracy,
    questionStats,
  };
}

/**
 * Gets map of student answers for a specific question
 */
export function getAnswersForQuestion(
  questionId: string
): Record<string, ScannedStudentAnswer> {
  const allAnswers = loadAllSessionAnswers();
  return allAnswers[questionId] || {};
}

/**
 * Clears answers for a specific question or entire session
 */
export function clearQuestionAnswers(questionId?: string) {
  if (!questionId) {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    return;
  }
  const allAnswers = loadAllSessionAnswers();
  delete allAnswers[questionId];
  saveAllSessionAnswers(allAnswers);
}

/**
 * Computes classroom statistics for a question
 */
export function computeClassroomStats(
  questionId: string,
  totalStudents: number,
  correctAnswerLetter?: string
): ClassroomQuestionStats {
  const answersMap = getAnswersForQuestion(questionId);
  const answersList = Object.values(answersMap);

  const totalAnswered = answersList.length;
  const totalUnanswered = Math.max(0, totalStudents - totalAnswered);
  const percentAnswered = totalStudents > 0 ? Math.round((totalAnswered / totalStudents) * 100) : 0;

  const counts: Record<AnswerOption, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  let correctCount = 0;
  let wrongCount = 0;

  answersList.forEach((ans) => {
    counts[ans.answerLetter] = (counts[ans.answerLetter] || 0) + 1;
    if (correctAnswerLetter) {
      if (ans.answerLetter === correctAnswerLetter) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const percentages: Record<AnswerOption, number> = {
    A: totalAnswered > 0 ? Math.round((counts.A / totalAnswered) * 100) : 0,
    B: totalAnswered > 0 ? Math.round((counts.B / totalAnswered) * 100) : 0,
    C: totalAnswered > 0 ? Math.round((counts.C / totalAnswered) * 100) : 0,
    D: totalAnswered > 0 ? Math.round((counts.D / totalAnswered) * 100) : 0,
  };

  const correctPercentage = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return {
    totalStudents,
    totalAnswered,
    totalUnanswered,
    percentAnswered,
    counts,
    percentages,
    correctCount,
    wrongCount,
    correctPercentage,
  };
}
