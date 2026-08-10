import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Dish } from '../types';
import { sounds } from '../utils/audio';
import chefAlyaCookingImg from '../assets/images/chef_alya_cooking_1785319699414.jpg';
import { Star, Sparkles, ChefHat, Flame, Utensils, CheckCircle2, ArrowRight } from 'lucide-react';

interface CookingAnimationModalProps {
  dish: Dish;
  onClose: () => void;
  onGoToDiningTable: () => void;
}

export const CookingAnimationModal: React.FC<CookingAnimationModalProps> = ({
  dish,
  onClose,
  onGoToDiningTable,
}) => {
  // Cooking animation phases: 'mixing' (0-2.5s) -> 'cooking' (2.5-5s) -> 'ready' (5s+)
  const [cookingStage, setCookingStage] = useState<'mixing' | 'cooking' | 'ready'>('mixing');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    // Play dish-specific cooking sound based on dish type
    if (dish.id === 'kek-coklat') {
      sounds.playBakingSound(3.0);
    } else if (dish.id === 'sirap-bandung') {
      sounds.playLiquidPouringSound(3.0);
    } else {
      // Ayam Crispy & Karipap (Frying)
      sounds.playFryingSound(3.0);
    }

    // Progress bar animation ticker
    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Stage 1 -> Stage 2
    const timer1 = setTimeout(() => {
      setCookingStage('cooking');
      // Trigger dish sound again during active stove phase
      if (dish.id === 'kek-coklat') {
        sounds.playBakingSound(2.5);
      } else if (dish.id === 'sirap-bandung') {
        sounds.playLiquidPouringSound(2.5);
      } else {
        sounds.playFryingSound(2.5);
      }
    }, 2400);

    // Stage 2 -> Stage 3 (Final Dish Reveal)
    const timer2 = setTimeout(() => {
      setCookingStage('ready');
      sounds.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#A67C52', '#5A5A40', '#F2E8CF', '#EFEAE1', '#FFD700'],
      });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [dish.id]);

  const handleSkipAnimation = () => {
    setCookingStage('ready');
    setProgressPercent(100);
    sounds.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-[#F7F3ED] rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-[#A67C52] shadow-2xl text-center relative overflow-hidden my-auto"
      >
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-[#EFEAE1] px-3 py-1 rounded-full border border-[#D6CEBE] text-xs font-bold text-[#5A5A40]">
            <Sparkles className="w-4 h-4 text-[#A67C52] animate-spin" />
            <span>Simulasi Dapur Memasak Chef Alya</span>
          </div>

          {cookingStage !== 'ready' && (
            <button
              onClick={handleSkipAnimation}
              className="text-[11px] font-bold text-[#A67C52] hover:text-[#5A5A40] underline cursor-pointer"
            >
              Lompat Animasi ⏩
            </button>
          )}
        </div>

        {/* Dynamic Cooking Stage Graphic Animation */}
        <div className="relative min-h-[260px] flex items-center justify-center my-4 bg-[#EFEAE1] rounded-2xl border-2 border-[#D6CEBE] p-4 shadow-inner overflow-hidden">
          {/* Subtle Stovetop Grid in Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <AnimatePresence mode="wait">
            {/* STAGE 1: MIXING INGREDIENTS */}
            {cookingStage === 'mixing' && (
              <motion.div
                key="mixing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {/* Mixing Bowl */}
                  <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    className="w-32 h-24 rounded-b-full bg-gradient-to-b from-[#D6CEBE] to-[#A67C52] border-4 border-[#5A5A40] shadow-lg relative flex items-center justify-center mt-8"
                  >
                    {/* Liquid Mixture inside bowl */}
                    <div className="w-28 h-6 bg-[#F2E8CF] rounded-full border border-[#A67C52] absolute top-2 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="text-lg"
                      >
                        🌀
                      </motion.div>
                    </div>

                    {/* Animated Whisk / Spoon */}
                    <motion.div
                      animate={{ rotate: [-30, 30, -30], x: [-15, 15, -15] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="absolute -top-10 text-4xl origin-bottom"
                    >
                      🥄
                    </motion.div>
                  </motion.div>

                  {/* Flying Fraction Badges into the Bowl */}
                  {dish.tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -80, x: (i - 1) * 40 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [-60, 20],
                        x: [(i - 1) * 30, 0],
                        scale: [0.8, 1.1, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: i * 0.4,
                      }}
                      className="absolute top-2 font-black text-xs text-white bg-[#5A5A40] px-2 py-0.5 rounded-full border border-white shadow"
                    >
                      {task.numerator}/{task.denominator}
                    </motion.div>
                  ))}

                  {/* Rising Sparkles / Flour Dust */}
                  <motion.div
                    animate={{ y: [-10, -40], opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute -top-4 text-xl"
                  >
                    ✨
                  </motion.div>
                </div>

                <span className="text-xs font-bold text-[#5A5A40] mt-3 animate-pulse">
                  🥣 Menyukat & Mengadun Bahan Pecahan...
                </span>
              </motion.div>
            )}

            {/* STAGE 2: CHEF ALYA COOKING ON STOVETOP */}
            {cookingStage === 'cooking' && (
              <motion.div
                key="cooking"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col sm:flex-row items-center gap-4 p-2"
              >
                {/* Cartoon Chef Alya Image */}
                <div className="relative">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#A67C52] overflow-hidden shadow-md bg-white">
                    <img
                      src={chefAlyaCookingImg}
                      alt="Chef Alya Memasak"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute -bottom-2 right-0 bg-[#5A5A40] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
                    Chef Alya 👩‍🍳
                  </span>
                </div>

                {/* Sizzling Cooking Pan & Heat FX */}
                <div className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center my-2">
                    <motion.div
                      animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="text-5xl filter drop-shadow"
                    >
                      🍳
                    </motion.div>

                    {/* Flames & Heat Waves */}
                    <div className="absolute -bottom-3 flex items-center gap-1">
                      <motion.div
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 0.4 }}
                      >
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1.2, 0.8, 1.2] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                      >
                        <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
                      >
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                      </motion.div>
                    </div>

                    {/* Steam Effects */}
                    <motion.div
                      animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.9 }}
                      className="absolute -top-6 text-xl"
                    >
                      ♨️
                    </motion.div>
                  </div>

                  <span className="text-xs font-bold text-[#3A3A30] mt-3 animate-bounce">
                    🔥 Sizzling! Memasak {dish.title}...
                  </span>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: FINAL DISH REVEAL */}
            {cookingStage === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative group">
                  {/* Glowing Aura Ring */}
                  <div className="absolute inset-0 bg-[#A67C52]/20 rounded-full blur-xl animate-pulse" />

                  {/* Real Food Photo Plate */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#A67C52] overflow-hidden shadow-2xl bg-white relative z-10 p-1"
                  >
                    {dish.realImage ? (
                      <img
                        src={dish.realImage}
                        alt={dish.title}
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        {dish.imageIcon}
                      </div>
                    )}
                  </motion.div>

                  {/* Gold Badge Overlay */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#5A5A40] text-white text-xs font-extrabold px-3 py-1 rounded-full border-2 border-white shadow-md z-20 flex items-center gap-1 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F2E8CF]" />
                    <span>Siap Dipersembahkan!</span>
                  </motion.div>
                </div>

                <p className="text-xs font-bold text-[#A67C52] mt-4 uppercase tracking-wider">
                  Sempurna & Beraroma Lazat!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full my-3">
          <div className="flex justify-between items-center text-xs font-bold text-[#5A5A40] mb-1">
            <span>Proses Memasak</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-[#D6CEBE] rounded-full overflow-hidden border border-[#A67C52]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#A67C52] via-[#5A5A40] to-[#A67C52]"
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Title & Congratulations */}
        <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-[#3A3A30] mt-2">
          {dish.title} Berjaya Dimasak!
        </h3>
        <p className="text-xs text-[#5A5A50] font-semibold mt-1">
          Semua bahan pecahan ({dish.tasks.length}/{dish.tasks.length}) disukat dengan cemerlang!
        </p>

        {/* 3 Bouncing Gold Stars */}
        <div className="flex items-center justify-center gap-1 my-3">
          {[1, 2, 3].map((star) => (
            <motion.div
              key={star}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + star * 0.2, type: 'spring', stiffness: 300 }}
            >
              <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-[#A67C52] text-[#A67C52] filter drop-shadow-sm" />
            </motion.div>
          ))}
        </div>

        {/* Chef Dialogue Box */}
        <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-[#D6CEBE] text-left my-3 flex items-center gap-3 shadow-xs">
          <img
            src={chefAlyaCookingImg}
            alt="Chef Alya"
            className="w-12 h-12 rounded-xl border-2 border-[#A67C52] object-cover flex-shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="text-xs text-[#3A3A30]">
            <span className="font-bold text-[#5A5A40] block mb-0.5">Chef Alya:</span>
            "Wah, hebatnya adik! {dish.title} ini kelihatan sungguh melekalkan dan beraroma wangi. Terima kasih kerana menguasai sukatan pecahan dengan cemerlang!"
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <button
            onClick={onGoToDiningTable}
            className="w-full sm:w-1/2 bg-[#5A5A40] hover:bg-[#4A4A33] text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5 border border-white/20 transition-transform hover:scale-105"
          >
            <Utensils className="w-4 h-4 text-[#F2E8CF]" />
            <span>Lihat Meja Hidangan Mewah</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-1/2 bg-[#EFEAE1] hover:bg-[#D6CEBE] text-[#3A3A30] font-bold py-3 px-4 rounded-2xl text-xs border border-[#A67C52] shadow-sm cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
          >
            <ChefHat className="w-4 h-4 text-[#A67C52]" />
            <span>Pilih Hidangan Seterusnya</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
