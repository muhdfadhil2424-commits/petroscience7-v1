import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MathFraction } from './MathFraction';

export type FractionVisualType = 'bar' | 'pizza' | 'number-line' | 'shape';

export interface FractionVisualProps {
  numerator: number;
  denominator: number;
  type?: FractionVisualType;
  comparison?: {
    numerator: number;
    denominator: number;
  };
  comparisonTitle?: string;
  label?: string;
  caption?: string;
  allowTypeSwitch?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FractionVisual: React.FC<FractionVisualProps> = ({
  numerator,
  denominator,
  type = 'bar',
  comparison,
  comparisonTitle,
  label,
  caption,
  allowTypeSwitch = true,
  size = 'md',
  className = '',
}) => {
  const [selectedType, setSelectedType] = useState<FractionVisualType>(type);

  // Bounds validation
  const safeDen = Math.max(1, Math.min(12, denominator));
  const safeNum = Math.max(0, Math.min(safeDen, numerator));

  // If comparison exists, render comparison mode directly
  if (comparison) {
    const compDen = Math.max(1, Math.min(12, comparison.denominator));
    const compNum = Math.max(0, Math.min(compDen, comparison.numerator));

    return (
      <div
        id="fraction-comparison-visual"
        className={`bg-white/95 rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-sm font-rounded text-[#4A3728] ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-200">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <span>⚖️ Perbandingan Pecahan</span>
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            <MathFraction num={safeNum} den={safeDen} size="xs" /> &gt;{' '}
            <MathFraction num={compNum} den={compDen} size="xs" />
          </span>
        </div>

        {comparisonTitle && (
          <p className="text-xs text-[#4A3728]/85 font-medium mb-2.5">
            {comparisonTitle}
          </p>
        )}

        {/* Visual Comparison Bars */}
        <div className="space-y-3 my-2">
          {/* First Fraction */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1 text-emerald-700">
                <span>Pecahan 1:</span>
                <MathFraction num={safeNum} den={safeDen} size="sm" />
              </span>
              <span className="text-[11px] text-gray-500 font-normal">
                {safeNum} daripada {safeDen} bahagian
              </span>
            </div>
            <div className="h-8 sm:h-9 bg-gray-100 rounded-xl border-2 border-emerald-400 overflow-hidden flex shadow-inner">
              {Array.from({ length: safeDen }).map((_, i) => (
                <div
                  key={`comp-1-${i}`}
                  style={{ width: `${100 / safeDen}%` }}
                  className={`h-full border-r last:border-r-0 border-emerald-300 flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all ${
                    i < safeNum
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white/90 text-gray-300'
                  }`}
                >
                  {i < safeNum ? '🟩' : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Second Fraction */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center gap-1 text-amber-700">
                <span>Pecahan 2:</span>
                <MathFraction num={compNum} den={compDen} size="sm" />
              </span>
              <span className="text-[11px] text-gray-500 font-normal">
                {compNum} daripada {compDen} bahagian
              </span>
            </div>
            <div className="h-8 sm:h-9 bg-gray-100 rounded-xl border-2 border-amber-400 overflow-hidden flex shadow-inner">
              {Array.from({ length: compDen }).map((_, i) => (
                <div
                  key={`comp-2-${i}`}
                  style={{ width: `${100 / compDen}%` }}
                  className={`h-full border-r last:border-r-0 border-amber-300 flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all ${
                    i < compNum
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white/90 text-gray-300'
                  }`}
                >
                  {i < compNum ? '🟨' : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual takeaway note */}
        <div className="mt-2.5 pt-2 border-t border-amber-200/60 bg-amber-50/80 rounded-xl p-2 text-center text-[11px] text-[#4A3728] font-medium leading-relaxed">
          💡 <strong>Lihat saiz kepingan di atas!</strong> Apabila dibahagi kepada lebih sedikit bahagian ({safeDen}), setiap bahagian adalah lebih besar!
        </div>
      </div>
    );
  }

  return (
    <div
      id="fraction-visual-container"
      className={`bg-white/95 rounded-2xl p-3 sm:p-4 border-2 border-pink-200 shadow-sm font-rounded text-[#4A3728] ${className}`}
    >
      {/* Top Header Row with Fraction Badge & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-pink-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pink-900 flex items-center gap-1">
            <span>👀 Visual Pecahan:</span>
            <MathFraction num={safeNum} den={safeDen} size="sm" />
          </span>
          <span className="text-[10px] text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full font-semibold">
            {safeNum} drpd {safeDen}
          </span>
        </div>

        {/* View Switcher: Bar | Pizza | Garis | Bentuk */}
        {allowTypeSwitch && (
          <div className="flex items-center gap-1 bg-[#FFF8E8] p-1 rounded-xl border border-amber-200">
            <button
              type="button"
              onClick={() => setSelectedType('bar')}
              title="Fraction Bar"
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                selectedType === 'bar'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              ▰ Bar
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('pizza')}
              title="Pizza Fraction"
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                selectedType === 'pizza'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🍕 Pizza
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('number-line')}
              title="Garis Nombor"
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                selectedType === 'number-line'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              📏 Garis
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('shape')}
              title="Bentuk Grid"
              className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                selectedType === 'shape'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🔵 Bentuk
            </button>
          </div>
        )}
      </div>

      {/* Main Graphic Rendering by Selected Type */}
      <div className="my-3 flex flex-col items-center justify-center min-h-[90px]">
        {/* 1. FRACTION BAR */}
        {selectedType === 'bar' && (
          <div className="w-full max-w-sm">
            <div className="h-10 sm:h-12 bg-gray-50 rounded-xl border-2 border-emerald-500 overflow-hidden flex shadow-inner">
              {Array.from({ length: safeDen }).map((_, i) => (
                <motion.div
                  key={`bar-${i}`}
                  initial={{ opacity: 0, scaleY: 0.8 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ width: `${100 / safeDen}%` }}
                  className={`h-full border-r last:border-r-0 border-emerald-300 flex flex-col items-center justify-center font-bold text-[10px] sm:text-xs transition-colors ${
                    i < safeNum
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/80 text-gray-300'
                  }`}
                >
                  <span>{i < safeNum ? '1' : ''}</span>
                  {i < safeNum && (
                    <span className="text-[8px] opacity-80 border-t border-white/60 px-1 leading-none">
                      {safeDen}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            {/* Legend guide beneath */}
            <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1.5 px-1 font-medium">
              <span>0</span>
              <span className="font-bold text-emerald-700">
                {safeNum} bahagian berlorek
              </span>
              <span>1 keseluruhan</span>
            </div>
          </div>
        )}

        {/* 2. PIZZA FRACTION (SVG Circle Slices) */}
        {selectedType === 'pizza' && (
          <div className="flex items-center justify-center p-1">
            <svg
              viewBox="-60 -60 120 120"
              className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md select-none"
            >
              {/* Outer Pizza Crust */}
              <circle
                cx="0"
                cy="0"
                r="52"
                fill="#F4C95D"
                stroke="#D98262"
                strokeWidth="4"
              />
              <circle cx="0" cy="0" r="46" fill="#FFF2D6" />

              {/* Slices */}
              {Array.from({ length: safeDen }).map((_, i) => {
                const anglePerSlice = (2 * Math.PI) / safeDen;
                const startAngle = i * anglePerSlice - Math.PI / 2;
                const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;

                const r = 46;
                const x1 = r * Math.cos(startAngle);
                const y1 = r * Math.sin(startAngle);
                const x2 = r * Math.cos(endAngle);
                const y2 = r * Math.sin(endAngle);

                const largeArc = anglePerSlice > Math.PI ? 1 : 0;
                const pathData = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const isFilled = i < safeNum;

                // Slice midpoint for topping or pepper
                const midAngle = startAngle + anglePerSlice / 2;
                const topX = 26 * Math.cos(midAngle);
                const topY = 26 * Math.sin(midAngle);

                return (
                  <g key={`slice-${i}`}>
                    <path
                      d={pathData}
                      fill={isFilled ? '#E05A47' : '#FFFFFF'}
                      fillOpacity={isFilled ? 0.92 : 0.4}
                      stroke="#A34835"
                      strokeWidth="1.5"
                    />
                    {/* Topping dot on filled slices */}
                    {isFilled && (
                      <circle
                        cx={topX}
                        cy={topY}
                        r="4"
                        fill="#F9D423"
                        stroke="#B8860B"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}

              {/* Center Pizza Pin */}
              <circle cx="0" cy="0" r="4" fill="#D98262" />
            </svg>
          </div>
        )}

        {/* 3. NUMBER LINE (📏 Garis Nombor) */}
        {selectedType === 'number-line' && (
          <div className="w-full max-w-sm px-3 py-2">
            <svg viewBox="0 0 280 60" className="w-full h-14 select-none">
              {/* Main horizontal line */}
              <line
                x1="20"
                y1="32"
                x2="260"
                y2="32"
                stroke="#4A3728"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Arrowheads */}
              <polygon points="16,32 24,28 24,36" fill="#4A3728" />
              <polygon points="264,32 256,28 256,36" fill="#4A3728" />

              {/* Colored shaded segment from 0 to target */}
              {safeNum > 0 && (
                <line
                  x1="30"
                  y1="32"
                  x2={30 + (220 / safeDen) * safeNum}
                  y2="32"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}

              {/* Ticks and fractions */}
              {Array.from({ length: safeDen + 1 }).map((_, i) => {
                const x = 30 + (220 / safeDen) * i;
                const isTarget = i === safeNum;

                return (
                  <g key={`numline-tick-${i}`}>
                    <line
                      x1={x}
                      y1="24"
                      x2={x}
                      y2="40"
                      stroke={isTarget ? '#10B981' : '#8C7A6B'}
                      strokeWidth={isTarget ? '3' : '1.5'}
                    />
                    {/* Tick Label */}
                    <text
                      x={x}
                      y="52"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight={isTarget ? 'bold' : 'normal'}
                      fill={isTarget ? '#047857' : '#6B7280'}
                    >
                      {i === 0 ? '0' : i === safeDen ? '1' : `${i}/${safeDen}`}
                    </text>
                    {/* Dot on target */}
                    {isTarget && (
                      <circle
                        cx={x}
                        cy="32"
                        r="5"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* 4. SHAPE FRACTION (🔵 Bentuk / Grid) */}
        {selectedType === 'shape' && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs p-1">
            {Array.from({ length: safeDen }).map((_, i) => {
              const isFilled = i < safeNum;
              return (
                <motion.div
                  key={`shape-${i}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs border-2 transition-all ${
                    isFilled
                      ? 'bg-blue-500 border-blue-600 text-white shadow-blue-200'
                      : 'bg-white border-dashed border-gray-300 text-gray-300'
                  }`}
                >
                  {isFilled ? '🔵' : '⚪'}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Descriptive Caption */}
      <div className="bg-[#FFF8E8] rounded-xl p-2 text-center text-xs font-medium text-[#4A3728] border border-amber-200">
        {caption || (
          <span>
            Pecahan{' '}
            <strong>
              {safeNum}/{safeDen}
            </strong>{' '}
            menunjukkan <strong>{safeNum}</strong> daripada{' '}
            <strong>{safeDen}</strong> bahagian yang sama besar! ✨
          </span>
        )}
      </div>
    </div>
  );
};
