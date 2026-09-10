import { InteractiveClassStudent, AnswerOption } from '../types/interactiveClass';
import {
  INTERACTIVE_CLASS_15_QUESTIONS,
  InteractiveClassQuestion,
} from '../data/interactiveClass30Questions';
import {
  loadAllSessionAnswers,
  saveAllSessionAnswers,
} from './interactiveSessionManager';
import { buildDemo600Responses5Piruz } from '../data/demoClass5PiruzSession';
import { LearningProfile } from '../types/learningProfile';
import { calculateStudentLearningProfile } from './learningProfileManager';

export interface StudentAnalysisResult {
  studentId: string;
  studentName: string;
  class: string;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  suggestedTP: number; // 1 to 6
  tpConfidence: 'Tinggi' | 'Sederhana' | 'Rendah';
  tpReason: string;
  strongStandards: string[];
  weakStandards: string[];
  intervention: string;
  enrichment?: string;
  answers: Record<string, { letter: string; isCorrect: boolean; answerText?: string }>;
  learningProfile?: LearningProfile;
}

export interface DskpStandardAnalysis {
  code: string;
  name: string;
  topic: string;
  totalQuestions: number;
  totalResponses: number;
  correctResponses: number;
  percentage: number;
  status: 'Penguasaan baik' | 'Sedang menguasai' | 'Perlu bimbingan';
}

export interface QuestionDetailedAnalysis {
  questionId: string;
  questionNumber: number;
  question: string;
  dskpCode: string;
  correctAnswer: string;
  correctAnswerLetter: string;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  distribution: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  mostCommonWrongLetter?: string;
  misconceptionAlert?: string;
  pedagogicalTip: string;
}

export interface ChallengingQuestionResult {
  questionId: string;
  questionNumber: number;
  question: string;
  dskpCode: string;
  correctAnswer: string;
  correctLetter: string;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  wrongPercentage: number;
  commonWrongLetter?: string;
  pedagogicalTip: string;
  distribution?: { A: number; B: number; C: number; D: number };
}

export interface ClassSmartInsights {
  overallAccuracy: number;
  masteredCount: number; // >= 80%
  inProgressCount: number; // 60-79%
  needGuidanceCount: number; // < 60%
  unansweredCount: number;
  strongestStandard?: DskpStandardAnalysis;
  weakestStandard?: DskpStandardAnalysis;
  insights: string[];
  recommendations: string[];
  classAverageDescription: string;
}

export interface SessionHistoryItem {
  sessionId: string;
  sessionName: string;
  className: string;
  date: string;
  timestamp: number;
  totalStudents: number;
  totalQuestions: number;
  averageAccuracy: number;
  dskpAverages: Record<string, number>;
}

export interface FollowUpActivity {
  title: string;
  duration: string;
  description: string;
  dskpCode: string;
  material: string;
}

export const DSKP_STANDARDS_INFO: Record<string, { name: string; topic: string; tip: string }> = {
  '3.1.1': {
    name: 'Pecahan wajar sebahagian kumpulan',
    topic: 'Kumpulan Objek',
    tip: 'Gunakan bahan konkrit (butang, guli, gasing) untuk membimbing murid membilang subset.',
  },
  '3.1.2': {
    name: 'Pecahan setara',
    topic: 'Pecahan Setara',
    tip: 'Gunakan lipatan kertas warna dan garis nombor bersenggat untuk menunjukkan keluasan yang sama.',
  },
  '3.1.3': {
    name: 'Bentuk termudah',
    topic: 'Mempermudah Pecahan',
    tip: 'Bimbing murid mengenal sifir sepunya bagi pengangka dan penyebut untuk pembahagian.',
  },
  '3.1.4': {
    name: 'Pecahan peratus',
    topic: 'Hubungan Peratus & Perseratus',
    tip: 'Gunakan petak seratus (10x10) dan duit syiling sen untuk mengukuhkan konsep peratus.',
  },
  '3.1.5': {
    name: 'Tambah pecahan',
    topic: 'Operasi Tambah Pecahan',
    tip: 'Tegaskan bahawa penyebut tidak ditambah, dan bimbing pertukaran pecahan setara jika penyebut tidak sama.',
  },
  '3.1.6': {
    name: 'Tolak pecahan',
    topic: 'Operasi Tolak Pecahan',
    tip: 'Bantu murid menukar nilai 1 kepada pecahan (cth: 1 = 4/4) sebelum menolak pecahan berpenyebut sama.',
  },
  '3.1.7': {
    name: 'Pecahan tak wajar & nombor bercampur',
    topic: 'Pecahan Tak Wajar & Nombor Bercampur',
    tip: 'Tunjukkan visual kek penuh dan bahagian berasingan untuk menghubungkan 3/2 dengan 1 1/2.',
  },
};

