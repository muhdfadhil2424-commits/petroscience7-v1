import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { AlyaCharacter } from './AlyaCharacter';
import { playSfx } from '../utils/audio';

export interface TutorialStepConfig {
  stepIndex: number;
  targetSelector: string | null;
  title: string;
  message: string;
  subMessage?: string;
  mood: 'happy' | 'thinking' | 'encouraging' | 'celebrating';
  actionRequired?: 'open_notes';
}

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  // STEP 1 — SELAMAT DATANG
  {
    stepIndex: 0,
    targetSelector: null,
    title: 'Hai! Saya Alya! 🌟',
    message: 'Selamat datang ke Kembara Dunia Pecahan!\n\nJom Alya tunjukkan cara bermain sebelum kita mula.',
    subMessage: 'Tekan butang Seterusnya ya!',
    mood: 'happy',
  },
  // STEP 2 — PERKENALKAN NOTA PECAHAN
  {
    stepIndex: 1,
    targetSelector: '[data-alya="nota-pecahan"]',
    title: 'Buku Nota Pecahan 📚',
    message: 'Ini tempat belajar pecahan!\n\nAda gambar comel, contoh mudah, dan aktiviti menarik.',
    subMessage: 'Tekan butang Buka Nota untuk tengok.',
    mood: 'encouraging',
    actionRequired: 'open_notes',
  },
  // STEP 3 — DIALOG ALYA SELEPAS KELUAR NOTA
  {
    stepIndex: 2,
    targetSelector: null,
    title: 'Bagus Sekali! 🌟',
    message: 'Kamu boleh buka nota ini bila-bila masa kalau perlukan rujukan.\n\nSekarang jom tengok permainan pula!',
    subMessage: 'Tekan Seterusnya untuk pilih dunia.',
    mood: 'celebrating',
  },
  // STEP 4 — PILIH PERMAINAN
  {
    stepIndex: 3,
    targetSelector: '[data-alya="game-selection"]',
    title: 'Pilih Permainan 🎮',
    message: 'Ada 3 dunia seronok:\n\n🏟️ Arena Pecahan\n🍕 Dapur Pecahan\n🌳 Dunia Pixel',
    subMessage: 'Pilih dunia kegemaran kamu!',
    mood: 'encouraging',
  },
  // STEP 5 — STEP PERMAINAN & CABARAN
  {
    stepIndex: 4,
    targetSelector: '[data-alya="challenge"]',
    title: 'Kumpul Bintang ⭐',
    message: 'Jawab soalan dengan betul untuk kumpul bintang dan lencana wira!',
    subMessage: 'Baca arahan dengan teliti sebelum mula ya.',
    mood: 'thinking',
  },
  // STEP 6 — STEP ALYA (BANTUAN & PETUNJUK)
  {
    stepIndex: 5,
    targetSelector: '[data-alya="alya-button"]',
    title: 'Tanya Alya Bila-Bila Masa 💗',
    message: 'Kalau perlukan bantuan, tekan Alya!\n\nAlya akan bagi hint untuk tolong kamu berfikir.',
    subMessage: 'Alya sentiasa ada untuk bantu kamu!',
    mood: 'happy',
  },
  // STEP 7 — STEP AKHIR
  {
    stepIndex: 6,
    targetSelector: null,
    title: 'Jom Mula Main! 🎉',
    message: 'Kamu sudah bersedia untuk memulakan cabaran!\n\nSelamat bermain wira cilik!',
    subMessage: 'Tekan Mula Main untuk teruskan!',
    mood: 'celebrating',
  },
];

interface SpotlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
}

interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface AlyaTutorialProps {
  isOpen: boolean;
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete?: () => void;
  onActionRequired?: (actionType: 'open_notes' | string) => void;
  soundEnabled?: boolean;
}

