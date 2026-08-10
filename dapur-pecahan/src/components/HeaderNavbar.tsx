import React, { useState } from 'react';
import { Volume2, VolumeX, Award, BookOpen, RotateCcw, Sparkles, Music, Music2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import chefAlyaImg from '../assets/images/chef_alya_avatar_1785314793438.jpg';

interface HeaderNavbarProps {
  totalStars: number;
  completedCount: number;
  onOpenDskp: () => void;
  onOpenCertificate: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  totalStars,
  completedCount,
  onOpenDskp,
  onOpenCertificate,
  onReset,
  onGoHome,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [isBgmOn, setIsBgmOn] = useState<boolean>(sounds.getBgmOn());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    setIsBgmOn(sounds.getBgmOn());
  };

  const handleToggleBgm = () => {
    const bgmState = sounds.toggleBGM();
    setIsBgmOn(bgmState);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#5A5A40] text-white shadow-md border-b-2 border-[#4A4A33] px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand logo & title */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#A67C52] text-white flex items-center justify-center border-2 border-white/30 group-hover:scale-105 transition-transform shadow-md flex-shrink-0">
            <img src={chefAlyaImg} alt="Chef Alya" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-serif italic tracking-wide text-white flex items-center gap-2">
              Dapur Pecahan Chef Alya
              <span className="bg-[#A67C52] text-amber-100 text-[10px] px-2 py-0.5 rounded-full font-sans not-italic font-extrabold border border-white/20">
                Tahun 3
              </span>
            </h1>
            <p className="text-[11px] text-[#F2E8CF]/80 font-medium hidden sm:block">
              Simulasi Memasak & Matematik DSKP 3.1
            </p>
          </div>
        </button>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Total Stars Counter */}
          <div className="flex items-center gap-1.5 bg-[#4A4A33] border border-white/10 px-3 py-1.5 rounded-xl text-[#F2E8CF] text-xs font-bold shadow-inner">
            <span className="text-amber-300 text-base">⭐</span>
            <span>{totalStars} Bintang</span>
          </div>

          {/* Dishes Completion Badge */}
          <div className="flex items-center gap-1 bg-[#A67C52] border border-white/20 px-3 py-1.5 rounded-xl text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#F2E8CF]" />
            <span>{completedCount}/4 Hidangan</span>
          </div>

          {/* DSKP Guide Book Button */}
          <button
            onClick={onOpenDskp}
            className="flex items-center gap-1.5 bg-[#4A4A33] hover:bg-[#A67C52] text-[#F2E8CF] px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 transition-colors shadow-sm cursor-pointer"
            title="Kamus & Panduan DSKP 3.1 Pecahan"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F2E8CF]" />
            <span className="hidden md:inline">Nota DSKP</span>
          </button>

          {/* Certificate Button */}
          {completedCount === 4 && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#A67C52] to-[#8C6239] text-white font-extrabold px-3 py-1.5 rounded-xl text-xs border border-amber-200 transition-transform hover:scale-105 shadow-md cursor-pointer animate-pulse"
            >
              <Award className="w-4 h-4 text-[#F2E8CF]" />
              <span>Sijil Master Chef</span>
            </button>
          )}

          {/* Cozy Music BGM Toggle */}
          <button
            onClick={handleToggleBgm}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isBgmOn && !isMuted
                ? 'bg-[#A67C52] text-white border-white/20'
                : 'bg-[#4A4A33] text-[#F2E8CF]/60 border-white/10'
            }`}
            title={isBgmOn ? 'Matikan Lagu Nyaman' : 'Pasang Lagu Nyaman Dapur'}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmOn && !isMuted ? 'text-amber-200 animate-bounce' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">Lagu Nyaman</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-[#4A4A33] hover:bg-[#A67C52] text-[#F2E8CF] border border-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'Buka Suara' : 'Bisu Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Reset Progress */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-black/20 hover:bg-rose-900/60 text-[#F2E8CF]/80 hover:text-rose-200 border border-white/10 transition-colors cursor-pointer"
            title="Mula Semula Simulasi"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
