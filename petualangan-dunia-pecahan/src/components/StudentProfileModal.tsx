import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, School, Sparkles, UserCheck, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { StudentProfile } from '../types';
import {
  getAllStudents,
  registerStudent,
  generateNextStudentId,
  setCurrentStudent,
  startNewGameSession,
} from '../utils/studentSessionManager';
import { playSfx } from '../utils/audio';
import { AlyaCharacter } from './AlyaCharacter';

interface StudentProfileModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onStudentStart: (student: StudentProfile) => void;
  onOpenTeacherLogin: () => void;
}

const PRESET_CLASSES = ['3 Bestari', '3 Cerdik', '3 Pintar', '4 Bestari', '4 Cemerlang', '4 Gemilang'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  soundEnabled,
  onStudentStart,
  onOpenTeacherLogin,
}) => {
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('4 Bestari');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSelectExistingMode, setIsSelectExistingMode] = useState(false);
  const [selectedExistingStudentId, setSelectedExistingStudentId] = useState('');

  if (!isOpen) return null;

  const existingStudents = getAllStudents();
  const previewNextId = generateNextStudentId();

  const handleStartPlaying = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSelectExistingMode) {
      if (!selectedExistingStudentId) {
        setErrorMessage('Sila pilih profil murid dari senarai terlebih dahulu. 😊');
        playSfx('lock', soundEnabled);
        return;
      }
      const existing = existingStudents.find((s) => s.id === selectedExistingStudentId);
      if (existing) {
        playSfx('chime', soundEnabled);
        setCurrentStudent(existing);
        startNewGameSession(existing);
        onStudentStart(existing);
      }
      return;
    }

    if (!nama.trim() || !kelas.trim()) {
      setErrorMessage('Sila isi nama dan kelas terlebih dahulu. 😊');
      playSfx('lock', soundEnabled);
      return;
    }

    setErrorMessage('');
    playSfx('chime', soundEnabled);

    // Register student & create session
    const student = registerStudent(nama, kelas);
    startNewGameSession(student);
    onStudentStart(student);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#F4C95D] p-5 sm:p-7 font-rounded overflow-hidden"
      >
        {/* Background Soft Accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#F6C7A8]/40 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#C2D8B8]/40 blur-xl pointer-events-none" />

        {/* Top Header Row with Teacher Login Button */}
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#F4C95D]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#E0A96D]/20 text-[#4A3728] font-bold text-xs border border-[#E0A96D]/40 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sistem Profil Wira
            </span>
          </div>

          {/* Teacher Login Button (Non-Disruptive) */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              onOpenTeacherLogin();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-amber-200 text-xs font-bold border border-[#525a46] shadow-sm transition-all cursor-pointer"
            title="Log Masuk Guru"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>👨‍🏫 LOG MASUK GURU</span>
          </button>
        </div>

        {/* Welcome Mascot & Title */}
        <div className="flex flex-col items-center text-center space-y-2 mb-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 border-2 border-[#F4C95D] shadow-md flex items-center justify-center relative">
            <AlyaCharacter size="md" mood="happy" className="w-full h-full" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-white flex items-center justify-center text-xs">
              🌟
            </div>
          </div>

          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#4A3728]">
            Selamat Datang, Wira Pecahan! 🌟
          </h2>
          <p className="text-xs sm:text-sm text-[#4A3728]/80 font-medium max-w-sm">
            Sila isi nama dan kelas sebelum mula bermain.
          </p>
        </div>

        {/* Validation Error Message Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4 p-3 rounded-2xl bg-red-100 border-2 border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Student Selector Toggle */}
        {existingStudents.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                playSfx('pop', soundEnabled);
                setIsSelectExistingMode(false);
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isSelectExistingMode
                  ? 'bg-[#D98262] text-white shadow-md'
                  : 'bg-white/80 text-gray-600 border border-amber-200 hover:bg-white'
              }`}
            >
              ✍️ Daftar Murid Baharu
            </button>

            <button
              type="button"
              onClick={() => {
                playSfx('pop', soundEnabled);
                setIsSelectExistingMode(true);
                setErrorMessage('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelectExistingMode
                  ? 'bg-[#D98262] text-white shadow-md'
                  : 'bg-white/80 text-gray-600 border border-amber-200 hover:bg-white'
              }`}
            >
              👦 Select Existing ({existingStudents.length})
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleStartPlaying} className="space-y-4">
          {!isSelectExistingMode ? (
            <>
              {/* ID Murid Automatic Badge */}
              <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-2xl border border-amber-200 text-xs">
                <span className="text-gray-600 font-medium">ID Murid Unik (Automatik):</span>
                <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  {previewNextId}
                </span>
              </div>

              {/* Input: Nama Murid */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#D98262]" />
                  <span>Nama Murid <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Contoh: Aiman Hakim"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-amber-200 focus:border-[#D98262] focus:outline-none font-bold text-sm text-[#4A3728] placeholder-gray-400 transition-all shadow-inner"
                />
              </div>

              {/* Input: Kelas */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-4 h-4 text-[#D98262]" />
                  <span>Kelas <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => {
                    setKelas(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Contoh: 4 Bestari"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-amber-200 focus:border-[#D98262] focus:outline-none font-bold text-sm text-[#4A3728] placeholder-gray-400 transition-all shadow-inner"
                />

                {/* Preset Class Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-bold self-center mr-1">Pilih Cepat:</span>
                  {PRESET_CLASSES.map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        playSfx('pop', soundEnabled);
                        setKelas(cls);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        kelas === cls
                          ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Select Existing Student Mode */
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider">
                Pilih Profil Murid
              </label>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {existingStudents.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setSelectedExistingStudentId(st.id);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedExistingStudentId === st.id
                        ? 'bg-amber-100 border-[#D98262] shadow-md'
                        : 'bg-white border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                          {st.id}
                        </span>
                        <span className="font-bold text-sm text-[#4A3728]">{st.nama}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Kelas: {st.kelas} • ⭐ {st.progress?.earnedStars || 0} Bintang
                      </p>
                    </div>

                    {selectedExistingStudentId === st.id && (
                      <UserCheck className="w-5 h-5 text-[#D98262]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D98262] to-[#c87253] text-white font-bold text-base sm:text-lg shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>🎮 MULA BERMAIN</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        {/* Helper Note */}
        <p className="text-[11px] text-gray-500 text-center font-medium mt-4">
          Data kemajuan peribadi anda akan disimpan secara selamat bagi setiap sesi permainan.
        </p>
      </motion.div>
    </div>
  );
};
