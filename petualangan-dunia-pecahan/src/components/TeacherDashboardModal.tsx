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
} from 'lucide-react';
import { StudentProfile, AttemptRecord } from '../types';
import {
  getAllStudents,
  getAllSessions,
  setTeacherAuth,
  resetAllData,
  calculateStudentTP,
  calculateStudentStatus,
} from '../utils/studentSessionManager';
import { analyzeStudentLearning, AILearningAnalysisResult } from '../utils/aiLearningAnalytics';
import { playSfx } from '../utils/audio';
import { StudentReportModal } from './StudentReportModal';

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
  const [activeTab, setActiveTab] = useState<'roster' | 'sessions' | 'ai_analysis'>('roster');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentProfile | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentProfile | null>(null);
  const [selectedAIStudentId, setSelectedAIStudentId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const students = getAllStudents();
  const sessions = getAllSessions();

  // Distinct list of classes for filter dropdown
  const availableClasses = Array.from(new Set(students.map((s) => s.kelas))).filter(Boolean);

  // Filtering Logic
  const filteredStudents = students.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    const status = calculateStudentStatus(tp);

    const matchesClass = selectedClass === 'semua' || s.kelas === selectedClass;
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

    return matchesClass && matchesStatus && matchesTP && matchesProgress && matchesSearch;
  });

  const filteredSessions = sessions.filter((s) => {
    const matchesClass = selectedClass === 'semua' || s.kelas === selectedClass;
    const matchesSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Selected Student for AI Analysis Tab
  const activeAIStudent = students.find((s) => s.id === selectedAIStudentId) || students[0];

  // Calculate Overview Stats across ALL students
  const totalStudents = students.length;
  const totalPlayed = students.filter((s) => (s.progress?.completedChallenges || 0) > 0).length;

  const totalStarsEarned = students.reduce(
    (sum, s) => sum + (s.progress?.earnedStars || 0),
    0
  );
  const avgStars = totalStudents > 0 ? (totalStarsEarned / totalStudents).toFixed(1) : '0';

  // Calculate Average TP
  const tpLevels = students.map((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    return parseInt(calculateStudentTP(stars, completed).replace('TP', ''), 10);
  });
  const avgTpNum = tpLevels.length > 0 ? Math.round(tpLevels.reduce((a, b) => a + b, 0) / tpLevels.length) : 1;
  const avgTP = `TP${avgTpNum}`;

  // Count Needs Support (Perlukan Bimbingan)
  const needsSupportCount = students.filter((s) => {
    const stars = s.progress?.earnedStars || 0;
    const completed = s.progress?.completedChallenges || 0;
    const tp = calculateStudentTP(stars, completed);
    return calculateStudentStatus(tp) === 'Perlukan Bimbingan';
  }).length;

  // Quick Preset Filter Toggle
  const isNeedsSupportActive = selectedStatus === 'Perlukan Bimbingan';
  const toggleNeedsSupportFilter = () => {
    playSfx('click', soundEnabled);
    if (isNeedsSupportActive) {
      setSelectedStatus('semua');
    } else {
      setSelectedStatus('Perlukan Bimbingan');
    }
  };

  // Handle CSV Export
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

  // Handle Reset Data
  const handleReset = () => {
    if (window.confirm('Adakah anda pasti mahu mengeset semula data demo? Ini akan menyegarkan data murid ke keadaan asal.')) {
      resetAllData();
      showToast('Data telah diset semula secara berjaya!');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto font-rounded">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl bg-[#FFF8E8] text-[#3c4233] rounded-3xl shadow-2xl border-4 border-[#3c4233] p-4 sm:p-6 max-h-[95vh] flex flex-col overflow-hidden"
      >
        {/* TOP HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#3c4233]/20 shrink-0">
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
                  DEDIKASI KSSR
                </span>
              </div>
              <p className="text-xs text-[#566246] font-semibold">
                Pantau perkembangan pembelajaran murid & analisis AI pedagogi.
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
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

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="my-2 p-2.5 rounded-xl bg-[#3c4233] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2 shrink-0 border border-[#F4C95D]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F4C95D]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📊 HALAMAN UTAMA: KAD STATISTIK */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 my-3 shrink-0">
          {/* Kad 1: Jumlah Murid */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#3c4233]/15 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3c4233]/10 text-[#3c4233] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">👩🎓 Jumlah Murid</p>
              <p className="text-xl font-black text-[#3c4233]">{totalStudents} <span className="text-xs font-medium text-gray-500">orang</span></p>
            </div>
          </div>

          {/* Kad 2: Telah Bermain */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">🎮 Telah Bermain</p>
              <p className="text-xl font-black text-emerald-800">{totalPlayed} <span className="text-xs font-medium text-gray-500">orang</span></p>
            </div>
          </div>

          {/* Kad 3: Purata Bintang */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#F4C95D] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4C95D]/20 text-[#3c4233] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-[#F4C95D] text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">⭐ Purata Bintang</p>
              <p className="text-xl font-black text-[#3c4233]">{avgStars} <span className="text-xs font-medium text-gray-500">/ 27</span></p>
            </div>
          </div>

          {/* Kad 4: Purata Penguasaan */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-blue-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-extrabold">📚 Purata Penguasaan</p>
              <p className="text-xl font-black text-blue-900">{avgTP}</p>
            </div>
          </div>

          {/* Kad 5: Perlukan Bimbingan */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#D98262]/40 shadow-sm flex items-center gap-3 col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-[#D98262]/20 text-[#D98262] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#D98262] font-bold uppercase tracking-wider">⚠️ Perlukan Bimbingan</p>
              <p className="text-xl font-black text-[#D98262]">{needsSupportCount} <span className="text-xs font-medium text-gray-500">orang</span></p>
            </div>
          </div>
        </div>

        {/* 🔎 CARI & TAPIS BAR */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-[#3c4233]/15 shadow-sm mb-3 space-y-2.5 shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Search Input */}
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

            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto text-xs font-bold">
              {/* Filter Kelas */}
              <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-[#3c4233]/20">
                <span className="text-gray-500 text-[11px]">Kelas:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="semua">Semua Kelas ({students.length})</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-[#3c4233]/20">
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

              {/* Filter Tahap Penguasaan */}
              <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-[#3c4233]/20">
                <span className="text-gray-500 text-[11px]">TP:</span>
                <select
                  value={selectedTP}
                  onChange={(e) => setSelectedTP(e.target.value)}
                  className="bg-transparent text-[#3c4233] font-bold focus:outline-none cursor-pointer"
                >
                  <option value="semua">Semua TP</option>
                  <option value="TP5">TP5</option>
                  <option value="TP4">TP4</option>
                  <option value="TP3">TP3</option>
                  <option value="TP2">TP2</option>
                  <option value="TP1">TP1</option>
                </select>
              </div>

              {/* Filter Kemajuan */}
              <div className="flex items-center gap-1 bg-[#FFF8E8] px-2.5 py-1 rounded-xl border border-[#3c4233]/20">
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

          {/* Preset Quick Filter Toggle Button */}
          <div className="flex items-center justify-between border-t border-[#3c4233]/10 pt-2 text-xs">
            <button
              onClick={toggleNeedsSupportFilter}
              className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isNeedsSupportActive
                  ? 'bg-[#D98262] text-white shadow-sm ring-2 ring-[#D98262]'
                  : 'bg-[#D98262]/15 text-[#D98262] hover:bg-[#D98262]/25'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Paparkan murid yang memerlukan bimbingan ({needsSupportCount})</span>
            </button>

            <div className="flex items-center gap-1 bg-amber-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('roster')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                    : 'text-[#3c4233] hover:bg-amber-200/60'
                }`}
              >
                👥 Senarai Murid
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'sessions'
                    ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                    : 'text-[#3c4233] hover:bg-amber-200/60'
                }`}
              >
                📜 Log Sesi
              </button>
              <button
                onClick={() => setActiveTab('ai_analysis')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ai_analysis'
                    ? 'bg-[#3c4233] text-[#F4C95D] shadow-sm'
                    : 'text-[#3c4233] hover:bg-amber-200/60'
                }`}
              >
                🤖 AI Analisis Pembelajaran
              </button>
            </div>
          </div>
        </div>

        {/* 👥 SENARAI MURID (TABLE / ROSTER VIEW) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'roster' && (
            <div>
              {filteredStudents.length === 0 ? (
                <div className="p-10 text-center bg-white/80 rounded-2xl border border-amber-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#D98262] mx-auto" />
                  <p className="font-bold text-sm text-[#3c4233]">Tiada rekod murid dijumpai.</p>
                  <p className="text-xs text-gray-500">Sila laraskan pilihan carian atau penapis.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-[#3c4233]/20 bg-white shadow-sm">
                  <table className="w-full text-left border-collapse text-xs font-medium">
                    <thead>
                      <tr className="bg-[#3c4233] text-[#F4C95D] font-extrabold border-b border-[#2d3226]">
                        <th className="p-3.5">Nama</th>
                        <th className="p-3.5">Kelas</th>
                        <th className="p-3.5 text-center">Kemajuan</th>
                        <th className="p-3.5 text-center">⭐ Bintang</th>
                        <th className="p-3.5 text-center">Penguasaan</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {filteredStudents.map((s) => {
                        const stars = s.progress?.earnedStars || 0;
                        const completed = s.progress?.completedChallenges || 0;
                        const tp = calculateStudentTP(stars, completed);
                        const status = calculateStudentStatus(tp);

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
                              <span className="inline-flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                                {completed} / 9
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-bold text-amber-700">
                              <span className="inline-flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                                <Star className="w-3.5 h-3.5 fill-[#F4C95D] text-amber-600" />
                                {stars} / 27
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-bold">
                              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-200 font-black">
                                {tp}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusBadgeClass}`}>
                                {status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    playSfx('click', soundEnabled);
                                    setSelectedStudentForDetail(s);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>Lihat Prestasi</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    playSfx('click', soundEnabled);
                                    setSelectedStudentForReport(s);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1 border border-[#3c4233]/20"
                                  title="Jana Laporan AI PDF / Cetak"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-[#3c4233]" />
                                  <span>📄 Laporan AI</span>
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

          {/* 📜 LOG SESI */}
          {activeTab === 'sessions' && (
            <div className="overflow-x-auto rounded-2xl border border-[#3c4233]/20 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs font-medium">
                <thead>
                  <tr className="bg-[#3c4233] text-[#F4C95D] font-extrabold border-b border-[#2d3226]">
                    <th className="p-3.5">ID Sesi</th>
                    <th className="p-3.5">ID Murid</th>
                    <th className="p-3.5">Nama Murid</th>
                    <th className="p-3.5">Kelas</th>
                    <th className="p-3.5">Tarikh</th>
                    <th className="p-3.5">Masa Mula</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filteredSessions.map((ses) => (
                    <tr key={ses.sessionId} className="hover:bg-amber-50/80 transition-colors">
                      <td className="p-3.5 font-mono text-gray-500 font-bold">{ses.sessionId}</td>
                      <td className="p-3.5 font-mono text-[#3c4233] font-bold">{ses.studentId}</td>
                      <td className="p-3.5 font-bold text-[#3c4233]">{ses.nama}</td>
                      <td className="p-3.5">{ses.kelas}</td>
                      <td className="p-3.5">{ses.tarikh}</td>
                      <td className="p-3.5">{ses.masaMula}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Direkodkan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🤖 LAPORAN AI ANALISIS PEMBELAJARAN (TEACHER ASSISTANT) */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-4">
              {/* Student AI Selector Bar */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#3c4233]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#3c4233] text-[#F4C95D] flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#F4C95D]" />
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-[#3c4233]">
                      Pembantu AI Analisis Pembelajaran Guru
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Analisis pedagogi terperinci mengikut DSKP 2.1 KSSR Matematik Tahun 4
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-bold text-gray-600">Pilih Murid:</span>
                  <select
                    value={activeAIStudent?.id || ''}
                    onChange={(e) => setSelectedAIStudentId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FFF8E8] border border-[#3c4233]/30 text-xs font-bold text-[#3c4233] focus:outline-none cursor-pointer flex-1 md:flex-none"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.nama} ({st.kelas})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      if (activeAIStudent) setSelectedStudentForReport(activeAIStudent);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#F4C95D]" />
                    <span>Jana Laporan Rasmi</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Student AI Analysis View */}
              {activeAIStudent && (
                <StudentAIAnalysisDisplay student={activeAIStudent} soundEnabled={soundEnabled} />
              )}
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-3 pt-3 border-t border-[#3c4233]/20 flex items-center justify-between gap-3 text-xs shrink-0">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula Data Demo</span>
          </button>

          <p className="text-gray-500 font-semibold hidden sm:block">
            Modul Dashboard Guru • Wira Pecahan KSSR
          </p>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold transition-all cursor-pointer"
          >
            Tutup Dashboard 🎮
          </button>
        </div>

        {/* 👤 PRESTASI INDIVIDU (INDIVIDUAL STUDENT DETAIL MODAL) */}
        <AnimatePresence>
          {selectedStudentForDetail && (
            <StudentIndividualDetailModal
              student={selectedStudentForDetail}
              soundEnabled={soundEnabled}
              onClose={() => setSelectedStudentForDetail(null)}
              onOpenReport={() => {
                const target = selectedStudentForDetail;
                setSelectedStudentForDetail(null);
                setSelectedStudentForReport(target);
              }}
            />
          )}
        </AnimatePresence>

        {/* 📄 STUDENT PRINTABLE REPORT MODAL */}
        <AnimatePresence>
          {selectedStudentForReport && (
            <StudentReportModal
              student={selectedStudentForReport}
              soundEnabled={soundEnabled}
              onClose={() => setSelectedStudentForReport(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// COMPONENT TO RENDER LIVE STUDENT AI ANALYSIS INSIDE DASHBOARD TAB
const StudentAIAnalysisDisplay: React.FC<{ student: StudentProfile; soundEnabled: boolean }> = ({
  student,
  soundEnabled,
}) => {
  const analysis: AILearningAnalysisResult = analyzeStudentLearning(student);

  if (!analysis.isSufficient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border-2 border-amber-300 space-y-3 font-rounded">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
        <p className="font-bold text-base text-[#3c4233]">Data Belum Mencukupi untuk AI Analysis</p>
        <p className="text-xs text-gray-600 max-w-md mx-auto">{analysis.insufficiencyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-rounded">
      {/* Overview AI Header Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3c4233] to-[#2d3226] text-white border-2 border-[#F4C95D] shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold font-mono bg-[#F4C95D] text-[#3c4233] px-2 py-0.5 rounded">
              Analisis Individu: {student.id}
            </span>
            <h2 className="text-xl font-bold text-[#F4C95D] mt-1">{student.nama} ({student.kelas})</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-200 font-bold">Cadangan AI:</span>
            <span className="px-3 py-1 rounded-xl bg-[#F4C95D] text-[#3c4233] font-black text-sm border border-amber-300">
              {analysis.suggestedTP}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-200 font-medium italic bg-white/10 p-2.5 rounded-xl border border-stone-400/20">
          "{analysis.tpRationale}"
        </p>
      </div>

      {/* DSKP Skill Breakdown Cards */}
      <div className="p-4 rounded-2xl bg-white border border-[#3c4233]/15 shadow-sm space-y-3">
        <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#3c4233]" />
          <span>Analisis Kemahiran DSKP 2.1 (Matematik Tahun 4)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {analysis.skills.map((sk) => (
            <div key={sk.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3c4233]">{sk.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    sk.color === 'green'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : sk.color === 'yellow'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  {sk.status} ({sk.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-gray-500">{sk.description}</p>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    sk.color === 'green' ? 'bg-emerald-600' : sk.color === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sk.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rumusan Kekuatan & Perlu Perhatian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <p className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Kekuatan Murid (Rumusan AI):
          </p>
          <ul className="list-disc list-inside space-y-1 text-emerald-950 font-semibold">
            {analysis.strengthsSummary.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <p className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Perlu Diberi Perhatian:
          </p>
          <ul className="list-disc list-inside space-y-1 text-amber-950 font-semibold">
            {analysis.attentionNeededSummary.map((att, i) => (
              <li key={i}>{att}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cadangan Intervensi (Pemulihan & Pengayaan) */}
      <div className="p-4 rounded-2xl bg-white border border-[#3c4233]/15 shadow-sm space-y-3">
        <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#3c4233]" />
          <span>Cadangan Intervensi Guru (AI Insights)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 space-y-1.5">
            <p className="font-bold text-orange-900">🎯 Cadangan Pemulihan</p>
            <ul className="space-y-1 text-gray-700 font-semibold">
              {analysis.remediationAdvice.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
            <p className="font-bold text-blue-900">🌟 Cadangan Pengayaan</p>
            <ul className="space-y-1 text-gray-700 font-semibold">
              {analysis.enrichmentAdvice.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// 👤 COMPONENT FOR INDIVIDUAL STUDENT DETAIL MODAL
interface StudentIndividualDetailModalProps {
  student: StudentProfile;
  soundEnabled: boolean;
  onClose: () => void;
  onOpenReport: () => void;
}

const StudentIndividualDetailModal: React.FC<StudentIndividualDetailModalProps> = ({
  student,
  soundEnabled,
  onClose,
  onOpenReport,
}) => {
  const stars = student.progress?.earnedStars || 0;
  const completed = student.progress?.completedChallenges || 0;
  const tp = calculateStudentTP(stars, completed);
  const status = calculateStudentStatus(tp);

  const progressPercent = Math.min(100, Math.round((completed / 9) * 100));
  const totalHints = student.progress?.totalHintsUsed || 3;
  const totalPlayMinutes = student.progress?.totalPlayTimeMinutes || 24;

  const gameDetails = student.progress?.gameDetails || {
    arena_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 8 },
    dapur_pecahan: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 9 },
    dunia_pixel: { completedChallenges: 3, earnedStars: 9, scorePercentage: 100, percubaan: 3, hintUsed: 1, masaMinit: 7 },
  };

  const attempts: AttemptRecord[] = student.progress?.attemptHistory || [
    {
      id: 'ATT-DEMO-1',
      studentId: student.id,
      gameId: 'dapur_pecahan',
      challengeId: 'dapur-1',
      soalan: '1/4 + 2/4',
      jawapanMurid: '3/4',
      jawapanSebenar: '3/4',
      isCorrect: true,
      percubaan: 1,
      hintUsed: 0,
      masaSaat: 12,
      kemahiran: 'Penambahan Pecahan Penyebut Sama',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl bg-[#FFF8E8] text-[#3c4233] rounded-3xl p-5 sm:p-7 border-4 border-[#3c4233] shadow-2xl space-y-5 max-h-[92vh] flex flex-col overflow-hidden font-rounded"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#3c4233]/20 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-[#3c4233] text-[#F4C95D] px-2.5 py-0.5 rounded-md">
                {student.id}
              </span>
              <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                {student.kelas}
              </span>
              <span className="text-xs font-bold text-gray-500">
                Tarikh Permainan: {new Date(student.tarikhDaftar).toLocaleDateString('ms-MY')}
              </span>
            </div>
            <h2 className="font-serif-title text-2xl font-black text-[#3c4233] mt-1">
              Prestasi Individu: {student.nama}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenReport();
              }}
              className="px-3 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-[#3c4233]/20 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#3c4233]" />
              <span>Jana Laporan AI</span>
            </button>

            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* 📊 KEMAJUAN OVERVIEW SECTION */}
          <div className="bg-white p-4 rounded-2xl border border-[#3c4233]/15 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold uppercase text-gray-500">Kemajuan Pembelajaran Overall</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-48 sm:w-64 h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#3c4233] to-[#566246] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-sm text-[#3c4233]">{progressPercent}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-black text-xs border border-blue-200">
                  {tp}
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-xs border border-emerald-300">
                  {status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-100 text-xs font-bold">
              <div className="p-2.5 bg-[#FFF8E8] rounded-xl border border-amber-200">
                <p className="text-[10px] text-gray-500 uppercase">Bintang</p>
                <p className="text-base text-amber-800 font-black flex items-center gap-1">
                  ⭐ {stars} / 27
                </p>
              </div>

              <div className="p-2.5 bg-[#FFF8E8] rounded-xl border border-amber-200">
                <p className="text-[10px] text-gray-500 uppercase">Cabaran</p>
                <p className="text-base text-emerald-800 font-black flex items-center gap-1">
                  🏆 {completed} / 9
                </p>
              </div>

              <div className="p-2.5 bg-[#FFF8E8] rounded-xl border border-amber-200">
                <p className="text-[10px] text-gray-500 uppercase">Jumlah Hint</p>
                <p className="text-base text-blue-800 font-black flex items-center gap-1">
                  💡 {totalHints} hint
                </p>
              </div>

              <div className="p-2.5 bg-[#FFF8E8] rounded-xl border border-amber-200">
                <p className="text-[10px] text-gray-500 uppercase">Masa Bermain</p>
                <p className="text-base text-purple-800 font-black flex items-center gap-1">
                  ⏱️ {totalPlayMinutes} minit
                </p>
              </div>
            </div>
          </div>

          {/* 🎮 PRESTASI MENGIKUT GAME (3 CARDS) */}
          <div className="space-y-2">
            <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-[#3c4233]" />
              <span>Prestasi Mengikut Mod Permainan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: Arena Pecahan */}
              <GamePerfCard
                title="🏃 Arena Pecahan"
                subtitle="Konsep & Pecahan Setara"
                completed={gameDetails.arena_pecahan?.completedChallenges || 0}
                earnedStars={gameDetails.arena_pecahan?.earnedStars || 0}
                score={gameDetails.arena_pecahan?.scorePercentage || 0}
                percubaan={gameDetails.arena_pecahan?.percubaan || 0}
                hint={gameDetails.arena_pecahan?.hintUsed || 0}
                masa={gameDetails.arena_pecahan?.masaMinit || 0}
                colorTheme="sage"
              />

              {/* Card 2: Dapur Pecahan */}
              <GamePerfCard
                title="🍳 Dapur Pecahan"
                subtitle="Penambahan & Penolakan"
                completed={gameDetails.dapur_pecahan?.completedChallenges || 0}
                earnedStars={gameDetails.dapur_pecahan?.earnedStars || 0}
                score={gameDetails.dapur_pecahan?.scorePercentage || 0}
                percubaan={gameDetails.dapur_pecahan?.percubaan || 0}
                hint={gameDetails.dapur_pecahan?.hintUsed || 0}
                masa={gameDetails.dapur_pecahan?.masaMinit || 0}
                colorTheme="yellow"
              />

              {/* Card 3: Dunia Pixel */}
              <GamePerfCard
                title="🌈 Dunia Pixel"
                subtitle="Termudah & Campuran"
                completed={gameDetails.dunia_pixel?.completedChallenges || 0}
                earnedStars={gameDetails.dunia_pixel?.earnedStars || 0}
                score={gameDetails.dunia_pixel?.scorePercentage || 0}
                percubaan={gameDetails.dunia_pixel?.percubaan || 0}
                hint={gameDetails.dunia_pixel?.hintUsed || 0}
                masa={gameDetails.dunia_pixel?.masaMinit || 0}
                colorTheme="terracotta"
              />
            </div>
          </div>

          {/* 🧩 DATA SETIAP JAWAPAN (ATTEMPT HISTORY LOG) */}
          <div className="bg-white p-4 rounded-2xl border border-[#3c4233]/15 shadow-sm space-y-3">
            <h3 className="font-serif-title font-bold text-sm text-[#3c4233] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#3c4233]" />
              <span>Data Setiapa Percubaan Jawapan Murid</span>
            </h3>

            {attempts.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Tiada log jawapan terperinci direkodkan.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse text-xs font-medium">
                  <thead>
                    <tr className="bg-[#3c4233] text-[#F4C95D] font-extrabold">
                      <th className="p-2.5">Soalan</th>
                      <th className="p-2.5">Jawapan Murid</th>
                      <th className="p-2.5">Jawapan Sebenar</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5 text-center">Percubaan</th>
                      <th className="p-2.5 text-center">Hint</th>
                      <th className="p-2.5 text-center">Masa</th>
                      <th className="p-2.5">Kemahiran Diuji</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {attempts.map((att, idx) => (
                      <tr key={att.id || idx} className="hover:bg-amber-50/60">
                        <td className="p-2.5 font-bold font-mono text-[#3c4233]">{att.soalan}</td>
                        <td className="p-2.5 font-mono font-bold text-amber-900">{att.jawapanMurid}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-800">{att.jawapanSebenar}</td>
                        <td className="p-2.5">
                          {att.isCorrect ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Betul
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D98262]/20 text-[#D98262] border border-[#D98262]/40">
                              Salah
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-bold">{att.percubaan}</td>
                        <td className="p-2.5 text-center font-bold text-amber-700">{att.hintUsed}</td>
                        <td className="p-2.5 text-center font-mono">{att.masaSaat} saat</td>
                        <td className="p-2.5 font-bold text-gray-700">{att.kemahiran}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#3c4233]/20 flex justify-between items-center shrink-0">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onOpenReport();
            }}
            className="px-4 py-2 rounded-xl bg-[#F4C95D] hover:bg-[#e5b73e] text-[#3c4233] font-black text-xs flex items-center gap-1.5 cursor-pointer border border-[#3c4233]/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#3c4233]" />
            <span>Penjelasan & Laporan AI</span>
          </button>

          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-bold text-xs cursor-pointer"
          >
            Tutup Perincian
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// HELPER COMPONENT FOR GAME PERFORMANCE CARD
interface GamePerfCardProps {
  title: string;
  subtitle: string;
  completed: number;
  earnedStars: number;
  score: number;
  percubaan: number;
  hint: number;
  masa: number;
  colorTheme: 'sage' | 'yellow' | 'terracotta';
}

const GamePerfCard: React.FC<GamePerfCardProps> = ({
  title,
  subtitle,
  completed,
  earnedStars,
  score,
  percubaan,
  hint,
  masa,
  colorTheme,
}) => {
  let borderBg = 'border-[#3c4233]/20 bg-white';
  if (colorTheme === 'yellow') borderBg = 'border-[#F4C95D] bg-amber-50/50';
  if (colorTheme === 'terracotta') borderBg = 'border-[#D98262]/30 bg-[#D98262]/5';

  return (
    <div className={`p-3.5 rounded-2xl border-2 ${borderBg} shadow-sm space-y-2 font-medium text-xs`}>
      <div>
        <h4 className="font-serif-title font-bold text-[#3c4233] text-sm">{title}</h4>
        <p className="text-[10px] text-gray-500 font-semibold">{subtitle}</p>
      </div>

      <div className="space-y-1 pt-1 border-t border-stone-200/60 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Cabaran Selesai:</span>
          <span className="font-bold text-[#3c4233]">{completed} / 3</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Skor Penguasaan:</span>
          <span className="font-bold text-emerald-800">{score}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Bintang:</span>
          <span className="font-bold text-amber-700">⭐ {earnedStars} / 9</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Percubaan:</span>
          <span className="font-bold text-gray-800">{percubaan} kali</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Jumlah Hint:</span>
          <span className="font-bold text-blue-800">{hint} hint</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Masa Bermain:</span>
          <span className="font-bold text-purple-800">{masa} minit</span>
        </div>
      </div>
    </div>
  );
};
