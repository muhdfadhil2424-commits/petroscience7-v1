// Komponen Interaktif: "🧩 CUBA SENDIRI"
// Membolehkan murid mencuba manipulasi visual konsep pecahan secara langsung
// Responsif, mesra murid Tahun 3, positif dan menggalakkan (tanpa menghukum)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { InteractiveClassQuestion } from '../../data/interactiveClass30Questions';
import { playSfx } from '../../utils/audio';

interface AlyaInteractiveTryItProps {
  question: InteractiveClassQuestion;
  soundEnabled?: boolean;
  onSuccess?: () => void;
}

export const AlyaInteractiveTryIt: React.FC<AlyaInteractiveTryItProps> = ({
  question,
  soundEnabled = true,
  onSuccess,
}) => {
  // Setup state based on question type
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [interactiveSegments, setInteractiveSegments] = useState<number[]>([]);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const qType = question.questionType || 'identify_fraction';

  // Sediakan cabaran interaktif khusus bagi soalan
  const challengeConfig = React.useMemo(() => {
    switch (question.questionId) {
      case 'CLASS_Q01': // 8 epal, 3 merah -> 3/8
        return {
          type: 'choice_with_visual',
          instruction: 'Kira epal merah berbanding jumlah semua epal. Pilih pecahan yang betul:',
          choices: [
            { label: '3/8', isCorrect: true, feedback: '🎉 Betul! 3 epal merah daripada 8 jumlah epal = 3/8.' },
            { label: '5/8', isCorrect: false, feedback: '💡 5 ialah epal yang bukan merah. Soalan tanya epal merah.' },
            { label: '3/5', isCorrect: false, feedback: '💡 Jumlah semua epal ialah 8, bukan 5.' },
          ],
        };

      case 'CLASS_Q02': // 6 bola, 2 biru -> 2/6
        return {
          type: 'choice_with_visual',
          instruction: 'Kira bola biru berbanding jumlah semua bola. Pilih pecahan yang betul:',
          choices: [
            { label: '4/6', isCorrect: false, feedback: '💡 4 ialah bola yang bukan biru. Soalan tanya bola biru.' },
            { label: '2/6', isCorrect: true, feedback: '🎉 Betul! 2 bola biru daripada 6 jumlah bola = 2/6.' },
            { label: '2/4', isCorrect: false, feedback: '💡 Jumlah semua bola ialah 6, bukan 4.' },
          ],
        };

      case 'CLASS_Q03': // Setara 1/2 -> 2/4
        return {
          type: 'equivalent_compare',
          baseFraction: '1/2',
          baseParts: 2,
          baseFilled: 1,
          instruction: 'Manakah pecahan yang mempunyai panjang kawasan berlorek yang SAMA dengan 1/2?',
          choices: [
            { label: '2/4', parts: 4, filled: 2, isCorrect: true, feedback: '🎉 Betul! 1/2 dan 2/4 sama panjang (kedua-duanya separuh).' },
            { label: '2/5', parts: 5, filled: 2, isCorrect: false, feedback: '💡 Cuba lihat fraction bar: 2/5 lebih pendek daripada 1/2.' },
            { label: '3/4', parts: 4, filled: 3, isCorrect: false, feedback: '💡 Cuba lihat fraction bar: 3/4 lebih panjang daripada 1/2.' },
          ],
        };

      case 'CLASS_Q04': // 1/4 = 25%
        return {
          type: 'choice_with_visual',
          instruction: 'Jika 1 petak besar (100 petak kecil) dibahagi 4 bahagian sama besar, 1 bahagian ialah:',
          choices: [
            { label: '25%', isCorrect: true, feedback: '🎉 Betul! 100 bahagi 4 ialah 25, jadi 1/4 = 25%.' },
            { label: '50%', isCorrect: false, feedback: '💡 50% ialah separuh (1/2).' },
            { label: '10%', isCorrect: false, feedback: '💡 10% ialah 1/10 bahagian sahaja.' },
          ],
        };

      case 'CLASS_Q05': // Setara 2/3 -> 4/6
        return {
          type: 'equivalent_compare',
          baseFraction: '2/3',
          baseParts: 3,
          baseFilled: 2,
          instruction: 'Darab pengangka dan penyebut dengan 2. Manakah pecahan setara bagi 2/3?',
          choices: [
            { label: '4/6', parts: 6, filled: 4, isCorrect: true, feedback: '🎉 Betul! 2/3 dan 4/6 mempunyai panjang yang sama persis.' },
            { label: '2/6', parts: 6, filled: 2, isCorrect: false, feedback: '💡 Cuba lihat fraction bar: 2/6 hanya separuh daripada 2/3.' },
            { label: '3/6', parts: 6, filled: 3, isCorrect: false, feedback: '💡 3/6 ialah separuh (1/2), bukan 2/3.' },
          ],
        };

      case 'CLASS_Q06': // 2/4 termudah -> 1/2
        return {
          type: 'equivalent_compare',
          baseFraction: '2/4',
          baseParts: 4,
          baseFilled: 2,
          instruction: 'Bahagikan atas dan bawah dengan 2 (2÷2 dan 4÷2):',
          choices: [
            { label: '1/2', parts: 2, filled: 1, isCorrect: true, feedback: '🎉 Betul! 2/4 dipermudahkan menjadi 1/2.' },
            { label: '1/4', parts: 4, filled: 1, isCorrect: false, feedback: '💡 1/4 adalah separuh daripada 2/4.' },
            { label: '2/2', parts: 2, filled: 2, isCorrect: false, feedback: '💡 2/2 bernilai 1 penuh.' },
          ],
        };

      case 'CLASS_Q07': // 3/6 termudah -> 1/2
        return {
          type: 'equivalent_compare',
          baseFraction: '3/6',
          baseParts: 6,
          baseFilled: 3,
          instruction: 'Bahagikan atas dan bawah dengan 3 (3÷3 dan 6÷3):',
          choices: [
            { label: '1/2', parts: 2, filled: 1, isCorrect: true, feedback: '🎉 Betul! 3/6 dipermudahkan menjadi 1/2.' },
            { label: '1/3', parts: 3, filled: 1, isCorrect: false, feedback: '💡 6 bahagi 3 ialah 2, jadi penyebutnya 2.' },
            { label: '2/3', parts: 3, filled: 2, isCorrect: false, feedback: '💡 2/3 bernilai 4/6, bukan 3/6.' },
          ],
        };

      case 'CLASS_Q08': // 2/7 + 3/7 = 5/7
        return {
          type: 'operation_tap',
          operation: '+',
          denom: 7,
          part1: 2,
          part2: 3,
          targetSum: 5,
          instruction: 'Penyebut sama iaitu 7. Tambah nombor atas: 2 + 3 = ? Lorekkan 5 petak pada jalur hasil di bawah:',
        };

      case 'CLASS_Q09': // 6/8 - 2/8 = 4/8
        return {
          type: 'operation_tap',
          operation: '-',
          denom: 8,
          part1: 6,
          part2: 2,
          targetSum: 4,
          instruction: 'Penyebut sama iaitu 8. Tolak nombor atas: 6 − 2 = ? Lorekkan 4 petak baki:',
        };

      case 'CLASS_Q10': // 1 1/4
        return {
          type: 'choice_with_visual',
          instruction: 'Ada 1 bahagian penuh dan 1/4 bahagian lebihan. Tuliskan nombor bercampurnya:',
          choices: [
            { label: '1 1/4', isCorrect: true, feedback: '🎉 Betul! 1 nombor bulat dan 1/4 pecahan wajar = 1 1/4.' },
            { label: '2 1/4', isCorrect: false, feedback: '💡 Hanya ada 1 objek penuh, bukan 2.' },
            { label: '5/4', isCorrect: false, feedback: '💡 5/4 ialah pecahan tak wajar. Soalan minta nombor bercampur.' },
          ],
        };

      case 'CLASS_Q11': // 1/2 + 1/4 = 3/4
        return {
          type: 'choice_with_visual',
          instruction: 'Tukar 1/2 kepada penyebut 4 dahulu: 1/2 = 2/4. Kemudian hitung 2/4 + 1/4:',
          choices: [
            { label: '3/4', isCorrect: true, feedback: '🎉 Betul! 2/4 + 1/4 = 3/4.' },
            { label: '2/6', isCorrect: false, feedback: '💡 Jangan tambah penyebut! Penyebut mesti kekal 4.' },
            { label: '2/4', isCorrect: false, feedback: '💡 Jangan lupa tambah lagi 1/4.' },
          ],
        };

      case 'CLASS_Q12': // 1/3 + 2/9 = 5/9
        return {
          type: 'choice_with_visual',
          instruction: 'Tukar 1/3 kepada penyebut 9: 1/3 = 3/9. Kemudian hitung 3/9 + 2/9:',
          choices: [
            { label: '5/9', isCorrect: true, feedback: '🎉 Betul! 3/9 + 2/9 = 5/9.' },
            { label: '3/12', isCorrect: false, feedback: '💡 Jangan tambah penyebut 3 + 9. Samakan penyebut dahulu!' },
            { label: '4/9', isCorrect: false, feedback: '💡 Kira semula: 3 + 2 = 5, jadi 5/9.' },
          ],
        };

      case 'CLASS_Q13': // 3/4 - 1/2 = 1/4
        return {
          type: 'choice_with_visual',
          instruction: 'Tukar 1/2 kepada penyebut 4: 1/2 = 2/4. Kemudian hitung 3/4 − 2/4:',
          choices: [
            { label: '1/4', isCorrect: true, feedback: '🎉 Betul! 3/4 − 2/4 = 1/4.' },
            { label: '2/4', isCorrect: false, feedback: '💡 3 − 2 = 1, jadi baki ialah 1/4.' },
            { label: '2/2', isCorrect: false, feedback: '💡 Penyebut tidak boleh ditolak.' },
          ],
        };

      case 'CLASS_Q14': // 4/5 - 3/10 = 5/10
        return {
          type: 'choice_with_visual',
          instruction: 'Tukar 4/5 kepada penyebut 10: 4/5 = 8/10. Kemudian hitung 8/10 − 3/10:',
          choices: [
            { label: '5/10', isCorrect: true, feedback: '🎉 Betul! 8/10 − 3/10 = 5/10.' },
            { label: '1/5', isCorrect: false, feedback: '💡 8/10 − 3/10 = 5/10 (bersamaan 1/2).' },
            { label: '7/10', isCorrect: false, feedback: '💡 Kira semula: 8 tolak 3 ialah 5.' },
          ],
        };

      case 'CLASS_Q15': // 7/5 -> 1 2/5
        return {
          type: 'choice_with_visual',
          instruction: '7 dibahagikan dengan 5. Ada 1 bahagian penuh (5/5) dan baki 2/5:',
          choices: [
            { label: '1 2/5', isCorrect: true, feedback: '🎉 Betul! 7/5 = 1 2/5.' },
            { label: '1 3/5', isCorrect: false, feedback: '💡 7 tolak 5 tinggal baki 2, bukan 3.' },
            { label: '2 1/5', isCorrect: false, feedback: '💡 2 bahagian penuh memerlukan 10 bahagian.' },
          ],
        };

      default:
        return {
          type: 'choice_with_visual',
          instruction: 'Pilih jawapan yang sepadan dengan konsep soalan:',
          choices: [
            { label: question.correctAnswer, isCorrect: true, feedback: '🎉 Betul!' },
            { label: question.options[1] || '1/2', isCorrect: false, feedback: '💡 Cuba semak semula.' },
          ],
        };
    }
  }, [question]);

  const handleSelectChoice = (choice: any) => {
    setSelectedChoice(choice.label);
    setIsCorrect(choice.isCorrect);

    if (choice.isCorrect) {
      playSfx('correct', soundEnabled);
      setHasCompleted(true);
      onSuccess?.();
    } else {
      playSfx('wrong', soundEnabled);
    }
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setIsCorrect(null);
    setInteractiveSegments([]);
    setHasCompleted(false);
  };

  // Toggle petak interaktif untuk jenis 'operation_tap'
  const handleToggleSegment = (idx: number, maxCount: number) => {
    let next: number[];
    if (interactiveSegments.includes(idx)) {
      next = interactiveSegments.filter((i) => i !== idx);
    } else {
      next = [...interactiveSegments, idx];
    }
    setInteractiveSegments(next);

    const cfg: any = challengeConfig;
    if (next.length === cfg.targetSum) {
      setIsCorrect(true);
      setHasCompleted(true);
      playSfx('correct', soundEnabled);
      onSuccess?.();
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div
      id="alya-try-it-workspace"
      className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-blue-50/90 rounded-2xl border-3 border-indigo-300 shadow-sm"
    >
      {/* Header Cabaran */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            🧩
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-indigo-950 tracking-tight">
              Aktiviti Interaktif: Cuba Sendiri!
            </h4>
            <span className="text-xs font-semibold text-indigo-700">
              Manipulasi visual konsep & uji kefahaman anda
            </span>
          </div>
        </div>

        {selectedChoice !== null || interactiveSegments.length > 0 ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Semula</span>
          </button>
        ) : null}
      </div>

      {/* Arahan */}
      <p className="text-sm sm:text-base font-bold text-stone-800 mb-4 bg-white/80 p-3 rounded-xl border border-indigo-100">
        {challengeConfig.instruction}
      </p>

      {/* ======================================================== */}
      {/* 1. KES PERBANDINGAN PECAHAN SETARA (equivalent_compare) */}
      {/* ======================================================== */}
      {challengeConfig.type === 'equivalent_compare' && (
        <div className="space-y-4 mb-5">
          {/* Jalur Asal */}
          <div className="p-3.5 bg-white rounded-xl border-2 border-indigo-200">
            <div className="flex justify-between text-xs font-black text-indigo-900 mb-1.5">
              <span>Jalur Asal:</span>
              <span className="font-mono text-sm">{challengeConfig.baseFraction}</span>
            </div>
            <div
              className="grid gap-1 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5"
              style={{ gridTemplateColumns: `repeat(${challengeConfig.baseParts}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: challengeConfig.baseParts }).map((_, i) => (
                <div
                  key={i}
                  className={`h-9 flex items-center justify-center font-mono font-black text-xs ${
                    i < challengeConfig.baseFilled ? 'bg-indigo-400 text-indigo-950' : 'bg-white text-stone-300'
                  }`}
                >
                  1/{challengeConfig.baseParts}
                </div>
              ))}
            </div>
          </div>

          {/* Jalur Pilihan Murid (Jika Ada Yang Dipilih) */}
          {selectedChoice && (
            <div className="p-3.5 bg-white rounded-xl border-2 border-purple-200">
              {(() => {
                const choiceObj = challengeConfig.choices.find((c: any) => c.label === selectedChoice);
                if (!choiceObj) return null;
                return (
                  <div>
                    <div className="flex justify-between text-xs font-black text-purple-900 mb-1.5">
                      <span>Jalur Pilihan Anda:</span>
                      <span className="font-mono text-sm">{choiceObj.label}</span>
                    </div>
                    <div
                      className="grid gap-1 rounded-lg overflow-hidden border-2 border-stone-800 bg-stone-800 p-0.5"
                      style={{ gridTemplateColumns: `repeat(${choiceObj.parts}, minmax(0, 1fr))` }}
                    >
                      {Array.from({ length: choiceObj.parts }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-9 flex items-center justify-center font-mono font-black text-xs ${
                            i < choiceObj.filled
                              ? choiceObj.isCorrect
                                ? 'bg-emerald-400 text-emerald-950'
                                : 'bg-rose-300 text-rose-950'
                              : 'bg-white text-stone-300'
                          }`}
                        >
                          1/{choiceObj.parts}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Butang Pilihan */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {challengeConfig.choices.map((choice: any, idx: number) => {
              const isSelected = selectedChoice === choice.label;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectChoice(choice)}
                  className={`p-3 rounded-xl border-2 font-mono font-black text-lg transition-all cursor-pointer flex flex-col items-center justify-center shadow-xs active:scale-95 ${
                    isSelected
                      ? choice.isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-400'
                      : 'bg-white text-stone-800 border-stone-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                  }`}
                >
                  <span>{choice.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. KES KETIK UNTUK LOREKKAN HASIL (operation_tap) */}
      {/* ======================================================== */}
      {challengeConfig.type === 'operation_tap' && (
        <div className="space-y-4 mb-5">
          <div className="p-4 bg-white rounded-xl border-2 border-indigo-200">
            <div className="flex justify-between items-center text-xs font-black text-indigo-950 mb-2">
              <span>Ketik petak untuk lorekkan hasil:</span>
              <span className="font-mono text-sm text-indigo-800">
                {interactiveSegments.length}/{challengeConfig.denom}
              </span>
            </div>

            <div
              className="grid gap-1.5 rounded-xl overflow-hidden border-2 border-stone-800 bg-stone-800 p-1.5"
              style={{ gridTemplateColumns: `repeat(${challengeConfig.denom}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: challengeConfig.denom }).map((_, i) => {
                const isSelected = interactiveSegments.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleToggleSegment(i, challengeConfig.denom)}
                    className={`h-12 rounded flex flex-col items-center justify-center font-mono font-black text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-400 text-emerald-950 shadow-inner scale-95 border-2 border-emerald-600'
                        : 'bg-white text-stone-400 hover:bg-stone-100 active:scale-90'
                    }`}
                  >
                    <span>1/{challengeConfig.denom}</span>
                    <span className="text-[10px] font-sans opacity-75">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-stone-600 font-semibold text-center">
            {interactiveSegments.length === (challengeConfig as any).targetSum ? (
              <span className="text-emerald-700 font-black">
                🎉 Tepat! Anda telah melorekkan {(challengeConfig as any).targetSum}/{(challengeConfig as any).denom} bahagian!
              </span>
            ) : (
              <span>
                Ketik petak sehingga cukup {(challengeConfig as any).targetSum} petak (kini {interactiveSegments.length}/{(challengeConfig as any).targetSum})
              </span>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. KES PILIHAN JAWAPAN DENGAN VISUAL (choice_with_visual) */}
      {/* ======================================================== */}
      {challengeConfig.type === 'choice_with_visual' && (
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
          {challengeConfig.choices.map((choice: any, idx: number) => {
            const isSelected = selectedChoice === choice.label;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectChoice(choice)}
                className={`p-3.5 rounded-xl border-2 font-mono font-black text-lg transition-all cursor-pointer flex flex-col items-center justify-center shadow-xs active:scale-95 ${
                  isSelected
                    ? choice.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300'
                      : 'bg-rose-100 text-rose-900 border-rose-400'
                    : 'bg-white text-stone-800 border-stone-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
              >
                <span>{choice.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MAKLUM BALAS ALYA (FEEDBACK) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`p-4 rounded-xl border-2 text-sm sm:text-base font-bold flex items-start gap-3 ${
              isCorrect
                ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950'
                : 'bg-amber-100/90 border-amber-400 text-amber-950'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-700" />
              )}
            </div>
            <div>
              <div className="font-black mb-0.5">
                {isCorrect ? '🎉 Betul! / Syabas!' : '💡 Cuba lihat semula:'}
              </div>
              <div>
                {(() => {
                  if (challengeConfig.type === 'operation_tap') {
                    return isCorrect
                      ? 'Hebat! Anda berjaya mencari hasil operasi pecahan dengan betul!'
                      : 'Teruskan mencuba, lorekkan petak sehingga mencapai hasil yang betul.';
                  }
                  const chosen = challengeConfig.choices?.find((c: any) => c.label === selectedChoice);
                  return chosen?.feedback || (isCorrect ? 'Tahniah, kefahaman anda mantap!' : 'Sila cuba lagi.');
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Learning Moment Notification */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3.5 rounded-xl bg-indigo-900 text-white flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              🎉 BAGUS! Sekarang kamu tahu cara mendapat jawapan itu.
            </span>
          </div>
          <span className="text-xs font-black uppercase tracking-wider bg-emerald-500 px-2.5 py-1 rounded-lg shrink-0">
            Selesai 🌟
          </span>
        </motion.div>
      )}
    </div>
  );
};
