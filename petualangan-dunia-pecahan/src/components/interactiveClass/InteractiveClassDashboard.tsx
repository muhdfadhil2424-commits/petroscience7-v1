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
  Edit3,
  UserCheck,
  FileText,
} from 'lucide-react';
import { TeacherTPOverrideModal } from './TeacherTPOverrideModal';
import {
  resetTeacherTPOverride,
  subscribeToTeacherTPUpdates,
  TeacherTPRecord,
} from '../../utils/teacherTpOverrideManager';
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
import { DEMO_SESSION_ID } from '../../data/demoClass5PiruzSession';
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
import { CertificateModal } from '../CertificateModal';
import { DashboardTab } from './dashboard/types';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { TabRingkasan } from './dashboard/TabRingkasan';
import { TabSenaraiMurid } from './dashboard/TabSenaraiMurid';
import { TabKemajuanCarta } from './dashboard/TabKemajuanCarta';
import { TabAnalisisAIPedagogi } from './dashboard/TabAnalisisAIPedagogi';
import { TabAnalisisSoalan } from './dashboard/TabAnalisisSoalan';
import { TabDskp } from './dashboard/TabDskp';
import { TabLaporanSijil } from './dashboard/TabLaporanSijil';

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
  const [activeTab, setActiveTab] = useState<DashboardTab>('summary');
  const [selectedStudentForCertificate, setSelectedStudentForCertificate] = useState<StudentAnalysisResult | null>(null);
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

  // Teacher TP Override state
  const [isTeacherTPEditModalOpen, setIsTeacherTPEditModalOpen] = useState(false);
  const [studentForTPEdit, setStudentForTPEdit] = useState<StudentAnalysisResult | null>(null);
  const [confirmResetStudentId, setConfirmResetStudentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to changes in teacher TP overrides
  useEffect(() => {
    const unsubscribe = subscribeToTeacherTPUpdates(() => {
      setDataVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenEditTP = (student: StudentAnalysisResult) => {
    playSfx('click', soundEnabled);
    setStudentForTPEdit(student);
    setIsTeacherTPEditModalOpen(true);
  };

  const handleTeacherTPSaved = (record: TeacherTPRecord) => {
    setDataVersion((v) => v + 1);
    showToast(`Ketetapan TP Guru berjaya disimpan: TP ${record.teacherTP} untuk ${studentForTPEdit?.studentName || 'murid'}.`);
  };

  const handleRequestResetTP = (studentId: string) => {
    playSfx('click', soundEnabled);
    setConfirmResetStudentId(studentId);
  };

  const handleConfirmResetTP = () => {
    if (!confirmResetStudentId) return;
    playSfx('chime', soundEnabled);
    resetTeacherTPOverride(confirmResetStudentId);
    setDataVersion((v) => v + 1);
    const targetStudent = studentsAnalysis.find((s) => s.studentId === confirmResetStudentId);
    setConfirmResetStudentId(null);
    showToast(`Ketetapan guru dipadam. ${targetStudent?.studentName || 'Murid'} kini kembali kepada cadangan sistem (TP ${targetStudent?.systemTP ?? 3}).`);
  };

  // Active data source: 'demo' (deterministic 600 records for 5 Piruz) or 'live' (real scanning records)
  const [sessionMode, setSessionMode] = useState<SessionDataMode>(() => {
    return getSessionDataMode();
  });

  const questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS;

  // Load session answers according to active data mode (demo or live)
  const allAnswers = useMemo(() => {
    return loadAnswersForDashboard(sessionMode, selectedClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionMode, selectedClass, dataVersion]);

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
  }, [students, questions, allAnswers, dataVersion]);

  const dskpAnalysis: DskpStandardAnalysis[] = useMemo(() => {
    return analyzeDskpStandards(questions, allAnswers);
  }, [questions, allAnswers]);

  const questionsAnalysis: QuestionDetailedAnalysis[] = useMemo(() => {
    return analyzeAllQuestionsDetailed(questions, allAnswers);
  }, [questions, allAnswers]);

  const { easiest: easiestQuestion, hardest: hardestQuestion } = useMemo(() => {
    return findEasiestAndChallengingQuestions(questions, allAnswers);
  }, [questions, allAnswers]);

  const challengingQuestions = useMemo(() => {
    return findChallengingQuestions(questions, allAnswers, 5);
  }, [questions, allAnswers]);

  const easiestQuestions = useMemo(() => {
    if (!easiestQuestion) return [];
    return [
      {
        questionId: easiestQuestion.questionId,
        questionNumber: easiestQuestion.questionNumber,
        question: easiestQuestion.question,
        dskpCode: easiestQuestion.dskpCode,
        correctAnswer: easiestQuestion.correctAnswer,
        correctLetter: easiestQuestion.correctAnswerLetter,
        totalAnswered: easiestQuestion.totalAnswered,
        correctCount: easiestQuestion.correctCount,
        wrongCount: easiestQuestion.wrongCount,
        wrongPercentage: 100 - easiestQuestion.accuracy,
        commonWrongLetter: easiestQuestion.mostCommonWrongLetter,
        pedagogicalTip: easiestQuestion.pedagogicalTip,
        distribution: easiestQuestion.distribution,
      },
    ];
  }, [easiestQuestion]);

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

  // Reset Demo Data
  const handleResetDemoData = () => {
    resetDemoSessionData();
    playSfx('chime', soundEnabled);
    setSessionSaveNotice(
      `✅ Data Demo ${selectedClass} berjaya di-reset kepada 600 respons lengkap (36 Menguasai, 4 Sedang Menguasai, 0 Perlu Bimbingan)!`
    );
    setDataVersion((v) => v + 1);
    setTimeout(() => {
      setSessionSaveNotice(null);
    }, 5000);
  };

  // Clear Demo Data (wipes only demo storage)
  const handleClearDemoData = () => {
    if (window.confirm(`Padamkan data demo sesi kelas ${selectedClass}?`)) {
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
        ? `Sesi Demo ${selectedClass} (${sessionHistory.length + 1})`
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
      ? `DEMO-SESSION-001 (Data Lengkap ${selectedClass})`
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
      {/* Toast Save / Notice */}
      <AnimatePresence>
        {sessionSaveNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 border-2 border-emerald-300 text-xs font-bold shadow-sm flex items-center justify-between"
          >
            <span>{sessionSaveNotice}</span>
            <button
              type="button"
              onClick={() => setSessionSaveNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 font-black cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER, BREADCRUMB, QUICK ACTIONS, AND HORIZONTAL TABS */}
      <DashboardHeader
        selectedClass={selectedClass}
        sessionMode={sessionMode}
        sessionLabel={sessionLabel}
        currentDateStr={currentDateStr}
        studentsCount={students.length}
        totalQuestions={questions.length}
        totalScans={totalScansInSession}
        isPrivacyMode={isPrivacyMode}
        activeTab={activeTab}
        onTabChange={(tab) => {
          playSfx("click", soundEnabled);
          setActiveTab(tab);
        }}
        onToggleDataMode={handleToggleDataMode}
        onTogglePrivacy={() => setIsPrivacyMode(!isPrivacyMode)}
        onResetDemo={handleResetDemoData}
        onSaveSession={handleSaveSessionSnapshot}
        onExportCSV={handleExportCSV}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onClearSession={handleClearSession}
        onNavigateToSession={onNavigateToSession}
      />

      {/* ======================================================== */}
      {/* TAB CONTENT (HANYA SATU TAB AKTIF DIPAPARKAN) */}
      {/* ======================================================== */}
      {activeTab === "summary" && (
        <TabRingkasan
          studentsCount={students.length}
          totalQuestions={questions.length}
          overallAccuracy={smartInsights.overallAccuracy}
          masteredCount={smartInsights.masteredCount}
          inProgressCount={smartInsights.inProgressCount}
          needGuidanceCount={smartInsights.needGuidanceCount}
          classStrengths={classStrengths}
          classWeaknesses={classWeaknesses}
          alyaSummaryText={alyaSummaryText}
          dskpAnalysis={dskpAnalysis}
          onNavigateToTab={(tab) => {
            playSfx("click", soundEnabled);
            setActiveTab(tab);
          }}
        />
      )}

      {activeTab === "students" && (
        <TabSenaraiMurid
          students={studentsAnalysis}
          soundEnabled={soundEnabled}
          isPrivacyMode={isPrivacyMode}
          selectedClass={selectedClass}
          onSelectStudent={(id) => {
            playSfx("click", soundEnabled);
            setSelectedStudentId(id);
          }}
          onOpenIntervention={(student) => {
            playSfx("click", soundEnabled);
            setInterventionModalStudent(student);
          }}
        />
      )}

      {activeTab === "charts" && (
        <TabKemajuanCarta
          studentsCount={students.length}
          overallAccuracy={smartInsights.overallAccuracy}
          masteredCount={smartInsights.masteredCount}
          inProgressCount={smartInsights.inProgressCount}
          needGuidanceCount={smartInsights.needGuidanceCount}
          dskpAnalysis={dskpAnalysis}
          rankedStudents={rankedStudents}
          hardestQuestions={challengingQuestions}
          easiestQuestions={easiestQuestions}
          classLearningSummary={classLearningSummary}
          sessionHistory={sessionHistory}
          isPrivacyMode={isPrivacyMode}
          onSelectStudent={(id) => {
            playSfx("click", soundEnabled);
            setSelectedStudentId(id);
          }}
        />
      )}

      {activeTab === "ai" && (
        <TabAnalisisAIPedagogi
          classStrengths={classStrengths}
          classWeaknesses={classWeaknesses}
          alyaSummaryText={alyaSummaryText}
          followUpActivities={followUpActivities}
          classLearningSummary={classLearningSummary}
          hardestQuestions={challengingQuestions}
          dskpAnalysis={dskpAnalysis}
          overallAccuracy={smartInsights.overallAccuracy}
          studentsCount={students.length}
          masteredCount={smartInsights.masteredCount}
          needGuidanceCount={smartInsights.needGuidanceCount}
        />
      )}

      {activeTab === "questions" && (
        <TabAnalisisSoalan
          questionsAnalysis={questionsAnalysis}
        />
      )}

      {activeTab === "dskp" && (
        <TabDskp
          dskpAnalysis={dskpAnalysis}
          students={studentsAnalysis}
          isPrivacyMode={isPrivacyMode}
          onSelectStudent={(id) => {
            playSfx("click", soundEnabled);
            setSelectedStudentId(id);
          }}
        />
      )}

      {activeTab === "reports" && (
        <TabLaporanSijil
          students={studentsAnalysis}
          selectedClass={selectedClass}
          currentDateStr={currentDateStr}
          overallAccuracy={smartInsights.overallAccuracy}
          soundEnabled={soundEnabled}
          isPrivacyMode={isPrivacyMode}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
          onExportCSV={handleExportCSV}
          onOpenCertificate={(student) => setSelectedStudentForCertificate(student)}
        />
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
              className="bg-gradient-to-b from-white via-amber-50/40 to-white text-stone-900 rounded-3xl p-5 sm:p-7 border-4 border-amber-400 shadow-2xl max-w-2xl w-full my-auto space-y-4.5 max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-stone-200">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif-title text-xl font-black text-stone-900">
                      {getDisplayName(activeStudentModal.studentName, activeStudentModal.studentId)}
                    </h3>
                    <span className="bg-stone-900 text-amber-300 font-mono text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                      {activeStudentModal.studentId}
                    </span>
                    <span className="bg-amber-100 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-amber-300">
                      Kelas: {activeStudentModal.class}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-bold mt-1">
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
                <div className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-xs">
                  <span className="text-[11px] text-stone-600 font-bold block">Skor</span>
                  <span className="text-2xl font-black text-stone-900 font-mono">
                    {activeStudentModal.correctCount} / 15
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold block">Soalan Betul</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-xs">
                  <span className="text-[11px] text-stone-600 font-bold block">Peratus</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    {activeStudentModal.percentage}%
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold block">Ketepatan Imbasan</span>
                </div>

                <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white p-3 rounded-2xl border-2 border-amber-400 shadow-xs">
                  <span className="text-[11px] text-amber-950 font-black block">CADANGAN TP</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">
                    TP {activeStudentModal.suggestedTP}
                  </span>
                  <span className="text-[10px] text-amber-900 font-bold block">
                    Keyakinan: {activeStudentModal.tpConfidence}
                  </span>
                </div>
              </div>

              {/* Justifikasi Cadangan TP */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-stone-900">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Justifikasi Cadangan TP (Tahap Penguasaan {activeStudentModal.suggestedTP}):</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">PBD Formatif</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 font-medium">
                  {activeStudentModal.tpReason}
                </p>
                <p className="text-[10px] text-stone-500 italic">
                  * "Cadangan TP ini dijana berdasarkan prestasi sesi dan perlu disahkan oleh guru."
                </p>
              </div>

              {/* Kekuatan & Kelemahan Murid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kekuatan */}
                <div className="bg-emerald-100/90 p-3.5 rounded-2xl border-2 border-emerald-400 space-y-1.5 shadow-2xs">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>💪 KEKUATAN:</span>
                  </span>
                  {(activeStudentModal.strongStandards || []).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {(activeStudentModal.strongStandards || []).map((code) => (
                        <span
                          key={code}
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono font-black text-[11px] shadow-2xs"
                        >
                          ✓ {code} ({DSKP_STANDARDS_INFO[code]?.name || 'DSKP'})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-stone-600 font-bold">Perlu pengukuhan berterusan.</span>
                  )}
                </div>

                {/* Perlu Bimbingan */}
                <div className="bg-rose-100/90 p-3.5 rounded-2xl border-2 border-rose-400 space-y-1.5 shadow-2xs">
                  <span className="text-xs font-black text-rose-950 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>🔎 PERLU BIMBINGAN:</span>
                  </span>
                  {(activeStudentModal.weakStandards || []).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {(activeStudentModal.weakStandards || []).map((code) => (
                        <span
                          key={code}
                          className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white font-mono font-black text-[11px] shadow-2xs"
                        >
                          ⚠️ {code} ({DSKP_STANDARDS_INFO[code]?.name || 'DSKP'})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-800 font-black">Tiada kelemahan ketara!</span>
                  )}
                </div>
              </div>

              {/* Cadangan Intervensi */}
              <div className="bg-amber-100/90 p-3.5 rounded-2xl border-2 border-amber-400 space-y-1 shadow-2xs">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-amber-700" />
                  <span>💡 Cadangan Intervensi:</span>
                </span>
                <p className="text-xs text-stone-900 font-semibold leading-relaxed">
                  "{activeStudentModal.intervention}"
                </p>
              </div>

              {/* Cadangan Pengayaan (if high performer) */}
              {activeStudentModal.suggestedTP >= 5 && activeStudentModal.enrichment && (
                <div className="bg-emerald-100/90 p-3.5 rounded-2xl border-2 border-emerald-400 space-y-1 shadow-2xs">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>🌟 Cadangan Pengayaan:</span>
                  </span>
                  <p className="text-xs text-stone-900 font-semibold leading-relaxed">
                    "{activeStudentModal.enrichment}"
                  </p>
                </div>
              )}

              {/* ======================================================== */}
              {/* 🧠 PROFIL KECENDERUNGAN PEMBELAJARAN (ANALISIS DATA) */}
              {/* ======================================================== */}
              {activeStudentModal.learningProfile && (
                <div className="bg-gradient-to-br from-indigo-100/90 via-purple-50/80 to-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-indigo-300 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-indigo-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                        🧠
                      </div>
                      <div>
                        <h4 className="font-serif-title font-black text-sm text-indigo-950">
                          PROFIL KECENDERUNGAN PEMBELAJARAN
                        </h4>
                        <p className="text-[10px] text-stone-600 font-bold">
                          Analisis kecenderungan penerimaan maklumat berpandukan data interaksi murid
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-black shadow-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        ⭐ {
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-950 border border-indigo-300">
                        Keyakinan: {activeStudentModal.learningProfile.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Profil Kecenderungan 3 Skor: Visual, Kinestetik, Auditori */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Visual */}
                    <div className="bg-white p-3 rounded-xl border-2 border-blue-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>👀</span>
                          <span>Visual</span>
                        </span>
                        <span className="font-mono text-blue-700 font-black text-sm">
                          {activeStudentModal.learningProfile.visualScore}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.visualScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-500 font-medium block">Rajah objek, fraction bar & grid</span>
                    </div>

                    {/* Kinestetik */}
                    <div className="bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>🖐️</span>
                          <span>Kinestetik</span>
                        </span>
                        <span className="font-mono text-emerald-700 font-black text-sm">
                          {activeStudentModal.learningProfile.kinestheticScore}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.kinestheticScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-500 font-medium block">Manipulasi hands-on (Dapur & Pixel)</span>
                    </div>

                    {/* Auditori */}
                    <div className="bg-white p-3 rounded-xl border-2 border-amber-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-1">
                          <span>🎧</span>
                          <span>Auditori</span>
                        </span>
                        <span className="font-mono text-amber-700 font-black text-sm">
                          {activeStudentModal.learningProfile.auditoryScore}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${activeStudentModal.learningProfile.auditoryScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-stone-500 font-medium block">Penerangan berstruktur & suara</span>
                    </div>
                  </div>

                  {/* Penerangan Objektif */}
                  <div className="bg-white p-3 rounded-xl border border-indigo-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-950 block">
                      Penerangan Kecenderungan:
                    </span>
                    <p className="text-xs text-stone-900 font-semibold leading-relaxed">
                      "{activeStudentModal.learningProfile.description}"
                    </p>
                  </div>

                  {/* Bukti Ringkas daripada Data */}
                  {(activeStudentModal.learningProfile.evidence || []).length > 0 && (
                    <div className="bg-white/80 p-3 rounded-xl border border-indigo-200 space-y-1">
                      <span className="text-[11px] font-black text-indigo-950 flex items-center gap-1">
                        <span>🔍</span> Bukti Ringkas daripada Data:
                      </span>
                      <ul className="text-[11px] text-stone-700 font-medium space-y-0.5 list-disc list-inside">
                        {(activeStudentModal.learningProfile.evidence || []).map((ev, idx) => (
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
                <span className="text-xs font-black text-stone-800 block">
                  Peta Jawapan Imbasan Murid (15 Soalan):
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-15 gap-1 bg-white p-2.5 rounded-2xl border-2 border-stone-200 shadow-2xs">
                  {questions.map((q, qIdx) => {
                    const ans = activeStudentModal.answers[q.questionId];
                    const hasAns = !!ans;
                    const isCorrect = ans && ans.isCorrect;

                    return (
                      <div
                        key={q.questionId}
                        className={`p-1.5 rounded-xl text-center font-mono text-[10px] font-bold ${
                          hasAns
                            ? isCorrect
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                        title={`Q${qIdx + 1} (${q.dskpCode}): ${
                          hasAns ? (isCorrect ? `Betul (${ans.letter})` : `Salah (${ans.letter})`) : 'Tiada respons'
                        }`}
                      >
                        <span className="block text-[9px] opacity-80">Q{qIdx + 1}</span>
                        <div className="text-[12px] font-black">
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
      {/* Sijil Modal */}
      {selectedStudentForCertificate && (
        <CertificateModal
          isOpen={!!selectedStudentForCertificate}
          studentName={selectedStudentForCertificate.studentName}
          studentClass={selectedClass}
          teacherName="Guru Matematik"
          completedChallenges={9}
          earnedStars={selectedStudentForCertificate.correctCount * 2}
          issueDate={currentDateStr}
          soundEnabled={soundEnabled}
          onClose={() => setSelectedStudentForCertificate(null)}
        />
      )}
    </div>
  );
};
