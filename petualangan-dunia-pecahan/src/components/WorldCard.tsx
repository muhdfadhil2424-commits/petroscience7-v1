import React from 'react';
import { motion } from 'motion/react';
import { Lock, Play, Star, Sparkles } from 'lucide-react';
import { WorldInfo } from '../types';
import { playSfx } from '../utils/audio';

interface WorldCardProps {
  world: WorldInfo;
  isUnlocked: boolean;
  starsEarned: number; // e.g. 0 to 9
  soundEnabled: boolean;
  onSelectWorld: (world: WorldInfo) => void;
  onLockedClick: (world: WorldInfo) => void;
}

export const WorldCard: React.FC<WorldCardProps> = ({
  world,
  isUnlocked,
  starsEarned,
  soundEnabled,
  onSelectWorld,
  onLockedClick,
}) => {
  const handleClick = () => {
    if (isUnlocked) {
      playSfx('chime', soundEnabled);
      onSelectWorld(world);
    } else {
      playSfx('lock', soundEnabled);
      onLockedClick(world);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-[2.5rem] p-6 sm:p-7 border-2 flex flex-col justify-between transition-all shadow-xl overflow-hidden cursor-pointer group ${
        isUnlocked
          ? 'bg-white border-white hover:border-[#F4C95D]'
          : 'bg-white/60 border-white/40 grayscale-[35%] opacity-80 hover:opacity-100'
      }`}
      onClick={handleClick}
    >
      {/* Top Banner & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {/* World Number & Badge */}
        <div className="flex items-center gap-2">
          <span className="font-rounded font-extrabold text-xs text-[#D98262] bg-[#F6C7A8]/40 px-2.5 py-1 rounded-full border border-[#F6C7A8]">
            DUNIA {world.number}
          </span>
          <span className="font-rounded font-bold text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {world.badge}
          </span>
        </div>

        {/* Lock / Unlock Pill */}
        {isUnlocked ? (
          <span className="text-xs font-rounded font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 shadow-sm">
            🔓 TERSEDIA
          </span>
        ) : (
          <span className="text-xs font-rounded font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-300 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-gray-500" /> TERKUNCI
          </span>
        )}
      </div>

      {/* Main World Visual Graphic Card */}
      <div className={`relative w-full h-48 rounded-2xl mb-5 flex flex-col items-center justify-center text-center overflow-hidden border-2 ${world.themeColor.border} bg-gray-900 shadow-inner group-hover:shadow-2xl transition-all`}>
        {world.bannerImage ? (
          <>
            {/* Theme Banner Background */}
            <img
              src={world.bannerImage}
              alt={world.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${world.themeColor.gradient}`}>
            <div className="absolute inset-0 flex items-center justify-around opacity-20 text-3xl pointer-events-none select-none">
              {world.visualElements.map((item, idx) => (
                <span key={idx} className="animate-float" style={{ animationDelay: `${idx * 0.7}s` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Floating Icon Badge */}
        <motion.div
          animate={isUnlocked ? { scale: [1, 1.08, 1], y: [0, -2, 0] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-14 h-14 rounded-2xl bg-white/95 shadow-lg border-2 border-white/80 flex items-center justify-center text-3xl mb-1.5 backdrop-blur-sm"
        >
          {world.icon}
        </motion.div>

        {/* World Subtitle */}
        <p className="relative z-10 text-xs sm:text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-3 line-clamp-1">
          {world.subtitle}
        </p>

        {/* Locked Overlay Effect */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center shadow-xl border border-gray-300">
              <Lock className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        )}
      </div>

      {/* World Information */}
      <div className="mb-6 text-left">
        <h3 className="font-rounded font-extrabold text-2xl text-[#4A3728] tracking-tight mb-1">
          {world.title}
        </h3>
        <p className="text-sm font-semibold text-[#4A3728]/80 leading-relaxed">
          {world.description}
        </p>
      </div>

      {/* Star Progress for World */}
      <div className="flex items-center justify-between mb-5 bg-[#FFF8E8] px-3.5 py-2 rounded-xl border border-[#F6C7A8]">
        <span className="text-xs font-rounded font-bold text-[#4A3728]">Bintang Dunia</span>
        <div className="flex items-center gap-1 font-rounded font-bold text-sm text-[#4A3728]">
          <Star className="w-4 h-4 text-[#F4C95D] fill-[#F4C95D]" />
          <span>{starsEarned} / 9</span>
        </div>
      </div>

      {/* Primary Action Button */}
      {isUnlocked ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#D98262] hover:bg-[#c77253] text-white font-rounded font-bold text-base shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>MAIN SEKARANG</span>
        </motion.button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#4A3728]/20 text-[#4A3728]/50 font-rounded font-bold text-base border border-[#4A3728]/10 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>TERKUNCI</span>
        </button>
      )}
    </motion.div>
  );
};
