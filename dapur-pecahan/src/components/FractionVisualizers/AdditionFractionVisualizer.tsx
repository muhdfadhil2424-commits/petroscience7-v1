import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';
import { FractionBenchmarkBadge } from '../FractionBenchmarkBadge';

interface AdditionFractionVisualizerProps {
  onSuccess: () => void;
  firstVal?: number;
  targetSum?: number;
  denominator?: number;
  options?: number[];
  storyTitle?: string;
  storyPrompt?: string;
}

export const AdditionFractionVisualizer: React.FC<AdditionFractionVisualizerProps> = ({
  onSuccess,
  firstVal = 3,
  targetSum = 8,
  denominator = 10,
  options = [3, 5, 6],
  storyTitle = 'Pengumpulan Peha Ayam (Penambahan Pecahan KBAT)',
  storyPrompt = 'Situasi Dapur: Restoran menerima pesanan tergempar di mana sebuah dulang 10 petak perlu memuatkan 8/10 peha ayam rangup. Chef Alya mendapati di dalam dulang perapan baru ada 3/10 bahagian peha ayam. Pembantu dapur perlu segera memerap baki peha ayam untuk mencukupkan pesanan 8/10 sebelum masa tamat. Berapakah pecahan peha ayam yang perlu ditambah ke dalam dulang? (3/10 + ? = 8/10)',
}) => {
  const [secondVal, setSecondVal] = useState<number>(0);
  const [step, setStep] = useState<'add' | 'completed'>('add');

  const correctSecondVal = targetSum - firstVal;

  // Helper to shuffle options ensuring different position on each visit / session
  const [shuffledOptions, setShuffledOptions] = useState<number[]>(() => {
    const correctVal = targetSum - firstVal;
    const baseOptions = options.includes(correctVal) ? [...options] : [...options, correctVal];
    const storageKey = `alya_ans_pos_${firstVal}_${targetSum}_${denominator}`;

    let lastIndex = -1;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        lastIndex = parseInt(stored, 10);
      }
    } catch {
      // ignore storage access error
    }

    const len = baseOptions.length;
    const candidateIndices = [];
    for (let i = 0; i < len; i++) {
      if (i !== lastIndex) {
        candidateIndices.push(i);
      }
    }

    const targetIndex = candidateIndices.length > 0
      ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)]
      : Math.floor(Math.random() * len);

    const distractors = baseOptions.filter((v) => v !== correctVal);
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    const result: number[] = [];
    let dIdx = 0;
    for (let i = 0; i < len; i++) {
      if (i === targetIndex) {
        result.push(correctVal);
      } else {
        result.push(distractors[dIdx++]);
      }
    }

    try {
      localStorage.setItem(storageKey, targetIndex.toString());
    } catch {
      // ignore
    }

    return result;
  });

  useEffect(() => {
    const correctVal = targetSum - firstVal;
    const baseOptions = options.includes(correctVal) ? [...options] : [...options, correctVal];
    const storageKey = `alya_ans_pos_${firstVal}_${targetSum}_${denominator}`;

    let lastIndex = -1;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        lastIndex = parseInt(stored, 10);
      }
    } catch {
      // ignore
    }

    const len = baseOptions.length;
    const candidateIndices = [];
    for (let i = 0; i < len; i++) {
      if (i !== lastIndex) {
        candidateIndices.push(i);
      }
    }

    const targetIndex = candidateIndices.length > 0
      ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)]
      : Math.floor(Math.random() * len);

    const distractors = baseOptions.filter((v) => v !== correctVal);
    for (let i = distractors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }

    const result: number[] = [];
    let dIdx = 0;
    for (let i = 0; i < len; i++) {
      if (i === targetIndex) {
        result.push(correctVal);
      } else {
        result.push(distractors[dIdx++]);
      }
    }

    try {
      localStorage.setItem(storageKey, targetIndex.toString());
    } catch {
      // ignore
    }

    setShuffledOptions(result);
  }, [firstVal, targetSum, denominator, options]);

  const handleSelectOption = (value: number) => {
    sounds.playPop();
    setSecondVal(value);
    if (firstVal + value === targetSum) {
      sounds.playSuccess();
      setStep('completed');
      onSuccess();
    } else {
      sounds.playTryAgain();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#F7F3ED] rounded-2xl p-5 shadow-lg border-2 border-[#D6CEBE]">
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-[#EFEAE1] text-[#5A5A40] rounded-full text-xs font-bold mb-1 border border-[#D6CEBE]">
          DSKP 3.1.5: Penambahan Dua Pecahan Wajar (Penyebut Sama)
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          {storyTitle}
        </h4>
        <p className="text-xs text-[#5A5A50] mt-1 leading-relaxed">
          {storyPrompt}
        </p>
      </div>

      {/* Live Benchmark Feedback */}
      <FractionBenchmarkBadge
        currentCount={secondVal > 0 ? (firstVal + secondVal) : firstVal}
        requiredCount={targetSum}
        denominator={denominator}
        unitLabel="peha ayam"
      />

      {/* Visual Addition Equation */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-3 bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE] w-full">
        {/* First Fraction */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-[#D6CEBE] shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold text-[#5A5A50]">Sudah Ada</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl text-[#A67C52]">
            <span>{firstVal}</span>
            <div className="w-6 h-[2px] bg-[#A67C52] my-[1px]" />
            <span>{denominator}</span>
          </div>
        </div>

        <span className="text-2xl font-black text-[#5A5A40]">+</span>

        {/* Second Fraction (Target Choice) */}
        <div className={`flex flex-col items-center bg-white p-3 rounded-xl border-2 shadow-sm min-w-[90px] ${
          secondVal > 0
            ? secondVal === correctSecondVal
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-rose-400 bg-rose-50'
            : 'border-dashed border-[#A67C52]'
        }`}>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold text-[#A67C52]">Perlu Tambah</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl text-[#A67C52]">
            <span>{secondVal > 0 ? secondVal : '?'}</span>
            <div className="w-6 h-[2px] bg-[#A67C52] my-[1px]" />
            <span>{denominator}</span>
          </div>
        </div>

        <span className="text-2xl font-black text-[#5A5A40]">=</span>

        {/* Result Fraction */}
        <div className="flex flex-col items-center bg-[#5A5A40] text-white p-3 rounded-xl shadow-md border border-[#4A4A33]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold">Pesanan</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl">
            <span>{targetSum}</span>
            <div className="w-6 h-[2px] bg-white my-[1px]" />
            <span>{denominator}</span>
          </div>
        </div>
      </div>

      {/* Interactive Options */}
      {step === 'add' ? (
        <div className="w-full my-2">
          <div className="text-xs font-bold text-[#5A5A50] text-center mb-2">
            Pilih pecahan peha ayam yang betul untuk melengkapkan pesanan di atas:
          </div>
          <div className="grid grid-cols-3 gap-3">
            {shuffledOptions.map((num, idx) => {
              const isChosen = secondVal === num;
              const isCorrect = num === correctSecondVal;
              return (
                <motion.button
                  key={`${num}-${idx}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectOption(num)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 shadow-sm cursor-pointer transition-all ${
                    isChosen
                      ? isCorrect
                        ? 'bg-emerald-600 border-emerald-700 text-white'
                        : 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'bg-white border-[#D6CEBE] hover:border-[#A67C52] text-[#3A3A30]'
                  }`}
                >
                  <div className="flex flex-col items-center font-black text-lg">
                    <span>{num}</span>
                    <div className={`w-5 h-[2px] my-[1px] ${isChosen && isCorrect ? 'bg-white' : 'bg-[#3A3A30]'}`} />
                    <span>{denominator}</span>
                  </div>
                  {isChosen && !isCorrect && (
                    <span className="text-[10px] font-bold text-rose-700 mt-1">
                      {num > correctSecondVal ? 'Terlebih!' : 'Belum cukup!'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-4 rounded-xl text-center w-full my-2 font-bold text-sm shadow-sm"
        >
          🎉 Syabas! {firstVal}/{denominator} + {correctSecondVal}/{denominator} = {targetSum}/{denominator} peha ayam berjaya diselesaikan!
        </motion.div>
      )}

      {/* Visual Drumstick Tray 10 Slots */}
      <div className="w-full bg-white p-3 rounded-xl border border-[#D6CEBE] mt-2">
        <div className="text-xs font-semibold text-[#7A7A70] mb-2 text-center">
          Dulang Peha Ayam ({denominator} Ruang): {firstVal + secondVal} / {denominator}
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {Array.from({ length: denominator }).map((_, idx) => {
            const isFilled = idx < (firstVal + secondVal);
            return (
              <div
                key={idx}
                className={`h-12 rounded-lg flex items-center justify-center text-lg border ${
                  isFilled ? 'bg-[#A67C52] border-[#5A5A40] text-white shadow-inner' : 'bg-[#F7F3ED] border-[#D6CEBE] text-[#7A7A70]'
                }`}
              >
                {isFilled ? '🍗' : '◯'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
