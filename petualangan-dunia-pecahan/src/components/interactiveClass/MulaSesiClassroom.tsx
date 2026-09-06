import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CameraOff,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Users,
  BarChart3,
  HelpCircle,
  Play,
  Pause,
  Clock,
  Trophy,
  Check,
  AlertCircle,
  Shield,
  Award,
  BookOpen,
  ListOrdered,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  INTERACTIVE_CLASS_30_QUESTIONS,
  InteractiveClassQuestion,
} from '../../data/interactiveClass30Questions';
import { DynamicMathVisual } from '../DynamicMathVisual';
import {
  InteractiveClassStudent,
  AnswerOption,
  InteractiveCardOrientation,
  ScannedStudentAnswer,
} from '../../types/interactiveClass';
import {
  recordStudentAnswer,
  getAnswersForQuestion,
  clearQuestionAnswers,
  computeClassroomStats,
  computeSessionOverallSummary,
} from '../../utils/interactiveSessionManager';
import { CameraScannerOverlay } from './CameraScannerOverlay';
import { ScannerTestModal } from './ScannerTestModal';
import { playSfx } from '../../utils/audio';

interface MulaSesiClassroomProps {
  selectedClass: string;
  students: InteractiveClassStudent[];
  soundEnabled?: boolean;
  onBackToTabs?: () => void;
}

