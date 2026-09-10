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
          <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">👨‍🎓 Jumlah Murid</span>
              <Users className="w-4 h-4 text-[#D98262]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#4A3728] font-mono">
              {studentsCount}
            </div>
            <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
              Murid berdaftar
            </span>
          </div>

          {/* Card 2: Jumlah Soalan */}
          <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">📝 Soalan</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#4A3728] font-mono">
              {totalQuestions}
            </div>
            <span className="text-[11px] text-stone-400 font-medium mt-0.5 block">
              Topik Pecahan 3.1
            </span>
          </div>

          {/* Card 3: Purata Kelas */}
          <div className="p-4 rounded-3xl bg-white border-2 border-amber-200 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">📊 Purata Kelas</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono">
              {overallAccuracy}%
            </div>
            <span className="text-[11px] text-emerald-700 font-bold mt-0.5 block">
              Ketepatan keseluruhan
            </span>
          </div>

          {/* Card 4: Menguasai (>=70% / TP 4-6) */}
          <div className="p-4 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-emerald-900 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">🟢 Menguasai</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
              {masteredCount}
            </div>
            <span className="text-[11px] text-emerald-800 font-bold mt-0.5 block">
              {masteredPercent}% daripada kelas
            </span>
          </div>

          {/* Card 5: Sedang Menguasai (50-69% / TP 3) */}
          <div className="p-4 rounded-3xl bg-amber-50/80 border-2 border-amber-300 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-amber-900 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">🟡 Sedang</span>
              <AlertCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono">
              {inProgressCount}
            </div>
            <span className="text-[11px] text-amber-800 font-bold mt-0.5 block">
              {inProgressPercent}% pengukuhan
            </span>
          </div>

          {/* Card 6: Perlu Bimbingan (<50% / TP 1-2) */}
          <div className="p-4 rounded-3xl bg-rose-50/80 border-2 border-rose-300 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-rose-900 text-xs font-bold mb-1">
              <span className="uppercase tracking-wider">🔴 Bimbingan</span>
              <HelpCircle className="w-4 h-4 text-rose-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono">
              {needGuidanceCount}
            </div>
            <span className="text-[11px] text-rose-800 font-bold mt-0.5 block">
              {needGuidancePercent}% perlu intervensi
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PRESTASI KESELURUHAN KELAS (CARTA RINGKAS & BAR SEGMEN) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>📈 Prestasi Keseluruhan Kelas</span>
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Taburan tahap penguasaan murid berdasarkan soalan formatif DSKP 3.1
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('charts')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Analisis Carta Terperinci</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Segmented Visual Progress Bar */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-2xl overflow-hidden flex shadow-inner bg-stone-100 p-0.5 border border-stone-200">
            {masteredCount > 0 && (
              <div
                style={{ width: `${(masteredCount / studentsCount) * 100}%` }}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all rounded-l-xl flex items-center justify-center text-white text-[11px] font-black"
                title={`Menguasai: ${masteredCount} murid (${masteredPercent}%)`}
              >
                {masteredPercent > 10 ? `${masteredPercent}%` : ''}
              </div>
            )}
            {inProgressCount > 0 && (
              <div
                style={{ width: `${(inProgressCount / studentsCount) * 100}%` }}
                className="bg-amber-400 hover:bg-amber-500 transition-all flex items-center justify-center text-amber-950 text-[11px] font-black"
                title={`Sedang Menguasai: ${inProgressCount} murid (${inProgressPercent}%)`}
              >
                {inProgressPercent > 10 ? `${inProgressPercent}%` : ''}
              </div>
            )}
            {needGuidanceCount > 0 && (
              <div
                style={{ width: `${(needGuidanceCount / studentsCount) * 100}%` }}
                className="bg-rose-500 hover:bg-rose-600 transition-all rounded-r-xl flex items-center justify-center text-white text-[11px] font-black"
                title={`Perlu Bimbingan: ${needGuidanceCount} murid (${needGuidancePercent}%)`}
              >
                {needGuidancePercent > 10 ? `${needGuidancePercent}%` : ''}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-emerald-950 block">Menguasai (TP 4-6)</span>
                <span className="text-emerald-800 text-[11px]">
                  {masteredCount} orang ({masteredPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-amber-950 block">Sedang Menguasai (TP 3)</span>
                <span className="text-amber-800 text-[11px]">
                  {inProgressCount} orang ({inProgressPercent}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-rose-950 block">Perlu Bimbingan (TP 1-2)</span>
                <span className="text-rose-800 text-[11px]">
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
        {/* Kekuatan Kelas */}
        <section className="bg-white rounded-3xl p-5 border-2 border-emerald-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>💪 Kekuatan Kelas</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Pencapaian Tinggi
            </span>
          </div>

          <p className="text-xs text-stone-600 font-medium">
            Kemahiran yang paling dikuasai oleh murid dengan ketepatan tertinggi:
          </p>

          <div className="space-y-2">
            {classStrengths.length > 0 ? (
              classStrengths.map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-start gap-2"
                >
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>{st}</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
                Data sedang dikumpulkan semasa sesi berlangsung.
              </div>
            )}
          </div>
        </section>

        {/* Perlu Pengukuhan */}
        <section className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base font-bold text-amber-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>🔎 Perlu Pengukuhan</span>
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Fokus Guru
            </span>
          </div>

          <p className="text-xs text-stone-600 font-medium">
            Standard yang mencatat kadar kesilapan lebih tinggi dan memerlukan bimbingan tambahan:
          </p>

          <div className="space-y-2">
            {classWeaknesses.length > 0 ? (
              classWeaknesses.map((wk, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs font-semibold text-amber-950 flex items-start gap-2"
                >
                  <span className="text-amber-600 font-black">⚠️</span>
                  <span>{wk}</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                Semua standard berada pada tahap penguasaan yang sangat memuaskan!
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* 4. 🤖 RINGKASAN ALYA & BUTANG KE ANALISIS AI */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-amber-50/80 rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <AlyaCharacter size="sm" mood="thinking" />
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
                <span>🤖 Ringkasan Pedagogi Alya</span>
                <span className="text-[10px] font-bold bg-indigo-200/80 text-indigo-950 px-2 py-0.5 rounded-full">
                  Formatif AI
                </span>
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Diagnosis automatik berasaskan respons 15 soalan dan DSKP Tahun 3
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab('ai')}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all hover:scale-102"
          >
            <span>➡️ Lihat Analisis AI Lengkap</span>
          </button>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 border border-indigo-200 text-xs text-stone-800 leading-relaxed font-medium space-y-2">
          <p>{alyaSummaryText}</p>
          <div className="pt-2 border-t border-indigo-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-indigo-950 font-bold">
            <span>💡 Petua Mengajar: Fokuskan manipulasi konkrit (fraction bar & grid 100) bagi topik penukaran peratus.</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('ai')}
              className="text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Buka tab AI Pedagogi</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
