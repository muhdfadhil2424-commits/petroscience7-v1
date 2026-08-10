import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WorldInfo } from '../types';
import { WorldCard } from './WorldCard';
import { Sparkles, Compass, Gamepad2, Infinity as InfinityIcon, Star, Coins, Flame, Play, Music, Volume2, VolumeX } from 'lucide-react';
import { playSfx, toggleLofiBgm } from '../utils/audio';

import heroBg from '../assets/images/pizza_shop_hero_bg_1785465229798.jpg';
import chefMascotImg from '../assets/images/chef_mascot_1785465244177.jpg';

interface WorldsHubProps {
  worlds: WorldInfo[];
  unlockedWorldIds: string[];
  worldStars: Record<string, number>;
  soundEnabled: boolean;
  onSelectWorld: (world: WorldInfo) => void;
  onLockedWorldClick: (world: WorldInfo) => void;
  onOpenPizzaPecahan: () => void;
}

const RECORDS_STORAGE_KEY = 'pizza_pecahan_records_v1';

interface ShopRecords {
  pizzasMade: number;
  stars: number;
  coins: number;
  bestScore: number;
}

const DEFAULT_RECORDS: ShopRecords = {
  pizzasMade: 0,
  stars: 0,
  coins: 0,
  bestScore: 0,
};

