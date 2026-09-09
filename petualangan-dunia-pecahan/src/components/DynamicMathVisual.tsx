import React from 'react';
import { QuestionBankItem, VisualData } from '../data/questionBank/types';
import { FormattedMathText } from './MathFraction';

interface DynamicMathVisualProps {
  question?: QuestionBankItem;
  visualType?: string;
  visualData?: VisualData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideResult?: boolean;
}

/**
 * Pure SVG & CSS dynamic mathematical visualizer.
 * Renders visuals directly from question data to ensure 100% consistency with problem statements.
 * Completely offline and responsive.
 */
export const DynamicMathVisual: React.FC<DynamicMathVisualProps> = ({
  question,
  visualType: propVisualType,
  visualData: propVisualData,
  className = '',
  size = 'md',
  hideResult = false,
}) => {
  const visualType = propVisualType || question?.visualType || 'fraction_bar';
  const data: any = propVisualData || question?.visualData || {};

  // Render Object Group (e.g. balls, apples, gems, cones, bottles)
  if (visualType === 'object_group') {
    const total = data.totalObjects || data.total || 8;
    const highlighted = data.highlightedObjects !== undefined ? data.highlightedObjects : (data.highlighted !== undefined ? data.highlighted : 3);
    const objectType = data.objectType || 'ball';
    const highlightLabel = data.highlightLabel || 'Dipilih';

    const renderIcon = (isHighlighted: boolean, index: number) => {
      if (objectType === 'ball') {
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
            <circle
              cx="20"
              cy="20"
              r="17"
              fill={isHighlighted ? '#3B82F6' : '#F3F4F6'}
              stroke={isHighlighted ? '#1D4ED8' : '#9CA3AF'}
              strokeWidth="2.5"
            />
            {/* Ball seams / pentagons */}
            <circle
              cx="20"
              cy="20"
              r="7"
              fill={isHighlighted ? '#1E40AF' : '#D1D5DB'}
              stroke={isHighlighted ? '#172554' : '#6B7280'}
              strokeWidth="1.5"
            />
            <path
              d="M 20 13 L 20 3 M 20 27 L 20 37 M 13 20 L 3 20 M 27 20 L 37 20"
              stroke={isHighlighted ? '#93C5FD' : '#9CA3AF'}
              strokeWidth="1.5"
            />
          </svg>
        );
      }

      if (objectType === 'gem' || objectType === 'crystal') {
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
            <polygon
              points="20,4 34,14 28,36 12,36 6,14"
              fill={isHighlighted ? '#8B5CF6' : '#E5E7EB'}
              stroke={isHighlighted ? '#6D28D9' : '#9CA3AF'}
              strokeWidth="2"
            />
            <polygon
              points="20,4 27,14 20,24 13,14"
              fill={isHighlighted ? '#A78BFA' : '#F3F4F6'}
              stroke={isHighlighted ? '#5B21B6' : '#D1D5DB'}
              strokeWidth="1.5"
            />
          </svg>
        );
      }

      if (objectType === 'apple' || objectType === 'fruit') {
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
            {/* Stem */}
            <path d="M 20 8 Q 23 2 27 4" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 21 8 Q 26 6 25 11 Z" fill="#15803D" />
            {/* Apple body */}
            <path
              d="M 20 11 C 12 7, 7 15, 8 26 C 9 34, 16 37, 20 35 C 24 37, 31 34, 32 26 C 33 15, 28 7, 20 11 Z"
              fill={isHighlighted ? '#EF4444' : '#E5E7EB'}
              stroke={isHighlighted ? '#B91C1C' : '#9CA3AF'}
              strokeWidth="2"
            />
          </svg>
        );
      }

      if (objectType === 'chocolate' || objectType === 'coklat') {
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
            <rect
              x="6"
              y="8"
              width="28"
              height="24"
              rx="4"
              fill={isHighlighted ? '#78350F' : '#E5E7EB'}
              stroke={isHighlighted ? '#451A03' : '#9CA3AF'}
              strokeWidth="2"
            />
            {/* Chocolate grids */}
            <rect x="9" y="11" width="10" height="8" rx="1.5" fill={isHighlighted ? '#92400E' : '#F3F4F6'} />
            <rect x="21" y="11" width="10" height="8" rx="1.5" fill={isHighlighted ? '#92400E' : '#F3F4F6'} />
            <rect x="9" y="21" width="10" height="8" rx="1.5" fill={isHighlighted ? '#92400E' : '#F3F4F6'} />
            <rect x="21" y="21" width="10" height="8" rx="1.5" fill={isHighlighted ? '#92400E' : '#F3F4F6'} />
          </svg>
        );
      }

      if (objectType === 'flower' || objectType === 'bunga') {
        return (
          <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
            {/* Petals */}
            <circle cx="20" cy="11" r="6" fill={isHighlighted ? '#EC4899' : '#E5E7EB'} stroke={isHighlighted ? '#BE185D' : '#9CA3AF'} strokeWidth="1.5" />
            <circle cx="29" cy="20" r="6" fill={isHighlighted ? '#EC4899' : '#E5E7EB'} stroke={isHighlighted ? '#BE185D' : '#9CA3AF'} strokeWidth="1.5" />
            <circle cx="20" cy="29" r="6" fill={isHighlighted ? '#EC4899' : '#E5E7EB'} stroke={isHighlighted ? '#BE185D' : '#9CA3AF'} strokeWidth="1.5" />
            <circle cx="11" cy="20" r="6" fill={isHighlighted ? '#EC4899' : '#E5E7EB'} stroke={isHighlighted ? '#BE185D' : '#9CA3AF'} strokeWidth="1.5" />
            {/* Center */}
            <circle cx="20" cy="20" r="5" fill={isHighlighted ? '#FBBF24' : '#D1D5DB'} stroke={isHighlighted ? '#D97706' : '#6B7280'} strokeWidth="1.5" />
          </svg>
        );
      }

      // Default Star / Trophy
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10 transition-transform">
          <polygon
            points="20,3 25,14 37,15 28,24 31,36 20,30 9,36 12,24 3,15 15,14"
            fill={isHighlighted ? '#F59E0B' : '#E5E7EB'}
            stroke={isHighlighted ? '#D97706' : '#9CA3AF'}
            strokeWidth="2"
          />
        </svg>
      );
    };

    return (
      <div className={`flex flex-col items-center gap-3 p-3 bg-white/95 rounded-2xl border-2 border-stone-200/90 shadow-sm ${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-sm sm:max-w-md py-1">
          {Array.from({ length: total }).map((_, idx) => {
            const isHighlighted = idx < highlighted;
            return (
              <div
                key={idx}
                className={`relative p-1.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  isHighlighted
                    ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300/60 shadow-xs'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
                title={`Item #${idx + 1}`}
              >
                {renderIcon(isHighlighted, idx)}
                <span className={`text-[10px] font-black mt-0.5 ${isHighlighted ? 'text-blue-900' : 'text-stone-500'}`}>
                  #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-blue-100 text-blue-950 rounded-full border border-blue-300">
          <span>{highlighted}/{total}</span>
          <span>•</span>
          <span>{highlighted} {highlightLabel} daripada {total} objek</span>
        </div>
      </div>
    );
  }

  // Render Pizza / Cake Fraction (Circle with slices)
  if (visualType === 'pizza_fraction' || visualType === 'pizza') {
    const totalParts = data.totalParts || 8;
    const highlightedParts = data.highlightedParts || 3;
    const itemType = data.itemType || 'pizza';

    return (
      <div className={`flex flex-col items-center gap-3 p-3 bg-white/95 rounded-2xl border-2 border-amber-200 shadow-sm ${className}`}>
        <div className="relative w-36 h-36 sm:w-44 sm:h-44">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
            {/* Crust */}
            <circle
              cx="100"
              cy="100"
              r="92"
              fill={itemType === 'cake' ? '#FBCFE8' : '#D98262'}
              stroke={itemType === 'cake' ? '#DB2777' : '#9A3412'}
              strokeWidth="4"
            />
            {/* Sauce Base */}
            <circle
              cx="100"
              cy="100"
              r="82"
              fill={itemType === 'cake' ? '#FDF2F8' : '#EA580C'}
              stroke={itemType === 'cake' ? '#F472B6' : '#C2410C'}
              strokeWidth="2"
            />

            {/* Slices */}
            {Array.from({ length: totalParts }).map((_, i) => {
              const angle = (360 / totalParts) * i - 90;
              const nextAngle = (360 / totalParts) * (i + 1) - 90;
              const rad1 = (angle * Math.PI) / 180;
              const rad2 = (nextAngle * Math.PI) / 180;
              const x1 = 100 + 78 * Math.cos(rad1);
              const y1 = 100 + 78 * Math.sin(rad1);
              const x2 = 100 + 78 * Math.cos(rad2);
              const y2 = 100 + 78 * Math.sin(rad2);
              const path = `M 100 100 L ${x1} ${y1} A 78 78 0 0 1 ${x2} ${y2} Z`;
              const isHighlighted = i < highlightedParts;

              return (
                <path
                  key={i}
                  d={path}
                  fill={
                    isHighlighted
                      ? itemType === 'cake'
                        ? '#F472B6'
                        : '#FBBF24'
                      : itemType === 'cake'
                      ? '#FFFFFF'
                      : '#FFFBEB'
                  }
                  stroke="#4A3728"
                  strokeWidth="2.5"
                  className="transition-colors"
                />
              );
            })}

            {/* Center topper */}
            <circle cx="100" cy="100" r="8" fill="#4A3728" />
          </svg>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-amber-100 text-amber-950 rounded-full border border-amber-300">
          <span>{highlightedParts}/{totalParts}</span>
          <span>•</span>
          <span>{highlightedParts} daripada {totalParts} bahagian sama besar</span>
        </div>
      </div>
    );
  }

  // Render Fraction Bar
  if (visualType === 'fraction_bar') {
    const denominator = data.denominator || 4;
    const numerator = data.numerator || 3;
    const color = data.color || '#10B981';

    return (
      <div className={`flex flex-col items-center gap-2 p-3 bg-white/95 rounded-2xl border-2 border-stone-200 shadow-sm ${className}`}>
        <div className="w-full max-w-sm bg-stone-100 p-2 rounded-xl border border-stone-300">
          <div className="grid gap-1 rounded-lg overflow-hidden border-2 border-stone-800 p-0.5 bg-stone-800" style={{ gridTemplateColumns: `repeat(${denominator}, minmax(0, 1fr))` }}>
            {Array.from({ length: denominator }).map((_, i) => {
              const isFilled = i < numerator;
              return (
                <div
                  key={i}
                  className={`h-12 flex flex-col items-center justify-center font-black text-xs transition-colors rounded-sm ${
                    isFilled ? 'bg-emerald-400 text-emerald-950 border border-emerald-300 shadow-inner' : 'bg-white text-stone-400'
                  }`}
                >
                  <span>1/{denominator}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
          <span>{numerator}/{denominator}</span>
          <span>•</span>
          <span>{numerator} bahagian berlorek daripada {denominator}</span>
        </div>
      </div>
    );
  }

  // Render Equivalent Bars (e.g. 1/2 = 2/4)
  if (visualType === 'equivalent_bars') {
    const bar1 = data.bar1 || { numerator: 1, denominator: 2, label: '1/2' };
    const bar2 = data.bar2 || { numerator: 2, denominator: 4, label: '2/4' };

    return (
      <div className={`flex flex-col items-center gap-3 p-4 bg-white/95 rounded-2xl border-2 border-indigo-200 shadow-sm w-full max-w-md ${className}`}>
        <span className="text-xs font-black text-indigo-900 uppercase tracking-wider">
          Perbandingan Pecahan Setara:
        </span>

        {/* Bar 1 */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-bold text-stone-700">
            <span>Pecahan Asal</span>
            <span className="text-indigo-800 font-extrabold">{bar1.label || `${bar1.numerator}/${bar1.denominator}`}</span>
          </div>
          <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5" style={{ gridTemplateColumns: `repeat(${bar1.denominator}, minmax(0, 1fr))` }}>
            {Array.from({ length: bar1.denominator }).map((_, i) => (
              <div
                key={i}
                className={`h-9 flex items-center justify-center font-black text-xs ${
                  i < bar1.numerator ? 'bg-indigo-400 text-indigo-950' : 'bg-white text-stone-300'
                }`}
              >
                1/{bar1.denominator}
              </div>
            ))}
          </div>
        </div>

        {/* Equality symbol and connecting dashed line */}
        <div className="flex items-center justify-center gap-2 text-xs font-black text-indigo-900">
          <span>⬇️ Nilai keluasan yang sama ⬇️</span>
        </div>

        {/* Bar 2 */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-bold text-stone-700">
            <span>Pecahan Setara</span>
            <span className="text-indigo-800 font-extrabold">{bar2.label || `${bar2.numerator}/${bar2.denominator}`}</span>
          </div>
          <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5" style={{ gridTemplateColumns: `repeat(${bar2.denominator}, minmax(0, 1fr))` }}>
            {Array.from({ length: bar2.denominator }).map((_, i) => (
              <div
                key={i}
                className={`h-9 flex items-center justify-center font-black text-xs ${
                  i < bar2.numerator ? 'bg-indigo-300 text-indigo-950' : 'bg-white text-stone-300'
                }`}
              >
                1/{bar2.denominator}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs font-black px-3 py-1 bg-indigo-100 text-indigo-950 rounded-full border border-indigo-300">
          {bar1.numerator}/{bar1.denominator} = {bar2.numerator}/{bar2.denominator} (Panjang berlorek adalah sama)
        </div>
      </div>
    );
  }

  // Render Operation Bars (Addition or Subtraction)
  if (visualType === 'operation_bars') {
    const op = data.operation || '+';
    const f1 = data.fraction1 || { num: 1, den: 2 };
    const f2 = data.fraction2 || { num: 1, den: 4 };
    const result = data.resultFraction || { num: 3, den: 4 };
    const commonDenom = data.commonDenom || 4;

    // Equivalent representations in common denominator
    const f1ConvertedNum = (f1.num * commonDenom) / f1.den;
    const f2ConvertedNum = (f2.num * commonDenom) / f2.den;

    return (
      <div className={`flex flex-col items-center gap-3 p-4 bg-white/95 rounded-2xl border-2 border-emerald-300 shadow-sm w-full max-w-md ${className}`}>
        <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
          Visual Operasi {op === '+' ? 'Penambahan' : 'Penolakan'} Pecahan:
        </span>

        {/* First Fraction */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-bold text-stone-700">
            <span>Pecahan Pertama: <strong className="text-emerald-800">{f1.num}/{f1.den}</strong> {f1.den !== commonDenom && `(bersamaan ${f1ConvertedNum}/${commonDenom})`}</span>
          </div>
          <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5" style={{ gridTemplateColumns: `repeat(${commonDenom}, minmax(0, 1fr))` }}>
            {Array.from({ length: commonDenom }).map((_, i) => (
              <div
                key={i}
                className={`h-7 flex items-center justify-center font-black text-[11px] ${
                  i < f1ConvertedNum ? 'bg-emerald-400 text-emerald-950' : 'bg-white text-stone-300'
                }`}
              >
                1/{commonDenom}
              </div>
            ))}
          </div>
        </div>

        {/* Operation Sign */}
        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black flex items-center justify-center text-sm shadow-xs">
          {op}
        </div>

        {/* Second Fraction */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs font-bold text-stone-700">
            <span>Pecahan Kedua: <strong className="text-emerald-800">{f2.num}/{f2.den}</strong> {f2.den !== commonDenom && `(bersamaan ${f2ConvertedNum}/${commonDenom})`}</span>
          </div>
          <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5" style={{ gridTemplateColumns: `repeat(${commonDenom}, minmax(0, 1fr))` }}>
            {Array.from({ length: commonDenom }).map((_, i) => (
              <div
                key={i}
                className={`h-7 flex items-center justify-center font-black text-[11px] ${
                  i < f2ConvertedNum
                    ? op === '+'
                      ? 'bg-teal-300 text-teal-950'
                      : 'bg-rose-300 text-rose-950 line-through'
                    : 'bg-white text-stone-300'
                }`}
              >
                1/{commonDenom}
              </div>
            ))}
          </div>
        </div>

        {/* Equals Sign & Result */}
        <div className="w-full pt-1 border-t border-stone-300 space-y-1">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>Hasil {op === '+' ? 'Jumlah' : 'Baki'}:</span>
            {hideResult ? (
              <span className="text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                ? (Kira jawapan)
              </span>
            ) : (
              <span className="text-emerald-900 font-extrabold">{result.num}/{result.den}</span>
            )}
          </div>
          <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5" style={{ gridTemplateColumns: `repeat(${commonDenom}, minmax(0, 1fr))` }}>
            {Array.from({ length: commonDenom }).map((_, i) => (
              <div
                key={i}
                className={`h-8 flex items-center justify-center font-black text-xs ${
                  hideResult
                    ? 'bg-stone-100 text-stone-400'
                    : i < result.num
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : 'bg-white text-stone-300'
                }`}
              >
                {hideResult ? '?' : `1/${commonDenom}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Percentage Grid (10x10 = 100 cells)
  if (visualType === 'percentage_grid') {
    const highlighted = data.highlightedCells !== undefined ? data.highlightedCells : (data.highlighted !== undefined ? data.highlighted : 25);
    const label = data.label || `${highlighted}%`;

    return (
      <div className={`flex flex-col items-center gap-2.5 p-3 bg-white/95 rounded-2xl border-2 border-teal-300 shadow-sm ${className}`}>
        <span className="text-xs font-black text-teal-950 uppercase tracking-wider">
          Petak Seratus (Peratus):
        </span>

        <div className="p-2 bg-stone-900 rounded-xl shadow-inner">
          <div className="grid grid-cols-10 gap-0.5 w-44 h-44 sm:w-52 sm:h-52">
            {Array.from({ length: 100 }).map((_, idx) => {
              const isFilled = idx < highlighted;
              return (
                <div
                  key={idx}
                  className={`rounded-xs transition-colors ${
                    isFilled ? 'bg-teal-400 border border-teal-300' : 'bg-stone-800 border border-stone-700/50'
                  }`}
                  title={`Petak #${idx + 1}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black px-3 py-1 bg-teal-100 text-teal-950 rounded-full border border-teal-300">
          <span>{highlighted}/100</span>
          <span>=</span>
          <span>{label}</span>
          <span>({highlighted} daripada 100 petak)</span>
        </div>
      </div>
    );
  }

  // Render Mixed Number / Improper Fraction
  if (visualType === 'mixed_or_improper' || visualType === 'mixed_number' || visualType === 'improper_fraction') {
    const whole = data.whole !== undefined ? data.whole : 1;
    const numerator = data.numerator !== undefined ? data.numerator : 2;
    const denominator = data.denominator || 5;
    const partsPerWhole = data.partsPerWhole || denominator;
    const improperNum = data.improperNumerator || whole * partsPerWhole + numerator;

    return (
      <div className={`flex flex-col items-center gap-3 p-4 bg-white/95 rounded-2xl border-2 border-purple-200 shadow-sm w-full max-w-md ${className}`}>
        <span className="text-xs font-black text-purple-950 uppercase tracking-wider">
          Visual Nombor Bercampur & Pecahan Tak Wajar:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Whole Units */}
          {Array.from({ length: whole }).map((_, wIdx) => (
            <div key={`whole_${wIdx}`} className="flex flex-col items-center gap-1">
              <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5 w-24" style={{ gridTemplateColumns: `repeat(${partsPerWhole}, minmax(0, 1fr))` }}>
                {Array.from({ length: partsPerWhole }).map((_, i) => (
                  <div key={i} className="h-10 bg-purple-400 flex items-center justify-center font-black text-[10px] text-purple-950">
                    1/{partsPerWhole}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                1 Penuh ({partsPerWhole}/{partsPerWhole})
              </span>
            </div>
          ))}

          {/* Plus sign */}
          <span className="text-lg font-black text-stone-500">+</span>

          {/* Fractional Unit */}
          <div className="flex flex-col items-center gap-1">
            <div className="grid gap-0.5 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5 w-24" style={{ gridTemplateColumns: `repeat(${partsPerWhole}, minmax(0, 1fr))` }}>
              {Array.from({ length: partsPerWhole }).map((_, i) => (
                <div
                  key={i}
                  className={`h-10 flex items-center justify-center font-black text-[10px] ${
                    i < numerator ? 'bg-purple-300 text-purple-950' : 'bg-white text-stone-300'
                  }`}
                >
                  1/{partsPerWhole}
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
              {numerator}/{denominator}
            </span>
          </div>
        </div>

        {hideResult ? (
          <div className="flex items-center gap-2 text-xs font-black px-3 py-1.5 bg-amber-100 text-amber-950 rounded-full border border-amber-300">
            <span>🤔 Kira nilai nombor bercampur / pecahan tak wajar daripada visual di atas</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-black px-3 py-1 bg-purple-100 text-purple-950 rounded-full border border-purple-300">
            <span>Nombor Bercampur: {whole} {numerator}/{denominator}</span>
            <span>•</span>
            <span>Pecahan Tak Wajar: {improperNum}/{denominator}</span>
          </div>
        )}
      </div>
    );
  }

  // Render Measuring Cup (for Kitchen context)
  if (visualType === 'measuring_cup') {
    const total = data.totalParts || 4;
    const filled = data.filledParts || 3;
    const fillPercent = Math.round((filled / total) * 100);

    return (
      <div className={`flex flex-col items-center gap-3 p-3 bg-white/95 rounded-2xl border-2 border-amber-300 shadow-sm ${className}`}>
        <div className="relative w-32 h-44 bg-amber-50/50 rounded-b-2xl rounded-t-md border-3 border-amber-800 flex flex-col justify-end overflow-hidden shadow-md">
          {/* Tick lines */}
          {Array.from({ length: total }).map((_, i) => {
            const step = total - i;
            const topPercent = (i / total) * 100;
            return (
              <div
                key={i}
                className="absolute inset-x-0 border-b border-dashed border-amber-800/60 flex items-center justify-between px-1 z-20"
                style={{ top: `${topPercent}%` }}
              >
                <span className="text-[9px] font-black text-amber-950 bg-amber-100/90 px-1 rounded">
                  {step}/{total}
                </span>
              </div>
            );
          })}

          {/* Liquid fill */}
          <div
            className="w-full bg-gradient-to-t from-amber-600 to-amber-400 relative z-10 transition-all duration-500"
            style={{ height: `${fillPercent}%` }}
          />
        </div>

        <div className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-950 rounded-full border border-amber-400">
          <span>{filled}/{total} Cawan Penyukat ({fillPercent}%)</span>
        </div>
      </div>
    );
  }

  // Fallback generic fraction bar
  return (
    <div className={`p-3 bg-white rounded-xl border border-stone-200 text-center text-xs font-bold text-stone-700 ${className}`}>
      <FormattedMathText text={question?.question || ''} size="sm" />
    </div>
  );
};

export default DynamicMathVisual;
