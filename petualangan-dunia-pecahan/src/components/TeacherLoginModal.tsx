import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, KeyRound, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { setTeacherAuth } from '../utils/studentSessionManager';
import { playSfx } from '../utils/audio';

interface TeacherLoginModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  soundEnabled,
  onClose,
  onSuccessLogin,
}) => {
  const [username, setUsername] = useState('guru');
  const [password, setPassword] = useState('cikgu123');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Sila isi nama pengguna dan kata laluan. 😊');
      playSfx('lock', soundEnabled);
      return;
    }

    // Prototype Login validation check (accept 'guru' & 'cikgu123' or 'cikgu' & 'cikgu123' or 'admin')
    if (
      (trimmedUser === 'guru' || trimmedUser === 'cikgu' || trimmedUser === 'admin') &&
      (trimmedPass === 'cikgu123' || trimmedPass === 'admin123' || trimmedPass === 'guru123')
    ) {
      setError('');
      setSuccessMsg('Selamat Datang, Guru! 👋');
      playSfx('fanfare', soundEnabled);

      setTeacherAuth(true, 'Cikgu Math');

      setTimeout(() => {
        onSuccessLogin();
      }, 700);
    } else {
      setError('Nama pengguna atau kata laluan tidak sah. (Gunakan: guru / cikgu123)');
      playSfx('lock', soundEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#3c4233] p-6 font-rounded overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playSfx('click', soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3c4233] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-title text-xl font-bold text-[#4A3728]">
              Log Masuk Guru
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Sistem Analisis & Portal Pengurusan Murid
            </p>
          </div>
        </div>

        {/* Error / Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-4 p-3 rounded-2xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prototype Credentials Notice */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs">
          <p className="font-bold mb-0.5">🔑 Info Log Masuk Prototaip:</p>
          <p className="font-mono text-[11px]">Nama Pengguna: <span className="font-bold">guru</span></p>
          <p className="font-mono text-[11px]">Kata Laluan: <span className="font-bold">cikgu123</span></p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#3c4233]" />
              <span>Nama Pengguna</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan nama pengguna"
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-300 focus:border-[#3c4233] focus:outline-none font-bold text-sm text-[#4A3728] placeholder-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#3c4233]" />
              <span>Kata Laluan</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata laluan"
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-300 focus:border-[#3c4233] focus:outline-none font-bold text-sm text-[#4A3728] placeholder-gray-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#3c4233] hover:bg-[#2d3226] text-amber-300 font-bold text-base shadow-lg border-2 border-amber-400/40 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>🔐 LOG MASUK</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
