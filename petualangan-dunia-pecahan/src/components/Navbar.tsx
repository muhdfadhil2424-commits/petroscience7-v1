import React from 'react';
import { Volume2, VolumeX, Settings, Trophy, Star, BookOpen, User, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { playSfx } from '../utils/audio';
import { AlyaCharacter } from './AlyaCharacter';
import { StudentProfile } from '../types';

interface NavbarProps {
  stars: number;
  completedChallenges: number;
  soundEnabled: boolean;
  student?: StudentProfile | null;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay?: () => void;
  onOpenStudentProfile?: () => void;
  onOpenTeacherLogin?: () => void;
  onOpenCertificate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stars,
  completedChallenges,
  soundEnabled,
  student,
  onToggleSound,
  onOpenSettings,
  onOpenHowToPlay,
  onOpenStudentProfile,
  onOpenTeacherLogin,
  onOpenCertificate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-[#3c4233] text-white shadow-md border-b border-[#2d3226]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Avatar + Game Title + Subtitle */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#525a46] p-0.5 overflow-hidden border border-[#6d775d] shadow-inner flex-shrink-0 flex items-center justify-center">
            <AlyaCharacter size="sm" className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif-title font-bold text-base sm:text-lg md:text-xl text-white tracking-wide leading-tight">
                Petualangan Dunia Pecahan
              </span>
              <span className="bg-[#b37446] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                Tahun 3
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-[#d3dac8] font-medium block leading-tight mt-0.5">
              Simulasi & Permainan Matematik DSKP 3.1
            </span>
          </div>
        </div>

        {/* Right Side: Status Pills & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Active Student Badge Pill */}
          {student && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (onOpenStudentProfile) {
                  playSfx('click', soundEnabled);
                  onOpenStudentProfile();
                }
              }}
              className="flex items-center gap-1.5 bg-[#b37446] hover:bg-[#a16438] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-sm border border-[#d28a5a] cursor-pointer"
              title="Tukar Profil Murid"
            >
              <User className="w-3.5 h-3.5 text-amber-200" />
              <span className="max-w-[120px] truncate">{student.nama}</span>
              <span className="text-[10px] bg-amber-900/60 px-1.5 py-0.2 rounded font-mono text-amber-200">
                {student.kelas}
              </span>
            </motion.button>
          )}

          {/* Teacher Login / Dashboard Button */}
          {onOpenTeacherLogin && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenTeacherLogin();
              }}
              className="flex items-center gap-1 bg-[#2d3226] hover:bg-[#23271e] text-amber-300 px-2.5 py-1.5 rounded-xl border border-[#4d5442] text-xs font-bold transition-colors cursor-pointer"
              title="Log Masuk Guru"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">LOG MASUK GURU</span>
            </motion.button>
          )}

          {/* Stars Status Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-1.5 bg-[#2d3226] px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold text-amber-300 shadow-inner"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{stars} / 27 Bintang</span>
          </motion.div>

          {/* Challenges Status Pill */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="hidden md:flex items-center gap-1.5 bg-[#b37446]/90 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-200" />
            <span>{completedChallenges} / 9 Cabaran</span>
          </motion.div>

          {/* Nota Pecahan / How to Play Button */}
          {onOpenHowToPlay && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenHowToPlay();
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#2d3226] hover:bg-[#23271e] text-white px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Nota Pecahan</span>
            </motion.button>
          )}

          {/* Sijil Pencapaian Button */}
          {onOpenCertificate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenCertificate();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm cursor-pointer transition-all ${
                completedChallenges >= 9
                  ? 'bg-gradient-to-r from-amber-500 to-[#D98262] text-white border border-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                  : 'bg-[#2d3226] hover:bg-[#23271e] text-amber-200 border border-[#4d5442]'
              }`}
              title={completedChallenges >= 9 ? 'Lihat Sijil Master Pecahan Anda!' : 'Selesaikan 9 Cabaran Untuk Sijil'}
            >
              {completedChallenges >= 9 ? (
                <Trophy className="w-4 h-4 text-amber-200" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{completedChallenges >= 9 ? '🏆 Sijil' : '📜 Sijil'}</span>
            </motion.button>
          )}

          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              onToggleSound();
              playSfx('click', !soundEnabled);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2d3226] hover:bg-[#23271e] text-amber-300 border border-[#4d5442] flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? 'Matikan Bunyi' : 'Hidupkan Bunyi'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>

          {/* Settings Button */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 30 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playSfx('click', soundEnabled);
              onOpenSettings();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2d3226] hover:bg-[#23271e] text-amber-300 border border-[#4d5442] flex items-center justify-center transition-colors cursor-pointer"
            title="Tetapan"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};


