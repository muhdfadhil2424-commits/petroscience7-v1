import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, CheckCircle2 } from 'lucide-react';
import { WorldInfo } from '../types';
import { playSfx } from '../utils/audio';

interface LockedWorldModalProps {
  world: WorldInfo | null;
  soundEnabled: boolean;
  onClose: () => void;
}

export const LockedWorldModal: React.FC<LockedWorldModalProps> = ({
  world,
  soundEnabled,
  onClose,
}) => {
  if (!world) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#D98262] text-center"
        >
          {/* Close button */}
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-3xl bg-red-100 border-2 border-red-300 flex items-center justify-center text-3xl mb-4 shadow-inner">
            🔒
          </div>

          <h3 className="font-rounded font-extrabold text-2xl text-[#4A3728] mb-2">
            Dunia ini belum dibuka.
          </h3>

          <p className="font-rounded font-semibold text-sm text-[#4A3728]/80 mb-6 bg-[#FFF8E8] p-3 rounded-2xl border border-[#F6C7A8]">
            Lengkapkan cabaran sebelumnya dahulu! 😊
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              playSfx('pop', soundEnabled);
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#F4C95D] hover:bg-[#E2A62C] text-[#4A3728] font-rounded font-bold text-base shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>FAHAM!</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