export const WorldsHub: React.FC<WorldsHubProps> = ({
  worlds,
  unlockedWorldIds,
  worldStars,
  soundEnabled,
  onSelectWorld,
  onLockedWorldClick,
  onOpenPizzaPecahan,
}) => {
  const [records] = useState<ShopRecords>(() => {
    try {
      const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
    } catch {
      return DEFAULT_RECORDS;
    }
  });

  const [isLofiPlaying, setIsLofiPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isLofiPlaying && soundEnabled) {
      toggleLofiBgm(true);
    } else {
      toggleLofiBgm(false);
    }
    return () => {
      toggleLofiBgm(false);
    };
  }, [isLofiPlaying, soundEnabled]);

  return (
    <section id="worlds-hub" className="w-full py-12 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3 flex-wrap justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D98262]/10 border border-[#D98262]/30 text-[#D98262] font-rounded font-bold text-sm"
          >
            <Compass className="w-4 h-4 text-[#D98262]" />
            <span>3 DUNIA MENANTI</span>
          </motion.div>

          {/* Lo-Fi Music Controller Pill */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsLofiPlaying((prev) => !prev);
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-rounded font-extrabold cursor-pointer transition-all shadow-sm ${
              isLofiPlaying && soundEnabled
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-white text-[#4A3728] border-[#F6C7A8] hover:bg-amber-50'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>🎵 MUZIK LO-FI HUB: {isLofiPlaying && soundEnabled ? 'ON 🔊' : 'OFF 🔇'}</span>
          </motion.button>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif-title font-bold text-3xl sm:text-4xl md:text-5xl text-[#4A3728] mb-3 tracking-tight"
        >
          PILIH DUNIA PENGEMBARAAN
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-rounded font-semibold text-base sm:text-lg text-[#4A3728]/80 flex items-center justify-center gap-1.5"
        >
          <span>Pilih dunia yang ingin kamu mainkan!</span>
          <Sparkles className="w-4 h-4 text-[#F4C95D]" />
        </motion.p>
      </div>

      {/* 3 Worlds Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {worlds.map((world, idx) => {
          const isUnlocked = unlockedWorldIds.includes(world.id);
          const starsEarned = worldStars[world.id] || 0;

          return (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
            >
              <WorldCard
                world={world}
                isUnlocked={isUnlocked}
                starsEarned={starsEarned}
                soundEnabled={soundEnabled}
                onSelectWorld={onSelectWorld}
                onLockedClick={onLockedWorldClick}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SEKSYEN KHAS: MINI GAME BEBAS (PIZZA PECAHAN) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full pt-8 border-t-2 border-dashed border-[#F4C95D]/60"
      >
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-rounded font-extrabold text-sm mb-2 shadow-sm">
            <Gamepad2 className="w-4 h-4 text-[#D98262]" />
            <span>MINI GAME BEBAS</span>
          </div>

          <p className="font-rounded font-bold text-lg text-[#4A3728] flex items-center justify-center gap-1.5">
            <span>Jom bermain sambil berlatih!</span>
            <span className="text-xl">🍕</span>
          </p>
        </div>

        {/* Dedicated Mini Game Card */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FFF8E8] via-white to-[#F6C7A8]/30 rounded-3xl p-5 sm:p-8 border-4 border-[#F4C95D] shadow-xl relative overflow-hidden group">
          
          {/* Subtle background glow decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F4C95D]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#D98262]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left Graphic Banner with Cute Pizza Shop Visual */}
            <div className="md:col-span-5 relative h-56 md:h-64 rounded-2xl overflow-hidden border-2 border-[#F6C7A8] shadow-md group-hover:shadow-lg transition-shadow">
              <img
                src={heroBg}
                alt="Kedai Pizza Pecahan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Chef Mascot Floating Avatar */}
              <div className="absolute top-3 left-3 w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-amber-100">
                <img src={chefMascotImg} alt="Chef Mascot" className="w-full h-full object-cover" />
              </div>

              {/* Badges on Graphic Banner */}
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                <span className="bg-[#D98262] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1 border border-white/30">
                  <Gamepad2 className="w-3.5 h-3.5" /> MINI GAME
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/30">
                  <InfinityIcon className="w-3.5 h-3.5 text-emerald-200" /> TIADA PENGHUJUNG
                </span>
              </div>

              {/* Floating pizza elements label */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/20 text-white text-xs font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>🍕 🧀 🔥 📦 👩‍🍳</span>
                </span>
                <span className="text-amber-300 text-[11px]">Bebas Dimainkan</span>
              </div>
            </div>

            {/* Right Details & Action Controls */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              
              <div>
                {/* Title & Subtitle */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#4A3728] tracking-tight">
                    🍕 PIZZA PECAHAN
                  </h3>
                </div>

                <p className="font-serif-title font-bold text-[#D98262] text-sm sm:text-base mb-2">
                  “Kedai Pizza Tak Pernah Tutup!”
                </p>

                <p className="font-rounded font-semibold text-xs sm:text-sm text-[#4A3728]/85 leading-relaxed mb-4">
                  Bantu pelanggan menyediakan pizza mengikut pecahan yang betul. Slices pizza, tambah topping, dan bakar pizza dalam ketuhar!
                </p>

                {/* Live Stats Readout Box */}
                <div className="grid grid-cols-3 gap-2 bg-[#FFF8E8] p-3 rounded-2xl border border-[#F6C7A8] text-center shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Rekod
                    </span>
                    <span className="font-serif-title font-extrabold text-sm sm:text-base text-[#4A3728]">
                      {records.pizzasMade} <span className="text-[10px] font-normal">pesanan</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-center border-x border-[#F6C7A8]">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-0.5">
                      <Coins className="w-3 h-3 text-amber-600" /> Syiling
                    </span>
                    <span className="font-serif-title font-extrabold text-sm sm:text-base text-amber-800">
                      {records.coins}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Kombo
                    </span>
                    <span className="font-serif-title font-extrabold text-sm sm:text-base text-orange-600">
                      {records.bestScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playSfx('click', soundEnabled);
                  onOpenPizzaPecahan();
                }}
                className="w-full py-4 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-extrabold text-base shadow-lg border-b-4 border-[#9a4b2e] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span className="text-xl">🍕</span>
                <span>MAIN SEKARANG</span>
                <Play className="w-4 h-4 text-amber-200 fill-amber-200 ml-1" />
              </motion.button>

            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

