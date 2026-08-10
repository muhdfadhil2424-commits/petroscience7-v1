import React from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface LiquidGaugeVisualizerProps {
  totalItems: number; // e.g. 10 or 2
  requiredCount: number; // e.g. 8 or 1
  selectedCount: number;
  onSelectLevel: (level: number) => void;
  icon: string;
  itemName: string;
}

export const LiquidGaugeVisualizer: React.FC<LiquidGaugeVisualizerProps> = ({
  totalItems,
  requiredCount,
  selectedCount,
  onSelectLevel,
  icon,
  itemName,
}) => {
  const handleLevelClick = (lvl: number) => {
    sounds.playLiquidPouringSound(1.2);
    onSelectLevel(lvl);
  };

  const percentage = (selectedCount / totalItems) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#F7F3ED] rounded-2xl p-5 shadow-lg border-2 border-[#D6CEBE]">
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-[#EFEAE1] text-[#5A5A40] rounded-full text-xs font-bold mb-1 border border-[#D6CEBE]">
          DSKP 3.1.3: Pengukuran Aras Cecair & Pecahan
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          Isi cecair sehinga aras <span className="text-[#A67C52] underline decoration-[#A67C52] decoration-2">{requiredCount} per {totalItems}</span> ({requiredCount}/{totalItems}) {itemName}
        </h4>
        <p className="text-xs text-[#7A7A70] mt-1">
          Pilih aras cecair yang betul pada tolok cecair di bawah.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-3">
        {/* Measuring Flask / Bottle visual */}
        <div className="relative w-28 h-60 bg-white/80 rounded-2xl border-4 border-[#D6CEBE] overflow-hidden shadow-inner flex flex-col justify-end">
          {/* Liquid level fill */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            className={`w-full transition-colors relative ${
              icon === '🧴'
                ? 'bg-gradient-to-t from-[#A67C52] to-[#D6CEBE] opacity-90'
                : 'bg-gradient-to-t from-[#A67C52] to-[#EFEAE1] opacity-90'
            }`}
          >
            {/* Liquid wave surface */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/40 animate-pulse" />
          </motion.div>

          {/* Level Markings */}
          <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 pointer-events-none">
            {Array.from({ length: totalItems + 1 }).map((_, i) => {
              const levelVal = totalItems - i;
              return (
                <div key={i} className="flex items-center justify-between w-full border-t border-[#D6CEBE] text-[9px] font-bold text-[#3A3A30] px-1">
                  <span>{levelVal}</span>
                  <span className="text-[8px] text-[#7A7A70]">{levelVal}/{totalItems}</span>
                </div>
              );
            })}
          </div>

          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow opacity-80">
            {icon}
          </div>
        </div>

        {/* Level buttons selection */}
        <div className="flex flex-col gap-2 w-48">
          <span className="text-xs font-bold text-[#5A5A50] text-center">Pilih Aras Sukatan:</span>
          {Array.from({ length: totalItems }).map((_, i) => {
            const levelVal = totalItems - i;
            const isSelected = selectedCount === levelVal;
            return (
              <motion.button
                key={levelVal}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLevelClick(levelVal)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#5A5A40] text-white shadow ring-2 ring-[#D6CEBE]'
                    : 'bg-[#EFEAE1] text-[#3A3A30] hover:bg-[#D6CEBE] border border-[#D6CEBE]'
                }`}
              >
                <span>Aras {levelVal}</span>
                <span className="font-extrabold">{levelVal}/{totalItems}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between w-full bg-[#EFEAE1] p-3 rounded-xl border border-[#D6CEBE]">
        <div className="text-sm font-semibold text-[#3A3A30]">
          Aras Terkini: <span className="font-bold text-[#A67C52] text-base">{selectedCount}</span> / {totalItems}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5A5A50]">Pecahan:</span>
          <div className="flex flex-col items-center font-extrabold text-lg leading-none text-[#5A5A40] bg-white px-3 py-1 rounded-lg border border-[#D6CEBE]">
            <span>{selectedCount}</span>
            <div className="w-5 h-[2px] bg-[#5A5A40] my-[1px]" />
            <span>{totalItems}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
