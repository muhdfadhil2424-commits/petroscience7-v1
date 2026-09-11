import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Play,
  Brain,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  HelpCircle,
  Eye,
  Hand,
  Headphones,
  Info,
  ArrowRight,
} from 'lucide-react';
import { LearningProfile } from '../types/learningProfile';
import { generateStudentInterventionPlan } from '../utils/interventionManager';
import { InteractiveActivityPlayerModal } from './InteractiveActivityPlayerModal';
import { playSfx } from '../utils/audio';

interface AlyaInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId?: string;
  studentClass?: string;
  profile: LearningProfile | null;
  soundEnabled?: boolean;
  onLaunchFullGame?: (route: 'arena' | 'dapur' | 'pixel', challengeId?: string) => void;
}

export const AlyaInterventionModal: React.FC<AlyaInterventionModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId = 'KP-001',
  studentClass = '5 Piruz',
  profile,
  soundEnabled = true,
  onLaunchFullGame,
}) => {
  const [isActivityPlayerOpen, setIsActivityPlayerOpen] = useState(false);

  // Compute individualized plan based on student's real data
  const plan = React.useMemo(() => {
    return generateStudentInterventionPlan(studentName, studentId, studentClass, profile);
  }, [studentName, studentId, studentClass, profile]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[1350] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-gradient-to-b from-white via-indigo-50/40 to-white text-stone-900 rounded-3xl p-5 sm:p-7 border-4 border-indigo-600 shadow-2xl max-w-2xl w-full my-auto space-y-4.5 max-h-[92vh] overflow-y-auto relative"
          >
            {/* ======================================================== */}
            {/* 1. HEADER & TAJUK UTAMA */}
            {/* ======================================================== */}
            <div className="flex items-start justify-between pb-3 border-b-2 border-indigo-200">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  🤖
                </div>
                <div>
                  <h3 className="font-serif-title text-base sm:text-lg font-black text-indigo-950 tracking-wide flex items-center gap-1.5">
                    <span>CADANGAN INTERVENSI ALYA</span>
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">
                    Pelan Intervensi Pedagogi Individu Mengikut Profil & Kelemahan Murid
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

            {/* ======================================================== */}
            {/* 2. MAKLUMAT MURID: NAMA, KELAS, PRESTASI, KECENDERUNGAN */}
            {/* ======================================================== */}
            <div className="bg-white p-4 rounded-2xl border-2 border-indigo-200 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <h4 className="font-black text-base text-stone-900 tracking-wide">
                      {plan.studentName.toUpperCase()}
                    </h4>
                  </div>
                  <div className="text-xs text-stone-600 font-bold ml-7 mt-0.5">
                    Kelas: <strong className="text-stone-900">{plan.studentClass}</strong>
                    <span className="ml-2 text-stone-500 font-mono">({plan.studentId})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-stone-100 px-3 py-1.5 rounded-xl border-2 border-stone-200 text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Prestasi:</span>
                    <span className="font-mono font-black text-sm text-stone-900">
                      {plan.score}/{plan.totalQuestions}
                    </span>
                  </div>

                  <div className="bg-indigo-100 px-3 py-1.5 rounded-xl border-2 border-indigo-300 text-right">
                    <span className="text-[10px] uppercase font-black text-indigo-900 block">Kecenderungan:</span>
                    <span className="font-black text-xs text-indigo-950 flex items-center gap-1">
                      {plan.dominantModeLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. RINGKASAN ALYA (BAHASA MELAYU STANDARD) */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-r from-indigo-100 via-purple-100/70 to-amber-100/70 p-4 rounded-2xl border-2 border-indigo-300 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                  Ringkasan Alya
                </span>
              </div>
              <p className="text-xs text-stone-900 font-semibold leading-relaxed bg-white/90 p-3 rounded-xl border border-indigo-200">
                “{plan.alyaSummary}”
              </p>
            </div>

            {/* ======================================================== */}
            {/* 4. BAHAGIAN KEKUATAN & PERLU PENGUKUHAN */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kekuatan - 🟢 Emerald */}
              <div className="bg-gradient-to-br from-emerald-100/90 via-teal-50 to-white p-3.5 rounded-2xl border-2 border-emerald-400 shadow-2xs space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <span>💪</span>
                  <span>KEKUATAN</span>
                </span>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {plan.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-emerald-300 shadow-2xs">
                      <span className="text-emerald-700 font-black text-xs shrink-0">✓</span>
                      <span className="font-semibold text-stone-900">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Perlu Pengukuhan - 🟡 Warm Amber */}
              <div className="bg-gradient-to-br from-amber-100/90 via-orange-50 to-white p-3.5 rounded-2xl border-2 border-amber-400 shadow-2xs space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <span>🔎</span>
                  <span>PERLU PENGUKUHAN</span>
                </span>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {plan.weaknesses.map((wk, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-amber-300 shadow-2xs">
                      <span className="text-amber-600 font-black text-xs shrink-0">!</span>
                      <span className="font-semibold text-stone-900">{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 5. ⭐ CADANGAN UTAMA ALYA */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border-2 border-purple-500/50 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/20">
                <span className="text-xs font-black tracking-wider uppercase flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>⭐ CADANGAN UTAMA UNTUK {plan.studentName.toUpperCase()}</span>
                </span>
                <span className="text-[10px] font-black bg-white/20 px-2.5 py-0.5 rounded-full text-white border border-white/30">
                  Kecenderungan + Kelemahan DSKP
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed text-purple-100 bg-white/10 p-3.5 rounded-xl border border-white/15">
                “{plan.primaryRecommendation}”
              </p>
            </div>

            {/* ======================================================== */}
            {/* 6. CADANGAN MENGIKUT 3 PENDEKATAN (BERDASARKAN KEUTAMAAN) */}
            {/* ======================================================== */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>CADANGAN MENGIKUT 3 PENDEKATAN</span>
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  Urutan Keutamaan:{' '}
                  <strong className="text-indigo-900">
                    {plan.approachOrder
                      .map((m) => (m === 'visual' ? '👀 Visual' : m === 'kinesthetic' ? '🖐️ Kinestetik' : '🎧 Auditori'))
                      .join(' → ')}
                  </strong>
                </span>
              </div>

              <div className="space-y-3">
                {plan.approachOrder.map((mode, index) => {
                  if (mode === 'visual') {
                    return (
                      <div key="visual" className="bg-purple-50/80 p-4 rounded-2xl border-2 border-purple-300 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-purple-200">
                          <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                            <span className="text-base">👀</span>
                            <span>PENDEKATAN VISUAL (GAMBAR RAJAH & CARTA)</span>
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-950 border border-purple-300">
                            Keutamaan #{index + 1}
                          </span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
                          {plan.visualApproach.activities.map((act, aIdx) => (
                            <li key={aIdx} className="bg-white p-2.5 rounded-xl border border-purple-200 flex items-start gap-1.5 shadow-2xs">
                              <span className="text-purple-600 font-bold shrink-0">•</span>
                              <span className="font-medium text-stone-800">{act}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-white/90 p-3 rounded-xl border border-purple-200 text-xs text-purple-950">
                          <strong className="text-purple-900">Contoh Praktikal:</strong> “{plan.visualApproach.example}”
                        </div>
                      </div>
                    );
                  }

                  if (mode === 'kinesthetic') {
                    return (
                      <div key="kinesthetic" className="bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-300 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
                          <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                            <span className="text-base">🖐️</span>
                            <span>PENDEKATAN KINESTETIK (MANIPULATIF & HANDS-ON)</span>
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                            Keutamaan #{index + 1}
                          </span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
                          {plan.kinestheticApproach.activities.map((act, aIdx) => (
                            <li key={aIdx} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-start gap-1.5 shadow-2xs">
                              <span className="text-orange-500 font-bold shrink-0">•</span>
                              <span className="font-medium text-stone-800">{act}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                          <strong className="text-amber-900">Contoh Praktikal:</strong> “{plan.kinestheticApproach.example}”
                        </div>
                      </div>
                    );
                  }

                  if (mode === 'auditory') {
                    return (
                      <div key="auditory" className="bg-sky-50/80 p-4 rounded-2xl border-2 border-sky-300 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-sky-200">
                          <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                            <span className="text-base">🎧</span>
                            <span>PENDEKATAN AUDITORI (LISAN & PENERANGAN)</span>
                          </span>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-950 border border-sky-300">
                            Keutamaan #{index + 1}
                          </span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
                          {plan.auditoryApproach.activities.map((act, aIdx) => (
                            <li key={aIdx} className="bg-white p-2.5 rounded-xl border border-sky-200 flex items-start gap-1.5 shadow-2xs">
                              <span className="text-blue-600 font-bold shrink-0">•</span>
                              <span className="font-medium text-stone-800">{act}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-white/90 p-3 rounded-xl border border-sky-200 text-xs text-sky-950">
                          <strong className="text-sky-900">Contoh Praktikal:</strong> “{plan.auditoryApproach.example}”
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* 7. AKTIVITI BOLEH TERUS DIBUKA (🎮 CUBA AKTIVITI) */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎮</span>
                  <div>
                    <h5 className="font-serif-title font-black text-xs sm:text-sm text-emerald-950">
                      AKTIVITI INTERAKTIF TERSEDIA
                    </h5>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Aktiviti digital yang sepadan dengan kelemahan DSKP {plan.launchableActivity.dskpCode} murid
                    </p>
                  </div>
                </div>

                {plan.launchableActivity.launchable ? (
                  <button
                    type="button"
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setIsActivityPlayerOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  >
                    <span>🎮 Cuba Aktiviti</span>
                  </button>
                ) : (
                  <span className="text-xs text-stone-500 italic bg-white px-3 py-1 rounded-xl border border-stone-300">
                    Cadangan aktiviti guru
                  </span>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong className="text-xs text-stone-800 block">
                    {plan.launchableActivity.title}
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    {plan.launchableActivity.description}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {plan.launchableActivity.topicName}
                </span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 8. 📅 PELAN INTERVENSI RINGKAS (4 FASA) */}
            {/* ======================================================== */}
            <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                  📅 Pelan Intervensi Ringkas (4 Fasa)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.phases.map((ph) => (
                  <div key={ph.phase} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950">{ph.title}</span>
                      <span className="text-[10px] font-bold text-stone-400 bg-white px-1.5 py-0.5 rounded-md border border-stone-200">
                        {ph.focus}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                      {ph.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ======================================================== */}
            {/* 9. ⚠️ AMARAN PEDAGOGI */}
            {/* ======================================================== */}
            <div className="flex items-start gap-2 text-[11px] text-stone-500 italic bg-stone-100/90 p-3 rounded-xl border border-stone-200">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                * {plan.disclaimer}
              </span>
            </div>

            {/* ======================================================== */}
            {/* FOOTER ACTIONS */}
            {/* ======================================================== */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Tutup
              </button>

              {plan.launchableActivity.launchable && (
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setIsActivityPlayerOpen(true);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>🎮 Cuba Aktiviti Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Sub-modal: Interactive Activity Player */}
      <InteractiveActivityPlayerModal
        isOpen={isActivityPlayerOpen}
        onClose={() => setIsActivityPlayerOpen(false)}
        activity={plan.launchableActivity}
        studentName={plan.studentName}
        soundEnabled={soundEnabled}
        onLaunchFullGame={onLaunchFullGame}
      />
    </>
  );
};
