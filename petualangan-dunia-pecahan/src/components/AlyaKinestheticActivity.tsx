import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  Volume2, 
  Shuffle, 
  ArrowLeftRight,
  Hand,
  Check,
  AlertCircle
} from 'lucide-react';
import { AlyaCharacter } from './AlyaCharacter';
import { MathFraction } from './MathFraction';
import { playSfx } from '../utils/audio';
import { speakAlyaExplanation, stopAlyaSpeech, isSpeechSynthesisSupported } from '../utils/speech';

export type KinestheticActivityType = 'show-fraction' | 'equivalent' | 'compare' | 'order';

interface AlyaKinestheticActivityProps {
  soundEnabled: boolean;
  auditoryModeEnabled?: boolean;
  onActivityComplete?: (activity: KinestheticActivityType, score?: number) => void;
  onClose?: () => void;
}

// ==========================================
// DATA BANK FOR KINESTHETIC ACTIVITIES
// ==========================================

interface ShowFractionItem {
  id: string;
  targetNum: number;
  targetDen: number;
  prompt: string;
}

const SHOW_FRACTION_BANK: ShowFractionItem[] = [
  { id: 'sf-1', targetNum: 3, targetDen: 4, prompt: 'Boleh kamu tunjukkan 3/4?' },
  { id: 'sf-2', targetNum: 1, targetDen: 2, prompt: 'Boleh kamu tunjukkan 1/2?' },
  { id: 'sf-3', targetNum: 2, targetDen: 3, prompt: 'Boleh kamu tunjukkan 2/3?' },
  { id: 'sf-4', targetNum: 3, targetDen: 5, prompt: 'Boleh kamu tunjukkan 3/5?' },
  { id: 'sf-5', targetNum: 5, targetDen: 6, prompt: 'Boleh kamu tunjukkan 5/6?' },
  { id: 'sf-6', targetNum: 4, targetDen: 8, prompt: 'Boleh kamu tunjukkan 4/8?' },
];

interface EquivalentItem {
  id: string;
  target: { num: number; den: number };
  options: { num: number; den: number; isCorrect: boolean }[];
  explanation: string;
}

const EQUIVALENT_BANK: EquivalentItem[] = [
  {
    id: 'eq-1',
    target: { num: 1, den: 2 },
    options: [
      { num: 2, den: 4, isCorrect: true },
      { num: 1, den: 3, isCorrect: false },
      { num: 3, den: 4, isCorrect: false },
    ],
    explanation: '1/2 dan 2/4 mempunyai nilai yang sama.',
  },
  {
    id: 'eq-2',
    target: { num: 2, den: 4 },
    options: [
      { num: 1, den: 2, isCorrect: true },
      { num: 3, den: 4, isCorrect: false },
      { num: 2, den: 6, isCorrect: false },
    ],
    explanation: '2/4 dan 1/2 mempunyai nilai yang sama.',
  },
  {
    id: 'eq-3',
    target: { num: 1, den: 3 },
    options: [
      { num: 2, den: 6, isCorrect: true },
      { num: 2, den: 4, isCorrect: false },
      { num: 1, den: 4, isCorrect: false },
    ],
    explanation: '1/3 dan 2/6 mempunyai nilai yang sama.',
  },
  {
    id: 'eq-4',
    target: { num: 2, den: 3 },
    options: [
      { num: 4, den: 6, isCorrect: true },
      { num: 3, den: 5, isCorrect: false },
      { num: 1, den: 2, isCorrect: false },
    ],
    explanation: '2/3 dan 4/6 mempunyai nilai yang sama.',
  },
];

interface CompareItem {
  id: string;
  fracA: { num: number; den: number };
  fracB: { num: number; den: number };
  prompt: 'Pilih pecahan yang lebih besar.' | 'Pilih pecahan yang lebih kecil.';
  correctTarget: 'A' | 'B';
  explanation: string;
}

