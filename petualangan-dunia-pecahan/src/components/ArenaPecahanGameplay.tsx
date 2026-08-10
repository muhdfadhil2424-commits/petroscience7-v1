import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft as ArrowLeftIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Star as StarIcon,
  Trophy as TrophyIcon,
  Flame as FlameIcon,
  RotateCcw as RotateCcwIcon,
  MessageCircle as MessageCircleIcon,
  Check as CheckIcon,
  Sparkles as SparklesIcon,
  Lock as LockIcon,
  Play as PlayIcon,
  Award as AwardIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from 'lucide-react';
import { playSfx, togglePizzaBgm } from '../utils/audio';
import confetti from 'canvas-confetti';

// Assets
import bannerArena from '../assets/images/banner_arena_pecahan_1785426776474.jpg';
import coachAimanImg from '../assets/images/coach_aiman_mascot_1785749766904.jpg';

interface ArenaPecahanGameplayProps {
  soundEnabled: boolean;
  onBackToHub: () => void;
  onToggleSound: () => void;
  onUpdateWorldProgress?: (worldId: string, starsEarned: number) => void;
  onCompleteChallenge?: (challengeId: string, starsEarned: number) => void;
}

const ARENA_STORAGE_KEY = 'arena_pecahan_progress_v1';

interface ArenaStorageData {
  level1Complete: boolean;
  level2Complete: boolean;
  level3Complete: boolean;
  level1Stars: number;
  level2Stars: number;
  level3Stars: number;
}

const DEFAULT_ARENA_STORAGE: ArenaStorageData = {
  level1Complete: false,
  level2Complete: false,
  level3Complete: false,
  level1Stars: 0,
  level2Stars: 0,
  level3Stars: 0,
};

// Question Data Types
export interface QuestionItem {
  id: string;
  questionText: string;
  visualType: 'circle' | 'square' | 'pizza' | 'chocolate' | 'apple' | 'text_only';
  visualNumerator: number;
  visualDenominator: number;
  options: { label: string; fractionNum: number; fractionDenom: number }[];
  correctIndex: number;
  explanation: string;
}

// Level 1 Questions: Lari & Pilih (Basic fraction identification with visual shapes)
const LEVEL1_QUESTIONS: QuestionItem[] = [
  {
    id: 'l1_q1',
    questionText: 'Pecahan manakah menunjukkan 3 daripada 4 bahagian yang diwarnakan?',
    visualType: 'pizza',
    visualNumerator: 3,
    visualDenominator: 4,
    options: [
      { label: '1/4', fractionNum: 1, fractionDenom: 4 },
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
      { label: '2/4', fractionNum: 2, fractionDenom: 4 },
    ],
    correctIndex: 1,
    explanation: '3 daripada 4 bahagian dipotong ditulis sebagai 3/4!',
  },
  {
    id: 'l1_q2',
    questionText: 'Apakah pecahan bagi bahagian coklat yang diwarnakan?',
    visualType: 'chocolate',
    visualNumerator: 2,
    visualDenominator: 6,
    options: [
      { label: '2/6', fractionNum: 2, fractionDenom: 6 },
      { label: '4/6', fractionNum: 4, fractionDenom: 6 },
      { label: '1/6', fractionNum: 1, fractionDenom: 6 },
    ],
    correctIndex: 0,
    explanation: 'Ada 2 petak berwarna daripada 6 petak keseluruhan, iaitu 2/6.',
  },
  {
    id: 'l1_q3',
    questionText: 'Sebiji epal dibelah 2 bahagian sama besar. 1 bahagian dimakan. Berapakah pecahan epal itu?',
    visualType: 'apple',
    visualNumerator: 1,
    visualDenominator: 2,
    options: [
      { label: '2/2', fractionNum: 2, fractionDenom: 2 },
      { label: '1/3', fractionNum: 1, fractionDenom: 3 },
      { label: '1/2', fractionNum: 1, fractionDenom: 2 },
    ],
    correctIndex: 2,
    explanation: '1 daripada 2 bahagian ialah 1/2 (separuh).',
  },
  {
    id: 'l1_q4',
    questionText: 'Apakah pecahan bulatan di bawah?',
    visualType: 'circle',
    visualNumerator: 3,
    visualDenominator: 5,
    options: [
      { label: '3/5', fractionNum: 3, fractionDenom: 5 },
      { label: '2/5', fractionNum: 2, fractionDenom: 5 },
      { label: '4/5', fractionNum: 4, fractionDenom: 5 },
    ],
    correctIndex: 0,
    explanation: '3 bahagian diwarnakan daripada 5 bahagian bulatan = 3/5.',
  },
  {
    id: 'l1_q5',
    questionText: 'Pilih pecahan yang mewakili segi empat tepat di bawah:',
    visualType: 'square',
    visualNumerator: 1,
    visualDenominator: 4,
    options: [
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
      { label: '1/4', fractionNum: 1, fractionDenom: 4 },
      { label: '2/4', fractionNum: 2, fractionDenom: 4 },
    ],
    correctIndex: 1,
    explanation: '1 bahagian berwarna daripada 4 bahagian = 1/4 (satu perempat).',
  },
];

