import React from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface BarFractionVisualizerProps {
  totalItems: number; // e.g. 10
  requiredCount: number; // e.g. 7
  selectedIndices: number[];
  onToggleItem: (index: number) => void;
  icon: string;
  itemName: string;
}

export const BarFractionVisualizer: React.FC<BarFractionVisualizerProps> = ({
  totalItems,
  requiredCount,
  selectedIndices,
  onToggleItem,
  icon,
  itemName,
}) => {
  const currentCount = selectedIndices.length;

  const handleClick = (index: number) => {
    sounds.playPop();
    onToggleItem(index);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#F7F3ED] rounded-2xl p-5 shadow-lg border-2 border-[#D6CEBE]">
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 bg-[#EFEAE1] text-[#5A5A40] rounded-full text-xs font-bold mb-1 border border-[#D6CEBE]">
          DSKP 3.1.1: Model Bar Pecahan
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          Ambil <span className="text-[#A67C52] underline decoration-[#A67C52] decoration-2">{requiredCount}</span> daripada <span className="text-[#5A5A50]">{totalItems}</span> petak {itemName}
        </h4>
        <p className="text-xs text-[#7A7A70] mt-1">
          Tekan petak di bawah untuk memilih bahagian yang diperlukan.
        </p>
      </div>

      {/* Bar container */}
      <div className="w-full my-4 bg-[#EFEAE1] p-3 rounded-2xl border-2 border-[#D6CEBE] shadow-inner">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2">
          {Array.from({ length: totalItems }).map((_, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(idx)}
                className={`h-16 sm:h-20 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-[#5A5A40] border-[#A67C52] text-white shadow-md ring-2 ring-[#D6CEBE]'
                    : 'bg-white border-[#D6CEBE] text-[#5A5A50] hover:bg-[#EFEAE1]'
                }`}
              >
                <span className="text-lg sm:text-xl">{icon}</span>
                <span className="text-[10px] font-bold mt-1">1/{totalItems}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fraction display footer */}
      <div className="mt-2 flex items-center justify-between w-full bg-[#EFEAE1] p-3 rounded-xl border border-[#D6CEBE]">
        <div className="text-sm font-semibold text-[#3A3A30]">
          Bahagian Dipilih: <span className="font-bold text-[#A67C52] text-base">{currentCount}</span> / {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5A5A50]">Pecahan:</span>
          <div className="flex flex-col items-center font-extrabold text-xl leading-none text-[#5A5A40] bg-white px-3 py-1 rounded-lg border border-[#D6CEBE]">
            <span>{currentCount}</span>
            <div className="w-6 h-[2px] bg-[#5A5A40] my-[1px]" />
            <span>{totalItems}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
