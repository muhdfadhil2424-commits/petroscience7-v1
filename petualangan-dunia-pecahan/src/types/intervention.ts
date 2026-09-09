/**
 * Types for CADANGAN INTERVENSI INDIVIDU OLEH ALYA
 * KSSR Matematik Tahun 3 - Pecahan
 */

export interface DskpMasteryItem {
  code: string;
  title: string;
  status: 'menguasai' | 'perlu_pengukuhan';
  totalQuestions: number;
  correctQuestions: number;
  percentage: number;
  questionIds: string[];
}

export interface InterventionPhase {
  phase: number;
  title: string; // e.g. "Fasa 1: Visualkan Konsep"
  focus: string;
  description: string;
}

export interface LaunchableActivityInfo {
  id: string;
  title: string;
  dskpCode: string;
  topicName: string;
  description: string;
  previewType: 'fraction_bar' | 'equivalent_bars' | 'percentage_grid' | 'addition_bars' | 'subtraction_bars' | 'simplification';
  launchable: boolean;
  gameRoute?: 'arena' | 'dapur' | 'pixel';
  challengeId?: string;
}

export interface StudentInterventionPlan {
  studentId: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  dominantModeLabel: string;
  dominantMode: 'visual' | 'kinesthetic' | 'auditory' | 'combined' | 'insufficient_data';
  confidence: number;

  // 🤖 Ringkasan Alya
  alyaSummary: string;

  // 💪 Kekuatan & 🔎 Perlu Pengukuhan
  strengths: string[];
  weaknesses: string[];

  // ⭐ Cadangan Utama
  primaryRecommendation: string;

  // Urutan Keutamaan Pendekatan
  approachOrder: ('visual' | 'kinesthetic' | 'auditory')[];

  // 3 Pendekatan
  visualApproach: {
    title: string;
    activities: string[];
    example: string;
  };
  kinestheticApproach: {
    title: string;
    activities: string[];
    example: string;
  };
  auditoryApproach: {
    title: string;
    activities: string[];
    example: string;
  };

  // 🎮 Aktiviti Yang Boleh Dicuba
  launchableActivity: LaunchableActivityInfo;

  // 📅 Pelan Intervensi Ringkas (4 Fasa)
  phases: InterventionPhase[];

  // ⚠️ Amaran Pedagogi
  disclaimer: string;
}
