import React from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { DashboardTab } from './types';
import { StudentAnalysisResult, DskpStandardAnalysis } from '../../../utils/interactiveDashboardAnalytics';
import { AlyaCharacter } from '../../AlyaCharacter';

interface TabRingkasanProps {
  studentsCount: number;
  totalQuestions: number;
  overallAccuracy: number;
  masteredCount: number;
  inProgressCount: number;
  needGuidanceCount: number;
  classStrengths: string[];
  classWeaknesses: string[];
  alyaSummaryText: string;
  dskpAnalysis: DskpStandardAnalysis[];
  onNavigateToTab: (tab: DashboardTab) => void;
}

export const TabRingkasan: React.FC<TabRingkasanProps> = ({
  studentsCount,
  totalQuestions,
  overallAccuracy,
  masteredCount,
  inProgressCount,
  needGuidanceCount,
  classStrengths,
  classWeaknesses,
  alyaSummaryText,
  dskpAnalysis,
  onNavigateToTab,
}) => {
  const masteredPercent = studentsCount > 0 ? Math.round((masteredCount / studentsCount) * 100) : 0;
  const inProgressPercent = studentsCount > 0 ? Math.round((inProgressCount / studentsCount) * 100) : 0;
  const needGuidancePercent = studentsCount > 0 ? Math.round((needGuidanceCount / studentsCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. 6 KPI CARDS (DIKIRA DARI DATA SEBENAR) */}
      {/* ======================================================== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-serif-title font-bold text-[#4A3728] flex items-center gap-2">
            <span>📌 Status Utama Pencapaian Sesi</span>
          </h2>
          <span className="text-xs font-semibold text-stone-500">
            Kemaskini masa nyata daripada data imbasan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Jumlah Murid */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-100/70 via-indigo-50/40 to-white border-2 border-indigo-400 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all">
            <div className="flex items-center justify-between text-indigo-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">👨‍🎓 Murid</span>
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 font-mono">
              {studentsCount}
            </div>
            <span className="text-[11px] text-indigo-900 font-bold mt-0.5 block">
              Murid berdaftar
            </span>
          </div>

          {/* Card 2: Jumlah Soalan */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-100/70 via-sky-50/40 to-white border-2 border-sky-400 shadow-sm hover:shadow-md hover:border-sky-500 transition-all">
            <div className="flex items-center justify-between text-sky-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">📝 Soalan</span>
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-sky-950 font-mono">
              {totalQuestions}
            </div>
            <span className="text-[11px] text-sky-900 font-bold mt-0.5 block">
              Formatif DSKP 3.1
            </span>
          </div>

          {/* Card 3: Purata Kelas */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-100/70 via-emerald-50/40 to-white border-2 border-teal-400 shadow-sm hover:shadow-md hover:border-teal-500 transition-all">
            <div className="flex items-center justify-between text-teal-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">📊 Purata</span>
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-950 font-mono">
              {overallAccuracy}%
            </div>
            <span className="text-[11px] text-teal-900 font-black mt-0.5 block">
              Ketepatan kelas
            </span>
          </div>

          {/* Card 4: Menguasai (>=70% / TP 4-6) - VIBRANT GREEN */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white border-2 border-emerald-500 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-emerald-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">🟢 Menguasai</span>
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
              {masteredCount}
            </div>
            <span className="text-[11px] text-emerald-900 font-black mt-0.5 block">
              {masteredPercent}% TP 4-6
            </span>
          </div>

          {/* Card 5: Sedang Menguasai (50-69% / TP 3) - VIBRANT AMBER */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-white border-2 border-amber-400 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-amber-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">🟡 Sedang</span>
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
              {inProgressCount}
            </div>
            <span className="text-[11px] text-amber-900 font-black mt-0.5 block">
              {inProgressPercent}% TP 3
            </span>
          </div>

          {/* Card 6: Perlu Bimbingan (<50% / TP 1-2) - VIBRANT CORAL / RED */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-100 via-rose-50 to-white border-2 border-rose-400 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between text-rose-950 text-xs font-black mb-1.5">
              <span className="uppercase tracking-wider">🔴 Bimbingan</span>
              <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono">
              {needGuidanceCount}
            </div>
            <span className="text-[11px] text-rose-900 font-black mt-0.5 block">
              {needGuidancePercent}% TP 1-2
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PRESTASI KESELURUHAN KELAS (CARTA RINGKAS & BAR SEGMEN) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif-title text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>📈 Prestasi Keseluruhan Kelas</span>
            </h3>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Taburan tahap penguasaan murid berdasarkan soalan formatif DSKP 3.1
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('charts')}
            className="text-xs font-black text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
          >
            <span>Buka Analisis Carta Terperinci</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Segmented Visual Progress Bar - VIBRANT & THICK */}
        <div className="space-y-2.5">
          <div className="h-7 w-full rounded-2xl overflow-hidden flex shadow-inner bg-stone-100 p-0.5 border-2 border-stone-200">
            {masteredCount > 0 && (
              <div
                style={{ width: `${(masteredCount / studentsCount) * 100}%` }}
                className="bg-emerald-600 hover:bg-emerald-700 transition-all rounded-l-xl flex items-center justify-center text-white text-xs font-black shadow-xs"
                title={`Menguasai: ${masteredCount} murid (${masteredPercent}%)`}
              >
                {masteredPercent > 10 ? `${masteredPercent}%` : ''}
              </div>
            )}
            {inProgressCount > 0 && (
              <div
                style={{ width: `${(inProgressCount / studentsCount) * 100}%` }}
                className="bg-amber-500 hover:bg-amber-600 transition-all flex items-center justify-center text-white text-xs font-black shadow-xs"
                title={`Sedang Menguasai: ${inProgressCount} murid (${inProgressPercent}%)`}
              >
                {inProgressPercent > 10 ? `${inProgressPercent}%` : ''}
              </div>
            )}
            {needGuidanceCount > 0 && (
              <div
                style={{ width: `${(needGuidanceCount / studentsCount) * 100}%` }}
                className="bg-rose-600 hover:bg-rose-700 transition-all rounded-r-xl flex items-center justify-center text-white text-xs font-black shadow-xs"
                title={`Perlu Bimbingan: ${needGuidanceCount} murid (${needGuidancePercent}%)`}
              >
                {needGuidancePercent > 10 ? `${needGuidancePercent}%` : ''}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2.5 bg-emerald-50/90 p-3 rounded-2xl border-2 border-emerald-400 shadow-2xs">
              <span className="w-4 h-4 rounded-full bg-emerald-600 shrink-0 shadow-2xs flex items-center justify-center text-[9px] text-white font-bold">✓</span>
              <div className="min-w-0">
                <span className="font-black text-emerald-950 block">Menguasai (TP 4-6)</span>
                <span className="text-emerald-900 font-extrabold text-xs">
                  {masteredCount} orang ({masteredPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-amber-50/90 p-3 rounded-2xl border-2 border-amber-400 shadow-2xs">
              <span className="w-4 h-4 rounded-full bg-amber-500 shrink-0 shadow-2xs flex items-center justify-center text-[9px] text-white font-bold">✦</span>
              <div className="min-w-0">
                <span className="font-black text-amber-950 block">Sedang Menguasai (TP 3)</span>
                <span className="text-amber-900 font-extrabold text-xs">
                  {inProgressCount} orang ({inProgressPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-rose-50/90 p-3 rounded-2xl border-2 border-rose-400 shadow-2xs">
              <span className="w-4 h-4 rounded-full bg-rose-600 shrink-0 shadow-2xs flex items-center justify-center text-[9px] text-white font-bold">!</span>
              <div className="min-w-0">
                <span className="font-black text-rose-950 block">Perlu Bimbingan (TP 1-2)</span>
                <span className="text-rose-900 font-extrabold text-xs">
                  {needGuidanceCount} orang ({needGuidancePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. KEKUATAN KELAS & PERLU PENGUKUHAN */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kekuatan Kelas - 🟢 Vivid Emerald */}
        <section className="bg-gradient-to-br from-emerald-100/80 via-teal-50/50 to-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-emerald-300">
            <h3 className="font-serif-title text-base font-black text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>💪 Kekuatan Kelas</span>
            </h3>
            <span className="text-xs font-black text-emerald-950 bg-emerald-200/90 px-3 py-1 rounded-full border border-emerald-400 shadow-2xs">
              Pencapaian Tinggi
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Kemahiran yang paling dikuasai oleh murid dengan ketepatan tertinggi:
          </p>

          <div className="space-y-2">
            {classStrengths.length > 0 ? (
              classStrengths.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border-2 border-emerald-300 text-xs font-bold text-emerald-950 flex items-start gap-2.5 shadow-2xs hover:border-emerald-500 transition-colors"
                >
                  <span className="text-white bg-emerald-600 rounded-md w-4 h-4 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">✓</span>
                  <span className="leading-snug">{st}</span>
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 text-xs text-stone-600">
                Data sedang dikumpulkan semasa sesi berlangsung.
              </div>
            )}
          </div>
        </section>

        {/* Perlu Pengukuhan - 🟡 Vivid Amber / Golden */}
        <section className="bg-gradient-to-br from-amber-100/80 via-yellow-50/50 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-amber-300">
            <h3 className="font-serif-title text-base font-black text-amber-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>🔎 Perlu Pengukuhan</span>
            </h3>
            <span className="text-xs font-black text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400 shadow-2xs">
              Fokus Guru
            </span>
          </div>

          <p className="text-xs text-stone-700 font-medium">
            Standard yang mencatat kadar kesilapan lebih tinggi dan memerlukan bimbingan konsep tambahan:
          </p>

          <div className="space-y-2">
            {classWeaknesses.length > 0 ? (
              classWeaknesses.map((wk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white border-2 border-amber-300 text-xs font-bold text-amber-950 flex items-start gap-2.5 shadow-2xs hover:border-amber-500 transition-colors"
                >
                  <span className="text-white bg-amber-500 rounded-md w-4 h-4 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">!</span>
                  <span className="leading-snug">{wk}</span>
                </div>
              ))
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 font-bold">
                Semua standard berada pada tahap penguasaan yang sangat memuaskan!
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* 4. 🤖 RINGKASAN ALYA & BUTANG KE ANALISIS AI */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border-2 border-purple-400/60 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <AlyaCharacter size="sm" mood="excited" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-title text-base sm:text-lg font-black text-amber-300 flex items-center gap-1.5 drop-shadow-xs">
                  <span>🤖 Ringkasan Pedagogi Alya</span>
                </h3>
                <span className="text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/30">
                  Formatif AI
                </span>
              </div>
              <p className="text-xs text-purple-100 font-medium mt-0.5">
                Diagnosis pintar berasaskan respons 15 soalan formatif dan DSKP Matematik Tahun 3
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('ai')}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 text-xs font-black shadow-lg cursor-pointer flex items-center gap-2 transition-all hover:scale-103 active:scale-97 border-2 border-amber-300"
          >
            <span>Lihat Analisis AI Lengkap</span>
            <ArrowRight className="w-4 h-4 text-amber-950" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-200 text-xs text-stone-900 leading-relaxed font-semibold space-y-2.5 relative z-10 shadow-md">
          <p className="font-bold text-stone-900 text-xs sm:text-sm leading-relaxed">{alyaSummaryText}</p>
          <div className="pt-2.5 border-t border-indigo-100 flex items-center justify-between flex-wrap gap-2 text-xs text-indigo-950 font-bold">
            <span className="text-indigo-950 flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
              <span>💡</span>
              <span><strong>Petua Mengajar:</strong> Fokuskan manipulasi konkrit (fraction bar & grid 100) bagi topik penukaran peratus.</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigateToTab('ai')}
              className="text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer font-black text-xs hover:underline"
            >
              <span>Buka tab AI Pedagogi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
