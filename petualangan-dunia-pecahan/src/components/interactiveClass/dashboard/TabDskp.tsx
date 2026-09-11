import React, { useState } from 'react';
import {
  Award,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
  Grid,
} from 'lucide-react';
import {
  DskpStandardAnalysis,
  StudentAnalysisResult,
} from '../../../utils/interactiveDashboardAnalytics';

interface TabDskpProps {
  dskpAnalysis: DskpStandardAnalysis[];
  students: StudentAnalysisResult[];
  isPrivacyMode: boolean;
  onSelectStudent: (studentId: string) => void;
}

const DSKP_DETAILED_TIPS: Record<string, string> = {
  '3.1.1': 'Gunakan objek maujud (kek, buah-buahan, pizza) dan kertas origami dilipat kepada bahagian sama besar untuk membina kefahaman konkrit bahawa pecahan adalah bahagian daripada satu keseluruhan yang sama rata.',
  '3.1.2': 'Bimbing murid menggunakan fraction bar atau jalur kertas berlainan warna. Tunjukkan bahawa 1/2 = 2/4 = 3/6 secara visual sebelum memperkenalkan formula darab pengangka dan penyebut.',
  '3.1.3': 'Gunakan konsep faktor sepunya terbesar (FSTB) atau pembahagian berperingkat dengan sifir 2, 3, dan 5. Galakkan murid melukis rajah untuk mengesahkan bahawa nilai pecahan tidak berubah.',
  '3.1.4': 'Kukuhkan konsep pecahan tak wajar di mana pengangka lebih besar daripada penyebut menggunakan lebih daripada satu bulatan/objek penuh. Dedahkan gambar rajah pecahan bercampur berdampingan.',
  '3.1.5': 'Pastikan murid memeriksa penyebut terlebih dahulu. Jika penyebut sama, hanya tambah pengangka. Gunakan jalur nombor pecahan untuk mengelakkan salah faham menambah kedua-dua pengangka dan penyebut.',
  '3.1.6': 'Tekankan konsep mengambil keluar bahagian daripada kumpulan pecahan yang sama penyebut. Visualisasikan dengan gambar rajah kotak bergrid yang dipangkah.',
  '3.1.7': 'Gunakan petak seratus (10x10 grid). Tunjukkan perkaitan langsung antara pecahan per seratus (cth: 45/100) dengan simbol peratus (45%). Terangkan bahawa peratus bermaksud bahagian daripada setiap seratus.',
};

