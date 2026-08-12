import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, VolumeX, Unlock, RotateCcw, X, Check } from 'lucide-react';
import { playSfx } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  unlockAllWorlds: boolean;
  onToggleSound: () => void;
  onToggleUnlockAll: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  soundEnabled,
  unlockAllWorlds,
  onToggleSound,
  onToggleUnlockAll,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#F6C7A8]"
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

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F6C7A8]/30 border border-[#F6C7A8] flex items-center justify-center text-[#4A3728]">
              <Settings className="w-6 h-6 text-[#D98262]" />
            </div>
            <div>
              <h2 className="font-serif-title font-bold text-2xl text-[#4A3728]">
                TETAPAN
              </h2>
              <p className="font-rounded font-semibold text-xs text-[#D98262]">
                Tetapan Permainan & Mod Guru
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8E8] border border-[#F6C7A8]">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#D98262]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <span className="font-rounded font-bold text-sm text-[#4A3728] block">
                    Kesan Bunyi (SFX)
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {soundEnabled ? 'Bunyi dihidupkan' : 'Bunyi dimatikan'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onToggleSound();
                  playSfx('click', !soundEnabled);
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  soundEnabled ? 'bg-[#A9C5A0]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Unlock All Worlds Toggle (Dev / Teacher mode) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF8E8] border border-[#F6C7A8]">
              <div className="flex items-center gap-3">
                <Unlock className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="font-rounded font-bold text-sm text-[#4A3728] block">
                    Mod Bebas / Buka Semua
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    Pilih mana-mana dunia
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  playSfx('click', soundEnabled);
                  onToggleUnlockAll();
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  unlockAllWorlds ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    unlockAllWorlds ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reset Progress Section */}
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-600" />
                  <span className="font-rounded font-bold text-sm text-red-900">
                    Set Semula Kemajuan
                  </span>
                </div>
              </div>
              <p className="text-xs text-red-700 font-semibold mb-3">
                Memadam semua bintang dan cabaran yang diselesaikan.
              </p>

              {showConfirmReset ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSfx('chime', soundEnabled);
                      onResetProgress();
                      setShowConfirmReset(false);
                    }}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-rounded font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" /> YA, SET SEMULA
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-rounded font-bold text-xs rounded-xl cursor-pointer"
                  >
                    BATAL
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full py-2 bg-white hover:bg-red-100 text-red-700 font-rounded font-bold text-xs rounded-xl border border-red-300 transition-colors cursor-pointer"
                >
                  SET SEMULA KEMAJUAN
                </button>
              )}
            </div>
          </div>

          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-xs font-rounded font-bold text-gray-400">
              Petualangan Dunia Pecahan v1.0 • Tahun 3
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
