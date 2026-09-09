import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { LaunchableActivityInfo } from '../types/intervention';
import { playSfx } from '../utils/audio';

interface InteractiveActivityPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: LaunchableActivityInfo;
  studentName: string;
  soundEnabled?: boolean;
  onLaunchFullGame?: (route: 'arena' | 'dapur' | 'pixel', challengeId?: string) => void;
}

export const InteractiveActivityPlayerModal: React.FC<InteractiveActivityPlayerModalProps> = ({
  isOpen,
  onClose,
  activity,
  studentName,
  soundEnabled = true,
  onLaunchFullGame,
}) => {
  // Interactive state depending on previewType
  const [percentageValue, setPercentageValue] = useState<number>(25); // for 100-grid
  const [selectedEquivalent, setSelectedEquivalent] = useState<string>('2/4'); // for equivalent bars
  const [subtractionCut, setSubtractionCut] = useState<number>(2); // for subtraction 5/8 - cut
  const [additionAdded, setAdditionAdded] = useState<number>(3); // for addition 2/7 + added
  const [simplificationStep, setSimplificationStep] = useState<number>(2); // 4/8 -> 2/4 -> 1/2
  const [speechBubble, setSpeechBubble] = useState<string>(
    'Cuba gerakkan kawalan interaktif ini untuk melihat konsep pecahan secara visual dan manipulatif!'
  );

  if (!isOpen) return null;

  const handleEquivalentSelect = (frac: string) => {
    setSelectedEquivalent(frac);
    playSfx('click', soundEnabled);
    if (frac === '2/4' || frac === '3/6' || frac === '4/8') {
      setSpeechBubble(`Hebat! 1/2 bersamaan dengan ${frac}. Panjang jalur adalah sama tepat!`);
      playSfx('correct', soundEnabled);
    } else {
      setSpeechBubble(`Perhatikan panjang jalur. Adakah ia sama panjang dengan 1/2?`);
    }
  };

  const handlePercentageChange = (val: number) => {
    setPercentageValue(val);
    setSpeechBubble(`${val} petak daripada 100 petak = ${val}/100 = ${val}%!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-5 sm:p-7 border-4 border-[#F4C95D] shadow-2xl max-w-2xl w-full my-auto space-y-4 max-h-[92vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b-2 border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                🎮
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-title text-base sm:text-lg font-black text-[#4A3728]">
                    {activity.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                    DSKP {activity.dskpCode}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-medium">
                  Aktiviti Intervensi Interaktif Disyorkan untuk <strong>{studentName}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alya's Interactive Coaching Bubble */}
          <div className="bg-amber-50 p-3 rounded-2xl border-2 border-amber-200 flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
              🤖
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-900 block">
                Bimbingan Alya:
              </span>
              <p className="text-xs text-stone-800 font-medium leading-relaxed">
                "{speechBubble}"
              </p>
            </div>
          </div>

          {/* Interactive Playground based on previewType */}
          <div className="bg-white p-4.5 rounded-2xl border-2 border-stone-200 shadow-2xs space-y-4">
            {/* TYPE 1: Equivalent Bars (Padankan Pecahan Setara - 3.1.2) */}
            {activity.previewType === 'equivalent_bars' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-700 block">
                    Jalur Rujukan: <strong>1/2 (Satu Per Dua)</strong>
                  </span>
                  <div className="w-full h-8 bg-stone-100 rounded-xl overflow-hidden flex border-2 border-blue-300">
                    <div className="w-1/2 h-full bg-blue-500 text-white font-black text-xs flex items-center justify-center">
                      1/2
                    </div>
                    <div className="w-1/2 h-full bg-stone-100 text-stone-400 font-bold text-xs flex items-center justify-center">
                      1/2
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-700 block">
                    Pilih Jalur Setara untuk Dipadankan:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {['2/4', '3/6', '4/8', '2/6'].map((frac) => (
                      <button
                        key={frac}
                        type="button"
                        onClick={() => handleEquivalentSelect(frac)}
                        className={`p-2 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                          selectedEquivalent === frac
                            ? 'bg-blue-600 text-white border-blue-700 shadow-xs scale-105 ring-2 ring-blue-300'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {frac}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Selected Equivalent Visual Bar */}
                <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-600 block">
                    Jalur Pecahan {selectedEquivalent}:
                  </span>
                  <div className="w-full h-8 bg-white rounded-xl overflow-hidden flex border-2 border-indigo-300">
                    {selectedEquivalent === '2/4' && (
                      <>
                        <div className="w-1/4 h-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border-r border-indigo-400">1/4</div>
                        <div className="w-1/4 h-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border-r border-indigo-400">1/4</div>
                        <div className="w-1/4 h-full bg-stone-100 text-stone-400 text-[10px] flex items-center justify-center border-r border-stone-200">1/4</div>
                        <div className="w-1/4 h-full bg-stone-100 text-stone-400 text-[10px] flex items-center justify-center">1/4</div>
                      </>
                    )}
                    {selectedEquivalent === '3/6' && (
                      <>
                        <div className="w-1/6 h-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center border-r border-indigo-400">1/6</div>
                        <div className="w-1/6 h-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center border-r border-indigo-400">1/6</div>
                        <div className="w-1/6 h-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center border-r border-indigo-400">1/6</div>
                        <div className="w-1/6 h-full bg-stone-100 text-stone-400 text-[9px] flex items-center justify-center border-r border-stone-200">1/6</div>
                        <div className="w-1/6 h-full bg-stone-100 text-stone-400 text-[9px] flex items-center justify-center border-r border-stone-200">1/6</div>
                        <div className="w-1/6 h-full bg-stone-100 text-stone-400 text-[9px] flex items-center justify-center">1/6</div>
                      </>
                    )}
                    {selectedEquivalent === '4/8' && (
                      <>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-[12.5%] h-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center border-r border-indigo-400">1/8</div>
                        ))}
                        {[5, 6, 7, 8].map((i) => (
                          <div key={i} className="w-[12.5%] h-full bg-stone-100 text-stone-400 text-[8px] flex items-center justify-center border-r border-stone-200">1/8</div>
                        ))}
                      </>
                    )}
                    {selectedEquivalent === '2/6' && (
                      <>
                        <div className="w-1/6 h-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-r border-rose-400">1/6</div>
                        <div className="w-1/6 h-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-r border-rose-400">1/6</div>
                        <div className="w-4/6 h-full bg-stone-100 text-stone-400 text-[9px] flex items-center justify-center">Bukan 1/2</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 2: Percentage Grid (Grid 100 Petak - 3.1.4) */}
            {activity.previewType === 'percentage_grid' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    Gerakkan gelongsor untuk mewarnakan Grid 100 Petak:
                  </span>
                  <span className="font-mono font-black text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    {percentageValue}/100 = {percentageValue}%
                  </span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={percentageValue}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />

                {/* 100-Grid Visualizer */}
                <div className="grid grid-cols-10 gap-0.5 max-w-[240px] mx-auto p-1.5 bg-stone-100 rounded-xl border-2 border-stone-300">
                  {Array.from({ length: 100 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-4.5 h-4.5 rounded-2xs transition-colors ${
                        idx < percentageValue
                          ? 'bg-emerald-500 shadow-2xs'
                          : 'bg-white border border-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  {[25, 50, 75, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePercentageChange(preset)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-300 cursor-pointer"
                    >
                      {preset}% ({preset}/100)
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 3: Subtraction Bars (Tolak Pecahan - 3.1.6) */}
            {activity.previewType === 'subtraction_bars' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    Ayat Matematik: <strong>5/8 - {subtractionCut}/8 = {5 - subtractionCut}/8</strong>
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Tolak: {subtractionCut} kepingan
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] text-stone-500 block">
                    Klik untuk memilih bilangan kepingan yang hendak ditolak daripada 5/8:
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setSubtractionCut(n);
                          setSpeechBubble(`5 keping tolak ${n} keping tinggal ${5 - n} keping. Penyebut 8 kekal sama! Jadi jawapannya ${5 - n}/8.`);
                          playSfx('click', soundEnabled);
                        }}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                          subtractionCut === n
                            ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        Tolak {n}/8
                      </button>
                    ))}
                  </div>

                  {/* 8-Segment Bar Visual */}
                  <div className="w-full h-9 bg-white rounded-xl overflow-hidden flex border-2 border-stone-300 mt-2">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const isInitial = idx < 5;
                      const isCut = idx >= 5 - subtractionCut && idx < 5;
                      const isRemaining = idx < 5 - subtractionCut;

                      return (
                        <div
                          key={idx}
                          className={`w-[12.5%] h-full flex items-center justify-center text-[10px] font-bold border-r border-stone-200 transition-all ${
                            isRemaining
                              ? 'bg-emerald-500 text-white'
                              : isCut
                              ? 'bg-rose-200 text-rose-800 line-through'
                              : 'bg-stone-100 text-stone-300'
                          }`}
                        >
                          1/8
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 4: Addition Bars (Tambah Pecahan - 3.1.5) */}
            {activity.previewType === 'addition_bars' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    Ayat Matematik: <strong>2/7 + {additionAdded}/7 = {2 + additionAdded}/7</strong>
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Jumlah: {2 + additionAdded}/7
                  </span>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setAdditionAdded(n);
                        setSpeechBubble(`Cantumkan 2 kepingan biru dengan ${n} kepingan hijau. Jumlah kepingan ialah ${2 + n}/7!`);
                        playSfx('click', soundEnabled);
                      }}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                        additionAdded === n
                          ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      + {n}/7
                    </button>
                  ))}
                </div>

                {/* 7-Segment Addition Bar */}
                <div className="w-full h-9 bg-white rounded-xl overflow-hidden flex border-2 border-stone-300">
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const isFirst = idx < 2;
                    const isSecond = idx >= 2 && idx < 2 + additionAdded;

                    return (
                      <div
                        key={idx}
                        className={`w-[14.28%] h-full flex items-center justify-center text-[10px] font-bold border-r border-stone-200 ${
                          isFirst
                            ? 'bg-blue-500 text-white'
                            : isSecond
                            ? 'bg-emerald-500 text-white'
                            : 'bg-stone-100 text-stone-300'
                        }`}
                      >
                        1/7
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TYPE 5: Simplification (Bentuk Termudah - 3.1.3) */}
            {activity.previewType === 'simplification' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">
                    Memudahkan Pecahan <strong>4/8</strong>:
                  </span>
                  <span className="font-mono font-black text-purple-700 text-sm bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                    Bentuk Termudah: 1/2
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimplificationStep(1);
                      setSpeechBubble('Pecahan asal 4/8: 4 kepingan daripada 8 kepingan sama saiz.');
                      playSfx('click', soundEnabled);
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                      simplificationStep === 1
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    1. Asal (4/8)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimplificationStep(2);
                      setSpeechBubble('Kumpulkan setiap 2 kepingan menjadi 1 bahagian besar. 4/8 menjadi 2/4.');
                      playSfx('click', soundEnabled);
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                      simplificationStep === 2
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    2. Bahagi 2 (2/4)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimplificationStep(3);
                      setSpeechBubble('Kumpulkan lagi menjadi 1 bahagian daripada 2 bahagian besar. Bentuk termudah ialah 1/2!');
                      playSfx('correct', soundEnabled);
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs border cursor-pointer ${
                      simplificationStep === 3
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    3. Termudah (1/2)
                  </button>
                </div>

                {/* Visual Representation */}
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-center">
                  <span className="text-xl font-black text-purple-950 font-mono">
                    {simplificationStep === 1 ? '4/8' : simplificationStep === 2 ? '2/4' : '1/2'}
                  </span>
                  <div className="w-full h-8 bg-white rounded-xl overflow-hidden flex border-2 border-purple-300 mt-2">
                    {simplificationStep === 1 && (
                      <>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-[12.5%] h-full bg-purple-500 text-white text-[8px] font-bold flex items-center justify-center border-r border-purple-400">1/8</div>
                        ))}
                        {[5, 6, 7, 8].map((i) => (
                          <div key={i} className="w-[12.5%] h-full bg-stone-100 text-stone-400 text-[8px] flex items-center justify-center border-r border-stone-200">1/8</div>
                        ))}
                      </>
                    )}
                    {simplificationStep === 2 && (
                      <>
                        <div className="w-1/4 h-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-r border-purple-400">1/4</div>
                        <div className="w-1/4 h-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-r border-purple-400">1/4</div>
                        <div className="w-1/4 h-full bg-stone-100 text-stone-400 text-[10px] flex items-center justify-center border-r border-stone-200">1/4</div>
                        <div className="w-1/4 h-full bg-stone-100 text-stone-400 text-[10px] flex items-center justify-center">1/4</div>
                      </>
                    )}
                    {simplificationStep === 3 && (
                      <>
                        <div className="w-1/2 h-full bg-purple-700 text-white text-xs font-black flex items-center justify-center border-r border-purple-500">1/2 (Termudah)</div>
                        <div className="w-1/2 h-full bg-stone-100 text-stone-400 text-xs flex items-center justify-center">1/2</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 6: Fraction Bar (Kenal Pecahan Wajar - 3.1.1) */}
            {activity.previewType === 'fraction_bar' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">
                    Kumpulan 8 Objek (3 Merah, 5 Hijau):
                  </span>
                  <div className="flex items-center justify-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    {[1, 2, 3].map((i) => (
                      <span key={`red-${i}`} className="text-2xl" title="Merah">🍎</span>
                    ))}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={`green-${i}`} className="text-2xl opacity-60" title="Hijau">🍏</span>
                    ))}
                  </div>
                  <div className="text-center font-bold text-xs text-stone-700">
                    Pecahan epal merah = <strong className="text-rose-600 text-sm font-black">3/8</strong> (3 daripada 8 epal)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Guidance Box */}
          <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <strong>Cadangan Pelaksanaan Guru:</strong> Bimbing {studentName} mengulangi manipulasi visual di atas sebanyak 2-3 kali sehingga konsep benar-benar difahami sebelum memulakan soalan lembaran kerja bertulis.
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
            >
              Tutup Preview
            </button>

            {activity.gameRoute && onLaunchFullGame && (
              <button
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  onLaunchFullGame(activity.gameRoute!, activity.challengeId);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Buka Cabaran Penuh di {activity.gameRoute === 'arena' ? 'Arena Pecahan' : activity.gameRoute === 'dapur' ? 'Dapur Pecahan' : 'Dunia Pixel'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
