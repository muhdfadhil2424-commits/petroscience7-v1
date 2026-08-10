import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface AdditionFractionVisualizerProps {
  onSuccess: () => void;
}

export const AdditionFractionVisualizer: React.FC<AdditionFractionVisualizerProps> = ({
  onSuccess,
}) => {
  const [firstVal] = useState<number>(3); // 3/10
  const [secondVal, setSecondVal] = useState<number>(0); // Target 4/10 to make 7/10 or total target
  const [step, setStep] = useState<'add' | 'completed'>('add');

  const targetSum = 7; // 3/10 + 4/10 = 7/10

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
          Kumpul Peha Ayam Menggunakan Penambahan Pecahan
        </h4>
        <p className="text-xs text-[#5A5A50] mt-1">
          Chef Alya sudah mengumpul <span className="font-bold text-[#A67C52]">3/10</span> kumpulan peha ayam.
          Berapakah pecahan tambahan yang perlu ditambah supaya menjadi <span className="font-bold text-[#A67C52]">7/10</span>?
        </p>
      </div>

      {/* Visual Addition Equation */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-4 bg-[#EFEAE1] p-4 rounded-2xl border border-[#D6CEBE] w-full">
        {/* First Fraction */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-[#D6CEBE] shadow-sm">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold text-[#5A5A50]">Bahagian 1</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl text-[#A67C52]">
            <span>{firstVal}</span>
            <div className="w-6 h-[2px] bg-[#A67C52] my-[1px]" />
            <span>10</span>
          </div>
        </div>

        <span className="text-2xl font-black text-[#5A5A40]">+</span>

        {/* Second Fraction (Target Choice) */}
        <div className="flex flex-col items-center bg-white p-3 rounded-xl border-2 border-dashed border-[#A67C52] shadow-sm min-w-[80px]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold text-[#A67C52]">Bahagian 2</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl text-[#A67C52]">
            <span>{secondVal > 0 ? secondVal : '?'}</span>
            <div className="w-6 h-[2px] bg-[#A67C52] my-[1px]" />
            <span>10</span>
          </div>
        </div>

        <span className="text-2xl font-black text-[#5A5A40]">=</span>

        {/* Result Fraction */}
        <div className="flex flex-col items-center bg-[#5A5A40] text-white p-3 rounded-xl shadow-md border border-[#4A4A33]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xl">🍗</span>
            <span className="text-xs font-bold">Sasaran</span>
          </div>
          <div className="flex flex-col items-center font-extrabold text-xl">
            <span>{targetSum}</span>
            <div className="w-6 h-[2px] bg-white my-[1px]" />
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Interactive Options */}
      {step === 'add' ? (
        <div className="w-full my-2">
          <div className="text-xs font-bold text-[#5A5A50] text-center mb-2">
            Pilih pecahan yang betul untuk melengkapkan persamaan di atas:
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[2, 4, 5].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectOption(num)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border-2 border-[#D6CEBE] hover:border-[#A67C52] shadow-sm cursor-pointer"
              >
                <div className="flex flex-col items-center font-black text-lg text-[#3A3A30]">
                  <span>{num}</span>
                  <div className="w-5 h-[2px] bg-[#3A3A30] my-[1px]" />
                  <span>10</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#EFEAE1] border-2 border-[#A67C52] text-[#3A3A30] p-4 rounded-xl text-center w-full my-2 font-bold text-sm shadow-sm"
        >
          🎉 Syabas! 3/10 + 4/10 = 7/10 peha ayam berjaya dikumpul!
        </motion.div>
      )}

      {/* Visual Drumstick Tray 10 Slots */}
      <div className="w-full bg-white p-3 rounded-xl border border-[#D6CEBE] mt-2">
        <div className="text-xs font-semibold text-[#7A7A70] mb-2 text-center">
          Dulang Peha Ayam (10 Ruang): {firstVal + secondVal} / 10
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {Array.from({ length: 10 }).map((_, idx) => {
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