const STORAGE_SESSION_HISTORY_KEY = 'kembara_interactive_sessions_history_v1';

/**
 * Loads session history from local storage
 */
export function loadSessionHistory(className?: string): SessionHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_HISTORY_KEY);
    if (!raw) return [];
    const list: SessionHistoryItem[] = JSON.parse(raw);
    if (className) {
      return list.filter((item) => item.className.toLowerCase() === className.toLowerCase());
    }
    return list;
  } catch (err) {
    console.warn('Failed to load session history:', err);
    return [];
  }
}

/**
 * Saves a session item into history
 */
export function saveSessionToHistory(item: SessionHistoryItem) {
  try {
    const current = loadSessionHistory();
    const updated = [item, ...current.filter((s) => s.sessionId !== item.sessionId)].slice(0, 10);
    localStorage.setItem(STORAGE_SESSION_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save session history:', err);
  }
}

/**
 * Calculates suggested Tahap Penguasaan (TP 1 - TP 6) based on holistic DSKP criteria
 */
export function calculateStudentTP(
  correctCount: number,
  totalAnswered: number,
  standardsScores: Record<string, { correct: number; total: number }>
): {
  tp: number;
  confidence: 'Tinggi' | 'Sederhana' | 'Rendah';
  reason: string;
} {
  if (totalAnswered === 0) {
    return {
      tp: 1,
      confidence: 'Rendah',
      reason: 'Belum ada data respons direkodkan bagi murid ini dalam sesi semasa.',
    };
  }

  const percentage = Math.round((correctCount / totalAnswered) * 100);

  // Confidence is based on sample size (number of answered questions out of 15)
  const confidence: 'Tinggi' | 'Sederhana' | 'Rendah' =
    totalAnswered >= 12 ? 'Tinggi' : totalAnswered >= 7 ? 'Sederhana' : 'Rendah';

  let tp = 1;
  let reason = '';

  const addScore = standardsScores['3.1.5'] || { correct: 0, total: 0 };
  const subScore = standardsScores['3.1.6'] || { correct: 0, total: 0 };
  const equivScore = standardsScores['3.1.2'] || { correct: 0, total: 0 };
  const mixedScore = standardsScores['3.1.7'] || { correct: 0, total: 0 };

  const isAddMastered = addScore.total > 0 && addScore.correct / addScore.total >= 0.6;
  const isSubMastered = subScore.total > 0 && subScore.correct / subScore.total >= 0.6;
  const isEquivMastered = equivScore.total > 0 && equivScore.correct / equivScore.total >= 0.6;
  const isMixedMastered = mixedScore.total > 0 && mixedScore.correct / mixedScore.total >= 0.6;

  if (percentage >= 90 && isAddMastered && isSubMastered && isMixedMastered) {
    tp = 6;
    reason =
      'Murid menguasai keseluruhan konsep pecahan Tahun 3 termasuk operasi tambah, tolak, pecahan setara, dan nombor bercampur dengan amat cemerlang serta konsisten.';
  } else if (percentage >= 80) {
    tp = 5;
    reason =
      'Murid menunjukkan kefahaman mantap dalam operasi pecahan wajar serta berkebolehan menyelesaikan pelbagai bentuk soalan rutin dengan yakin.';
  } else if (percentage >= 65) {
    tp = 4;
    reason =
      'Murid menguasai konsep pecahan setara dan bentuk termudah, serta mampu melakukan operasi asas pecahan dengan bimbingan minima.';
  } else if (percentage >= 50) {
    tp = 3;
    reason =
      'Murid boleh menambah dan menolak pecahan berpenyebut sama, namun masih memerlukan bimbingan bagi penyebut tidak sama atau soalan beraras sederhana.';
  } else if (percentage >= 30) {
    tp = 2;
    reason =
      'Murid mengenali pecahan wajar dan sebahagian kumpulan objek, tetapi memerlukan latihan pengukuhan dalam pecahan setara dan operasi tolak.';
  } else {
    tp = 1;
    reason =
      'Murid masih di peringkat awal mengenal konsep pecahan. Disarankan bimbingan asas secara berfokus dengan bahan bantu mengajar konkrit.';
  }

  return { tp, confidence, reason };
}

/**
 * Generates concise pedagogical intervention recommendation for student
 */
export function generateInterventionRecommendation(
  weakStandards: string[],
  percentage: number
): string {
  if (weakStandards.length === 0 && percentage >= 85) {
    return 'Kekalkan kecemerlangan dengan aktiviti penerokaan pecahan bukan rutin dan cabaran teka silang kata pecahan.';
  }

  if (weakStandards.includes('3.1.6')) {
    return 'Latih tolak pecahan menggunakan fraction bar dan potongan kertas lipat pizza.';
  }

  if (weakStandards.includes('3.1.2')) {
    return 'Gunakan fraction bar untuk melihat dan memadankan pecahan setara secara visual.';
  }

  if (weakStandards.includes('3.1.4')) {
    return 'Gunakan grid 100 untuk menghubungkan pecahan dan simbol peratus (%).';
  }

  if (weakStandards.includes('3.1.7')) {
    return 'Gunakan gambar kumpulan penuh dan baki untuk memahami pecahan tak wajar dan nombor bercampur.';
  }

  if (weakStandards.includes('3.1.5')) {
    return 'Latih langkah menyamakan penyebut sebelum menambah menggunakan carta pecahan setara.';
  }

  if (weakStandards.includes('3.1.3')) {
    return 'Bimbing murid mengenal sifir sepunya untuk memudahkan pecahan kepada bentuk termudah.';
  }

  if (weakStandards.includes('3.1.1')) {
    return 'Bimbing membilang jumlah objek dan bahagian dipilih menggunakan objek maujud (butang/guli).';
  }

  return 'Bimbingan berkala secara berkumpulan kecil menggunakan bahan manipulatif dan visual berwarna.';
}

/**
 * Generates Year-3 appropriate enrichment recommendation for high-performing students
 */
export function generateEnrichmentRecommendation(percentage: number, suggestedTP: number): string {
  if (suggestedTP >= 5 || percentage >= 80) {
    return 'Murid boleh diberikan soalan pecahan yang lebih mencabar beraras KBAT (contoh: menyelesaikan teka-teki resipi kuih tradisional menggunakan pecahan setara).';
  }
  return 'Lengkapkan latihan pengukuhan kendiri sebelum beralih ke aktiviti pengayaan.';
}

/**
 * Full analysis of each student in the class
 */
export function analyzeAllStudents(
  students: InteractiveClassStudent[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers = loadAllSessionAnswers()
): StudentAnalysisResult[] {
  return students.map((student) => {
    let answeredCount = 0;
    let correctCount = 0;
    let wrongCount = 0;
    const answersRecord: Record<string, { letter: string; isCorrect: boolean; answerText?: string }> = {};

    const standardsMap: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q) => {
      const qAnswers = allAnswers[q.questionId] || {};
      const studentAns = qAnswers[student.studentId];

      if (!standardsMap[q.dskpCode]) {
        standardsMap[q.dskpCode] = { correct: 0, total: 0 };
      }

      if (studentAns) {
        answeredCount++;
        standardsMap[q.dskpCode].total++;

        const isCorrect = studentAns.answerLetter === q.correctAnswerLetter;
        if (isCorrect) {
          correctCount++;
          standardsMap[q.dskpCode].correct++;
        } else {
          wrongCount++;
        }

        answersRecord[q.questionId] = {
          letter: studentAns.answerLetter,
          isCorrect,
          answerText: studentAns.answer,
        };
      }
    });

    const percentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const strongStandards: string[] = [];
    const weakStandards: string[] = [];

    Object.entries(standardsMap).forEach(([code, stat]) => {
      if (stat.total > 0) {
        const standardPct = (stat.correct / stat.total) * 100;
        if (standardPct >= 70) {
          strongStandards.push(code);
        } else if (standardPct < 60) {
          weakStandards.push(code);
        }
      }
    });

    const { tp, confidence, reason } = calculateStudentTP(correctCount, answeredCount, standardsMap);
    const intervention = generateInterventionRecommendation(weakStandards, percentage);
    const enrichment = generateEnrichmentRecommendation(percentage, tp);
    const learningProfile = calculateStudentLearningProfile(student, answersRecord, questions);

    return {
      studentId: student.studentId,
      studentName: student.studentName,
      class: student.class,
      totalAnswered: answeredCount,
      correctCount,
      wrongCount,
      percentage,
      suggestedTP: tp,
      tpConfidence: confidence,
      tpReason: reason,
      strongStandards,
      weakStandards,
      intervention,
      enrichment,
      answers: answersRecord,
      learningProfile,
    };
  });
}

