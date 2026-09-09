import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Info, Sparkles, Brain, Award, ArrowRight } from 'lucide-react';
import { LearningProfile } from '../types/learningProfile';
import { generateStudentInterventionPlan } from '../utils/interventionManager';
import { AlyaInterventionModal } from './AlyaInterventionModal';
import { playSfx } from '../utils/audio';

interface StudentLearningProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId?: string;
  studentClass?: string;
  performanceScore?: number; // e.g. 13 for 13/15
  totalQuestions?: number; // default 15
  profile: LearningProfile | null;
  soundEnabled?: boolean;
  onLaunchFullGame?: (route: 'arena' | 'dapur' | 'pixel', challengeId?: string) => void;
}

export const StudentLearningProfileModal: React.FC<StudentLearningProfileModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId = 'KP-001',
  studentClass = '3 Asah',
  performanceScore,
  totalQuestions = 15,
  profile,
  soundEnabled = true,
  onLaunchFullGame,
}) => {
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);

  // Compute individualized intervention plan with real data
  const plan = React.useMemo(() => {
    return generateStudentInterventionPlan(studentName, studentId, studentClass, profile);
  }, [studentName, studentId, studentClass, profile]);

  if (!isOpen) return null;

  // Fallback calculations if score is provided or derived from profile
  const rawScore = performanceScore !== undefined ? performanceScore : (profile ? Math.round((profile.visualScore / 100) * totalQuestions) : plan.score);
  const percentage = Math.round((rawScore / totalQuestions) * 100);

  // Status mapping matching Malaysian PBD guidelines
  let statusBadge = '🟢 Menguasai';
  let statusBg = 'bg-emerald-100 text-emerald-950 border-emerald-300';
  if (percentage >= 80) {
    statusBadge = '🟢 Menguasai';
    statusBg = 'bg-emerald-100 text-emerald-950 border-emerald-300';
  } else if (percentage >= 60) {
    statusBadge = '🟡 Sedang Menguasai';
    statusBg = 'bg-amber-100 text-amber-950 border-amber-300';
  } else {
    statusBadge = '🔴 Perlu Bimbingan';
    statusBg = 'bg-rose-100 text-rose-950 border-rose-300';
  }

  const dominantLabel = profile?.dominantLabel || 'Data Belum Mencukupi';
  const dominantMode = profile?.dominantMode || 'insufficient_data';
  const confidence = profile?.confidence || 75;
  const visualScore = profile?.visualScore ?? 0;
  const kinestheticScore = profile?.kinestheticScore ?? 0;
  const auditoryScore = profile?.auditoryScore ?? 0;
  const description = profile?.description || 'Data interaksi murid sedang dikumpulkan untuk analisis pedagogi berterusan.';
  const evidenceList = profile?.evidence && profile.evidence.length > 0
    ? profile.evidence
    : ['Data aktiviti fraction bar dan interaksi pecahan sedang diproses'];

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#FFF8E8] text-[#4A3728] rounded-3xl p-5 sm:p-7 border-4 border-[#F4C95D] shadow-2xl max-w-xl w-full my-auto space-y-4 max-h-[90vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b-2 border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  🧠
                </div>
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950">
                    PROFIL KECENDERUNGAN PEMBELAJARAN
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    Analisis Berpandukan Interaksi Murid
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

            {/* 1. KAD MAKLUMAT MURID & BUTTON CADANGAN INTERVENSI */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">👤</span>
                    <h4 className="font-black text-base text-[#4A3728] tracking-wide">
                      {studentName.toUpperCase()}
                    </h4>
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5 ml-6">
                    Kelas: <strong className="text-stone-800">{studentClass}</strong>
                    {studentId && <span className="ml-2 font-mono text-stone-400">({studentId})</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Prestasi:</span>
                    <span className="font-mono font-black text-sm text-[#4A3728]">
                      {rawScore}/{totalQuestions}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${statusBg}`}>
                      {statusBadge}
                    </span>
                  </div>
                </div>
              </div>

              {/* BUTANG 👩‍🏫 CADANGAN INTERVENSI */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setIsInterventionOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span className="text-base">👩‍🏫</span>
                  <span>Cadangan Intervensi</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* 2. PROFIL KECENDERUNGAN & VISUAL SKOR */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-indigo-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>PROFIL KECENDERUNGAN</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                  🧠 Tahap keyakinan: {confidence}%
                </span>
              </div>

              {/* Visual Progress Bars for 3 Modes */}
              <div className="space-y-3">
                {/* Visual Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">👀</span>
                      <span>Visual</span>
                    </span>
                    <span className="font-mono font-black text-blue-700 text-sm">
                      {visualScore}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/80">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${visualScore}%` }}
                    />
                  </div>
                </div>

                {/* Kinestetik Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">🖐️</span>
                      <span>Kinestetik</span>
                    </span>
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      {kinestheticScore}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/80">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${kinestheticScore}%` }}
                    />
                  </div>
                </div>

                {/* Auditori Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">🎧</span>
                      <span>Auditori</span>
                    </span>
                    <span className="font-mono font-black text-amber-700 text-sm">
                      {auditoryScore}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/80">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${auditoryScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ⭐ Kecenderungan utama */}
              <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-200 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>⭐ Kecenderungan utama:</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-indigo-950 border border-indigo-300 shadow-2xs">
                  {dominantLabel}
                </span>
              </div>
            </div>

            {/* 3. BAHAGIAN KEKUATAN & PERLU PENGUKUHAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 💪 KEKUATAN */}
              <div className="bg-white p-3 rounded-2xl border-2 border-emerald-200 shadow-2xs space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                  <span>💪</span>
                  <span>KEKUATAN</span>
                </span>
                <ul className="space-y-1 text-[11px] text-stone-700">
                  {plan.strengths.slice(0, 3).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                      <span className="text-emerald-600 font-black shrink-0">✓</span>
                      <span className="font-medium">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 🔎 PERLU PENGUKUHAN */}
              <div className="bg-white p-3 rounded-2xl border-2 border-rose-200 shadow-2xs space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1">
                  <span>🔎</span>
                  <span>PERLU PENGUKUHAN</span>
                </span>
                <ul className="space-y-1 text-[11px] text-stone-700">
                  {plan.weaknesses.slice(0, 3).map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-1 bg-rose-50/60 p-1.5 rounded-lg border border-rose-100">
                      <span className="text-rose-500 font-black shrink-0">•</span>
                      <span className="font-medium">{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. 💡 MENGAPA? */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#4A3728] flex items-center gap-1.5">
                <span>💡</span>
                <span>MENGAPA?</span>
              </span>
              <p className="text-xs text-stone-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                “{description}”
              </p>
            </div>

            {/* 5. 📊 BUKTI DARIPADA INTERAKSI */}
            <div className="bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-2xs space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <span>📊</span>
                <span>BUKTI DARIPADA INTERAKSI</span>
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700 font-medium">
                {evidenceList.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <span className="text-emerald-600 font-black shrink-0">✓</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pedagogical Disclaimer Note */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 italic bg-stone-100/80 p-2.5 rounded-xl border border-stone-200">
              <Info className="w-4 h-4 text-stone-400 shrink-0" />
              <span>
                * Profil ini ialah anggaran kecenderungan berdasarkan data interaksi murid. Ia bukan penentuan gaya pembelajaran secara mutlak. Guru digalakkan menggunakan gabungan pendekatan mengikut keperluan murid.
              </span>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setIsInterventionOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>👩‍🏫 Buka Cadangan Intervensi Alya</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#3c4233] hover:bg-[#2d3226] text-[#F4C95D] font-black text-xs cursor-pointer shadow-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Modal Cadangan Intervensi Alya */}
      <AlyaInterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        studentName={studentName}
        studentId={studentId}
        studentClass={studentClass}
        profile={profile}
        soundEnabled={soundEnabled}
        onLaunchFullGame={onLaunchFullGame}
      />
    </>
  );
};

