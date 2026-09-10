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
      {/* Banner AI Alya Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <AlyaCharacter size="md" mood="excited" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif-title text-xl sm:text-2xl font-black text-amber-300">
                  🤖 Analisis Pedagogi Alya
                </h2>
                <span className="bg-purple-800/80 text-purple-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-600">
                  Formatif & Diagnostik Pintar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl leading-relaxed">
                Refleksi pengajaran automatik berdasarkan analisis data respons 15 soalan formatif DSKP 3.1
                dan kecenderungan pembelajaran murid bilik darjah.
              </p>
            </div>
          </div>

          <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
            <span className="text-[11px] text-purple-200 uppercase tracking-wider font-bold block">
              Ketepatan Kelas
            </span>
            <span className="font-mono text-2xl font-black text-amber-300">{overallAccuracy}%</span>
          </div>
        </div>
      </section>

      {/* 2-Column: Kekuatan & Perlu Pengukuhan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. KEKUATAN KELAS */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <h3 className="font-serif-title text-base font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>💪 KEKUATAN KELAS</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Dikuasai Tinggi
            </span>
          </div>

          <p className="text-xs text-stone-600 font-medium">
            Standard pembelajaran dan kemahiran yang menunjukkan pemahaman mantap oleh sebahagian besar murid:
          </p>

          <div className="space-y-2.5">
            {safeStrengths.length > 0 ? (
              safeStrengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{strength}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 italic p-3">Data kekuatan sedang dikumpul semasa murid menjawab.</p>
            )}
          </div>
        </section>

        {/* 2. PERLU PENGUKUHAN */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <h3 className="font-serif-title text-base font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>🔎 PERLU PENGUKUHAN</span>
            </h3>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Fokus Utama
            </span>
          </div>

          <p className="text-xs text-stone-600 font-medium">
            Kemahiran yang paling kerap mencetuskan kesilapan dan kekeliruan konsep dalam kalangan murid:
          </p>

          <div className="space-y-2.5">
            {safeWeaknesses.length > 0 ? (
              safeWeaknesses.map((weakness, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs font-semibold text-rose-950 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <span className="leading-relaxed">{weakness}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-bold p-3">Tiada kelemahan ketara direkodkan. Tahap penguasaan baik!</p>
            )}
          </div>
        </section>
      </div>

      {/* 3. PROFIL PEMBELAJARAN (PEDAGOGICAL IMPLICATION) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-indigo-100">
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-indigo-950 flex items-center gap-2">
            <span>🧠 PROFIL PEMBELAJARAN KELAS & IMPLIKASI PENGAJARAN</span>
          </h3>
          <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Bimbingan Berbeza (Differentiated Instruction)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span>👀 Murid Visual ({classLearningSummary.visualCount} orang)</span>
              <span className="font-mono">{classLearningSummary.averageVisualScore}%</span>
            </div>
            <p className="text-[11px] text-blue-950 leading-relaxed font-medium">
              Sangat responsif kepada gambar rajah kek/pizza, fraction bar bertanda warna, dan perwakilan garis nombor.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>🖐️ Murid Kinestetik ({classLearningSummary.kinestheticCount} orang)</span>
              <span className="font-mono">{classLearningSummary.averageKinestheticScore}%</span>
            </div>
            <p className="text-[11px] text-emerald-950 leading-relaxed font-medium">
              Memerlukan aktiviti manipulasi objek sebenar (melipat kertas pecahan, modul Dapur Pecahan & blok pecahan).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span>🎧 Murid Auditori ({classLearningSummary.auditoryCount} orang)</span>
              <span className="font-mono">{classLearningSummary.averageAuditoryScore}%</span>
            </div>
            <p className="text-[11px] text-amber-950 leading-relaxed font-medium">
              Cepat memahami melalui penerangan lisan berirama, nyanyian sifir pecahan setara, dan soal jawab terbimbing.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CADANGAN INTERVENSI (FOLLOW UP ACTIVITIES) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-purple-100">
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <span>🎯 CADANGAN INTERVENSI KHUSUS OLEH ALYA</span>
          </h3>
          <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
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
                className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-purple-950 bg-purple-200 px-2 py-0.5 rounded-md">
                      {dskp}
                    </span>
                    <span className="text-[11px] text-stone-500 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{duration}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-purple-950">{act.title}</h4>
                  <p className="text-xs text-stone-700 leading-relaxed mt-1 font-medium">
                    {act.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-200/60">
                  <span className="text-[10px] uppercase font-bold text-purple-900 block mb-1">
                    Bahan / Modul Dicadangkan:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {materialsList.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-0.5 rounded-lg bg-white text-purple-950 border border-purple-300 text-[10px] font-bold"
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

      {/* 5. CADANGAN PENGAYAAN (UNTUK MURID BERPRESTASI TINGGI) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-amber-100">
          <h3 className="font-serif-title text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>🌟 CADANGAN PENGAYAAN (TAHAP TP 5 & TP 6)</span>
          </h3>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {masteredCount} Murid Layak
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <p className="text-xs text-stone-800 font-medium leading-relaxed">
            Bagi murid yang mencapai skor cemerlang (TP 5 dan TP 6), berikan cabaran aras tinggi (KBAT) seperti:
          </p>
          <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside font-medium">
            <li>
              <strong>Penyelesai Masalah Sebenar:</strong> Minta murid mereka soalan bercerita berkaitan resipi masakan harian yang melibatkan penambahan dan penolakan pecahan wajar tidak serupa penyebut.
            </li>
            <li>
              <strong>Rakan Tutor Sebaya:</strong> Tempatkan murid berprestasi tinggi sebagai pembimbing dalam kumpulan stesen manipulatif untuk menerangkan konsep kepada rakan yang memerlukan bimbingan.
            </li>
            <li>
              <strong>Penerokaan Pecahan Tak Wajar:</strong> Beri pendedahan awal konsep pecahan bercampur dan pecahan tak wajar secara visual menggunakan modul Pixel Fraction.
            </li>
          </ul>
        </div>
      </section>

      {/* 6. 💬 RUMUSAN ALYA (KESIMPULAN GURU) */}
      <section className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border-2 border-stone-300 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <AlyaCharacter size="sm" mood="happy" />
          <div>
            <h3 className="font-serif-title text-base font-black text-[#4A3728]">
              💬 Rumusan Keseluruhan Pedagogi
            </h3>
            <span className="text-xs text-stone-500 font-medium">Refleksi Guru PBD</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 text-xs text-stone-800 leading-relaxed font-medium space-y-2">
          <p>
            {alyaSummaryText}
          </p>
          <p className="text-[11px] text-stone-500 italic pt-2 border-t border-stone-100">
            * Analisis ini diselaraskan dengan dokumen Standard Kurikulum dan Pentaksiran (DSKP) Matematik Tahun 3 KSSR Semakan.
          </p>
        </div>
      </section>
    </div>
  );
};