/**
 * Computes breakdown by the 7 DSKP standards (3.1.1 to 3.1.7)
 * Using strict category labels:
 * 80–100% → Penguasaan baik
 * 60–79% → Sedang menguasai
 * 0–59% → Perlu bimbingan
 */
export function analyzeDskpStandards(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers = loadAllSessionAnswers()
): DskpStandardAnalysis[] {
  const codes = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];

  return codes.map((code) => {
    const stdQuestions = questions.filter((q) => q.dskpCode === code);
    const info = DSKP_STANDARDS_INFO[code] || { name: `Standard ${code}`, topic: 'Pecahan' };

    let totalResponses = 0;
    let correctResponses = 0;

    stdQuestions.forEach((q) => {
      const qAnswers = allAnswers[q.questionId] ? Object.values(allAnswers[q.questionId]) : [];
      qAnswers.forEach((ans) => {
        totalResponses++;
        if (ans.answerLetter === q.correctAnswerLetter) {
          correctResponses++;
        }
      });
    });

    const percentage = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 100) : 0;

    let status: 'Penguasaan baik' | 'Sedang menguasai' | 'Perlu bimbingan' = 'Perlu bimbingan';
    if (percentage >= 80) {
      status = 'Penguasaan baik';
    } else if (percentage >= 60) {
      status = 'Sedang menguasai';
    } else {
      status = 'Perlu bimbingan';
    }

    return {
      code,
      name: info.name,
      topic: info.topic,
      totalQuestions: stdQuestions.length,
      totalResponses,
      correctResponses,
      percentage,
      status,
    };
  });
}

