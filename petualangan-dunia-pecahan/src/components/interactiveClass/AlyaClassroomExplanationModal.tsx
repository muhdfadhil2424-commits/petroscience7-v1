// Modal Interaktif Pedagogi: Penerangan Alya (Guru Kecil)
// Memaparkan panduan visual dinamik, audio sebutan ms-MY, dan manipulasi konsep interaktif "Cuba Sendiri"
// Layout: 1. Alya -> 2. Soalan -> 3. Visual -> 4. Langkah 1, 2, 3 -> 5. Ingat! -> 6. Dengar Penjelasan & Cuba Sendiri -> 7. Navigasi

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Volume2,
  Pause,
  Play,
  Square,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  Star,
  RotateCcw,
  Gamepad2,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { InteractiveClassQuestion } from '../../data/interactiveClass30Questions';
import { DynamicMathVisual } from '../DynamicMathVisual';
import { AlyaInteractiveTryIt } from './AlyaInteractiveTryIt';
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
import { ClassroomQuestionStats } from '../../utils/interactiveSessionManager';

interface AlyaClassroomExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: InteractiveClassQuestion;
  questionIndex: number;
  totalQuestions: number;
  soundEnabled?: boolean;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  classStats?: ClassroomQuestionStats;
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
  classStats,
}) => {
  const [audioStatus, setAudioStatus] = useState<AudioPlayStatus>('stopped');
  const [showTryIt, setShowTryIt] = useState<boolean>(false);
  const [tryItCompleted, setTryItCompleted] = useState<boolean>(false);
  const [visualKey, setVisualKey] = useState<number>(0);

  const speechSupported = useMemo(() => isSpeechSynthesisSupported(), []);

  // Jana penerangan berstruktur berasaskan soalan sebenar dan data kelas
  const explanationData: AlyaQuestionExplanation = useMemo(() => {
    return getAlyaQuestionExplanation(question, classStats);
  }, [question, classStats]);

  // Hentikan suara dan reset aktiviti interaktif apabila soalan bertukar
  useEffect(() => {
    setAudioStatus('stopped');
    stopAlyaSpeech();
    setShowTryIt(false);
    setTryItCompleted(false);
    setVisualKey((prev) => prev + 1);

    return () => {
      stopAlyaSpeech();
      setAudioStatus('stopped');
    };
  }, [question.questionId, isOpen]);

  if (!isOpen) return null;

  // Kawalan Audio (Bahasa Melayu ms-MY Standard)
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

  // Navigasi & Tutup
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

  const handleReplayVisual = () => {
    playSfx('click', soundEnabled);
    setVisualKey((prev) => prev + 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="alya-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl border-4 border-indigo-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* ======================================================== */}
        {/* 🤖 1. HEADER ALYA: “Jom kita lihat caranya!” */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 px-5 py-4 sm:px-7 sm:py-4.5 border-b-2 border-indigo-500/40 flex items-center justify-between text-white shrink-0 shadow-sm">
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Avatar Alya */}
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center shadow-md text-2xl sm:text-3xl">
                🤖
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-indigo-900 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-indigo-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100 border border-white/30">
                  GURU KECIL MATEMATIK
                </span>
                <span className="text-xs font-bold text-indigo-200">
                  DSKP {explanationData.dskpCode} • {explanationData.topicTitle}
                </span>
              </div>
              <h2
                id="alya-modal-title"
                className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 mt-0.5"
              >
                <span>Penerangan Alya</span>
                <span className="text-xs sm:text-sm font-semibold text-indigo-200 font-sans hidden sm:inline">
                  — “Jom kita lihat caranya! 🌟”
                </span>
              </h2>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            id="btn-tutup-alya-modal"
            aria-label="Tutup Penerangan Alya"
            className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer border border-white/25"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY (SCROLLABLE CONTENT) */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 sm:px-8 overflow-y-auto space-y-5 flex-1 bg-stone-50/60">
          {/* Dialog Mesra Guru Kecil Alya */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-sm sm:text-base font-medium text-indigo-950 flex items-start gap-2.5 shadow-2xs">
            <span className="text-xl shrink-0">🤖</span>
            <div className="leading-relaxed">
              <strong className="text-indigo-950 font-black">Alya: </strong>
              <span className="italic">
                “Tak apa kalau tadi tersilap. Mari kita semak semula langkahnya bersama-sama! Kita belajar konsep pecahan ini dengan mudah.”
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 📝 2. SOALAN & JAWAPAN BETUL */}
          {/* ======================================================== */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>📝</span> Soalan {questionIndex + 1} daripada {totalQuestions}
              </span>
              <span className="text-xs font-bold text-stone-500">
                Pilihan Jawapan: A, B, C, D
              </span>
            </div>

            {/* Soalan Sebenar */}
            <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed whitespace-pre-line">
              {question.question}
            </p>

            {/* Banner Jawapan Betul */}
            <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-[#F0FDF4] to-teal-50 border-2 border-emerald-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-mono font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                  {explanationData.correctAnswerLetter}
                </div>
                <div>
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                    Jawapan Betul:
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-black text-emerald-950">
                    Pilihan [{explanationData.correctAnswerLetter}] — {explanationData.correctAnswerValue}
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 shadow-2xs flex items-center gap-2 self-start sm:self-auto text-xs sm:text-sm font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{explanationData.correctAnswerBanner}</span>
              </div>
            </div>

            {/* Ringkasan Kehendak Soalan */}
            <div className="pt-2 text-sm sm:text-base font-normal text-stone-700 leading-relaxed">
              <strong className="text-indigo-900 font-bold">💡 Kita faham soalan: </strong>
              {explanationData.understandQuestion}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 🎨 3. VISUAL PECAHAN DINAMIK */}
          {/* ======================================================== */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-indigo-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🎨</span> Visual Pecahan
                </span>
                <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
                  (Berdasarkan data soalan sebenar)
                </span>
              </div>

              <button
                type="button"
                onClick={handleReplayVisual}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-950 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                title="Ulang paparan visual pecahan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulang Animasi Visual</span>
              </button>
            </div>

            {/* Paparan Visual Matematik Dinamik */}
            <div key={visualKey} className="flex justify-center p-2 sm:p-3 bg-stone-50/80 rounded-xl border border-stone-200">
              <DynamicMathVisual
                visualType={question.visualType}
                visualData={question.visualData}
                hideResult={false}
                className="w-full max-w-lg shadow-2xs bg-white border-2 border-indigo-100"
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* 💡 4. LANGKAH DEMI LANGKAH (CARA BERFIKIR) */}
          {/* ======================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2 uppercase tracking-wide">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Langkah Demi Langkah:</span>
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-full border border-indigo-200">
                {explanationData.steps.length} Langkah Jelas
              </span>
            </div>

            <div
              className={`grid grid-cols-1 ${
                explanationData.steps.length === 2
                  ? 'md:grid-cols-2'
                  : explanationData.steps.length === 3
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-2 lg:grid-cols-4'
              } gap-3 sm:gap-4`}
            >
              {explanationData.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-white p-4 rounded-2xl border-2 border-indigo-200/90 shadow-xs flex flex-col justify-between hover:border-indigo-400 transition-colors"
                >
                  <div>
                    {/* Step Header Badge & Number */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wide">
                        {step.label}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-900 text-xs font-black flex items-center justify-center border border-indigo-200">
                        #{step.stepNumber}
                      </span>
                    </div>

                    {/* Soalan Kecil Bimbingan Alya */}
                    {step.questionGuide && (
                      <div className="mb-2 p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-xs sm:text-sm font-semibold text-indigo-900 italic flex items-center gap-1.5">
                        <span className="shrink-0 text-indigo-600">❓</span>
                        <span>{step.questionGuide}</span>
                      </div>
                    )}

                    {/* Tajuk Langkah (Bold) */}
                    <h4 className="text-sm sm:text-base font-black text-indigo-950 mb-1 leading-snug">
                      {step.title}
                    </h4>

                    {/* Penerangan Biasa (Regular weight, font-normal) */}
                    <p className="text-sm sm:text-base font-normal text-stone-700 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  {/* Math Expression Box (20-24px, font-mono, bold) */}
                  {step.mathExpression && (
                    <div className="mt-3 pt-2.5 border-t border-indigo-100">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-950 font-mono font-black text-lg sm:text-xl tracking-wide">
                        {step.mathExpression}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* ⭐ 5. INGAT! (KONSEP UTAMA) */}
          {/* ======================================================== */}
          <div className="bg-amber-50 border-3 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Star className="w-5 h-5 text-amber-600 fill-amber-500 shrink-0" />
              <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wide">
                ⭐ INGAT! (KONSEP UTAMA)
              </h3>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-950 leading-relaxed">
              {explanationData.keyConceptRemember}
            </p>
          </div>

          {/* Adaptif Mengikut Kesalahan Kelas (Jika Ada) */}
          {explanationData.adaptiveClassInsight?.hasSignificantMistake && (
            <div className="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wide">
                  Perhatian Bimbingan Kelas:
                </h3>
              </div>
              <p className="text-sm sm:text-base font-semibold text-amber-950 leading-relaxed">
                <strong className="font-bold text-amber-900">Ulasan Guru Kecil Alya: </strong>
                {explanationData.adaptiveClassInsight.misconceptionExplanation}
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* 🌟 6. KAMU DAH FAHAM? -> AUDIO & CUBA SENDIRI */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Kamu Dah Faham?</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                  Dengar suara penjelasan Alya atau uji manipulasi konsep pecahan secara interaktif.
                </p>
              </div>

              {/* Action Buttons: 🎧 Dengar Penjelasan & 🧩 Cuba Sendiri */}
              <div className="flex items-center flex-wrap gap-2.5">
                {/* Audio Button */}
                {speechSupported && (
                  <div className="flex items-center gap-1.5">
                    {audioStatus === 'stopped' && (
                      <button
                        type="button"
                        onClick={handlePlayAudio}
                        id="btn-audio-dengar"
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm sm:text-base font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>🎧 Dengar Penjelasan</span>
                      </button>
                    )}

                    {audioStatus === 'playing' && (
                      <button
                        type="button"
                        onClick={handlePauseAudio}
                        id="btn-audio-jeda"
                        className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm sm:text-base font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98"
                      >
                        <Pause className="w-4 h-4" />
                        <span>⏸️ Jeda</span>
                      </button>
                    )}

                    {audioStatus === 'paused' && (
                      <button
                        type="button"
                        onClick={handleResumeAudio}
                        id="btn-audio-sambung"
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-98"
                      >
                        <Play className="w-4 h-4" />
                        <span>▶️ Sambung</span>
                      </button>
                    )}

                    {audioStatus !== 'stopped' && (
                      <button
                        type="button"
                        onClick={handleStopAudio}
                        id="btn-audio-berhenti"
                        className="px-3 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-700 text-sm font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Berhenti dengar"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>⏹️ Berhenti</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Butang Interaktif: 🧩 Cuba Sendiri */}
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowTryIt(!showTryIt);
                  }}
                  id="btn-cuba-sendiri-toggle"
                  className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-102 active:scale-98 border-2 ${
                    showTryIt
                      ? 'bg-purple-700 text-white border-purple-800 ring-2 ring-purple-300'
                      : 'bg-white text-purple-900 border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>🧩 {showTryIt ? 'Tutup Aktiviti' : 'Cuba Sendiri'}</span>
                </button>
              </div>
            </div>

            {/* Aktiviti Interaktif Cuba Sendiri (Jika Dibuka) */}
            <AnimatePresence>
              {showTryIt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden pt-2"
                >
                  <AlyaInteractiveTryIt
                    question={question}
                    soundEnabled={soundEnabled}
                    onSuccess={() => {
                      setTryItCompleted(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. FOOTER KAWALAN: ← KEMBALI & ➡️ SOALAN SETERUSNYA */}
        {/* ======================================================== */}
        <div className="px-5 py-3.5 sm:px-7 sm:py-4 bg-white border-t-2 border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            id="btn-modal-kembali"
            className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            id="btn-modal-soalan-seterusnya"
            className={`px-6 py-2.5 rounded-2xl text-white text-sm sm:text-base font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98 ${
              tryItCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-300/60 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            <span>{isLastQuestion ? 'Tamat Sesi 🏁' : 'Soalan Seterusnya'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
