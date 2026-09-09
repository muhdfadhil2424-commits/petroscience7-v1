/**
 * Types for Profil Kecenderungan Pembelajaran Murid (Learning Preference Profile)
 * Designed for Kembara Dunia Pecahan
 * 
 * PENTING:
 * Profil ini BUKAN diagnosis psikologi atau pedagogi mutlak.
 * Ia merupakan analisis kecenderungan penerimaan maklumat berpandukan data interaksi sebenar murid.
 */

export type DominantLearningMode =
  | 'visual'
  | 'auditory'
  | 'kinesthetic'
  | 'combined'
  | 'insufficient_data';

export interface LearningProfile {
  studentId: string;
  studentName: string;
  className: string;
  visualScore: number;       // 0 - 100%
  auditoryScore: number;     // 0 - 100%
  kinestheticScore: number;  // 0 - 100%
  dominantMode: DominantLearningMode;
  combinedModes?: ('visual' | 'auditory' | 'kinesthetic')[];
  dominantLabel: string;     // e.g. "👀 Kecenderungan Visual", "🌈 Kecenderungan Gabungan"
  shortBadge: string;        // e.g. "👀 Visual", "🖐️ Kinestetik", "🌈 Visual + Kinestetik", "🎧 Auditori"
  confidence: number;        // 0 - 100%
  confidenceLevel: 'Tinggi' | 'Sederhana' | 'Rendah' | 'Data Belum Mencukupi';
  evidence: string[];        // Specific data-backed indicators
  description: string;       // Objective phrasing ("Murid menunjukkan kecenderungan...")
  lastUpdated: number;       // Timestamp
}

export interface ClassLearningProfileSummary {
  className: string;
  totalStudents: number;
  visualCount: number;
  auditoryCount: number;
  kinestheticCount: number;
  combinedCount: number;
  insufficientDataCount: number;
  averageVisualScore: number;
  averageAuditoryScore: number;
  averageKinestheticScore: number;
  classPedagogicalInsight: string;
}

export interface AudioInteractionLog {
  id: string;
  studentId: string;
  action: 'listen_explanation' | 'listen_hint' | 'listen_question' | 'tts_speech';
  contextId?: string; // questionId or challengeId
  timestamp: number;
}

export interface KinestheticInteractionLog {
  id: string;
  studentId: string;
  action: 'drag_drop' | 'slider_manipulation' | 'slice_pizza' | 'grid_paint' | 'card_orientation_flip';
  contextId?: string;
  durationSeconds?: number;
  timestamp: number;
}
