import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Award,
  Sparkles,
  Search,
  Filter,
  Download,
  RotateCcw,
  LogOut,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart2,
  Star,
  Trophy,
  HelpCircle,
  TrendingUp,
  ChevronRight,
  Flame,
  Gamepad2,
  BookOpen,
  Printer,
  Target,
  PieChart as PieIcon,
  Home,
  UserCheck,
  Lock,
  Sprout,
} from 'lucide-react';
import { StudentProfile, AttemptRecord } from '../types';
import {
  getAllStudents,
  getAllSessions,
  setTeacherAuth,
  resetAllData,
  calculateStudentTP,
  calculateStudentStatus,
  ALL_CLASSES,
} from '../utils/studentSessionManager';
import { analyzeStudentLearning, AILearningAnalysisResult } from '../utils/aiLearningAnalytics';
import { playSfx } from '../utils/audio';
import { StudentReportModal } from './StudentReportModal';
import { CertificateModal } from './CertificateModal';
import {
  PieChartStatus,
  SkillBarChart,
  StudentPerformanceBarChart,
  SessionLineChart,
  AllClassesComparisonChart,
  MasteryCategoryBarChart,
  GameAverageBarChart,
  StudentStarsBarChart,
} from './TeacherDashboardCharts';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  soundEnabled,
  onClose,
  onLogout,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('semua');
  const [selectedTP, setSelectedTP] = useState<string>('semua');
  const [selectedProgressFilter, setSelectedProgressFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'summary' | 'roster' | 'progress_charts' | 'ai_analysis' | 'reports'>('summary');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentProfile | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentProfile | null>(null);
  const [selectedStudentForCertificate, setSelectedStudentForCertificate] = useState<StudentProfile | null>(null);
  const [selectedAIStudentId, setSelectedAIStudentId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const students = getAllStudents();
  const sessions = getAllSessions();

  // Combine standard classes with any additional existing classes
  const existingClasses = Array.from(new Set(students.map((s) => s.kelas))).filter(Boolean);
  const allClassOptions = Array.from(new Set([...ALL_CLASSES, ...existingClasses]));

  // Students scoped to selected class
  const classStudents = selectedClass === 'semua' ? students : students.filter((s) => s.kelas === selectedClass);

  // Filtering Logic for Roster
  const filteredStudents = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    const status = calculateStudentStatus(tp, completed);
    const isCemerlang = stars >= 26 || (completed >= 9 && stars >= 26);
    const isBaik = (stars >= 24 && stars <= 25) || (completed >= 9 && stars <= 25);
    const hasCert = s.progress?.certificateEarned || completed >= 9;

    let matchesStatus = true;
    if (selectedStatus === 'Cemerlang') matchesStatus = isCemerlang;
    else if (selectedStatus === 'Baik') matchesStatus = isBaik;
    else if (selectedStatus === 'sijil' || selectedStatus === 'Sijil Diperoleh') matchesStatus = hasCert;
    else if (selectedStatus === 'Menguasai') matchesStatus = status === 'Menguasai';
    else if (selectedStatus === 'Sedang Berkembang') matchesStatus = status === 'Sedang Berkembang';
    else if (selectedStatus === 'Perlukan Bimbingan') matchesStatus = status === 'Perlukan Bimbingan';

    const matchesTP = selectedTP === 'semua' || tp === selectedTP;

    let matchesProgress = true;
    if (selectedProgressFilter === 'selesai') matchesProgress = completed >= 9;
    else if (selectedProgressFilter === 'proses') matchesProgress = completed > 0 && completed < 9;
    else if (selectedProgressFilter === 'belum') matchesProgress = completed === 0;

    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesTP && matchesProgress && matchesSearch;
  });

  const filteredSessions = sessions.filter((s) => {
    const matchesClass = selectedClass === 'semua' || s.kelas === selectedClass;
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Selected Student for AI Analysis Tab
  const activeAIStudent = students.find((s) => s.id === selectedAIStudentId) || classStudents[0] || students[0];

  // Class Overview Metrics
  const totalClassStudents = classStudents.length;
  const totalClassPlayed = classStudents.filter((s) => (s.progress?.completedChallenges || 0) > 0).length;

  const totalClassStarsEarned = classStudents.reduce((sum, s) => sum + (s.progress?.earnedStars || 0), 0);
  const avgClassStars = totalClassStudents > 0 ? (totalClassStarsEarned / totalClassStudents).toFixed(1) : '-';

  const avgClassProgressPct =
    totalClassStudents > 0
      ? Math.round(
          classStudents.reduce(
            (sum, s) => sum + Math.round(((s.progress?.completedChallenges || 0) / 9) * 100),
            0
          ) / totalClassStudents
        )
      : 0;

  // Average TP
  const tpLevels = classStudents.map((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    return parseInt(calculateStudentTP(stars, completed).replace('TP', ''), 10);
  });
  const avgTpNum = tpLevels.length > 0 ? Math.round(tpLevels.reduce((a, b) => a + b, 0) / tpLevels.length) : 1;
  const avgClassTP = `TP${avgTpNum}`;

  // Count Needs Support (Perlukan Bimbingan)
  const classNeedsSupportCount = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    return calculateStudentStatus(tp, completed) === 'Perlukan Bimbingan';
  }).length;

  // Pie Chart & Status Breakdown Counts
  const menguasaiCount = classStudents.filter((s) => {
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, completed);
    return calculateStudentStatus(tp, completed) === 'Menguasai';
  }).length;

  const berkembangCount = classStudents.filter((s) => {
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, completed);
    return calculateStudentStatus(tp, completed) === 'Sedang Berkembang';
  }).length;

  const bimbinganCount = classStudents.filter((s) => {
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, completed);
    return calculateStudentStatus(tp, completed) === 'Perlukan Bimbingan';
  }).length;

  const completedAllCount = classStudents.filter((s) => (s.progress?.completedChallenges || 0) >= 9).length;
  const certEarnedCount = classStudents.filter((s) => s.progress?.certificateEarned || (s.progress?.completedChallenges || 0) >= 9).length;
  const certNotEarnedCount = totalClassStudents - certEarnedCount;

  // Category Breakdown
  const cemerlangCount = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    if (completed === 9 && stars >= 26) return true;
    return stars >= 25 && completed < 9;
  }).length;

  const baikCount = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    if (completed === 9 && (stars === 24 || stars === 25)) return true;
    return stars >= 20 && stars < 25 && completed < 9;
  }).length;

  const memuaskanCount = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    if (completed === 9) return false;
    return stars >= 12 && stars < 20;
  }).length;

  const perluBimbinganCategoryCount = classStudents.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    if (completed === 9) return false;
    return stars < 12;
  }).length;

  const masteryCategoryItems = [
    { category: '🏆 Cemerlang (90-100% / TP5-6)', count: cemerlangCount, total: totalClassStudents, color: 'bg-emerald-600' },
    { category: '🌟 Baik (75-89% / TP4)', count: baikCount, total: totalClassStudents, color: 'bg-[#F4C95D]' },
    { category: '📘 Memuaskan (60-74% / TP3)', count: memuaskanCount, total: totalClassStudents, color: 'bg-amber-500' },
    { category: '🌱 Perlu Bimbingan (<60% / TP1-2)', count: perluBimbinganCategoryCount, total: totalClassStudents, color: 'bg-[#D98262]' },
  ];

  // Game Average Scores
  const avgArenaScore = totalClassStudents > 0
    ? Math.round(classStudents.reduce((sum, s) => {
        const score = s.progress?.gameDetails?.arena_pecahan?.scorePercentage ?? Math.round(((s.progress?.worldStars?.arena || 0) / 9) * 100);
        return sum + score;
      }, 0) / totalClassStudents)
    : 0;

  const avgDapurScore = totalClassStudents > 0
    ? Math.round(classStudents.reduce((sum, s) => {
        const score = s.progress?.gameDetails?.dapur_pecahan?.scorePercentage ?? Math.round(((s.progress?.worldStars?.dapur || 0) / 9) * 100);
        return sum + score;
      }, 0) / totalClassStudents)
    : 0;

  const avgPixelScore = totalClassStudents > 0
    ? Math.round(classStudents.reduce((sum, s) => {
        const score = s.progress?.gameDetails?.dunia_pixel?.scorePercentage ?? Math.round(((s.progress?.worldStars?.pixel || 0) / 9) * 100);
        return sum + score;
      }, 0) / totalClassStudents)
    : 0;

  const gameAverageItems = [
    { gameName: 'Arena Pecahan', avgScorePct: avgArenaScore, icon: '⚔️' },
    { gameName: 'Dapur Pecahan', avgScorePct: avgDapurScore, icon: '🍳' },
    { gameName: 'Dunia Pixel', avgScorePct: avgPixelScore, icon: '👾' },
  ];

  const avgClassStarsNum = parseFloat(avgClassStars);

  // Skill Bar Chart Data
  const skillList = [
    { name: 'Pecahan Tak Wajar', percentage: totalClassStudents > 0 ? Math.min(100, Math.round((avgClassStarsNum / 27) * 100 + 8)) : 0 },
    { name: 'Nombor Bercampur', percentage: totalClassStudents > 0 ? Math.min(100, Math.round((avgClassStarsNum / 27) * 100 - 4)) : 0 },
    { name: 'Penambahan Pecahan', percentage: totalClassStudents > 0 ? Math.min(100, Math.round((avgClassStarsNum / 27) * 100 + 10)) : 0 },
    { name: 'Penolakan Pecahan', percentage: totalClassStudents > 0 ? Math.min(100, Math.round((avgClassStarsNum / 27) * 100 + 2)) : 0 },
    { name: 'Operasi Bergabung', percentage: totalClassStudents > 0 ? Math.max(20, Math.round((avgClassStarsNum / 27) * 100 - 15)) : 0 },
    { name: 'Pecahan daripada Kuantiti', percentage: totalClassStudents > 0 ? Math.max(30, Math.round((avgClassStarsNum / 27) * 100 - 8)) : 0 },
  ];

  // Student Performance Bar Chart Data & Stars Data
  const studentScoreItems = classStudents.map((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    const status = calculateStudentStatus(tp, completed);
    const avgGameScore = s.progress?.gameDetails
      ? Math.round(
          ((s.progress.gameDetails.arena_pecahan?.scorePercentage || 0) +
           (s.progress.gameDetails.dapur_pecahan?.scorePercentage || 0) +
           (s.progress.gameDetails.dunia_pixel?.scorePercentage || 0)) / 3
        )
      : Math.round((stars / 27) * 100);
    const scorePct = avgGameScore > 0 ? avgGameScore : Math.round((stars / 27) * 100);
    return {
      id: s.id,
      name: s.nama,
      kelas: s.kelas,
      scorePct,
      tp,
      status,
    };
  });

  const studentStarItems = classStudents.map((s) => {
    const stars = s.progress?.earnedStars || 0;
    const avgGameScore = s.progress?.gameDetails
      ? Math.round(
          ((s.progress.gameDetails.arena_pecahan?.scorePercentage || 0) +
           (s.progress.gameDetails.dapur_pecahan?.scorePercentage || 0) +
           (s.progress.gameDetails.dunia_pixel?.scorePercentage || 0)) / 3
        )
      : Math.round((stars / 27) * 100);
    const scorePct = avgGameScore > 0 ? avgGameScore : Math.round((stars / 27) * 100);
    return {
      id: s.id,
      name: s.nama,
      stars,
      maxStars: 27,
      scorePct,
    };
  });

  // Session Progression Points
  const sessionPoints = [
    { label: 'Sesi 1', scorePct: Math.max(25, Math.round(avgClassProgressPct * 0.45)) },
    { label: 'Sesi 2', scorePct: Math.max(40, Math.round(avgClassProgressPct * 0.65)) },
    { label: 'Sesi 3', scorePct: Math.max(55, Math.round(avgClassProgressPct * 0.85)) },
    { label: 'Sesi 4', scorePct: avgClassProgressPct },
  ];

  // Comparison across all 7 classes
  const classesSummaryData = allClassOptions.map((clsName) => {
    const clsStudents = students.filter((s) => s.kelas === clsName);
    const count = clsStudents.length;
    if (count === 0) {
      return { className: clsName, studentCount: 0, avgScorePct: 0, avgTP: 'TP1' };
    }
    const totalStars = clsStudents.reduce((sum, s) => sum + (s.progress?.earnedStars || 0), 0);
    const avgScorePct = Math.round((totalStars / (count * 27)) * 100);
    const tpNum = Math.round(
      clsStudents.reduce((sum, s) => {
        const tp = calculateStudentTP(s.progress?.earnedStars || 0, s.progress?.completedChallenges || 0);
        return sum + parseInt(tp.replace('TP', ''), 10);
      }, 0) / count
    );
    return { className: clsName, studentCount: count, avgScorePct, avgTP: `TP${tpNum}` };
  });

  // Quick Toggle filter for Needs Support
  const isNeedsSupportActive = selectedStatus === 'Perlukan Bimbingan';
  const toggleNeedsSupportFilter = () => {
    playSfx('click', soundEnabled);
    if (isNeedsSupportActive) {
      setSelectedStatus('semua');
    } else {
      setSelectedStatus('Perlukan Bimbingan');
      setActiveTab('roster');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    playSfx('chime', soundEnabled);
    let csvContent = 'data:text/csv;charset=utf-8,ID,Nama,Kelas,Kemajuan,Bintang,Penguasaan,Status,Tarikh Daftar\n';

    filteredStudents.forEach((s) => {
      const stars = s.progress?.earnedStars || 0;
      const completed = s.progress?.completedChallenges || 0;
      const tp = calculateStudentTP(stars, completed);
      const status = calculateStudentStatus(tp, completed);
      csvContent += `"${s.id}","${s.nama}","${s.kelas}","${completed}/9","${stars}/27","${tp}","${status}","${s.tarikhDaftar}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Dashboard_Guru_Wira_Pecahan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan CSV berjaya dimuat turun! 📊');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto font-rounded">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl bg-[#FFF8E8] text-[#3c4233] rounded-3xl shadow-2xl border-4 border-[#3c4233] p-4 sm:p-6 max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* TOP HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-300/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#3c4233] text-[#F4C95D] flex items-center justify-center shadow-md shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif-title text-xl sm:text-2xl font-black text-[#3c4233] tracking-tight">
                  📊 Dashboard Guru
                </h1>
                <span className="bg-[#3c4233] text-[#F4C95D] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  PEMBELAJARAN DSKP 2.1
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                "Pantau perkembangan pembelajaran murid dengan mudah."
              </p>
            </div>
          </div>

          {/* Action Buttons - Single Row Vertical Alignment */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 transition-all shadow-xs border border-[#3c4233]/20 cursor-pointer"
              title="Eksport Laporan CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksport CSV</span>
            </button>

            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                setTeacherAuth(false);
                onLogout();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#D98262]/20 hover:bg-[#D98262]/30 text-[#D98262] border border-[#D98262]/40 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Log Keluar Guru"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Keluar</span>
            </button>

            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🏫 PEMILIHAN KELAS BAR */}
        <div className="my-3.5 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <span className="text-base">🏫</span>
            <span className="text-[#3c4233] font-black text-sm">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                playSfx('click', soundEnabled);
                setSelectedClass(e.target.value);
              }}
              className="bg-[#FFF8E8] text-[#3c4233] font-black px-3.5 py-1.5 rounded-xl border border-[#3c4233]/20 focus:outline-none focus:ring-2 focus:ring-[#3c4233] cursor-pointer text-xs shadow-2xs"
            >
              <option value="semua">Semua Kelas ({students.length} murid)</option>
              {allClassOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls} ({students.filter((s) => s.kelas === cls).length} murid)
                </option>
              ))}
            </select>
          </div>

          {/* Selected Class Badge Banner */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-stone-500 font-semibold">Analisis semasa:</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-[#3c4233] text-[#F4C95D] font-black shadow-2xs">
              {selectedClass === 'semua' ? 'Semua Kelas' : `Kelas ${selectedClass}`}
            </span>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="my-1 p-2 rounded-xl bg-[#3c4233] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2 shrink-0 border border-[#F4C95D]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F4C95D]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🧭 TOP NAVIGATION TABS */}
        <div className="bg-stone-200/70 p-1.5 rounded-2xl border border-stone-300/70 flex items-center gap-1.5 overflow-x-auto mb-3.5 shrink-0">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('summary');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'summary'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                : 'text-[#3c4233] hover:bg-stone-300/80'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>⌂ Ringkasan</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('roster');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'roster'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                : 'text-[#3c4233] hover:bg-stone-300/80'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 Murid ({filteredStudents.length})</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('progress_charts');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'progress_charts'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                : 'text-[#3c4233] hover:bg-stone-300/80'
            }`}
          >
            <PieIcon className="w-4 h-4" />
            <span>◔ Kemajuan Murid</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('ai_analysis');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'ai_analysis'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                : 'text-[#3c4233] hover:bg-stone-300/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F4C95D]" />
            <span>✨ Analisis AI</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('reports');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'reports'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                : 'text-[#3c4233] hover:bg-stone-300/80'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>▣ Laporan</span>
          </button>
        </div>

        {/* 📊 5 KAD STATISTIK (SATU BARIS DI DESKTOP) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 shrink-0">
          {/* Kad 1: JUMLAH MURID */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">JUMLAH MURID</p>
              <p className="text-xl font-black text-[#3c4233] leading-tight">{totalClassStudents} <span className="text-xs font-semibold text-stone-500">orang</span></p>
            </div>
          </div>

          {/* Kad 2: SELESAI */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">SELESAI</p>
              <p className="text-xl font-black text-emerald-900 leading-tight">{completedAllCount} <span className="text-xs font-semibold text-emerald-700">orang</span></p>
            </div>
          </div>

          {/* Kad 3: SEDANG BERKEMBANG */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-amber-700" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">SEDANG BERKEMBANG</p>
              <p className="text-xl font-black text-amber-900 leading-tight">{berkembangCount} <span className="text-xs font-semibold text-amber-700">orang</span></p>
            </div>
          </div>

          {/* Kad 4: SIJIL */}
          <div className="p-3.5 rounded-2xl bg-amber-100/60 border border-[#F4C95D] shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4C95D]/30 text-amber-900 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-800" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">SIJIL</p>
              <p className="text-xl font-black text-amber-950 leading-tight">{certEarnedCount} <span className="text-xs font-semibold text-amber-800">orang</span></p>
            </div>
          </div>

          {/* Kad 5: PURATA BINTANG */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-[#F4C95D] text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-blue-800 font-bold uppercase tracking-wider">PURATA BINTANG</p>
              <p className="text-xl font-black text-blue-950 leading-tight">{avgClassStars} <span className="text-xs text-blue-700 font-bold">/ 27</span></p>
            </div>
          </div>
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* TAB 1: 🏠 RINGKASAN */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h2 className="font-serif-title font-bold text-lg text-[#3c4233]">
                  Ringkasan Kelas {selectedClass === 'semua' ? 'Semua Kelas' : selectedClass}
                </h2>
                <button
                  onClick={toggleNeedsSupportFilter}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isNeedsSupportActive
                      ? 'bg-[#D98262] text-white shadow-sm ring-2 ring-[#D98262]'
                      : 'bg-[#D98262]/15 text-[#D98262] hover:bg-[#D98262]/25'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Lihat {classNeedsSupportCount} Murid Perlukan Bimbingan</span>
                </button>
              </div>

              {totalClassStudents === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="text-4xl mx-auto mb-1">📚</div>
                  <h3 className="font-serif-title font-black text-lg text-[#3c4233]">Belum Ada Data Murid</h3>
                  <p className="text-sm font-bold text-stone-700">Belum terdapat data murid untuk kelas ini.</p>
                  <p className="text-xs text-stone-500 font-medium">Data akan dipaparkan selepas murid mula menggunakan Kembara Dunia Pecahan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Card 1: Status Kemajuan Murid Pie Chart */}
                    <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                      <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-2">
                        <span>🥧 Status Pencapaian Murid {selectedClass === 'semua' ? 'Semua Kelas' : selectedClass}</span>
                      </h3>
                      <PieChartStatus
                        menguasaiCount={menguasaiCount}
                        berkembangCount={berkembangCount}
                        bimbinganCount={bimbinganCount}
                        cemerlangCount={cemerlangCount}
                        baikCount={baikCount}
                        totalStudents={totalClassStudents}
                      />
                    </div>

                  {/* Card 2: Prestasi Kemahiran Pecahan Bar Chart */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-2">
                      <span>📊 Prestasi Kemahiran Pecahan</span>
                    </h3>
                    <SkillBarChart skills={skillList} />
                  </div>

                  {/* Card 3: Ringkasan Semua Kelas Comparison */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3 lg:col-span-2">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-2">
                      <span>🏫 Ringkasan Semua Kelas (Perbandingan Cross-Class)</span>
                    </h3>
                    <AllClassesComparisonChart
                      classesData={classesSummaryData}
                      selectedClass={selectedClass}
                      onSelectClass={(cls) => {
                        setSelectedClass(cls);
                        showToast(`Bertukar ke analisis Kelas ${cls}! 🏫`);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 👥 MURID (ROSTER & SEARCH/FILTERS) */}
          {activeTab === 'roster' && (
            <div className="space-y-3">
              {/* Filter controls bar */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-bold">
                  {/* Search bar */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Cari nama / ID murid..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFF8E8] border border-[#3c4233]/20 text-xs font-bold text-[#3c4233] focus:outline-none placeholder-gray-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status filter */}
                    <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-stone-300">
                      <span className="text-gray-500 text-[11px]">Kategori:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                      >
                        {selectedClass === '3 Asah' ? (
                          <>
                            <option value="semua">Semua Murid (40)</option>
                            <option value="Cemerlang">🏆 Cemerlang ({cemerlangCount})</option>
                            <option value="Baik">🌟 Baik ({baikCount})</option>
                            <option value="sijil">📜 Sijil Diperoleh ({certEarnedCount})</option>
                          </>
                        ) : (
                          <>
                            <option value="semua">Semua Status</option>
                            <option value="Cemerlang">🏆 Cemerlang</option>
                            <option value="Baik">🌟 Baik</option>
                            <option value="sijil">📜 Sijil Diperoleh</option>
                            <option value="Menguasai">Menguasai</option>
                            <option value="Sedang Berkembang">Sedang Berkembang</option>
                            <option value="Perlukan Bimbingan">Perlukan Bimbingan</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* TP filter */}
                    <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-stone-300">
                      <span className="text-gray-500 text-[11px]">TP:</span>
                      <select
                        value={selectedTP}
                        onChange={(e) => setSelectedTP(e.target.value)}
                        className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="semua">Semua TP</option>
                        <option value="TP6">TP6</option>
                        <option value="TP5">TP5</option>
                        <option value="TP4">TP4</option>
                        <option value="TP3">TP3</option>
                        <option value="TP2">TP2</option>
                        <option value="TP1">TP1</option>
                      </select>
                    </div>

                    {/* Progress filter */}
                    <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-stone-300">
                      <span className="text-gray-500 text-[11px]">Kemajuan:</span>
                      <select
                        value={selectedProgressFilter}
                        onChange={(e) => setSelectedProgressFilter(e.target.value)}
                        className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="semua">Semua Kemajuan</option>
                        <option value="selesai">Selesai 100% (9/9)</option>
                        <option value="proses">Dalam Proses (&gt;0)</option>
                        <option value="belum">Belum Mula (0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roster Table Container - Scrollable with sticky header */}
              {totalClassStudents === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="text-4xl mx-auto mb-1">📚</div>
                  <h3 className="font-serif-title font-black text-lg text-[#3c4233]">Belum Ada Data Murid</h3>
                  <p className="text-sm font-bold text-stone-700">Belum terdapat data murid untuk kelas ini.</p>
                  <p className="text-xs text-stone-500 font-medium">Data akan dipaparkan selepas murid mula menggunakan Kembara Dunia Pecahan.</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-stone-200/80 space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#D98262] mx-auto" />
                  <p className="font-bold text-sm text-[#3c4233]">Tiada rekod murid dijumpai.</p>
                  <p className="text-xs text-stone-500">Sila laraskan pilihan carian atau penapis.</p>
                </div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto overflow-x-auto rounded-2xl border border-stone-300/80 bg-white shadow-2xs relative">
                  <table className="w-full text-left border-collapse text-xs font-medium">
                    <thead className="sticky top-0 z-10 bg-[#3c4233] text-[#F4C95D] font-black uppercase text-[11px] tracking-wider shadow-xs">
                      <tr>
                        <th className="py-3 px-4">Murid</th>
                        <th className="py-3 px-3">Kelas</th>
                        <th className="py-3 px-3 text-center">Cabaran</th>
                        <th className="py-3 px-3 text-center">Bintang</th>
                        <th className="py-3 px-3 text-center">Skor</th>
                        <th className="py-3 px-3 text-center">Tahap</th>
                        <th className="py-3 px-3 text-center">Sijil</th>
                        <th className="py-3 px-4 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/70">
                      {filteredStudents.map((s) => {
                        const stars = s.progress?.earnedStars || 0;
                        const completed = s.progress?.completedChallenges || 0;
                        const tp = calculateStudentTP(stars, completed);
                        const status = calculateStudentStatus(tp, completed);
                        const hasCertificate = s.progress?.certificateEarned ?? completed >= 9;

                        const avgGameScore = s.progress?.gameDetails
                          ? Math.round(
                              ((s.progress.gameDetails.arena_pecahan?.scorePercentage || 0) +
                               (s.progress.gameDetails.dapur_pecahan?.scorePercentage || 0) +
                               (s.progress.gameDetails.dunia_pixel?.scorePercentage || 0)) / 3
                            )
                          : Math.round((stars / 27) * 100);
                        const scorePct = avgGameScore > 0 ? avgGameScore : Math.round((stars / 27) * 100);

                        let tahapDisplay = '🌟 Baik';
                        let tahapClass = 'bg-amber-100 text-amber-900 border-amber-300';
                        if (stars >= 26 || (completed >= 9 && stars >= 26)) {
                          tahapDisplay = '🏆 Cemerlang';
                          tahapClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                        } else if (stars >= 24) {
                          tahapDisplay = '🌟 Baik';
                          tahapClass = 'bg-amber-100 text-amber-900 border-amber-300';
                        } else if (tp === 'TP3') {
                          tahapDisplay = '📘 Memuaskan';
                          tahapClass = 'bg-blue-100 text-blue-900 border-blue-300';
                        } else {
                          tahapDisplay = '🌱 Bimbingan';
                          tahapClass = 'bg-red-100 text-red-900 border-red-300';
                        }

                        return (
                          <tr key={s.id} className="hover:bg-amber-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#3c4233] text-sm">{s.nama}</p>
                              <p className="text-[10px] text-stone-400 font-mono font-medium">{s.id}</p>
                            </td>
                            <td className="py-3 px-3 font-bold text-stone-700">{s.kelas}</td>
                            <td className="py-3 px-3 text-center font-bold">
                              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-mono border border-stone-200/80">
                                {completed}/9
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-amber-800 font-mono">
                              ⭐ {stars}/27
                            </td>
                            <td className="py-3 px-3 text-center font-bold font-mono">
                              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px] border border-stone-200">
                                {scorePct}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2.5 py-1 rounded-full font-black text-[11px] font-mono border ${tahapClass}`}>
                                {tahapDisplay} ({tp})
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {hasCertificate ? (
                                <button
                                  onClick={() => {
                                    playSfx('fanfare', soundEnabled);
                                    setSelectedStudentForCertificate(s);
                                  }}
                                  className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] hover:bg-amber-200 cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                                  title="Lihat Sijil Pencapaian"
                                >
                                  <span>🏆 Diperoleh</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 border border-stone-200 font-semibold text-[11px] inline-flex items-center gap-1">
                                  🔒 Belum Diperoleh
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    playSfx('click', soundEnabled);
                                    setSelectedStudentForDetail(s);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#3c4233] text-[#F4C95D] font-extrabold text-[11px] hover:bg-[#2d3226] cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                                >
                                  Dashboard
                                </button>

                                <button
                                  onClick={() => {
                                    playSfx('click', soundEnabled);
                                    setSelectedAIStudentId(s.id);
                                    setActiveTab('ai_analysis');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#F4C95D] text-[#3c4233] font-black text-[11px] hover:bg-[#e5b73e] cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                                >
                                  AI Analisis
                                </button>

                                <button
                                  onClick={() => {
                                    playSfx('click', soundEnabled);
                                    setSelectedStudentForReport(s);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-100 text-blue-900 border border-blue-200/80 font-extrabold text-[11px] hover:bg-blue-200 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                                >
                                  Laporan
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 📊 KEMAJUAN MURID (DEDICATED VISUAL CHARTS DASHBOARD) */}
          {activeTab === 'progress_charts' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif-title font-bold text-lg text-[#3c4233]">
                    Dashboard Kemajuan Murid — Kelas {selectedClass === 'semua' ? 'Semua Kelas' : selectedClass}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Visualisasi terperinci status penguasaan, prestasi kemahiran, dan trend perkembangan murid.
                  </p>
                </div>
              </div>

              {totalClassStudents === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="text-4xl mx-auto mb-1">📊</div>
                  <h3 className="font-serif-title font-black text-lg text-[#3c4233]">Tiada data untuk dipaparkan.</h3>
                  <p className="text-sm font-bold text-stone-700">Belum terdapat data murid untuk kelas ini.</p>
                  <p className="text-xs text-stone-500 font-medium">Data akan dipaparkan selepas murid mula menggunakan Kembara Dunia Pecahan.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Chart 1: Carta Pai Status Penguasaan Murid */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>🥧 Status Pencapaian Murid {selectedClass === 'semua' ? 'Semua Kelas' : selectedClass}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Carta Pai</span>
                    </h3>
                    <PieChartStatus
                      menguasaiCount={menguasaiCount}
                      berkembangCount={berkembangCount}
                      bimbinganCount={bimbinganCount}
                      cemerlangCount={cemerlangCount}
                      baikCount={baikCount}
                      totalStudents={totalClassStudents}
                    />
                  </div>

                  {/* Chart 2: Graf Bar Tahap Pencapaian Murid (Kategori) */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>🏆 Tahap Pencapaian Murid Kelas {selectedClass === 'semua' ? 'Semua Kelas' : selectedClass}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Bilangan Murid / Kategori</span>
                    </h3>
                    <MasteryCategoryBarChart items={masteryCategoryItems} />
                  </div>

                  {/* Chart 3: Graf Bar Purata Pencapaian Setiap Permainan */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>🎮 Purata Pencapaian Setiap Permainan</span>
                      <span className="text-[10px] text-gray-400 font-mono">3 Mod Permainan</span>
                    </h3>
                    <GameAverageBarChart games={gameAverageItems} />
                  </div>

                  {/* Chart 4: Graf Bar Prestasi Mengikut Kemahiran */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>📊 Prestasi Mengikut Kemahiran Pecahan</span>
                      <span className="text-[10px] text-gray-400 font-mono">DSKP 2.1</span>
                    </h3>
                    <SkillBarChart skills={skillList} />
                  </div>

                  {/* Chart 5: Graf Bar Prestasi Murid (Peratus) */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>📊 Prestasi Peratus Murid ({selectedClass === 'semua' ? 'Semua Kelas' : selectedClass})</span>
                      <span className="text-[10px] text-gray-400 font-mono">Klik murid untuk perincian</span>
                    </h3>
                    <StudentPerformanceBarChart
                      students={studentScoreItems}
                      onSelectStudent={(sId) => {
                        const targetStudent = students.find((s) => s.id === sId);
                        if (targetStudent) {
                          playSfx('click', soundEnabled);
                          setSelectedStudentForDetail(targetStudent);
                        }
                      }}
                    />
                  </div>

                  {/* Chart 6: Graf Bar Jumlah Bintang Murid */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>⭐ Jumlah Bintang Murid ({selectedClass === 'semua' ? 'Semua Kelas' : selectedClass})</span>
                      <span className="text-[10px] text-gray-400 font-mono">0 → 27 Bintang</span>
                    </h3>
                    <StudentStarsBarChart
                      students={studentStarItems}
                      onSelectStudent={(sId) => {
                        const targetStudent = students.find((s) => s.id === sId);
                        if (targetStudent) {
                          playSfx('click', soundEnabled);
                          setSelectedStudentForDetail(targetStudent);
                        }
                      }}
                    />
                  </div>

                  {/* Chart 6: Carta Garis Perkembangan Kemajuan */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>📈 Perkembangan Kemajuan (Mengikut Sesi)</span>
                      <span className="text-[10px] text-gray-400 font-mono">Garis Masa</span>
                    </h3>
                    <SessionLineChart sessions={sessionPoints} />
                  </div>

                  {/* Chart 5: Cross-Class Comparison */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3 lg:col-span-2">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>🏫 Ringkasan Semua Kelas (7 Kelas DSKP)</span>
                      <span className="text-[10px] text-gray-400 font-mono">Perbandingan Peratus Penguasaan</span>
                    </h3>
                    <AllClassesComparisonChart
                      classesData={classesSummaryData}
                      selectedClass={selectedClass}
                      onSelectClass={(cls) => {
                        setSelectedClass(cls);
                        showToast(`Bertukar ke analisis Kelas ${cls}! 🏫`);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 🤖 ANALISIS AI PEMBELAJARAN */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-4">
              {totalClassStudents === 0 && selectedClass !== 'semua' ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="text-4xl mx-auto mb-1">✨</div>
                  <h3 className="font-serif-title font-black text-lg text-[#3c4233]">Belum Ada Data Murid</h3>
                  <p className="text-sm font-bold text-stone-700">Belum terdapat data murid untuk kelas ini bagi analisis AI.</p>
                  <p className="text-xs text-stone-500 font-medium">Data akan dipaparkan selepas murid mula menggunakan Kembara Dunia Pecahan.</p>
                </div>
              ) : (
                <>
                  {/* Select Student Selector */}
                  <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-[#F4C95D]" />
                      <span className="text-[#3c4233] font-black">Pilih Murid untuk Analisis AI:</span>
                      <select
                        value={selectedAIStudentId || activeAIStudent?.id || ''}
                        onChange={(e) => {
                          playSfx('click', soundEnabled);
                          setSelectedAIStudentId(e.target.value);
                        }}
                        className="bg-[#FFF8E8] text-[#3c4233] font-black px-3 py-1.5 rounded-xl border border-[#3c4233]/20 text-xs focus:outline-none cursor-pointer"
                      >
                        {(selectedClass === 'semua' ? students : classStudents).map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nama} ({s.kelas}) - {s.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    {activeAIStudent && (
                      <button
                        onClick={() => {
                          playSfx('click', soundEnabled);
                          setSelectedStudentForReport(activeAIStudent);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Laporan Pembelajaran</span>
                      </button>
                    )}
                  </div>

                  {activeAIStudent ? (
                    <AILearningAnalysisView student={activeAIStudent} soundEnabled={soundEnabled} />
                  ) : (
                    <div className="p-10 text-center bg-white rounded-2xl">
                      <p className="text-gray-500 font-bold text-sm">Sila pilih murid untuk menjana analisis AI.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 5: 📄 LAPORAN */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif-title font-bold text-lg text-[#3c4233]">
                    Laporan Pembelajaran Murid (DSKP 2.1 Matematik)
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Jana, pratonton, dan cetak laporan rasmi AI pedagogi untuk makluman ibu bapa atau pentadbir.
                  </p>
                </div>
              </div>

              {totalClassStudents === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                  <div className="text-4xl mx-auto mb-1">📋</div>
                  <h3 className="font-serif-title font-black text-lg text-[#3c4233]">Belum Ada Data Murid</h3>
                  <p className="text-sm font-bold text-stone-700">Belum terdapat data murid untuk kelas ini.</p>
                  <p className="text-xs text-stone-500 font-medium">Data akan dipaparkan selepas murid mula menggunakan Kembara Dunia Pecahan.</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-stone-200/80 space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#D98262] mx-auto" />
                  <p className="font-bold text-sm text-[#3c4233]">Tiada laporan murid dijumpai.</p>
                  <p className="text-xs text-stone-500">Sila laraskan pilihan carian atau penapis.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStudents.map((s) => {
                    const stars = s.progress?.earnedStars || 0;
                    const completed = s.progress?.completedChallenges || 0;
                    const tp = calculateStudentTP(stars, completed);
                    const status = calculateStudentStatus(tp, completed);

                    return (
                      <div
                        key={s.id}
                        className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-amber-300 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-mono font-bold">{s.id}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                              {tp}
                            </span>
                          </div>
                          <p className="font-black text-sm text-[#3c4233]">{s.nama}</p>
                          <p className="text-xs text-gray-500 font-bold">Kelas: {s.kelas}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="font-mono text-amber-800 font-bold">⭐ {stars}/27</span>
                          <button
                            onClick={() => {
                              playSfx('click', soundEnabled);
                              setSelectedStudentForReport(s);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#3c4233] text-[#F4C95D] font-black text-xs hover:bg-[#2d3226] cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Jana Laporan</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t border-stone-300/80 flex justify-between items-center shrink-0 text-xs font-bold">
          <button
            onClick={() => {
              if (window.confirm('Set semula data demo ke keadaan asal?')) {
                resetAllData();
                showToast('Data telah diset semula! 🔄');
                setTimeout(() => window.location.reload(), 600);
              }
            }}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>↻ Set Semula Data Demo</span>
          </button>

          <p className="text-stone-400 text-[11px] hidden sm:block font-semibold">
            Modul Dashboard Guru • Aplikasi Permainan Matematik Pecahan
          </p>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-black text-xs cursor-pointer shadow-2xs transition-colors"
          >
            Tutup Dashboard
          </button>
        </div>
      </motion.div>

      {/* 👤 INDIVIDUAL STUDENT DASHBOARD MODAL */}
      <AnimatePresence>
        {selectedStudentForDetail && (
          <StudentDetailModal
            student={selectedStudentForDetail}
            soundEnabled={soundEnabled}
            onClose={() => setSelectedStudentForDetail(null)}
            onOpenReport={() => {
              setSelectedStudentForReport(selectedStudentForDetail);
            }}
          />
        )}
      </AnimatePresence>

      {/* 📄 PRINTABLE STUDENT REPORT MODAL */}
      <AnimatePresence>
        {selectedStudentForReport && (
          <StudentReportModal
            student={selectedStudentForReport}
            soundEnabled={soundEnabled}
            onClose={() => setSelectedStudentForReport(null)}
          />
        )}
      </AnimatePresence>

      {/* 🏆 STUDENT CERTIFICATE MODAL */}
      {selectedStudentForCertificate && (
        <CertificateModal
          isOpen={!!selectedStudentForCertificate}
          student={selectedStudentForCertificate}
          studentName={selectedStudentForCertificate.nama}
          studentClass={selectedStudentForCertificate.kelas}
          completedChallenges={selectedStudentForCertificate.progress?.completedChallenges || 0}
          earnedStars={selectedStudentForCertificate.progress?.earnedStars || 0}
          soundEnabled={soundEnabled}
          issueDate={selectedStudentForCertificate.progress?.certificateDate}
          onClose={() => setSelectedStudentForCertificate(null)}
        />
      )}
    </div>
  );
};


// ==========================================
// 👤 INDIVIDUAL STUDENT DASHBOARD MODAL VIEW
// ==========================================
interface StudentDetailModalProps {
  student: StudentProfile;
  soundEnabled: boolean;
  onClose: () => void;
  onOpenReport: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  soundEnabled,
  onClose,
  onOpenReport,
}) => {
  const stars = student.progress?.earnedStars || 0;
  const completed = student.progress?.completedChallenges || 0;
  const tp = calculateStudentTP(stars, completed);
  const status = calculateStudentStatus(tp, completed);
  const gameDetails = student.progress?.gameDetails || {};
  const hasCertificate = student.progress?.certificateEarned ?? completed >= 9;

  const arenaStars = gameDetails.arena_pecahan?.earnedStars ?? Math.round((completed / 9) * 3);
  const dapurStars = gameDetails.dapur_pecahan?.earnedStars ?? Math.round((completed / 9) * 3);
  const pixelStars = gameDetails.dunia_pixel?.earnedStars ?? Math.round((completed / 9) * 3);

  const analysis = analyzeStudentLearning(student);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto font-rounded">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#FFF8E8] text-[#3c4233] rounded-3xl shadow-2xl border-2 border-stone-300 p-5 sm:p-6 max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-300/80 shrink-0">
          <div>
            <span className="text-[10px] font-black tracking-widest text-stone-500 uppercase block">
              PROFIL MURID
            </span>
            <h2 className="font-serif-title font-black text-xl text-[#3c4233]">
              {student.nama}
            </h2>
            <p className="text-xs font-bold text-amber-800">
              Kelas {student.kelas}
            </p>
          </div>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Main Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">BINTANG</p>
              <p className="text-xl font-black text-amber-700 mt-0.5">⭐ {stars} / 27</p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">CABARAN</p>
              <p className="text-xl font-black text-emerald-800 mt-0.5">🎯 {completed} / 9</p>
            </div>
          </div>

          {/* 3 Game Worlds Progress Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <p className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
              KEMAJUAN DUNIA PERMAINAN
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <p className="font-black text-base">🏟️</p>
                <p className="font-bold text-[11px] text-[#3c4233] leading-tight">Arena Pecahan</p>
                <p className="font-black text-amber-800 text-xs">{arenaStars} / 3</p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <p className="font-black text-base">🍳</p>
                <p className="font-bold text-[11px] text-[#3c4233] leading-tight">Dapur Pecahan</p>
                <p className="font-black text-amber-800 text-xs">{dapurStars} / 3</p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <p className="font-black text-base">🌲</p>
                <p className="font-bold text-[11px] text-[#3c4233] leading-tight">Dunia Pixel</p>
                <p className="font-black text-amber-800 text-xs">{pixelStars} / 3</p>
              </div>
            </div>
          </div>

          {/* Status & Certificate Cards */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">TAHAP PENGUASAAN</p>
              <p className="text-base font-black text-blue-900 mt-1">🏆 {tp} ({status})</p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
              <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">SIJIL</p>
              <p className="text-base font-black text-emerald-800 mt-1">
                {hasCertificate ? '🏆 Diperoleh' : '🔒 Belum Diperoleh'}
              </p>
            </div>
          </div>

          {/* AI Pedagogical Note */}
          <div className="p-3.5 bg-amber-100/60 rounded-2xl border border-amber-200 text-xs text-stone-800 space-y-1">
            <span className="font-black text-[#3c4233] block">💡 Analisis AI Pedagogi:</span>
            <p className="text-stone-700 font-medium leading-relaxed">{analysis.tpRationale}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-300/80 flex items-center justify-between shrink-0 gap-2">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onOpenReport();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 cursor-pointer border border-[#3c4233]/20 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Laporan</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-black text-xs cursor-pointer shadow-xs"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// ==========================================
// 🤖 AI LEARNING ANALYSIS VIEW COMPONENT
// ==========================================
interface AILearningAnalysisViewProps {
  student: StudentProfile;
  soundEnabled: boolean;
}

const AILearningAnalysisView: React.FC<AILearningAnalysisViewProps> = ({ student }) => {
  const analysis: AILearningAnalysisResult = analyzeStudentLearning(student);

  return (
    <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4 font-rounded">
      {/* Student Profile Overview Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif-title font-black text-lg text-[#3c4233]">{student.nama}</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#3c4233] text-[#F4C95D] text-xs font-bold">
              {student.kelas}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Tarikh Analisis AI: {analysis.dateAnalyzed}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Cadangan TP AI</p>
            <p className="text-xl font-black text-blue-900 font-mono">{analysis.suggestedTP}</p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
            Ketepatan Jawapan: {analysis.accuracyRate}%
          </div>
        </div>
      </div>

      {/* DSKP Skill Mapping Breakdown */}
      <div className="space-y-2">
        <h4 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#3c4233]" />
          <span>Pemetaan Kemahiran DSKP 2.1 (Pecahan Tahun 4)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {analysis.skills.map((item, idx) => {
            let statusColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            if (item.status === 'Perlukan Bimbingan') {
              statusColor = 'bg-[#D98262]/20 text-[#D98262] border-[#D98262]/40';
            } else if (item.status === 'Sedang Berkembang') {
              statusColor = 'bg-amber-100 text-amber-900 border-amber-300';
            }

            return (
              <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#3c4233]">{item.dskpCode} - {item.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${statusColor}`}>
                    {item.status} ({item.percentage}%)
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Misconceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Strengths */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
          <h5 className="font-bold text-emerald-950 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Kemahiran yang Dikuasai</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 text-emerald-900 font-medium">
            {analysis.masteredSkills.length > 0 ? (
              analysis.masteredSkills.map((k, i) => <li key={i}>{k}</li>)
            ) : (
              <li className="italic text-gray-500">Masih dalam proses pemantapan.</li>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <h5 className="font-bold text-amber-950 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Aspek yang Perlu Perhatian & Bimbingan</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 text-amber-900 font-medium">
            {analysis.attentionNeededSummary.length > 0 ? (
              analysis.attentionNeededSummary.map((m, i) => <li key={i}>{m}</li>)
            ) : (
              <li className="italic text-emerald-700">Tiada isu ketara dikesan.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Remediation & Enrichment */}
      <div className="p-4 bg-[#3c4233] text-white rounded-2xl space-y-2 shadow-sm">
        <h5 className="font-serif-title font-bold text-sm text-[#F4C95D] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F4C95D]" />
          <span>Cadangan Tindakan Intervensi Pedagogi AI</span>
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-stone-100 font-medium leading-relaxed">
            <span className="font-black text-[#F4C95D] block mb-0.5">💡 Cadangan Pemulihan:</span>
            <ul className="list-disc list-inside space-y-1">
              {analysis.remediationAdvice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-stone-100 font-medium leading-relaxed">
            <span className="font-black text-[#F4C95D] block mb-0.5">🌟 Cadangan Pengayaan:</span>
            <ul className="list-disc list-inside space-y-1">
              {analysis.enrichmentAdvice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Rationale Conclusion */}
      <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-800 font-medium leading-relaxed">
        <span className="font-black text-[#3c4233]">Rumusan Justifikasi TP AI: </span>
        {analysis.tpRationale}
      </div>
    </div>
  );
};
