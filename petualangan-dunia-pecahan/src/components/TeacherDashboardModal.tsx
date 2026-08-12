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
    const status = calculateStudentStatus(tp);

    const matchesStatus = selectedStatus === 'semua' || status === selectedStatus;
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
  const avgClassStars = totalClassStudents > 0 ? (totalClassStarsEarned / totalClassStudents).toFixed(1) : '0';

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
    return calculateStudentStatus(tp) === 'Perlukan Bimbingan';
  }).length;

  // Pie Chart Breakdown Counts
  const menguasaiCount = classStudents.filter((s) => {
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, s.progress?.completedChallenges || 0);
    return calculateStudentStatus(tp) === 'Menguasai';
  }).length;

  const berkembangCount = classStudents.filter((s) => {
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, s.progress?.completedChallenges || 0);
    return calculateStudentStatus(tp) === 'Sedang Berkembang';
  }).length;

  const bimbinganCount = classStudents.filter((s) => {
    const tp = calculateStudentTP(s.progress?.earnedStars || 0, s.progress?.completedChallenges || 0);
    return calculateStudentStatus(tp) === 'Perlukan Bimbingan';
  }).length;

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

  // Student Performance Bar Chart Data
  const studentScoreItems = classStudents.map((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    const status = calculateStudentStatus(tp);
    const scorePct = Math.round((stars / 27) * 100);
    return {
      id: s.id,
      name: s.nama,
      kelas: s.kelas,
      scorePct,
      tp,
      status,
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
      const status = calculateStudentStatus(tp);
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#3c4233]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3c4233] text-[#F4C95D] flex items-center justify-center shadow-md shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-title text-2xl font-black text-[#3c4233]">
                  Dashboard Guru
                </h1>
                <span className="bg-[#3c4233] text-[#F4C95D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#F4C95D]/40 uppercase tracking-wider">
                  PEMBELAJARAN DSKP 2.1
                </span>
              </div>
              <p className="text-xs text-[#566246] font-semibold">
                Pantau perkembangan pembelajaran murid dengan mudah.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 transition-all shadow-sm border border-[#3c4233]/20 cursor-pointer"
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
              className="px-3 py-2 rounded-xl bg-[#D98262]/20 hover:bg-[#D98262]/30 text-[#D98262] border border-[#D98262]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
              className="w-9 h-9 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🏫 PEMILIHAN KELAS BAR */}
        <div className="my-3 bg-white p-3 rounded-2xl border border-[#3c4233]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 font-bold text-xs">
            <span className="text-sm">🏫</span>
            <span className="text-[#3c4233] font-black">Pilih Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                playSfx('click', soundEnabled);
                setSelectedClass(e.target.value);
              }}
              className="bg-[#FFF8E8] text-[#3c4233] font-black px-3 py-1.5 rounded-xl border-2 border-[#3c4233]/20 focus:outline-none cursor-pointer text-xs"
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
            <span className="text-gray-500">Analisis semasa:</span>
            <span className="px-3 py-1 rounded-xl bg-[#3c4233] text-[#F4C95D] font-extrabold shadow-2xs">
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

        {/* 🧭 TOP NAVIGATION TABS (PART 2 MANDATE) */}
        <div className="flex items-center gap-1.5 bg-amber-100/90 p-1 rounded-2xl mb-3 overflow-x-auto shrink-0 border border-amber-200">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('summary');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'summary'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-md ring-1 ring-[#F4C95D]'
                : 'text-[#3c4233] hover:bg-amber-200/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>🏠 Ringkasan</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('roster');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'roster'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-md ring-1 ring-[#F4C95D]'
                : 'text-[#3c4233] hover:bg-amber-200/60'
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
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'progress_charts'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-md ring-1 ring-[#F4C95D]'
                : 'text-[#3c4233] hover:bg-amber-200/60'
            }`}
          >
            <PieIcon className="w-4 h-4" />
            <span>📊 Kemajuan Murid</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('ai_analysis');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'ai_analysis'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-md ring-1 ring-[#F4C95D]'
                : 'text-[#3c4233] hover:bg-amber-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F4C95D]" />
            <span>🤖 Analisis AI</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              setActiveTab('reports');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'reports'
                ? 'bg-[#3c4233] text-[#F4C95D] shadow-md ring-1 ring-[#F4C95D]'
                : 'text-[#3c4233] hover:bg-amber-200/60'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>📄 Laporan</span>
          </button>
        </div>

        {/* 📊 HALAMAN RINGKASAN KELAS SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 mb-3 shrink-0">
          {/* Kad 1: Jumlah Murid */}
          <div className="p-3 rounded-2xl bg-white border border-[#3c4233]/15 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3c4233]/10 text-[#3c4233] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Jumlah Murid</p>
              <p className="text-lg font-black text-[#3c4233]">{totalClassStudents} orang</p>
            </div>
          </div>

          {/* Kad 2: Telah Bermain */}
          <div className="p-3 rounded-2xl bg-white border border-emerald-200 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Telah Bermain</p>
              <p className="text-lg font-black text-emerald-800">{totalClassPlayed} orang</p>
            </div>
          </div>

          {/* Kad 3: Purata Bintang */}
          <div className="p-3 rounded-2xl bg-white border border-[#F4C95D] shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4C95D]/20 text-[#3c4233] flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-[#F4C95D] text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Purata Bintang</p>
              <p className="text-lg font-black text-[#3c4233]">{avgClassStars} <span className="text-[10px] text-gray-500">/ 27</span></p>
            </div>
          </div>

          {/* Kad 4: Purata Kemajuan */}
          <div className="p-3 rounded-2xl bg-white border border-amber-300 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Purata Kemajuan</p>
              <p className="text-lg font-black text-amber-900">{avgClassProgressPct}%</p>
            </div>
          </div>

          {/* Kad 5: Purata Penguasaan */}
          <div className="p-3 rounded-2xl bg-white border border-blue-200 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-extrabold">Purata TP</p>
              <p className="text-lg font-black text-blue-900">{avgClassTP}</p>
            </div>
          </div>

          {/* Kad 6: Perlukan Bimbingan */}
          <div className="p-3 rounded-2xl bg-white border border-[#D98262]/40 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D98262]/20 text-[#D98262] flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#D98262] font-bold uppercase">Bimbingan</p>
              <p className="text-lg font-black text-[#D98262]">{classNeedsSupportCount} murid</p>
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
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                  <AlertCircle className="w-10 h-10 text-[#D98262] mx-auto mb-2" />
                  <p className="font-black text-base text-[#3c4233]">Belum ada data murid untuk kelas ini.</p>
                  <p className="text-xs text-gray-500">Sila pilih kelas lain daripada menu Pemilihan Kelas di atas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Card 1: Status Kemajuan Murid Pie Chart */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-2">
                      <span>🥧 Status Kemajuan Murid</span>
                    </h3>
                    <PieChartStatus
                      menguasaiCount={menguasaiCount}
                      berkembangCount={berkembangCount}
                      bimbinganCount={bimbinganCount}
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
                      <span className="text-gray-500 text-[11px]">Status:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="semua">Semua Status</option>
                        <option value="Menguasai">Menguasai</option>
                        <option value="Sedang Berkembang">Sedang Berkembang</option>
                        <option value="Perlukan Bimbingan">Perlukan Bimbingan</option>
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

              {/* Roster Table */}
              {filteredStudents.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#D98262] mx-auto" />
                  <p className="font-bold text-sm text-[#3c4233]">Tiada rekod murid dijumpai.</p>
                  <p className="text-xs text-gray-500">Sila laraskan pilihan carian atau penapis.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#3c4233]/20 bg-white shadow-xs">
                  <table className="w-full text-left border-collapse text-xs font-medium">
                    <thead>
                      <tr className="bg-[#3c4233] text-[#F4C95D] font-extrabold border-b border-[#2d3226]">
                        <th className="p-3.5">Nama</th>
                        <th className="p-3.5">Kelas</th>
                        <th className="p-3.5 text-center">Kemajuan</th>
                        <th className="p-3.5 text-center">⭐ Bintang</th>
                        <th className="p-3.5 text-center">Penguasaan</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-center">🏆 Sijil</th>
                        <th className="p-3.5 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {filteredStudents.map((s) => {
                        const stars = s.progress?.earnedStars || 0;
                        const completed = s.progress?.completedChallenges || 0;
                        const tp = calculateStudentTP(stars, completed);
                        const status = calculateStudentStatus(tp);
                        const hasCertificate = completed >= 9;

                        let statusBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                        if (status === 'Sedang Berkembang') {
                          statusBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                        } else if (status === 'Perlukan Bimbingan') {
                          statusBadgeClass = 'bg-[#D98262]/20 text-[#D98262] border-[#D98262]/40';
                        }

                        return (
                          <tr key={s.id} className="hover:bg-amber-50/80 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-[#3c4233] text-sm">{s.nama}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{s.id}</p>
                            </td>
                            <td className="p-3.5 font-bold text-gray-700">{s.kelas}</td>
                            <td className="p-3.5 text-center font-bold">
                              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-mono border border-stone-200">
                                {completed} / 9
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-bold text-amber-700 font-mono">
                              ⭐ {stars} / 27
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-black font-mono border border-blue-300">
                                {tp}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${statusBadgeClass}`}>
                                {status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {hasCertificate ? (
                                <button
                                  onClick={() => {
                                    playSfx('fanfare', soundEnabled);
                                    setSelectedStudentForCertificate(s);
                                  }}
                                  className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] hover:bg-amber-200 cursor-pointer flex items-center gap-1 mx-auto shadow-xs"
                                  title="Lihat Sijil Pencapaian Murid Ini"
                                >
                                  <span>🏆 Layak</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-400 border border-stone-200 font-medium text-[11px]">
                                  🔒 Belum
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  playSfx('click', soundEnabled);
                                  setSelectedStudentForDetail(s);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#3c4233] text-[#F4C95D] font-bold text-[11px] hover:bg-[#2d3226] cursor-pointer"
                              >
                                👁️ Dashboard
                              </button>

                              <button
                                onClick={() => {
                                  playSfx('click', soundEnabled);
                                  setSelectedAIStudentId(s.id);
                                  setActiveTab('ai_analysis');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#F4C95D] text-[#3c4233] font-black text-[11px] hover:bg-[#e5b73e] cursor-pointer"
                              >
                                🤖 AI Analisis
                              </button>

                              <button
                                onClick={() => {
                                  playSfx('click', soundEnabled);
                                  setSelectedStudentForReport(s);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-extrabold text-[11px] hover:bg-blue-200 cursor-pointer"
                              >
                                📄 Laporan
                              </button>
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
                <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                  <AlertCircle className="w-10 h-10 text-[#D98262] mx-auto mb-2" />
                  <p className="font-black text-base text-[#3c4233]">📊 Belum ada data yang mencukupi untuk menghasilkan carta.</p>
                  <p className="text-xs text-gray-500">Sila pilih kelas yang mempunyai murid terdaftar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Chart 1: Carta Pai Status Penguasaan Murid */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>🥧 Status Penguasaan Murid</span>
                      <span className="text-[10px] text-gray-400 font-mono">Carta Pai</span>
                    </h3>
                    <PieChartStatus
                      menguasaiCount={menguasaiCount}
                      berkembangCount={berkembangCount}
                      bimbinganCount={bimbinganCount}
                      totalStudents={totalClassStudents}
                    />
                  </div>

                  {/* Chart 2: Graf Bar Prestasi Setiap Murid */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>📊 Prestasi Murid dalam Kelas</span>
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

                  {/* Chart 3: Graf Bar Prestasi Mengikut Kemahiran */}
                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center justify-between">
                      <span>📊 Prestasi Mengikut Kemahiran Pecahan</span>
                      <span className="text-[10px] text-gray-400 font-mono">DSKP 2.1</span>
                    </h3>
                    <SkillBarChart skills={skillList} />
                  </div>

                  {/* Chart 4: Carta Garis Perkembangan Kemajuan */}
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
                    {students.map((s) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStudents.map((s) => {
                  const stars = s.progress?.earnedStars || 0;
                  const completed = s.progress?.completedChallenges || 0;
                  const tp = calculateStudentTP(stars, completed);
                  const status = calculateStudentStatus(tp);

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
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-3 border-t-2 border-[#3c4233]/20 flex justify-between items-center shrink-0 text-xs font-bold">
          <button
            onClick={() => {
              if (window.confirm('Set semula data demo ke keadaan asal?')) {
                resetAllData();
                showToast('Data telah diset semula! 🔄');
                setTimeout(() => window.location.reload(), 600);
              }
            }}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula Data Demo</span>
          </button>

          <p className="text-gray-400 text-[11px] hidden sm:block">
            Modul Dashboard Guru • Aplikasi Permainan Matematik Pecahan
          </p>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-2xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-black text-xs cursor-pointer shadow-md"
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
  const status = calculateStudentStatus(tp);
  const gameDetails = student.progress?.gameDetails || {};
  const attempts = student.progress?.attemptHistory || [];

  const analysis = analyzeStudentLearning(student);

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto font-rounded">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#FFF8E8] text-[#3c4233] rounded-3xl shadow-2xl border-4 border-[#3c4233] p-4 sm:p-6 max-h-[92vh] flex flex-col overflow-hidden space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#3c4233]/20 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] uppercase">
                {student.kelas}
              </span>
              <h2 className="font-serif-title font-black text-xl text-[#3c4233]">
                Dashboard Kemajuan {student.nama}
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-semibold">
              ID: {student.id} • Tarikh Daftar: {new Date(student.tarikhDaftar).toLocaleDateString('ms-MY')}
            </p>
          </div>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Key Metrics Header Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Bintang</p>
              <p className="text-base font-black text-amber-700">⭐ {stars} / 27</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Cabaran</p>
              <p className="text-base font-black text-emerald-800">🎮 {completed} / 9</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Skor %</p>
              <p className="text-base font-black text-[#3c4233]">{Math.round((stars / 27) * 100)}%</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Hint</p>
              <p className="text-base font-black text-blue-800">💡 {student.progress?.totalHintsUsed || 0}</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Masa</p>
              <p className="text-base font-black text-purple-800">⏱️ {student.progress?.totalPlayTimeMinutes || 0}m</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-300 text-center relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-blue-600 text-white font-black text-[8px] rounded uppercase">
                Cadangan AI
              </span>
              <p className="text-[10px] text-blue-700 font-extrabold uppercase mt-1">Penguasaan</p>
              <p className="text-lg font-black text-blue-900">{tp}</p>
            </div>
          </div>

          {/* Individual Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Pie Chart Kemahiran Individu */}
            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2">
              <h3 className="font-serif-title font-bold text-xs text-[#3c4233]">
                🥧 Taburan Kemahiran Individu
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span>Penambahan Pecahan:</span>
                  <span className="font-mono font-bold text-emerald-800">85%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-[85%]" />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span>Penolakan Pecahan:</span>
                  <span className="font-mono font-bold text-amber-800">70%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[70%]" />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span>Nombor Bercampur & Tak Wajar:</span>
                  <span className="font-mono font-bold text-blue-800">60%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[60%]" />
                </div>
              </div>
            </div>

            {/* AI Pedagogical Summary */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="font-serif-title font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3c4233]" />
                <span>Analisis AI Ringkas untuk Guru</span>
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                {analysis.tpRationale}
              </p>
              {analysis.remediationAdvice.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60 text-[11px] font-bold text-amber-950">
                  💡 Intervensi Cadangan: {analysis.remediationAdvice[0]}
                </div>
              )}
            </div>
          </div>

          {/* Game Detail Breakdown */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-serif-title font-bold text-xs text-[#3c4233]">
              🎮 Prestasi Mengikut Dunia Permainan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <p className="font-black text-[#3c4233]">🏃 Arena Pecahan</p>
                <p className="text-[11px] text-gray-500">
                  Stars: ⭐ {gameDetails.arena_pecahan?.earnedStars || 0}/9 • Score: {gameDetails.arena_pecahan?.scorePercentage || 0}%
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <p className="font-black text-[#3c4233]">🍳 Dapur Pecahan</p>
                <p className="text-[11px] text-gray-500">
                  Stars: ⭐ {gameDetails.dapur_pecahan?.earnedStars || 0}/9 • Score: {gameDetails.dapur_pecahan?.scorePercentage || 0}%
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#D98262]/10 border border-[#D98262]/30 space-y-1">
                <p className="font-black text-[#3c4233]">🌈 Dunia Pixel</p>
                <p className="text-[11px] text-gray-500">
                  Stars: ⭐ {gameDetails.dunia_pixel?.earnedStars || 0}/9 • Score: {gameDetails.dunia_pixel?.scorePercentage || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#3c4233]/20 flex justify-between items-center shrink-0">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onOpenReport();
            }}
            className="px-4 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 cursor-pointer border border-[#3c4233]/20 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Pembelajaran</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-2xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-black text-xs cursor-pointer"
          >
            Tutup Perincian
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
