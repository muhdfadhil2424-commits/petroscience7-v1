import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface ProgressBarSectionProps {
  completedChallenges: number;
  earnedStars: number;
}

export const ProgressBarSection: React.FC<ProgressBarSectionProps> = ({
  completedChallenges,
  earnedStars,
}) => {
  const maxChallenges = 9;
  const maxStars = 27;
  const percentage = Math.min(100, Math.round((completedChallenges / maxChallenges) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/90 p-5 md:p-6 rounded-3xl border-2 border-[#F6C7A8] shadow-lg relative overflow-hidden glass-card"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#F4C95D]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F4C95D]/30 border border-[#F4C95D] flex items-center justify-center text-[#4A3728] shadow-inner">
              <Trophy className="w-6 h-6 text-[#D98262]" />
            </div>
            <div>
              <h3 className="font-rounded font-bold text-lg md:text-xl text-[#4A3728] flex items-center gap-1.5">
                <span>Kemajuan Pengembaraan</span>
                <Sparkles className="w-4 h-4 text-[#F4C95D]" />
              </h3>
              <p className="text-xs text-[#4A3728]/70 font-semibold">
                Selesaikan 9 cabaran untuk menjadi Master Pecahan!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stars pill */}
            <div className="flex items-center gap-1.5 bg-[#FFF8E8] px-3.5 py-1.5 rounded-2xl border border-[#F4C95D] font-rounded font-bold text-sm text-[#4A3728]">
              <Star className="w-4 h-4 text-[#F4C95D] fill-[#F4C95D]" />
              <span>{earnedStars} / {maxStars} Bintang</span>
            </div>

            {/* Challenges count */}
            <div className="flex items-center gap-1.5 bg-[#FFF8E8] px-3.5 py-1.5 rounded-2xl border border-[#A9C5A0] font-rounded font-bold text-sm text-[#4A3728]">
              <span className="text-emerald-700 font-extrabold">{completedChallenges}</span>
              <span className="text-gray-500">/</span>
              <span>{maxChallenges} Cabaran</span>
            </div>
          </div>
        </div>

        {/* Outer Progress Bar Track */}
        <div className="w-full bg-[#FFF8E8] h-5 rounded-full p-1 border border-[#F6C7A8] shadow-inner relative overflow-hidden">
          {/* Animated Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(4, percentage)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#A9C5A0] via-[#F4C95D] to-[#D98262] relative"
          >
            {/* Gloss shine */}
            <div className="absolute inset-0 bg-white/25 rounded-full" />
          </motion.div>
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between items-center text-[11px] font-rounded font-semibold text-[#4A3728]/70 mt-2 px-1">
          <span>0 Cabaran</span>
          <span className="text-[#4A3728]">🏃 Arena (3)</span>
          <span className="text-[#4A3728]">👩‍🍳 Dapur (6)</span>
          <span className="text-[#D98262] font-bold">🏆 Master Pecahan (9)</span>
        </div>
      </motion.div>
    </div>
  );
};
