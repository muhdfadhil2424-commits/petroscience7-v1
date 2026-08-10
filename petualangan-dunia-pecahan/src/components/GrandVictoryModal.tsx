import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Award, Sparkles, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSfx } from '../utils/audio';

interface GrandVictoryModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  earnedStars: number;
  badges?: string[];
  onClose: () => void;
}

export const GrandVictoryModal: React.FC<GrandVictoryModalProps> = ({
  isOpen,
  soundEnabled,
  earnedStars,
  badges = [],
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      playSfx('fanfare', soundEnabled);
      try {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.4 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 80,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 80,
            origin: { x: 1 },
          });
        }, 400);
      } catch {
        // ignore
      }
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const allBadges = [
    { id: 'master', title: 'Master Pecahan', icon: '🏆', desc: 'Selesai Semua 9 Cabaran' },
    { id: 'arena', title: 'Juara Arena', icon: '🏟️', desc: 'Dunia 1 — Arena Pecahan' },
    { id: 'dapur', title: 'Chef Handal', icon: '🍳', desc: 'Dunia 2 — Dapur Pecahan' },
    { id: 'pixel', title: 'Pengembara Pixel', icon: '⚔️', desc: 'Dunia 3 — Dunia Pixel' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          className="bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-4 border-[#F4C95D] shadow-2xl relative text-center space-y-6 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-[#4A3728] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Trophy Header */}
          <div className="relative inline-block mx-auto">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 border-4 border-amber-600 flex items-center justify-center text-6xl shadow-xl mx-auto"
            >
              🏆
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-800 font-rounded font-extrabold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% SELESAI — MASTER PECAHAN</span>
            </span>

            <h2 className="font-serif-title font-black text-2xl sm:text-3xl text-[#4A3728] leading-tight">
              🎉 Tahniah! Anda telah menamatkan semua cabaran!
            </h2>

            <p className="font-rounded font-semibold text-sm sm:text-base text-[#4A3728]/80 leading-relaxed max-w-md mx-auto">
              Luar biasa! Kamu telah berjaya menyelesaikan kesemua 9 cabaran di Arena Pecahan, Dapur Pecahan, dan Dunia Pixel dengan cemerlang!
            </p>
          </div>

          {/* Stats Summary Box */}
          <div className="grid grid-cols-2 gap-3 bg-[#FFF8E8] p-4 rounded-2xl border-2 border-[#F6C7A8] shadow-inner">
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-gray-500">Cabaran Selesai</span>
              <span className="text-2xl font-black text-emerald-600 font-rounded">9 / 9</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-gray-500">Jumlah Bintang</span>
              <div className="flex items-center gap-1 text-2xl font-black text-amber-500 font-rounded">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{earnedStars} / 27</span>
              </div>
            </div>
          </div>

          {/* Badges Earned Grid */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-serif-title font-extrabold text-[#4A3728] uppercase tracking-wider block text-center">
              🏅 Lencana Kemenangan Kamu:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {allBadges.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl bg-white border border-amber-300 flex items-center gap-2.5 shadow-sm"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="font-rounded font-bold text-xs text-[#4A3728]">{b.title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Close / Hub Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#D98262] hover:from-amber-600 hover:to-[#c87253] text-white font-rounded font-extrabold text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-800"
          >
            <Award className="w-5 h-5" />
            <span>KEMBALI KE HUB UTAMA</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
