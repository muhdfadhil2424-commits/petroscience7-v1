import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  ArrowRight,
  CheckCircle2,
  X,
  Lightbulb,
  Trophy,
  BookOpen,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { InteractiveClassQuestion } from '../../data/interactiveClass30Questions';
import { AlyaCharacter } from '../AlyaCharacter';
import { DynamicMathVisual } from '../DynamicMathVisual';
import {
  speakAlyaExplanation,
  pauseAlyaSpeech,
  resumeAlyaSpeech,
  stopAlyaSpeech,
  isSpeechSynthesisSupported,
} from '../../utils/speech';
import { playSfx } from '../../utils/audio';
import {
  getAlyaQuestionExplanation,
  AlyaQuestionExplanation,
} from '../../data/alyaClassroomExplanations';

interface AlyaClassroomExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: InteractiveClassQuestion;
  questionIndex: number;
  totalQuestions: number;
  soundEnabled?: boolean;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

type AudioPlayStatus = 'stopped' | 'playing' | 'paused';

export const AlyaClassroomExplanationModal: React.FC<AlyaClassroomExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  questionIndex,
  totalQuestions,
  soundEnabled = true,
  onNextQuestion,
  isLastQuestion,
}) => {
  const [audioStatus, setAudioStatus] = useState<AudioPlayStatus>('stopped');
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const speechSupported = useMemo(() => isSpeechSynthesisSupported(), []);

  // Fetch specialized Year 3 explanation tailored specifically to this question
  const explanationData: AlyaQuestionExplanation = useMemo(() => {
    return getAlyaQuestionExplanation(question);
  }, [question]);

  // Reset audio & active step when modal opens or question changes
  useEffect(() => {
    setActiveStepIndex(null);
    setAudioStatus('stopped');
    stopAlyaSpeech();

    return () => {
      stopAlyaSpeech();
      setAudioStatus('stopped');
    };
  }, [question.questionId, isOpen]);

  if (!isOpen) return null;

  // Audio Control Handlers
  const handlePlayAudio = () => {
    if (!speechSupported) return;
    playSfx('click', soundEnabled);
    setAudioStatus('playing');

    speakAlyaExplanation({
      text: explanationData.speechScript,
      onStart: () => setAudioStatus('playing'),
      onEnd: () => setAudioStatus('stopped'),
      onError: () => setAudioStatus('stopped'),
      onPause: () => setAudioStatus('paused'),
      onResume: () => setAudioStatus('playing'),
    });
  };

  const handlePauseAudio = () => {
    if (!speechSupported) return;
    playSfx('click', soundEnabled);
    pauseAlyaSpeech();
    setAudioStatus('paused');
  };

  const handleResumeAudio = () => {
    if (!speechSupported) return;
    playSfx('click', soundEnabled);
    resumeAlyaSpeech();
    setAudioStatus('playing');
  };

  const handleStopAudio = () => {
    if (!speechSupported) return;
    playSfx('click', soundEnabled);
    stopAlyaSpeech();
    setAudioStatus('stopped');
  };

  // Close and navigate handlers
  const handleClose = () => {
    stopAlyaSpeech();
    setAudioStatus('stopped');
    onClose();
  };

  const handleNext = () => {
    stopAlyaSpeech();
    setAudioStatus('stopped');
    playSfx('click', soundEnabled);
    onNextQuestion();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F3] to-[#FFF4ED] rounded-3xl border-4 border-[#F6C7A8] shadow-2xl overflow-hidden my-auto"
      >
        {/* ======================================================== */}
        {/* TOP HEADER BANNER */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-[#F6C7A8] via-[#FFD7BA] to-[#F6C7A8] px-4 py-3.5 sm:px-6 sm:py-4 border-b-2 border-amber-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1 shadow-sm flex items-center justify-center border-2 border-pink-200 shrink-0">
              <AlyaCharacter mood="encouraging" size="md" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <span>💗</span>
                  <span>ALYA TERANGKAN</span>
                </span>
                <span className="text-[11px] sm:text-xs font-black text-amber-950 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Soalan {questionIndex + 1} / {totalQuestions}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  DSKP {question.dskpCode}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-[#4A3728] mt-0.5 font-serif-title">
                Cara Jawab Bersama Alya 🌟
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            id="btn-close-alya-modal"
            className="w-10 h-10 rounded-2xl bg-white/85 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center cursor-pointer transition-all shadow-xs hover:scale-105 active:scale-95"
            title="Tutup Penerangan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY (SCROLLABLE) */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. KAD SOALAN SEMASA */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-amber-200/90 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-100">
              <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Soalan Sebenar #{questionIndex + 1}</span>
              </span>
              <span className="text-xs font-bold text-stone-500">
                Pilihan Jawapan: A, B, C, D
              </span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-[#4A3728] leading-relaxed whitespace-pre-line">
              {question.question}
            </p>
          </div>

          {/* 2. VISUAL MATEMATIK DINAMIK (DIBINA DARIPADA visualData) */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-full flex justify-center">
              <DynamicMathVisual
                visualType={question.visualType}
                visualData={question.visualData}
                hideResult={false}
                className="w-full max-w-xl shadow-md border-3 border-amber-300/80 bg-white"
              />
            </div>
            <p className="text-[11px] font-bold text-stone-500 text-center">
              💡 Visual matematik dibina secara tepat mengikut data soalan ({question.visualType})
            </p>
          </div>

          {/* 3. ALYA INTRO & TIP PANTAS */}
          <div className="bg-gradient-to-r from-rose-50 via-[#FFF5F7] to-amber-50 rounded-2xl p-4 sm:p-4.5 border-2 border-rose-200 flex items-start gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border-2 border-rose-200 shrink-0 flex items-center justify-center shadow-xs">
              <AlyaCharacter mood="happy" size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span className="text-sm font-black text-rose-800 flex items-center gap-1">
                  <span>💗 Alya:</span>
                  <span className="text-rose-950 font-black">"{explanationData.intro}"</span>
                </span>
                <span className="text-[11px] font-bold text-rose-700 bg-white px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                  Konsep Mudah 🌟
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed">
                {explanationData.conceptNote}
              </p>
            </div>
          </div>

          {/* 4. LANGKAH-LANGKAH PENYELESAIAN (3-4 LANGKAH JELAS TAHUN 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-black text-[#4A3728] flex items-center gap-1.5 uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Langkah Penyelesaian Mudah (Tahun 3):</span>
              </h4>
              <span className="text-[11px] font-bold text-stone-500">
                {explanationData.steps.length} Langkah Teratur
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {explanationData.steps.map((step, idx) => {
                const isSelected = activeStepIndex === idx;
                return (
                  <motion.div
                    key={step.stepNumber}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.12, duration: 0.3 }}
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setActiveStepIndex(isSelected ? null : idx);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300 shadow-md scale-102'
                        : 'bg-white hover:bg-stone-50/90 border-amber-200 shadow-xs hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Step Header Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                            step.badgeColor || 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-black flex items-center justify-center">
                          #{step.stepNumber}
                        </span>
                      </div>

                      {/* Step Title */}
                      <h5 className="text-xs sm:text-sm font-black text-[#4A3728] mb-1.5 leading-snug">
                        {step.title}
                      </h5>

                      {/* Step Detail */}
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">
                        {step.detail}
                      </p>
                    </div>

                    {/* Optional Math Expression Highlight */}
                    {step.mathExpression && (
                      <div className="mt-3 pt-2 border-t border-stone-200/80">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 text-stone-800 font-mono font-bold text-xs tracking-wide">
                          {step.mathExpression}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 5. KAD KESIMPULAN JAWAPAN TEPAT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#F0FDF4] to-teal-50 border-3 border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {question.correctAnswerLetter}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">
                  Jawapan Sebenar:
                </span>
                <span className="text-lg sm:text-xl font-black text-emerald-950 font-mono">
                  {question.correctAnswer}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-emerald-300 shadow-xs w-full sm:w-auto justify-center sm:justify-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-emerald-950">
                {explanationData.conclusion}
              </span>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* 6. KAWALAN AUDIO LENGKAP: DENGAR, JEDA, SAMBUNG, BERHENTI */}
          {/* ======================================================== */}
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Audio Status & Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${
                    audioStatus === 'playing'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : audioStatus === 'paused'
                      ? 'bg-amber-400 text-amber-950'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {audioStatus === 'playing' ? (
                    <Volume2 className="w-5 h-5" />
                  ) : audioStatus === 'paused' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-stone-800">
                      Bimbingan Suara Alya
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        audioStatus === 'playing'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : audioStatus === 'paused'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {audioStatus === 'playing'
                        ? '🟢 Sedang bercakap...'
                        : audioStatus === 'paused'
                        ? '🟡 Dijeda'
                        : '⚪ Sedia mendengar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                    Sebutan Bahasa Melayu standard (ms-MY) • Pecahan disebut tepat
                  </p>
                </div>
              </div>

              {/* Action Buttons: 🔊 Dengar, ⏸️ Jeda, ▶️ Sambung, ⏹️ Berhenti */}
              {speechSupported ? (
                <div className="flex items-center flex-wrap gap-2">
                  {/* Play / Dengar Button (when stopped) */}
                  {audioStatus === 'stopped' && (
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      id="btn-audio-dengar"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 Dengar</span>
                    </button>
                  )}

                  {/* Pause / Jeda Button (when playing) */}
                  {audioStatus === 'playing' && (
                    <button
                      type="button"
                      onClick={handlePauseAudio}
                      id="btn-audio-jeda"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <Pause className="w-4 h-4" />
                      <span>⏸️ Jeda</span>
                    </button>
                  )}

                  {/* Resume / Sambung Button (when paused) */}
                  {audioStatus === 'paused' && (
                    <button
                      type="button"
                      onClick={handleResumeAudio}
                      id="btn-audio-sambung"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <Play className="w-4 h-4" />
                      <span>▶️ Sambung</span>
                    </button>
                  )}

                  {/* Stop / Berhenti Button (when playing or paused) */}
                  {audioStatus !== 'stopped' && (
                    <button
                      type="button"
                      onClick={handleStopAudio}
                      id="btn-audio-berhenti"
                      className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-black flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>⏹️ Berhenti</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 text-xs font-bold flex items-center gap-1.5">
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span>Audio tidak tersedia. (Teks & visual tetap berfungsi)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FOOTER ACTIONS: KEMBALI & ➡️ SOALAN SETERUSNYA */}
        {/* ======================================================== */}
        <div className="bg-stone-50 px-4 py-3.5 sm:px-6 sm:py-4 border-t-2 border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            id="btn-alya-kembali"
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 border-2 border-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <span>⬅️ Kembali</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            id="btn-alya-soalan-seterusnya"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3c4233] to-[#252a1e] hover:from-stone-900 hover:to-black text-amber-300 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-102 active:scale-98"
          >
            {isLastQuestion ? (
              <>
                <Trophy className="w-4.5 h-4.5 text-amber-400" />
                <span>🎉 Tamatkan Sesi</span>
              </>
            ) : (
              <>
                <span>➡️ SOALAN SETERUSNYA</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
