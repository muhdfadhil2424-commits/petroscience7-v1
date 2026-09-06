export type AnswerOption = 'A' | 'B' | 'C' | 'D';
export type InteractiveCardOrientation = AnswerOption;

export interface InteractiveClassStudent {
  studentId: string; // e.g. "KP-001"
  studentName: string; // e.g. "Adam Hakimi"
  class: string; // e.g. "3 Asah"
  cardId: string; // e.g. "KP-001"
  cardStatus: 'active' | 'inactive';
  createdAt: string; // ISO String
  notes?: string;
}

export interface StudentQrEntry {
  studentId: string; // e.g. "KP-001"
  studentName: string; // e.g. "Adam Hakimi"
  class: string; // e.g. "3 Asah"
  qrId: string; // e.g. "KP-001-A"
  answerOption: AnswerOption; // 'A' | 'B' | 'C' | 'D'
  status: 'active' | 'inactive';
  createdAt: string;
  qrPayload: string;
}

export interface InteractiveClassConfig {
  selectedClass: string;
  lastActiveSession?: string;
}

export interface ScannedStudentAnswer {
  sessionId?: string;
  studentId: string;
  studentName: string;
  class: string;
  questionId: string;
  dskpCode?: string;
  answerOption: AnswerOption;
  answerLetter: AnswerOption;
  orientation?: AnswerOption; // backwards compatibility alias
  answer?: string; // e.g. "3/8" or "A"
  correctAnswer?: string; // e.g. "3/8"
  angleDeg?: number;
  scannedAt: number; // timestamp
  timestamp: number; // timestamp
  isCorrect?: boolean;
}

export interface ScanDetectionResult {
  studentId: string;
  answerOption: AnswerOption;
  qrId: string;
  orientation?: AnswerOption;
  angleDeg?: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  corners?: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
  };
  timestamp: number;
}

export interface InteractiveSessionRecord {
  sessionId: string;
  className: string;
  startedAt: string;
  answers: Record<string, Record<string, ScannedStudentAnswer>>; // questionId -> studentId -> answer
}

