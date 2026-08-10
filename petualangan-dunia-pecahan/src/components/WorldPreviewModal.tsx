import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WorldInfo } from '../types';
import { Sparkles, Trophy, Star, ArrowLeft, X, Play } from 'lucide-react';
import { playSfx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WorldPreviewModalProps {
  world: WorldInfo | null;
  soundEnabled: boolean;
  onOpenArenaPecahan?: () => void;
  onOpenDapurPecahan?: () => void;
  onOpenDuniaPixel?: () => void;
  onClose: () => void;
}

export const WorldPreviewModal: React.FC<WorldPreviewModalProps> = ({
  world,
  soundEnabled,
  onOpenArenaPecahan,
  onOpenDapurPecahan,
  onOpenDuniaPixel,
  onClose,
}) => {
  if (!world) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#F4C95D] text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#FFF8E8] hover:bg-[#F6C7A8] text-[#4A3728] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Graphic Banner Header */}
          <div className="relative w-full h-36 rounded-2xl mb-4 overflow-hidden border-2 border-[#F6C7A8] shadow-inner bg-gray-900 flex items-center justify-center">
            {world.bannerImage ? (
              <>
                <img
                  src={world.bannerImage}
                  alt={world.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${world.themeColor.gradient}`} />
            )}
            
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/95 shadow-xl border-2 border-white flex items-center justify-center text-4xl">
              {world.icon}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4C95D]/20 text-[#D98262] font-rounded font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" /> DUNIA {world.number} • {world.badge}
          </div>

          <h2 className="font-serif-title font-bold text-3xl text-[#4A3728] mb-1">
            {world.title}
          </h2>

          <p className="font-rounded font-semibold text-sm text-[#4A3728]/80 mb-5">
            "{world.subtitle}"
          </p>

          {/* 3 Challenges List Box */}
          <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F6C7A8] mb-6 text-left space-y-2.5">
            <h4 className="font-rounded font-bold text-xs text-[#D98262] uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Senarai 3 Cabaran
            </h4>

            <div className="space-y-2 text-xs font-rounded font-semibold text-[#4A3728]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6C7A8]/60">
                <span className="flex items-center gap-2">
                  <span>1️⃣</span> Cabaran 1: Kenal Pecahan Mudah
                </span>
                <span className="text-[#F4C95D] font-bold flex items-center gap-0.5">
                  ⭐ 3 Bintang
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6C7A8]/60">
                <span className="flex items-center gap-2">
                  <span>2️⃣</span> Cabaran 2: Bandingkan Pecahan
                </span>
                <span className="text-[#F4C95D] font-bold flex items-center gap-0.5">
                  ⭐ 3 Bintang
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6C7A8]/60">
                <span className="flex items-center gap-2">
                  <span>3️⃣</span> Cabaran 3: Selesaikan Pecahan
                </span>
                <span className="text-[#F4C95D] font-bold flex items-center gap-0.5">
                  ⭐ 3 Bintang
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {world.id === 'arena' && onOpenArenaPecahan ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSfx('fanfare', soundEnabled);
                  onClose();
                  onOpenArenaPecahan();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-rounded font-extrabold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-800"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>🏃 MASUK ARENA PECAHAN (LARI & LOMPAT)</span>
              </motion.button>
            ) : null}

            {world.id === 'dapur' && onOpenDapurPecahan ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSfx('fanfare', soundEnabled);
                  onClose();
                  onOpenDapurPecahan();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#D98262] text-white font-rounded font-extrabold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-800"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>🍳 MASUK DAPUR PECAHAN (SUKAT & MASAK)</span>
              </motion.button>
            ) : null}

            {world.id === 'pixel' && onOpenDuniaPixel ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSfx('fanfare', soundEnabled);
                  onClose();
                  onOpenDuniaPixel();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-rounded font-extrabold text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-purple-900"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>🟪 MASUK DUNIA PIXEL (BINA & PUZZLE)</span>
              </motion.button>
            ) : null}

            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#4A3728] font-rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI KE HUB UTAMA</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
