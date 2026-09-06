import React, { useState, useMemo } from 'react';
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
  HelpCircle,
  ChevronRight,
  BookOpen,
  Search,
  RotateCcw,
  Check,
  ShieldAlert,
  Flame,
  Lightbulb,
  ExternalLink,
  Target,
  BarChart3,
} from 'lucide-react';
import { InteractiveClassStudent } from '../../types/interactiveClass';
import {
  INTERACTIVE_CLASS_30_QUESTIONS,
  InteractiveClassQuestion,
} from '../../data/interactiveClass30Questions';
import {
  loadAllSessionAnswers,
  clearQuestionAnswers,
} from '../../utils/interactiveSessionManager';
import {
  analyzeAllStudents,
  analyzeDskpStandards,
  findChallengingQuestions,
  generateSmartClassInsights,
  exportClassReportCSV,
  seedRealisticSessionData,
  StudentAnalysisResult,
  DskpStandardAnalysis,
  ChallengingQuestionResult,
  DSKP_STANDARDS_INFO,
} from '../../utils/interactiveDashboardAnalytics';
import { playSfx } from '../../utils/audio';

interface InteractiveClassDashboardProps {
  selectedClass: string;
  students: InteractiveClassStudent[];
  soundEnabled?: boolean;
  onNavigateToSession?: () => void;
}

