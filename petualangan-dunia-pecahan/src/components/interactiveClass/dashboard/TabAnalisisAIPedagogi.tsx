import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  BookOpen,
  Users,
  Clock,
} from 'lucide-react';
import { AlyaCharacter } from '../../AlyaCharacter';
import {
  ChallengingQuestionResult,
  DskpStandardAnalysis,
  FollowUpActivity,
} from '../../../utils/interactiveDashboardAnalytics';

interface TabAnalisisAIPedagogiProps {
  classStrengths: string[];
  classWeaknesses: string[];
  alyaSummaryText: string;
  followUpActivities: FollowUpActivity[] | Array<{
    title: string;
    targetDskp?: string;
    dskpCode?: string;
    description: string;
    recommendedDuration?: string;
    duration?: string;
    materials?: string[];
    material?: string;
  }>;
  classLearningSummary: {
    visualCount: number;
    kinestheticCount: number;
    auditoryCount: number;
    combinedCount: number;
    averageVisualScore: number;
    averageKinestheticScore: number;
    averageAuditoryScore: number;
  };
  hardestQuestions: ChallengingQuestionResult[];
  dskpAnalysis: DskpStandardAnalysis[];
  overallAccuracy: number;
  studentsCount: number;
  masteredCount: number;
  needGuidanceCount: number;
}

