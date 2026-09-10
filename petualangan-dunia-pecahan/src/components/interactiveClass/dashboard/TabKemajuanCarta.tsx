import React from 'react';
import {
  TrendingUp,
  Award,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  StudentAnalysisResult,
  DskpStandardAnalysis,
  ChallengingQuestionResult,
  SessionHistoryItem,
} from '../../../utils/interactiveDashboardAnalytics';

interface TabKemajuanCartaProps {
  studentsCount: number;
  overallAccuracy: number;
  masteredCount: number;
  inProgressCount: number;
  needGuidanceCount: number;
  dskpAnalysis: DskpStandardAnalysis[];
  rankedStudents: StudentAnalysisResult[];
  hardestQuestions: ChallengingQuestionResult[];
  easiestQuestions: ChallengingQuestionResult[];
  classLearningSummary: {
    visualCount: number;
    kinestheticCount: number;
    auditoryCount: number;
    combinedCount: number;
    averageVisualScore: number;
    averageKinestheticScore: number;
    averageAuditoryScore: number;
  };
  sessionHistory: SessionHistoryItem[];
  isPrivacyMode: boolean;
  onSelectStudent: (studentId: string) => void;
}

export const TabKemajuanCarta: React.FC<TabKemajuanCartaProps> = ({
  studentsCount,
  overallAccuracy,
  masteredCount,
  inProgressCount,
  needGuidanceCount,
  dskpAnalysis,
  rankedStudents,
  hardestQuestions,
  easiestQuestions,
  classLearningSummary,
  sessionHistory,
  isPrivacyMode,
  onSelectStudent,
}) => {
  const getDisplayName = (realName: string, id: string) => {
    if (!isPrivacyMode) return realName;
    return `Murid #${id}`;
  };

  const safeDskpAnalysis = dskpAnalysis || [];
  const safeSessionHistory = sessionHistory || [];
  const safeHardestQuestions = hardestQuestions || [];
  const safeRankedStudents = rankedStudents || [];
  const top3 = safeRankedStudents.slice(0, 3);
  const masteredPercent = studentsCount > 0 ? Math.round((masteredCount / studentsCount) * 100) : 0;
  const inProgressPercent = studentsCount > 0 ? Math.round((inProgressCount / studentsCount) * 100) : 0;
  const needGuidancePercent = studentsCount > 0 ? Math.round((needGuidanceCount / studentsCount) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 2-Column Grid for Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* CARTA 1: PRESTASI KELAS (TABURAN TAHAP PENGUASAAN) */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>📈 Prestasi Kelas (Taburan Penguasaan)</span>
            </h3>
            <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Purata: {overallAccuracy}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Visual breakdown bars */}
            <div>
              <div className="flex justify-between text-xs font-bold text-emerald-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Menguasai (TP 4 - 6)</span>
                </span>
                <span className="font-mono">{masteredCount} orang ({masteredPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${masteredPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-amber-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Sedang Menguasai (TP 3)</span>
                </span>
                <span className="font-mono">{inProgressCount} orang ({inProgressPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${inProgressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-rose-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Perlu Bimbingan (TP 1 - 2)</span>
                </span>
                <span className="font-mono">{needGuidanceCount} orang ({needGuidancePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${needGuidancePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span>Jumlah murid aktif dinilai: <strong>{studentsCount} orang</strong></span>
            <span className="text-emerald-800 font-bold">
              {masteredCount >= 30 ? '🌟 Kelas Mencapai Sasaran PBD' : '💡 Teruskan Pengukuhan'}
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARTA 2: PENGUASAAN DSKP 3.1 (7 STANDARD) */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>📊 Penguasaan 7 Standard DSKP</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">Topik Pecahan 3.1</span>
          </div>

          <div className="space-y-2">
            {safeDskpAnalysis.map((std) => {
              const isHigh = std.percentage >= 80;
              const isMedium = std.percentage >= 65 && std.percentage < 80;

              return (
                <div key={std.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4A3728] flex items-center gap-1.5 truncate max-w-[240px]">
                      <span className="font-mono text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded text-[10px]">
                        {std.code}
                      </span>
                      <span className="truncate">{std.name}</span>
                    </span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        isHigh ? 'text-emerald-800' : isMedium ? 'text-amber-800' : 'text-rose-800'
                      }`}
                    >
                      {std.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${std.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 2-Column Grid for Student Highlights & Questions Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* CARTA 3: PRESTASI MURID (TOP PERFORMERS & PODIUM) */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>🏆 Prestasi Murid (Pencapaian Tertinggi)</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">Top 3 Skor Kelas</span>
          </div>

          <div className="space-y-2.5">
            {top3.map((s, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={s.studentId}
                  onClick={() => onSelectStudent(s.studentId)}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-white border border-amber-200 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{medals[idx]}</span>
                    <div>
                      <h4 className="text-xs font-black text-[#4A3728]">
                        {getDisplayName(s.studentName, s.studentId)}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="font-mono">{s.studentId}</span>
                        <span>•</span>
                        <span className="text-indigo-800 font-bold">
                          {s.learningProfile?.dominantLabel || 'Visual'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      {s.correctCount}/15
                    </span>
                    <span className="text-xs text-stone-400 block font-mono">
                      {s.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-500 italic text-center">
            Klik mana-mana murid untuk melihat laporan PBD dan profil pembelajaran terperinci.
          </p>
        </section>

        {/* ======================================================== */}
        {/* CARTA 4: ITEM YANG MEMERLUKAN PERHATIAN */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>📉 Item yang Memerlukan Perhatian</span>
            </h3>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Kadar Kesilapan Tinggi
            </span>
          </div>

          <div className="space-y-3">
            {safeHardestQuestions.slice(0, 2).map((q) => (
              <div
                key={q.questionId}
                className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-black flex items-center justify-center text-xs">
                      Q{q.questionNumber}
                    </span>
                    <span className="font-mono font-bold text-xs text-rose-950 bg-rose-200/80 px-2 py-0.5 rounded-md">
                      DSKP {q.dskpCode}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-800">
                    Salah: {q.wrongCount} murid ({q.wrongPercentage}%)
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-800 line-clamp-2">
                  "{q.question}"
                </p>

                <p className="text-[11px] text-rose-950 bg-white/80 p-2 rounded-xl border border-rose-200 font-medium">
                  💡 <strong>Petua Alya:</strong> {q.pedagogicalTip}
                </p>
              </div>
            ))}

            {easiestQuestions.length > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Item Paling Dikuasai: Q{easiestQuestions[0].questionNumber} ({easiestQuestions[0].dskpCode})</span>
                </span>
                <span className="font-mono font-bold text-emerald-800">
                  Ketepatan {100 - easiestQuestions[0].wrongPercentage}%
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* CARTA 5: TABURAN PROFIL PEMBELAJARAN KELAS */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-amber-50/80 rounded-3xl p-5 sm:p-6 border-2 border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              🧠
            </div>
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950">
                Profil Pembelajaran Kelas (VARK)
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Pecahan kecenderungan penerimaan konsep matematik bagi 40 murid
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-950 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs">
            4 Mod Utama
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Visual */}
          <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-900">
              <span className="flex items-center gap-1">
                <span>👀</span>
                <span>Visual</span>
              </span>
              <span className="font-mono text-sm font-black">{classLearningSummary.visualCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-500">Purata Skor: {classLearningSummary.averageVisualScore}%</div>
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${classLearningSummary.averageVisualScore}%` }}
              />
            </div>
          </div>

          {/* Kinestetik */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center gap-1">
                <span>🖐️</span>
                <span>Kinestetik</span>
              </span>
              <span className="font-mono text-sm font-black">{classLearningSummary.kinestheticCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-500">Purata Skor: {classLearningSummary.averageKinestheticScore}%</div>
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${classLearningSummary.averageKinestheticScore}%` }}
              />
            </div>
          </div>

          {/* Auditori */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1">
                <span>🎧</span>
                <span>Auditori</span>
              </span>
              <span className="font-mono text-sm font-black">{classLearningSummary.auditoryCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-500">Purata Skor: {classLearningSummary.averageAuditoryScore}%</div>
            <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${classLearningSummary.averageAuditoryScore}%` }}
              />
            </div>
          </div>

          {/* Gabungan */}
          <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-purple-900">
              <span className="flex items-center gap-1">
                <span>🌈</span>
                <span>Gabungan</span>
              </span>
              <span className="font-mono text-sm font-black">{classLearningSummary.combinedCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-500">Keseimbangan Visual + Hands-on</div>
            <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(classLearningSummary.combinedCount / (studentsCount || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SEJARAH SESI (JIKA ADA) */}
      {/* ======================================================== */}
      {safeSessionHistory.length > 0 && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#4A3728] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Sejarah Sesi & Trend Peningkatan Kelas</span>
            </h3>
            <span className="text-xs font-bold text-stone-500">
              {safeSessionHistory.length} Sesi Direkodkan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {safeSessionHistory.map((sess) => (
              <div
                key={sess.sessionId}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#4A3728]">{sess.sessionName}</span>
                  <span className="text-stone-500 font-medium text-[11px]">{sess.date}</span>
                </div>
                <div className="text-2xl font-black text-blue-900 font-mono">
                  {sess.averageAccuracy}%
                </div>
                <span className="text-[11px] text-stone-500 font-medium block">
                  Purata Ketepatan Kelas
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
