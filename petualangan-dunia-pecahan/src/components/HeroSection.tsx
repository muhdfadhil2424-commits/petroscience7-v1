import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Sparkles } from 'lucide-react';
import { MascotCharacter } from './MascotCharacter';
import { playSfx } from '../utils/audio';
import confetti from 'canvas-confetti';
import heroBannerImg from '../assets/images/game_hero_banner_1785464312103.jpg';

interface HeroSectionProps {
  soundEnabled: boolean;
  onStartAdventure: () => void;
  onOpenHowToPlay: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  soundEnabled,
  onStartAdventure,
  onOpenHowToPlay,
}) => {
  const handleMainCtaClick = () => {
    playSfx('fanfare', soundEnabled);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F4C95D', '#D98262', '#A9C5A0', '#F6C7A8'],
      });
    } catch {
      // ignore
    }
    onStartAdventure();
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#2d3226]">
      {/* Full-Width Panoramic Hero Background Image */}
      <div className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[540px] flex items-center py-8 px-4 sm:px-8">
        <img
          src={heroBannerImg}
          alt="Hero Banner Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />

        {/* Dark Vignette and Gradient Overlay for Depth and Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8E8] via-transparent to-black/40" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Side: Dark Glassmorphic Banner Card (Matching Reference Image) */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#2a3023]/85 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-[2rem] border border-white/15 shadow-2xl text-white max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#b37446] text-amber-100 font-rounded font-bold text-xs sm:text-sm mb-4 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pilih Permainan Dunia Pecahan</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="font-serif-title font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-amber-100 tracking-tight leading-tight mb-3">
                Selamat Datang ke Petualangan Dunia Pecahan!
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-[#d3dac8] font-medium leading-relaxed mb-6 max-w-2xl">
                Sila pilih 1 dunia permainan yang ingin anda teroka terlebih dahulu. Kumpul bintang menggunakan kemahiran pecahan Matematik Darjah 3!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMainCtaClick}
                  className="w-full sm:w-auto bg-[#D98262] hover:bg-[#c77253] text-white px-7 py-3.5 rounded-2xl text-base sm:text-lg font-rounded font-bold shadow-lg border-b-4 border-[#96492d] active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2.5 cursor-pointer transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>MULA BERMAIN</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    onOpenHowToPlay();
                  }}
                  className="w-full sm:w-auto bg-[#252a1e]/90 hover:bg-[#20241a] text-amber-200 px-6 py-3.5 rounded-2xl text-base sm:text-lg font-rounded font-bold border border-white/20 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <BookOpen className="w-5 h-5 text-amber-300" />
                  <span>CARA BERMAIN</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Mascot Character Visual */}
          <div className="lg:col-span-4 flex justify-center items-center mt-4 lg:mt-0">
            <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
              <MascotCharacter size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

