import { InteractiveClassStudent, AnswerOption } from '../types/interactiveClass';
import {
  INTERACTIVE_CLASS_30_QUESTIONS,
  InteractiveClassQuestion,
} from '../data/interactiveClass30Questions';
import {
  loadAllSessionAnswers,
  saveAllSessionAnswers,
} from './interactiveSessionManager';

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
  answers: Record<string, { letter: string; isCorrect: boolean; answerText?: string }>;
}

export interface DskpStandardAnalysis {
  code: string;
  name: string;
  topic: string;
  totalQuestions: number;
  totalResponses: number;
  correctResponses: number;
  percentage: number;
  status: 'Cemerlang' | 'Baik' | 'Sederhana' | 'Perlu Bimbingan';
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
}

export interface ClassSmartInsights {
  overallAccuracy: number;
  masteredCount: number;
  needGuidanceCount: number;
  strongestStandard?: DskpStandardAnalysis;
  weakestStandard?: DskpStandardAnalysis;
  insights: string[];
  recommendations: string[];
}

export interface SavedClassSessionArchive {
  sessionId: string;
  className: string;
  date: string;
  timestamp: number;
  teacherName: string;
  totalStudents: number;
  totalQuestions: number;
  averageAccuracy: number;
}

export const DSKP_STANDARDS_INFO: Record<string, { name: string; topic: string; tip: string }> = {
  '3.1.1': {
    name: 'Pecahan Wajar Sebahagian Kumpulan',
    topic: 'Kumpulan Objek',
    tip: 'Gunakan bahan konkrit (butang, guli, gasing) untuk membimbing murid membilang subset.',
  },
  '3.1.2': {
    name: 'Pecahan Setara',
    topic: 'Pecahan Setara',
    tip: 'Gunakan lipatan kertas warna dan garis nombor bersenggat untuk menunjukkan keluasan yang sama.',
  },
  '3.1.3': {
    name: 'Bentuk Termudah',
    topic: 'Mempermudah Pecahan',
    tip: 'Bimbing murid mengenal sifir sepunya bagi pengangka dan penyebut untuk pembahagian.',
  },
  '3.1.4': {
    name: 'Pecahan Peratus',
    topic: 'Hubungan Peratus & Perseratus',
    tip: 'Gunakan petak seratus (10x10) dan duit syiling sen untuk mengukuhkan konsep peratus.',
  },
  '3.1.5': {
    name: 'Tambah Dua Pecahan Wajar',
    topic: 'Operasi Tambah Pecahan',
    tip: 'Tegaskan bahawa penyebut tidak ditambah, dan bimbing pertukaran pecahan setara jika penyebut tidak sama.',
  },
  '3.1.6': {
    name: 'Tolak Dua Pecahan Wajar',
    topic: 'Operasi Tolak Pecahan',
    tip: 'Bantu murid menukar nilai 1 kepada pecahan (cth: 1 = 4/4) sebelum menolak pecahan berpenyebut sama.',
  },
  '3.1.7': {
    name: 'Pecahan Tak Wajar & Nombor Bercampur',
    topic: 'Pecahan Tak Wajar & Nombor Bercampur',
    tip: 'Tunjukkan visual kek penuh dan bahagian berasingan untuk menghubungkan 3/2 dengan 1 1/2.',
  },
};

/**
 * Calculates suggested Tahap Penguasaan (TP 1 - TP 6) for a student based on standard rubrics
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
      reason: 'Belum ada data imbasan jawapan direkodkan bagi murid ini.',
    };
  }

  const percentage = Math.round((correctCount / totalAnswered) * 100);

  // Confidence is based on sample size (number of answered questions out of 30)
  const confidence: 'Tinggi' | 'Sederhana' | 'Rendah' =
    totalAnswered >= 20 ? 'Tinggi' : totalAnswered >= 10 ? 'Sederhana' : 'Rendah';

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
      'Murid menguasai keseluruhan konsep pecahan Tahun 3 termasuk operasi tambah, tolak, pecahan setara, dan nombor bercampur dengan amat cemerlang.';
  } else if (percentage >= 80) {
    tp = 5;
    reason =
      'Murid menunjukkan kefahaman mantap dalam operasi pecahan wajar serta berkebolehan menyelesaikan pelbagai bentuk soalan rutin.';
  } else if (percentage >= 65) {
    tp = 4;
    reason =
      'Murid menguasai konsep pecahan setara dan bentuk termudah, serta mampu melakukan operasi asas pecahan dengan baik.';
  } else if (percentage >= 50) {
    tp = 3;
    reason =
      'Murid boleh menambah dan menolak pecahan berpenyebut sama, namun masih memerlukan bimbingan bagi penyebut tidak sama atau soalan beraras tinggi.';
  } else if (percentage >= 30) {
    tp = 2;
    reason =
      'Murid mengenali pecahan wajar dan sebahagian kumpulan objek, tetapi memerlukan latihan pengukuhan dalam pecahan setara dan operasi.';
  } else {
    tp = 1;
    reason =
      'Murid masih di peringkat awal mengenal konsep pecahan. Disarankan bimbingan asas secara berfokus dengan bahan bantu mengajar konkrit.';
  }

  return { tp, confidence, reason };
}

/**
 * Generates tailored, concise pedagogical intervention for a student based on their weak standards
 */
