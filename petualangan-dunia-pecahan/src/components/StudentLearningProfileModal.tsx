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
  studentClass = '5 Piruz',
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
  let statusBadge = 'Belum Ada Data';
  let statusBg = 'bg-stone-100 text-stone-600 border-stone-300';
  if (percentage >= 80) {
    statusBadge = '🟢 Menguasai';
    statusBg = 'bg-emerald-600 text-white border-emerald-400 shadow-2xs';
  } else if (percentage >= 60) {
    statusBadge = '🟡 Sedang Menguasai';
    statusBg = 'bg-amber-400 text-amber-950 border-amber-300 shadow-2xs';
  } else {
    statusBadge = '🔴 Perlu Bimbingan';
    statusBg = 'bg-rose-600 text-white border-rose-400 shadow-2xs';
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
            className="bg-[#FFFDF7] text-[#4A3728] rounded-3xl p-5 sm:p-7 border-4 border-[#F4C95D] shadow-2xl max-w-xl w-full my-auto space-y-4 max-h-[90vh] overflow-y-auto relative"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b-2 border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                  🧠
                </div>
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950">
                    PROFIL KECENDERUNGAN PEMBELAJARAN
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    Analisis Berpandukan Interaksi & Respons Murid
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

              {/* BUTANG 👩‍🏫 CADANGAN INTERVENSI - VIBRANT PURPLE/INDIGO */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setIsInterventionOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span className="text-base">👩‍🏫</span>
                  <span>Buka Cadangan Intervensi Alya</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* 2. PROFIL KECENDERUNGAN & VISUAL SKOR (COLOR-CODED) */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-indigo-200 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>PROFIL KECENDERUNGAN</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Tahap keyakinan: {confidence}%
                </span>
              </div>

              {/* Visual Progress Bars for 3 Modes: Visual=Purple, Kinesthetic=Orange, Auditory=Blue */}
              <div className="space-y-2.5">
                {/* Visual Bar - 🟣 Purple */}
                <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">👀</span>
                      <span>Visual (Gambar, Carta, Bar Pecahan)</span>
                    </span>
                    <span className="font-mono font-black text-purple-900 text-sm">
                      {visualScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-purple-100 rounded-full overflow-hidden p-0.5 border border-purple-200">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${visualScore}%` }}
                    />
                  </div>
                </div>

                {/* Kinestetik Bar - 🟠 Orange/Amber */}
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">🖐️</span>
                      <span>Kinestetik (Hands-on, Lipatan, Manipulatif)</span>
                    </span>
                    <span className="font-mono font-black text-amber-950 text-sm">
                      {kinestheticScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${kinestheticScore}%` }}
                    />
                  </div>
                </div>

                {/* Auditori Bar - 🔵 Blue/Cyan */}
                <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-950">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">🎧</span>
                      <span>Auditori (Penerangan, Nyanyian & Soal Jawab)</span>
                    </span>
                    <span className="font-mono font-black text-sky-950 text-sm">
                      {auditoryScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${auditoryScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ⭐ Kecenderungan utama */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 p-3 rounded-xl border border-indigo-200 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>⭐ Kecenderungan utama:</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                  dominantMode === 'visual'
                    ? 'bg-purple-600 text-white'
                    : dominantMode === 'kinesthetic'
                    ? 'bg-amber-500 text-white'
                    : dominantMode === 'auditory'
                    ? 'bg-blue-600 text-white'
                    : dominantMode === 'combined'
                    ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white'
                    : 'bg-white text-indigo-950 border border-indigo-300'
                }`}>
                  {dominantLabel}
                </span>
              </div>
            </div>

            {/* 3. BAHAGIAN KEKUATAN & PERLU PENGUKUHAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 💪 KEKUATAN - 🟢 Emerald */}
              <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-white p-3.5 rounded-2xl border-2 border-emerald-300 shadow-2xs space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1">
                  <span>💪</span>
                  <span>KEKUATAN</span>
                </span>
                <ul className="space-y-1 text-[11px] text-stone-700">
                  {plan.strengths.slice(0, 3).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-emerald-600 font-black shrink-0">✓</span>
                      <span className="font-medium">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 🔎 PERLU PENGUKUHAN - 🟡 Warm Amber */}
              <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/30 to-white p-3.5 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
                  <span>🔎</span>
                  <span>PERLU PENGUKUHAN</span>
                </span>
                <ul className="space-y-1 text-[11px] text-stone-700">
                  {plan.weaknesses.slice(0, 3).map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
                      <span className="text-amber-500 font-black shrink-0">!</span>
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

