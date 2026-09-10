import { StudentAnalysisResult, DskpStandardAnalysis, QuestionDetailedAnalysis } from '../../../utils/interactiveDashboardAnalytics';
import { InteractiveClassStudent } from '../../../types/interactiveClass';
import { InteractiveClassQuestion } from '../../../data/interactiveClass30Questions';

export type DashboardTab =
  | 'summary'
  | 'students'
  | 'charts'
  | 'ai'
  | 'questions'
  | 'dskp'
  | 'reports';

export interface TabConfig {
  id: DashboardTab;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

export const DASHBOARD_TABS: TabConfig[] = [
  {
    id: 'summary',
    label: '🏠 Ringkasan',
    shortLabel: 'Ringkasan',
    icon: '🏠',
    description: 'KPI utama, taburan prestasi kelas, kekuatan & rumusan ringkas',
  },
  {
    id: 'students',
    label: '👥 Senarai Murid',
    shortLabel: 'Senarai Murid',
    icon: '👥',
    description: 'Jadual prestasi 40 murid, skor, profil pembelajaran & intervensi',
  },
  {
    id: 'charts',
    label: '📊 Kemajuan & Carta',
    shortLabel: 'Kemajuan & Carta',
    icon: '📊',
    description: 'Visualisasi taburan penguasaan, DSKP, profil & perbandingan sesi',
  },
  {
    id: 'ai',
    label: '🧠 Analisis AI Pedagogi',
    shortLabel: 'Analisis AI',
    icon: '🧠',
    description: 'Diagnosis mendalam Alya, kekuatan, kelemahan & cadangan susulan',
  },
  {
    id: 'questions',
    label: '📋 Analisis Soalan',
    shortLabel: 'Analisis Soalan',
    icon: '📋',
    description: 'Ketepatan 15 soalan, soalan mencabar, mudah & taburan A/B/C/D',
  },
  {
    id: 'dskp',
    label: '🎯 DSKP',
    shortLabel: 'Analisis DSKP',
    icon: '🎯',
    description: '7 Standard Pembelajaran (3.1.1 - 3.1.7), status penguasaan & tip',
  },
  {
    id: 'reports',
    label: '📄 Laporan & Sijil',
    shortLabel: 'Laporan & Sijil',
    icon: '📄',
    description: 'Cetak dokumen PBD rasmi, muat turun CSV & jana sijil murid',
  },
];
