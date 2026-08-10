import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Sparkles, X, Check } from 'lucide-react';
import { playSfx } from '../utils/audio';

interface CaraBermainModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  onClose: () => void;
}

export const CaraBermainModal: React.FC<CaraBermainModalProps> = ({
  isOpen,
  soundEnabled,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleUnderstandClick = () => {
    playSfx('chime', soundEnabled);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#F4C95D] overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF8E8] hover:bg-[#F6C7A8] text-[#4A3728] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4C95D]/30 border-2 border-[#F4C95D] flex items-center justify-center text-3xl mb-3 shadow-inner">
              📖
            </div>
            <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#4A3728]">
              CARA BERMAIN
            </h2>
            <p className="font-rounded font-semibold text-sm text-[#D98262] mt-1">
              Selamat datang, Pengembara!
            </p>
          </div>

          {/* Modal Content Body */}
          <div className="space-y-4 mb-6 text-[#4A3728]">
            <p className="font-rounded font-bold text-center text-base bg-[#FFF8E8] py-2 rounded-xl border border-[#F6C7A8]">
              Dalam game ini kamu akan meneroka 3 dunia:
            </p>

            {/* 3 Worlds List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-2xl">🏃</span>
                <div>
                  <h4 className="font-rounded font-bold text-sm text-emerald-900">
                    Arena Pecahan
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700">
                    Bermain sambil belajar pecahan melalui sukan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-2xl">👩‍🍳</span>
                <div>
                  <h4 className="font-rounded font-bold text-sm text-amber-900">
                    Dapur Pecahan
                  </h4>
                  <p className="text-xs font-semibold text-amber-700">
                    Gunakan pecahan untuk menyediakan makanan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm">
                <span className="text-2xl">👧</span>
                <div>
                  <h4 className="font-rounded font-bold text-sm text-amber-900">
                    Alya — Pembantu Pecahan
                  </h4>
                  <p className="text-xs font-semibold text-amber-800">
                    Satu-satunya tutor Matematik pilihan anda! Tekan butang 💡 Petunjuk di bawah kanan skrin jika perlukan bantuan Alya.
                  </p>
                </div>
              </div>
            </div>

            {/* Ultimate Goal Box */}
            <div className="text-center bg-gradient-to-r from-[#F4C95D]/20 via-[#F6C7A8]/30 to-[#A9C5A0]/20 p-4 rounded-2xl border-2 border-[#F4C95D] shadow-inner">
              <p className="text-xs font-semibold text-[#4A3728]">
                Setiap dunia mempunyai 3 cabaran.
              </p>
              <p className="font-rounded font-bold text-sm text-[#4A3728] mt-1">
                Lengkapkan semua cabaran untuk menjadi:
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 bg-white px-4 py-1.5 rounded-full border border-[#F4C95D] font-rounded font-extrabold text-base text-[#D98262] shadow-sm">
                <Trophy className="w-5 h-5 text-[#F4C95D] fill-[#F4C95D]" />
                <span>MASTER PECAHAN!</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUnderstandClick}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F4C95D] to-[#D98262] text-[#4A3728] font-rounded font-bold text-lg shadow-lg border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>FAHAM! JOM MAIN!</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