// Level 2 Questions: Lompat Pecahan (Numerator & Denominator Recognition)
const LEVEL2_QUESTIONS: QuestionItem[] = [
  {
    id: 'l2_q1',
    questionText: 'Apakah PENYEBUT (nombor di bawah) bagi pecahan 2/5?',
    visualType: 'text_only',
    visualNumerator: 2,
    visualDenominator: 5,
    options: [
      { label: '2', fractionNum: 2, fractionDenom: 1 },
      { label: '3', fractionNum: 3, fractionDenom: 1 },
      { label: '5', fractionNum: 5, fractionDenom: 1 },
    ],
    correctIndex: 2,
    explanation: 'Penyebut ialah nombor di bawah garis pecahan, iaitu 5.',
  },
  {
    id: 'l2_q2',
    questionText: 'Apakah PENGANGKA (nombor di atas) bagi pecahan 4/7?',
    visualType: 'text_only',
    visualNumerator: 4,
    visualDenominator: 7,
    options: [
      { label: '4', fractionNum: 4, fractionDenom: 1 },
      { label: '7', fractionNum: 7, fractionDenom: 1 },
      { label: '11', fractionNum: 11, fractionDenom: 1 },
    ],
    correctIndex: 0,
    explanation: 'Pengangka ialah nombor di atas garis pecahan, iaitu 4.',
  },
  {
    id: 'l2_q3',
    questionText: 'Lompat ke platform yang mempunyai PENGANGKA = 3!',
    visualType: 'text_only',
    visualNumerator: 3,
    visualDenominator: 4,
    options: [
      { label: '1/3', fractionNum: 1, fractionDenom: 3 },
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
      { label: '4/3', fractionNum: 4, fractionDenom: 3 },
    ],
    correctIndex: 1,
    explanation: '3/4 mempunyai pengangka 3 di atas dan penyebut 4 di bawah.',
  },
  {
    id: 'l2_q4',
    questionText: 'Apakah pecahan yang menunjukkan 5 daripada 6 bahagian platform?',
    visualType: 'chocolate',
    visualNumerator: 5,
    visualDenominator: 6,
    options: [
      { label: '5/6', fractionNum: 5, fractionDenom: 6 },
      { label: '1/6', fractionNum: 1, fractionDenom: 6 },
      { label: '6/5', fractionNum: 6, fractionDenom: 5 },
    ],
    correctIndex: 0,
    explanation: '5 bahagian yang diwarnakan daripada 6 bahagian ialah 5/6.',
  },
  {
    id: 'l2_q5',
    questionText: 'Pilih pecahan di mana pengangka kurang 1 daripada penyebut!',
    visualType: 'text_only',
    visualNumerator: 2,
    visualDenominator: 3,
    options: [
      { label: '1/4', fractionNum: 1, fractionDenom: 4 },
      { label: '2/3', fractionNum: 2, fractionDenom: 3 },
      { label: '3/1', fractionNum: 3, fractionDenom: 1 },
    ],
    correctIndex: 1,
    explanation: 'Pada pecahan 2/3, pengangka (2) kurang 1 daripada penyebut (3).',
  },
];

// Level 3 Questions: Pecutan Akhir (Equivalent Fractions & Addition with same denominator)
const LEVEL3_QUESTIONS: QuestionItem[] = [
  {
    id: 'l3_q1',
    questionText: 'Pecahan manakah SETARA (sama nilai) dengan 1/2?',
    visualType: 'circle',
    visualNumerator: 2,
    visualDenominator: 4,
    options: [
      { label: '1/3', fractionNum: 1, fractionDenom: 3 },
      { label: '2/4', fractionNum: 2, fractionDenom: 4 },
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
    ],
    correctIndex: 1,
    explanation: '1/2 adalah sama nilai dengan 2/4 (separuh daripada 4 ialah 2)!',
  },
  {
    id: 'l3_q2',
    questionText: 'Berapakah 1/4 + 2/4?',
    visualType: 'pizza',
    visualNumerator: 3,
    visualDenominator: 4,
    options: [
      { label: '2/4', fractionNum: 2, fractionDenom: 4 },
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
      { label: '4/4', fractionNum: 4, fractionDenom: 4 },
    ],
    correctIndex: 1,
    explanation: 'Penyebut sama (4). Tambahkan pengangka: 1 + 2 = 3. Jawapannya ialah 3/4!',
  },
  {
    id: 'l3_q3',
    questionText: 'Pecahan manakah yang LEBIH BESAR nilainya?',
    visualType: 'square',
    visualNumerator: 3,
    visualDenominator: 4,
    options: [
      { label: '1/4', fractionNum: 1, fractionDenom: 4 },
      { label: '3/4', fractionNum: 3, fractionDenom: 4 },
      { label: '2/4', fractionNum: 2, fractionDenom: 4 },
    ],
    correctIndex: 1,
    explanation: '3/4 lebih besar daripada 1/4 kerana ia meliputi 3 bahagian!',
  },
  {
    id: 'l3_q4',
    questionText: 'Berapakah 5/6 - 2/6?',
    visualType: 'chocolate',
    visualNumerator: 3,
    visualDenominator: 6,
    options: [
      { label: '3/6', fractionNum: 3, fractionDenom: 6 },
      { label: '2/6', fractionNum: 2, fractionDenom: 6 },
      { label: '4/6', fractionNum: 4, fractionDenom: 6 },
    ],
    correctIndex: 0,
    explanation: 'Penyebut sama (6). Tolakkan pengangka: 5 - 2 = 3. Jawapannya ialah 3/6!',
  },
  {
    id: 'l3_q5',
    questionText: 'Pecahan manakah setara dengan 2/6?',
    visualType: 'circle',
    visualNumerator: 1,
    visualDenominator: 3,
    options: [
      { label: '1/3', fractionNum: 1, fractionDenom: 3 },
      { label: '1/2', fractionNum: 1, fractionDenom: 2 },
      { label: '2/3', fractionNum: 2, fractionDenom: 3 },
    ],
    correctIndex: 0,
    explanation: '2/6 dan 1/3 adalah pecahan setara!',
  },
];

