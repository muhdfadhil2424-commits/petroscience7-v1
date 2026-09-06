import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Award,
  Compass,
  HelpCircle,
  Eye,
  Zap
} from 'lucide-react';
import { NOTA_PECAHAN_DATA, NotaTopic } from '../data/notaPecahanData';
import { InteractiveNotaVisual } from './InteractiveNotaVisual';
import { MathFraction } from './MathFraction';
import { playSfx } from '../utils/audio';

interface NotaPecahanModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  initialTopicId?: string;
  onClose: () => void;
  onGoToGame?: () => void;
}

export const NotaPecahanModal: React.FC<NotaPecahanModalProps> = ({
  isOpen,
  soundEnabled,
  initialTopicId,
  onClose,
  onGoToGame,
}) => {
  // State: selectedTopic (null = show all cards list; NotaTopic = show detail view)
  const [selectedTopic, setSelectedTopic] = useState<NotaTopic | null>(() => {
    if (initialTopicId) {
      return NOTA_PECAHAN_DATA.find((t) => t.id === initialTopicId) || null;
    }
    return null;
  });

  // Track understood topics in local component state
  const [understoodTopics, setUnderstoodTopics] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);

  // Active section tab within a detail topic
  const [activeSection, setActiveSection] = useState<'visual' | 'penerangan' | 'harian' | 'ingat'>('visual');

  if (!isOpen) return null;

  const currentTopicIndex = selectedTopic 
    ? NOTA_PECAHAN_DATA.findIndex((t) => t.id === selectedTopic.id) 
    : -1;

  const handleSelectTopic = (topic: NotaTopic) => {
    playSfx('click', soundEnabled);
    setSelectedTopic(topic);
    setActiveSection('visual');
  };

  const handleBackToList = () => {
    playSfx('click', soundEnabled);
    setSelectedTopic(null);
  };

  const handleNextTopic = () => {
    if (currentTopicIndex >= 0 && currentTopicIndex < NOTA_PECAHAN_DATA.length - 1) {
      playSfx('click', soundEnabled);
      setSelectedTopic(NOTA_PECAHAN_DATA[currentTopicIndex + 1]);
      setActiveSection('visual');
    }
  };

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      playSfx('click', soundEnabled);
      setSelectedTopic(NOTA_PECAHAN_DATA[currentTopicIndex - 1]);
      setActiveSection('visual');
    } else {
      handleBackToList();
    }
  };

  const handleMarkUnderstood = (topicId: string) => {
    playSfx('correct', soundEnabled);
    setUnderstoodTopics((prev) => ({ ...prev, [topicId]: true }));
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div 
        id="modal-nota-pecahan-backdrop"
        className="fixed inset-0 z-[1050] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          id="modal-nota-pecahan-container"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl bg-[#FFFDF9] rounded-3xl shadow-2xl border-4 border-[#F4C95D] overflow-hidden flex flex-col max-h-[94vh]"
        >
          {/* TOP BAR HEADER */}
          <div className="bg-gradient-to-r from-[#2d3226] via-[#3a4131] to-[#252a1e] text-white p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between border-b-2 border-[#F4C95D] relative shadow-md">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#F4C95D] text-[#4A3728] flex items-center justify-center text-xl sm:text-2xl shadow-inner font-bold">
                📚
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif-title font-bold text-lg sm:text-2xl text-amber-100 tracking-wide">
                    NOTA PECAHAN INTERAKTIF
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#F4C95D] text-[#4A3728] text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    TAHUN 3
                  </span>
                </div>
                <p className="text-xs text-amber-200/90 font-rounded font-semibold">
                  Kembara Dunia Pecahan • Kad Pembelajaran & Visual Matematik
                </p>
              </div>
            </div>

            {/* Right Buttons: Close */}
            <div className="flex items-center gap-2">
              <button
                id="btn-close-nota-pecahan"
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  onClose();
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#23271e] hover:bg-[#F4C95D] text-amber-200 hover:text-[#4A3728] border border-[#4d5442] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title="Tutup Nota"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* LEARNING WORKFLOW SUB-BANNER */}
          <div className="bg-gradient-to-r from-amber-100 via-[#FFF8E8] to-amber-50 px-3 sm:px-6 py-2 border-b border-[#F6C7A8] flex flex-wrap items-center justify-between gap-2 text-xs font-rounded font-bold text-[#4A3728]">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
              <span className="text-[#D98262] font-black shrink-0">Konsep:</span>
              <span className="px-2 py-0.5 rounded-lg bg-amber-200/70 border border-amber-300 shrink-0 flex items-center gap-1">
                <span>📚</span>
                <span>BELAJAR</span>
              </span>
              <span className="text-amber-500 font-bold">➔</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 shrink-0 text-emerald-900 flex items-center gap-1">
                <span>👀</span>
                <span>FAHAM</span>
              </span>
              <span className="text-amber-500 font-bold">➔</span>
              <span className="px-2 py-0.5 rounded-lg bg-purple-100 border border-purple-300 shrink-0 text-purple-900 flex items-center gap-1">
                <span>🧠</span>
                <span>INGAT</span>
              </span>
              <span className="text-amber-500 font-bold">➔</span>
              <span className="px-2 py-0.5 rounded-lg bg-rose-100 border border-rose-300 shrink-0 text-rose-900 flex items-center gap-1">
                <span>✋</span>
                <span>CUBA</span>
              </span>
            </div>

            {/* Quick Status / Indicator */}
            <div className="text-[11px] sm:text-xs text-[#8A624A] font-extrabold flex items-center gap-1.5">
              {selectedTopic ? (
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 shadow-2xs">
                  NOTA {currentTopicIndex + 1} / {NOTA_PECAHAN_DATA.length}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>7 Kad Pembelajaran Interaktif</span>
                </span>
              )}
            </div>
          </div>

          {/* MODAL MAIN CONTENT SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
            {selectedTopic === null ? (
              /* ========================================================== */
              /* VIEW 1: SENARAI KAD PEMBELAJARAN (INTERACTIVE CARDS GRID)  */
              /* ========================================================== */
              <div className="space-y-4">
                {/* Intro Card */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-[#FFF8E8] to-orange-50 border-2 border-[#F6C7A8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-rounded font-black text-base sm:text-lg text-[#4A3728] flex items-center gap-2">
                      <span>✨ Kad Pembelajaran Pecahan (Tahun 3)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8A624A] font-semibold mt-1">
                      Ketahui konsep pecahan melalui visual pizza, fraction bars, perbandingan warna, dan garis nombor interaktif!
                    </p>
                  </div>
                  <button
                    id="btn-mula-topik-pertama"
                    type="button"
                    onClick={() => handleSelectTopic(NOTA_PECAHAN_DATA[0])}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F4C95D] to-[#D98262] hover:brightness-105 text-[#4A3728] font-rounded font-black text-sm sm:text-base shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                  >
                    <span>Mula Belajar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards Grid: 7 Topics */}
                <div 
                  id="nota-pecahan-cards-grid"
                  className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4"
                >
                  {NOTA_PECAHAN_DATA.map((topic, idx) => {
                    const isCompleted = understoodTopics[topic.id];
                    return (
                      <motion.div
                        key={topic.id}
                        id={`card-nota-${topic.id}`}
                        whileHover={{ y: -3, scale: 1.01 }}
                        transition={{ duration: 0.15 }}
                        className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F6C7A8] hover:border-[#F4C95D] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                        onClick={() => handleSelectTopic(topic)}
                      >
                        {/* Card Header */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black font-rounded">
                              NOTA {topic.topicNumber} / 7 • {topic.dskpCode}
                            </span>
                            {isCompleted && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Dah Faham ⭐</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-start gap-3.5 my-2">
                            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                              {topic.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-rounded font-black text-base text-[#4A3728] group-hover:text-[#D98262] transition-colors leading-snug">
                                {topic.title}
                              </h4>
                              <p className="text-xs text-[#6B5A4E] font-medium line-clamp-2 mt-1 leading-relaxed">
                                {topic.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Mini Tahukah Kamu Preview */}
                          <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-[#4A3728] flex items-center gap-2 font-medium">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">
                              <strong>Tahukah Kamu:</strong> {topic.tahukahKamu}
                            </span>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="mt-4 pt-3 border-t border-[#F6C7A8]/50 flex items-center justify-between">
                          <span className="text-[11px] text-[#8A624A] font-bold flex items-center gap-1.5">
                            <span className="text-base">{topic.realLifeExample.icon}</span>
                            <span>{topic.realLifeExample.name}</span>
                          </span>
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-xl bg-amber-100 group-hover:bg-[#F4C95D] text-[#4A3728] font-rounded font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors border border-amber-300 cursor-pointer shadow-2xs"
                          >
                            <span>Buka Nota</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ========================================================== */
              /* VIEW 2: HALAMAN TOPIK TERPERINCI (TOPIC DETAIL VIEW)       */
              /* ========================================================== */
              <div className="space-y-4">
                {/* Detail Header / Breadcrumbs & Progress Dots */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#F6C7A8]">
                  <button
                    id="btn-kembali-ke-senarai-nota"
                    type="button"
                    onClick={handleBackToList}
                    className="self-start inline-flex items-center gap-1.5 text-xs sm:text-sm font-rounded font-bold text-[#D98262] hover:text-[#b46547] bg-white px-3 py-1.5 rounded-xl border border-[#F6C7A8] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>

                  {/* Progress Indicator: NOTA X / 7 & Dots */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-rounded font-black text-[#6B5A4E] bg-amber-100/70 px-2.5 py-1 rounded-xl border border-amber-300">
                      NOTA {selectedTopic.topicNumber} / {NOTA_PECAHAN_DATA.length}
                    </span>
                    {/* Clickable Topic Dots */}
                    <div className="flex items-center gap-1.5">
                      {NOTA_PECAHAN_DATA.map((t, index) => {
                        const isCurrent = t.id === selectedTopic.id;
                        const isRead = understoodTopics[t.id];
                        return (
                          <button
                            key={t.id}
                            id={`dot-topik-${index + 1}`}
                            type="button"
                            onClick={() => {
                              playSfx('click', soundEnabled);
                              setSelectedTopic(t);
                              setActiveSection('visual');
                            }}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                              isCurrent
                                ? 'w-6 bg-[#D98262] ring-2 ring-[#D98262]/40'
                                : isRead
                                ? 'w-2.5 bg-emerald-500'
                                : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                            }`}
                            title={`Topik ${index + 1}: ${t.shortTitle}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* TOPIC BANNER */}
                <div className="bg-gradient-to-r from-amber-100/90 via-[#FFF8E8] to-orange-100/70 p-4 sm:p-5 rounded-3xl border-2 border-[#F4C95D] shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-[#F4C95D] flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                      {selectedTopic.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400 text-[10px] sm:text-xs font-black font-rounded">
                          Topik {selectedTopic.topicNumber} daripada 7
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-[#8A624A] border border-[#F6C7A8] text-[10px] sm:text-xs font-bold font-mono">
                          {selectedTopic.dskpCode}
                        </span>
                        {understoodTopics[selectedTopic.id] && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Dikuasai</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif-title font-extrabold text-xl sm:text-2xl text-[#4A3728] leading-tight">
                        {selectedTopic.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-rounded font-semibold text-[#8A624A] mt-1">
                        {selectedTopic.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 1: 👀 CONTOH & VISUAL INTERAKTIF UTAMA */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👀</span>
                      <h4 className="font-rounded font-black text-sm sm:text-base text-[#4A3728]">
                        Visual & Eksplorasi Interaktif
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-[#D98262] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Interaktif</span>
                    </span>
                  </div>

                  {/* EMBED DEDICATED INTERACTIVE VISUAL COMPONENT */}
                  <InteractiveNotaVisual 
                    topicId={selectedTopic.id} 
                    soundEnabled={soundEnabled} 
                  />
                </div>

                {/* SECTION 2: 📚 PENERANGAN RINGKAS & KONSEP UTAMA */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#F6C7A8] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F6C7A8]/60">
                    <span className="text-lg">📚</span>
                    <h4 className="font-rounded font-black text-sm sm:text-base text-[#4A3728]">
                      Penerangan Konsep (Ayat Pendek & Mudah)
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#4A3728] font-medium leading-relaxed">
                    {selectedTopic.explanation.map((exp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-amber-300">
                          {i + 1}
                        </span>
                        <span className="font-rounded font-semibold">{exp}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-[#4A3728] flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span><strong>Konsep Teras:</strong> {selectedTopic.keyConcept}</span>
                  </div>
                </div>

                {/* SECTION 3: 💡 TAHUKAH KAMU? (KOTAK KHAS TAHUN 3) */}
                <div 
                  id={`box-tahukah-kamu-${selectedTopic.id}`}
                  className="bg-gradient-to-r from-amber-50 via-[#FFFDF5] to-orange-50 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-xs flex items-start gap-3.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shrink-0 shadow-inner font-black">
                    💡
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-xs font-rounded font-black text-amber-900 tracking-wider uppercase">
                      TAHUKAH KAMU?
                    </span>
                    <p className="text-xs sm:text-sm text-[#4A3728] font-rounded font-bold leading-relaxed">
                      {selectedTopic.tahukahKamu}
                    </p>
                  </div>
                </div>

                {/* SECTION 4: 🌟 CONTOH KEHIDUPAN HARIAN */}
                <div className="bg-gradient-to-r from-orange-50/70 via-white to-amber-50/70 rounded-3xl p-4 sm:p-5 border-2 border-[#F6C7A8] shadow-xs flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {selectedTopic.realLifeExample.icon}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#D98262] uppercase tracking-wider block">
                      Contoh Kehidupan Harian
                    </span>
                    <h5 className="font-rounded font-black text-sm sm:text-base text-[#4A3728]">
                      {selectedTopic.realLifeExample.name}
                    </h5>
                    <p className="text-xs sm:text-sm text-[#6B5A4E] font-medium leading-relaxed mt-1">
                      {selectedTopic.realLifeExample.story}
                    </p>
                  </div>
                </div>

                {/* SECTION 5: ⭐ INGAT! KOTAK PENTING */}
                <div 
                  id={`box-ingat-${selectedTopic.id}`}
                  className="bg-gradient-to-r from-amber-200/90 via-[#F4C95D]/80 to-amber-300/90 rounded-3xl p-4 sm:p-5 border-3 border-amber-400 shadow-md text-[#4A3728]"
                >
                  <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-400/60">
                    <span className="text-xl">⭐</span>
                    <h4 className="font-rounded font-black text-sm sm:text-base text-[#4A3728] tracking-wide">
                      {selectedTopic.rememberBox.title}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm font-rounded font-bold text-[#4A3728] leading-normal">
                    {selectedTopic.rememberBox.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-900 shrink-0 font-black">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SECTION 6: ✋ CUBA SENDIRI & BUTTON SAYA DAH FAHAM */}
                <div className="p-4 rounded-3xl bg-white border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✋</span>
                    <div className="text-xs text-[#4A3728] font-medium">
                      <strong className="text-emerald-900 font-rounded font-black block text-sm">
                        Uji Minda Kamu:
                      </strong>
                      <span className="font-semibold">{selectedTopic.tryPrompt}</span>
                    </div>
                  </div>

                  <button
                    id="btn-mark-understood"
                    type="button"
                    onClick={() => handleMarkUnderstood(selectedTopic.id)}
                    className={`px-5 py-2.5 rounded-2xl font-rounded font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm ${
                      understoodTopics[selectedTopic.id]
                        ? 'bg-emerald-500 text-white border-2 border-emerald-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-105 border-2 border-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {understoodTopics[selectedTopic.id] ? 'Dah Faham! ⭐' : 'Saya Faham!'}
                    </span>
                  </button>
                </div>

                {/* BOTTOM NAVIGATION BAR */}
                <div className="pt-3 border-t-2 border-[#F6C7A8] flex items-center justify-between gap-2">
                  <button
                    id="btn-nav-prev-topic"
                    type="button"
                    onClick={handlePrevTopic}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-[#4A3728] font-rounded font-bold text-xs sm:text-sm border-2 border-[#F6C7A8] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{currentTopicIndex === 0 ? 'Kembali' : 'Sebelumnya'}</span>
                  </button>

                  <div className="text-xs font-rounded font-extrabold text-[#8A624A] hidden sm:inline-block">
                    NOTA {currentTopicIndex + 1} / {NOTA_PECAHAN_DATA.length}
                  </div>

                  {currentTopicIndex < NOTA_PECAHAN_DATA.length - 1 ? (
                    <button
                      id="btn-nav-next-topic"
                      type="button"
                      onClick={handleNextTopic}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F4C95D] to-[#D98262] hover:brightness-105 text-[#4A3728] font-rounded font-black text-xs sm:text-sm border-2 border-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Seterusnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="btn-selesai-semua-topik"
                      type="button"
                      onClick={() => {
                        playSfx('fanfare', soundEnabled);
                        onClose();
                        if (onGoToGame) onGoToGame();
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-rounded font-black text-xs sm:text-sm border-2 border-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Mula Main</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* CELEBRATION TOAST */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1100] px-6 py-3 rounded-2xl bg-[#4A3728] text-white font-rounded font-black text-sm shadow-2xl border-2 border-[#F4C95D] flex items-center gap-2"
            >
              <span className="text-xl">🌟</span>
              <span>Hebat! Anda telah faham konsep topik ini!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