/**
 * Analyzes all 15 questions in detail including option distribution (A, B, C, D)
 */
export function analyzeAllQuestionsDetailed(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers = loadAllSessionAnswers()
): QuestionDetailedAnalysis[] {
  return questions.map((q, idx) => {
    const qAnswers = allAnswers[q.questionId] ? Object.values(allAnswers[q.questionId]) : [];
    const totalAnswered = qAnswers.length;

    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    let correctCount = 0;

    qAnswers.forEach((ans) => {
      const letter = ans.answerLetter as 'A' | 'B' | 'C' | 'D';
      if (distribution[letter] !== undefined) {
        distribution[letter]++;
      }
      if (ans.answerLetter === q.correctAnswerLetter) {
        correctCount++;
      }
    });

    const wrongCount = totalAnswered - correctCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

    // Find most frequent wrong option
    let mostCommonWrongLetter: string | undefined = undefined;
    let maxWrongCount = 0;

    (['A', 'B', 'C', 'D'] as const).forEach((l) => {
      if (l !== q.correctAnswerLetter && distribution[l] > maxWrongCount) {
        maxWrongCount = distribution[l];
        mostCommonWrongLetter = l;
      }
    });

    let misconceptionAlert: string | undefined = undefined;
    if (mostCommonWrongLetter && maxWrongCount >= 3 && maxWrongCount >= wrongCount * 0.4) {
      misconceptionAlert = `Ramai murid memilih ${mostCommonWrongLetter}. Mereka mungkin mempunyai miskonsepsi yang sama.`;
    }

    const tip = DSKP_STANDARDS_INFO[q.dskpCode]?.tip || 'Bimbing murid menggunakan visual perwakilan pecahan.';

    return {
      questionId: q.questionId,
      questionNumber: idx + 1,
      question: q.question,
      dskpCode: q.dskpCode,
      correctAnswer: q.correctAnswer,
      correctAnswerLetter: q.correctAnswerLetter,
      totalAnswered,
      correctCount,
      wrongCount,
      accuracy,
      distribution,
      mostCommonWrongLetter,
      misconceptionAlert,
      pedagogicalTip: tip,
    };
  });
}