export const ArenaPecahanGameplay: React.FC<ArenaPecahanGameplayProps> = ({
  soundEnabled,
  onBackToHub,
  onToggleSound,
  onUpdateWorldProgress,
  onCompleteChallenge,
}) => {
  // Saved Progress in LocalStorage
  const [arenaProgress, setArenaProgress] = useState<ArenaStorageData>(() => {
    try {
      const saved = localStorage.getItem(ARENA_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ARENA_STORAGE;
    } catch {
      return DEFAULT_ARENA_STORAGE;
    }
  });

  // Current View: 'welcome', 'level_select', or 'gameplay'
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'level_select' | 'gameplay'>('welcome');
  const [activeLevelId, setActiveLevelId] = useState<1 | 2 | 3>(1);

  // Gameplay State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [scorePoints, setScorePoints] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [runnerPosition, setRunnerPosition] = useState<'left' | 'center' | 'right'>('center');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isSpeedBoost, setIsSpeedBoost] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Victory / Finish Modal State
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [earnedStarsCurrentLevel, setEarnedStarsCurrentLevel] = useState<number>(3);

  const activeQuestions =
    activeLevelId === 1 ? LEVEL1_QUESTIONS : activeLevelId === 2 ? LEVEL2_QUESTIONS : LEVEL3_QUESTIONS;

  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  // BGM control
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);

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

  // Keyboard navigation for desktop runner controls
  useEffect(() => {
    if (currentScreen !== 'gameplay' || showFinishModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        handleOptionChoose(0);
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') {
        handleOptionChoose(1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        handleOptionChoose(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, showFinishModal, currentQuestionIndex]);

  // Helper to save progress
  const saveArenaProgress = (updated: ArenaStorageData) => {
    setArenaProgress(updated);
    localStorage.setItem(ARENA_STORAGE_KEY, JSON.stringify(updated));

    // Calculate total stars across all 3 levels
    const totalStars = updated.level1Stars + updated.level2Stars + updated.level3Stars;
    if (onUpdateWorldProgress) {
      onUpdateWorldProgress('arena', totalStars);
    }
  };

  // Start Level
  const handleStartLevel = (levelId: 1 | 2 | 3) => {
    playSfx('click', soundEnabled);
    setActiveLevelId(levelId);
    setCurrentQuestionIndex(0);
    setScorePoints(0);
    setMistakesCount(0);
    setSelectedOptionIndex(null);
    setRunnerPosition('center');
    setIsJumping(false);
    setIsSpeedBoost(false);
    setShowFinishModal(false);
    setCurrentScreen('gameplay');

    const titleText =
      levelId === 1
        ? 'Peringkat 1: Lari di trek stadium dan pilih jawapan pecahan yang betul!'
        : levelId === 2
        ? 'Peringkat 2: Lompat ke platform pecahan yang betul!'
        : 'Peringkat 3: Pecutan Akhir! Selesaikan cabaran setara & penambahan!';

    setFeedback({ text: titleText, type: 'info' });
  };

  // Answer Choice Handler
  const handleOptionChoose = (optionIdx: number) => {
    if (selectedOptionIndex !== null) return; // Prevent double taps during animation

    setSelectedOptionIndex(optionIdx);

    // Update runner visual position & action
    if (optionIdx === 0) setRunnerPosition('left');
    else if (optionIdx === 1) setRunnerPosition('center');
    else setRunnerPosition('right');

    const isCorrect = optionIdx === currentQ.correctIndex;

    if (activeLevelId === 2) {
      // Jump animation for Level 2
      setIsJumping(true);
      playSfx('pop', soundEnabled);
      setTimeout(() => setIsJumping(false), 500);
    } else {
      // Speed boost animation for Level 1 & 3
      setIsSpeedBoost(true);
      setTimeout(() => setIsSpeedBoost(false), 600);
    }

    if (isCorrect) {
      playSfx('chime', soundEnabled);
      setScorePoints((prev) => prev + 20);
      setFeedback({
        text: `✨ HEBAT! ${currentQ.explanation}`,
        type: 'success',
      });

      try {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      playSfx('lock', soundEnabled);
      setMistakesCount((prev) => prev + 1);
      setFeedback({
        text: `Belum tepat. ${currentQ.explanation}`,
        type: 'error',
      });
    }

    // Advance to next question or Finish Line after short delay
    setTimeout(() => {
      setSelectedOptionIndex(null);
      if (currentQuestionIndex + 1 < activeQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setFeedback({ text: 'Soalan seterusnya! Teruskan berlari!', type: 'info' });
      } else {
        // LEVEL FINISHED!
        handleLevelComplete();
      }
    }, 1500);
  };

  // Handle Level Completion
  const handleLevelComplete = () => {
    playSfx('fanfare', soundEnabled);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    // Calculate stars: 3 stars if 0 mistakes, 2 stars if 1 mistake, 1 star if >= 2 mistakes
    let calculatedStars = 3;
    if (mistakesCount === 1) calculatedStars = 2;
    else if (mistakesCount >= 2) calculatedStars = 1;

    setEarnedStarsCurrentLevel(calculatedStars);

    const updated = { ...arenaProgress };
    if (activeLevelId === 1) {
      updated.level1Complete = true;
      updated.level1Stars = Math.max(updated.level1Stars, calculatedStars);
    } else if (activeLevelId === 2) {
      updated.level2Complete = true;
      updated.level2Stars = Math.max(updated.level2Stars, calculatedStars);
    } else if (activeLevelId === 3) {
      updated.level3Complete = true;
      updated.level3Stars = Math.max(updated.level3Stars, calculatedStars);
    }

    saveArenaProgress(updated);
    if (onCompleteChallenge) {
      onCompleteChallenge(`arena-${activeLevelId}`, calculatedStars);
    }
    setShowFinishModal(true);
  };

  const totalArenaStars = arenaProgress.level1Stars + arenaProgress.level2Stars + arenaProgress.level3Stars;

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#4A3728] flex flex-col relative overflow-x-hidden selection:bg-emerald-200">
      
      {/* HEADER HUD */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-emerald-900 text-white shadow-md border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                if (currentScreen === 'gameplay') {
                  setCurrentScreen('level_select');
                } else if (currentScreen === 'level_select') {
                  setCurrentScreen('welcome');
                } else {
                  onBackToHub();
                }
              }}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>
                {currentScreen === 'gameplay'
                  ? 'KEMBALI KE PERINGKAT ARENA'
                  : currentScreen === 'level_select'
                  ? 'KEMBALI KE UTAMA ARENA'
                  : 'KEMBALI KE DUNIA PENGEMBARAAN'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl leading-none">🏟️</span>
              <div>
                <span className="font-serif-title font-bold text-base text-white tracking-wide block leading-none">
                  ARENA PECAHAN
                </span>
                <span className="text-[10px] text-emerald-200 font-medium block leading-tight">
                  Dunia 1 — Lari, Lompat & Kumpul Pecahan!
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stars Count */}
            <div className="flex items-center gap-1.5 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700 text-xs sm:text-sm font-bold text-amber-300">
              <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalArenaStars} / 9 Bintang</span>
            </div>

            {/* Audio Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setBgmEnabled(!bgmEnabled);
                playSfx('click', soundEnabled);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                bgmEnabled
                  ? 'bg-emerald-700 border-emerald-500 text-emerald-100'
                  : 'bg-emerald-950 border-emerald-800 text-gray-400'
              }`}
            >
              {bgmEnabled ? <Volume2Icon className="w-4 h-4 text-emerald-200" /> : <VolumeXIcon className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* SCREEN 0: WELCOME SCREEN (PENGENALAN DUNIA ARENA) */}
      {currentScreen === 'welcome' && (
        <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full bg-white rounded-3xl p-6 sm:p-10 border-4 border-emerald-400 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
          >
            {/* Background Image Accent */}
            <img
              src={bannerArena}
              alt="Stadium Arena Pecahan"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />

            {/* Sunlight Ray Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/20 via-yellow-100/10 to-transparent pointer-events-none" />

            {/* Animated Floating Flags 🏳️ 🚩 🏁 */}
            <div className="absolute top-3 left-0 w-full flex justify-around opacity-80 pointer-events-none z-10">
              <motion.span
                animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="text-2xl sm:text-3xl"
              >
                🏳️
              </motion.span>
              <motion.span
                animate={{ rotate: [5, -5, 5], y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="text-3xl sm:text-4xl"
              >
                🚩
              </motion.span>
              <motion.span
                animate={{ rotate: [-4, 4, -4], y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="text-2xl sm:text-3xl"
              >
                🏁
              </motion.span>
              <motion.span
                animate={{ rotate: [4, -4, 4], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="text-3xl sm:text-4xl"
              >
                🚩
              </motion.span>
            </div>

            {/* Animated Floating Balloons 🎈 */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <motion.span
                animate={{ y: [40, -10, 40], x: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                className="absolute top-10 left-6 text-2xl opacity-75"
              >
                🎈
              </motion.span>
              <motion.span
                animate={{ y: [30, -15, 30], x: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                className="absolute top-16 right-8 text-3xl opacity-75"
              >
                🎈
              </motion.span>
            </div>

            {/* Drifting Confetti Sparkles ✨ */}
            <div className="absolute inset-0 pointer-events-none z-10 flex justify-between px-10 items-center opacity-60">
              <motion.span
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-amber-400 text-xl"
              >
                ✨
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.4, delay: 0.5 }}
                className="text-emerald-400 text-2xl"
              >
                ✨
              </motion.span>
            </div>

            {/* Coach Aiman Mascot Image */}
            <div className="relative z-20 w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl shrink-0 bg-blue-100">
              <img
                src={coachAimanImg}
                alt="Coach Aiman"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/80 backdrop-blur-md rounded-xl py-1 text-center border border-emerald-400/50">
                <span className="text-xs font-serif-title font-bold text-amber-300">
                  Coach Aiman 🏃‍♂️
                </span>
              </div>
            </div>

            {/* Welcome Dialogue & Message */}
            <div className="relative z-20 flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 font-rounded font-extrabold text-xs uppercase tracking-wider">
                <span className="text-base">🏃</span>
                <span>DUNIA 1 — ARENA SUKAN MATEMATIK</span>
              </div>

              <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#4A3728] leading-tight">
                🏃 Selamat Datang ke Arena Pecahan!
              </h1>

              <div className="bg-[#FFF8E8] p-4 rounded-2xl border-2 border-emerald-300 shadow-inner space-y-2">
                <p className="font-rounded font-bold text-base text-emerald-800">
                  "Hari ini kita akan bersukan sambil belajar pecahan!"
                </p>
                <p className="font-rounded font-medium text-xs sm:text-sm text-[#4A3728]/80 leading-relaxed">
                  Bantu Coach Aiman mengumpulkan bintang dengan menyelesaikan cabaran pecahan di setiap halangan. Kumpulkan semua 9 bintang!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playSfx('fanfare', soundEnabled);
                  setCurrentScreen('level_select');
                }}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-rounded font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 border-b-4 border-emerald-800 cursor-pointer"
              >
                <span>🏁 🏃 MULA BERMAIN</span>
                <span className="text-xl">📢</span>
              </motion.button>
            </div>
          </motion.div>
        </main>
      )}

      {/* SCREEN 1: ARENA LEVEL SELECT HUB */}
      {currentScreen === 'level_select' && (
        <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col gap-6">
          
          {/* Main Graphic Banner Header */}
          <div className="relative w-full rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-xl bg-emerald-900 text-white min-h-[200px] sm:min-h-[240px] flex items-center">
            <img
              src={bannerArena}
              alt="Arena Pecahan Stadium"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-rounded font-bold text-xs uppercase tracking-wider">
                <span>🏟️ DUNIA 1 — ARENA PECAHAN</span>
              </div>

              <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-amber-300 tracking-tight leading-tight">
                ARENA PECAHAN
              </h1>

              <p className="font-rounded font-medium text-sm sm:text-base text-emerald-100 leading-relaxed">
                Lari, lompat dan tunjukkan kemahiran pecahan kamu di stadium sukan sekolah! Selesaikan kesemua 3 peringkat untuk membuka Trofi Pecahan! 🏆
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-600/60 text-xs font-bold text-amber-300">
                  <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Jumlah Bintang: {totalArenaStars} / 9</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 LEVEL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEVEL 1 CARD */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border-3 border-emerald-400 shadow-lg flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-300">
                    PERINGKAT 1
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= arenaProgress.level1Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
                    🏃
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">LARI & PILIH</h3>
                    <p className="text-xs text-gray-500 font-medium">Pengenalan Pecahan Visual</p>
                  </div>
                </div>

                <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                  Berlari di trek stadium dan pilih laluan jawapan pecahan yang betul mengikut gambar pizza, coklat, dan bentuk!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartLevel(1)}
                className="w-full mt-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-800"
              >
                <PlayIcon className="w-4 h-4 fill-white" />
                <span>{arenaProgress.level1Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 1'}</span>
              </motion.button>
            </motion.div>

            {/* LEVEL 2 CARD */}
            {(() => {
              const isUnlocked = arenaProgress.level1Complete;
              return (
                <motion.div
                  whileHover={isUnlocked ? { y: -4 } : {}}
                  className={`bg-white rounded-3xl p-6 border-3 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                    isUnlocked ? 'border-emerald-400' : 'border-gray-300 opacity-80 bg-gray-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-extrabold text-xs px-3 py-1 rounded-full border ${
                          isUnlocked
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        PERINGKAT 2
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= arenaProgress.level2Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                          isUnlocked ? 'bg-amber-500 text-white' : 'bg-gray-400 text-gray-200'
                        }`}
                      >
                        🦘
                      </div>
                      <div>
                        <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">LOMPAT PECAHAN</h3>
                        <p className="text-xs text-gray-500 font-medium">Pengangka & Penyebut</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                      Lompat di antara platform berlabel pecahan! Camkan pengangka (atas) dan penyebut (bawah) untuk sampai ke seberang.
                    </p>
                  </div>

                  {isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartLevel(2)}
                      className="w-full mt-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                    >
                      <PlayIcon className="w-4 h-4 fill-white" />
                      <span>{arenaProgress.level2Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 2'}</span>
                    </motion.button>
                  ) : (
                    <div className="w-full mt-6 py-3 rounded-2xl bg-gray-200 text-gray-500 font-rounded font-bold text-xs flex items-center justify-center gap-2 border border-gray-300">
                      <LockIcon className="w-4 h-4" />
                      <span>SELESAIKAN PERINGKAT 1 DAHULU</span>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* LEVEL 3 CARD */}
            {(() => {
              const isUnlocked = arenaProgress.level2Complete;
              return (
                <motion.div
                  whileHover={isUnlocked ? { y: -4 } : {}}
                  className={`bg-white rounded-3xl p-6 border-3 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                    isUnlocked ? 'border-amber-400' : 'border-gray-300 opacity-80 bg-gray-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-extrabold text-xs px-3 py-1 rounded-full border ${
                          isUnlocked
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        PERINGKAT 3
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-4 h-4 ${
                              star <= arenaProgress.level3Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                          isUnlocked ? 'bg-rose-500 text-white' : 'bg-gray-400 text-gray-200'
                        }`}
                      >
                        🏆
                      </div>
                      <div>
                        <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">PECUTAN AKHIR</h3>
                        <p className="text-xs text-gray-500 font-medium">Pecahan Setara & Penambahan</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                      Cabaran kemuncak di garisan penamat stadium! Padankan pecahan setara dan tambah pecahan penyebut sama.
                    </p>
                  </div>

                  {isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartLevel(3)}
                      className="w-full mt-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-rose-800"
                    >
                      <PlayIcon className="w-4 h-4 fill-white" />
                      <span>{arenaProgress.level3Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 3'}</span>
                    </motion.button>
                  ) : (
                    <div className="w-full mt-6 py-3 rounded-2xl bg-gray-200 text-gray-500 font-rounded font-bold text-xs flex items-center justify-center gap-2 border border-gray-300">
                      <LockIcon className="w-4 h-4" />
                      <span>SELESAIKAN PERINGKAT 2 DAHULU</span>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </div>
        </main>
      )}

      {/* SCREEN 2: ACTIVE GAMEPLAY ARENA */}
      {currentScreen === 'gameplay' && (
        <main className="max-w-6xl mx-auto w-full px-4 py-4 sm:py-6 flex-1 flex flex-col gap-4">
          
          {/* QUESTION BOARD BANNER */}
          <div className="bg-white rounded-3xl p-5 border-3 border-emerald-400 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                <span>🏃 SOALAN {currentQuestionIndex + 1} / {activeQuestions.length}</span>
              </span>

              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <span>Mata: <strong className="text-emerald-700">{scorePoints}</strong></span>
                <span>• Kesilapan: <strong className="text-rose-600">{mistakesCount}</strong></span>
              </div>
            </div>

            <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#4A3728] mb-3 text-center">
              {currentQ.questionText}
            </h2>

            {/* Visual Graphic Representation depending on visualType */}
            {currentQ.visualType !== 'text_only' && (
              <div className="flex justify-center my-3">
                <div className="bg-[#FFF8E8] p-4 rounded-2xl border-2 border-amber-300 shadow-inner flex items-center justify-center min-w-[200px]">
                  {currentQ.visualType === 'pizza' && (
                    <div className="relative w-36 h-36">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                        <circle cx="100" cy="100" r="90" fill="#D98262" stroke="#a35032" strokeWidth="4" />
                        <circle cx="100" cy="100" r="80" fill="#E54B4B" stroke="#b82a2a" strokeWidth="2" />
                        {Array.from({ length: currentQ.visualDenominator }).map((_, i) => {
                          const angle = (360 / currentQ.visualDenominator) * i - 90;
                          const nextAngle = (360 / currentQ.visualDenominator) * (i + 1) - 90;
                          const rad1 = (angle * Math.PI) / 180;
                          const rad2 = (nextAngle * Math.PI) / 180;
                          const x1 = 100 + 75 * Math.cos(rad1);
                          const y1 = 100 + 75 * Math.sin(rad1);
                          const x2 = 100 + 75 * Math.cos(rad2);
                          const y2 = 100 + 75 * Math.sin(rad2);
                          const path = `M 100 100 L ${x1} ${y1} A 75 75 0 0 1 ${x2} ${y2} Z`;
                          const isHighlighted = i < currentQ.visualNumerator;
                          return (
                            <path
                              key={i}
                              d={path}
                              fill={isHighlighted ? '#F4C95D' : '#FFF8E8'}
                              stroke="#4A3728"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  )}

                  {currentQ.visualType === 'chocolate' && (
                    <div className="grid grid-cols-3 gap-1 bg-amber-900 p-2 rounded-xl shadow-md border-2 border-amber-950">
                      {Array.from({ length: currentQ.visualDenominator }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-md border flex items-center justify-center font-bold text-xs ${
                            i < currentQ.visualNumerator
                              ? 'bg-amber-300 border-amber-500 text-amber-950'
                              : 'bg-amber-100 border-amber-200 text-amber-900/40'
                          }`}
                        >
                          🍫
                        </div>
                      ))}
                    </div>
                  )}

                  {currentQ.visualType === 'circle' && (
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                        <circle cx="100" cy="100" r="85" fill="#f0fdf4" stroke="#16a34a" strokeWidth="4" />
                        {Array.from({ length: currentQ.visualDenominator }).map((_, i) => {
                          const angle = (360 / currentQ.visualDenominator) * i - 90;
                          const nextAngle = (360 / currentQ.visualDenominator) * (i + 1) - 90;
                          const rad1 = (angle * Math.PI) / 180;
                          const rad2 = (nextAngle * Math.PI) / 180;
                          const x1 = 100 + 80 * Math.cos(rad1);
                          const y1 = 100 + 80 * Math.sin(rad1);
                          const x2 = 100 + 80 * Math.cos(rad2);
                          const y2 = 100 + 80 * Math.sin(rad2);
                          const path = `M 100 100 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`;
                          const isHighlighted = i < currentQ.visualNumerator;
                          return (
                            <path
                              key={i}
                              d={path}
                              fill={isHighlighted ? '#22c55e' : '#ffffff'}
                              stroke="#15803d"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  )}

                  {currentQ.visualType === 'square' && (
                    <div className="flex gap-1.5 bg-emerald-900 p-2 rounded-xl shadow-md border-2 border-emerald-950">
                      {Array.from({ length: currentQ.visualDenominator }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center font-extrabold text-sm ${
                            i < currentQ.visualNumerator
                              ? 'bg-emerald-400 border-emerald-200 text-emerald-950 shadow-inner'
                              : 'bg-white border-emerald-300 text-gray-400'
                          }`}
                        >
                          🟦
                        </div>
                      ))}
                    </div>
                  )}

                  {currentQ.visualType === 'apple' && (
                    <div className="flex items-center gap-3 text-4xl p-2">
                      <div className="p-3 bg-red-100 rounded-2xl border-2 border-red-300 flex items-center justify-center">
                        🍎
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition-all ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : feedback.type === 'error'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-[#FFF8E8] border-[#F4C95D] text-[#4A3728]'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>

          {/* DYNAMIC STADIUM TRACK & RUNNER INTERACTIVE CANVAS */}
          <div className="bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 rounded-3xl border-3 border-emerald-400 p-4 shadow-xl relative overflow-hidden min-h-[260px] flex flex-col justify-between">
            
            {/* Spectator Stands Decorative Background */}
            <div className="flex justify-between items-center text-xl sm:text-2xl px-4 py-1 bg-amber-200/60 rounded-xl border border-amber-300 text-center select-none">
              <span>🏟️ 👏 📣 🏃</span>
              <span className="font-serif-title font-bold text-xs text-amber-900 uppercase tracking-widest">
                STADIUM SUKAN ARENA PECAHAN
              </span>
              <span>📣 👏 🏃 🏟️</span>
            </div>

            {/* Level 2 Platform Jump Graphics vs Level 1 Track Lanes */}
            <div className="relative my-4 h-36 flex items-center justify-around px-4">
              
              {/* 3 Interactive Track Gates / Platforms */}
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrectChoice = idx === currentQ.correctIndex;

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionChoose(idx)}
                    className={`relative w-24 sm:w-32 py-4 rounded-2xl border-3 font-serif-title font-extrabold text-xl sm:text-2xl flex flex-col items-center justify-center cursor-pointer transition-all shadow-lg ${
                      isSelected
                        ? isCorrectChoice
                          ? 'bg-emerald-500 text-white border-emerald-700 ring-4 ring-emerald-300 scale-110'
                          : 'bg-rose-500 text-white border-rose-700 scale-95'
                        : 'bg-white text-[#4A3728] border-amber-400 hover:bg-amber-50'
                    }`}
                  >
                    {activeLevelId === 2 && (
                      <span className="text-xs font-bold text-amber-700 mb-1">
                        PLATFORM {idx + 1}
                      </span>
                    )}

                    <span>{opt.label}</span>

                    {/* Button indicator key helper */}
                    <span className="text-[10px] text-gray-400 font-sans mt-1">
                      {idx === 0 ? 'Lokal [←]' : idx === 1 ? 'Lokal [↑]' : 'Lokal [→]'}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* RUNNER AVATAR ANIMATION */}
            <div className="relative w-full h-16 bg-emerald-700 rounded-2xl border-2 border-emerald-800 shadow-inner flex items-center px-8 overflow-hidden">
              
              {/* Track Lane markings */}
              <div className="absolute inset-0 flex justify-around items-center opacity-30 pointer-events-none">
                <div className="border-r-2 border-dashed border-white h-full" />
                <div className="border-r-2 border-dashed border-white h-full" />
              </div>

              {/* Animated Runner Character */}
              <motion.div
                animate={{
                  x: runnerPosition === 'left' ? '15%' : runnerPosition === 'right' ? '75%' : '45%',
                  y: isJumping ? [-10, -40, 0] : [0, -4, 0],
                  scale: isSpeedBoost ? [1, 1.25, 1] : 1,
                }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center select-none"
              >
                <div className="text-4xl filter drop-shadow-md">
                  {isJumping ? '🦘' : isSpeedBoost ? '⚡🏃' : '🏃'}
                </div>
                <span className="text-[10px] font-extrabold text-amber-200 bg-black/60 px-2 py-0.5 rounded-full mt-0.5">
                  Pelari
                </span>
              </motion.div>
            </div>

            {/* Mobile / Touch Action Controls */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => handleOptionChoose(0)}
                className="py-3 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-md border-b-4 border-[#9a4b2e] cursor-pointer"
              >
                <span>⬅️ LALUAN 1</span>
              </button>

              <button
                onClick={() => handleOptionChoose(1)}
                className="py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-md border-b-4 border-amber-700 cursor-pointer"
              >
                <span>{activeLevelId === 2 ? '🦘 LOMPAT TENGAH' : '⬆️ LALUAN 2'}</span>
              </button>

              <button
                onClick={() => handleOptionChoose(2)}
                className="py-3 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-md border-b-4 border-[#9a4b2e] cursor-pointer"
              >
                <span>➡️ LALUAN 3</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* FINISH LINE & MEDAL AWARD MODAL */}
      <AnimatePresence>
        {showFinishModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="bg-[#FFF8E8] rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-emerald-500 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-400 mx-auto flex items-center justify-center text-5xl mb-3 shadow-inner">
                🏆
              </div>

              <h3 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#4A3728] mb-1">
                🏁 GARISAN PENAMAT!
              </h3>

              <p className="font-serif-title font-bold text-emerald-700 text-base mb-4">
                🎉 TAHNIAH! Kamu telah menamatkan Peringkat {activeLevelId}!
              </p>

              {/* Earned Stars */}
              <div className="flex items-center justify-center gap-2 my-3">
                {[1, 2, 3].map((star) => (
                  <StarIcon
                    key={star}
                    className={`w-8 h-8 ${
                      star <= earnedStarsCurrentLevel
                        ? 'fill-amber-400 text-amber-400 animate-bounce'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Medal / Trophy Award Badge */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 text-center my-4 shadow-inner">
                <span className="text-xs font-bold text-gray-500 block mb-1">Pencapaian Anugerah Arena</span>
                <div className="font-serif-title font-extrabold text-lg text-emerald-800 flex items-center justify-center gap-2">
                  <AwardIcon className="w-5 h-5 text-amber-500" />
                  <span>
                    {totalArenaStars >= 9
                      ? '🏆 TROFI PECAHAN ARENA (EMAS SEJATI)'
                      : totalArenaStars >= 7
                      ? '🥇 MEDAL EMAS ARENA'
                      : totalArenaStars >= 5
                      ? '🥈 MEDAL PERAK ARENA'
                      : '🥉 MEDAL GANGSA ARENA'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowFinishModal(false);
                    setCurrentScreen('level_select');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-rounded font-extrabold text-sm sm:text-base shadow-lg border-b-4 border-emerald-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                  <span>TERUSKAN KE PENGURUSAN ARENA</span>
                </motion.button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowFinishModal(false);
                    onBackToHub();
                  }}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-amber-50 text-[#4A3728] font-rounded font-bold text-xs sm:text-sm border-2 border-emerald-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <HomeIcon className="w-4 h-4 text-emerald-600" />
                  <span>🏠 KEMBALI KE DUNIA PENGEMBARAAN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
