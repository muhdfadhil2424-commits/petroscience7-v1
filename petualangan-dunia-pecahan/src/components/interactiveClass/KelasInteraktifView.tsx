import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  PlusCircle,
  CreditCard,
  PlayCircle,
  BarChart3,
  ArrowLeft,
  School,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  RefreshCw,
  Printer,
  Eye,
  X,
  Sparkles,
  Laptop,
  Check,
  PowerOff,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import { InteractiveClassStudent } from '../../types/interactiveClass';
import {
  INTERACTIVE_CLASSES,
  getAllInteractiveStudents,
  getStudentsByClass,
  generateNextStudentIdForClass,
  addInteractiveStudent,
  updateInteractiveStudent,
  toggleInteractiveStudentStatus,
  regenerateCardsForClass,
  getSavedSelectedClass,
  saveSelectedClass,
  formatStudentId,
  parseStudentIdIndex,
} from '../../utils/interactiveClassManager';
import { downloadAllClassQrsZip } from '../../utils/studentQrManager';
import { StudentAnswerCard } from './StudentAnswerCard';
import { PrintCardsModal } from './PrintCardsModal';
import { MulaSesiClassroom } from './MulaSesiClassroom';
import { InteractiveClassDashboard } from './InteractiveClassDashboard';
import { playSfx } from '../../utils/audio';

interface KelasInteraktifViewProps {
  onBackToMain: () => void;
  soundEnabled?: boolean;
}

type TabType = 'setup' | 'students' | 'cards' | 'session' | 'dashboard';