/**
 * Finds the most challenging questions for students
 */
export function findChallengingQuestions(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers = loadAllSessionAnswers(),
  limit = 4
): ChallengingQuestionResult[] {
  const detailed = analyzeAllQuestionsDetailed(questions, allAnswers);
  const filtered = detailed.filter((q) => q.totalAnswered > 0);

  filtered.sort((a, b) => {
    if (a.accuracy !== b.accuracy) {
      return a.accuracy - b.accuracy; // lowest accuracy first
    }
    return b.wrongCount - a.wrongCount;
  });

  return filtered.slice(0, limit).map((q) => ({
    questionId: q.questionId,
    questionNumber: q.questionNumber,
    question: q.question,
    dskpCode: q.dskpCode,
    correctAnswer: q.correctAnswer,
    correctLetter: q.correctAnswerLetter,
    totalAnswered: q.totalAnswered,
    correctCount: q.correctCount,
    wrongCount: q.wrongCount,
    wrongPercentage: q.totalAnswered > 0 ? 100 - q.accuracy : 0,
    commonWrongLetter: q.mostCommonWrongLetter,
    pedagogicalTip: q.pedagogicalTip,
    distribution: q.distribution,
  }));
}

/**
 * Finds easiest question and most challenging question from session
 */
export function findEasiestAndChallengingQuestions(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers = loadAllSessionAnswers()
): {
  easiest?: QuestionDetailedAnalysis;
  hardest?: QuestionDetailedAnalysis;
} {
  const detailed = analyzeAllQuestionsDetailed(questions, allAnswers);
  const active = detailed.filter((q) => q.totalAnswered > 0);

  if (active.length === 0) return {};

  const sorted = [...active].sort((a, b) => b.accuracy - a.accuracy || a.wrongCount - b.wrongCount);
  const easiest = sorted[0];
  const hardest = sorted[sorted.length - 1];

  return { easiest, hardest };
}

/**
 * Computes class strengths based on real data
 */
export function generateClassStrengths(
  dskpAnalysis: DskpStandardAnalysis[],
  questionsAnalysis: QuestionDetailedAnalysis[]
): string[] {
  const strengths: string[] = [];
  const activeDskp = dskpAnalysis.filter((s) => s.totalResponses > 0);

  activeDskp
    .filter((s) => s.percentage >= 75)
    .sort((a, b) => b.percentage - a.percentage)
    .forEach((s) => {
      if (s.code === '3.1.1') strengths.push(`Ramai murid mengenal pasti pecahan wajar (${s.percentage}% betul).`);
      else if (s.code === '3.1.2') strengths.push(`Murid menunjukkan penguasaan baik dalam pecahan setara (${s.percentage}% betul).`);
      else if (s.code === '3.1.3') strengths.push(`Kebanyakan murid lancar mempermudah pecahan ke bentuk termudah (${s.percentage}%).`);
      else if (s.code === '3.1.4') strengths.push(`Kefahaman hubungan pecahan dan peratus berada pada tahap kukuh (${s.percentage}%).`);
      else if (s.code === '3.1.5') strengths.push(`Kebanyakan murid boleh menyelesaikan tambah pecahan dengan tepat (${s.percentage}%).`);
      else if (s.code === '3.1.6') strengths.push(`Majoriti murid menguasai operasi tolak pecahan (${s.percentage}%).`);
      else if (s.code === '3.1.7') strengths.push(`Murid berkebolehan menghubungkan pecahan tak wajar dan nombor bercampur (${s.percentage}%).`);
      else strengths.push(`Penguasaan baik dalam standard ${s.code} (${s.percentage}%).`);
    });

  const highQuestions = questionsAnalysis.filter((q) => q.totalAnswered > 0 && q.accuracy >= 85);
  if (highQuestions.length > 0 && strengths.length < 3) {
    strengths.push(`${highQuestions.length} daripada 15 soalan mencapai ketepatan tinggi melebihi 85%.`);
  }

  if (strengths.length === 0) {
    strengths.push('Murid mempamerkan usaha aktif dalam mengimbas kad jawapan semasa sesi berlangsung.');
  }

  return strengths.slice(0, 4);
}

