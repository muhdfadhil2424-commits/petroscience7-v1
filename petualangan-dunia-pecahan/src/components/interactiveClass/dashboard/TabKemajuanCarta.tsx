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
        <section className="bg-gradient-to-br from-white via-emerald-50/30 to-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>📈 Prestasi Kelas (Taburan Penguasaan)</span>
            </h3>
            <span className="text-xs font-mono font-black text-emerald-950 bg-emerald-200 border border-emerald-400 px-3 py-0.5 rounded-full shadow-2xs">
              Purata: {overallAccuracy}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Visual breakdown bars */}
            <div>
              <div className="flex justify-between text-xs font-black text-emerald-950 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Menguasai (TP 4 - 6)</span>
                </span>
                <span className="font-mono">{masteredCount} orang ({masteredPercent}%)</span>
              </div>
              <div className="w-full h-3.5 bg-emerald-100/70 rounded-full overflow-hidden border border-emerald-200">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${masteredPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-amber-950 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Sedang Menguasai (TP 3)</span>
                </span>
                <span className="font-mono">{inProgressCount} orang ({inProgressPercent}%)</span>
              </div>
              <div className="w-full h-3.5 bg-amber-100/70 rounded-full overflow-hidden border border-amber-200">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${inProgressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-black text-rose-950 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>Perlu Bimbingan (TP 1 - 2)</span>
                </span>
                <span className="font-mono">{needGuidanceCount} orang ({needGuidancePercent}%)</span>
              </div>
              <div className="w-full h-3.5 bg-rose-100/70 rounded-full overflow-hidden border border-rose-200">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${needGuidancePercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/90 rounded-2xl border-2 border-emerald-200 text-xs text-stone-700 flex items-center justify-between font-bold shadow-2xs">
            <span>Jumlah murid aktif dinilai: <strong className="text-stone-900">{studentsCount} orang</strong></span>
            <span className="text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300 font-black">
              {masteredCount >= 30 ? '🌟 Kelas Mencapai Sasaran PBD' : '💡 Teruskan Pengukuhan'}
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CARTA 2: PENGUASAAN DSKP 3.1 (7 STANDARD) */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-white via-indigo-50/30 to-white rounded-3xl p-5 sm:p-6 border-2 border-indigo-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>📊 Penguasaan 7 Standard DSKP</span>
            </h3>
            <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-300">Topik Pecahan 3.1</span>
          </div>

          <div className="space-y-2">
            {safeDskpAnalysis.map((std) => {
              const isHigh = std.percentage >= 80;
              const isMedium = std.percentage >= 65 && std.percentage < 80;

              return (
                <div key={std.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5 truncate max-w-[240px]">
                      <span className="font-mono font-black text-indigo-950 bg-indigo-100 border border-indigo-300 px-1.5 py-0.5 rounded text-[10px]">
                        {std.code}
                      </span>
                      <span className="truncate">{std.name}</span>
                    </span>
                    <span
                      className={`font-mono font-black text-xs ${
                        isHigh ? 'text-emerald-800' : isMedium ? 'text-amber-800' : 'text-rose-800'
                      }`}
                    >
                      {std.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? 'bg-emerald-600' : isMedium ? 'bg-amber-500' : 'bg-rose-600'
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
        <section className="bg-gradient-to-br from-white via-amber-50/30 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>🏆 Prestasi Murid (Pencapaian Tertinggi)</span>
            </h3>
            <span className="text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">Top 3 Skor Kelas</span>
          </div>

          <div className="space-y-2.5">
            {top3.map((s, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={s.studentId}
                  onClick={() => onSelectStudent(s.studentId)}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-100/70 via-amber-50/50 to-white border-2 border-amber-300 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{medals[idx]}</span>
                    <div>
                      <h4 className="text-xs font-black text-stone-900">
                        {getDisplayName(s.studentName, s.studentId)}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5">
                        <span className="font-mono font-bold">{s.studentId}</span>
                        <span>•</span>
                        <span className="text-indigo-900 font-black">
                          {s.learningProfile?.dominantLabel || 'Visual'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-800 text-sm">
                      {s.correctCount}/15
                    </span>
                    <span className="text-xs text-stone-500 block font-mono font-bold">
                      {s.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-500 italic text-center font-medium">
            Klik mana-mana murid untuk melihat laporan PBD dan profil pembelajaran terperinci.
          </p>
        </section>

        {/* ======================================================== */}
        {/* CARTA 4: ITEM YANG MEMERLUKAN PERHATIAN */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-white via-rose-50/30 to-white rounded-3xl p-5 sm:p-6 border-2 border-rose-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-rose-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <span>📉 Item yang Memerlukan Perhatian</span>
            </h3>
            <span className="text-xs font-black text-rose-950 bg-rose-200 px-2.5 py-0.5 rounded-full border border-rose-300">
              Kadar Kesilapan Tinggi
            </span>
          </div>

          <div className="space-y-3">
            {safeHardestQuestions.slice(0, 2).map((q) => (
              <div
                key={q.questionId}
                className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-mono font-black flex items-center justify-center text-xs shadow-2xs">
                      Q{q.questionNumber}
                    </span>
                    <span className="font-mono font-black text-xs text-rose-950 bg-rose-200 px-2 py-0.5 rounded-md border border-rose-300">
                      DSKP {q.dskpCode}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-rose-900">
                    Salah: {q.wrongCount} murid ({q.wrongPercentage}%)
                  </span>
                </div>

                <p className="text-xs font-bold text-stone-900 line-clamp-2">
                  "{q.question}"
                </p>

                <p className="text-[11px] text-rose-950 bg-white/95 p-2 rounded-xl border border-rose-200 font-semibold">
                  💡 <strong>Petua Alya:</strong> {q.pedagogicalTip}
                </p>
              </div>
            ))}

            {easiestQuestions.length > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-100/70 border-2 border-emerald-300 flex items-center justify-between text-xs">
                <span className="text-emerald-950 font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Item Paling Dikuasai: Q{easiestQuestions[0].questionNumber} ({easiestQuestions[0].dskpCode})</span>
                </span>
                <span className="font-mono font-black text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
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
      <section className="bg-gradient-to-br from-purple-100/60 via-amber-100/40 to-sky-100/60 rounded-3xl p-5 sm:p-6 border-2 border-purple-400 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              🧠
            </div>
            <div>
              <h3 className="font-serif-title text-base sm:text-lg font-black text-purple-950">
                Profil Pembelajaran Kelas (VARK)
              </h3>
              <p className="text-xs text-stone-700 font-bold">
                Pecahan kecenderungan penerimaan konsep matematik bagi 40 murid
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-purple-950 bg-white px-3 py-1 rounded-full border-2 border-purple-300 shadow-2xs">
            4 Mod VARK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Visual - Purple */}
          <div className="p-4 rounded-2xl bg-white border-2 border-purple-300 shadow-2xs space-y-1.5 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between text-xs font-black text-purple-950">
              <span className="flex items-center gap-1.5">
                <span className="text-base">👀</span>
                <span>Visual</span>
              </span>
              <span className="font-mono text-sm font-black text-purple-800">{classLearningSummary.visualCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-700 font-bold">Purata Skor: {classLearningSummary.averageVisualScore}%</div>
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-violet-700 rounded-full"
                style={{ width: `${classLearningSummary.averageVisualScore}%` }}
              />
            </div>
          </div>

          {/* Kinestetik - Orange/Amber */}
          <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-2xs space-y-1.5 hover:border-amber-500 transition-all">
            <div className="flex items-center justify-between text-xs font-black text-amber-950">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🖐️</span>
                <span>Kinestetik</span>
              </span>
              <span className="font-mono text-sm font-black text-amber-800">{classLearningSummary.kinestheticCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-700 font-bold">Purata Skor: {classLearningSummary.averageKinestheticScore}%</div>
            <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                style={{ width: `${classLearningSummary.averageKinestheticScore}%` }}
              />
            </div>
          </div>

          {/* Auditori - Sky/Blue */}
          <div className="p-4 rounded-2xl bg-white border-2 border-sky-300 shadow-2xs space-y-1.5 hover:border-sky-500 transition-all">
            <div className="flex items-center justify-between text-xs font-black text-sky-950">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🎧</span>
                <span>Auditori</span>
              </span>
              <span className="font-mono text-sm font-black text-sky-800">{classLearningSummary.auditoryCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-700 font-bold">Purata Skor: {classLearningSummary.averageAuditoryScore}%</div>
            <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden border border-sky-200">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                style={{ width: `${classLearningSummary.averageAuditoryScore}%` }}
              />
            </div>
          </div>

          {/* Gabungan - Teal/Indigo */}
          <div className="p-4 rounded-2xl bg-white border-2 border-indigo-300 shadow-2xs space-y-1.5 hover:border-indigo-500 transition-all">
            <div className="flex items-center justify-between text-xs font-black text-indigo-950">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🌈</span>
                <span>Gabungan</span>
              </span>
              <span className="font-mono text-sm font-black text-indigo-800">{classLearningSummary.combinedCount} orang</span>
            </div>
            <div className="text-[11px] text-stone-700 font-bold">Keseimbangan Visual + Kinestetik</div>
            <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden border border-indigo-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full"
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
        <section className="bg-gradient-to-br from-white via-sky-50/30 to-white rounded-3xl p-5 sm:p-6 border-2 border-sky-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-100">
            <h3 className="font-serif-title text-base sm:text-lg font-black text-sky-950 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              <span>Sejarah Sesi & Trend Peningkatan Kelas</span>
            </h3>
            <span className="text-xs font-black text-sky-950 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
              {safeSessionHistory.length} Sesi Direkodkan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {safeSessionHistory.map((sess) => (
              <div
                key={sess.sessionId}
                className="p-3.5 rounded-2xl bg-white border-2 border-sky-200 space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-black text-stone-900">{sess.sessionName}</span>
                  <span className="text-stone-500 font-bold text-[11px]">{sess.date}</span>
                </div>
                <div className="text-2xl font-black text-sky-900 font-mono">
                  {sess.averageAccuracy}%
                </div>
                <span className="text-[11px] text-stone-600 font-bold block">
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
