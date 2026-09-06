import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { MathFraction } from './MathFraction';
import { playSfx } from '../utils/audio';

interface InteractiveNotaVisualProps {
  topicId: string;
  soundEnabled: boolean;
}

export const InteractiveNotaVisual: React.FC<InteractiveNotaVisualProps> = ({
  topicId,
  soundEnabled,
}) => {
  // ==========================================
  // STATE FOR TOPIC 1: APA ITU PECAHAN? (PIZZA)
  // ==========================================
  const [pizzaSlices, setPizzaSlices] = useState<boolean[]>([true, true, true, false]); // default 3 of 4
  const [topic1Tab, setTopic1Tab] = useState<'visual' | 'story' | 'quiz'>('visual');

  // ==========================================
  // STATE FOR TOPIC 2: PENGANGKA & PENYEBUT
  // ==========================================
  const [activePart, setActivePart] = useState<'pengangka' | 'penyebut' | null>('pengangka');
  const [customFraction, setCustomFraction] = useState<{ num: number; den: number }>({ num: 3, den: 5 });

  // ==========================================
  // STATE FOR TOPIC 3: PECAHAN WAJAR
  // ==========================================
  const [wajarSelection, setWajarSelection] = useState<'1/2' | '2/3' | '3/4'>('3/4');

  // ==========================================
  // STATE FOR TOPIC 4: PECAHAN SETARA
  // ==========================================
  const [showLaserGuideline, setShowLaserGuideline] = useState<boolean>(false);
  const [activeSetaraTab, setActiveSetaraTab] = useState<'bars' | 'multiplier'>('bars');

  // ==========================================
  // STATE FOR TOPIC 5: MEMBANDINGKAN PECAHAN
  // ==========================================
  const [selectedSymbol, setSelectedSymbol] = useState<'>' | '<' | '=' | null>('>');
  const [comparisonOrder, setComparisonOrder] = useState<'3/4 vs 1/2' | '1/2 vs 3/4'>('3/4 vs 1/2');

  // ==========================================
  // STATE FOR TOPIC 6: MENYUSUN PECAHAN
  // ==========================================
  const [sortOrder, setSortOrder] = useState<'menaik' | 'menurun'>('menaik');
  const [isStairAnimating, setIsStairAnimating] = useState<boolean>(false);

  // ==========================================
  // STATE FOR TOPIC 7: GARIS NOMBOR
  // ==========================================
  const [selectedPoint, setSelectedPoint] = useState<'0' | '1/4' | '1/2' | '3/4' | '1'>('1/2');

  // Helper to toggle pizza slice
  const handleToggleSlice = (index: number) => {
    playSfx('slice', soundEnabled);
    setPizzaSlices((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const selectedCount = pizzaSlices.filter(Boolean).length;

  // =========================================================================
  // RENDER PER TOPIK
  // =========================================================================

  // -------------------------------------------------------------------------
  // TOPIK 1: APA ITU PECAHAN? (3/4 Pizza Visual)
  // -------------------------------------------------------------------------
  if (topicId === 'apa-itu-pecahan') {
    return (
      <div id="interactive-topic-1" className="space-y-4">
        {/* Interactive Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setTopic1Tab('visual');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                topic1Tab === 'visual'
                  ? 'bg-[#F4C95D] text-[#4A3728] shadow-sm'
                  : 'text-[#8A624A] hover:bg-amber-100/70'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>🔍 Lihat Visual</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setTopic1Tab('story');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                topic1Tab === 'story'
                  ? 'bg-[#F4C95D] text-[#4A3728] shadow-sm'
                  : 'text-[#8A624A] hover:bg-amber-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ Cerita Pizza</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setTopic1Tab('quiz');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                topic1Tab === 'quiz'
                  ? 'bg-[#F4C95D] text-[#4A3728] shadow-sm'
                  : 'text-[#8A624A] hover:bg-amber-100/70'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>🎯 Uji Diri</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-[#8A624A] hidden sm:inline mr-1">Preset:</span>
            {[
              { label: '1/4', count: 1 },
              { label: '2/4', count: 2 },
              { label: '3/4 (Piawai)', count: 3 },
              { label: '4/4 (Penuh)', count: 4 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setPizzaSlices([
                    p.count >= 1,
                    p.count >= 2,
                    p.count >= 3,
                    p.count >= 4,
                  ]);
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCount === p.count
                    ? 'bg-[#D98262] text-white shadow-xs'
                    : 'bg-white text-[#4A3728] border border-amber-300 hover:bg-amber-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pizza Visual Box */}
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 p-4 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Interactive SVG Pizza */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full p-2 bg-[#D97D45] border-4 border-[#b95e26] shadow-xl flex items-center justify-center">
              {/* Pizza Base Crust */}
              <div className="relative w-full h-full rounded-full bg-[#fde09e] border-2 border-dashed border-[#e6a953] overflow-hidden grid grid-cols-2 grid-rows-2 gap-1 p-1">
                {/* 4 Quadrants as Clickable Interactive Slices */}
                {[0, 1, 2, 3].map((idx) => {
                  const isSelected = pizzaSlices[idx];
                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleSlice(idx)}
                      className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer font-rounded font-black text-sm select-none shadow-sm ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white ring-2 ring-orange-300 shadow-md'
                          : 'bg-[#faf0d9]/90 text-amber-900/40 hover:bg-[#fff7e6] border border-dashed border-amber-300'
                      }`}
                      title={`Kepingan ${idx + 1}: Tekan untuk ${isSelected ? 'keluarkan' : 'pilih'}`}
                    >
                      {isSelected ? (
                        <>
                          <span className="text-xl">🍕</span>
                          <span className="text-xs font-bold text-amber-100 mt-0.5">Keping {idx + 1}</span>
                          <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full mt-0.5">Dipilih</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold">Keping {idx + 1}</span>
                          <span className="text-[10px] text-amber-700/60 font-medium">(Kosong)</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <span className="mt-2 text-[11px] font-bold text-[#8A624A]">
              💡 Tekan mana-mana kepingan pizza di atas untuk pilih/buang!
            </span>
          </div>

          {/* Mathematical Card & Explanation */}
          <div className="flex-1 max-w-sm space-y-3">
            {/* Live Fraction Display */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#F4C95D] shadow-xs flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#8A624A] block">
                  Nilai Pecahan Semasa
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MathFraction num={selectedCount} den={4} size="xl" lineColor="border-[#4A3728]" />
                  <span className="text-xs font-extrabold text-[#4A3728]">
                    {selectedCount === 0 && 'Sifar per empat'}
                    {selectedCount === 1 && 'Satu per empat (Suku)'}
                    {selectedCount === 2 && 'Dua per empat (Separuh)'}
                    {selectedCount === 3 && 'Tiga per empat'}
                    {selectedCount === 4 && 'Empat per empat (Satu penuh!)'}
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
                🍕
              </div>
            </div>

            {/* Clear Explanation Sentence */}
            <div className="p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 space-y-1.5 text-xs text-[#4A3728] font-medium">
              <div className="font-rounded font-black text-sm text-[#4A3728] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Penerangan Visual:</span>
              </div>
              <p className="leading-relaxed">
                <strong className="text-orange-700 text-sm font-black">{selectedCount}</strong> daripada{' '}
                <strong className="text-[#4A3728] text-sm font-black">4</strong> bahagian dipilih.
              </p>
              <p className="text-[11px] text-[#6B5A4E]">
                {4 - selectedCount === 0 
                  ? 'Semua 4 bahagian telah dipilih (bersamaan 1 pizza utuh)!'
                  : `Baki tinggal ${4 - selectedCount} bahagian yang belum dipilih.`}
              </p>
            </div>

            {/* Fraction Bar Representation for Topic 1 */}
            <div className="bg-white p-3 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold text-[#8A624A] uppercase block mb-1.5">
                Bentuk Jalur Pecahan (Fraction Bar):
              </span>
              <div className="grid grid-cols-4 h-7 rounded-xl overflow-hidden border-2 border-amber-400 bg-gray-100 text-xs font-bold text-center">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center border-r border-amber-300 last:border-r-0 transition-colors ${
                      i < selectedCount
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white font-black'
                        : 'bg-gray-100 text-gray-400 font-medium'
                    }`}
                  >
                    1/4
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 2: PENGANGKA DAN PENYEBUT (3 / 5 Fraction Card)
  // -------------------------------------------------------------------------
  if (topicId === 'pengangka-dan-penyebut') {
    const num = customFraction.num;
    const den = customFraction.den;

    return (
      <div id="interactive-topic-2" className="space-y-4">
        {/* Interactive Mode Picker */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A3728]">Tekan untuk Teroka:</span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setActivePart('pengangka');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePart === 'pengangka'
                  ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-300'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <span>⬆️ PENGANGKA (Nombor Atas)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setActivePart('penyebut');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePart === 'penyebut'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <span>⬇️ PENYEBUT (Nombor Bawah)</span>
            </button>
          </div>

          {/* Quick Example Switcher */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-[#8A624A] mr-1">Contoh:</span>
            {[
              { num: 3, den: 5, label: '3/5 (Piawai)' },
              { num: 2, den: 4, label: '2/4' },
              { num: 4, den: 6, label: '4/6' },
            ].map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => {
                  playSfx('pop', soundEnabled);
                  setCustomFraction({ num: f.num, den: f.den });
                }}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  customFraction.num === f.num && customFraction.den === f.den
                    ? 'bg-[#4A3728] text-amber-200 shadow-xs'
                    : 'bg-white text-[#4A3728] border border-amber-300 hover:bg-amber-100'
                }`}
              >
                {f.num}/{f.den}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Stage */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/60 p-4 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Big Stacked Fraction Card with Clickable Parts */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-5 sm:p-7 rounded-3xl border-3 border-amber-400 shadow-lg flex flex-col items-center min-w-[170px] relative">
              {/* Pengangka Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={activePart === 'pengangka' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  playSfx('correct', soundEnabled);
                  setActivePart('pengangka');
                }}
                className={`px-6 py-2.5 rounded-2xl font-rounded font-black text-4xl sm:text-5xl transition-all cursor-pointer ${
                  activePart === 'pengangka'
                    ? 'bg-rose-500 text-white shadow-md ring-4 ring-rose-200'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-300'
                }`}
              >
                {num}
              </motion.button>

              {/* Fraction Divider Line */}
              <div className="w-32 border-b-6 border-[#4A3728] my-3 rounded-full" />

              {/* Penyebut Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={activePart === 'penyebut' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  playSfx('correct', soundEnabled);
                  setActivePart('penyebut');
                }}
                className={`px-6 py-2.5 rounded-2xl font-rounded font-black text-4xl sm:text-5xl transition-all cursor-pointer ${
                  activePart === 'penyebut'
                    ? 'bg-amber-600 text-white shadow-md ring-4 ring-amber-200'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-2 border-amber-300'
                }`}
              >
                {den}
              </motion.button>
            </div>
            <span className="text-[11px] font-bold text-[#8A624A] mt-2">
              👆 Tekan nombor {num} atau {den} di atas!
            </span>
          </div>

          {/* Dynamic Explanatory Panel */}
          <div className="flex-1 max-w-sm space-y-3">
            {/* Active Label Card */}
            <div className={`p-4 rounded-2xl border-2 transition-all shadow-xs ${
              activePart === 'pengangka'
                ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase ${
                  activePart === 'pengangka' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                }`}>
                  {activePart === 'pengangka' ? '⬆️ PENGANGKA' : '⬇️ PENYEBUT'}
                </span>
                <span className="text-xs font-bold text-[#4A3728]">
                  Nombor: {activePart === 'pengangka' ? num : den}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {activePart === 'pengangka'
                  ? 'Pengangka menunjukkan bilangan bahagian yang diambil, dimakan, atau diwarnakan.'
                  : 'Penyebut menunjukkan jumlah SEMUA bahagian yang sama besar dalam satu objek utuh.'}
              </p>
            </div>

            {/* Visual Fraction Bar with Compartments */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
                <span>Visual {num} daripada {den} bahagian:</span>
                <span className="text-[11px] text-[#8A624A] font-semibold">
                  {activePart === 'pengangka' ? `${num} petak berwarna` : `Jumlah ${den} petak sama saiz`}
                </span>
              </div>

              <div 
                className="grid h-10 rounded-xl overflow-hidden border-2 border-amber-400 bg-gray-100 shadow-inner"
                style={{ gridTemplateColumns: `repeat(${den}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: den }).map((_, idx) => {
                  const isTaken = idx < num;
                  const isHighlighted = 
                    (activePart === 'pengangka' && isTaken) || 
                    activePart === 'penyebut';

                  return (
                    <motion.div
                      key={idx}
                      animate={isHighlighted ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className={`flex items-center justify-center border-r border-amber-300 last:border-r-0 text-xs font-bold transition-all ${
                        isTaken
                          ? activePart === 'pengangka'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-[#8A624A] pt-1">
                <span>🔴 {num} Petak Diambil (Pengangka)</span>
                <span>⚪ {den} Jumlah Semua Petak (Penyebut)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 3: PECAHAN WAJAR (1/2, 2/3, 3/4)
  // -------------------------------------------------------------------------
  if (topicId === 'pecahan-wajar') {
    const wajarConfig = {
      '1/2': { num: 1, den: 2, name: 'Satu per dua (Separuh)', realLife: 'Separuh pizza enak', realIcon: '🍕' },
      '2/3': { num: 2, den: 3, name: 'Dua per tiga', realLife: '2 keping daripada 3 keping wafel', realIcon: '🧇' },
      '3/4': { num: 3, den: 4, name: 'Tiga per empat', realLife: '3 daripada 4 keping kek coklat', realIcon: '🎂' },
    }[wajarSelection];

    return (
      <div id="interactive-topic-3" className="space-y-4">
        {/* Selector Tabs for 1/2, 2/3, 3/4 */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs font-bold text-[#4A3728] mr-1">Pilih Contoh:</span>
            {(['1/2', '2/3', '3/4'] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setWajarSelection(choice);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer ${
                  wajarSelection === choice
                    ? 'bg-[#D98262] text-white shadow-sm ring-2 ring-orange-200'
                    : 'bg-white text-[#4A3728] border border-amber-300 hover:bg-amber-100'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Pengangka &lt; Penyebut
          </span>
        </div>

        {/* Visual Comparison Card */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-emerald-50/50 p-4 sm:p-6 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-4">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <MathFraction num={wajarConfig.num} den={wajarConfig.den} size="xl" lineColor="border-emerald-800" />
              <div>
                <h5 className="font-rounded font-extrabold text-base text-[#4A3728]">
                  {wajarConfig.name}
                </h5>
                <p className="text-xs text-emerald-900 font-bold">
                  Nombor Atas ({wajarConfig.num}) LEBIH KECIL daripada Nombor Bawah ({wajarConfig.den})
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-extrabold text-emerald-800 shadow-2xs">
              Nilai &lt; 1 Objek Penuh ⭐
            </div>
          </div>

          {/* Visual Fraction Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
              <span>Fraction Bar ({wajarConfig.num} daripada {wajarConfig.den} bahagian berwarna):</span>
              <span className="text-emerald-700 font-bold">
                {Math.round((wajarConfig.num / wajarConfig.den) * 100)}% daripada keseluruhan
              </span>
            </div>
            <div 
              className="grid h-10 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-gray-100 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${wajarConfig.den}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: wajarConfig.den }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center border-r border-emerald-300 last:border-r-0 text-xs font-bold transition-all ${
                    i < wajarConfig.num
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < wajarConfig.num ? `1/${wajarConfig.den} (Diambil)` : `1/${wajarConfig.den}`}
                </div>
              ))}
            </div>
          </div>

          {/* Real-Life Visual Example Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
              <span className="text-3xl">{wajarConfig.realIcon}</span>
              <div>
                <strong className="text-xs font-rounded font-extrabold text-[#4A3728] block">
                  {wajarConfig.realLife}
                </strong>
                <p className="text-[11px] text-[#8A624A] mt-0.5">
                  Belum cukup 1 objek penuh kerana ada bahagian baki yang belum diambil!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#F6C7A8] flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <div className="text-xs text-[#4A3728]">
                <strong className="block font-bold">Uji Minda:</strong>
                <span>Adakah 4/3 pecahan wajar? <strong>Bukan</strong>, kerana nombor atas (4) lebih besar daripada bawah (3)!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 4: PECAHAN SETARA (1/2 = 2/4 = 3/6)
  // -------------------------------------------------------------------------
  if (topicId === 'pecahan-setara') {
    return (
      <div id="interactive-topic-4" className="space-y-4">
        {/* Top Control Bar with "Lihat Hubungan" Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <button
              id="btn-lihat-hubungan-setara"
              type="button"
              onClick={() => {
                playSfx('chime', soundEnabled);
                setShowLaserGuideline((prev) => !prev);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-rounded font-black transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                showLaserGuideline
                  ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                  : 'bg-gradient-to-r from-[#F4C95D] to-[#D98262] text-[#4A3728] hover:brightness-105'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{showLaserGuideline ? '🔎 Garisan Hubungan Aktif!' : '🔎 Lihat Hubungan'}</span>
            </button>

            <span className="text-[11px] text-[#8A624A] font-semibold hidden sm:inline">
              Tekan untuk lihat garisan penjajaran tegak!
            </span>
          </div>

          <span className="text-xs font-extrabold text-[#4A3728] bg-white px-2.5 py-1 rounded-xl border border-amber-300">
            1/2 = 2/4 = 3/6 ⭐
          </span>
        </div>

        {/* Stacked Fraction Bars with Equal Total Width & Vertical Alignment */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/60 p-4 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden space-y-4">
          <p className="text-xs sm:text-sm font-rounded font-extrabold text-[#4A3728] text-center bg-amber-100/70 py-1.5 px-3 rounded-xl border border-amber-300">
            Pecahan berbeza tetapi mempunyai nilai yang sama.
          </p>

          {/* Interactive Stack of Bars */}
          <div className="relative space-y-3.5 py-2">
            {/* LASER GUIDELINE (Shows perfectly aligned 50% line across all bars) */}
            <AnimatePresence>
              {showLaserGuideline && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 bottom-0 left-[calc(4.5rem+50%*0.75)] sm:left-[calc(5rem+50%*0.8)] w-1 bg-rose-500 z-20 shadow-[0_0_12px_rgba(244,63,94,0.9)] flex flex-col items-center justify-between"
                  style={{ left: 'calc(68px + (100% - 68px) * 0.5)' }}
                >
                  <div className="w-3 h-3 rounded-full bg-rose-600 -top-1 absolute" />
                  <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full absolute -top-5 whitespace-nowrap shadow-xs">
                    Sama Panjang (50%)!
                  </span>
                  <div className="w-3 h-3 rounded-full bg-rose-600 -bottom-1 absolute" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* BAR 1: 1/2 */}
            <div className="flex items-center gap-3">
              <div className="w-16 sm:w-20 text-xs sm:text-sm font-extrabold text-[#4A3728] flex items-center gap-1.5 shrink-0">
                <MathFraction num={1} den={2} size="sm" />
                <span>=</span>
              </div>
              <div className="flex-1 grid grid-cols-2 h-9 sm:h-10 rounded-xl overflow-hidden border-2 border-emerald-500 bg-gray-100 text-xs font-bold shadow-xs">
                <div className="bg-emerald-500 text-white flex items-center justify-center font-black">
                  1/2 (Separuh)
                </div>
                <div className="bg-gray-100 text-gray-400 flex items-center justify-center text-[10px]">
                  Kosong
                </div>
              </div>
            </div>

            {/* BAR 2: 2/4 */}
            <div className="flex items-center gap-3">
              <div className="w-16 sm:w-20 text-xs sm:text-sm font-extrabold text-[#4A3728] flex items-center gap-1.5 shrink-0">
                <MathFraction num={2} den={4} size="sm" />
                <span>=</span>
              </div>
              <div className="flex-1 grid grid-cols-4 h-9 sm:h-10 rounded-xl overflow-hidden border-2 border-amber-500 bg-gray-100 text-xs font-bold shadow-xs">
                <div className="bg-amber-500 text-white flex items-center justify-center border-r border-amber-300 font-black">
                  1/4
                </div>
                <div className="bg-amber-500 text-white flex items-center justify-center font-black">
                  2/4
                </div>
                <div className="bg-gray-100 border-r border-gray-200" />
                <div className="bg-gray-100" />
              </div>
            </div>

            {/* BAR 3: 3/6 */}
            <div className="flex items-center gap-3">
              <div className="w-16 sm:w-20 text-xs sm:text-sm font-extrabold text-[#4A3728] flex items-center gap-1.5 shrink-0">
                <MathFraction num={3} den={6} size="sm" />
                <span>=</span>
              </div>
              <div className="flex-1 grid grid-cols-6 h-9 sm:h-10 rounded-xl overflow-hidden border-2 border-purple-500 bg-gray-100 text-xs font-bold shadow-xs">
                <div className="bg-purple-500 text-white flex items-center justify-center border-r border-purple-300 font-black text-[10px]">1/6</div>
                <div className="bg-purple-500 text-white flex items-center justify-center border-r border-purple-300 font-black text-[10px]">2/6</div>
                <div className="bg-purple-500 text-white flex items-center justify-center font-black text-[10px]">3/6</div>
                <div className="bg-gray-100 border-r border-gray-200" />
                <div className="bg-gray-100 border-r border-gray-200" />
                <div className="bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Mathematical Multiplier Proof Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-[#4A3728] space-y-1.5">
            <strong className="font-rounded font-extrabold block text-amber-900">
              Bagaimana Mendapatkan Pecahan Setara?
            </strong>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="bg-white px-2 py-1 rounded-lg border border-amber-300">
                1/2 × (2/2) = <strong>2/4</strong>
              </span>
              <span className="bg-white px-2 py-1 rounded-lg border border-amber-300">
                1/2 × (3/3) = <strong>3/6</strong>
              </span>
              <span className="bg-white px-2 py-1 rounded-lg border border-amber-300">
                1/2 × (4/4) = <strong>4/8</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 5: MEMBANDINGKAN PECAHAN (1/2 vs 3/4 & Symbols >, <, =)
  // -------------------------------------------------------------------------
  if (topicId === 'membandingkan-pecahan') {
    const is34first = comparisonOrder === '3/4 vs 1/2';

    return (
      <div id="interactive-topic-5" className="space-y-4">
        {/* Switch comparison order */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A3728]">Bandingkan:</span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setComparisonOrder('3/4 vs 1/2');
                setSelectedSymbol('>');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer ${
                is34first
                  ? 'bg-[#D98262] text-white shadow-xs'
                  : 'bg-white text-[#4A3728] border border-amber-300'
              }`}
            >
              3/4 dengan 1/2
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setComparisonOrder('1/2 vs 3/4');
                setSelectedSymbol('<');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer ${
                !is34first
                  ? 'bg-[#D98262] text-white shadow-xs'
                  : 'bg-white text-[#4A3728] border border-amber-300'
              }`}
            >
              1/2 dengan 3/4
            </button>
          </div>

          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
            {is34first ? '3/4 > 1/2' : '1/2 < 3/4'}
          </span>
        </div>

        {/* Visual Fraction Bars Side-by-side comparison */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/60 p-4 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
          <div className="space-y-3">
            {/* First Fraction Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
                <span>{is34first ? 'Jalur 3/4 (Tiga per empat):' : 'Jalur 1/2 (Separuh):'}</span>
                <span className={is34first ? 'text-amber-800 font-black' : 'text-emerald-800 font-black'}>
                  {is34first ? '75% Panjang (LEBIH PANJANG)' : '50% Panjang'}
                </span>
              </div>
              <div className={`grid ${is34first ? 'grid-cols-4' : 'grid-cols-2'} h-9 rounded-xl overflow-hidden border-2 ${is34first ? 'border-amber-500' : 'border-emerald-500'} bg-gray-100 shadow-xs`}>
                {is34first ? (
                  <>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center border-r border-amber-300">1/4</div>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center border-r border-amber-300">2/4</div>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center font-bold">3/4</div>
                    <div className="bg-gray-100 text-gray-400 text-xs flex items-center justify-center">Kosong</div>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">1/2 (50%)</div>
                    <div className="bg-gray-100 text-gray-400 text-xs flex items-center justify-center">Kosong</div>
                  </>
                )}
              </div>
            </div>

            {/* Second Fraction Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#4A3728]">
                <span>{!is34first ? 'Jalur 3/4 (Tiga per empat):' : 'Jalur 1/2 (Separuh):'}</span>
                <span className={!is34first ? 'text-amber-800 font-black' : 'text-emerald-800 font-black'}>
                  {!is34first ? '75% Panjang (LEBIH PANJANG)' : '50% Panjang (LEBIH PENDEK)'}
                </span>
              </div>
              <div className={`grid ${!is34first ? 'grid-cols-4' : 'grid-cols-2'} h-9 rounded-xl overflow-hidden border-2 ${!is34first ? 'border-amber-500' : 'border-emerald-500'} bg-gray-100 shadow-xs`}>
                {!is34first ? (
                  <>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center border-r border-amber-300">1/4</div>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center border-r border-amber-300">2/4</div>
                    <div className="bg-amber-500 text-white font-bold text-xs flex items-center justify-center font-bold">3/4</div>
                    <div className="bg-gray-100 text-gray-400 text-xs flex items-center justify-center">Kosong</div>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">1/2 (50%)</div>
                    <div className="bg-gray-100 text-gray-400 text-xs flex items-center justify-center">Kosong</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Symbol Selector Buttons: >, <, = */}
          <div className="pt-2 border-t border-amber-200 space-y-2">
            <span className="text-xs font-rounded font-extrabold text-[#4A3728] block">
              Pilih Simbol Yang Betul Untuk Melihat Penerangan:
            </span>

            <div className="flex items-center justify-center gap-4 py-1">
              {(['>', '<', '='] as const).map((sym) => {
                const isCorrect = (is34first && sym === '>') || (!is34first && sym === '<');
                const isSelected = selectedSymbol === sym;

                return (
                  <motion.button
                    key={sym}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (isCorrect) playSfx('correct', soundEnabled);
                      else playSfx('wrong', soundEnabled);
                      setSelectedSymbol(sym);
                    }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-rounded font-black text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-200'
                          : 'bg-rose-500 text-white ring-4 ring-rose-200'
                        : 'bg-white text-[#4A3728] border-2 border-amber-300 hover:bg-amber-100'
                    }`}
                  >
                    {sym}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanatory Message based on Selected Symbol */}
            {selectedSymbol && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-rounded font-bold leading-relaxed ${
                  (is34first && selectedSymbol === '>') || (!is34first && selectedSymbol === '<')
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {selectedSymbol === '>' && is34first && (
                  <span>
                    🎉 <strong>BETUL SEKALI!</strong> 3/4 &gt; 1/2 (Tiga per empat <strong>LEBIH BESAR</strong> daripada satu per dua). Bar 3/4 lebih panjang daripada bar 1/2!
                  </span>
                )}
                {selectedSymbol === '>' && !is34first && (
                  <span>
                    ❌ <strong>Kurang tepat.</strong> Bar 1/2 lebih pendek daripada 3/4, jadi 1/2 adalah LEBIH KECIL (&lt;), bukan lebih besar!
                  </span>
                )}
                {selectedSymbol === '<' && !is34first && (
                  <span>
                    🎉 <strong>BETUL SEKALI!</strong> 1/2 &lt; 3/4 (Satu per dua <strong>LEBIH KECIL</strong> daripada tiga per empat). Bar 1/2 lebih pendek daripada bar 3/4!
                  </span>
                )}
                {selectedSymbol === '<' && is34first && (
                  <span>
                    ❌ <strong>Kurang tepat.</strong> Bar 3/4 lebih panjang daripada 1/2, jadi 3/4 adalah LEBIH BESAR (&gt;), bukan lebih kecil!
                  </span>
                )}
                {selectedSymbol === '=' && (
                  <span>
                    ❌ <strong>Tidak sama.</strong> Bar 3/4 dan 1/2 mempunyai panjang yang berbeza (75% berbanding 50%). Jadi nilainya tidak sama!
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 6: MENYUSUN PECAHAN (1/4, 1/2, 3/4)
  // -------------------------------------------------------------------------
  if (topicId === 'menyusun-pecahan') {
    const isMenaik = sortOrder === 'menaik';
    const items = isMenaik
      ? [
          { num: 1, den: 4, pct: 25, label: '1/4 (Paling Kecil)' },
          { num: 1, den: 2, pct: 50, label: '1/2 (2/4 - Sederhana)' },
          { num: 3, den: 4, pct: 75, label: '3/4 (Paling Besar)' },
        ]
      : [
          { num: 3, den: 4, pct: 75, label: '3/4 (Paling Besar)' },
          { num: 1, den: 2, pct: 50, label: '1/2 (2/4 - Sederhana)' },
          { num: 1, den: 4, pct: 25, label: '1/4 (Paling Kecil)' },
        ];

    const handleStairAnimation = () => {
      playSfx('fanfare', soundEnabled);
      setIsStairAnimating(true);
      setTimeout(() => setIsStairAnimating(false), 2500);
    };

    return (
      <div id="interactive-topic-6" className="space-y-4">
        {/* Toggle Order Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A3728]">Susun Ikut:</span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setSortOrder('menaik');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isMenaik
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white text-[#4A3728] border border-amber-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tertib MENAIK (Kecil ➔ Besar)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setSortOrder('menurun');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-rounded font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isMenaik
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-[#4A3728] border border-amber-300'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Tertib MENURUN (Besar ➔ Kecil)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleStairAnimation}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F4C95D] to-[#D98262] text-[#4A3728] text-xs font-rounded font-bold flex items-center gap-1 shadow-xs cursor-pointer hover:brightness-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isStairAnimating ? 'Menaiki Tangga...' : 'Animasi Tangga'}</span>
          </button>
        </div>

        {/* Animated Fraction Bars Staircase */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/60 p-4 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
          <div className="p-3 bg-amber-100/70 rounded-2xl border border-amber-200 text-xs text-[#4A3728] flex items-center justify-between">
            <span className="font-bold">
              Arahan: {isMenaik ? 'Susun daripada paling KECIL kepada paling BESAR.' : 'Susun daripada paling BESAR kepada paling KECIL.'}
            </span>
            <span className="font-mono font-black text-xs text-[#D98262]">
              {isMenaik ? '1/4 ➔ 1/2 ➔ 3/4' : '3/4 ➔ 1/2 ➔ 1/4'}
            </span>
          </div>

          {/* Render 3 items with distinct bar lengths */}
          <div className="space-y-3 py-1">
            {items.map((item, idx) => (
              <motion.div
                key={`${sortOrder}-${item.num}-${item.den}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 sm:w-12 h-10 rounded-xl bg-white border border-amber-300 flex items-center justify-center font-bold text-xs text-[#4A3728] shadow-2xs shrink-0">
                  #{idx + 1}
                </div>

                <div className="w-14 sm:w-16 font-extrabold text-xs text-[#4A3728] shrink-0">
                  <MathFraction num={item.num} den={item.den} size="sm" />
                </div>

                {/* Bar Width Container */}
                <div className="flex-1 h-9 rounded-xl bg-gray-100 border-2 border-amber-400 overflow-hidden relative shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`h-full flex items-center justify-center text-white text-xs font-black shadow-xs ${
                      idx === 0 && isMenaik
                        ? 'bg-amber-400 text-amber-900'
                        : idx === 1
                        ? 'bg-amber-500'
                        : 'bg-orange-600'
                    }`}
                  >
                    <span className="truncate px-2">{item.label}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-xs font-bold text-[#8A624A] pt-1">
            {isMenaik 
              ? '🪜 Seperti menaiki tangga: Jalur menjadi semakin panjang dari atas ke bawah!'
              : '🪜 Seperti menuruni tangga: Jalur menjadi semakin pendek dari atas ke bawah!'}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // TOPIK 7: GARIS NOMBOR (0 ── 1/4 ── 1/2 ── 3/4 ── 1)
  // -------------------------------------------------------------------------
  if (topicId === 'garis-nombor') {
    const pointConfig = {
      '0': { num: 0, den: 4, pct: 0, text: 'Ini ialah 0 (Sifar)', desc: 'Belum ada sebarang bahagian yang diambil.', barLabel: '0/4 (Kosong)' },
      '1/4': { num: 1, den: 4, pct: 25, text: 'Ini ialah 1/4 (Satu per empat / Suku)', desc: 'Satu bahagian daripada 4 bahagian sama panjang.', barLabel: '1/4 (25%)' },
      '1/2': { num: 2, den: 4, pct: 50, text: 'Ini ialah 1/2 (Satu per dua / Separuh)', desc: 'Tepat di tengah-tengah antara 0 dan 1! Bersamaan 2/4.', barLabel: '1/2 = 2/4 (50%)' },
      '3/4': { num: 3, den: 4, pct: 75, text: 'Ini ialah 3/4 (Tiga per empat)', desc: 'Tiga bahagian daripada 4 bahagian sama panjang.', barLabel: '3/4 (75%)' },
      '1': { num: 4, den: 4, pct: 100, text: 'Ini ialah 1 (Satu Objek Penuh / 4/4)', desc: 'Keseluruhan bahagian lengkap diambil!', barLabel: '4/4 = 1 Penuh (100%)' },
    }[selectedPoint];

    return (
      <div id="interactive-topic-7" className="space-y-4">
        {/* Instruction Prompt */}
        <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <span className="text-xs font-bold text-[#4A3728]">
            👆 Tekan mana-mana titik pada garis nombor di bawah:
          </span>
          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Titik Aktif: {selectedPoint}
          </span>
        </div>

        {/* Number Line Visual Stage */}
        <div className="bg-gradient-to-br from-white via-[#FFFDF9] to-amber-50/60 p-4 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-sm space-y-6">
          {/* Interactive Number Line */}
          <div className="relative pt-6 pb-8 px-4 sm:px-8 select-none">
            {/* Horizontal Line Bar */}
            <div className="relative h-3 bg-[#4A3728] rounded-full">
              {/* Highlighted Progress line up to active point */}
              <motion.div
                initial={false}
                animate={{ width: `${pointConfig.pct}%` }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />

              {/* Point Nodes */}
              {[
                { key: '0', label: '0', left: '0%' },
                { key: '1/4', label: '1/4', left: '25%' },
                { key: '1/2', label: '1/2', left: '50%' },
                { key: '3/4', label: '3/4', left: '75%' },
                { key: '1', label: '1', left: '100%' },
              ].map((pt) => {
                const isCurrent = selectedPoint === pt.key;

                return (
                  <div
                    key={pt.key}
                    className="absolute -top-3.5 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                    style={{ left: pt.left }}
                    onClick={() => {
                      playSfx('pop', soundEnabled);
                      setSelectedPoint(pt.key as any);
                    }}
                  >
                    {/* Node Circle */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isCurrent ? { scale: [1, 1.3, 1.15] } : { scale: 1 }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-rounded font-black text-xs transition-all shadow-md cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-500 text-white ring-4 ring-rose-200 shadow-lg'
                          : 'bg-white text-[#4A3728] border-3 border-[#4A3728] hover:bg-amber-100'
                      }`}
                    >
                      {pt.key === '0' || pt.key === '1' ? pt.label : '•'}
                    </motion.button>

                    {/* Node Fraction Label Below */}
                    <div className="mt-2 text-center">
                      <span className={`text-xs font-rounded font-extrabold block ${
                        isCurrent ? 'text-rose-600 font-black scale-110' : 'text-[#4A3728]'
                      }`}>
                        {pt.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matching Fraction Bar & Explanation For Selected Point */}
          <motion.div
            key={selectedPoint}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white border-2 border-[#F4C95D] shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <h5 className="font-rounded font-extrabold text-sm sm:text-base text-[#4A3728]">
                  {pointConfig.text}
                </h5>
              </div>
              <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Jarak: {pointConfig.pct}% daripada garisan penuh
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5A4E] font-medium leading-relaxed">
              {pointConfig.desc}
            </p>

            {/* Fraction Bar Corresponding to Point */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A624A] uppercase block">
                Visual Fraction Bar yang Sepadan:
              </span>
              <div className="grid grid-cols-4 h-8 rounded-xl overflow-hidden border-2 border-amber-400 bg-gray-100 text-xs font-bold text-center">
                {[0, 1, 2, 3].map((i) => {
                  const isFilled = i < pointConfig.num;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center border-r border-amber-300 last:border-r-0 transition-colors ${
                        isFilled
                          ? 'bg-rose-500 text-white font-black'
                          : 'bg-gray-100 text-gray-400 font-medium'
                      }`}
                    >
                      1/4
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};
