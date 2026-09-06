import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowUpCircle, ArrowDownCircle, Info, Sparkles } from 'lucide-react';

interface FractionBenchmarkBadgeProps {
  currentCount: number;
  requiredCount: number;
  denominator: number;
  unitLabel?: string;
}

export const FractionBenchmarkBadge: React.FC<FractionBenchmarkBadgeProps> = ({
  currentCount,
  requiredCount,
  denominator,
  unitLabel = 'bahagian',
}) => {
  const diff = currentCount - requiredCount;
  const isExact = currentCount === requiredCount;
  const isUnder = currentCount < requiredCount;
  const isOver = currentCount > requiredCount;

  // Percentage progress towards target
  const targetPercent = Math.min(100, Math.round((requiredCount / denominator) * 100));
  const currentPercent = Math.min(100, Math.round((currentCount / denominator) * 100));

  return (
    <div className="w-full max-w-xl mx-auto mb-4 transition-all duration-300">
      <div
        className={`rounded-2xl p-3.5 border-2 shadow-sm transition-all duration-300 ${
          isExact
            ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200'
            : isOver
            ? 'bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-200'
            : currentCount === 0
            ? 'bg-[#EFEAE1]/90 border-[#D6CEBE] text-[#3A3A30]'
            : 'bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Status Title & Badge */}
          <div className="flex items-center gap-2">
            {isExact ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                <span>TEPAT & SEMPURNA!</span>
              </span>
            ) : isOver ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs animate-bounce">
                <ArrowDownCircle className="w-4 h-4 text-rose-100" />
                <span>TERLEBIH SASARAN</span>
              </span>
            ) : currentCount === 0 ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#5A5A40] text-white">
                <Info className="w-3.5 h-3.5 text-amber-200" />
                <span>PENANDA ARAS RESIPI</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                <ArrowUpCircle className="w-4 h-4 text-amber-100" />
                <span>BELUM CUKUP</span>
              </span>
            )}

            <span className="text-[11px] font-bold opacity-80">
              Sasaran: {requiredCount}/{denominator}
            </span>
          </div>

          {/* Current vs Target numbers */}
          <div className="flex items-center gap-1.5 text-xs font-extrabold">
            <span
              className={`px-2 py-0.5 rounded-lg border ${
                isExact
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : isOver
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-[#3A3A30] border-[#D6CEBE]'
              }`}
            >
              Semasa: {currentCount}/{denominator}
            </span>
          </div>
        </div>

        {/* Live Feedback Guidance Text */}
        <div className="text-xs leading-relaxed font-medium">
          {isExact && (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-spin" />
              <span>
                Tahniah! Jawapan adik ({currentCount}/{denominator}) tepat dan sempurna mengikut sukatan resipi Chef Alya! Tekan butang Selesai di bawah.
              </span>
            </div>
          )}

          {isOver && (
            <div className="text-rose-800 font-semibold">
              ⚠️ <span className="font-bold">Terlebih {diff} {unitLabel}!</span> Pilihan adik ({currentCount}/{denominator}) telah melebihi sasaran resipi ({requiredCount}/{denominator}). Sila batalkan {diff} pilihan untuk kembali tepat.
            </div>
          )}

          {isUnder && currentCount > 0 && (
            <div className="text-amber-900 font-semibold">
              ⏳ <span className="font-bold">Masih belum cukup!</span> Pilihan adik baru ({currentCount}/{denominator}). Perlu tambah{' '}
              <span className="font-extrabold underline">{Math.abs(diff)} {unitLabel}</span> lagi untuk sampai ke sasaran jawapan ({requiredCount}/{denominator}).
            </div>
          )}

          {currentCount === 0 && (
            <div className="text-[#5A5A50]">
              Pilih item atau aras sukatan di bawah untuk mencapai pecahan sasaran <span className="font-bold text-[#5A5A40]">{requiredCount}/{denominator}</span>.
            </div>
          )}
        </div>

        {/* Visual Benchmark Slider Track */}
        <div className="mt-2.5 pt-2 border-t border-black/10">
          <div className="flex justify-between text-[10px] font-bold mb-1 opacity-75">
            <span>0</span>
            <span className="text-[#A67C52]">📍 Sasaran: {requiredCount}/{denominator} ({targetPercent}%)</span>
            <span>{denominator}/{denominator} (1 Penuh)</span>
          </div>

          <div className="relative h-3 bg-white/80 rounded-full border border-black/15 overflow-hidden shadow-inner">
            {/* Live Progress Bar */}
            <motion.div
              className={`h-full transition-all duration-200 ${
                isExact
                  ? 'bg-emerald-500'
                  : isOver
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${currentPercent}%` }}
            />

            {/* Target Marker Needle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#5A5A40] shadow-sm z-10"
              style={{ left: `calc(${targetPercent}% - 2px)` }}
              title={`Sasaran: ${requiredCount}/${denominator}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