export function generateInterventionRecommendation(
  weakStandards: string[],
  percentage: number
): string {
  if (weakStandards.length === 0 && percentage >= 85) {
    return 'Kekalkan kecemerlangan. Berikan soalan KBAT dan cabaran penerokaan pecahan bukan rutin.';
  }

  if (weakStandards.includes('3.1.6')) {
    return 'Latih operasi tolak pecahan dengan penyebut 2, 4 dan 8 serta penolakan daripada 1 penuh.';
  }

  if (weakStandards.includes('3.1.5')) {
    return 'Bimbing langkah menyamakan penyebut sebelum menambah menggunakan carta pecahan setara.';
  }

  if (weakStandards.includes('3.1.2') || weakStandards.includes('3.1.3')) {
    return 'Gunakan visual palang dan pendaraban/pembahagian sifir untuk bentuk pecahan termudah.';
  }

  if (weakStandards.includes('3.1.7')) {
    return 'Gunakan gambar rajah objek penuh dan lebihan untuk memahami penukaran nombor bercampur.';
  }

  if (weakStandards.includes('3.1.4')) {
    return 'Latih menghubungkan penyebut 100 dengan simbol peratus (%) melalui petak 100.';
  }

  return 'Bimbingan berkala secara berkumpulan kecil menggunakan bahan manipulatif dan visual berwarna.';
}

/**
 * Full analysis of each student in the class
 */
export function analyzeAllStudents(
  students: InteractiveClassStudent[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS,
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
        } else if (standardPct < 50) {
          weakStandards.push(code);
        }
      }
    });

    const { tp, confidence, reason } = calculateStudentTP(correctCount, answeredCount, standardsMap);
    const intervention = generateInterventionRecommendation(weakStandards, percentage);

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
      answers: answersRecord,
    };
  });
}

/**
 * Computes breakdown by the 7 DSKP standards (3.1.1 to 3.1.7)
 */
