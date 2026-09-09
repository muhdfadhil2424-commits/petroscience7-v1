import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BookOpen,
  Search,
  RotateCcw,
  ShieldAlert,
  Flame,
  Lightbulb,
  Target,
  BarChart3,
  Eye,
  EyeOff,
  Clock,
  HelpCircle,
  Grid,
  List,
  Save,
  ArrowUpRight,
  Info,
  Calendar,
  Layers,
  Trash2,
} from 'lucide-react';
import { InteractiveClassStudent } from '../../types/interactiveClass';
import {
  INTERACTIVE_CLASS_15_QUESTIONS,
  InteractiveClassQuestion,
} from '../../data/interactiveClass30Questions';
import {
  loadAllSessionAnswers,
  clearQuestionAnswers,
  loadAnswersForDashboard,
  resetDemoSessionData,
  clearDemoSessionData,
  getSessionDataMode,
  setSessionDataMode,
  hasLiveSessionAnswers,
  SessionDataMode,
} from '../../utils/interactiveSessionManager';
import { DEMO_SESSION_ID } from '../../data/demoClass3AsahSession';
import {
  analyzeAllStudents,
  analyzeDskpStandards,
  analyzeAllQuestionsDetailed,
  findChallengingQuestions,
  findEasiestAndChallengingQuestions,
  generateClassStrengths,
  generateClassWeaknesses,
  generateAlyaSummary,
  generateClassFollowUpActivities,
  generateSmartClassInsights,
  exportClassReportCSV,
  seedRealisticSessionData,
  loadSessionHistory,
  saveSessionToHistory,
  StudentAnalysisResult,
  DskpStandardAnalysis,
  QuestionDetailedAnalysis,
  ChallengingQuestionResult,
  SessionHistoryItem,
  FollowUpActivity,
  DSKP_STANDARDS_INFO,
} from '../../utils/interactiveDashboardAnalytics';
import { playSfx } from '../../utils/audio';
import { AlyaCharacter } from '../AlyaCharacter';
import { DominantLearningMode } from '../../types/learningProfile';
import { analyzeClassLearningProfiles } from '../../utils/learningProfileManager';
import { AlyaInterventionModal } from '../AlyaInterventionModal';

interface InteractiveClassDashboardProps {
  selectedClass: string;
  students: InteractiveClassStudent[];
  soundEnabled?: boolean;
  onNavigateToSession?: () => void;
}

type StudentFilterType = 'all' | 'high' | 'progress' | 'guidance' | 'unanswered';