/**
 * Computes class areas for reinforcement based on real data
 * Uses constructive tone: "🔎 PERLU PENGUKUHAN"
 * Strictly avoids: "murid lemah", "kelas lemah", "gagal", "perlu bimbingan"
 */
export function generateClassWeaknesses(
  dskpAnalysis: DskpStandardAnalysis[],
  questionsAnalysis: QuestionDetailedAnalysis[]
): string[] {
  const reinforcements: string[] = [];
  const activeDskp = dskpAnalysis.filter((s) => s.totalResponses > 0);

  // Identify standards needing reinforcement (lowest first, even if above 60%)
  const sorted = [...activeDskp].sort((a, b) => a.percentage - b.percentage);

  sorted.slice(0, 3).forEach((s) => {
    if (s.percentage < 80) {
      if (s.code === '3.1.6') {
        reinforcements.push(`Sesetengah murid masih kurang konsisten dalam tolak pecahan (${s.percentage}% ketepatan).`);
      } else if (s.code === '3.1.4') {
        reinforcements.push(`Hubungan pecahan dan peratus wajar diperkukuhkan lagi dengan perwakilan visual (${s.percentage}%).`);
      } else if (s.code === '3.1.2') {
        reinforcements.push(`Latihan tambahan padanan fraction bar dicadangkan untuk pecahan setara (${s.percentage}%).`);
      } else if (s.code === '3.1.5') {
        reinforcements.push(`Operasi tambah pecahan berpenyebut tidak sama memerlukan penegasan langkah samakan penyebut (${s.percentage}%).`);
      } else if (s.code === '3.1.7') {
        reinforcements.push(`Perkaitan pecahan tak wajar dan nombor bercampur boleh dimantapkan dengan objek maujud (${s.percentage}%).`);
      } else if (s.code === '3.1.3') {
        reinforcements.push(`Murid memerlukan latihan sifir pembahagi untuk mempermudah pecahan (${s.percentage}%).`);
      } else {
        reinforcements.push(`Standard ${s.code} wajar diberikan pengukuhan bersasar (${s.percentage}%).`);
      }
    }
  });

  // Check question with highest errors for specific pedagogical focus
  const activeQuestions = questionsAnalysis.filter((q) => q.totalAnswered > 0);
  if (activeQuestions.length > 0) {
    const hardest = [...activeQuestions].sort((a, b) => a.accuracy - b.accuracy)[0];
    if (hardest && hardest.accuracy < 75 && reinforcements.length < 3) {
      reinforcements.push(`Soalan Q${hardest.questionNumber} (DSKP ${hardest.dskpCode}) paling mencabar bagi murid (${hardest.wrongCount} murid memilih jawapan lain).`);
    }
  }

  if (reinforcements.length === 0) {
    reinforcements.push('Semua standard pembelajaran DSKP 3.1 dikuasai pada tahap yang sangat memuaskan.');
  }

  return reinforcements.slice(0, 3);
}

/**
 * Generates concise 3-4 sentence summary by Alya based on real data
 */
export function generateAlyaSummary(
  overallAccuracy: number,
  strongest?: DskpStandardAnalysis,
  weakest?: DskpStandardAnalysis
): string {
  if (overallAccuracy === 0) {
    return 'Belum ada data respons direkodkan. Mulakan sesi imbasan bersama murid untuk Alya sediakan ringkasan prestasi kelas!';
  }

  let text = `Secara keseluruhan, kelas mencapai ketepatan ${overallAccuracy}%. `;

  if (strongest && strongest.percentage >= 70) {
    text += `Murid menunjukkan penguasaan kukuh dalam ${strongest.name}. `;
  } else {
    text += `Murid sedang membina kefahaman asas pecahan. `;
  }

  if (weakest && weakest.percentage < 65) {
    text += `Kemahiran yang paling perlu diberi perhatian ialah ${weakest.name}. `;
    text += `Cadangan: Gunakan aktiviti fraction bar atau bahan manipulatif selama 10 minit dalam pengukuhan.`;
  } else {
    text += `Pencapaian merentasi standard seimbang dan sedia untuk aktiviti pengukuhan lanjutan.`;
  }

  return text;
}