const COMPARE_BANK: CompareItem[] = [
  {
    id: 'cp-1',
    fracA: { num: 1, den: 2 },
    fracB: { num: 1, den: 4 },
    prompt: 'Pilih pecahan yang lebih besar.',
    correctTarget: 'A',
    explanation: '1/2 lebih besar daripada 1/4.',
  },
  {
    id: 'cp-2',
    fracA: { num: 3, den: 4 },
    fracB: { num: 2, den: 4 },
    prompt: 'Pilih pecahan yang lebih besar.',
    correctTarget: 'A',
    explanation: '3/4 lebih besar daripada 2/4 kerana penyebutnya sama dan pengangkanya 3 lebih besar daripada 2.',
  },
  {
    id: 'cp-3',
    fracA: { num: 1, den: 3 },
    fracB: { num: 2, den: 3 },
    prompt: 'Pilih pecahan yang lebih kecil.',
    correctTarget: 'A',
    explanation: '1/3 lebih kecil daripada 2/3.',
  },
  {
    id: 'cp-4',
    fracA: { num: 2, den: 5 },
    fracB: { num: 4, den: 5 },
    prompt: 'Pilih pecahan yang lebih besar.',
    correctTarget: 'B',
    explanation: '4/5 lebih besar daripada 2/5.',
  },
];

interface OrderItem {
  id: string;
  items: { num: number; den: number; value: number }[];
  instruction: string;
}

const ORDER_BANK: OrderItem[] = [
  {
    id: 'ord-1',
    instruction: 'Susun pecahan daripada kecil kepada besar.',
    items: [
      { num: 1, den: 4, value: 0.25 },
      { num: 1, den: 2, value: 0.5 },
      { num: 3, den: 4, value: 0.75 },
    ],
  },
  {
    id: 'ord-2',
    instruction: 'Susun pecahan daripada kecil kepada besar.',
    items: [
      { num: 1, den: 6, value: 1 / 6 },
      { num: 3, den: 6, value: 3 / 6 },
      { num: 5, den: 6, value: 5 / 6 },
    ],
  },
  {
    id: 'ord-3',
    instruction: 'Susun pecahan daripada kecil kepada besar.',
    items: [
      { num: 1, den: 5, value: 0.2 },
      { num: 2, den: 5, value: 0.4 },
      { num: 4, den: 5, value: 0.8 },
    ],
  },
];