export const InteractiveClassDashboard: React.FC<InteractiveClassDashboardProps> = ({
  selectedClass,
  students,
  soundEnabled = true,
  onNavigateToSession,
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<StudentFilterType>('all');
  const [learningModeFilter, setLearningModeFilter] = useState<'all' | DominantLearningMode>('all');
  const [dskpFilter, setDskpFilter] = useState<string>('all');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [sessionSaveNotice, setSessionSaveNotice] = useState<string | null>(null);
  const [interventionModalStudent, setInterventionModalStudent] = useState<{
    name: string;
    id: string;
    studentClass: string;
    profile: any;
  } | null>(null);

  // Active data source: 'demo' (deterministic 600 records for 3 Asah) or 'live' (real scanning records)
  const [sessionMode, setSessionMode] = useState<SessionDataMode>(() => {
    return getSessionDataMode();
  });

  const questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS;

  // Load session answers according to active data mode (demo or live)
  const allAnswers = useMemo(() => {
    return loadAnswersForDashboard(sessionMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionMode, dataVersion]);

  // Total answers scanned in session
  const totalScansInSession = useMemo(() => {
    let count = 0;
    Object.values(allAnswers).forEach((qMap) => {
      count += Object.keys(qMap).length;
    });
    return count;
  }, [allAnswers]);

  // Compute Core Analytics
  const studentsAnalysis: StudentAnalysisResult[] = useMemo(() => {
    return analyzeAllStudents(students, questions, allAnswers);
  }, [students, questions, allAnswers]);

  const dskpAnalysis: DskpStandardAnalysis[] = useMemo(() => {
    return analyzeDskpStandards(questions, allAnswers);
  }, [questions, allAnswers]);

  const questionsAnalysis: QuestionDetailedAnalysis[] = useMemo(() => {
    return analyzeAllQuestionsDetailed(questions, allAnswers);
  }, [questions, allAnswers]);

  const { easiest: easiestQuestion, hardest: hardestQuestion } = useMemo(() => {
    return findEasiestAndChallengingQuestions(questions, allAnswers);
  }, [questions, allAnswers]);

  const smartInsights = useMemo(() => {
    return generateSmartClassInsights(dskpAnalysis, studentsAnalysis);
  }, [dskpAnalysis, studentsAnalysis]);

  const classStrengths = useMemo(() => {
    return generateClassStrengths(dskpAnalysis, questionsAnalysis);
  }, [dskpAnalysis, questionsAnalysis]);

  const classWeaknesses = useMemo(() => {
    return generateClassWeaknesses(dskpAnalysis, questionsAnalysis);
  }, [dskpAnalysis, questionsAnalysis]);

  const alyaSummaryText = useMemo(() => {
    return generateAlyaSummary(
      smartInsights.overallAccuracy,
      smartInsights.strongestStandard,
      smartInsights.weakestStandard
    );
  }, [smartInsights]);

  const followUpActivities: FollowUpActivity[] = useMemo(() => {
    return generateClassFollowUpActivities(dskpAnalysis);
  }, [dskpAnalysis]);

  // Class-wide Learning Preference Profiles (Visual, Kinestetik, Auditori, Gabungan)
  const classLearningData = useMemo(() => {
    return analyzeClassLearningProfiles(students, allAnswers, questions);
  }, [students, allAnswers, questions]);

  const classLearningSummary = classLearningData.summary;

  // Session History & Comparisons
  const sessionHistory = useMemo(() => {
    return loadSessionHistory(selectedClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, dataVersion]);

  // Ranked students by score / percentage
  const rankedStudents = useMemo(() => {
    return [...studentsAnalysis].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.correctCount - a.correctCount;
    });
  }, [studentsAnalysis]);

  // Highest score achieved in class
  const highestScore = useMemo(() => {
    if (rankedStudents.length === 0) return 0;
    return Math.max(...rankedStudents.map((s) => s.correctCount));
  }, [rankedStudents]);

  // List of high performers (>= 80%)
  const topStudents = useMemo(() => {
    return rankedStudents.filter((s) => s.totalAnswered > 0 && s.percentage >= 80);
  }, [rankedStudents]);

  // List of students needing guidance (< 60%)
  const guidanceStudents = useMemo(() => {
    return rankedStudents.filter((s) => s.totalAnswered > 0 && s.percentage < 60);
  }, [rankedStudents]);

  // List of students with no response
  const unansweredStudents = useMemo(() => {
    return rankedStudents.filter((s) => s.totalAnswered === 0);
  }, [rankedStudents]);

  // Filtered students for scoreboard & heatmap
  const filteredStudents = useMemo(() => {
    let list = rankedStudents;

    // Filter by tier
    if (activeFilter === 'high') {
      list = list.filter((s) => s.totalAnswered > 0 && s.percentage >= 80);
    } else if (activeFilter === 'progress') {
      list = list.filter((s) => s.totalAnswered > 0 && s.percentage >= 60 && s.percentage < 80);
    } else if (activeFilter === 'guidance') {
      list = list.filter((s) => s.totalAnswered > 0 && s.percentage < 60);
    } else if (activeFilter === 'unanswered') {
      list = list.filter((s) => s.totalAnswered === 0);
    }

    // Filter by DSKP weak standard if selected
    if (dskpFilter !== 'all') {
      list = list.filter((s) => s.weakStandards.includes(dskpFilter));
    }

    // Filter by learning mode preference if selected
    if (learningModeFilter !== 'all') {
      list = list.filter((s) => s.learningProfile?.dominantMode === learningModeFilter);
    }

    // Filter by search query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.studentName.toLowerCase().includes(term) ||
          s.studentId.toLowerCase().includes(term)
      );
    }

    return list;
  }, [rankedStudents, activeFilter, learningModeFilter, dskpFilter, searchTerm]);

  // Active student for detailed profile modal
  const activeStudentModal = useMemo(() => {
    if (!selectedStudentId) return null;
    return studentsAnalysis.find((s) => s.studentId === selectedStudentId) || null;
  }, [selectedStudentId, studentsAnalysis]);

  // Active question for inspection card
  const activeQuestionDetail = useMemo(() => {
    if (selectedQuestionIndex === null) return null;
    return questionsAnalysis[selectedQuestionIndex] || null;
  }, [selectedQuestionIndex, questionsAnalysis]);

  // Mask student name if privacy mode is on
  const getDisplayName = (studentName: string, studentId: string) => {
    if (!isPrivacyMode) return studentName;
    const parts = studentId.split('-');
    const num = parts.length > 1 ? parts[1] : studentId;
    return `Murid ${num}`;
  };

  // Switch Data Mode (Demo vs Live)
  const handleToggleDataMode = (newMode: SessionDataMode) => {
    setSessionDataMode(newMode);
    setSessionMode(newMode);
    playSfx('click', soundEnabled);
    setDataVersion((v) => v + 1);
  };

  // Reset Demo Data (deterministic 600 records for 3 Asah: 35 Menguasai, 5 Sedang Menguasai, 0 Perlu Bimbingan)
  const handleResetDemoData = () => {
    resetDemoSessionData();
    playSfx('chime', soundEnabled);
    setSessionSaveNotice(
      '✅ Data Demo 3 Asah berjaya di-reset kepada 600 respons lengkap (35 Menguasai, 5 Sedang Menguasai, 0 Perlu Bimbingan)!'
    );
    setDataVersion((v) => v + 1);
    setTimeout(() => {
      setSessionSaveNotice(null);
    }, 5000);
  };

  // Clear Demo Data (wipes only demo storage)
  const handleClearDemoData = () => {
    if (window.confirm('Padamkan data demo sesi kelas 3 Asah?')) {
      clearDemoSessionData();
      playSfx('click', soundEnabled);
      setSessionSaveNotice('Data demo dipadamkan.');
      setDataVersion((v) => v + 1);
      setTimeout(() => {
        setSessionSaveNotice(null);
      }, 4000);
    }
  };

  // Seed simulated responses
  const handleSeedDemoData = () => {
    handleResetDemoData();
  };

  // Clear Session Data (based on active mode)
  const handleClearSession = () => {
    if (sessionMode === 'demo') {
      handleClearDemoData();
      return;
    }

    if (
      window.confirm(
        'Adakah anda pasti mahu memadamkan semua rekod imbasan jawapan bagi sesi kelas interaktif sebenar ini?'
      )
    ) {
      playSfx('click', soundEnabled);
      clearQuestionAnswers();
      setDataVersion((v) => v + 1);
    }
  };

  // Save current session to history
  const handleSaveSessionSnapshot = () => {
    const sessionName =
      sessionMode === 'demo'
        ? `Sesi Demo 3 Asah (${sessionHistory.length + 1})`
        : `Sesi ${sessionHistory.length + 1}`;
    const dskpAverages: Record<string, number> = {};
    dskpAnalysis.forEach((std) => {
      dskpAverages[std.code] = std.percentage;
    });

    const item: SessionHistoryItem = {
      sessionId: sessionMode === 'demo' ? DEMO_SESSION_ID : `SESI_${Date.now()}`,
      sessionName,
      className: selectedClass,
      date: new Date().toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      timestamp: Date.now(),
      totalStudents: students.length,
      totalQuestions: 15,
      averageAccuracy: smartInsights.overallAccuracy,
      dskpAverages,
    };

    saveSessionToHistory(item);
    playSfx('chime', soundEnabled);
    setSessionSaveNotice(`✅ ${sessionName} berjaya disimpan ke sejarah sesi!`);
    setDataVersion((v) => v + 1);

    setTimeout(() => {
      setSessionSaveNotice(null);
    }, 4000);
  };

  // CSV Export
  const handleExportCSV = () => {
    playSfx('chime', soundEnabled);
    exportClassReportCSV(selectedClass, studentsAnalysis, dskpAnalysis, questions);
  };

  // Helper for TP Badge
  const getTpBadge = (tp: number) => {
    if (tp >= 5) {
      return (
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
          <Award className="w-3 h-3 text-emerald-600" />
          <span>TP {tp}</span>
        </span>
      );
    }
    if (tp >= 3) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
          <Target className="w-3 h-3 text-amber-600" />
          <span>TP {tp}</span>
        </span>
      );
    }
    return (
      <span className="bg-rose-100 text-rose-900 border border-rose-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        <span>TP {tp}</span>
      </span>
    );
  };

  // Current session number label
  const sessionLabel =
    sessionMode === 'demo'
      ? 'DEMO-SESSION-001 (Data Lengkap 3 Asah)'
      : sessionHistory.length > 0
      ? `Sesi ${sessionHistory.length + 1}`
      : 'Sesi Langsung';

  const currentDateStr = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 font-rounded max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. HEADER KELAS INTERAKTIF */}
      {/* ======================================================== */}
      <header className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#D98262] to-[#b35e40] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif-title text-xl sm:text-2xl font-black text-[#4A3728]">
                Analisis Kelas Interaktif
              </h1>
              <span className="bg-[#3c4233] text-amber-300 font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
                Kelas: {selectedClass}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  sessionMode === 'demo'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}
              >
                {sessionLabel}
              </span>
              <span className="bg-stone-100 text-stone-600 font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" />
                <span>{currentDateStr}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-500 font-medium mt-1 flex-wrap">
              <span>
                Soalan: <strong>15 Soalan (DSKP 3.1)</strong>
              </span>
              <span>•</span>
              <span>
                Murid: <strong>{students.length} Murid</strong>
              </span>
              <span>•</span>
              <span>
                Imbasan Direkodkan: <strong>{totalScansInSession} Jawapan</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons & Data Source Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Data Mode Switcher (Demo vs Live) */}
          <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => handleToggleDataMode('demo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                sessionMode === 'demo'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Data Demo 3 Asah: 40 murid, 600 respons (35 Menguasai, 5 Sedang Menguasai, 0 Perlu Bimbingan)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🧪 Data Demo (3 Asah)</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleDataMode('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                sessionMode === 'live'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Sesi imbasan QR langsung murid di bilik darjah"
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>🔴 Sesi Sebenar</span>
            </button>
          </div>

          {onNavigateToSession && (
            <button
              type="button"
              onClick={onNavigateToSession}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 border-2 border-stone-300 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>← Kembali ke Sesi</span>
            </button>
          )}

          {/* Privacy Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsPrivacyMode(!isPrivacyMode);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all border ${
              isPrivacyMode
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
            title="Sembunyikan nama sebenar murid apabila memaparkan dashboard di projektor kelas"
          >
            {isPrivacyMode ? (
              <EyeOff className="w-3.5 h-3.5 text-purple-700" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-stone-500" />
            )}
            <span>{isPrivacyMode ? '🔒 Mod Privasi Aktif' : '🔓 Mod Privasi'}</span>
          </button>

          {/* Reset Demo Data Button (when in demo mode) */}
          {sessionMode === 'demo' && (
            <button
              type="button"
              onClick={handleResetDemoData}
              className="px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Reset data demo sesi 3 Asah kepada 600 respons lengkap (35 Menguasai, 5 Sedang Menguasai, 0 Perlu Bimbingan)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>🔄 Reset Data Demo</span>
            </button>
          )}

          {/* Seed demo data (if in live mode and empty) */}
          {sessionMode === 'live' && totalScansInSession === 0 && (
            <button
              type="button"
              onClick={() => handleToggleDataMode('demo')}
              className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Buka Data Demo 3 Asah"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🧪 Lihat Data Demo</span>
            </button>
          )}

          {/* Save Session Snapshot */}
          {totalScansInSession > 0 && (
            <button
              type="button"
              onClick={handleSaveSessionSnapshot}
              className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
              title="Simpan sesi ini ke rekod sejarah untuk perbandingan peningkatan kelas"
            >
              <Save className="w-3.5 h-3.5" />
              <span>💾 Simpan Sesi</span>
            </button>
          )}

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Muat turun fail CSV bagi rekod Excel guru"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📥 Muat Turun CSV</span>
          </button>

          {/* Print / PDF Report */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsPrintModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
            title="Buka laporan format cetak dan PDF rasmi PBD"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ Cetak Laporan</span>
          </button>

          {totalScansInSession > 0 && (
            <button
              type="button"
              onClick={handleClearSession}
              className="p-2 rounded-2xl bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 border border-stone-200 cursor-pointer transition-colors"
              title={
                sessionMode === 'demo'
                  ? 'Padam data demo sesi 3 Asah'
                  : 'Padam semua data imbasan sesi sebenar'
              }
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Temporary Notice Banner if Session Saved */}
      <AnimatePresence>
        {sessionSaveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-blue-50 border-2 border-blue-300 text-blue-900 rounded-2xl text-xs font-bold text-center shadow-xs"
          >
            {sessionSaveNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. RINGKASAN SESI (5–6 KPI UTAMA) */}
      {/* ======================================================== */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Jumlah Murid */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-[#D98262]" />
            <span>Jumlah Murid</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#4A3728] font-mono my-1">
            {students.length}
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Berdaftar</span>
        </div>

        {/* Jumlah Soalan */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Jumlah Soalan</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono my-1">
            15
          </div>
          <span className="text-[11px] text-stone-500 font-medium">DSKP 3.1</span>
        </div>

        {/* Purata Kelas */}
        <div className="bg-emerald-50 rounded-3xl p-4 sm:p-5 border-2 border-emerald-300 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-900 font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Purata Kelas</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono my-1">
            {smartInsights.overallAccuracy}%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Ketepatan Imbasan</span>
        </div>

        {/* Penguasaan Baik (>=80%) */}
        <div className="bg-emerald-50/70 rounded-3xl p-4 sm:p-5 border-2 border-emerald-200 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Penguasaan Baik</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono my-1">
            {smartInsights.masteredCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Skor 80–100%</span>
        </div>

        {/* Sedang Menguasai (60-79%) */}
        <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-900 font-bold mb-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Sedang Menguasai</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono my-1">
            {smartInsights.inProgressCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Skor 60–79%</span>
        </div>

        {/* Perlu Bimbingan (<60%) */}
        <div className="bg-rose-50 rounded-3xl p-4 sm:p-5 border-2 border-rose-300 shadow-xs text-center flex flex-col justify-between">
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-900 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Perlu Bimbingan</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono my-1">
            {smartInsights.needGuidanceCount}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Skor 0–59%</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TAHAP PRESTASI KELAS & PURATA KELAS (VISUAL CHART) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D98262]" />
              <span>Tahap Prestasi Kelas & Taburan Penguasaan</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Pecahan murid mengikut kategori penguasaan berdasarkan data sebenar imbasan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              🏆 Skor Tertinggi: <strong>{highestScore}/15</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* PURATA KELAS CARD WITH TEXT EXPLANATION */}
          <div className="md:col-span-4 bg-gradient-to-br from-emerald-50 to-teal-50/60 p-5 rounded-2xl border-2 border-emerald-300 text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
              PURATA KELAS
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-950 font-mono">
              {smartInsights.overallAccuracy}%
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-relaxed px-2">
              "{smartInsights.classAverageDescription}"
            </p>
            <span className="text-[10px] text-stone-500 block italic">
              Dikira daripada {totalScansInSession} respons imbasan jawapan.
            </span>
          </div>

          {/* SEGMENTED VISUAL PROGRESS BAR & BREAKDOWN */}
          <div className="md:col-span-8 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-600">
                <span>Taburan Mengikut Kategori (Jumlah Murid: {students.length})</span>
                <span>100%</span>
              </div>

              {/* Segmented multi-color bar */}
              <div className="w-full h-5 bg-stone-100 rounded-full overflow-hidden flex shadow-inner border border-stone-200">
                {students.length > 0 && (
                  <>
                    <div
                      style={{
                        width: `${(smartInsights.masteredCount / students.length) * 100}%`,
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                      title={`Menguasai: ${smartInsights.masteredCount} murid`}
                    />
                    <div
                      style={{
                        width: `${(smartInsights.inProgressCount / students.length) * 100}%`,
                      }}
                      className="bg-amber-400 transition-all duration-500"
                      title={`Sedang Menguasai: ${smartInsights.inProgressCount} murid`}
                    />
                    <div
                      style={{
                        width: `${(smartInsights.needGuidanceCount / students.length) * 100}%`,
                      }}
                      className="bg-rose-500 transition-all duration-500"
                      title={`Perlu Bimbingan: ${smartInsights.needGuidanceCount} murid`}
                    />
                    <div
                      style={{
                        width: `${(smartInsights.unansweredCount / students.length) * 100}%`,
                      }}
                      className="bg-stone-300 transition-all duration-500"
                      title={`Tiada Respons: ${smartInsights.unansweredCount} murid`}
                    />
                  </>
                )}
              </div>
            </div>

            {/* 3 Categories with exact counts and text labels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-black text-emerald-950">Menguasai (80–100%)</span>
                </div>
                <div className="text-xl font-black text-emerald-900 font-mono">
                  {smartInsights.masteredCount} murid
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {students.length > 0
                    ? Math.round((smartInsights.masteredCount / students.length) * 100)
                    : 0}
                  % daripada kelas
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs font-black text-amber-950">Sedang Menguasai (60–79%)</span>
                </div>
                <div className="text-xl font-black text-amber-900 font-mono">
                  {smartInsights.inProgressCount} murid
                </div>
                <span className="text-[11px] text-amber-700 font-medium">
                  {students.length > 0
                    ? Math.round((smartInsights.inProgressCount / students.length) * 100)
                    : 0}
                  % daripada kelas
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-xs font-black text-rose-950">Perlu Bimbingan (0–59%)</span>
                </div>
                <div className="text-xl font-black text-rose-900 font-mono">
                  {smartInsights.needGuidanceCount} murid
                </div>
                <span className="text-[11px] text-rose-700 font-medium">
                  {students.length > 0
                    ? Math.round((smartInsights.needGuidanceCount / students.length) * 100)
                    : 0}
                  % daripada kelas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ANALISIS DSKP (3.1.1 - 3.1.7) — PALING PENTING */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D98262]" />
              <span>Analisis DSKP Matematik Tahun 3 (Topik 3.1 Pecahan)</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Prestasi murid mengikut 7 Standard Pembelajaran DSKP. Kategori: 80–100% Penguasaan baik, 60–79% Sedang menguasai, 0–59% Perlu bimbingan.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Baik (≥80%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" />
            <span>Sederhana (60-79%)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" />
            <span>Bimbingan (&lt;60%)</span>
          </div>
        </div>

        {/* 7 Standard Bars */}
        <div className="space-y-3">
          {dskpAnalysis.map((std) => {
            const isGood = std.status === 'Penguasaan baik';
            const isProgress = std.status === 'Sedang menguasai';

            const barColor = isGood ? 'bg-emerald-500' : isProgress ? 'bg-amber-400' : 'bg-rose-500';
            const badgeColor = isGood
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : isProgress
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-rose-100 text-rose-900 border-rose-300';

            return (
              <div
                key={std.code}
                className="p-3 sm:p-4 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-amber-300 transition-colors space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black bg-[#3c4233] text-amber-300 text-xs px-2.5 py-0.5 rounded-lg">
                      {std.code}
                    </span>
                    <span className="font-bold text-[#4A3728] text-sm">{std.name}</span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      ({std.totalQuestions} soalan dalam sesi)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <span className="text-[11px] text-stone-500 font-mono">
                      {std.correctResponses}/{std.totalResponses} betul
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                      {std.status}
                    </span>
                    <span className="font-mono font-black text-sm text-stone-900 w-12 text-right">
                      {std.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-600 rounded-full ${barColor}`}
                    style={{ width: `${std.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-stone-500 italic text-center pt-1">
          * Kategori penguasaan DSKP di atas berfungsi sebagai panduan diagnosis guru dan bukan penentu TP rasmi.
        </p>
      </section>

      {/* ======================================================== */}
      {/* 5. KEKUATAN KELAS & KELEMAHAN KELAS (DUAL CARDS) */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* KEKUATAN KELAS */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <h3 className="text-base font-black text-emerald-950 flex items-center gap-2">
              <span className="text-xl">💪</span>
              <span>KEKUATAN KELAS</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Dikuasai Baik
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Kenyataan di bawah dijana secara automatik daripada standard dan soalan dengan skor tertinggi:
          </p>

          <ul className="space-y-2">
            {classStrengths.map((str, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KELEMAHAN KELAS / PERLU PENGUKUHAN */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
              <span className="text-xl">🔎</span>
              <span>PERLU PENGUKUHAN</span>
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Aktiviti Pengukuhan
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Standard dan kemahiran yang boleh dimantapkan lagi melalui aktiviti pengukuhan konkrit:
          </p>

          <ul className="space-y-2">
            {classWeaknesses.map((weak, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-bold text-amber-900 flex items-start gap-2"
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5B. PROFIL PEMBELAJARAN KELAS (3 ASAH) */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-amber-50/70 rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-200/80">
          <div>
            <h2 className="font-serif-title text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span>PROFIL PEMBELAJARAN KELAS</span>
            </h2>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Analisis kecenderungan penerimaan maklumat berpandukan data interaksi sebenar murid (Visual, Kinestetik, Auditori, Gabungan).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-indigo-950 bg-white border border-indigo-300 px-3.5 py-1 rounded-full shadow-2xs">
              Jumlah: <strong className="text-indigo-600">{classLearningSummary.totalStudents} murid</strong>
            </span>
            <span className="text-[11px] font-bold text-stone-600 bg-white/90 border border-stone-200 px-3 py-1 rounded-full shadow-2xs">
              Cadangan Berpandukan Data • Bukan Diagnosis Mutlak
            </span>
          </div>
        </div>

        {/* 4 Primary Learning Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Visual */}
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">👀</span>
                <span className="text-xs font-mono font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                  Purata: {classLearningSummary.averageVisualScore}%
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm mt-1">Kecenderungan Visual</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Paling responsif terhadap fraction bar, gambar rajah, grid pecahan dan representasi grafik konkrit.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Bilangan Murid:</span>
              <span className="text-lg font-mono font-black text-blue-800">
                {classLearningSummary.visualCount} <span className="text-xs font-normal text-stone-400">murid</span>
              </span>
            </div>
          </div>

          {/* Card 2: Kinestetik */}
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">🖐️</span>
                <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Purata: {classLearningSummary.averageKinestheticScore}%
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm mt-1">Kecenderungan Kinestetik</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Belajar secara optimum melalui interaksi hands-on seperti mengagih objek (Dapur Pecahan) & manipulasi warna pixel.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Bilangan Murid:</span>
              <span className="text-lg font-mono font-black text-emerald-800">
                {classLearningSummary.kinestheticCount} <span className="text-xs font-normal text-stone-400">murid</span>
              </span>
            </div>
          </div>

          {/* Card 3: Auditori */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎧</span>
                <span className="text-xs font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Purata: {classLearningSummary.averageAuditoryScore}%
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm mt-1">Kecenderungan Auditori</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Mudah menangkap konsep melalui penerangan lisan berstruktur, arahan suara Alya dan perbincangan bimbingan.
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Bilangan Murid:</span>
              <span className="text-lg font-mono font-black text-amber-800">
                {classLearningSummary.auditoryCount} <span className="text-xs font-normal text-stone-400">murid</span>
              </span>
            </div>
          </div>

          {/* Card 4: Gabungan */}
          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌈</span>
                <span className="text-xs font-mono font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                  Multimodal
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-sm mt-1">Kecenderungan Gabungan</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Murid yang menunjukkan keseimbangan harmoni antara dua atau lebih mod pembelajaran (selisih skor &le; 5%).
              </p>
            </div>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500 font-medium">Bilangan Murid:</span>
              <span className="text-lg font-mono font-black text-purple-800">
                {classLearningSummary.combinedCount} <span className="text-xs font-normal text-stone-400">murid</span>
              </span>
            </div>
          </div>
        </div>

        {/* Total Summary Footer */}
        <div className="bg-white/80 rounded-2xl p-3 px-4 border border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-950 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span>👀 Visual: <strong>{classLearningSummary.visualCount} murid</strong></span>
            <span>🖐️ Kinestetik: <strong>{classLearningSummary.kinestheticCount} murid</strong></span>
            <span>🎧 Auditori: <strong>{classLearningSummary.auditoryCount} murid</strong></span>
            <span>🌈 Gabungan: <strong>{classLearningSummary.combinedCount} murid</strong></span>
            {classLearningSummary.insufficientDataCount > 0 && (
              <span>⚪ Data Belum Mencukupi: <strong>{classLearningSummary.insufficientDataCount} murid</strong></span>
            )}
          </div>
          <div className="text-sm font-black text-indigo-900">
            Jumlah: {classLearningSummary.totalStudents} murid
          </div>
        </div>

        {/* 6. Insight Alya */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
            🤖
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-indigo-950">
                🤖 Insight Alya
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Analisis Pintar Kelas
              </span>
            </div>
            <p className="text-xs text-stone-800 font-medium leading-relaxed bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
              "{classLearningSummary.classPedagogicalInsight}"
            </p>
          </div>
        </div>

        {/* Responsible AI / Pedagogical Disclaimer Note */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500 italic bg-stone-50/70 p-2.5 rounded-xl border border-stone-200">
          <Info className="w-4 h-4 text-stone-400 shrink-0" />
          <span>
            <strong>Nota Etika Pedagogi:</strong> Profil kecenderungan ini merupakan indikator pemudah cara bagi membantu guru mempelbagaikan bahan bantu mengajar (BBM) dan kaedah penyampaian. Setiap murid boleh dan digalakkan berkembang melalui semua mod pembelajaran.
          </span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. ANALISIS SEMUA 15 SOALAN & SOALAN PALING MENCABAR / MUDAH */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D98262]" />
              <span>Analisis Soalan Sesi (15 Soalan)</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Ketepatan setiap soalan Q1 hingga Q15. Klik mana-mana soalan untuk melihat pecahan jawapan A/B/C/D.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">
              🟢 Mudah (&ge;80%) • 🟡 Sederhana (60-79%) • 🔴 Mencabar (&lt;60%)
            </span>
          </div>
        </div>

        {/* 15 Questions Visual Bar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {questionsAnalysis.map((q) => {
            const isSelected = selectedQuestionIndex === q.questionNumber - 1;
            const statusColor =
              q.accuracy >= 80 ? 'bg-emerald-500' : q.accuracy >= 60 ? 'bg-amber-400' : 'bg-rose-500';

            return (
              <button
                key={q.questionId}
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setSelectedQuestionIndex(isSelected ? null : q.questionNumber - 1);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/90 border-[#D98262] ring-2 ring-[#D98262]/30 shadow-md scale-102'
                    : 'bg-stone-50 hover:bg-white border-stone-200 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono font-black text-xs text-[#4A3728]">
                    Q{q.questionNumber}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                    {q.dskpCode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs my-1">
                  <span className="text-[11px] font-bold text-emerald-800">
                    ✓ {q.correctCount}/{q.totalAnswered}
                  </span>
                  <span className="font-mono font-black text-xs text-stone-800">
                    {q.accuracy}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${statusColor}`}
                    style={{ width: `${q.accuracy}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* HIGHLIGHT CARDS: SOALAN PALING MENCABAR & SOALAN PALING MUDAH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {/* ⚠️ SOALAN PALING MENCABAR */}
          {hardestQuestion && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 border-2 border-rose-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-900 bg-rose-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-700" />
                  <span>⚠️ SOALAN PALING MENCABAR: Q{hardestQuestion.questionNumber}</span>
                </span>
                <span className="text-xs font-bold text-rose-800 font-mono">
                  DSKP {hardestQuestion.dskpCode}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-black text-[#4A3728] leading-snug">
                "{hardestQuestion.question}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-stone-500 block">Betul</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {hardestQuestion.correctCount}/{hardestQuestion.totalAnswered}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-stone-500 block">Salah</span>
                  <span className="font-bold text-rose-800 font-mono">
                    {hardestQuestion.wrongCount}/{hardestQuestion.totalAnswered}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-stone-500 block">Ketepatan</span>
                  <span className="font-bold text-stone-800 font-mono">
                    {hardestQuestion.accuracy}%
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-stone-500 block">Jawapan</span>
                  <span className="font-bold text-emerald-900 font-mono">
                    [{hardestQuestion.correctAnswerLetter}] {hardestQuestion.correctAnswer}
                  </span>
                </div>
              </div>

              {/* Misconception Alert if prominent */}
              {hardestQuestion.misconceptionAlert && (
                <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-950 font-bold flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{hardestQuestion.misconceptionAlert}</span>
                </div>
              )}

              <p className="text-xs text-rose-950 font-semibold bg-white p-2.5 rounded-xl border border-rose-200">
                💡 <strong>Petua Pedagogi:</strong> {hardestQuestion.pedagogicalTip}
              </p>
            </div>
          )}

          {/* 🌟 SOALAN PALING MUDAH */}
          {easiestQuestion && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 bg-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>🌟 SOALAN PALING MUDAH: Q{easiestQuestion.questionNumber}</span>
                </span>
                <span className="text-xs font-bold text-emerald-800 font-mono">
                  DSKP {easiestQuestion.dskpCode}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-black text-[#4A3728] leading-snug">
                "{easiestQuestion.question}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-stone-500 block">Betul</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {easiestQuestion.correctCount}/{easiestQuestion.totalAnswered}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-stone-500 block">Salah</span>
                  <span className="font-bold text-rose-800 font-mono">
                    {easiestQuestion.wrongCount}/{easiestQuestion.totalAnswered}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-stone-500 block">Ketepatan</span>
                  <span className="font-bold text-emerald-950 font-mono">
                    {easiestQuestion.accuracy}%
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-stone-500 block">Jawapan</span>
                  <span className="font-bold text-emerald-900 font-mono">
                    [{easiestQuestion.correctAnswerLetter}] {easiestQuestion.correctAnswer}
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-950 font-semibold bg-white p-2.5 rounded-xl border border-emerald-200">
                ✨ <strong>Pemerhatian Guru:</strong> Majoriti murid menunjukkan kefahaman yang sangat mantap dalam kemahiran ini. Boleh dijadikan model asas untuk topik lanjutan.
              </p>
            </div>
          )}
        </div>

        {/* SELECTED QUESTION DETAIL CARD & A/B/C/D BAR DISTRIBUTION */}
        <AnimatePresence>
          {activeQuestionDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#FFFDF9] p-5 rounded-2xl border-2 border-amber-300 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm bg-[#3c4233] text-amber-300 px-3 py-1 rounded-xl">
                    Perincian Jawapan Q{activeQuestionDetail.questionNumber}
                  </span>
                  <span className="text-xs font-bold text-stone-600 bg-amber-100 px-2 py-0.5 rounded-md">
                    DSKP {activeQuestionDetail.dskpCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedQuestionIndex(null)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-1 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  Tutup ✕
                </button>
              </div>

              <p className="text-sm font-bold text-[#4A3728]">
                {activeQuestionDetail.question}
              </p>

              {/* A/B/C/D Bar Chart */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-600 block">
                  Taburan Pilihan Jawapan Murid (A / B / C / D):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const isCorrect = letter === activeQuestionDetail.correctAnswerLetter;
                    const count = activeQuestionDetail.distribution[letter] || 0;
                    const pct =
                      activeQuestionDetail.totalAnswered > 0
                        ? Math.round((count / activeQuestionDetail.totalAnswered) * 100)
                        : 0;

                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-2xl border-2 space-y-1 ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-black text-sm text-[#4A3728]">
                            Pilihan {letter} {isCorrect && '✓'}
                          </span>
                          <span className="font-mono font-bold text-stone-600">
                            {count} murid ({pct}%)
                          </span>
                        </div>

                        {/* Visual mini bar */}
                        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCorrect ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeQuestionDetail.misconceptionAlert && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-bold flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>{activeQuestionDetail.misconceptionAlert}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ======================================================== */}
      {/* 7. CADANGAN INTERVENSI & AKTIVITI SUSULAN (TINDAKAN GURU) */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-amber-50 via-[#FFF9F2] to-orange-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
          <div>
            <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span>Cadangan Intervensi & Aktiviti Susulan (Tindakan Guru)</span>
            </h2>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Aktiviti praktikal berasaskan kelemahan sebenar bilik darjah yang boleh terus diaplikasikan selepas sesi.
            </p>
          </div>

          <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full">
            Praktikal & Ringkas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {followUpActivities.map((act, i) => (
            <div
              key={i}
              className="bg-white p-4.5 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    DSKP {act.dskpCode}
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{act.duration}</span>
                  </span>
                </div>

                <h4 className="text-sm font-black text-[#4A3728] leading-snug">
                  {act.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                  {act.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-bold">
                Bahan: <span className="text-amber-900">{act.material}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. KATEGORI PRESTASI MURID: MENGUASAI, SEDANG MENGUASAI & PERLU BIMBINGAN */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 🟢 MENGUASAI (80–100%) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <h3 className="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span>🟢 MENGUASAI ({topStudents.length})</span>
            </h3>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Skor 80–100%
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Murid yang mencapai penguasaan cemerlang (TP 5 & TP 6). Klik nama untuk melihat kekuatan & pengayaan:
          </p>

          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {topStudents.map((s, idx) => (
              <button
                key={s.studentId}
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setSelectedStudentId(s.studentId);
                }}
                className="w-full p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-left flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-700 font-bold">{idx + 1}.</span>
                  <span className="font-bold text-[#4A3728]">
                    {getDisplayName(s.studentName, s.studentId)}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="font-black text-emerald-900">{s.correctCount}/15</span>
                  <span className="text-stone-500">({s.percentage}%)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 🟡 SEDANG MENGUASAI (60–79%) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <h3 className="text-sm sm:text-base font-black text-amber-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>🟡 SEDANG MENGUASAI ({smartInsights.inProgressCount})</span>
            </h3>
            <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Skor 60–79%
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Murid yang mencapai tahap sederhana kukuh dan bersedia untuk aktiviti pengukuhan bersasar:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {rankedStudents
              .filter((s) => s.totalAnswered > 0 && s.percentage >= 60 && s.percentage < 80)
              .map((s, idx) => (
                <button
                  key={s.studentId}
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setSelectedStudentId(s.studentId);
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-left space-y-1 text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-700 font-bold">{idx + 1}.</span>
                      <span className="font-bold text-[#4A3728]">
                        {getDisplayName(s.studentName, s.studentId)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="font-black text-amber-950">{s.correctCount}/15</span>
                      <span className="text-stone-500">({s.percentage}%)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                  </div>
                  {s.weakStandards.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                      <span>Perlu pengukuhan:</span>
                      <span className="font-mono font-bold bg-amber-200/80 px-1.5 py-0.2 rounded text-amber-950">
                        {s.weakStandards.join(', ')}
                      </span>
                    </div>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* 🔴 PERLU BIMBINGAN (0–59%) */}
        <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <h3 className="text-sm sm:text-base font-black text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>🔴 PERLU BIMBINGAN ({guidanceStudents.length})</span>
            </h3>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Skor 0–59%
            </span>
          </div>

          <p className="text-xs text-stone-500 font-medium">
            Murid yang memerlukan bimbingan rapi secara individu atau kumpulan kecil:
          </p>

          {guidanceStudents.length === 0 ? (
            <div className="p-4 text-center text-xs text-emerald-800 font-bold bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="text-2xl">🎉</div>
              <div className="font-black text-emerald-950 text-sm">
                Tiada Murid Dalam Kategori Ini!
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                Semua 40 murid mencapai sekurang-kurangnya 60% (Skor 9/15 hingga 15/15).
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {guidanceStudents.map((s, idx) => (
                <button
                  key={s.studentId}
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setSelectedStudentId(s.studentId);
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 text-left flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-700 font-bold">{idx + 1}.</span>
                    <span className="font-bold text-[#4A3728]">
                      {getDisplayName(s.studentName, s.studentId)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-black text-rose-900">{s.correctCount}/15</span>
                    <span className="text-stone-500">({s.percentage}%)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PENYERTAAN & RINGKASAN ALYA (DUAL CARDS) */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 👥 PENYERTAAN KELAS */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm sm:text-base font-black text-[#4A3728] flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>👥 PENYERTAAN SESI</span>
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              {students.length} Murid
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-emerald-800 font-bold block">Jawab</span>
              <span className="text-2xl font-black text-emerald-950 font-mono">
                {students.length - unansweredStudents.length}
              </span>
              <span className="text-[10px] text-emerald-700">Murid Berjaya Scan</span>
            </div>

            <div className="p-3 bg-stone-100 rounded-2xl border border-stone-300">
              <span className="text-stone-600 font-bold block">Tiada Respons</span>
              <span className="text-2xl font-black text-stone-700 font-mono">
                {unansweredStudents.length}
              </span>
              <span className="text-[10px] text-stone-500">Belum Diimbas</span>
            </div>
          </div>

          {unansweredStudents.length > 0 && (
            <div className="pt-2 border-t border-stone-100 space-y-1">
              <span className="text-[11px] font-bold text-stone-500 block">
                Senarai Murid Tiada Respons:
              </span>
              <div className="flex flex-wrap gap-1">
                {unansweredStudents.map((s) => (
                  <span
                    key={s.studentId}
                    className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-300"
                  >
                    {getDisplayName(s.studentName, s.studentId)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🤖 RINGKASAN ALYA */}
        <div className="lg:col-span-8 bg-gradient-to-r from-rose-50 via-[#FFF5F7] to-amber-50 rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-sm flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-rose-200 shrink-0 flex items-center justify-center shadow-xs">
            <AlyaCharacter mood="happy" size="md" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-rose-950 flex items-center gap-1.5">
                <span>🤖 RINGKASAN ALYA</span>
              </h3>
              <span className="text-[10px] font-bold text-rose-700 bg-white px-2.5 py-0.5 rounded-full border border-rose-200">
                Data Sebenar 🌟
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
              "{alyaSummaryText}"
            </p>

            <span className="text-[10px] text-stone-500 block italic">
              * Nota: Ringkasan pintar ini membantu guru membuat refleksi PdP dan merancang sesi susulan dengan pantas.
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. PRESTASI SETIAP MURID & HEATMAP DSKP */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
        {/* Header Controls, Tabs, Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D98262]" />
              <span>Prestasi Setiap Murid ({students.length})</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Klik nama murid untuk melihat perincian soalan, kekuatan, kelemahan, dan cadangan intervensi.
            </p>
          </div>

          {/* Table View vs Heatmap View Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-[#4A3728] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Jadual Prestasi</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  viewMode === 'heatmap'
                    ? 'bg-white text-[#4A3728] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Heatmap DSKP</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Cari murid..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D98262] w-40 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-stone-400 mr-1">Tapis:</span>

            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#3c4233] text-amber-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Semua ({students.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('high')}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                activeFilter === 'high'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Prestasi Tinggi ({topStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('progress')}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                activeFilter === 'progress'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Sedang Menguasai ({smartInsights.inProgressCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('guidance')}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                activeFilter === 'guidance'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
              }`}
            >
              Perlu Bimbingan ({guidanceStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('unanswered')}
              className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                activeFilter === 'unanswered'
                  ? 'bg-stone-700 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tiada Respons ({unansweredStudents.length})
            </button>
          </div>

          {/* DSKP Weakness Filter dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400">Standard Lemah:</span>
            <select
              value={dskpFilter}
              onChange={(e) => setDskpFilter(e.target.value)}
              className="px-2 py-1 rounded-xl bg-stone-100 border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Standard</option>
              <option value="3.1.1">DSKP 3.1.1 (Pecahan Wajar)</option>
              <option value="3.1.2">DSKP 3.1.2 (Pecahan Setara)</option>
              <option value="3.1.3">DSKP 3.1.3 (Bentuk Termudah)</option>
              <option value="3.1.4">DSKP 3.1.4 (Pecahan Peratus)</option>
              <option value="3.1.5">DSKP 3.1.5 (Tambah Pecahan)</option>
              <option value="3.1.6">DSKP 3.1.6 (Tolak Pecahan)</option>
              <option value="3.1.7">DSKP 3.1.7 (Nombor Bercampur)</option>
            </select>
          </div>
        </div>

        {/* Learning Preference Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 text-xs">
          <span className="text-[11px] font-bold text-indigo-900 mr-1 flex items-center gap-1">
            <span>🧠</span>
            <span>Kecenderungan:</span>
          </span>

          <button
            type="button"
            onClick={() => setLearningModeFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'all'
                ? 'bg-indigo-950 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setLearningModeFilter('visual')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'visual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            👀 Visual ({classLearningSummary.visualCount})
          </button>

          <button
            type="button"
            onClick={() => setLearningModeFilter('auditory')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'auditory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            🎧 Auditori ({classLearningSummary.auditoryCount})
          </button>

          <button
            type="button"
            onClick={() => setLearningModeFilter('kinesthetic')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'kinesthetic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            🖐️ Kinestetik ({classLearningSummary.kinestheticCount})
          </button>

          <button
            type="button"
            onClick={() => setLearningModeFilter('combined')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'combined'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            🌈 Gabungan ({classLearningSummary.combinedCount})
          </button>

          <button
            type="button"
            onClick={() => setLearningModeFilter('insufficient_data')}
            className={`px-2.5 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
              learningModeFilter === 'insufficient_data'
                ? 'bg-stone-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            ⚪ Data Belum Mencukupi ({classLearningSummary.insufficientDataCount})
          </button>
        </div>

        {/* VIEW 1: SCOREBOARD TABLE */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#3c4233] text-white">
                  <th className="py-3 px-3.5 font-bold">#</th>
                  <th className="py-3 px-3.5 font-bold">Nama Murid</th>
                  <th className="py-3 px-3.5 font-bold">No Kad</th>
                  <th className="py-3 px-3.5 font-bold text-center">Betul (/15)</th>
                  <th className="py-3 px-3.5 font-bold text-center">Salah (/15)</th>
                  <th className="py-3 px-3.5 font-bold text-center">Peratus</th>
                  <th className="py-3 px-3.5 font-bold text-center">CADANGAN TP</th>
                  <th className="py-3 px-3.5 font-bold text-center">🧠 Profil Pembelajaran</th>
                  <th className="py-3 px-3.5 font-bold text-center">Keyakinan</th>
                  <th className="py-3 px-3.5 font-bold text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-stone-500 font-medium">
                      Tiada rekod murid sepadan dengan tapisan semasa.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const isTop3 = idx < 3 && student.percentage > 0;
                    return (
                      <tr
                        key={student.studentId}
                        className="hover:bg-amber-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          playSfx('click', soundEnabled);
                          setSelectedStudentId(student.studentId);
                        }}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3.5 font-mono font-bold">
                          {isTop3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black inline-flex items-center justify-center text-xs shadow-xs">
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="text-stone-500">{idx + 1}</span>
                          )}
                        </td>

                        {/* Name (Respects Privacy Mode) */}
                        <td className="py-3 px-3.5 font-bold text-[#4A3728]">
                          {getDisplayName(student.studentName, student.studentId)}
                        </td>

                        {/* Card ID */}
                        <td className="py-3 px-3.5 font-mono text-stone-500">
                          {student.studentId}
                        </td>

                        {/* Correct */}
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-emerald-800">
                          {student.correctCount}
                        </td>

                        {/* Wrong */}
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-rose-700">
                          {student.wrongCount}
                        </td>

                        {/* Percentage */}
                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded-full text-xs ${
                              student.percentage >= 80
                                ? 'bg-emerald-100 text-emerald-900 font-black'
                                : student.percentage >= 60
                                ? 'bg-amber-100 text-amber-900 font-bold'
                                : 'bg-rose-100 text-rose-900 font-bold'
                            }`}
                          >
                            {student.percentage}%
                          </span>
                        </td>

                        {/* Cadangan TP */}
                        <td className="py-3 px-3.5 text-center">
                          {getTpBadge(student.suggestedTP)}
                        </td>

                        {/* 🧠 Profil Pembelajaran */}
                        <td className="py-3 px-3.5 text-center">
                          {student.learningProfile ? (
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap ${
                                student.learningProfile.dominantMode === 'visual'
                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                  : student.learningProfile.dominantMode === 'kinesthetic'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : student.learningProfile.dominantMode === 'auditory'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : student.learningProfile.dominantMode === 'combined'
                                  ? 'bg-purple-50 text-purple-900 border-purple-300'
                                  : 'bg-stone-100 text-stone-600 border-stone-200'
                              }`}
                            >
                              {student.learningProfile.shortBadge || student.learningProfile.dominantLabel}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs">-</span>
                          )}
                        </td>

                        {/* Keyakinan */}
                        <td className="py-3 px-3.5 text-center">
                          <span className="text-[11px] font-bold text-stone-500">
                            {student.tpConfidence}
                          </span>
                        </td>

                        {/* Action: 🧠 Lihat Profil & 👩‍🏫 Intervensi */}
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSfx('click', soundEnabled);
                                setSelectedStudentId(student.studentId);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-900 hover:text-white border border-indigo-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <span>🧠 Lihat Profil</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playSfx('click', soundEnabled);
                                setInterventionModalStudent({
                                  name: student.studentName,
                                  id: student.studentId,
                                  studentClass: selectedClass,
                                  profile: student.learningProfile,
                                });
                              }}
                              className="px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-900 hover:text-white border border-purple-200 text-[11px] font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                              title="Buka Cadangan Intervensi Alya"
                            >
                              <span>👩‍🏫 Intervensi</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 2: HEATMAP DSKP (3.1.1 to 3.1.7) */}
        {viewMode === 'heatmap' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span>Heatmap Penguasaan Standard Murid (🟢 Menguasai • 🟡 Sedang • 🔴 Perlu Bimbingan)</span>
              <span>Klik mana-mana baris untuk membuka profil murid</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3c4233] text-white">
                    <th className="py-3 px-3 font-bold">Nama Murid</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.1</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.2</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.3</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.4</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.5</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.6</th>
                    <th className="py-3 px-2 text-center font-bold">3.1.7</th>
                    <th className="py-3 px-2 text-center font-bold">Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.map((s) => {
                    const stdCodes = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];

                    return (
                      <tr
                        key={s.studentId}
                        className="hover:bg-amber-50/70 transition-colors cursor-pointer"
                        onClick={() => {
                          playSfx('click', soundEnabled);
                          setSelectedStudentId(s.studentId);
                        }}
                      >
                        <td className="py-2.5 px-3 font-bold text-[#4A3728]">
                          {getDisplayName(s.studentName, s.studentId)}
                        </td>

                        {stdCodes.map((code) => {
                          const isStrong = s.strongStandards.includes(code);
                          const isWeak = s.weakStandards.includes(code);

                          return (
                            <td key={code} className="py-2.5 px-2 text-center">
                              {s.totalAnswered === 0 ? (
                                <span className="text-stone-300 text-xs">⚪</span>
                              ) : isStrong ? (
                                <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  🟢 Baik
                                </span>
                              ) : isWeak ? (
                                <span className="inline-block px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                  🔴 Lemah
                                </span>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  🟡 Sedang
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="py-2.5 px-2 text-center font-mono font-bold text-[#4A3728]">
                          {s.correctCount}/15
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 11. SEJARAH SESI & PERBANDINGAN SESI */}
      {/* ======================================================== */}
      {sessionHistory.length > 0 && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Sejarah Sesi & Trend Peningkatan Kelas</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">
              {sessionHistory.length} Sesi Direkodkan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sessionHistory.map((sess, idx) => (
              <div
                key={sess.sessionId}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#4A3728]">{sess.sessionName}</span>
                  <span className="text-stone-500 font-medium text-[11px]">{sess.date}</span>
                </div>
                <div className="text-2xl font-black text-blue-900 font-mono">
                  {sess.averageAccuracy}%
                </div>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Purata Ketepatan Kelas
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 12. MODAL: PROFIL LENGKAP SETIAP MURID */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeStudentModal && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-5 sm:p-7 border-4 border-[#F4C95D] shadow-2xl max-w-2xl w-full my-auto space-y-4.5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-stone-200">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif-title text-xl font-black text-[#4A3728]">
                      {getDisplayName(activeStudentModal.studentName, activeStudentModal.studentId)}
                    </h3>
                    <span className="bg-[#3c4233] text-amber-300 font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
                      {activeStudentModal.studentId}
                    </span>
                    <span className="bg-amber-100 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-300">
                      Kelas: {activeStudentModal.class}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    Analisis Penguasaan Pecahan Matematik Tahun 3 (DSKP 3.1)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentId(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* High-level score cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-2xl border-2 border-amber-200">
                  <span className="text-[11px] text-stone-500 font-bold block">Skor</span>
                  <span className="text-2xl font-black text-[#4A3728] font-mono">
                    {activeStudentModal.correctCount} / 15
                  </span>
                  <span className="text-[10px] text-stone-400 block">Soalan Betul</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border-2 border-amber-200">
                  <span className="text-[11px] text-stone-500 font-bold block">Peratus</span>
                  <span className="text-2xl font-black text-emerald-800 font-mono">
                    {activeStudentModal.percentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">Ketepatan Imbasan</span>
                </div>

                <div className="bg-amber-100/90 p-3 rounded-2xl border-2 border-amber-300">
                  <span className="text-[11px] text-amber-900 font-bold block">CADANGAN TP</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">
                    TP {activeStudentModal.suggestedTP}
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold block">
                    Keyakinan: {activeStudentModal.tpConfidence}
                  </span>
                </div>
              </div>

              {/* Justifikasi Cadangan TP */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Justifikasi Cadangan TP (Tahap Penguasaan {activeStudentModal.suggestedTP}):</span>
                  </span>
                  <span className="text-[10px] text-stone-400">PBD Formatif</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200 font-medium">
                  {activeStudentModal.tpReason}
                </p>
                <p className="text-[10px] text-stone-500 italic">
                  * "Cadangan TP ini dijana berdasarkan prestasi sesi dan perlu disahkan oleh guru."
                </p>
              </div>

              {/* Kekuatan & Kelemahan Murid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kekuatan */}
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-300 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>💪 KEKUATAN:</span>
                  </span>
                  {activeStudentModal.strongStandards.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeStudentModal.strongStandards.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded-lg bg-emerald-200 text-emerald-950 font-mono font-bold text-[11px]"
                        >
                          ✓ {code} ({DSKP_STANDARDS_INFO[code]?.name || 'DSKP'})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500">Perlu pengukuhan berterusan.</span>
                  )}
                </div>

                {/* Perlu Bimbingan */}
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-300 space-y-1.5">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>🔎 PERLU BIMBINGAN:</span>
                  </span>
                  {activeStudentModal.weakStandards.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeStudentModal.weakStandards.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded-lg bg-rose-200 text-rose-950 font-mono font-bold text-[11px]"
                        >
                          ⚠️ {code} ({DSKP_STANDARDS_INFO[code]?.name || 'DSKP'})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold">Tiada kelemahan ketara!</span>
                  )}
                </div>
              </div>

              {/* Cadangan Intervensi */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>💡 Cadangan Intervensi:</span>
                </span>
                <p className="text-xs text-stone-800 font-medium">
                  "{activeStudentModal.intervention}"
                </p>
              </div>

              {/* Cadangan Pengayaan (if high performer) */}
              {activeStudentModal.suggestedTP >= 5 && activeStudentModal.enrichment && (
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-300 space-y-1">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>🌟 Cadangan Pengayaan:</span>
                  </span>
                  <p className="text-xs text-stone-800 font-medium">
                    "{activeStudentModal.enrichment}"
                  </p>
                </div>
              )}

              {/* ======================================================== */}
              {/* 🧠 PROFIL KECENDERUNGAN PEMBELAJARAN (ANALISIS DATA) */}
              {/* ======================================================== */}
              {activeStudentModal.learningProfile && (
                <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-indigo-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-indigo-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                        🧠
                      </div>
                      <div>
                        <h4 className="font-serif-title font-black text-sm text-indigo-950">
                          PROFIL KECENDERUNGAN PEMBELAJARAN
                        </h4>
                        <p className="text-[10px] text-stone-500 font-medium">
                          Analisis kecenderungan penerimaan maklumat berpandukan data interaksi murid
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black shadow-xs border bg-white text-indigo-900 border-indigo-300">
                        ⭐ Kecenderungan utama: {
                          activeStudentModal.learningProfile.dominantMode === 'visual'
                            ? 'Visual'
                            : activeStudentModal.learningProfile.dominantMode === 'kinesthetic'
                            ? 'Kinestetik'
                            : activeStudentModal.learningProfile.dominantMode === 'auditory'
                            ? 'Auditori'
                            : activeStudentModal.learningProfile.dominantMode === 'combined'
                            ? (activeStudentModal.learningProfile.combinedModes
                                ? activeStudentModal.learningProfile.combinedModes
                                    .map((m) => (m === 'visual' ? 'Visual' : m === 'kinesthetic' ? 'Kinestetik' : 'Auditori'))
                                    .join(' + ')
                                : 'Gabungan')
                            : 'Data Belum Mencukupi'
                        }
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-200">
                        🧠 Tahap keyakinan: {activeStudentModal.learningProfile.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Profil Kecenderungan 3 Skor: Visual, Kinestetik, Auditori */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Visual */}
                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>👀</span>
                          <span>Visual</span>
                        </span>
                        <span className="font-mono text-blue-700 font-black text-sm">
                          {activeStudentModal.learningProfile.visualScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.visualScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-400 block">Rajah objek, fraction bar & grid</span>
                    </div>

                    {/* Kinestetik */}
                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>🖐️</span>
                          <span>Kinestetik</span>
                        </span>
                        <span className="font-mono text-emerald-700 font-black text-sm">
                          {activeStudentModal.learningProfile.kinestheticScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.kinestheticScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-400 block">Manipulasi hands-on (Dapur & Pixel)</span>
                    </div>

                    {/* Auditori */}
                    <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>🎧</span>
                          <span>Auditori</span>
                        </span>
                        <span className="font-mono text-amber-700 font-black text-sm">
                          {activeStudentModal.learningProfile.auditoryScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.auditoryScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-400 block">Penerangan berstruktur & bimbingan suara</span>
                    </div>
                  </div>

                  {/* Penerangan Objektif */}
                  <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                      Penerangan Kecenderungan:
                    </span>
                    <p className="text-xs text-stone-800 font-medium leading-relaxed">
                      "{activeStudentModal.learningProfile.description}"
                    </p>
                  </div>

                  {/* Bukti Ringkas daripada Data */}
                  {activeStudentModal.learningProfile.evidence.length > 0 && (
                    <div className="bg-white/70 p-3 rounded-xl border border-indigo-100/70 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
                        <span>🔍</span> Bukti Ringkas daripada Data:
                      </span>
                      <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
                        {activeStudentModal.learningProfile.evidence.map((ev, idx) => (
                          <li key={idx}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Non-Absolute Pedagogical Disclaimer */}
                  <p className="text-[10px] text-stone-500 italic">
                    * Profil ini adalah cadangan berpandukan analisis data interaksi dan bukan diagnosis psikologi atau pedagogi mutlak.
                  </p>
                </div>
              )}

              {/* Peta Respons Soalan (Q1 - Q15) */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-600 block">
                  Peta Jawapan Imbasan Murid (15 Soalan):
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-15 gap-1 bg-white p-2.5 rounded-2xl border border-stone-200">
                  {questions.map((q, qIdx) => {
                    const ans = activeStudentModal.answers[q.questionId];
                    const hasAns = !!ans;
                    const isCorrect = ans && ans.isCorrect;

                    return (
                      <div
                        key={q.questionId}
                        className={`p-1 rounded-lg text-center font-mono text-[10px] font-bold ${
                          hasAns
                            ? isCorrect
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                        title={`Q${qIdx + 1} (${q.dskpCode}): ${
                          hasAns ? (isCorrect ? `Betul (${ans.letter})` : `Salah (${ans.letter})`) : 'Tiada respons'
                        }`}
                      >
                        <span>Q{qIdx + 1}</span>
                        <div className="text-[11px] font-black">
                          {hasAns ? (isCorrect ? '✓' : ans.letter) : '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setInterventionModalStudent({
                      name: activeStudentModal.studentName,
                      id: activeStudentModal.studentId,
                      studentClass: selectedClass,
                      profile: activeStudentModal.learningProfile,
                    });
                  }}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black cursor-pointer shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <span className="text-base">👩‍🏫</span>
                  <span>Cadangan Intervensi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudentId(null)}
                  className="px-5 py-2 rounded-2xl bg-[#D98262] hover:bg-[#c36f51] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Tutup Profil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🤖 Cadangan Intervensi Alya Modal */}
      {interventionModalStudent && (
        <AlyaInterventionModal
          isOpen={!!interventionModalStudent}
          onClose={() => setInterventionModalStudent(null)}
          studentName={interventionModalStudent.name}
          studentId={interventionModalStudent.id}
          studentClass={interventionModalStudent.studentClass}
          profile={interventionModalStudent.profile}
          soundEnabled={soundEnabled}
        />
      )}

      {/* ======================================================== */}
      {/* 13. MODAL CETAK / PDF LAPORAN RASMI PBD */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-2xl max-w-4xl w-full my-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Print Action Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-slate-800" />
                  <span className="font-serif-title font-bold text-base text-slate-900">
                    Pra-Tonton Dokumen Laporan PBD Kelas Interaktif
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Sekarang (Print / PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPrintModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              {/* Printable Document Body */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-300 space-y-4 font-sans text-xs">
                {/* School Header */}
                <div className="text-center border-b-2 border-stone-800 pb-3">
                  <h2 className="text-base font-black uppercase tracking-wider text-stone-900">
                    KEMBARA DUNIA PECAHAN — REKOD PENTAKSIRAN KELAS INTERAKTIF
                  </h2>
                  <p className="text-xs text-stone-600 font-medium">
                    Topik 3.1: Pecahan (DSKP Matematik Tahun 3) • Modul Kamera & Kad QR Murid
                  </p>
                </div>

                {/* Class Meta Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-stone-300">
                  <div>
                    <span className="text-stone-500 font-bold block">Kelas:</span>
                    <span className="font-black text-stone-900">{selectedClass}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold block">Tarikh:</span>
                    <span className="font-bold text-stone-900">{currentDateStr}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold block">Bil. Murid:</span>
                    <span className="font-bold text-stone-900">{students.length} orang</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold block">Purata Kelas:</span>
                    <span className="font-bold text-emerald-800 font-mono">{smartInsights.overallAccuracy}%</span>
                  </div>
                </div>

                {/* DSKP Summary Row */}
                <div className="bg-white p-3 rounded-xl border border-stone-300 space-y-1">
                  <span className="font-bold text-stone-800 block">Ringkasan 7 Standard Pembelajaran (DSKP 3.1):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    {dskpAnalysis.map((std) => (
                      <div key={std.code} className="p-1.5 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold">{std.code}:</span> {std.percentage}% ({std.status})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Preference Summary Row */}
                <div className="bg-white p-3 rounded-xl border border-stone-300 space-y-1">
                  <span className="font-bold text-stone-800 block">Taburan Profil Kecenderungan Pembelajaran Kelas:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-1.5 bg-blue-50/70 rounded border border-blue-200">
                      <span className="font-bold text-blue-900">👀 Visual:</span> {classLearningSummary.visualCount} orang ({classLearningSummary.averageVisualScore}%)
                    </div>
                    <div className="p-1.5 bg-emerald-50/70 rounded border border-emerald-200">
                      <span className="font-bold text-emerald-900">🖐️ Kinestetik:</span> {classLearningSummary.kinestheticCount} orang ({classLearningSummary.averageKinestheticScore}%)
                    </div>
                    <div className="p-1.5 bg-amber-50/70 rounded border border-amber-200">
                      <span className="font-bold text-amber-900">🎧 Auditori:</span> {classLearningSummary.auditoryCount} orang ({classLearningSummary.averageAuditoryScore}%)
                    </div>
                    <div className="p-1.5 bg-purple-50/70 rounded border border-purple-200">
                      <span className="font-bold text-purple-900">🌈 Gabungan:</span> {classLearningSummary.combinedCount} orang
                    </div>
                  </div>
                </div>

                {/* Students Table in Printable View */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse bg-white">
                    <thead>
                      <tr className="border-b-2 border-stone-800 bg-stone-200">
                        <th className="p-1.5 font-bold">#</th>
                        <th className="p-1.5 font-bold">No Kad</th>
                        <th className="p-1.5 font-bold">Nama Murid</th>
                        <th className="p-1.5 font-bold text-center">Skor (/15)</th>
                        <th className="p-1.5 font-bold text-center">%</th>
                        <th className="p-1.5 font-bold text-center">CADANGAN TP</th>
                        <th className="p-1.5 font-bold text-center">Kecenderungan</th>
                        <th className="p-1.5 font-bold">Cadangan Intervensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {rankedStudents.map((s, idx) => (
                        <tr key={s.studentId}>
                          <td className="p-1.5 text-stone-500">{idx + 1}</td>
                          <td className="p-1.5 font-mono">{s.studentId}</td>
                          <td className="p-1.5 font-bold text-stone-900">{s.studentName}</td>
                          <td className="p-1.5 text-center font-mono">{s.correctCount}/15</td>
                          <td className="p-1.5 text-center font-mono font-bold">{s.percentage}%</td>
                          <td className="p-1.5 text-center font-bold">TP {s.suggestedTP}</td>
                          <td className="p-1.5 text-center font-bold text-[10px]">
                            {s.learningProfile?.dominantLabel || '-'}
                          </td>
                          <td className="p-1.5 text-stone-600 text-[10px]">{s.intervention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Responsible AI Disclaimer */}
                <p className="text-[10px] text-stone-500 italic text-center">
                  * "Cadangan TP ini dijana berdasarkan prestasi sesi bilik darjah dan perlu disahkan oleh guru mata pelajaran."
                </p>

                {/* Signature Row */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-stone-300 text-center">
                  <div className="space-y-12">
                    <span className="text-xs text-stone-500">Disediakan oleh Guru Mata Pelajaran:</span>
                    <div className="border-t border-stone-800 w-48 mx-auto pt-1 font-bold text-xs">
                      (Guru Matematik)
                    </div>
                  </div>
                  <div className="space-y-12">
                    <span className="text-xs text-stone-500">Disahkan oleh Pentadbir / KP Matematik:</span>
                    <div className="border-t border-stone-800 w-48 mx-auto pt-1 font-bold text-xs">
                      (Tandatangan & Cop)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
