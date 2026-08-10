import React from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface EggGroupsVisualizerProps {
  totalEggs: number; // 15
  groupSize: number; // 3
  requiredGroups: number; // 3
  selectedGroupIndices: number[];
  onToggleGroup: (groupIndex: number) => void;
}

export const EggGroupsVisualizer: React.FC<EggGroupsVisualizerProps> = ({
  totalEggs,
  groupSize,
  requiredGroups,
  selectedGroupIndices,
  onToggleGroup,
}) => {
  const totalGroups = totalEggs / groupSize; // 5
  const currentGroupCount = selectedGroupIndices.length;
  const currentEggCount = currentGroupCount * groupSize;

  const handleGroupClick = (idx: number) => {
    sounds.playPop();
    onToggleGroup(idx);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#F7F3ED] rounded-2xl p-5 shadow-lg border-2 border-[#D6CEBE]">
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-[#EFEAE1] text-[#5A5A40] rounded-full text-xs font-bold mb-1 border border-[#D6CEBE]">
          DSKP 3.1.1: Pecahan Daripada Suatu Kumpulan (15 Biji Telur)
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          Ambil <span className="text-[#A67C52] underline decoration-[#A67C52] decoration-2">3 per 5 (3/5)</span> daripada 15 biji telur!
        </h4>
        <p className="text-xs text-[#5A5A50] mt-1">
          15 biji telur ini telah dibahagikan kepada <span className="font-bold">5 sarang kumpulan</span> (setiap sarang mengandungi 3 biji telur).
        </p>
      </div>

      {/* 5 Group Crates */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 w-full my-3">
        {Array.from({ length: totalGroups }).map((_, groupIdx) => {
          const isSelected = selectedGroupIndices.includes(groupIdx);
          return (
            <motion.button
              key={groupIdx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGroupClick(groupIdx)}
              className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#EFEAE1] border-[#A67C52] ring-2 ring-[#D6CEBE] shadow-md'
                  : 'bg-white border-[#D6CEBE] hover:bg-[#EFEAE1]/60'
              }`}
            >
              <div className="text-[10px] font-bold text-[#5A5A40] mb-1">
                Kumpulan #{groupIdx + 1}
              </div>
              <div className="bg-[#F7F3ED] rounded-lg p-1.5 flex flex-wrap justify-center gap-1 w-full border border-[#D6CEBE]">
                {Array.from({ length: groupSize }).map((_, eggIdx) => (
                  <span key={eggIdx} className="text-lg filter drop-shadow-sm">
                    🥚
                  </span>
                ))}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#5A5A40] text-white' : 'bg-[#EFEAE1] text-[#3A3A30]'}`}>
                {isSelected ? '✓ 3 Biji' : '3 Biji'}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mathematical Breakdown box */}
      <div className="w-full bg-[#EFEAE1] p-4 rounded-xl border border-[#D6CEBE] mt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <div className="font-bold text-[#3A3A30]">
              Kumpulan Dipilih: <span className="text-[#A67C52] text-base">{currentGroupCount} / 5</span> kumpulan
            </div>
            <div className="text-[#5A5A50] font-medium">
              Jumlah Biji Telur = {currentGroupCount} × 3 = <span className="text-[#A67C52] font-bold">{currentEggCount} biji</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#D6CEBE] shadow-sm">
            <span className="text-[#5A5A50] font-semibold text-xs">Pecahan:</span>
            <div className="flex flex-col items-center font-extrabold text-lg leading-none text-[#5A5A40]">
              <span>{currentGroupCount}</span>
              <div className="w-5 h-[2px] bg-[#5A5A40] my-[1px]" />
              <span>5</span>
            </div>
            <span className="text-[#7A7A70] font-bold mx-1">=</span>
            <span className="font-bold text-[#A67C52]">{currentEggCount} / 15</span>
          </div>
        </div>
      </div>
    </div>
  );
};