/**
 * Generates tailored follow-up classroom activities based on weak standards
 */
export function generateClassFollowUpActivities(
  dskpAnalysis: DskpStandardAnalysis[]
): FollowUpActivity[] {
  const activities: FollowUpActivity[] = [];
  const activeDskp = dskpAnalysis.filter((s) => s.totalResponses > 0);
  const weakCodes = activeDskp.filter((s) => s.percentage < 70).map((s) => s.code);

  if (weakCodes.includes('3.1.6')) {
    activities.push({
      title: 'Aktiviti Potong Pizza Pecahan',
      duration: '10 Minit',
      description: 'Gunakan bulatan pizza kertas berwarna untuk mensimulasikan penolakan bahagian pecahan berpenyebut sama.',
      dskpCode: '3.1.6',
      material: 'Bulatan kertas warna & gunting selamat',
    });
  }

  if (weakCodes.includes('3.1.5')) {
    activities.push({
      title: 'Aktiviti Fraction Bar Menambah',
      duration: '10 Minit',
      description: 'Murid menyusun dua jalur pecahan bersebelahan untuk melihat jumlah keseluruhan sebelum menulis ayat matematik.',
      dskpCode: '3.1.5',
      material: 'Jalur palang pecahan (Fraction Bars)',
    });
  }

  if (weakCodes.includes('3.1.2')) {
    activities.push({
      title: 'Aktiviti Padankan Fraction Bar Setara',
      duration: '10 Minit',
      description: 'Murid membandingkan jalur 1/2 dengan 2/4 dan 4/8 untuk membuktikan keluasan panjang yang sama.',
      dskpCode: '3.1.2',
      material: 'Kit Jalur Pecahan Setara',
    });
  }

  if (weakCodes.includes('3.1.4')) {
    activities.push({
      title: 'Aktiviti Mewarna Grid 100',
      duration: '12 Minit',
      description: 'Murid mewarna 25 daripada 100 petak dan menulis hubungan 25/100 bersamaan 25%.',
      dskpCode: '3.1.4',
      material: 'Kertas Grid 10x10 & Pensel Warna',
    });
  }

  if (weakCodes.includes('3.1.7')) {
    activities.push({
      title: 'Aktiviti Objek Penuh & Baki',
      duration: '10 Minit',
      description: 'Murid mengasingkan pinggan berisi penuh (1) dan pinggan berbaki untuk menukar nombor bercampur kepada pecahan tak wajar.',
      dskpCode: '3.1.7',
      material: 'Pinggan kertas & blok pecahan',
    });
  }

  // Default fallback activity if all are strong
  if (activities.length === 0) {
    activities.push({
      title: 'Aktiviti Pengukuhan & Cabaran Stesen Pecahan',
      duration: '15 Minit',
      description: 'Murid bergerak dalam stesen kecil menyelesaikan kad teka-teki pecahan dan mencipta soalan pecahan mereka sendiri.',
      dskpCode: '3.1',
      material: 'Kad Teka-Teki Pecahan Kembara',
    });
  }

  return activities.slice(0, 3);
}

/**
 * Computes high-level smart class insights
 */