export const InteractiveClassDashboard: React.FC<InteractiveClassDashboardProps> = ({
  selectedClass,
  students,
  soundEnabled = true,
  onNavigateToSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Trigger re-computations on mutation

  const questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS;

  // Load all session answers from storage
  const allAnswers = useMemo(() => {
    return loadAllSessionAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion]);

  // Compute analytics
  const studentsAnalysis: StudentAnalysisResult[] = useMemo(() => {
    return analyzeAllStudents(students, questions, allAnswers);
  }, [students, questions, allAnswers]);

  const dskpAnalysis: DskpStandardAnalysis[] = useMemo(() => {
    return analyzeDskpStandards(questions, allAnswers);
  }, [questions, allAnswers]);

  const challengingQuestions: ChallengingQuestionResult[] = useMemo(() => {
    return findChallengingQuestions(questions, allAnswers, 4);
  }, [questions, allAnswers]);

  const smartInsights = useMemo(() => {
    return generateSmartClassInsights(dskpAnalysis, studentsAnalysis);
  }, [dskpAnalysis, studentsAnalysis]);

  // Ranked students by percentage, then by correctCount
  const rankedStudents = useMemo(() => {
    const sorted = [...studentsAnalysis].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.correctCount - a.correctCount;
    });
    return sorted;
  }, [studentsAnalysis]);

  // Filtered students based on search input
  const filteredRanked = useMemo(() => {
    if (!searchTerm.trim()) return rankedStudents;
    const term = searchTerm.toLowerCase();
    return rankedStudents.filter(
      (s) =>
        s.studentName.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term)
    );
  }, [rankedStudents, searchTerm]);

  // Selected student for detail modal
  const activeStudentModal = useMemo(() => {
    if (!selectedStudentId) return null;
    return studentsAnalysis.find((s) => s.studentId === selectedStudentId) || null;
  }, [selectedStudentId, studentsAnalysis]);

  // Total answers scanned in session
  const totalScansInSession = useMemo(() => {
    let count = 0;
    Object.values(allAnswers).forEach((qMap) => {
      count += Object.keys(qMap).length;
    });
    return count;
  }, [allAnswers]);

  // Quick Seed Demo Data Handler
  const handleSeedDemoData = () => {
    if (
      window.confirm(
        `Jana data simulasi 30 soalan bagi ${students.length} murid kelas ${selectedClass} untuk tujuan semakan dashboard?`
      )
    ) {
      playSfx('chime', soundEnabled);
      seedRealisticSessionData(selectedClass, students, questions);
      setDataVersion((v) => v + 1);
    }
  };

  // Clear Session Answers Handler
  const handleClearSession = () => {
    if (
      window.confirm(
        'Adakah anda pasti mahu memadam semua rekod imbasan jawapan bagi sesi kelas interaktif ini?'
      )
    ) {
      playSfx('click', soundEnabled);
      clearQuestionAnswers();
      setDataVersion((v) => v + 1);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    playSfx('chime', soundEnabled);
    exportClassReportCSV(selectedClass, studentsAnalysis, dskpAnalysis, questions);
  };

  // Helper for TP Badge Styling
  const getTpBadge = (tp: number) => {
    if (tp >= 5) {
      return (
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          <Award className="w-3 h-3 text-emerald-600" />
          <span>TP {tp}</span>
        </span>
      );
    }
    if (tp >= 3) {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
          <Target className="w-3 h-3 text-amber-600" />
          <span>TP {tp}</span>
        </span>
      );
    }
    return (
      <span className="bg-rose-100 text-rose-900 border border-rose-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        <span>TP {tp}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 font-rounded">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & ACTION TOOLBAR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D98262] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#4A3728]">
                Dashboard Guru — Kelas Interaktif
              </h2>
              <span className="bg-[#3c4233] text-amber-300 font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
                {selectedClass}
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                30 Soalan DSKP 3.1
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Analisis prestasi bilik darjah, penguasaan Standard Pembelajaran, dan cadangan Tahap Penguasaan (PBD).
            </p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalScansInSession === 0 && (
            <button
              type="button"
              onClick={handleSeedDemoData}
              className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              title="Isi respons simulasi bagi 40 murid untuk mencuba paparan data dashboard"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🧪 Isi Data Simulasi</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            title="Muat turun data analisis penuh dalam format CSV / Microsoft Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>📥 Muat Turun CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsPrintModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            title="Buka paparan cetakan rasmi laporan PBD"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ Cetak Laporan PBD</span>
          </button>

          {totalScansInSession > 0 && (
            <button
              type="button"
              onClick={handleClearSession}
              className="p-2 rounded-2xl bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-600 text-xs font-bold border border-stone-200 cursor-pointer transition-colors"
              title="Padam rekod sesi terkini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. RINGKASAN KELAS (SUMMARY METRIC CARDS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Jumlah Murid */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-stone-500 font-bold mb-1">
            <Users className="w-3.5 h-3.5 text-[#D98262]" />
            <span>Jumlah Murid</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#4A3728] font-mono">
            {students.length}
          </div>
          <span className="text-[11px] text-stone-400 font-medium">Berdaftar</span>
        </div>

        {/* Soalan */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-stone-500 font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Soalan Sesi</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono">
            {questions.length}
          </div>
          <span className="text-[11px] text-stone-400 font-medium">DSKP 3.1</span>
        </div>

        {/* Purata Kelas */}
        <div className="bg-emerald-50 rounded-3xl p-4 sm:p-5 border-2 border-emerald-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-800 font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Purata Kelas</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
            {smartInsights.overallAccuracy}%
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Ketepatan Jawapan</span>
        </div>

        {/* Murid Menguasai (>= 70%) */}
        <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-amber-900 font-bold mb-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Murid Menguasai</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
            {smartInsights.masteredCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Skor ≥ 70% (TP 4-6)</span>
        </div>

        {/* Perlu Bimbingan (< 70%) */}
        <div className="bg-rose-50 rounded-3xl p-4 sm:p-5 border-2 border-rose-200 shadow-sm text-center col-span-2 md:col-span-1">
          <div className="flex items-center justify-center gap-1 text-xs text-rose-800 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Perlu Bimbingan</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono">
            {smartInsights.needGuidanceCount}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Skor &lt; 70% (TP 1-3)</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ANALISIS KELAS (RUMUSAN PINTAR BERASASKAN DATA SEBENAR) */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Rumusan Pintar Prestasi Bilik Darjah (Berasaskan Data Sebenar)</span>
          </h3>
          <span className="text-[11px] font-bold text-stone-500 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200">
            {totalScansInSession} Imbasan Jawapan Direkodkan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Dapatan Utama */}
          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dapatan Penguasaan Murid:</span>
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {smartInsights.insights.map((ins, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#D98262] font-black">•</span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Syor Pedagogi & Intervensi Guru */}
          <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Syor Guru & Tindakan Pengukuhan:</span>
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {smartInsights.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-black">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. ANALISIS DSKP & SOALAN PALING MENCABAR (SPLIT 2 COLS) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (7 COLS): ANALISIS 7 STANDARD PEMBELAJARAN DSKP 3.1 */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#D98262]" />
                <span>Analisis DSKP Matematik Tahun 3 (Topik 3.1)</span>
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Pencapaian ketepatan jawapan mengikut 7 standard kandungan DSKP.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#3c4233] text-amber-300 px-2.5 py-1 rounded-full">
              7 Standard
            </span>
          </div>

          {/* 7 Standards Progress Bars */}
          <div className="space-y-3">
            {dskpAnalysis.map((std) => {
              const statusColor =
                std.percentage >= 80
                  ? 'bg-emerald-500'
                  : std.percentage >= 65
                  ? 'bg-amber-400'
                  : std.percentage >= 50
                  ? 'bg-orange-400'
                  : 'bg-rose-400';

              const statusBadge =
                std.percentage >= 80
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : std.percentage >= 65
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : std.percentage >= 50
                  ? 'bg-orange-100 text-orange-900 border-orange-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300';

              return (
                <div key={std.code} className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold bg-[#3c4233] text-amber-300 text-[11px] px-2 py-0.5 rounded-lg">
                        {std.code}
                      </span>
                      <span className="font-bold text-[#4A3728]">{std.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-500 font-medium">
                        {std.correctResponses}/{std.totalResponses} betul
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                        {std.status}
                      </span>
                      <span className="font-mono font-black text-xs text-stone-800 w-10 text-right">
                        {std.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${statusColor}`}
                      style={{ width: `${std.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT (5 COLS): SOALAN PALING MENCABAR (MISKONSEPSI KELAS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
          <div className="pb-2 border-b border-stone-100">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              <span>Soalan Paling Mencabar</span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Soalan yang paling banyak salah untuk fokus pengajaran semula guru.
            </p>
          </div>

          {challengingQuestions.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
              Belum ada data imbasan soalan. Imbas kad murid semasa sesi untuk melihat analisis soalan mencabar.
            </div>
          ) : (
            <div className="space-y-3">
              {challengingQuestions.map((cq) => (
                <div
                  key={cq.questionId}
                  className="p-3.5 rounded-2xl bg-rose-50/70 border-2 border-rose-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black bg-rose-600 text-white px-2 py-0.5 rounded-lg text-[11px]">
                        Q{cq.questionNumber}
                      </span>
                      <span className="text-[11px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                        DSKP {cq.dskpCode}
                      </span>
                    </div>

                    <span className="font-mono font-black text-rose-700 text-xs">
                      {cq.wrongCount} Salah ({cq.wrongPercentage}%)
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#4A3728] leading-snug line-clamp-2">
                    {cq.question}
                  </p>

                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-rose-200">
                    <span className="text-emerald-800 font-bold">
                      Jawapan Tepat: [{cq.correctLetter}] {cq.correctAnswer}
                    </span>
                    <span className="text-stone-500">
                      Betul: {cq.correctCount}/{cq.totalAnswered}
                    </span>
                  </div>

                  <div className="text-[10px] text-stone-600 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <strong>Petua Guru:</strong> {cq.pedagogicalTip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. SCOREBOARD & SENARAI PRESTASI MURID (RANKING + CADANGAN TP) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md space-y-4">
        {/* Table Top Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Scoreboard & Pentaksiran Murid ({students.length})</span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Klik nama murid untuk melihat perincian soalan, standard kuat/lemah, dan cadangan intervensi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari murid..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D98262] w-48"
              />
            </div>
          </div>
        </div>

        {/* Ethical / Formative Assessment Notice */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Peringatan PBD:</strong> Jangan gunakan kedudukan ranking sebagai satu-satunya penilaian.
            Setiap murid mempunyai rentak pembelajaran tersendiri; penilaian formatif PBD berfokus kepada perkembangan potensi individu murid secara berterusan.
          </span>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#3c4233] text-white">
                <th className="py-3 px-3.5 font-bold">#</th>
                <th className="py-3 px-3.5 font-bold">Nama Murid</th>
                <th className="py-3 px-3.5 font-bold">No Kad</th>
                <th className="py-3 px-3.5 font-bold text-center">Betul (/30)</th>
                <th className="py-3 px-3.5 font-bold text-center">Salah (/30)</th>
                <th className="py-3 px-3.5 font-bold text-center">Peratus</th>
                <th className="py-3 px-3.5 font-bold text-center">Cadangan TP</th>
                <th className="py-3 px-3.5 font-bold text-center">Keyakinan</th>
                <th className="py-3 px-3.5 font-bold text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredRanked.map((student, idx) => {
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

                    {/* Name */}
                    <td className="py-3 px-3.5 font-bold text-[#4A3728]">
                      {student.studentName}
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
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {student.percentage}%
                      </span>
                    </td>

                    {/* Cadangan TP */}
                    <td className="py-3 px-3.5 text-center">
                      {getTpBadge(student.suggestedTP)}
                    </td>

                    {/* Keyakinan */}
                    <td className="py-3 px-3.5 text-center">
                      <span className="text-[11px] font-bold text-stone-500">
                        {student.tpConfidence}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSfx('click', soundEnabled);
                          setSelectedStudentId(student.studentId);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-[#D98262] text-stone-700 hover:text-white text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Analisis</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. MODAL: PERINCIAN ANALISIS INDIVIDU MURID */}
      {/* ======================================================== */}
      <AnimatePresence>
        {activeStudentModal && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-6 sm:p-7 border-4 border-[#F4C95D] shadow-2xl max-w-2xl w-full my-8 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b-2 border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-title text-xl font-black text-[#4A3728]">
                      {activeStudentModal.studentName}
                    </h3>
                    <span className="bg-[#3c4233] text-amber-300 font-mono text-xs font-black px-2.5 py-0.5 rounded-full">
                      {activeStudentModal.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">
                    Kelas: <strong>{activeStudentModal.class}</strong> • Analisis Penguasaan Pecahan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentId(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Student Performance High-level Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200">
                  <span className="text-[11px] text-stone-500 font-bold block">Skor</span>
                  <span className="text-2xl font-black text-[#4A3728] font-mono">
                    {activeStudentModal.correctCount} / 30
                  </span>
                  <span className="text-[10px] text-stone-400 block">Soalan Betul</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200">
                  <span className="text-[11px] text-stone-500 font-bold block">Peratus</span>
                  <span className="text-2xl font-black text-emerald-800 font-mono">
                    {activeStudentModal.percentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">Ketepatan Imbasan</span>
                </div>

                <div className="bg-amber-100/90 p-3.5 rounded-2xl border-2 border-amber-300">
                  <span className="text-[11px] text-amber-900 font-bold block">Cadangan TP</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">
                    TP {activeStudentModal.suggestedTP}
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold block">
                    Keyakinan: {activeStudentModal.tpConfidence}
                  </span>
                </div>
              </div>

              {/* Sebab & Penilaian TP (Tahap Penguasaan) */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Justifikasi Cadangan Tahap Penguasaan (TP {activeStudentModal.suggestedTP}):</span>
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  {activeStudentModal.tpReason}
                </p>
                <p className="text-[10px] text-stone-500 italic">
                  * Penafian: Skor ini adalah cadangan sistem formatif bilik darjah. Guru kekal sebagai pihak yang membuat keputusan mutlak dalam pentaksiran PBD murid.
                </p>
              </div>

              {/* Standard Kuat vs Standard Lemah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Standard Kuat */}
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-300 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Standard DSKP Kuat:</span>
                  </span>
                  {activeStudentModal.strongStandards.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeStudentModal.strongStandards.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded-lg bg-emerald-200 text-emerald-950 font-mono font-bold text-[11px]"
                          title={DSKP_STANDARDS_INFO[code]?.name}
                        >
                          ✓ {code}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-stone-500">Perlu bimbingan merentasi standard.</span>
                  )}
                </div>

                {/* Standard Lemah */}
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-300 space-y-1.5">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Perlu Bimbingan:</span>
                  </span>
                  {activeStudentModal.weakStandards.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {activeStudentModal.weakStandards.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded-lg bg-rose-200 text-rose-950 font-mono font-bold text-[11px]"
                          title={DSKP_STANDARDS_INFO[code]?.name}
                        >
                          ⚠️ {code}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold">Tiada kelemahan ketara direkodkan!</span>
                  )}
                </div>
              </div>

              {/* Cadangan Intervensi Guru */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cadangan Intervensi Guru:</span>
                </span>
                <p className="text-xs text-stone-800 font-medium">
                  {activeStudentModal.intervention}
                </p>
              </div>

              {/* Peta Respons Soalan (Q1 - Q30) */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-600 block">
                  Peta Jawapan Imbasan Murid (30 Soalan):
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1 bg-white p-2.5 rounded-2xl border border-stone-200">
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
                          hasAns ? (isCorrect ? `Betul (${ans.letter})` : `Salah (${ans.letter})`) : 'Belum diimbas'
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

              {/* Modal Footer Close */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentId(null)}
                  className="px-5 py-2 rounded-2xl bg-[#D98262] hover:bg-[#c36f51] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Tutup Analisis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 7. MODAL CETAK / PDF LAPORAN RASMI PBD */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-2xl max-w-4xl w-full my-8 space-y-6"
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
                    Topik 3.1: Pecahan (DSKP Matematik Tahun 3) • Modul Kamera & Kad Murid
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
                    <span className="font-bold text-stone-900">{new Date().toLocaleDateString('ms-MY')}</span>
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
                  <span className="font-bold text-stone-800 block">Ringkasan Standard Pembelajaran:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    {dskpAnalysis.map((std) => (
                      <div key={std.code} className="p-1.5 bg-stone-50 rounded border border-stone-200">
                        <span className="font-bold">{std.code}:</span> {std.percentage}% ({std.status})
                      </div>
                    ))}
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
                        <th className="p-1.5 font-bold text-center">Skor (/30)</th>
                        <th className="p-1.5 font-bold text-center">%</th>
                        <th className="p-1.5 font-bold text-center">Cadangan TP</th>
                        <th className="p-1.5 font-bold">Cadangan Intervensi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {rankedStudents.map((s, idx) => (
                        <tr key={s.studentId}>
                          <td className="p-1.5 text-stone-500">{idx + 1}</td>
                          <td className="p-1.5 font-mono">{s.studentId}</td>
                          <td className="p-1.5 font-bold text-stone-900">{s.studentName}</td>
                          <td className="p-1.5 text-center font-mono">{s.correctCount}/30</td>
                          <td className="p-1.5 text-center font-mono font-bold">{s.percentage}%</td>
                          <td className="p-1.5 text-center font-bold">TP {s.suggestedTP}</td>
                          <td className="p-1.5 text-stone-600 text-[10px]">{s.intervention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