export const AlyaTutorial: React.FC<AlyaTutorialProps> = ({
  isOpen,
  currentStep,
  onNext,
  onBack,
  onSkip,
  onComplete,
  onActionRequired,
  soundEnabled = true,
}) => {
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [cardRect, setCardRect] = useState<CardRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalSteps = TUTORIAL_STEPS.length;
  const safeStepIndex = Math.min(Math.max(0, currentStep), totalSteps - 1);
  const stepData = TUTORIAL_STEPS[safeStepIndex] || TUTORIAL_STEPS[0];
  const isFirstStep = safeStepIndex === 0;
  const isLastStep = safeStepIndex === totalSteps - 1;
  const isActionStep = stepData.actionRequired === 'open_notes';

  // Measure card position for connecting arrow line
  useEffect(() => {
    if (!isOpen) {
      setCardRect(null);
      return;
    }

    const updateCardRect = () => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        setCardRect({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        });
      }
    };

    updateCardRect();
    const t = setTimeout(updateCardRect, 150);
    window.addEventListener('resize', updateCardRect, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateCardRect);
    };
  }, [isOpen, safeStepIndex]);

  // Track target element & compute spotlight bounds dynamically
  useEffect(() => {
    if (!isOpen) {
      setSpotlightRect(null);
      return;
    }

    const currentSelector = stepData.targetSelector;
    if (!currentSelector) {
      setSpotlightRect(null);
      return;
    }

    let isMounted = true;

    const measureTarget = () => {
      if (!isMounted) return;
      try {
        const el = document.querySelector(currentSelector) as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(el);
          const parsedRad = parseInt(computedStyle.borderRadius, 10);
          const radius = isNaN(parsedRad) ? 16 : Math.max(8, parsedRad);

          setSpotlightRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            radius,
          });
        } else {
          setSpotlightRect(null);
        }
      } catch {
        setSpotlightRect(null);
      }
    };

    // Attempt to scroll target element into viewport smoothly
    try {
      const el = document.querySelector(currentSelector) as HTMLElement | null;
      if (el) {
        // Only scroll if element is not fixed (like floating mascot button)
        const isFixed = window.getComputedStyle(el).position === 'fixed';
        if (!isFixed) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        measureTarget();
        const t1 = setTimeout(measureTarget, 100);
        const t2 = setTimeout(measureTarget, 350);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      } else {
        setSpotlightRect(null);
      }
    } catch {
      setSpotlightRect(null);
    }

    window.addEventListener('scroll', measureTarget, { passive: true });
    window.addEventListener('resize', measureTarget, { passive: true });

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', measureTarget);
      window.removeEventListener('resize', measureTarget);
    };
  }, [isOpen, safeStepIndex, stepData.targetSelector]);

  if (!isOpen) return null;

  const handleNextClick = () => {
    if (isActionStep) {
      // Must open notes
      playSfx('click', soundEnabled);
      if (onActionRequired) {
        onActionRequired('open_notes');
      }
      return;
    }

    if (isLastStep) {
      playSfx('chime', soundEnabled);
      if (onComplete) {
        onComplete();
      } else {
        onNext();
      }
    } else {
      playSfx('pop', soundEnabled);
      onNext();
    }
  };

  const handleBackClick = () => {
    if (isFirstStep) return;
    playSfx('click', soundEnabled);
    onBack();
  };

  const handleSkipClick = () => {
    playSfx('click', soundEnabled);
    onSkip();
  };

  const handleActionClick = () => {
    playSfx('click', soundEnabled);
    if (onActionRequired) {
      onActionRequired('open_notes');
    }
  };

  // Determine card placement so it never covers the spotlighted element
  const padding = 8;
  let cardPositionClass = 'fixed inset-0 flex items-center justify-center p-4'; // default center

  if (spotlightRect) {
    const targetCenterY = spotlightRect.top + spotlightRect.height / 2;
    const windowH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const spaceBelow = windowH - (spotlightRect.top + spotlightRect.height);
    const spaceAbove = spotlightRect.top;

    if (spaceBelow >= 260) {
      cardPositionClass = 'fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-lg';
    } else if (spaceAbove >= 260) {
      cardPositionClass = 'fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 w-[94%] max-w-lg';
    } else if (targetCenterY > windowH / 2) {
      cardPositionClass = 'fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg';
    } else {
      cardPositionClass = 'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg';
    }
  }

  // Calculate SVG arrow connecting line between Alya's card and spotlighted element
  let arrowPath = '';
  if (isActionStep && spotlightRect && cardRect) {
    const targetCenterX = spotlightRect.left + spotlightRect.width / 2;
    const isCardBelow = cardRect.top > spotlightRect.top + spotlightRect.height;

    if (isCardBelow) {
      // Start from top of card, curve to bottom of target
      const startX = cardRect.left + 80;
      const startY = cardRect.top + 5;
      const endX = targetCenterX;
      const endY = spotlightRect.top + spotlightRect.height + padding + 10;
      const controlY = (startY + endY) / 2;
      arrowPath = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;
    } else {
      // Card is above target
      const startX = cardRect.left + 80;
      const startY = cardRect.top + cardRect.height - 5;
      const endX = targetCenterX;
      const endY = spotlightRect.top - padding - 10;
      const controlY = (startY + endY) / 2;
      arrowPath = `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`;
    }
  }

  return (
    <AnimatePresence>
      <div id="alya-tutorial-root" className="fixed inset-0 z-[100] select-none">
        {/* SVG Cutout Mask Dark Overlay */}
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-[90]"
          style={{ width: '100vw', height: '100vh' }}
        >
          <defs>
            <mask id="alya-spotlight-mask" maskUnits="userSpaceOnUse">
              {/* White area keeps the dark overlay visible */}
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Black cutout makes target area 100% transparent */}
              {spotlightRect && (
                <rect
                  x={Math.max(0, spotlightRect.left - padding)}
                  y={Math.max(0, spotlightRect.top - padding)}
                  width={spotlightRect.width + padding * 2}
                  height={spotlightRect.height + padding * 2}
                  rx={spotlightRect.radius}
                  ry={spotlightRect.radius}
                  fill="black"
                />
              )}
            </mask>
            {/* Arrowhead marker for guide pointer */}
            <marker
              id="alya-arrowhead"
              markerWidth="12"
              markerHeight="12"
              refX="8"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,8 L9,4 z" fill="#F4C95D" stroke="#4A3728" strokeWidth="0.5" />
            </marker>
          </defs>

          {/* Darkened Screen Backdrop */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.68)"
            mask="url(#alya-spotlight-mask)"
          />

          {/* Connecting Arrow Line from Alya to Button (Step 2) */}
          {arrowPath && (
            <g className="pointer-events-none">
              <path
                d={arrowPath}
                fill="none"
                stroke="#F4C95D"
                strokeWidth="4"
                strokeDasharray="8 6"
                markerEnd="url(#alya-arrowhead)"
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-pulse"
              />
            </g>
          )}
        </svg>

        {/* Spotlight Outline & Soft Pulse Glow around Target Element */}
        {spotlightRect && (
          <motion.div
            key={`spotlight-${safeStepIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              left: `${spotlightRect.left - padding}px`,
              top: `${spotlightRect.top - padding}px`,
              width: `${spotlightRect.width + padding * 2}px`,
              height: `${spotlightRect.height + padding * 2}px`,
              borderRadius: `${spotlightRect.radius}px`,
              zIndex: 95,
            }}
            className={`border-4 border-[#F4C95D] shadow-[0_0_35px_rgba(244,201,93,0.95)] animate-pulse ${
              isActionStep ? 'cursor-pointer pointer-events-auto ring-4 ring-amber-300/80' : 'pointer-events-none'
            }`}
            onClick={isActionStep ? handleActionClick : undefined}
            title={isActionStep ? 'Tekan untuk membuka Nota Pecahan' : undefined}
          >
            {/* Soft pulse outer ping ring */}
            <div
              style={{ borderRadius: `${spotlightRect.radius + 4}px` }}
              className="absolute -inset-2 border-2 border-amber-300/80 animate-ping opacity-70 pointer-events-none"
            />

            {/* Corner Sparkles */}
            <div className="absolute -top-3 -right-3 text-xl select-none drop-shadow-md animate-bounce">
              ✨
            </div>
            <div className="absolute -bottom-3 -left-3 text-lg select-none drop-shadow-md">
              🌟
            </div>

            {/* Step 2 Special: Bouncing Arrow & Pointer Label above/below the Button */}
            {isActionStep && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                className="absolute -top-13 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-amber-500 via-[#F4C95D] to-[#D98262] text-[#4A3728] text-xs sm:text-sm font-rounded font-black px-4 py-1.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-1.5 pointer-events-none z-[110]"
              >
                <span className="text-base animate-bounce">👇</span>
                <span>TEKAN NOTA PECAHAN DI SINI!</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Dialog Positioning Wrapper */}
        <div className={`${cardPositionClass} z-[101] pointer-events-auto`}>
          <motion.div
            ref={cardRef}
            id="alya-tutorial-card"
            key={`card-step-${safeStepIndex}`}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#F4C95D] p-5 sm:p-6 font-rounded overflow-hidden max-h-[85vh] flex flex-col justify-between"
          >
            {/* Header Row: Alya Badge & Step Indicator */}
            <div className="flex items-center justify-between gap-2 mb-3.5 border-b border-[#F4C95D]/40 pb-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs sm:text-sm border border-pink-200 shadow-sm">
                <span className="text-base">🩷</span>
                <span>Alya</span>
              </div>

              <div className="flex items-center gap-2">
                {spotlightRect && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Fokus</span>
                  </span>
                )}
                <span className="text-xs font-bold text-[#4A3728]/80 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200 font-mono shadow-inner">
                  {safeStepIndex + 1} / {totalSteps}
                </span>
              </div>
            </div>

            {/* Main Content: Alya Avatar + Speech Bubble Dialog */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
              {/* Alya Character Mascot */}
              <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 border-2 border-[#F4C95D] shadow-md flex items-center justify-center relative">
                <AlyaCharacter size="md" mood={stepData.mood} className="w-full h-full" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px] shadow-sm">
                  ✨
                </div>
              </div>

              {/* Speech Bubble Dialog */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-[#4A3728] mb-2 font-serif-title leading-snug">
                  “{stepData.title}”
                </h3>
                <div className="space-y-1.5">
                  {stepData.message.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-sm sm:text-base text-[#4A3728]/95 font-medium leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {stepData.subMessage && (
                  <p className="text-xs sm:text-sm text-[#D98262] font-bold mt-2.5 leading-relaxed flex items-center gap-1">
                    <span>{stepData.subMessage}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Step Progress Dots (7 Steps) */}
            <div className="flex items-center justify-center gap-2 mb-3.5">
              {TUTORIAL_STEPS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === safeStepIndex
                      ? 'w-6 bg-[#D98262]'
                      : idx < safeStepIndex
                      ? 'w-2 bg-amber-400'
                      : 'w-2 bg-amber-200'
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons: Langkau | Kembali | Seterusnya / Buka Nota / Mula Main */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F4C95D]/40">
              <button
                id="btn-langkau-tutorial"
                type="button"
                onClick={handleSkipClick}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-500 hover:text-[#4A3728] hover:bg-amber-100/70 transition-colors cursor-pointer"
              >
                Langkau
              </button>

              <div className="flex items-center gap-2">
                {/* Back Button */}
                <button
                  id="btn-kembali-tutorial"
                  type="button"
                  disabled={isFirstStep}
                  onClick={handleBackClick}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isFirstStep
                      ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                      : 'text-[#4A3728] bg-amber-100 hover:bg-amber-200 border border-amber-300 cursor-pointer shadow-sm'
                  }`}
                >
                  Kembali
                </button>

                {/* Step 2 Action Button: Buka Nota Pecahan */}
                {isActionStep ? (
                  <motion.button
                    id="btn-tutorial-buka-nota"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleActionClick}
                    className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#F4C95D] to-[#D98262] text-[#4A3728] font-rounded font-black text-xs sm:text-sm shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer animate-pulse ring-2 ring-amber-300"
                  >
                    <BookOpen className="w-4 h-4 text-[#4A3728]" />
                    <span>Buka Nota</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  /* Next or Jom Mula Button */
                  <motion.button
                    id={isLastStep ? 'btn-jom-mula' : 'btn-seterusnya-tutorial'}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleNextClick}
                    className={`px-4 sm:px-5 py-2 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer border border-white/40 transition-all ${
                      isLastStep
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 ring-2 ring-emerald-400/50'
                        : 'bg-gradient-to-r from-[#D98262] to-[#c87253] hover:brightness-105'
                    }`}
                  >
                    <span>{isLastStep ? 'Mula Main' : 'Seterusnya'}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
