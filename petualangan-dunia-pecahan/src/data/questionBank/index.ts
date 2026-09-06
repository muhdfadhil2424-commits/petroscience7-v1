import { QuestionBankItem, GameId, ChallengeId, DskpCode } from './types';
import { ARENA_QUESTIONS } from './arenaQuestions';
import { DAPUR_QUESTIONS } from './dapurQuestions';
import { PIXEL_QUESTIONS } from './pixelQuestions';

// Re-export individual question lists and types
export * from './types';
export { ARENA_QUESTIONS } from './arenaQuestions';
export { DAPUR_QUESTIONS } from './dapurQuestions';
export { PIXEL_QUESTIONS } from './pixelQuestions';

// Aggregate ALL 45 questions (9 challenges × 5 questions)
export const ALL_QUESTIONS: QuestionBankItem[] = [
  ...ARENA_QUESTIONS,
  ...DAPUR_QUESTIONS,
  ...PIXEL_QUESTIONS,
];

// Helper to get questions for specific game and challenge (5 questions)
export function getQuestionsByGameAndChallenge(
  gameId: GameId,
  challengeId: ChallengeId
): QuestionBankItem[] {
  return ALL_QUESTIONS.filter(
    (q) => q.gameId === gameId && q.challengeId === challengeId
  );
}

// Helper to get questions by DSKP code
export function getQuestionsByDskp(dskpCode: DskpCode): QuestionBankItem[] {
  return ALL_QUESTIONS.filter((q) => q.dskpCode === dskpCode);
}

// Question Bank Summary & Verification Function
export function validateQuestionBank(): {
  isValid: boolean;
  totalQuestions: number;
  challengesCount: number;
  dskpCounts: Record<DskpCode, number>;
  duplicateIds: string[];
  invalidOptions: string[];
} {
  const totalQuestions = ALL_QUESTIONS.length;
  const dskpCounts: Record<DskpCode, number> = {
    '3.1.1': 0,
    '3.1.2': 0,
    '3.1.3': 0,
    '3.1.4': 0,
    '3.1.5': 0,
    '3.1.6': 0,
    '3.1.7': 0,
  };

  const idSet = new Set<string>();
  const duplicateIds: string[] = [];
  const invalidOptions: string[] = [];

  for (const q of ALL_QUESTIONS) {
    // Check duplicates
    if (idSet.has(q.questionId)) {
      duplicateIds.push(q.questionId);
    }
    idSet.add(q.questionId);

    // Count DSKP
    if (dskpCounts[q.dskpCode] !== undefined) {
      dskpCounts[q.dskpCode]++;
    }

    // Verify correctAnswer is among options
    if (!q.options.includes(q.correctAnswer)) {
      invalidOptions.push(`${q.questionId}: correctAnswer "${q.correctAnswer}" not in options`);
    }
  }

  const isValid =
    totalQuestions === 45 &&
    duplicateIds.length === 0 &&
    invalidOptions.length === 0 &&
    dskpCounts['3.1.1'] >= 1 &&
    dskpCounts['3.1.2'] >= 1 &&
    dskpCounts['3.1.3'] >= 1 &&
    dskpCounts['3.1.4'] >= 1 &&
    dskpCounts['3.1.5'] >= 6 &&
    dskpCounts['3.1.6'] >= 6 &&
    dskpCounts['3.1.7'] >= 1;

  return {
    isValid,
    totalQuestions,
    challengesCount: 9,
    dskpCounts,
    duplicateIds,
    invalidOptions,
  };
}
