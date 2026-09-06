import React, { useState, useEffect } from 'react';
import { VisualDiagram } from '../utils/alyaAiKnowledge';
import {
  Eye,
  Maximize2,
  Sparkles,
  Info,
} from 'lucide-react';
import bulatanImg from '../assets/images/bulatan_pecahan_1788685450366.jpg';

interface FractionVisualDiagramProps {
  diagram: VisualDiagram;
}

export const FractionVisualDiagram: React.FC<FractionVisualDiagramProps> = ({ diagram }) => {
  // Total parts (denominator): clamp between 1 and 12 for DSKP circle series
  const initialDen = diagram.totalParts && diagram.totalParts >= 1 && diagram.totalParts <= 12
    ? diagram.totalParts
    : 4;

  const initialNum = diagram.shadedParts !== undefined
    ? Math.min(diagram.shadedParts, initialDen)
    : 1;

  const [totalParts, setTotalParts] = useState<number>(initialDen);
  const [shadedParts, setShadedParts] = useState<number>(initialNum);
  const [showChartModal, setShowChartModal] = useState<boolean>(false);

  // Sync state whenever the diagram prop changes
  useEffect(() => {
    const den = diagram.totalParts && diagram.totalParts >= 1 && diagram.totalParts <= 12
      ? diagram.totalParts
      : 4;
    const num = diagram.shadedParts !== undefined
      ? Math.min(diagram.shadedParts, den)
      : 1;
    setTotalParts(den);
    setShadedParts(num);
  }, [diagram]);

  // Helper to generate SVG pie slices matching the DSKP circle fraction layout (bulatan.png)
  const renderCircleSlices = (total: number, shaded: number) => {
    const radius = 46;
    const center = 50;

    // Special case: 1 whole (1/1)
    if (total === 1) {
      return (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill={shaded >= 1 ? '#10B981' : '#FFFFFF'}
          stroke="#292524"
          strokeWidth="2"
          className="cursor-pointer transition-colors"
          onClick={() => setShadedParts(shaded === 1 ? 0 : 1)}
        >
          <title>{shaded >= 1 ? '1 Penuh (1/1)' : '0/1'}</title>
        </circle>
      );
    }

    const slices = [];
    const sliceAngle = 360 / total;

    for (let i = 0; i < total; i++) {
      // Start from top (-90 degrees)
      const startDeg = -90 + i * sliceAngle;
      const endDeg = startDeg + sliceAngle;
      const midDeg = startDeg + sliceAngle / 2;

      const isShaded = i < shaded;
      // In bulatan.png, for N >= 5, the first slice is slightly detached/pulled outward for clear unit visibility
      const isPulled = i === 0 && total >= 5;
      const pullDistance = isPulled ? 6 : 0;
      const pullRad = (midDeg * Math.PI) / 180;
      const offsetX = pullDistance * Math.cos(pullRad);
      const offsetY = pullDistance * Math.sin(pullRad);

      const startRad = (startDeg * Math.PI) / 180;
      const endRad = (endDeg * Math.PI) / 180;

      const x1 = center + offsetX + radius * Math.cos(startRad);
      const y1 = center + offsetY + radius * Math.sin(startRad);
      const x2 = center + offsetX + radius * Math.cos(endRad);
      const y2 = center + offsetY + radius * Math.sin(endRad);
      const cx = center + offsetX;
      const cy = center + offsetY;

      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isShaded ? '#10B981' : '#FFFFFF'}
          stroke="#292524"
          strokeWidth="1.8"
          className="transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95"
          onClick={() => {
            // Click to toggle or set shaded count up to this slice
            if (shaded === i + 1) {
              setShadedParts(i);
            } else {
              setShadedParts(i + 1);
            }
          }}
        >
          <title>{`Bahagian ${i + 1} daripada ${total} (Nilai: 1/${total})`}</title>
        </path>
      );
    }

    return slices;
  };

  const remainingParts = Math.max(0, totalParts - shadedParts);

  return (
    <div className="my-3 bg-[#FAF7F2] border-2 border-[#A67C52]/50 rounded-2xl p-3.5 sm:p-4 shadow-xs text-[#3A3A30]">
      {/* ------------------------------------------------------------- */}
      {/* KAD ATAS: TAJUK RAJAH BULATAN PECAHAN                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#D6CEBE]">
        <div className="font-extrabold text-xs text-[#5A5A40] flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
          <span>{diagram.title || `Rajah Bulatan Pecahan: ${shadedParts}/${totalParts}`}</span>
        </div>
        <div className="inline-flex items-center gap-1 bg-[#A67C52] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <Sparkles className="w-3 h-3" />
          <span>Rajah Bulatan DSKP</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. KEDUDUKAN RAJAH DI ATAS (FOKUS UTAMA & TIDAK SERABUT)      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-[#D6CEBE] p-4 shadow-2xs flex flex-col items-center">
        {/* Visual SVG Bulatan */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 bg-[#FAF7F2] rounded-full p-2.5 border-2 border-stone-400/40 shadow-inner flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-xs">
            {renderCircleSlices(totalParts, shadedParts)}
            <circle cx="50" cy="50" r="2.8" fill="#292524" />
          </svg>
        </div>

        {/* Paparan Nombor Pecahan Besar & Kemas */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-400 px-4 py-1.5 rounded-xl shadow-2xs">
            <span className="font-mono text-xl font-black text-emerald-900 leading-none">
              {shadedParts}
            </span>
            <div className="w-10 h-0.5 bg-emerald-700 my-0.5 rounded-full"></div>
            <span className="font-mono text-xl font-black text-emerald-900 leading-none">
              {totalParts}
            </span>
          </div>

          <div className="text-left text-[11px] leading-tight text-stone-700">
            <div className="font-bold text-emerald-800">
              {shadedParts} bahagian diwarnakan (Hijau)
            </div>
            <div className="text-stone-500 text-[10px] mt-0.5">
              daripada <span className="font-bold text-stone-800">{totalParts}</span> potongan sama rata
            </div>
          </div>
        </div>

        {/* Kawalan Interaktif Pantas (Tambah / Kurang Bahagian Hijau) */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-bold text-stone-600 text-[11px]">Ubah Bahagian Hijau:</span>
          <div className="inline-flex items-center gap-2 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-300">
            <button
              type="button"
              disabled={shadedParts <= 0}
              onClick={() => setShadedParts((prev) => Math.max(0, prev - 1))}
              className="w-6 h-6 rounded-md bg-white border border-stone-300 text-stone-800 font-bold flex items-center justify-center hover:bg-stone-200 disabled:opacity-30 transition-all shadow-2xs"
              title="Kurang 1 bahagian"
            >
              -
            </button>
            <span className="font-mono font-black text-sm w-5 text-center text-emerald-900">
              {shadedParts}
            </span>
            <button
              type="button"
              disabled={shadedParts >= totalParts}
              onClick={() => setShadedParts((prev) => Math.min(totalParts, prev + 1))}
              className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-2xs"
              title="Tambah 1 bahagian"
            >
              +
            </button>
          </div>
          <span className="text-[10px] text-stone-500 italic">
            (Boleh juga klik terus pada kepingan bulatan)
          </span>
        </div>

        {/* Jalur Pilihan Penyebut 1 hingga 12 DSKP (Siri bulatan.png) */}
        <div className="mt-3.5 w-full pt-3 border-t border-stone-100 text-center">
          <span className="block text-[10px] font-bold text-stone-600 mb-1.5">
            🔍 Terokai Bulatan Pecahan Siri 1 hingga 12 Bahagian:
          </span>
          <div className="flex flex-wrap gap-1 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setTotalParts(num);
                  setShadedParts(Math.min(shadedParts, num));
                }}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                  totalParts === num
                    ? 'bg-emerald-700 text-white shadow-xs scale-105'
                    : 'bg-stone-50 border border-stone-300 text-stone-700 hover:bg-emerald-50'
                }`}
              >
                1/{num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. KEDUDUKAN PENERANGAN DI BAWAH (KEMAS, TERANG & JELAS)      */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-3 bg-white rounded-xl border border-[#D6CEBE] p-3.5 shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 pb-1 border-b border-stone-100">
          <Info className="w-4 h-4 text-[#A67C52] flex-shrink-0" />
          <span className="font-extrabold text-xs text-[#5A5A40]">
            Penerangan Konsep Rajah Bulatan:
          </span>
        </div>

        {/* 3 Mata Konsep Pokok */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          {/* Pembilang */}
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
              1. Pengangka (Atas)
            </span>
            <div className="font-extrabold text-emerald-950 text-xs mb-0.5">
              {shadedParts} Bahagian Hijau
            </div>
            <p className="text-[10px] text-stone-600 leading-normal">
              Bilangan potongan yang diambil, dipilih, atau diwarnakan.
            </p>
          </div>

          {/* Penyebut */}
          <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-300">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-700 mb-0.5">
              2. Penyebut (Bawah)
            </span>
            <div className="font-extrabold text-stone-900 text-xs mb-0.5">
              {totalParts} Potongan Sama Rata
            </div>
            <p className="text-[10px] text-stone-600 leading-normal">
              Jumlah semua kepingan yang memotong 1 bulatan secara adil.
            </p>
          </div>

          {/* Baki Pecahan */}
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-0.5">
              3. Baki Bahagian Putih
            </span>
            <div className="font-extrabold text-amber-950 text-xs mb-0.5">
              {remainingParts} / {totalParts} Keping
            </div>
            <p className="text-[10px] text-stone-600 leading-normal">
              Bahagian bulatan yang belum diambil ({totalParts} - {shadedParts} = {remainingParts}).
            </p>
          </div>
        </div>

        {/* Ayat Konklusif Pendek */}
        <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#D6CEBE]/70 text-[11px] text-stone-700 leading-relaxed">
          💡 <strong>Kesimpulan:</strong> Rajah bulatan di atas menunjukkan nilai pecahan tepat{' '}
          <strong className="text-emerald-800 font-bold">{shadedParts}/{totalParts}</strong>.
          {diagram.explanation ? ` ${diagram.explanation}` : ''}
        </div>

        {/* Butang Rujukan Carta Lengkap bulatan.png */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
          <span>Carta Rujukan DSKP (Siri 1 hingga 12 bahagian)</span>
          <button
            type="button"
            onClick={() => setShowChartModal(!showChartModal)}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#A67C52] bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{showChartModal ? 'Tutup Carta' : 'Lihat Carta Penuh'}</span>
          </button>
        </div>

        {/* Modal / Paparan Gambar Carta Rujukan bulatan.png */}
        {showChartModal && (
          <div className="mt-2 p-2 bg-stone-50 rounded-xl border border-stone-300 text-center">
            <span className="text-[10px] font-bold text-stone-700 block mb-1">
              📖 Rujukan Carta Bulatan Pecahan 1 hingga 12
            </span>
            <img
              src={bulatanImg}
              alt="Carta Lengkap Rajah Bulatan Pecahan"
              referrerPolicy="no-referrer"
              className="max-h-60 mx-auto object-contain bg-white p-1 rounded-lg border border-stone-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};