export function generateSmartClassInsights(
  dskpAnalysis: DskpStandardAnalysis[],
  studentsAnalysis: StudentAnalysisResult[]
): ClassSmartInsights {
  const masteredCount = studentsAnalysis.filter((s) => s.totalAnswered > 0 && s.percentage >= 80).length;
  const inProgressCount = studentsAnalysis.filter(
    (s) => s.totalAnswered > 0 && s.percentage >= 60 && s.percentage < 80
  ).length;
  const needGuidanceCount = studentsAnalysis.filter(
    (s) => s.totalAnswered > 0 && s.percentage < 60
  ).length;
  const unansweredCount = studentsAnalysis.filter((s) => s.totalAnswered === 0).length;

  let totalCorrect = 0;
  let totalAnswered = 0;

  studentsAnalysis.forEach((s) => {
    totalCorrect += s.correctCount;
    totalAnswered += s.totalAnswered;
  });

  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Filter standards that have actual responses
  const activeStandards = dskpAnalysis.filter((s) => s.totalResponses > 0);
  activeStandards.sort((a, b) => b.percentage - a.percentage);

  const strongest = activeStandards.length > 0 ? activeStandards[0] : undefined;
  const weakest = activeStandards.length > 0 ? activeStandards[activeStandards.length - 1] : undefined;

  let classAverageDescription = 'Belum ada data imbasan yang direkodkan.';
  if (totalAnswered > 0) {
    if (overallAccuracy >= 80) {
      classAverageDescription = 'Majoriti murid menunjukkan penguasaan yang sangat baik dalam topik ini.';
    } else if (overallAccuracy >= 60) {
      classAverageDescription = 'Sebahagian besar murid sedang menguasai kemahiran asas dengan memuaskan.';
    } else {
      classAverageDescription = 'Ramai murid masih memerlukan pengukuhan dan bimbingan berfokus.';
    }
  }

  const insights: string[] = [];
  const recommendations: string[] = [];

  if (strongest && strongest.percentage >= 75) {
    insights.push(`Majoriti murid menunjukkan penguasaan kukuh dalam standard ${strongest.code} (${strongest.name}) dengan ${strongest.percentage}% ketepatan.`);
  }

  if (weakest && weakest.percentage < 65) {
    insights.push(`Standard ${weakest.code} (${weakest.name}) merupakan kemahiran yang paling memerlukan bimbingan (${weakest.percentage}% ketepatan).`);
    recommendations.push(`Rancang aktiviti pemulihan berfokus untuk ${weakest.name} menggunakan bahan manipulatif konkrit.`);
  }

  return {
    overallAccuracy,
    masteredCount,
    inProgressCount,
    needGuidanceCount,
    unansweredCount,
    strongestStandard: strongest,
    weakestStandard: weakest,
    insights,
    recommendations,
    classAverageDescription,
  };
}

/**
 * Exports complete assessment report to CSV
 */
export function exportClassReportCSV(
  className: string,
  studentsAnalysis: StudentAnalysisResult[],
  dskpAnalysis: DskpStandardAnalysis[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS
) {
  const headers = [
    'Bil',
    'No Kad',
    'Nama Murid',
    'Kelas',
    'Jumlah Betul (/15)',
    'Jumlah Salah (/15)',
    'Peratus (%)',
    'Cadangan TP',
    'Tahap Keyakinan TP',
    'Kecenderungan Pembelajaran',
    'Skor Visual (%)',
    'Skor Kinestetik (%)',
    'Skor Auditori (%)',
    'Keyakinan Profil (%)',
    'Standard Kuat',
    'Perlu Bimbingan',
    'Cadangan Intervensi',
    ...questions.map((_, i) => `Q${i + 1}`),
  ];

  const rows = studentsAnalysis.map((s, idx) => {
    const qAnswers = questions.map((q) => {
      const ans = s.answers[q.questionId];
      if (!ans) return 'Tiada Respons';
      return ans.isCorrect ? `${ans.letter} (✓)` : `${ans.letter} (✗)`;
    });

    const lp = s.learningProfile;

    return [
      idx + 1,
      s.studentId,
      `"${s.studentName.replace(/"/g, '""')}"`,
      `"${s.class}"`,
      s.correctCount,
      s.wrongCount,
      `${s.percentage}%`,
      `TP ${s.suggestedTP}`,
      s.tpConfidence,
      `"${lp ? lp.dominantLabel : '-'}"`,
      lp ? lp.visualScore : 0,
      lp ? lp.kinestheticScore : 0,
      lp ? lp.auditoryScore : 0,
      lp ? lp.confidence : 0,
      `"${s.strongStandards.join(', ') || '-'}"`,
      `"${s.weakStandards.join(', ') || '-'}"`,
      `"${s.intervention.replace(/"/g, '""')}"`,
      ...qAnswers,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_PBD_Kelas_Interaktif_${className.replace(/\s+/g, '_')}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Seed realistic simulated scan responses for a class (Useful for teachers testing out the system)
 * Strictly enforces 40/40 answered, 35 Menguasai (80-100%), 5 Sedang Menguasai (60-79%), 0 Perlu Bimbingan (<60%)
 */
export function seedRealisticSessionData(
  className: string,
  students: InteractiveClassStudent[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS
) {
  const { nestedAnswers } = buildDemo600Responses5Piruz();
  saveAllSessionAnswers(nestedAnswers);
}
