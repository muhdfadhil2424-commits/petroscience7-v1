import React from 'react';
import { motion } from 'motion/react';
import { AlyaCharacter } from './AlyaCharacter';

interface MascotCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'w-36 h-36',
    md: 'w-56 h-56',
    lg: 'w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}>
      {/* Soft glowing radial backdrop */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F4C95D]/30 via-[#F6C7A8]/40 to-[#A9C5A0]/30 blur-2xl pointer-events-none"
      />

      {/* Floating background decorative portal rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border-2 border-dashed border-[#F4C95D]/40 pointer-events-none"
      />

      {/* Main Mascot Image */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full flex items-center justify-center drop-shadow-2xl"
      >
        <AlyaCharacter mood="happy" size="lg" className="w-full h-full" />

        {/* Floating Sparkles around mascot */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 right-8 text-2xl"
        >
          ✨
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-1/4 -left-4 bg-[#F4C95D] text-[#4A3728] font-rounded font-bold px-3 py-1 rounded-full text-sm shadow-md border-2 border-white"
        >
          1/2 🍕
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.25, 1], y: [0, 6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-10 -right-2 bg-[#A9C5A0] text-[#4A3728] font-rounded font-bold px-3 py-1 rounded-full text-sm shadow-md border-2 border-white"
        >
          3/4 ⭐
        </motion.div>
      </motion.div>
    </div>
  );
};