export const KelasInteraktifView: React.FC<KelasInteraktifViewProps> = ({
  onBackToMain,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('setup');
  const [selectedClass, setSelectedClass] = useState<string>(() => getSavedSelectedClass());
  const [students, setStudents] = useState<InteractiveClassStudent[]>([]);

  // Add student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Edit student modal state
  const [editingStudent, setEditingStudent] = useState<InteractiveClassStudent | null>(null);
  const [editNameInput, setEditNameInput] = useState('');

  // Print Modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [singlePrintStudent, setSinglePrintStudent] = useState<InteractiveClassStudent | null>(null);

  // Preview Single Card Modal state
  const [previewCardStudent, setPreviewCardStudent] = useState<InteractiveClassStudent | null>(null);

  // Zipping state for batch downloads
  const [isZippingAll, setIsZippingAll] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load students for current class
  const loadClassStudents = () => {
    const list = getStudentsByClass(selectedClass);
    setStudents(list);
  };

  useEffect(() => {
    loadClassStudents();
  }, [selectedClass]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDownloadAllClassZip = async () => {
    if (students.length === 0) {
      showToast('Tiada murid dalam kelas ini untuk dimuat turun.');
      return;
    }
    setIsZippingAll(true);
    setZipProgress({ current: 0, total: students.length });
    try {
      await downloadAllClassQrsZip(students, selectedClass, (curr, total) => {
        setZipProgress({ current: curr, total });
      });
      showToast(`Berjaya memuat turun fail ZIP mengandungi kad semua murid kelas ${selectedClass}!`);
      playSfx('fanfare', soundEnabled);
    } catch (err) {
      console.warn('Ralat download zip:', err);
      showToast('Gagal memuat turun fail ZIP. Sila cuba lagi.');
    } finally {
      setIsZippingAll(false);
      setZipProgress(null);
    }
  };

  const handleClassChange = (newCls: string) => {
    playSfx('click', soundEnabled);
    setSelectedClass(newCls);
    saveSelectedClass(newCls);
    setSearchQuery('');
  };

  // Filtered students for display
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchesSearch =
        st.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && st.cardStatus === 'active') ||
        (statusFilter === 'inactive' && st.cardStatus === 'inactive');

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const nextAutoId = useMemo(() => {
    return generateNextStudentIdForClass(selectedClass);
  }, [selectedClass, students]);

  // Handle Add Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStudentName.trim();
    if (!trimmed) {
      setAddError('Sila masukkan nama murid. 😊');
      playSfx('lock', soundEnabled);
      return;
    }

    setAddError('');
    const created = addInteractiveStudent(trimmed, selectedClass);
    setNewStudentName('');
    setAddSuccess(`Berjaya mendaftarkan ${created.studentName} dengan ID ${created.studentId}!`);
    playSfx('chime', soundEnabled);
    loadClassStudents();

    setTimeout(() => {
      setAddSuccess('');
    }, 3500);
  };

  // Handle Edit Student Name
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const trimmed = editNameInput.trim();
    if (!trimmed) return;

    updateInteractiveStudent(editingStudent.studentId, editingStudent.class, {
      studentName: trimmed,
    });

    playSfx('chime', soundEnabled);
    showToast(`Nama murid dikemaskini kepada: ${trimmed}`);
    setEditingStudent(null);
    loadClassStudents();
  };

  // Handle Toggle Status (Active / Inactive)
  const handleToggleStatus = (st: InteractiveClassStudent) => {
    playSfx('click', soundEnabled);
    const updated = toggleInteractiveStudentStatus(st.studentId, st.class);
    if (updated) {
      showToast(
        `Status kad ${updated.studentId} diubah kepada: ${
          updated.cardStatus === 'active' ? 'Aktif' : 'Nyahaktif'
        }`
      );
      loadClassStudents();
    }
  };

  // Handle Regenerate Sequential Cards
  const handleRegenerateAll = () => {
    if (
      window.confirm(
        `Adakah anda pasti ingin menjana semula ID kad untuk semua ${students.length} murid dalam kelas ${selectedClass}? Sistem akan menyusun ID KP-001 hingga KP-${String(
          students.length
        ).padStart(3, '0')}.`
      )
    ) {
      playSfx('fanfare', soundEnabled);
      regenerateCardsForClass(selectedClass);
      showToast(`Semua kad untuk kelas ${selectedClass} berjaya dijana semula secara teratur!`);
      loadClassStudents();
    }
  };

  // Quick Print All Cards
  const handleOpenPrintAll = () => {
    playSfx('click', soundEnabled);
    setSinglePrintStudent(null);
    setIsPrintModalOpen(true);
  };

  // Quick Print Single Card
  const handleOpenPrintSingle = (st: InteractiveClassStudent) => {
    playSfx('click', soundEnabled);
    setSinglePrintStudent(st);
    setIsPrintModalOpen(true);
  };

  const activeCardsCount = students.filter((s) => s.cardStatus === 'active').length;

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#4A3728] font-rounded flex flex-col">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[1300] bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border-2 border-amber-400 text-xs sm:text-sm font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#FFF3D6] border-b-4 border-[#F4C95D] px-4 sm:px-8 py-3.5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Mode Title */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onBackToMain();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300 text-[#4A3728] text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Kembali ke Laman Utama"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D98262] text-white flex items-center justify-center shadow-md text-lg">
                👨‍🏫
              </div>
              <div>
                <h1 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] leading-tight">
                  KELAS INTERAKTIF
                </h1>
                <p className="text-[11px] text-[#8C6D53] font-semibold">
                  Belajar bersama-sama dalam satu kelas!
                </p>
              </div>
            </div>

            {/* Laptop Badge indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
              <Laptop className="w-3.5 h-3.5" />
              <span>1 Laptop Guru</span>
            </div>
          </div>

          {/* Class Quick Selector in Header */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-[#4A3728] flex items-center gap-1">
              <School className="w-4 h-4 text-[#D98262]" />
              <span>Kelas:</span>
            </span>

            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="bg-white border-2 border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#4A3728] focus:outline-none focus:border-[#D98262] shadow-sm cursor-pointer"
            >
              {INTERACTIVE_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5 MAIN MODE TABS */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-amber-200/80 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              playSfx('pop', soundEnabled);
              setActiveTab('setup');
            }}
            className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'setup'
                ? 'bg-[#D98262] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4A3728] border border-amber-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>➕ Sediakan Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx('pop', soundEnabled);
              setActiveTab('students');
            }}
            className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#D98262] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4A3728] border border-amber-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>📋 Urus Murid ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx('pop', soundEnabled);
              setActiveTab('cards');
            }}
            className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cards'
                ? 'bg-[#D98262] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4A3728] border border-amber-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>🃏 Kad Jawapan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx('pop', soundEnabled);
              setActiveTab('session');
            }}
            className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'session'
                ? 'bg-[#D98262] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4A3728] border border-amber-200'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>🎮 Mula Sesi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx('pop', soundEnabled);
              setActiveTab('dashboard');
            }}
            className={`px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#D98262] text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-[#4A3728] border border-amber-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Dashboard</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {/* ======================================================== */}
        {/* TAB 1: SEDIAKAN KELAS */}
        {/* ======================================================== */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            {/* Hero Welcome Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-[#F4C95D] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mod Kelas Interaktif Tanpa Gajet Murid</span>
                </div>

                <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#4A3728]">
                  Sediakan Kelas: {selectedClass}
                </h2>
                <p className="text-sm text-stone-600 font-medium max-w-2xl mt-1">
                  Guru hanya menggunakan <strong>1 Laptop</strong> untuk memaparkan soalan dan mengimbas kad jawapan murid. Setiap murid menggunakan <strong>Kad Jawapan Personal</strong> berorientasi A, B, C, D (Plickers concept).
                </p>

                {/* Class Quick Badges Grid */}
                <div className="mt-5">
                  <span className="text-xs font-bold text-stone-700 block mb-2">
                    Tukar Kelas Sekolah:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {INTERACTIVE_CLASSES.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleClassChange(cls)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                          selectedClass === cls
                            ? 'bg-[#D98262] text-white border-[#c06b4d] shadow-md'
                            : 'bg-[#FFF8E8] text-[#4A3728] border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Class Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                  👥
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block">Jumlah Murid</span>
                  <span className="text-2xl font-black text-[#4A3728]">{students.length} Orang</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                  🃏
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block">Kad Aktif</span>
                  <span className="text-2xl font-black text-emerald-700">{activeCardsCount} Kad</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
                  🏷️
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block">Julat ID Murid</span>
                  <span className="text-base font-black text-blue-900 font-mono">
                    {students.length > 0
                      ? `${students[0]?.studentId} - ${students[students.length - 1]?.studentId}`
                      : 'Belum Ada'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-md flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl">
                  💻
                </div>
                <div>
                  <span className="text-xs text-stone-500 font-bold block">Mod Operasi</span>
                  <span className="text-sm font-black text-purple-900">Offline & Bersedia</span>
                </div>
              </div>
            </div>

            {/* Step by Step Classroom Workflow */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md">
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728] mb-4 flex items-center gap-2">
                <span>🎒 Aliran Kerja Kelas Interaktif</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-amber-200">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center mb-3">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-[#4A3728] mb-1">Daftar & Jana Kad</h4>
                  <p className="text-xs text-stone-600">
                    Daftar senarai murid kelas. Sistem akan menjana ID unik berkembar seperti <strong>KP-001 hingga KP-040</strong> dengan kod QR tersendiri.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-amber-200">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center mb-3">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-[#4A3728] mb-1">Cetak & Beri Kepada Murid</h4>
                  <p className="text-xs text-stone-600">
                    Cetak kad jawapan personal menggunakan butang cetak. Setiap murid memegang 1 kad tetap dengan orientasi A, B, C, D.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8E8] border border-amber-200">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center mb-3">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-[#4A3728] mb-1">Papar Soalan & Imbas</h4>
                  <p className="text-xs text-stone-600">
                    Guru paparkan soalan di skrin projektor. Murid angkat kad menghadap laptop guru. Kamera laptop membaca jawapan setiap murid secara serentak.
                  </p>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setActiveTab('students');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#D98262] hover:bg-[#c67152] text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Daftar / Urus Murid</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setActiveTab('cards');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Lihat & Jana Kad</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenPrintAll}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>🖨️ Cetak Semua Kad ({students.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: URUS MURID */}
        {/* ======================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Top Add Student Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md">
              <div className="flex items-center justify-between mb-3 border-b border-amber-100 pb-2">
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#D98262]" />
                  <span>Daftar Murid Baharu — Kelas {selectedClass}</span>
                </h3>

                <div className="text-xs text-stone-500">
                  ID Dijana Automatik:{' '}
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    {nextAutoId}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAddStudent} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6 space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Nama Penuh Murid <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Contoh: Muhammad Harith bin Zulkifli"
                      className="w-full px-4 py-2.5 rounded-2xl bg-amber-50/50 border-2 border-amber-200 focus:border-[#D98262] focus:outline-none font-bold text-sm text-[#4A3728] placeholder-stone-400"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-xs font-bold text-stone-700">Kelas</label>
                    <input
                      type="text"
                      value={selectedClass}
                      disabled
                      className="w-full px-4 py-2.5 rounded-2xl bg-stone-100 border-2 border-stone-200 font-bold text-sm text-stone-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#D98262] hover:bg-[#c36f51] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>➕ Tambah Murid</span>
                    </button>
                  </div>
                </div>

                {/* Validation Messages */}
                {addError && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{addError}</span>
                  </p>
                )}
                {addSuccess && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{addSuccess}</span>
                  </p>
                )}
              </form>
            </div>

            {/* Students Table Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md">
              {/* Table Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728]">
                    Senarai Murid Kelas {selectedClass} ({filteredStudents.length}/{students.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Setiap murid mempunyai <strong>studentId unik</strong> dan kad jawapan personal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:w-52">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari murid..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Kad Aktif Sahaja</option>
                    <option value="inactive">Nyahaktif Sahaja</option>
                  </select>

                  {/* Batch Regenerate Button */}
                  <button
                    type="button"
                    onClick={handleRegenerateAll}
                    title="Jana semula urutan KP-001 ke KP-N"
                    className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 border border-amber-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span className="hidden sm:inline">🔄 Susun Semula ID</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-10 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
                  <p className="text-sm font-bold text-stone-600">Tiada rekod murid dijumpai.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Sila tambah murid baharu menggunakan borang di atas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-amber-200 text-stone-600 text-xs uppercase tracking-wider font-bold">
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">Student ID</th>
                        <th className="py-2.5 px-3">Nama Murid</th>
                        <th className="py-2.5 px-3">Kelas</th>
                        <th className="py-2.5 px-3">Status Kad</th>
                        <th className="py-2.5 px-3 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 text-xs font-medium">
                      {filteredStudents.map((st, idx) => (
                        <tr
                          key={st.studentId}
                          className="hover:bg-amber-50/80 transition-colors group"
                        >
                          <td className="py-2.5 px-3 text-stone-400 font-mono">
                            {String(idx + 1).padStart(2, '0')}
                          </td>

                          <td className="py-2.5 px-3 font-mono font-bold text-amber-950">
                            <span className="bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                              {st.studentId}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-bold text-[#4A3728] text-sm">
                            {st.studentName}
                          </td>

                          <td className="py-2.5 px-3 text-stone-600">{st.class}</td>

                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(st)}
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer flex items-center gap-1 transition-all ${
                                st.cardStatus === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300'
                              }`}
                              title="Klik untuk ubah status kad"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{st.cardStatus === 'active' ? 'Aktif' : 'Nyahaktif'}</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Card */}
                              <button
                                type="button"
                                onClick={() => {
                                  playSfx('click', soundEnabled);
                                  setPreviewCardStudent(st);
                                }}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 transition-colors cursor-pointer"
                                title="Pratonton Kad"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Name */}
                              <button
                                type="button"
                                onClick={() => {
                                  playSfx('click', soundEnabled);
                                  setEditingStudent(st);
                                  setEditNameInput(st.studentName);
                                }}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                                title="✏️ Tukar Nama"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Print Single Card */}
                              <button
                                type="button"
                                onClick={() => handleOpenPrintSingle(st)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                                title="🖨️ Cetak Kad Ini"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: KAD JAWAPAN */}
        {/* ======================================================== */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            {/* Header & Print Actions Toolbar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#D98262]" />
                  <span>Kad Jawapan 4 QR — Kelas {selectedClass}</span>
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Setiap murid memiliki 4 kod QR berasingan (A, B, C, D). Murid hanya perlu mengangkat kod jawapan mereka tanpa perlu memusingkan kad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllClassZip}
                  disabled={isZippingAll}
                  className="px-4 py-2 rounded-2xl bg-[#D98262] hover:bg-[#c26e50] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Muat turun fail ZIP mengandungi semua kad dan fail QR murid"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isZippingAll && zipProgress
                      ? `Menjana ZIP (${zipProgress.current}/${zipProgress.total})...`
                      : `📥 Muat Turun Semua QR (ZIP)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenPrintAll}
                  className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>🖨️ Cetak Semua Kad ({students.length})</span>
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {filteredStudents.map((st) => (
                <div
                  key={st.studentId}
                  className="flex flex-col items-center group relative cursor-pointer"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setPreviewCardStudent(st);
                  }}
                >
                  <div className="transform group-hover:-translate-y-1 transition-transform">
                    <StudentAnswerCard
                      student={st}
                      scale="compact"
                      showPrintButton={true}
                      onPrintSingle={(s) => {
                        handleOpenPrintSingle(s);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MULA SESI */}
        {/* ======================================================== */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            {students.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 text-[#D98262] flex items-center justify-center text-3xl mx-auto shadow-sm">
                  👥
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-[#4A3728]">
                  Tiada Murid Berdaftar untuk {selectedClass}
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Sila daftarkan senarai nama murid kelas {selectedClass} terlebih dahulu sebelum memulakan sesi interaktif kamera.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className="px-6 py-2.5 rounded-2xl bg-[#D98262] hover:bg-[#c36f51] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Daftar Murid Sekarang ➔
                </button>
              </div>
            ) : (
              <MulaSesiClassroom
                selectedClass={selectedClass}
                students={students}
                soundEnabled={soundEnabled}
                onBackToTabs={() => setActiveTab('dashboard')}
              />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DASHBOARD GURU — KELAS INTERAKTIF */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <InteractiveClassDashboard
            selectedClass={selectedClass}
            students={students}
            soundEnabled={soundEnabled}
            onNavigateToSession={() => setActiveTab('session')}
          />
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: EDIT STUDENT NAME */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-6 border-4 border-amber-400 shadow-2xl font-rounded"
            >
              <div className="flex items-center justify-between mb-4 border-b border-amber-200 pb-2">
                <h3 className="font-bold text-base text-[#4A3728] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#D98262]" />
                  <span>Tukar Nama Murid ({editingStudent.studentId})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="p-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nama Murid
                  </label>
                  <input
                    type="text"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-amber-300 focus:border-[#D98262] focus:outline-none font-bold text-sm text-[#4A3728]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#D98262] hover:bg-[#c26e50] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: PREVIEW SINGLE CARD */}
      {/* ======================================================== */}
      <AnimatePresence>
        {previewCardStudent && (
          <div className="fixed inset-0 z-[1150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#FFF8E8] p-5 sm:p-6 rounded-3xl border-4 border-[#F4C95D] shadow-2xl flex flex-col items-center max-w-sm w-full font-rounded"
            >
              <button
                type="button"
                onClick={() => setPreviewCardStudent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif-title text-base font-bold text-[#4A3728] mb-3">
                Pratonton Kad Jawapan
              </h4>

              <StudentAnswerCard
                student={previewCardStudent}
                scale="normal"
                showPrintButton={false}
              />

              <div className="mt-4 flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => {
                    const st = previewCardStudent;
                    setPreviewCardStudent(null);
                    handleOpenPrintSingle(st);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>🖨️ Cetak Kad Ini</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewCardStudent(null)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: PRINT CARDS MODAL (SINGLE OR ALL) */}
      {/* ======================================================== */}
      <PrintCardsModal
        isOpen={isPrintModalOpen}
        classNameTitle={selectedClass}
        students={students}
        singleStudent={singlePrintStudent}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSinglePrintStudent(null);
        }}
      />
    </div>
  );
};
