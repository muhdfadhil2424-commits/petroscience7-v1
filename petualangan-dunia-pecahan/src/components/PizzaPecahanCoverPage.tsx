import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Star, 
  Trophy, 
  Coins, 
  Sparkles, 
  Play, 
  Flame, 
  CheckCircle2, 
  MessageCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { playSfx, togglePizzaBgm } from '../utils/audio';
import confetti from 'canvas-confetti';
import { PizzaPecahanGameplay } from './PizzaPecahanGameplay';

// Asset Imports
import heroBg from '../assets/images/pizza_shop_hero_bg_1785465229798.jpg';
import chefMascotImg from '../assets/images/chef_mascot_1785465244177.jpg';
import customerGirlImg from '../assets/images/customer_girl_1785465257470.jpg';

interface PizzaPecahanCoverPageProps {
  soundEnabled: boolean;
  onBackToHub: () => void;
  onToggleSound: () => void;
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

export const PizzaPecahanCoverPage: React.FC<PizzaPecahanCoverPageProps> = ({
  soundEnabled,
  onBackToHub,
  onToggleSound,
}) => {
  // Gameplay view toggle
  const [inGameplay, setInGameplay] = useState<boolean>(false);

  // Local storage shop records
  const [records, setRecords] = useState<ShopRecords>(() => {
    try {
      const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
    } catch {
      return DEFAULT_RECORDS;
    }
  });

  // Reload records when coming back from gameplay
  const refreshRecords = () => {
    try {
      const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
      if (saved) setRecords(JSON.parse(saved));
    } catch {
      // ignore
    }
  };

  // BGM State
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pizza_pecahan_bgm_v1');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Gameplay transition state
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (bgmEnabled && soundEnabled) {
      togglePizzaBgm(true);
    } else {
      togglePizzaBgm(false);
    }
    return () => {
      togglePizzaBgm(false);
    };
  }, [bgmEnabled, soundEnabled]);

  const handleToggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    localStorage.setItem('pizza_pecahan_bgm_v1', JSON.stringify(next));
    playSfx('click', soundEnabled);
  };

  const handleStartGameClick = () => {
    playSfx('fanfare', soundEnabled);
    setIsTransitioning(true);
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#D98262', '#F4C95D', '#A9C5A0', '#FFF8E8'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsTransitioning(false);
      setInGameplay(true);
    }, 1500);
  };

  if (inGameplay) {
    return (
      <PizzaPecahanGameplay
        soundEnabled={soundEnabled}
        onBackToCover={() => {
          refreshRecords();
          setInGameplay(false);
        }}
        onToggleSound={onToggleSound}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#4A3728] flex flex-col relative overflow-x-hidden selection:bg-[#F6C7A8]">
      {/* 3. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-[#3c4233] text-white shadow-md border-b border-[#2d3226]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onBackToHub();
              }}
              className="flex items-center gap-1.5 bg-[#2d3226] hover:bg-[#23271e] text-amber-200 px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
              title="Kembali ke Pilih Dunia Pengembaraan"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>KEMBALI KE DUNIA PENGEMBARAAN</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">🍕</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-title font-bold text-base sm:text-lg text-white tracking-wide">
                    PIZZA PECAHAN
                  </span>
                  <span className="bg-[#b37446] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm uppercase">
                    MINI GAME
                  </span>
                </div>
                <span className="text-[11px] text-amber-200/90 font-medium block leading-tight">
                  Kedai Pizza Tak Pernah Tutup!
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stats & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-[#2d3226] px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{records.stars} Bintang</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-[#2d3226] px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold text-amber-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{records.coins} Syiling</span>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-[#b37446]/90 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold">
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Rekod: {records.bestScore}</span>
            </div>

            {/* BGM Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleBgm}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                bgmEnabled
                  ? 'bg-emerald-800/80 border-emerald-600 text-emerald-100'
                  : 'bg-[#2d3226] border-[#4d5442] text-gray-400'
              }`}
            >
              {bgmEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{bgmEnabled ? 'Muzik: ON' : 'Muzik: OFF'}</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 4. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#2d3226]">
        <div className="relative w-full min-h-[500px] sm:min-h-[540px] md:min-h-[580px] flex items-center py-10 px-4 sm:px-8">
          {/* Pizza Shop Background Image */}
          <img
            src={heroBg}
            alt="Kedai Pizza"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85 filter contrast-[1.05]"
          />

          {/* Depth of field & warm lighting vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8E8] via-transparent to-black/50" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#2a3023]/90 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl text-white max-w-2xl"
              >
                {/* Mini Game Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#b37446] text-amber-100 font-rounded font-bold text-xs sm:text-sm mb-3 shadow-md">
                  <span className="text-base">🍕</span>
                  <span>MINI GAME</span>
                </div>

                {/* Main Title */}
                <h1 className="font-serif-title font-bold text-4xl sm:text-5xl md:text-6xl text-amber-100 tracking-tight leading-[1.05] mb-2">
                  PIZZA PECAHAN
                </h1>

                {/* Tagline */}
                <p className="font-serif-title italic text-lg sm:text-xl md:text-2xl text-amber-300 font-semibold mb-3">
                  “Kedai Pizza Tak Pernah Tutup!”
                </p>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-[#d3dac8] font-medium leading-relaxed mb-6">
                  Jom bantu pelanggan menyediakan pizza mengikut pecahan yang betul!
                </p>

                {/* Main CTA Button: MULA BERMAIN */}
                <div className="flex flex-col items-start gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 20px 30px -10px rgba(217,130,98,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartGameClick}
                    className="w-full sm:w-auto bg-[#D98262] hover:bg-[#c87253] text-white px-8 py-4 sm:px-10 sm:py-4.5 rounded-[2rem] text-xl sm:text-2xl font-rounded font-bold shadow-2xl border-b-8 border-[#9a4b2e] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-3.5 cursor-pointer transition-all ring-4 ring-[#F4C95D]/30"
                  >
                    <span className="text-3xl leading-none">🍕</span>
                    <span>MULA BERMAIN</span>
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </motion.button>

                  <span className="text-xs sm:text-sm text-amber-200/90 font-bold ml-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    Buat pizza dan kumpul bintang!
                  </span>
                </div>
              </motion.div>
            </div>

            {/* 5. RIGHT COLUMN: MAIN CHARACTER & FLOATING ITEMS */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-4 lg:mt-0">
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                {/* Soft Glowing Ring behind Chef */}
                <div className="absolute w-64 h-64 rounded-full bg-[#F4C95D]/20 blur-2xl animate-pulse" />

                {/* Chef Mascot Image */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 w-full h-full drop-shadow-2xl flex items-center justify-center"
                >
                  <img
                    src={chefMascotImg}
                    alt="Tukang Masak Cilik"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-2xl rounded-3xl"
                  />
                </motion.div>

                {/* Floating Item 1: Pizza Slice */}
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -left-2 bg-white/95 p-2 rounded-2xl shadow-xl border-2 border-[#F4C95D] flex items-center gap-2 z-20"
                >
                  <span className="text-2xl">🍕</span>
                  <span className="font-rounded font-bold text-xs text-[#4A3728]">1/2 Pizza</span>
                </motion.div>

                {/* Floating Item 2: Cheese */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [4, -4, 4] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-8 -right-4 bg-white/95 p-2 rounded-2xl shadow-xl border-2 border-amber-300 flex items-center gap-2 z-20"
                >
                  <span className="text-2xl">🧀</span>
                  <span className="font-rounded font-bold text-xs text-[#4A3728]">Keju Meleleh</span>
                </motion.div>

                {/* Floating Item 3: Tomato & Pizza Box */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-2 -left-4 bg-white/95 p-2 rounded-2xl shadow-xl border-2 border-red-300 flex items-center gap-2 z-20"
                >
                  <span className="text-2xl">📦</span>
                  <span className="font-rounded font-bold text-xs text-[#4A3728]">Kotak Pizza</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">
        {/* 8. KAD "CARA BERMAIN" */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D98262]/10 text-[#D98262] font-rounded font-bold text-xs mb-2">
              <HelpCircle className="w-4 h-4" /> PANDUAN PANTAS
            </div>
            <h2 className="font-serif-title font-bold text-3xl sm:text-4xl text-[#4A3728]">
              MACAM MANA NAK MAIN?
            </h2>
            <p className="text-sm sm:text-base text-[#4A3728]/80 font-medium mt-1">
              Ikuti 4 langkah mudah ini untuk menyediakan pizza pilihan pelanggan!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border-2 border-[#F6C7A8] shadow-lg flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#D98262] text-white font-rounded font-bold text-sm flex items-center justify-center">
                1
              </div>
              <div className="w-20 h-20 rounded-2xl bg-[#FFF8E8] border-2 border-[#F4C95D] flex items-center justify-center text-4xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                🔪 🍕
              </div>
              <h3 className="font-rounded font-bold text-lg text-[#4A3728] mb-1">
                POTONG
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3728]/80 font-medium leading-relaxed">
                Potong pizza kepada bahagian yang sama besar.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border-2 border-[#F4C95D] shadow-lg flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#F4C95D] text-[#4A3728] font-rounded font-bold text-sm flex items-center justify-center">
                2
              </div>
              <div className="w-20 h-20 rounded-2xl bg-[#FFF8E8] border-2 border-[#F4C95D] flex items-center justify-center text-4xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                👆 🍕
              </div>
              <h3 className="font-rounded font-bold text-lg text-[#4A3728] mb-1">
                PILIH
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3728]/80 font-medium leading-relaxed">
                Pilih bahagian mengikut pesanan.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border-2 border-[#A9C5A0] shadow-lg flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#A9C5A0] text-white font-rounded font-bold text-sm flex items-center justify-center">
                3
              </div>
              <div className="w-20 h-20 rounded-2xl bg-[#FFF8E8] border-2 border-[#A9C5A0] flex items-center justify-center text-4xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                🧀 🍅
              </div>
              <h3 className="font-rounded font-bold text-lg text-[#4A3728] mb-1">
                HIAS
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3728]/80 font-medium leading-relaxed">
                Tambah topping yang diminta.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-lg flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-rounded font-bold text-sm flex items-center justify-center">
                4
              </div>
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center text-4xl mb-4 shadow-inner group-hover:scale-110 transition-transform">
                📦 ⭐
              </div>
              <h3 className="font-rounded font-bold text-lg text-[#4A3728] mb-1">
                SIAP!
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3728]/80 font-medium leading-relaxed">
                Siapkan pizza dan dapatkan bintang!
              </p>
            </motion.div>
          </div>
        </section>

        {/* 9. CONTOH PESANAN & 10. REKOD KEDAI (GRID 2 COLUMNS) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: CONTOH PESANAN (Sample Order Visual Preview) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F6C7A8] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-[#4A3728]">
                  CONTOH PESANAN
                </h3>
              </div>
              <span className="bg-[#D98262]/10 text-[#D98262] text-xs font-bold px-3 py-1 rounded-full border border-[#D98262]/20">
                PREVIEW PERMAINAN
              </span>
            </div>

            {/* Customer Speech Interaction Visual */}
            <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F4C95D] flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <img
                  src={customerGirlImg}
                  alt="Pelanggan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#F6C7A8] shadow-sm relative text-sm sm:text-base font-rounded font-bold text-[#4A3728] flex-1">
                <p>“Saya mahu <span className="text-[#D98262] font-black underline decoration-wavy">3/4</span> pizza keju!”</p>
              </div>
            </div>

            {/* Visual Pizza Slices 3/4 Illustration */}
            <div className="bg-[#3c4233] p-6 rounded-3xl border-2 border-[#2d3226] text-white flex flex-col sm:flex-row items-center justify-around gap-6 text-center">
              {/* Pizza Sliced SVG (4 Parts, 3 Highlighted) */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  {/* Slice 1 (Highlighted 1/4) */}
                  <path d="M50 50 L50 5 A45 45 0 0 1 95 50 Z" fill="#F4C95D" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Slice 2 (Highlighted 1/4) */}
                  <path d="M50 50 L95 50 A45 45 0 0 1 50 95 Z" fill="#F4C95D" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Slice 3 (Highlighted 1/4) */}
                  <path d="M50 50 L50 95 A45 45 0 0 1 5 L50 Z" fill="#F4C95D" stroke="#FFFFFF" strokeWidth="2" />
                  {/* Slice 4 (Empty / Eaten 1/4) */}
                  <path d="M50 50 L5 50 A45 45 0 0 1 50 5 Z" fill="#2d3226" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" strokeDasharray="3 3" />
                  
                  {/* Toppings on Highlighted Slices */}
                  <circle cx="70" cy="30" r="4" fill="#D98262" />
                  <circle cx="70" cy="70" r="4" fill="#D98262" />
                  <circle cx="30" cy="70" r="4" fill="#D98262" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-[#4A3728]/90 text-amber-300 font-bold text-xs px-2 py-1 rounded-md shadow-md">
                    3/4 Keju
                  </span>
                </div>
              </div>

              {/* Fraction Description Callout */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
                <div className="text-4xl sm:text-5xl font-serif-title font-black text-amber-300 tracking-wider">
                  3 / 4
                </div>
                <div className="bg-[#b37446] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-xl shadow-sm">
                  3 daripada 4 bahagian
                </div>
                <p className="text-xs text-[#d3dac8] font-medium max-w-xs mt-1">
                  Pilih 3 keping pizza yang telah dipotong 4 bahagian sama besar!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 10. REKOD KEDAI */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F4C95D] shadow-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <Trophy className="w-7 h-7 text-[#F4C95D]" />
              <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-[#4A3728]">
                REKOD KEDAI
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {/* Pizza Siap */}
              <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F6C7A8] text-center">
                <span className="text-2xl block mb-1">🍕</span>
                <span className="text-xs font-bold text-[#4A3728]/70 block">Pizza Siap</span>
                <span className="text-2xl font-rounded font-extrabold text-[#D98262]">{records.pizzasMade}</span>
              </div>

              {/* Bintang */}
              <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F6C7A8] text-center">
                <span className="text-2xl block mb-1">⭐</span>
                <span className="text-xs font-bold text-[#4A3728]/70 block">Bintang</span>
                <span className="text-2xl font-rounded font-extrabold text-[#F4C95D]">{records.stars}</span>
              </div>

              {/* Syiling */}
              <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F6C7A8] text-center">
                <span className="text-2xl block mb-1">🪙</span>
                <span className="text-xs font-bold text-[#4A3728]/70 block">Syiling</span>
                <span className="text-2xl font-rounded font-extrabold text-[#A9C5A0]">{records.coins}</span>
              </div>

              {/* Rekod Terbaik */}
              <div className="bg-[#FFF8E8] p-4 rounded-2xl border border-[#F6C7A8] text-center">
                <span className="text-2xl block mb-1">🏆</span>
                <span className="text-xs font-bold text-[#4A3728]/70 block">Rekod Terbaik</span>
                <span className="text-2xl font-rounded font-extrabold text-[#4A3728]">{records.bestScore} <span className="text-xs font-normal">pesanan</span></span>
              </div>
            </div>

            {/* Encouraging status note */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Rekod kedai anda disimpan secara automatik dalam sesi ini!</span>
            </div>
          </div>
        </section>

        {/* 11. REWARD PREVIEW ("APA YANG BOLEH KAMU KUMPUL?") */}
        <section className="bg-gradient-to-r from-[#FFF8E8] via-[#F6C7A8]/30 to-[#FFF8E8] rounded-3xl p-6 sm:p-8 border-2 border-[#F6C7A8] text-center">
          <h3 className="font-serif-title font-bold text-2xl sm:text-3xl text-[#4A3728] mb-2">
            APA YANG BOLEH KAMU KUMPUL?
          </h3>
          <p className="text-sm text-[#4A3728]/80 font-medium mb-6">
            Kembangkan kedai pizza anda dengan mengumpul pelbagai ganjaran hebat!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
            <div className="bg-white p-4 rounded-2xl border border-[#F4C95D] shadow-sm flex flex-col items-center">
              <span className="text-3xl mb-1">⭐</span>
              <span className="font-rounded font-bold text-sm text-[#4A3728]">Bintang</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-300 shadow-sm flex flex-col items-center">
              <span className="text-3xl mb-1">🪙</span>
              <span className="font-rounded font-bold text-sm text-[#4A3728]">Syiling</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-red-300 shadow-sm flex flex-col items-center">
              <span className="text-3xl mb-1">🔥</span>
              <span className="font-rounded font-bold text-sm text-[#4A3728]">Kombo</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-purple-300 shadow-sm flex flex-col items-center">
              <span className="text-3xl mb-1">🏆</span>
              <span className="font-rounded font-bold text-sm text-[#4A3728]">Rekod</span>
            </div>
          </div>

          <p className="font-serif-title italic font-bold text-lg text-[#D98262]">
            “Cuba pecahkan rekod kamu sendiri!”
          </p>
        </section>
      </main>

      {/* 18. PERALIHAN TRANSITION MODAL (MULA BERMAIN CLICKED) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-4"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="text-8xl mb-6"
            >
              🍕
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-serif-title font-bold text-3xl sm:text-4xl text-amber-300 text-center tracking-wide"
            >
              ✨ PESANAN PERTAMA MENUNGGU!
            </motion.div>

            <p className="text-sm sm:text-base text-gray-300 font-medium mt-2">
              Dapur Pizza Pecahan Sedang Disediakan...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