export const TabAnalisisAIPedagogi: React.FC<TabAnalisisAIPedagogiProps> = ({
  classStrengths = [],
  classWeaknesses = [],
  alyaSummaryText,
  followUpActivities = [],
  classLearningSummary,
  hardestQuestions = [],
  dskpAnalysis = [],
  overallAccuracy,
  studentsCount,
  masteredCount,
  needGuidanceCount,
}) => {
  const safeActivities = followUpActivities || [];
  const safeStrengths = classStrengths || [];
  const safeWeaknesses = classWeaknesses || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner AI Alya Header - Vibrant, glowing & modern */}
      <section className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-purple-400/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <AlyaCharacter size="md" mood="excited" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-title text-xl sm:text-2xl font-black text-amber-300 drop-shadow-xs">
                  🤖 Analisis Pedagogi Alya
                </h2>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-3 py-0.5 rounded-full border border-white/30 shadow-xs">
                  Formatif & Diagnostik Pintar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-2xl leading-relaxed font-medium">
                Refleksi pengajaran automatik berdasarkan analisis data respons 15 soalan formatif DSKP 3.1
                dan kecenderungan pembelajaran murid bilik darjah.
              </p>
            </div>
          </div>

          <div className="text-right bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/30 shadow-xs">
            <span className="text-[11px] text-purple-200 uppercase tracking-wider font-bold block">
              Ketepatan Kelas
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300">{overallAccuracy}%</span>
          </div>
        </div>
      </section>

      {/* 2-Column: Kekuatan (Emerald) & Perlu Pengukuhan (Warm Amber / Golden Yellow) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. KEKUATAN KELAS - 🟢 Emerald / Green Vibrant */}
        <section className="bg-gradient-to-br from-emerald-100/90 via-teal-50/50 to-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-emerald-300">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>💪 KEKUATAN KELAS</span>
            </h3>
            <span className="text-xs font-black text-emerald-950 bg-emerald-200 px-3 py-1 rounded-full border border-emerald-400 shadow-2xs">
              Dikuasai Tinggi
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Standard pembelajaran dan kemahiran yang menunjukkan pemahaman mantap oleh sebahagian besar murid:
          </p>

          <div className="space-y-2.5">
            {safeStrengths.length > 0 ? (
              safeStrengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border-2 border-emerald-300 text-xs font-bold text-emerald-950 flex items-start gap-2.5 shadow-2xs hover:border-emerald-500 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs">
                    ✓
                  </span>
                  <span className="leading-relaxed">{strength}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 italic p-3 bg-white rounded-2xl border border-stone-200">
                Data kekuatan sedang dikumpul semasa murid menjawab.
              </p>
            )}
          </div>
        </section>

        {/* 2. PERLU PENGUKUHAN - 🟡 Warm Amber / Golden Yellow */}
        <section className="bg-gradient-to-br from-amber-100/90 via-yellow-50/50 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-300">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>🔎 PERLU PENGUKUHAN</span>
            </h3>
            <span className="text-xs font-black text-amber-950 bg-amber-200 px-3 py-1 rounded-full border border-amber-400 shadow-2xs">
              Fokus Guru
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Kemahiran yang paling kerap mencetuskan kesilapan dan memerlukan pengukuhan konsep secara terbimbing:
          </p>

          <div className="space-y-2.5">
            {safeWeaknesses.length > 0 ? (
              safeWeaknesses.map((weakness, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border-2 border-amber-300 text-xs font-bold text-amber-950 flex items-start gap-2.5 shadow-2xs hover:border-amber-500 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5 shadow-xs">
                    !
                  </span>
                  <span className="leading-relaxed">{weakness}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-800 font-bold p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                Semua standard berada pada tahap penguasaan yang sangat memuaskan!
              </p>
            )}
          </div>
        </section>
      </div>

      {/* 3. PROFIL PEMBELAJARAN (PEDAGOGICAL IMPLICATION) - COLOR-CODED: VISUAL=PURPLE, KINESTETIK=ORANGE, AUDITORI=BLUE */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-purple-200">
          <h3 className="font-serif-title text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
            <span>🧠 PROFIL PEMBELAJARAN KELAS & IMPLIKASI PENGAJARAN</span>
          </h3>
          <span className="text-xs font-black text-purple-950 bg-purple-200 px-3 py-1 rounded-full border border-purple-400 shadow-2xs">
            Bimbingan Berbeza (Differentiated Instruction)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 👀 VISUAL - 🟣 PURPLE / VIOLET */}
          <div className="p-4 rounded-2xl bg-purple-100/70 border-2 border-purple-400 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-purple-300">
              <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                <span className="text-base">👀</span>
                <span>Murid Visual</span>
              </span>
              <span className="font-mono text-xs font-black bg-purple-200 text-purple-950 px-2.5 py-0.5 rounded-full border border-purple-400 shadow-2xs">
                {classLearningSummary.visualCount} orang • {classLearningSummary.averageVisualScore}%
              </span>
            </div>
            <p className="text-xs text-purple-950 leading-relaxed font-bold">
              Sangat responsif kepada gambar rajah kek/pizza, fraction bar bertanda warna, dan perwakilan garis nombor.
            </p>
            <div className="w-full h-2.5 bg-purple-200 rounded-full overflow-hidden border border-purple-300">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${classLearningSummary.averageVisualScore}%` }}
              />
            </div>
          </div>

          {/* 🖐️ KINESTETIK - 🟠 ORANGE / AMBER */}
          <div className="p-4 rounded-2xl bg-amber-100/70 border-2 border-orange-400 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-orange-300">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span className="text-base">🖐️</span>
                <span>Murid Kinestetik</span>
              </span>
              <span className="font-mono text-xs font-black bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-orange-400 shadow-2xs">
                {classLearningSummary.kinestheticCount} orang • {classLearningSummary.averageKinestheticScore}%
              </span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-bold">
              Memerlukan aktiviti manipulasi objek sebenar (melipat kertas pecahan, modul Dapur Pecahan & blok pecahan).
            </p>
            <div className="w-full h-2.5 bg-amber-200 rounded-full overflow-hidden border border-orange-300">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${classLearningSummary.averageKinestheticScore}%` }}
              />
            </div>
          </div>

          {/* 🎧 AUDITORI - 🔵 BLUE / CYAN */}
          <div className="p-4 rounded-2xl bg-sky-100/70 border-2 border-sky-400 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-sky-300">
              <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                <span className="text-base">🎧</span>
                <span>Murid Auditori</span>
              </span>
              <span className="font-mono text-xs font-black bg-sky-200 text-sky-950 px-2.5 py-0.5 rounded-full border border-sky-400 shadow-2xs">
                {classLearningSummary.auditoryCount} orang • {classLearningSummary.averageAuditoryScore}%
              </span>
            </div>
            <p className="text-xs text-sky-950 leading-relaxed font-bold">
              Cepat memahami melalui penerangan lisan berirama, nyanyian sifir pecahan setara, dan soal jawab terbimbing.
            </p>
            <div className="w-full h-2.5 bg-sky-200 rounded-full overflow-hidden border border-sky-300">
              <div
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${classLearningSummary.averageAuditoryScore}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CADANGAN INTERVENSI (FOLLOW UP ACTIVITIES) - VIBRANT PURPLE/INDIGO */}
      <section className="bg-gradient-to-br from-purple-100/70 via-indigo-50/40 to-white rounded-3xl p-5 sm:p-6 border-2 border-purple-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-purple-200">
          <h3 className="font-serif-title text-base sm:text-lg font-black text-purple-950 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <span>🎯 CADANGAN INTERVENSI KHUSUS OLEH ALYA</span>
          </h3>
          <span className="text-xs font-black text-purple-950 bg-purple-200 px-3 py-1 rounded-full border border-purple-400 shadow-2xs">
            {safeActivities.length} Cadangan Aktiviti
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeActivities.map((act, idx) => {
            const dskp = (act as any).targetDskp || (act as any).dskpCode || 'DSKP 3.1';
            const duration = (act as any).recommendedDuration || (act as any).duration || '10 Minit';
            const rawMaterials = (act as any).materials;
            const materialsList: string[] = Array.isArray(rawMaterials)
              ? rawMaterials
              : (act as any).material
              ? [(act as any).material]
              : ['Bahan Konkrit / Visual'];

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border-2 border-purple-300 space-y-2.5 flex flex-col justify-between shadow-2xs hover:border-purple-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-black text-purple-950 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-300">
                      {dskp}
                    </span>
                    <span className="text-[11px] text-indigo-800 font-black flex items-center gap-1 bg-indigo-100 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{duration}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-purple-950">{act.title}</h4>
                  <p className="text-xs text-stone-800 leading-relaxed mt-1 font-semibold">
                    {act.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-100">
                  <span className="text-[10px] uppercase font-black text-purple-900 block mb-1">
                    Bahan / Modul Dicadangkan:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {materialsList.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-950 border border-purple-300 text-[10px] font-bold"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CADANGAN PENGAYAAN (UNTUK MURID BERPRESTASI TINGGI) - WARM GOLD */}
      <section className="bg-gradient-to-br from-amber-100/90 via-yellow-50/60 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-amber-300">
          <h3 className="font-serif-title text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>🌟 CADANGAN PENGAYAAN (TAHAP TP 5 & TP 6)</span>
          </h3>
          <span className="text-xs font-black text-amber-950 bg-amber-200 px-3 py-1 rounded-full border border-amber-400 shadow-2xs">
            {masteredCount} Murid Layak
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 space-y-2.5 shadow-2xs">
          <p className="text-xs text-stone-900 font-bold leading-relaxed">
            Bagi murid yang mencapai skor cemerlang (TP 5 dan TP 6), berikan cabaran aras tinggi (KBAT) seperti:
          </p>
          <ul className="text-xs text-stone-800 space-y-2 font-semibold">
            <li className="flex items-start gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
              <span className="text-amber-600 font-bold shrink-0">✦</span>
              <span>
                <strong className="text-amber-950">Penyelesai Masalah Sebenar:</strong> Minta murid mereka soalan bercerita berkaitan resipi masakan harian yang melibatkan penambahan dan penolakan pecahan wajar tidak serupa penyebut.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
              <span className="text-amber-600 font-bold shrink-0">✦</span>
              <span>
                <strong className="text-amber-950">Rakan Tutor Sebaya:</strong> Tempatkan murid berprestasi tinggi sebagai pembimbing dalam kumpulan stesen manipulatif untuk menerangkan konsep kepada rakan yang memerlukan bimbingan.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
              <span className="text-amber-600 font-bold shrink-0">✦</span>
              <span>
                <strong className="text-amber-950">Penerokaan Pecahan Tak Wajar:</strong> Beri pendedahan awal konsep pecahan bercampur dan pecahan tak wajar secara visual menggunakan modul Pixel Fraction.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 6. 💬 RUMUSAN ALYA (KESIMPULAN GURU) - HIGH CONTRAST INDIGO */}
      <section className="bg-gradient-to-br from-indigo-100/90 via-purple-50/70 to-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-300 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <AlyaCharacter size="sm" mood="happy" />
          <div>
            <h3 className="font-serif-title text-base font-black text-indigo-950">
              💬 Rumusan Keseluruhan Pedagogi
            </h3>
            <span className="text-xs text-indigo-800 font-bold">Refleksi Guru PBD</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-200 text-xs text-stone-900 leading-relaxed font-bold space-y-2 shadow-2xs">
          <p className="text-stone-900 font-bold leading-relaxed">
            {alyaSummaryText}
          </p>
          <p className="text-[11px] text-stone-600 italic pt-2 border-t border-indigo-100">
            * Analisis ini diselaraskan dengan dokumen Standard Kurikulum dan Pentaksiran (DSKP) Matematik Tahun 3 KSSR Semakan.
          </p>
        </div>
      </section>
    </div>
  );
};
