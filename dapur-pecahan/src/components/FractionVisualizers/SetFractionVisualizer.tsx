import React from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface SetFractionVisualizerProps {
  totalItems: number;
  requiredCount: number;
  selectedIndices: number[];
  onToggleItem: (index: number) => void;
  icon: string;
  itemName: string;
}

export const SetFractionVisualizer: React.FC<SetFractionVisualizerProps> = ({
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
          DSKP 3.1.1: Pecahan Daripada Satu Kumpulan
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          Sila pilih <span className="text-[#A67C52] underline decoration-[#A67C52] decoration-2">{requiredCount}</span> daripada <span className="text-[#5A5A50]">{totalItems}</span> {itemName}
        </h4>
        <p className="text-xs text-[#7A7A70] mt-1">
          Klik pada item di bawah untuk memilih atau membatalkan pilihan.
        </p>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 my-2 w-full justify-items-center">
        {Array.from({ length: totalItems }).map((_, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleClick(idx)}
              className={`relative flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-[#5A5A40] border-[#A67C52] text-white ring-4 ring-[#D6CEBE] scale-105'
                  : 'bg-white border-[#D6CEBE] text-[#5A5A50] hover:bg-[#EFEAE1] hover:border-[#A67C52]'
              }`}
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-sm">{icon}</span>
              <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-[#F2E8CF]' : 'text-[#7A7A70]'}`}>
                #{idx + 1}
              </span>
              {isSelected && (
                <span className="absolute -top-2 -right-2 bg-[#A67C52] text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center shadow">
                  ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Fraction Display Badge */}
      <div className="mt-5 flex items-center gap-3 bg-[#EFEAE1] border border-[#D6CEBE] px-5 py-3 rounded-xl w-full justify-between">
        <div className="text-sm font-semibold text-[#3A3A30]">
          Pilihan Semasa: <span className="font-bold text-[#A67C52] text-base">{currentCount}</span> / {totalItems}
        </div>

        {/* Big fraction visual */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5A5A50] font-medium">Bentuk Pecahan:</span>
          <div className="flex flex-col items-center font-extrabold text-xl leading-none text-[#5A5A40] bg-white px-3 py-1 rounded-lg border border-[#D6CEBE] shadow-inner">
            <span>{currentCount}</span>
            <div className="w-6 h-[2px] bg-[#5A5A40] my-[1px]" />
            <span>{totalItems}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