export const MulaSesiClassroom: React.FC<MulaSesiClassroomProps> = ({
  selectedClass,
  students,
  soundEnabled = true,
  onBackToTabs,
}) => {
  // Questions Bank: Exact 30 DSKP 3.1 Questions
  const questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_30_QUESTIONS;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion: InteractiveClassQuestion = questions[currentQuestionIndex] || questions[0];

  // Camera & Session State
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false); // When true: hide choices on screen to prevent copycatting
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isSessionCompleteModalOpen, setIsSessionCompleteModalOpen] = useState(false);
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState(false);

  // Timer State (Optional Timer: 0 = Tiada Timer, or 15, 30, 45, 60 seconds)
  const [timerDuration, setTimerDuration] = useState<number>(0); // Default: Tiada Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Live Answers state for current question
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, ScannedStudentAnswer>>({});
  const [recentScanFeed, setRecentScanFeed] = useState<
    {
      studentId: string;
      studentName: string;
      answerOption: AnswerOption;
      isUpdate: boolean;
      timestamp: number;
    }[]
  >([]);

  // Lookup student name from studentId
  const findStudentName = (studentId: string): string | null => {
    const found = students.find((s) => s.studentId.toUpperCase() === studentId.toUpperCase());
    return found ? found.studentName : null;
  };

  // Reload answers when current question index changes
  const reloadQuestionAnswers = () => {
    if (!currentQuestion) return;
    const ansMap = getAnswersForQuestion(currentQuestion.questionId);
    setCurrentAnswers(ansMap);
  };

  useEffect(() => {
    reloadQuestionAnswers();
    setIsAnswerRevealed(false);
    setIsQuestionLocked(false);
    setIsTimerExpired(false);

    // Reset and initialize timer if timerDuration > 0
    if (timerDuration > 0) {
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    } else {
      setTimeLeft(0);
      setIsTimerRunning(false);
    }
  }, [currentQuestionIndex, timerDuration]);

  // Timer Countdown Effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            setIsTimerRunning(false);
            setIsTimerExpired(true);
            playSfx('chime', soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, timeLeft, soundEnabled]);

  // Map correctAnswer to option letter
  const correctAnswerLetter: AnswerOption = currentQuestion.correctAnswerLetter as AnswerOption;

  // Handle new scan from webcam or simulator
  const handleScanResult = (result: {
    studentId: string;
    answerOption: AnswerOption;
    orientation?: AnswerOption;
    angleDeg?: number;
  }) => {
    if (isQuestionLocked) {
      return;
    }

    const effectiveOption = result.answerOption || result.orientation || 'A';

    const student = students.find(
      (s) => s.studentId.toUpperCase() === result.studentId.toUpperCase()
    );

    const studentName = student ? student.studentName : 'Murid Kad ' + result.studentId;
    const className = student ? student.class : selectedClass;

    // Map letter to option text for rich record keeping
    const optLetterIdx = ['A', 'B', 'C', 'D'].indexOf(effectiveOption);
    const answerText = optLetterIdx >= 0 ? currentQuestion.options[optLetterIdx] : effectiveOption;

    // Record or update answer (duplicate scan: overwrites with latest answer unless locked)
    const { answer, isUpdate, rejectedLocked } = recordStudentAnswer(
      currentQuestion.questionId,
      result.studentId,
      studentName,
      className,
      effectiveOption,
      result.angleDeg || 0,
      correctAnswerLetter,
      {
        sessionId: `SESI_${selectedClass.replace(/\s+/g, '_')}`,
        dskpCode: currentQuestion.dskpCode,
        answerText,
        correctAnswerText: currentQuestion.correctAnswer,
        isLocked: isQuestionLocked,
      }
    );

    if (rejectedLocked) {
      return;
    }

    // Update local answers map
    setCurrentAnswers((prev) => ({
      ...prev,
      [result.studentId]: answer,
    }));

    // Add to real-time scanning feed
    setRecentScanFeed((prev) => [
      {
        studentId: result.studentId,
        studentName,
        answerOption: effectiveOption,
        isUpdate,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 6),
    ]);
  };

  // Classroom stats computation
  const stats = useMemo(() => {
    const total = students.length;
    return computeClassroomStats(
      currentQuestion.questionId,
      total,
      isAnswerRevealed ? correctAnswerLetter : undefined
    );
  }, [students.length, currentQuestion.questionId, currentAnswers, isAnswerRevealed, correctAnswerLetter]);

  // Overall session summary for all 30 questions
  const overallSummary = useMemo(() => {
    const qIds = questions.map((q) => q.questionId);
    return computeSessionOverallSummary(qIds, students.length);
  }, [questions, students.length, currentAnswers]);

  // Clear answers for this question
  const handleResetCurrentQuestion = () => {
    playSfx('click', soundEnabled);
    clearQuestionAnswers(currentQuestion.questionId);
    setCurrentAnswers({});
    setRecentScanFeed([]);
  };

  // Quick simulation helper for demonstration or when camera is unavailable
  const handleSimulateScanForCurrentQuestion = () => {
    if (isQuestionLocked) return;
    playSfx('chime', soundEnabled);
    const letters: AnswerOption[] = ['A', 'B', 'C', 'D'];
    students.forEach((st) => {
      // 75% bias towards correct answer, 25% other choices
      const isCorrect = Math.random() < 0.75;
      const chosenLetter = isCorrect
        ? correctAnswerLetter
        : letters.filter((l) => l !== correctAnswerLetter)[Math.floor(Math.random() * 3)];

      handleScanResult({
        studentId: st.studentId,
        answerOption: chosenLetter,
        orientation: chosenLetter,
        angleDeg: 0,
      });
    });
  };

  // Helper for difficulty badge styling
  const getDifficultyBadge = (level: string) => {
    if (level === 'mudah') {
      return (
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Tahap 1: Mudah</span>
        </span>
      );
    }
    if (level === 'sederhana') {
      return (
        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Tahap 2: Sederhana</span>
        </span>
      );
    }
    return (
      <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span>Tahap 3: Mencabar</span>
      </span>
    );
  };

  const optionLetters: InteractiveCardOrientation[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* TOP SESSION CONTROL NAVIGATION BAR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#D98262] text-white flex items-center justify-center font-bold text-xl shadow-sm">
            👨‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif-title font-bold text-[#4A3728] text-base sm:text-lg">
                Kelas Interaktif: {selectedClass}
              </span>
              <span className="bg-[#3c4233] text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full font-mono">
                SOALAN {currentQuestionIndex + 1} / {questions.length}
              </span>
              {getDifficultyBadge(currentQuestion.difficultyLevel)}
            </div>
            <p className="text-xs text-stone-500 font-medium">
              1 Laptop Guru mengimbas kad jawapan murid serentak secara masa-nyata & 100% offline.
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Question Picker Jump */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsQuestionPickerOpen((p) => !p)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Lompat terus ke soalan 1 - 30"
            >
              <ListOrdered className="w-3.5 h-3.5 text-stone-500" />
              <span>Pilih Soalan</span>
            </button>

            {isQuestionPickerOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl p-3 border-2 border-amber-300 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                  <span className="text-xs font-bold text-[#4A3728]">Pilih Soalan (1 - 30)</span>
                  <button
                    type="button"
                    onClick={() => setIsQuestionPickerOpen(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto p-1">
                  {questions.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const ansCount = Object.keys(getAnswersForQuestion(q.questionId)).length;
                    return (
                      <button
                        key={q.questionId}
                        type="button"
                        onClick={() => {
                          playSfx('click', soundEnabled);
                          setCurrentQuestionIndex(idx);
                          setIsQuestionPickerOpen(false);
                        }}
                        className={`p-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#D98262] text-white shadow-sm'
                            : ansCount > 0
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        Q{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Toggle */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsPrivacyMode((p) => !p);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPrivacyMode
                ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
            }`}
            title="Sembunyikan pilihan murid pada skrin untuk elak murid meniru kawan"
          >
            {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPrivacyMode ? 'Mod Privasi Aktif' : 'Mod Privasi'}</span>
          </button>

          {/* Test Scanner Simulation Modal */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsTestModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Uji imbasan kad murid KP-001 (A), KP-002 (B), dsb."
          >
            <span>🧪</span>
            <span>Uji Scanner</span>
          </button>

          {/* Camera On/Off Toggle */}
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              setIsCameraActive((c) => !c);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCameraActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-700 border-stone-300'
            }`}
          >
            {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? 'Kamera Aktif' : 'Kamera Mati'}</span>
          </button>

          {/* End Session & Summary Button */}
          <button
            type="button"
            onClick={() => {
              playSfx('chime', soundEnabled);
              setIsSessionCompleteModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#3c4233] hover:bg-stone-900 text-amber-300 border border-stone-800 text-xs font-black shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            title="Lihat rumusan prestasi keseluruhan kelas"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Rumusan Sesi</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN SPLIT GRID: SOALAN & VISUAL (LEFT) + SCANNER & HUD (RIGHT) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: SOALAN, VISUAL MATEMATIK & PILIHAN (7 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-4 border-amber-300 shadow-lg relative">
            {/* Question Header & DSKP Indicator */}
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#3c4233] text-amber-300 font-black text-xs font-mono">
                  SOALAN {currentQuestionIndex + 1} / 30
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                  DSKP {currentQuestion.dskpCode}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {currentQuestion.difficultyName}
                </span>
              </div>

              {/* Timer Controls Inline (Optional) */}
              <div className="flex items-center gap-2">
                {/* Timer Duration Picker */}
                <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 border border-stone-200 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-stone-500 ml-1" />
                  <select
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="bg-transparent text-stone-700 text-xs font-bold focus:outline-none cursor-pointer pr-1"
                    title="Pilihan Timer (Guru boleh aktifkan atau matikan bila-bila masa)"
                  >
                    <option value={0}>Tiada Timer</option>
                    <option value={15}>15 Saat</option>
                    <option value={30}>30 Saat</option>
                    <option value={45}>45 Saat</option>
                    <option value={60}>60 Saat</option>
                  </select>
                </div>

                {timerDuration > 0 && (
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-mono text-xs font-black px-2 py-1 rounded-xl border ${
                        timeLeft <= 5 && timeLeft > 0
                          ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                          : timeLeft === 0
                          ? 'bg-stone-200 text-stone-500 border-stone-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {timeLeft}s
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsTimerRunning((r) => !r)}
                      className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
                      title={isTimerRunning ? 'Jeda Timer' : 'Mulakan Timer'}
                    >
                      {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeLeft(timerDuration);
                        setIsTimerRunning(false);
                        setIsTimerExpired(false);
                      }}
                      className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timer Expired Banner Alert */}
            {isTimerExpired && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs font-bold text-amber-900 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>⏱️ Masa Menjawab Tamat! Guru boleh dedahkan jawapan sekarang atau teruskan mengimbas.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimerExpired(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-xs"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Question Text (Clear, large, child friendly) */}
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728] leading-relaxed mb-4 whitespace-pre-line">
              {currentQuestion.question}
            </h3>

            {/* ======================================================== */}
            {/* DYNAMIC MATHEMATICAL VISUAL (SEPADAN DENGAN SOALAN) */}
            {/* ======================================================== */}
            <div className="mb-5 flex justify-center">
              <DynamicMathVisual
                visualType={currentQuestion.visualType}
                visualData={currentQuestion.visualData}
                hideResult={!isAnswerRevealed}
                className="w-full max-w-lg shadow-sm"
              />
            </div>

            {/* Optional Hint Pill */}
            {currentQuestion.hint && (
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Petunjuk Guru:</strong> {currentQuestion.hint}
                </span>
              </div>
            )}

            {/* 4 Options Grid (A, B, C, D) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {currentQuestion.options.map((option, idx) => {
                const letter = optionLetters[idx];
                const isCorrect = isAnswerRevealed && letter === correctAnswerLetter;
                const voteCount = stats.counts[letter] || 0;
                const votePercent = stats.percentages[letter] || 0;

                return (
                  <div
                    key={letter}
                    className={`p-4 rounded-2xl border-2 transition-all relative ${
                      isAnswerRevealed
                        ? isCorrect
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-md ring-2 ring-emerald-400'
                          : 'bg-stone-50 border-stone-200 text-stone-500 opacity-70'
                        : 'bg-white border-stone-200 hover:border-amber-400 text-[#4A3728]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                            isAnswerRevealed && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-base font-bold">{option}</span>
                      </div>

                      {/* Vote Count Pill */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                          isAnswerRevealed && isCorrect
                            ? 'bg-emerald-200 text-emerald-950 border border-emerald-400'
                            : 'bg-amber-100 text-amber-950 border border-amber-200'
                        }`}
                      >
                        {voteCount} ({votePercent}%)
                      </span>
                    </div>

                    {/* Reveal feedback badge */}
                    {isAnswerRevealed && isCorrect && (
                      <div className="mt-2 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Jawapan Tepat!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer Reveal & Explanation Box */}
            {isAnswerRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 space-y-2 shadow-inner"
              >
                <div className="font-bold flex items-center justify-between gap-2 text-emerald-800 text-sm">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Jawapan Sebenar: <strong>Pilihan [{correctAnswerLetter}] — {currentQuestion.correctAnswer}</strong>
                    </span>
                  </div>

                  {/* Live Score Counter */}
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-400 font-black">
                      ✓ {stats.correctCount} Betul
                    </span>
                    <span className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-lg border border-rose-300 font-black">
                      ✗ {stats.wrongCount} Perlu Bimbingan
                    </span>
                  </div>
                </div>

                <p className="text-stone-700 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <strong>Penerangan:</strong> {currentQuestion.explanation}
                </p>
              </motion.div>
            )}

            {/* Navigation & Reveal Action Controls */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>⬅️ Soalan Sebelum</span>
              </button>

              {/* Lock Question Button */}
              <button
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setIsQuestionLocked((prev) => !prev);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all ${
                  isQuestionLocked
                    ? 'bg-rose-700 hover:bg-rose-800 text-white'
                    : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                }`}
                title={isQuestionLocked ? 'Buka semula imbasan' : 'Kunci soalan untuk hentikan imbasan'}
              >
                <span>{isQuestionLocked ? '🔒 Soalan Dikunci' : '🔓 Kunci Soalan'}</span>
              </button>

              {/* Reveal Button (Primary Teacher Action) */}
              <button
                type="button"
                onClick={() => {
                  playSfx(isAnswerRevealed ? 'click' : 'chime', soundEnabled);
                  setIsAnswerRevealed((r) => {
                    const next = !r;
                    if (next) {
                      setIsQuestionLocked(true);
                    }
                    return next;
                  });
                }}
                className={`px-6 py-2.5 rounded-2xl text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                  isAnswerRevealed
                    ? 'bg-stone-800 text-white hover:bg-stone-900'
                    : 'bg-[#D98262] hover:bg-[#c36f51] text-white ring-2 ring-amber-300'
                }`}
              >
                <span>{isAnswerRevealed ? '👁️ Sembunyi Jawapan' : '👁️ Tunjuk Jawapan Sebenar'}</span>
              </button>

              {/* Next Question or Finish Session */}
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-[#3c4233] hover:bg-stone-900 text-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <span>Soalan Seterusnya ➡️</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    playSfx('chime', soundEnabled);
                    setIsSessionCompleteModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all animate-bounce"
                >
                  <Trophy className="w-4 h-4" />
                  <span>🎉 Tamatkan Sesi</span>
                </button>
              )}
            </div>
          </div>

          {/* Classroom Answer Distribution Bar Chart */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm">
            <h4 className="font-serif-title text-sm font-bold text-[#4A3728] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#D98262]" />
                <span>Taburan Jawapan Murid (A, B, C, D)</span>
              </span>
              <span className="text-xs text-stone-500 font-normal">
                {stats.totalAnswered} / {stats.totalStudents} murid telah diimbas
              </span>
            </h4>

            {/* Visual Bars for A, B, C, D */}
            <div className="space-y-2.5">
              {optionLetters.map((letter) => {
                const count = stats.counts[letter] || 0;
                const pct = stats.percentages[letter] || 0;
                const isCorrect = isAnswerRevealed && letter === correctAnswerLetter;

                return (
                  <div key={letter} className="flex items-center gap-3 text-xs">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {letter}
                    </span>

                    <div className="flex-1 bg-stone-100 rounded-full h-4 overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isCorrect ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="w-16 text-right font-mono font-bold text-stone-700 shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CAMERA SCANNER & STUDENT MATRIX (5 cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* Camera Scanner Viewfinder */}
          {isCameraActive ? (
            <CameraScannerOverlay
              isActive={isCameraActive}
              onScanResult={handleScanResult}
              findStudentName={findStudentName}
              students={students}
              selectedClass={selectedClass}
              isQuestionLocked={isQuestionLocked}
              answeredCount={stats.totalAnswered}
              unansweredCount={stats.totalUnanswered}
              totalStudents={students.length}
              soundEnabled={soundEnabled}
              onOpenTestMode={() => setIsTestModalOpen(true)}
            />
          ) : (
            <div className="h-[360px] bg-slate-900 rounded-3xl border-4 border-amber-200 flex flex-col items-center justify-center text-white p-6 text-center">
              <CameraOff className="w-12 h-12 text-stone-400 mb-3" />
              <h4 className="font-bold text-base text-amber-200 mb-1">Kamera Dimatikan</h4>
              <p className="text-xs text-stone-400 max-w-xs mb-4">
                Kamera laptop diperlukan untuk mengimbas kad jawapan murid di bilik darjah.
              </p>
              <button
                type="button"
                onClick={() => setIsCameraActive(true)}
                className="px-4 py-2 rounded-2xl bg-[#D98262] hover:bg-[#c26e50] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Hidupkan Kamera Sekarang 📷
              </button>
            </div>
          )}

          {/* Response Count Status Card (🟢 Sudah Jawab / ⚪ Belum Jawab) */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif-title font-bold text-sm text-[#4A3728] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#D98262]" />
                <span>Status Jawapan Murid</span>
              </h4>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {stats.percentAnswered}% Selesai
                </span>
                <button
                  type="button"
                  onClick={handleSimulateScanForCurrentQuestion}
                  className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Simulasi imbasan kad murid untuk soalan ini jika kamera tidak aktif"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span className="hidden sm:inline">Simulasi</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCurrentQuestion}
                  className="text-[11px] font-bold text-stone-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Padam imbasan jawapan untuk soalan ini"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Big Status Metric Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-emerald-800 font-bold mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>🟢 Sudah Jawab</span>
                </div>
                <div className="text-2xl font-black text-emerald-900 font-mono">
                  {stats.totalAnswered} / {stats.totalStudents}
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-stone-600 font-bold mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-stone-300" />
                  <span>⚪ Belum Jawab</span>
                </div>
                <div className="text-2xl font-black text-stone-700 font-mono">
                  {stats.totalUnanswered} / {stats.totalStudents}
                </div>
              </div>
            </div>

            {/* Students Matrix Tokens Grid */}
            <div className="border-t border-stone-100 pt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-2">
                <span>Senarai Kad Murid ({students.length}):</span>
                {isPrivacyMode && (
                  <span className="text-purple-700 flex items-center gap-1 font-normal">
                    <Shield className="w-3 h-3" />
                    <span>Mod Privasi Aktif</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-44 overflow-y-auto p-1 bg-stone-50/70 rounded-2xl border border-stone-200">
                {students.map((st) => {
                  const ans = currentAnswers[st.studentId];
                  const hasAnswered = !!ans;
                  const isCorrect = isAnswerRevealed && ans && ans.answerLetter === correctAnswerLetter;

                  return (
                    <div
                      key={st.studentId}
                      className={`p-1.5 rounded-xl border text-center transition-all ${
                        hasAnswered
                          ? isAnswerRevealed
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold'
                              : 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-400'
                      }`}
                      title={`${st.studentId} - ${st.studentName}: ${
                        hasAnswered ? `Pilihan [${ans.answerLetter}]` : 'Belum mengimbas'
                      }`}
                    >
                      <span className="block text-[10px] font-mono leading-tight">
                        {st.studentId}
                      </span>

                      <div className="flex items-center justify-center mt-0.5">
                        {hasAnswered ? (
                          <span className="text-xs font-black">
                            {isPrivacyMode ? '✓' : ans.answerLetter}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-300">⚪</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: END OF SESSION SUMMARY (🎉 SESI SELESAI!) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isSessionCompleteModalOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#FFF8E8] p-6 sm:p-8 rounded-3xl border-4 border-[#F4C95D] shadow-2xl max-w-2xl w-full font-rounded space-y-5 my-8"
            >
              {/* Header */}
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-3xl bg-amber-200 text-amber-900 text-3xl flex items-center justify-center mx-auto shadow-sm">
                  🎉
                </div>
                <h3 className="font-serif-title text-2xl font-black text-[#4A3728]">
                  Sesi Kelas Interaktif Selesai!
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Kelas: <strong>{selectedClass}</strong> • Bank Soalan DSKP 3.1 Pecahan
                </p>
              </div>

              {/* Main Overall Class Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 font-bold block">Jumlah Soalan</span>
                  <span className="text-2xl font-black text-[#4A3728] font-mono">30</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 font-bold block">Jumlah Murid</span>
                  <span className="text-2xl font-black text-[#4A3728] font-mono">{students.length}</span>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 text-center shadow-xs">
                  <span className="text-[11px] text-emerald-800 font-bold block">Purata Kelas</span>
                  <span className="text-2xl font-black text-emerald-950 font-mono">
                    {overallSummary.averageClassAccuracy}%
                  </span>
                </div>
              </div>

              {/* DSKP Standards Mastery Breakdown */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 space-y-2.5">
                <h4 className="font-serif-title text-sm font-bold text-[#4A3728] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#D98262]" />
                  <span>Analisis Penguasaan Mengikut DSKP Tahun 3</span>
                </h4>

                <div className="space-y-1.5 text-xs">
                  {[
                    { code: '3.1.1', label: 'Pecahan wajar sebahagian kumpulan' },
                    { code: '3.1.2', label: 'Pecahan setara' },
                    { code: '3.1.3', label: 'Bentuk termudah' },
                    { code: '3.1.4', label: 'Pecahan peratus' },
                    { code: '3.1.5', label: 'Tambah dua pecahan wajar' },
                    { code: '3.1.6', label: 'Tolak dua pecahan wajar' },
                    { code: '3.1.7', label: 'Pecahan tak wajar & nombor bercampur' },
                  ].map((std) => {
                    const stdQuestions = questions.filter((q) => q.dskpCode === std.code);
                    let stdAnswered = 0;
                    let stdCorrect = 0;
                    stdQuestions.forEach((q) => {
                      const stat = overallSummary.questionStats[q.questionId];
                      if (stat) {
                        stdAnswered += stat.totalAnswered;
                        stdCorrect += stat.correctCount;
                      }
                    });
                    const pct = stdAnswered > 0 ? Math.round((stdCorrect / stdAnswered) * 100) : 0;

                    return (
                      <div key={std.code} className="flex items-center justify-between gap-3 p-1.5 bg-stone-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-[#3c4233] text-amber-300 text-[10px] px-1.5 py-0.5 rounded">
                            {std.code}
                          </span>
                          <span className="font-bold text-[#4A3728]">{std.label}</span>
                        </div>
                        <span className={`font-mono font-black ${pct >= 70 ? 'text-emerald-700' : pct >= 40 ? 'text-amber-700' : 'text-stone-500'}`}>
                          {stdAnswered > 0 ? `${pct}%` : 'Belum diuji'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Keep in Mode Guru */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSessionCompleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors"
                >
                  Kembali ke Soalan
                </button>

                {onBackToTabs && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSessionCompleteModalOpen(false);
                      onBackToTabs();
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#D98262] hover:bg-[#c36f51] text-white text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    📊 Kembali ke Dashboard Pengurusan
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Test Mode Simulation Modal */}
      <ScannerTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onSimulateScan={(id, answerOption, angleDeg) => {
          handleScanResult({ studentId: id, answerOption, orientation: answerOption, angleDeg });
        }}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
