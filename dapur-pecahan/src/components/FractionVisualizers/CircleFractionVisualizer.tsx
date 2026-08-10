import React from 'react';
import { motion } from 'motion/react';
import { sounds } from '../../utils/audio';

interface CircleFractionVisualizerProps {
  totalItems: number; // e.g. 3 or 4
  requiredCount: number; // e.g. 2 or 3
  selectedIndices: number[];
  onToggleItem: (index: number) => void;
  icon: string;
  itemName: string;
}

export const CircleFractionVisualizer: React.FC<CircleFractionVisualizerProps> = ({
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

  // Helper to draw SVG pie slices
  const getSlicePath = (index: number, total: number) => {
    const size = 200;
    const radius = 90;
    const center = size / 2;
    const anglePerSlice = (2 * Math.PI) / total;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = startAngle + anglePerSlice;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = anglePerSlice > Math.PI ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-[#F7F3ED] rounded-2xl p-5 shadow-lg border-2 border-[#D6CEBE]">
      <div className="text-center mb-3">
        <span className="inline-block px-3 py-1 bg-[#EFEAE1] text-[#5A5A40] rounded-full text-xs font-bold mb-1 border border-[#D6CEBE]">
          DSKP 3.1.1: Model Bulatan / Carta Pai
        </span>
        <h4 className="text-lg font-bold text-[#3A3A30]">
          Ambil <span className="text-[#A67C52] underline decoration-[#A67C52] decoration-2">{requiredCount} per {totalItems}</span> ({requiredCount}/{totalItems}) {itemName}
        </h4>
        <p className="text-xs text-[#7A7A70] mt-1">
          Klik pada bahagian kepingan di bawah untuk memilih bahagian pecahan.
        </p>
      </div>

      <div className="relative my-3 flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 200 200" className="filter drop-shadow-md">
          <circle cx="100" cy="100" r="92" className="fill-[#EFEAE1] stroke-[#D6CEBE] stroke-2" />
          {Array.from({ length: totalItems }).map((_, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <path
                key={idx}
                d={getSlicePath(idx, totalItems)}
                onClick={() => handleClick(idx)}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'fill-[#5A5A40] stroke-[#A67C52] stroke-2 hover:fill-[#4A4A33]'
                    : 'fill-white stroke-[#D6CEBE] stroke-1 hover:fill-[#EFEAE1]'
                }`}
              />
            );
          })}
          {/* Central emblem */}
          <circle cx="100" cy="100" r="28" className="fill-white stroke-[#D6CEBE] stroke-2 shadow" />
          <text x="100" y="105" textAnchor="middle" className="text-2xl fill-[#3A3A30] font-bold select-none">
            {icon}
          </text>
        </svg>
      </div>

      {/* Buttons option selector below */}
      <div className="flex gap-2 my-2">
        {Array.from({ length: totalItems }).map((_, idx) => {
          const isSelected = selectedIndices.includes(idx);
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#5A5A40] text-white shadow'
                  : 'bg-[#EFEAE1] text-[#3A3A30] border border-[#D6CEBE] hover:bg-[#D6CEBE]'
              }`}
            >
              Bahagian #{idx + 1} ({isSelected ? '✓' : 'Sektor'})
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between w-full bg-[#EFEAE1] p-3 rounded-xl border border-[#D6CEBE]">
        <div className="text-sm font-semibold text-[#3A3A30]">
          Diwakili: <span className="font-bold text-[#A67C52] text-base">{currentCount}</span> daripada {totalItems} bahagian
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5A5A50]">Nilai Pecahan:</span>
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