export const TabDskp: React.FC<TabDskpProps> = ({
  dskpAnalysis,
  students,
  isPrivacyMode,
  onSelectStudent,
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const getDisplayName = (realName: string, id: string) => {
    if (!isPrivacyMode) return realName;
    return `Murid #${id}`;
  };

  const stdCodes = ['3.1.1', '3.1.2', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.1.7'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-white via-amber-50/40 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-serif-title text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                🎯
              </div>
              <span>Standard Kandungan 3.1: Pecahan (DSKP Matematik Tahun 3)</span>
            </h2>
            <span className="bg-gradient-to-r from-stone-900 to-indigo-950 text-amber-300 font-mono text-xs font-black px-3 py-1 rounded-full shadow-2xs">
              KSSR Semakan
            </span>
          </div>
          <p className="text-xs text-stone-600 font-medium mt-1.5">
            Analisis tahap penguasaan 7 standard pembelajaran, peratusan ketepatan kelas dan cadangan intervensi guru
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="px-4 py-2 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 border-2 border-amber-300 text-xs font-black shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all self-start md:self-auto hover:scale-102"
        >
          <Grid className="w-3.5 h-3.5 text-amber-600" />
          <span>{showHeatmap ? 'Sembunyikan Heatmap DSKP' : 'Tunjukkan Heatmap DSKP'}</span>
        </button>
      </div>

      {/* 7 Standard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(dskpAnalysis || []).map((std) => {
          const isMastered = std.percentage >= 80;
          const isProgress = std.percentage >= 65 && std.percentage < 80;
          const alyaTip = DSKP_DETAILED_TIPS[std.code] || 'Gunakan bahan manipulatif dan latihan berperingkat.';

          return (
            <div
              key={std.code}
              className={`p-5 rounded-3xl border-2 space-y-3 flex flex-col justify-between transition-all shadow-xs hover:shadow-md ${
                isMastered
                  ? 'border-emerald-400 hover:border-emerald-500 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-white'
                  : isProgress
                  ? 'border-amber-400 hover:border-amber-500 bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-white'
                  : 'border-rose-400 hover:border-rose-500 bg-gradient-to-b from-rose-100/40 via-rose-50/20 to-white'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-gradient-to-r from-stone-900 to-indigo-950 text-amber-300 shadow-2xs">
                    Standard {std.code}
                  </span>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full border-2 shadow-2xs ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                        : isProgress
                        ? 'bg-amber-100 text-amber-950 border-amber-400'
                        : 'bg-rose-100 text-rose-950 border-rose-400'
                    }`}
                  >
                    {isMastered ? '🟢 Menguasai' : isProgress ? '🟡 Sedang' : '🔴 Bimbingan'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug">
                  {std.name}
                </h3>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs font-black text-stone-900">
                    <span>Tahap Penguasaan</span>
                    <span className="font-mono font-black text-sm text-stone-900">{std.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-xs ${
                        isMastered
                          ? 'bg-emerald-600'
                          : isProgress
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${std.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-600 font-bold pt-0.5">
                    <span>{std.correctResponses} / {std.totalResponses} jawapan betul</span>
                    <span>{std.totalQuestions} soalan dinilai</span>
                  </div>
                </div>
              </div>

              {/* Cadangan Alya */}
              <div className="bg-gradient-to-r from-purple-100/90 via-indigo-50 to-white p-3.5 rounded-2xl border-2 border-purple-300 text-xs text-purple-950 space-y-1.5 shadow-2xs">
                <span className="font-black text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>🤖 Cadangan Pedagogi Alya:</span>
                </span>
                <p className="text-[11px] leading-relaxed font-semibold text-purple-950">
                  {alyaTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heatmap DSKP Murid */}
      {showHeatmap && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 flex-wrap gap-2">
            <div>
              <h3 className="font-serif-title text-base font-black text-stone-900 flex items-center gap-2">
                <Grid className="w-5 h-5 text-indigo-600" />
                <span>Heatmap Penguasaan Standard Murid (3.1.1 — 3.1.7)</span>
              </h3>
              <p className="text-xs text-stone-600 font-bold mt-0.5">
                Hijau (🟢 Baik) • Kuning (🟡 Sedang) • Merah (🔴 Lemah) • Klik nama murid untuk lihat profil
              </p>
            </div>
            <span className="text-xs font-black text-stone-800 bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-300">
              {students.length} Orang Murid
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-stone-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-amber-300">
                  <th className="py-3 px-3.5 font-black">Nama Murid</th>
                  <th className="py-3 px-2 text-center font-black">3.1.1</th>
                  <th className="py-3 px-2 text-center font-black">3.1.2</th>
                  <th className="py-3 px-2 text-center font-black">3.1.3</th>
                  <th className="py-3 px-2 text-center font-black">3.1.4</th>
                  <th className="py-3 px-2 text-center font-black">3.1.5</th>
                  <th className="py-3 px-2 text-center font-black">3.1.6</th>
                  <th className="py-3 px-2 text-center font-black">3.1.7</th>
                  <th className="py-3 px-2 text-center font-black">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {(students || []).map((s) => (
                  <tr
                    key={s.studentId}
                    className="hover:bg-amber-50/70 transition-colors cursor-pointer"
                    onClick={() => onSelectStudent(s.studentId)}
                  >
                    <td className="py-2.5 px-3.5 font-black text-stone-900">
                      {getDisplayName(s.studentName, s.studentId)}
                    </td>

                    {stdCodes.map((code) => {
                      const isStrong = (s.strongStandards || []).includes(code);
                      const isWeak = (s.weakStandards || []).includes(code);

                      return (
                        <td key={code} className="py-2.5 px-2 text-center">
                          {s.totalAnswered === 0 ? (
                            <span className="text-stone-300 text-xs">⚪</span>
                          ) : isStrong ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] shadow-2xs">
                              🟢 Baik
                            </span>
                          ) : isWeak ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow-2xs">
                              🔴 Lemah
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] shadow-2xs">
                              🟡 Sedang
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-2 text-center font-mono font-black text-stone-900">
                      {s.correctCount}/15
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