export function analyzeDskpStandards(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS,
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

    let status: 'Cemerlang' | 'Baik' | 'Sederhana' | 'Perlu Bimbingan' = 'Perlu Bimbingan';
    if (percentage >= 80) status = 'Cemerlang';
    else if (percentage >= 65) status = 'Baik';
    else if (percentage >= 50) status = 'Sederhana';

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
 * Identifies the most challenging questions for students (highest wrong count/percentage)
 */
export function findChallengingQuestions(
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS,
  allAnswers = loadAllSessionAnswers(),
  limit = 5
): ChallengingQuestionResult[] {
  const results: ChallengingQuestionResult[] = [];

  questions.forEach((q, idx) => {
    const qAnswers = allAnswers[q.questionId] ? Object.values(allAnswers[q.questionId]) : [];
    const totalAnswered = qAnswers.length;

    if (totalAnswered === 0) return;

    let correctCount = 0;
    const wrongDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

    qAnswers.forEach((ans) => {
      if (ans.answerLetter === q.correctAnswerLetter) {
        correctCount++;
      } else {
        wrongDist[ans.answerLetter] = (wrongDist[ans.answerLetter] || 0) + 1;
      }
    });

    const wrongCount = totalAnswered - correctCount;
    const wrongPercentage = Math.round((wrongCount / totalAnswered) * 100);

    // Find most frequent wrong distractor letter
    let maxDistLetter = '';
    let maxDistVal = 0;
    Object.entries(wrongDist).forEach(([letter, count]) => {
      if (letter !== q.correctAnswerLetter && count > maxDistVal) {
        maxDistVal = count;
        maxDistLetter = letter;
      }
    });

    const info = DSKP_STANDARDS_INFO[q.dskpCode];
    const tip = info ? info.tip : 'Ulangi demonstrasi visual palang pecahan bersama murid.';

    results.push({
      questionId: q.questionId,
      questionNumber: idx + 1,
      question: q.question,
      dskpCode: q.dskpCode,
      correctAnswer: q.correctAnswer,
      correctLetter: q.correctAnswerLetter,
      totalAnswered,
      correctCount,
      wrongCount,
      wrongPercentage,
      commonWrongLetter: maxDistLetter || undefined,
      pedagogicalTip: tip,
    });
  });

  // Sort by highest wrong percentage, then highest wrong count
  results.sort((a, b) => b.wrongPercentage - a.wrongPercentage || b.wrongCount - a.wrongCount);
  return results.slice(0, limit);
}

/**
 * Generates data-grounded smart insights for teacher
 */
export function generateSmartClassInsights(
  dskpAnalysis: DskpStandardAnalysis[],
  studentsAnalysis: StudentAnalysisResult[]
): ClassSmartInsights {
  const totalStudents = studentsAnalysis.length;
  const masteredCount = studentsAnalysis.filter((s) => s.percentage >= 70).length;
  const needGuidanceCount = studentsAnalysis.filter((s) => s.percentage < 70).length;

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

  const insights: string[] = [];
  const recommendations: string[] = [];

  if (strongest && strongest.percentage >= 70) {
    insights.push(`Majoriti murid menunjukkan penguasaan kukuh dalam Standard ${strongest.code} (${strongest.name}) dengan ketepatan ${strongest.percentage}%.`);
  } else if (strongest) {
    insights.push(`Standard pencapaian tertinggi ialah ${strongest.code} (${strongest.name}) pada tahap sederhana (${strongest.percentage}%).`);
  }

  if (weakest && weakest.percentage < 65) {
    insights.push(`Ramai murid masih keliru atau menghadapi kesukaran dalam Standard ${weakest.code} (${weakest.name}) dengan ketepatan ${weakest.percentage}%.`);
    recommendations.push(`Guru disarankan memberi aktiviti pengukuhan dan bimbingan berfokus pada Standard ${weakest.code} (${weakest.name}).`);
  }

  if (activeStandards.some((s) => s.code === '3.1.6' && s.percentage < 60)) {
    recommendations.push('Berikan penekanan khas kepada operasi tolak pecahan (3.1.6) dengan menggunakan kaedah lipatan kertas dan objek maujud.');
  }

  if (activeStandards.some((s) => s.code === '3.1.2' && s.percentage >= 75)) {
    insights.push('Pemahaman pecahan setara (3.1.2) berada pada tahap amat baik, membolehkan murid menyamakan penyebut dengan lebih lancar.');
  }

  if (insights.length === 0) {
    insights.push('Sila imbas kad jawapan murid pada soalan interaktif untuk menjana analisis kelas berasaskan data sebenar.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Gunakan hasil imbasan untuk menyesuaikan aktiviti pemulihan dan pengayaan PBD di bilik darjah.');
  }

  return {
    overallAccuracy,
    masteredCount,
    needGuidanceCount,
    strongestStandard: strongest,
    weakestStandard: weakest,
    insights,
    recommendations,
  };
}

/**
 * Exports complete assessment report to CSV
 */
export function exportClassReportCSV(
  className: string,
  studentsAnalysis: StudentAnalysisResult[],
  dskpAnalysis: DskpStandardAnalysis[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS
) {
  const headers = [
    'Bil',
    'No Kad',
    'Nama Murid',
    'Kelas',
    'Jumlah Betul (/30)',
    'Jumlah Salah (/30)',
    'Peratus (%)',
    'Cadangan TP',
    'Tahap Keyakinan',
    'Standard Kuat',
    'Standard Lemah',
    'Cadangan Intervensi',
    ...questions.map((_, i) => `Q${i + 1}`),
  ];

  const rows = studentsAnalysis.map((s, idx) => {
    const qAnswers = questions.map((q) => {
      const ans = s.answers[q.questionId];
      if (!ans) return '-';
      return ans.isCorrect ? `${ans.letter} (✓)` : `${ans.letter} (✗)`;
    });

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
 */
export function seedRealisticSessionData(
  className: string,
  students: InteractiveClassStudent[],
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS
) {
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const allAnswers = loadAllSessionAnswers();

  students.forEach((student, sIdx) => {
    // Determine student tier for realistic spread:
    // 25% top performers (85-100%)
    // 50% average performers (60-84%)
    // 25% need guidance (30-59%)
    const tier = sIdx % 4;
    const accuracyTarget = tier === 0 ? 0.92 : tier === 1 ? 0.78 : tier === 2 ? 0.68 : 0.48;

    questions.forEach((q) => {
      if (!allAnswers[q.questionId]) {
        allAnswers[q.questionId] = {};
      }

      // Roll chance of correct answer
      const roll = Math.random();
      const isCorrect = roll < accuracyTarget;

      let chosenLetter = q.correctAnswerLetter;
      if (!isCorrect) {
        const wrongLetters = letters.filter((l) => l !== q.correctAnswerLetter);
        chosenLetter = wrongLetters[Math.floor(Math.random() * wrongLetters.length)];
      }

      const optIdx = letters.indexOf(chosenLetter);
      const answerText = optIdx >= 0 ? q.options[optIdx] : chosenLetter;

      allAnswers[q.questionId][student.studentId] = {
        sessionId: `SESI_${className.replace(/\s+/g, '_')}`,
        studentId: student.studentId,
        studentName: student.studentName,
        class: className,
        questionId: q.questionId,
        dskpCode: q.dskpCode,
        answerOption: chosenLetter as AnswerOption,
        orientation: chosenLetter,
        answerLetter: chosenLetter,
        answer: answerText,
        correctAnswer: q.correctAnswer,
        angleDeg: 0,
        scannedAt: Date.now() - Math.floor(Math.random() * 3600000),
        timestamp: Date.now(),
        isCorrect,
      };
    });
  });

  saveAllSessionAnswers(allAnswers);
}
