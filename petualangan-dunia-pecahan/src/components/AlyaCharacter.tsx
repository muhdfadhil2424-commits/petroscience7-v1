import React from 'react';
import { motion } from 'motion/react';

interface AlyaCharacterProps {
  mood?: 'happy' | 'thinking' | 'encouraging' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AlyaCharacter: React.FC<AlyaCharacterProps> = ({
  mood = 'happy',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      animate={
        mood === 'celebrating'
          ? { y: [0, -8, 0], rotate: [0, -5, 5, 0] }
          : mood === 'thinking'
          ? { rotate: [-2, 2, -2] }
          : { y: [0, -3, 0] }
      }
      transition={{
        duration: mood === 'celebrating' ? 0.6 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Soft Background Sparkle Glow */}
        <circle cx="60" cy="60" r="54" fill="url(#bgGlow)" />

        {/* Cute Pastel Hair Back */}
        <path
          d="M25 65 C20 40, 35 15, 60 15 C85 15, 100 40, 95 65 C95 85, 85 95, 60 95 C35 95, 25 85, 25 65 Z"
          fill="#3E2723"
        />

        {/* Chibi Face Circle */}
        <circle cx="60" cy="62" r="34" fill="#FFE0BD" stroke="#3E2723" strokeWidth="2.5" />

        {/* Cute Pink Cheeks */}
        <ellipse cx="42" cy="68" rx="6" ry="3.5" fill="#FF8A80" opacity="0.65" />
        <ellipse cx="78" cy="68" rx="6" ry="3.5" fill="#FF8A80" opacity="0.65" />

        {/* Cute Pastel Hair Front / Bangs */}
        <path
          d="M30 48 C40 32, 52 38, 60 45 C68 38, 80 32, 90 48 C85 36, 75 25, 60 25 C45 25, 35 36, 30 48 Z"
          fill="#5D4037"
        />

        {/* Star Hair Clip */}
        <path
          d="M34 38 L36 42 L40 42 L37 45 L38 49 L34 46 L30 49 L31 45 L28 42 L32 42 Z"
          fill="#FFD54F"
          stroke="#FFA000"
          strokeWidth="1"
        />

        {/* Sparkly Big Anime Eyes */}
        <g>
          {/* Eye Left */}
          <ellipse cx="45" cy="58" rx="5" ry="7" fill="#3E2723" />
          <circle cx="43.5" cy="55.5" r="2.2" fill="#FFFFFF" />
          <circle cx="46.5" cy="60" r="1.1" fill="#FFFFFF" />

          {/* Eye Right */}
          <ellipse cx="75" cy="58" rx="5" ry="7" fill="#3E2723" />
          <circle cx="73.5" cy="55.5" r="2.2" fill="#FFFFFF" />
          <circle cx="76.5" cy="60" r="1.1" fill="#FFFFFF" />

          {/* Eyelashes */}
          <path d="M40 52 C43 50, 48 51, 50 53" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M70 53 C72 51, 77 50, 80 52" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Eyebrows */}
        <path
          d={mood === 'thinking' ? 'M40 48 Q45 45 50 48' : 'M40 47 Q45 44 50 47'}
          stroke="#3E2723"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={mood === 'thinking' ? 'M70 48 Q75 51 80 48' : 'M70 47 Q75 44 80 47'}
          stroke="#3E2723"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheerful Mouth according to Mood */}
        {mood === 'celebrating' ? (
          <path d="M52 68 Q60 78 68 68 Z" fill="#E53935" stroke="#3E2723" strokeWidth="1.5" />
        ) : mood === 'thinking' ? (
          <path d="M54 70 Q60 67 66 70" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M52 67 Q60 74 68 67" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* Small Cute Apron Outfit with 1/2 Badge */}
        <path
          d="M40 88 C40 82, 80 82, 80 88 L84 108 C84 112, 36 112, 36 108 Z"
          fill="#E0F2FE"
          stroke="#0284C7"
          strokeWidth="2"
        />
        {/* Fraction Badge 1/2 */}
        <rect x="52" y="90" width="16" height="14" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.2" />
        <text x="60" y="100" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0284C7" fontFamily="sans-serif">
          ½
        </text>

        {/* Waving Hand */}
        <motion.g
          animate={
            mood === 'celebrating' || mood === 'happy'
              ? { rotate: [0, 15, -10, 0] }
              : { rotate: [0, 5, 0] }
          }
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '88px 90px' }}
        >
          <ellipse cx="88" cy="88" rx="5" ry="5" fill="#FFE0BD" stroke="#3E2723" strokeWidth="1.5" />
        </motion.g>

        {/* Gradients */}
        <defs>
          <radialGradient id="bgGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Live Active Glow Badge */}
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
      </span>
    </motion.div>
  );
};