export const AlyaKinestheticActivity: React.FC<AlyaKinestheticActivityProps> = ({
  soundEnabled,
  auditoryModeEnabled = false,
  onActivityComplete,
}) => {
  const [activeActivity, setActiveActivity] = useState<KinestheticActivityType>('show-fraction');

  // Question Indices for Banks
  const [sfIndex, setSfIndex] = useState(0);
  const [eqIndex, setEqIndex] = useState(0);
  const [cpIndex, setCpIndex] = useState(0);
  const [ordIndex, setOrdIndex] = useState(0);

  // Common Feedback State
  const [attempts, setAttempts] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [alyaMood, setAlyaMood] = useState<'happy' | 'thinking' | 'encouraging' | 'celebrating'>('happy');

  // Activity 1: Show Fraction State
  const currentSf = SHOW_FRACTION_BANK[sfIndex % SHOW_FRACTION_BANK.length];
  const [selectedParts, setSelectedParts] = useState<boolean[]>(
    new Array(currentSf.targetDen).fill(false)
  );

  // Activity 2: Equivalent Fraction State
  const currentEq = EQUIVALENT_BANK[eqIndex % EQUIVALENT_BANK.length];
  const [selectedEqOption, setSelectedEqOption] = useState<{ num: number; den: number; isCorrect: boolean } | null>(null);

  // Activity 3: Compare Fraction State
  const currentCp = COMPARE_BANK[cpIndex % COMPARE_BANK.length];
  const [selectedCpChoice, setSelectedCpChoice] = useState<'A' | 'B' | null>(null);

  // Activity 4: Order Fraction State
  const currentOrd = ORDER_BANK[ordIndex % ORDER_BANK.length];
  const [orderedItems, setOrderedItems] = useState<{ num: number; den: number; value: number }[]>(() => {
    // start shuffled
    return [...currentOrd.items].sort(() => Math.random() - 0.5);
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Helper to read feedback aloud if audio is supported & auditory mode is enabled
  const speakFeedback = (text: string) => {
    if (auditoryModeEnabled && isSpeechSynthesisSupported()) {
      stopAlyaSpeech();
      speakAlyaExplanation({ text });
    }
  };

  // Reset feedback state when switching activities or questions
  const resetFeedback = () => {
    stopAlyaSpeech();
    setAttempts(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setAlyaMood('happy');
  };

  // Switch Activity Tab
  const handleSwitchTab = (tab: KinestheticActivityType) => {
    playSfx('pop', soundEnabled);
    setActiveActivity(tab);
    resetFeedback();

    if (tab === 'show-fraction') {
      setSelectedParts(new Array(currentSf.targetDen).fill(false));
    } else if (tab === 'equivalent') {
      setSelectedEqOption(null);
    } else if (tab === 'compare') {
      setSelectedCpChoice(null);
    } else if (tab === 'order') {
      setOrderedItems([...currentOrd.items].sort(() => Math.random() - 0.5));
    }
  };

  // ==========================================
  // ACTIVITY 1: TUNJUK PECAHAN HANDLERS
  // ==========================================
  const handleTogglePart = (index: number) => {
    if (isAnswered && isCorrect) return; // locked if already won
    playSfx('pop', soundEnabled);
    const updated = [...selectedParts];
    updated[index] = !updated[index];
    setSelectedParts(updated);

    if (isAnswered && !isCorrect) {
      setIsAnswered(false);
      setFeedbackMessage('');
      setAlyaMood('thinking');
    }
  };

  const handleCheckShowFraction = () => {
    const selectedCount = selectedParts.filter(Boolean).length;
    const isWin = selectedCount === currentSf.targetNum;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsAnswered(true);
    setIsCorrect(isWin);

    if (isWin) {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const msg = `Hebat! 🌟 Kamu telah menunjukkan ${currentSf.targetNum}/${currentSf.targetDen}.`;
      setFeedbackMessage(msg);
      speakFeedback(msg);
      onActivityComplete?.('show-fraction', 10);
    } else {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      let hintText = '';
      if (newAttempts === 1) {
        hintText = 'Cuba lagi. Ingat, penyebut menunjukkan jumlah bahagian keseluruhan.';
      } else if (newAttempts === 2) {
        hintText = `Lihat bahagian yang berwarna. Kamu telah memilih ${selectedCount} bahagian, tetapi Alya minta ${currentSf.targetNum} bahagian.`;
      } else {
        hintText = `Penyebutnya ialah ${currentSf.targetDen}. Kamu cuma perlu tekan ${currentSf.targetNum} kotak sahaja untuk menunjukkan ${currentSf.targetNum}/${currentSf.targetDen}.`;
      }
      setFeedbackMessage(hintText);
      speakFeedback(hintText);
    }
  };

  const handleNextShowFraction = () => {
    playSfx('pop', soundEnabled);
    const nextIdx = (sfIndex + 1) % SHOW_FRACTION_BANK.length;
    setSfIndex(nextIdx);
    const nextItem = SHOW_FRACTION_BANK[nextIdx];
    setSelectedParts(new Array(nextItem.targetDen).fill(false));
    resetFeedback();
  };

  // ==========================================
  // ACTIVITY 2: PECAHAN SETARA HANDLERS
  // ==========================================
  const handleSelectEqOption = (opt: { num: number; den: number; isCorrect: boolean }) => {
    if (isAnswered && isCorrect) return;
    playSfx('pop', soundEnabled);
    setSelectedEqOption(opt);
    setIsAnswered(false);
    setFeedbackMessage('');
    setAlyaMood('thinking');
  };

  const handleCheckEquivalent = () => {
    if (!selectedEqOption) return;
    const isWin = selectedEqOption.isCorrect;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsAnswered(true);
    setIsCorrect(isWin);

    if (isWin) {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const msg = `Betul! 🌟 ${currentEq.target.num}/${currentEq.target.den} dan ${selectedEqOption.num}/${selectedEqOption.den} mempunyai nilai yang sama.`;
      setFeedbackMessage(msg);
      speakFeedback(msg);
      onActivityComplete?.('equivalent', 10);
    } else {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      let hintText = '';
      if (newAttempts === 1) {
        hintText = 'Cuba fikirkan dahulu.';
      } else if (newAttempts === 2) {
        hintText = 'Lihat bahagian yang berwarna. Adakah bahagiannya meliputi luas yang sama?';
      } else {
        hintText = `Pecahan yang mempunyai bahagian yang sama besar menunjukkan nilai yang setara. Cuba semak pecahan yang bernilai sama seperti ${currentEq.target.num}/${currentEq.target.den}.`;
      }
      setFeedbackMessage(hintText);
      speakFeedback(hintText);
    }
  };

  const handleNextEquivalent = () => {
    playSfx('pop', soundEnabled);
    const nextIdx = (eqIndex + 1) % EQUIVALENT_BANK.length;
    setEqIndex(nextIdx);
    setSelectedEqOption(null);
    resetFeedback();
  };

  // ==========================================
  // ACTIVITY 3: BANDINGKAN PECAHAN HANDLERS
  // ==========================================
  const handleSelectCpChoice = (choice: 'A' | 'B') => {
    if (isAnswered && isCorrect) return;
    playSfx('pop', soundEnabled);
    setSelectedCpChoice(choice);
    setIsAnswered(false);
    setFeedbackMessage('');
    setAlyaMood('thinking');
  };

  const handleCheckCompare = () => {
    if (!selectedCpChoice) return;
    const isWin = selectedCpChoice === currentCp.correctTarget;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsAnswered(true);
    setIsCorrect(isWin);

    if (isWin) {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const msg = `Betul! 🌟 ${currentCp.explanation}`;
      setFeedbackMessage(msg);
      speakFeedback(msg);
      onActivityComplete?.('compare', 10);
    } else {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      let hintText = '';
      if (newAttempts === 1) {
        hintText = 'Cuba lihat visual bahagian yang berwarna.';
      } else if (newAttempts === 2) {
        hintText = 'Perhatikan bar mana yang mempunyai warna lebih panjang atau potongan yang lebih besar.';
      } else {
        hintText = 'Pecahan yang mempunyai bahagian lebih besar menunjukkan nilai yang lebih besar.';
      }
      setFeedbackMessage(hintText);
      speakFeedback(hintText);
    }
  };

  const handleNextCompare = () => {
    playSfx('pop', soundEnabled);
    const nextIdx = (cpIndex + 1) % COMPARE_BANK.length;
    setCpIndex(nextIdx);
    setSelectedCpChoice(null);
    resetFeedback();
  };

  // ==========================================
  // ACTIVITY 4: SUSUN PECAHAN HANDLERS
  // ==========================================
  const handleSwapItems = (idx1: number, idx2: number) => {
    if (idx1 < 0 || idx1 >= orderedItems.length || idx2 < 0 || idx2 >= orderedItems.length) return;
    playSfx('pop', soundEnabled);
    const newArr = [...orderedItems];
    const temp = newArr[idx1];
    newArr[idx1] = newArr[idx2];
    newArr[idx2] = temp;
    setOrderedItems(newArr);
    setIsAnswered(false);
    setFeedbackMessage('');
    setAlyaMood('thinking');
  };

  const handleCheckOrder = () => {
    // Check if sorted ascending by value
    let isWin = true;
    for (let i = 0; i < orderedItems.length - 1; i++) {
      if (orderedItems[i].value > orderedItems[i + 1].value) {
        isWin = false;
        break;
      }
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setIsAnswered(true);
    setIsCorrect(isWin);

    if (isWin) {
      playSfx('correct', soundEnabled);
      setAlyaMood('celebrating');
      const msg = 'Hebat! Kamu telah menyusun pecahan dengan betul. 🌟';
      setFeedbackMessage(msg);
      speakFeedback(msg);
      onActivityComplete?.('order', 10);
    } else {
      playSfx('wrong', soundEnabled);
      setAlyaMood('encouraging');
      let hintText = '';
      if (newAttempts === 1) {
        hintText = 'Cuba fikirkan dahulu.';
      } else if (newAttempts === 2) {
        hintText = 'Lihat bahagian yang berwarna pada setiap bar. Susun daripada yang paling sedikit ke paling banyak.';
      } else {
        hintText = 'Pecahan yang mempunyai bahagian lebih besar menunjukkan nilai yang lebih besar. Letakkan bahagian paling kecil di sebelah kiri.';
      }
      setFeedbackMessage(hintText);
      speakFeedback(hintText);
    }
  };

  const handleReshuffleOrder = () => {
    playSfx('pop', soundEnabled);
    setOrderedItems([...currentOrd.items].sort(() => Math.random() - 0.5));
    resetFeedback();
  };

  const handleNextOrder = () => {
    playSfx('pop', soundEnabled);
    const nextIdx = (ordIndex + 1) % ORDER_BANK.length;
    setOrdIndex(nextIdx);
    const nextItem = ORDER_BANK[nextIdx];
    setOrderedItems([...nextItem.items].sort(() => Math.random() - 0.5));
    resetFeedback();
  };

  // Drag & drop handlers for Order activity
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIdx: number) => {
    if (draggedIndex === null || draggedIndex === dropIdx) return;
    handleSwapItems(draggedIndex, dropIdx);
    setDraggedIndex(null);
  };

  return (
    <div id="alya-kinesthetic-container" className="space-y-3 font-rounded text-[#4A3728]">
      {/* Activity Navigation Selector Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-amber-100/70 rounded-2xl border border-amber-300 shadow-xs text-center">
        <button
          id="btn-act-tunjuk"
          type="button"
          onClick={() => handleSwitchTab('show-fraction')}
          className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
            activeActivity === 'show-fraction'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-[#4A3728] hover:bg-rose-100/80'
          }`}
          title="Aktiviti 1: Tunjuk Pecahan"
        >
          <span>🎨 Tunjuk</span>
          <span className="text-[9px] opacity-90">Pecahan</span>
        </button>

        <button
          id="btn-act-setara"
          type="button"
          onClick={() => handleSwitchTab('equivalent')}
          className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
            activeActivity === 'equivalent'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-[#4A3728] hover:bg-purple-100/80'
          }`}
          title="Aktiviti 2: Pecahan Setara"
        >
          <span>🔗 Setara</span>
          <span className="text-[9px] opacity-90">Padankan</span>
        </button>

        <button
          id="btn-act-banding"
          type="button"
          onClick={() => handleSwitchTab('compare')}
          className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
            activeActivity === 'compare'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-[#4A3728] hover:bg-amber-100/80'
          }`}
          title="Aktiviti 3: Bandingkan Pecahan"
        >
          <span>⚖️ Banding</span>
          <span className="text-[9px] opacity-90">Besar/Kecil</span>
        </button>

        <button
          id="btn-act-susun"
          type="button"
          onClick={() => handleSwitchTab('order')}
          className={`py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
            activeActivity === 'order'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-[#4A3728] hover:bg-emerald-100/80'
          }`}
          title="Aktiviti 4: Susun Pecahan"
        >
          <span>🔢 Susun</span>
          <span className="text-[9px] opacity-90">Kecil-Besar</span>
        </button>
      </div>

      {/* Interactive Activity Body */}
      <div className="bg-white rounded-2xl p-3.5 border-2 border-pink-200 shadow-sm relative">
        {/* ========================================== */}
        {/* AKTIVITI 1: TUNJUK PECAHAN                 */}
        {/* ========================================== */}
        {activeActivity === 'show-fraction' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-pink-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-pink-100 text-pink-700">
                  <Hand className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-pink-900">
                  Aktiviti 1: Tunjuk Pecahan
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextShowFraction}
                className="text-[10px] font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200 flex items-center gap-1 cursor-pointer"
                title="Tukar Soalan Lain"
              >
                <Shuffle className="w-3 h-3" />
                <span>Pecahan Lain</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="bg-rose-50/80 p-2.5 rounded-xl border border-rose-200 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#4A3728]">
                Alya: “{currentSf.prompt}”
              </p>
              <p className="text-[11px] text-[#4A3728]/70 mt-0.5">
                👆 Tekan / tap kotak untuk mewarnakan bahagian yang betul.
              </p>
            </div>

            {/* Interactive Fraction Bar */}
            <div className="my-3">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
                <span className="text-[#4A3728]/75">
                  Dipilih:{' '}
                  <span className="text-rose-600 font-extrabold text-sm">
                    {selectedParts.filter(Boolean).length}
                  </span>{' '}
                  / {currentSf.targetDen} bahagian
                </span>
                <span className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  Sasaran: <MathFraction num={currentSf.targetNum} den={currentSf.targetDen} size="xs" />
                </span>
              </div>

              {/* Grid of Parts (Bar Partition) */}
              <div
                id="interactive-partition-bar"
                className="w-full h-16 sm:h-20 bg-amber-50 rounded-xl border-2 border-amber-400 p-1 flex gap-1 shadow-inner overflow-hidden select-none"
              >
                {selectedParts.map((isSelected, idx) => (
                  <button
                    key={idx}
                    id={`part-box-${idx}`}
                    type="button"
                    onClick={() => handleTogglePart(idx)}
                    className={`flex-1 h-full rounded-lg transition-all flex flex-col items-center justify-center cursor-pointer relative font-bold text-xs ${
                      isSelected
                        ? 'bg-gradient-to-t from-rose-500 to-pink-400 text-white shadow-md border-2 border-rose-600 scale-[0.98]'
                        : 'bg-white hover:bg-rose-50/70 text-gray-400 border border-amber-200'
                    }`}
                    title={`Bahagian ${idx + 1}`}
                  >
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span className="text-[9px] font-bold">1/{currentSf.targetDen}</span>
                      </motion.div>
                    ) : (
                      <span className="text-[9px] text-gray-400 font-medium">
                        1/{currentSf.targetDen}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {!isCorrect ? (
                <button
                  id="btn-check-show-fraction"
                  type="button"
                  onClick={handleCheckShowFraction}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Jawapan</span>
                </button>
              ) : (
                <button
                  id="btn-next-show-fraction"
                  type="button"
                  onClick={handleNextShowFraction}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Soalan Seterusnya</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setSelectedParts(new Array(currentSf.targetDen).fill(false));
                  setIsAnswered(false);
                  setFeedbackMessage('');
                  setAlyaMood('happy');
                }}
                className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Kosongkan Pilihan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* AKTIVITI 2: PECAHAN SETARA                 */}
        {/* ========================================== */}
        {activeActivity === 'equivalent' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-purple-100 text-purple-700">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-purple-900">
                  Aktiviti 2: Pecahan Setara
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextEquivalent}
                className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 cursor-pointer"
                title="Tukar Soalan Lain"
              >
                <Shuffle className="w-3 h-3" />
                <span>Soalan Lain</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-200 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#4A3728]">
                Alya: “Padankan pecahan yang sama nilai.”
              </p>
              <p className="text-[11px] text-[#4A3728]/70 mt-0.5">
                Pilih pecahan yang setara dengan pecahan sasaran di bawah.
              </p>
            </div>

            {/* Target Fraction Box */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl border-2 border-purple-300 text-center">
              <div className="text-[11px] font-bold text-purple-900 mb-1">
                Pecahan Sasaran:
              </div>
              <div className="inline-block bg-white px-4 py-1 rounded-xl shadow-xs border border-purple-200">
                <MathFraction num={currentEq.target.num} den={currentEq.target.den} size="md" />
              </div>

              {/* Target Fraction Visual Bar */}
              <div className="w-full max-w-[240px] mx-auto h-5 bg-gray-100 rounded-md border border-purple-300 mt-2 flex overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${(currentEq.target.num / currentEq.target.den) * 100}%` }}
                />
              </div>
            </div>

            {/* Choices Options (Tap or Drag) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#4A3728]/75 block">
                Pilih atau seret jawapan:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {currentEq.options.map((opt, i) => {
                  const isSelected =
                    selectedEqOption?.num === opt.num && selectedEqOption?.den === opt.den;
                  return (
                    <button
                      key={i}
                      id={`btn-eq-opt-${i}`}
                      type="button"
                      onClick={() => handleSelectEqOption(opt)}
                      className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                          : 'bg-white hover:bg-purple-50 text-[#4A3728] border-purple-200'
                      }`}
                    >
                      <MathFraction num={opt.num} den={opt.den} size="sm" />
                      {/* Mini visual bar preview */}
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full ${isSelected ? 'bg-amber-300' : 'bg-purple-400'}`}
                          style={{ width: `${(opt.num / opt.den) * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {!isCorrect ? (
                <button
                  id="btn-check-equivalent"
                  type="button"
                  disabled={!selectedEqOption}
                  onClick={handleCheckEquivalent}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedEqOption
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Padanan</span>
                </button>
              ) : (
                <button
                  id="btn-next-equivalent"
                  type="button"
                  onClick={handleNextEquivalent}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Soalan Seterusnya</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* AKTIVITI 3: BANDINGKAN PECAHAN             */}
        {/* ========================================== */}
        {activeActivity === 'compare' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-amber-900">
                  Aktiviti 3: Bandingkan Pecahan
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextCompare}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 cursor-pointer"
                title="Tukar Soalan Lain"
              >
                <Shuffle className="w-3 h-3" />
                <span>Soalan Lain</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#4A3728]">
                Alya: “{currentCp.prompt}”
              </p>
              <p className="text-[11px] text-[#4A3728]/70 mt-0.5">
                👆 Tekan salah satu kad pecahan di bawah yang mempunyai nilai yang betul.
              </p>
            </div>

            {/* 2 Interactive Cards Side-by-Side */}
            <div className="grid grid-cols-2 gap-3 my-2">
              {/* Card A */}
              <button
                id="btn-compare-card-a"
                type="button"
                onClick={() => handleSelectCpChoice('A')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  selectedCpChoice === 'A'
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-white hover:bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="text-base font-extrabold text-[#4A3728] mb-2">
                  <MathFraction num={currentCp.fracA.num} den={currentCp.fracA.den} size="md" />
                </div>
                {/* Visual Bar A */}
                <div className="w-full h-8 bg-gray-100 rounded-lg border border-amber-300 p-0.5 flex overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-sm transition-all"
                    style={{
                      width: `${(currentCp.fracA.num / currentCp.fracA.den) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-semibold">
                  {currentCp.fracA.num} daripada {currentCp.fracA.den} bahagian
                </span>
              </button>

              {/* Card B */}
              <button
                id="btn-compare-card-b"
                type="button"
                onClick={() => handleSelectCpChoice('B')}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                  selectedCpChoice === 'B'
                    ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-white hover:bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="text-base font-extrabold text-[#4A3728] mb-2">
                  <MathFraction num={currentCp.fracB.num} den={currentCp.fracB.den} size="md" />
                </div>
                {/* Visual Bar B */}
                <div className="w-full h-8 bg-gray-100 rounded-lg border border-amber-300 p-0.5 flex overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-400 rounded-sm transition-all"
                    style={{
                      width: `${(currentCp.fracB.num / currentCp.fracB.den) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-semibold">
                  {currentCp.fracB.num} daripada {currentCp.fracB.den} bahagian
                </span>
              </button>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2 pt-1">
              {!isCorrect ? (
                <button
                  id="btn-check-compare"
                  type="button"
                  disabled={!selectedCpChoice}
                  onClick={handleCheckCompare}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedCpChoice
                      ? 'bg-amber-500 hover:bg-amber-600 text-[#4A3728]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Pilihan</span>
                </button>
              ) : (
                <button
                  id="btn-next-compare"
                  type="button"
                  onClick={handleNextCompare}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Soalan Seterusnya</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* AKTIVITI 4: SUSUN PECAHAN                  */}
        {/* ========================================== */}
        {activeActivity === 'order' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                  <ArrowLeftRight className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  Aktiviti 4: Susun Pecahan
                </span>
              </div>
              <button
                type="button"
                onClick={handleNextOrder}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 cursor-pointer"
                title="Tukar Soalan Lain"
              >
                <Shuffle className="w-3 h-3" />
                <span>Soalan Lain</span>
              </button>
            </div>

            {/* Prompt */}
            <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-center">
              <p className="text-xs sm:text-sm font-bold text-[#4A3728]">
                Alya: “{currentOrd.instruction}”
              </p>
              <p className="text-[11px] text-[#4A3728]/70 mt-0.5">
                Seret atau gunakan butang anak panah untuk tukar kedudukan pecahan.
              </p>
            </div>

            {/* Direction Indicator */}
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 px-2">
              <span>⬅️ Paling Kecil</span>
              <span>Paling Besar ➡️</span>
            </div>

            {/* Reorderable Items List (Both Drag-and-Drop AND Tap-to-Swap for touch/tablets) */}
            <div className="space-y-2">
              {orderedItems.map((item, idx) => (
                <div
                  key={`${item.num}-${item.den}-${idx}`}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className="p-2.5 bg-white border-2 border-emerald-300 rounded-xl shadow-xs flex items-center justify-between gap-2 touch-manipulation hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <MathFraction num={item.num} den={item.den} size="sm" />
                    </div>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="flex-1 max-w-[130px] sm:max-w-[160px] h-4 bg-gray-100 rounded-full overflow-hidden border border-emerald-200 mx-2">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(item.num / item.den) * 100}%` }}
                    />
                  </div>

                  {/* Touch-Friendly Swap Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleSwapItems(idx, idx - 1)}
                      className={`p-1 rounded-lg text-xs font-bold ${
                        idx === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 cursor-pointer'
                      }`}
                      title="Alih ke Kiri"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderedItems.length - 1}
                      onClick={() => handleSwapItems(idx, idx + 1)}
                      className={`p-1 rounded-lg text-xs font-bold ${
                        idx === orderedItems.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 cursor-pointer'
                      }`}
                      title="Alih ke Kanan"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {!isCorrect ? (
                <button
                  id="btn-check-order"
                  type="button"
                  onClick={handleCheckOrder}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Semak Susunan</span>
                </button>
              ) : (
                <button
                  id="btn-next-order"
                  type="button"
                  onClick={handleNextOrder}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Soalan Seterusnya</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReshuffleOrder}
                className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Rawakkan Semula"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Rawak</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ALYA FEEDBACK & ADAPTIVE HINT BOX          */}
        {/* ========================================== */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              className={`mt-3 p-3 rounded-2xl border-2 flex items-start gap-2.5 shadow-sm ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="shrink-0 pt-0.5">
                <AlyaCharacter mood={alyaMood} size="sm" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold flex items-center gap-1">
                    {isCorrect ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                        <span className="text-emerald-800">Alya: Hebat! Kamu berjaya! 🌟</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-rose-800">Alya: Tidak mengapa, cuba lagi! 🩷</span>
                      </>
                    )}
                  </span>
                  {!isCorrect && (
                    <span className="text-[9px] bg-rose-200/70 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      Percubaan {attempts}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed font-medium whitespace-pre-line">
                  {feedbackMessage}
                </p>

                {/* Audio Button for Alya Feedback */}
                {isSpeechSynthesisSupported() && (
                  <button
                    type="button"
                    onClick={() => {
                      stopAlyaSpeech();
                      speakAlyaExplanation({ text: feedbackMessage });
                    }}
                    className="mt-2 py-0.5 px-2 rounded-lg bg-white/90 hover:bg-white text-[10px] font-bold border border-current text-[#4A3728] flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>🔊 Dengar Maklum Balas Alya</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
