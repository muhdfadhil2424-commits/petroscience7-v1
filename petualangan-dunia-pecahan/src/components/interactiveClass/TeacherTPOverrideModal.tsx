import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  BookOpen,
  Info,
  UserCheck,
} from 'lucide-react';
import {
  DSKP_TP_DEFINITIONS,
  saveTeacherTPOverride,
  TeacherTPRecord,
} from '../../utils/teacherTpOverrideManager';
import { playSfx } from '../../utils/audio';

interface TeacherTPOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  studentClass: string;
  systemTP: number;
  currentTeacherTP: number | null;
  initialReason?: string;
  scoreInfo?: {
    correctCount: number;
    totalAnswered: number;
    percentage: number;
  };
  soundEnabled?: boolean;
  onSaved: (savedRecord: TeacherTPRecord) => void;
}

const QUICK_REASON_CHIPS = [
  'Murid menunjukkan penguasaan yang lebih baik semasa aktiviti kelas berbanding prestasi kuiz.',
  'Pemerhatian bilik darjah menunjukkan murid faham konsep pecahan konkrit secara mendalam.',
  'Murid memerlukan bimbingan tambahan bagi penulisan bentuk termudah walaupun kuiz memuaskan.',
  'Murid aktif membimbing rakan sebaya dan menunjukkan penaakulan matematik luar biasa (KBAT).',
  'Murid mengalami kekangan masa semasa sesi imbasan tetapi telah menguasai kemahiran asas.',
];

export const TeacherTPOverrideModal: React.FC<TeacherTPOverrideModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  studentClass,
  systemTP,
  currentTeacherTP,
  initialReason = '',
  scoreInfo,
  soundEnabled = true,
  onSaved,
}) => {
  const [selectedTP, setSelectedTP] = useState<number>(currentTeacherTP ?? systemTP);
  const [reason, setReason] = useState<string>(initialReason);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDef = DSKP_TP_DEFINITIONS[selectedTP] || DSKP_TP_DEFINITIONS[systemTP];
  const isDifferentFromAI = selectedTP !== systemTP;

  const handleSave = () => {
    if (selectedTP < 1 || selectedTP > 6) {
      setErrorMsg('Sila pilih Tahap Penguasaan yang sah antara TP 1 hingga TP 6.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      playSfx('chime', soundEnabled);
      const saved = saveTeacherTPOverride({
        studentId,
        studentClass,
        systemTP,
        teacherTP: selectedTP,
        teacherTPReason: reason.trim(),
        teacherName: 'Guru Matematik',
      });

      onSaved(saved);
      onClose();
    } catch (err) {
      console.error('[TeacherTPOverrideModal] Failed to save:', err);
      setErrorMsg('Gagal menyimpan penetapan TP. Sila cuba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playSfx('click', soundEnabled);
          onClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
                <span>✏️ Edit Tahap Penguasaan</span>
              </h3>
              <p className="text-xs text-stone-300 font-semibold">
                Pertimbangan Profesional & Keputusan Akhir oleh Guru
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors border border-stone-600"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-stone-800 text-sm">
          {/* Student Profile Summary Pill */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border-2 border-stone-200 flex items-center justify-between flex-wrap gap-2 shadow-2xs">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Nama Murid:
              </span>
              <h4 className="font-serif-title text-base sm:text-lg font-black text-stone-950">
                {studentName}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-stone-900 text-amber-300 font-mono text-[11px] font-black px-2 py-0.5 rounded-md">
                  {studentId}
                </span>
                <span className="bg-amber-100 text-amber-950 font-bold text-[11px] px-2 py-0.5 rounded-md border border-amber-300">
                  Kelas: {studentClass}
                </span>
              </div>
            </div>

            {scoreInfo && (
              <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-[10px] font-bold text-stone-500 block">Prestasi Sesi</span>
                <div className="font-mono text-sm font-black text-stone-900">
                  {scoreInfo.correctCount} / {scoreInfo.totalAnswered || 15} betul{' '}
                  <span className="text-emerald-700 font-black">({scoreInfo.percentage}%)</span>
                </div>
              </div>
            )}
          </div>

          {/* Side-by-side / Comparison Panel */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-700 block uppercase tracking-wider">
              Perbandingan Cadangan AI vs Ketetapan Guru:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AI System Suggestion Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-3.5 border-2 border-indigo-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-indigo-950 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>🤖 TP Sistem/AI</span>
                  </span>
                  <span className="bg-indigo-100 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-300">
                    Cadangan
                  </span>
                </div>
                <div className="text-2xl font-black text-indigo-950 font-mono my-1">
                  TP {systemTP}
                </div>
                <p className="text-[11px] text-indigo-800 leading-snug font-medium">
                  Berdasarkan data respons & ketepatan 15 soalan formatif murid.
                </p>
              </div>

              {/* Teacher Decision Card */}
              <div
                className={`rounded-2xl p-3.5 border-2 shadow-xs transition-all ${
                  isDifferentFromAI
                    ? 'bg-gradient-to-br from-amber-50 to-white border-amber-400 ring-2 ring-amber-300/50'
                    : 'bg-gradient-to-br from-teal-50 to-white border-teal-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-stone-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-950">👨‍🏫 TP Guru</span>
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      isDifferentFromAI
                        ? 'bg-amber-200 text-amber-950 border-amber-400'
                        : 'bg-teal-100 text-teal-950 border-teal-300'
                    }`}
                  >
                    Keputusan Akhir
                  </span>
                </div>
                <div className="text-2xl font-black text-stone-900 font-mono my-1">
                  TP {selectedTP}
                </div>
                <p className="text-[11px] text-stone-700 leading-snug font-medium">
                  Penetapan profesional guru berdasarkan pertimbangan bilik darjah.
                </p>
              </div>
            </div>

            {/* Status Change Indicator */}
            {isDifferentFromAI ? (
              <div className="p-2.5 rounded-xl bg-amber-100/90 border-2 border-amber-400 text-amber-950 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>🟠 TP telah diubah oleh guru:</strong> Nilai ini akan mengatasi cadangan AI
                  (TP {systemTP} ➔ TP {selectedTP}) untuk semua laporan dan statistik.
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-950 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>🔵 Sama dengan cadangan AI:</strong> Guru mengesahkan bahawa TP {systemTP} adalah
                  tepat mengikut prestasi murid.
                </span>
              </div>
            )}
          </div>

          {/* TP Selector (Interactive Grid / Dropdown) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-800 flex items-center justify-between">
              <span className="uppercase tracking-wider">Pilih Tahap Penguasaan (TP Guru):</span>
              <span className="text-[11px] text-stone-500 font-normal">Pilih TP 1 hingga TP 6</span>
            </label>

            {/* Visual selector buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((tp) => {
                const isSelected = selectedTP === tp;
                const isAiTp = systemTP === tp;
                return (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setSelectedTP(tp);
                    }}
                    className={`py-2.5 px-2 rounded-2xl border-2 font-mono flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-400 border-stone-900 text-stone-950 shadow-md scale-102 font-black'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    {isAiTp && (
                      <span className="absolute -top-2 bg-indigo-600 text-white text-[9px] font-sans font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                        AI
                      </span>
                    )}
                    <span className="text-base font-black">TP {tp}</span>
                    <span className="text-[9px] font-sans font-bold leading-none mt-0.5 opacity-80">
                      {tp >= 5 ? 'Cemerlang' : tp >= 4 ? 'Kukuh' : tp === 3 ? 'Sederhana' : 'Bimbingan'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Penerangan TP Berdasarkan DSKP */}
          <div className="bg-stone-50 rounded-2xl p-4 border-2 border-stone-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-stone-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Kriteria DSKP: {currentDef.title}</span>
              </span>
              <span className="text-[10px] text-stone-500 font-bold">DSKP Matematik Tahun 3</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium bg-white p-2.5 rounded-xl border border-stone-200">
              {currentDef.standardCriteria}
            </p>
          </div>

          {/* Catatan / Alasan Guru */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="teacher-reason" className="text-xs font-black text-stone-800 uppercase tracking-wider">
                Sebab / Catatan Guru:
              </label>
              <span className="text-[11px] text-stone-500 italic">
                (Digalakkan untuk rekod justifikasi pentaksiran)
              </span>
            </div>

            <textarea
              id="teacher-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan sebab guru menetapkan TP ini... (Contoh: Murid menunjukkan penguasaan yang lebih baik semasa aktiviti kelas berbanding prestasi kuiz.)"
              className="w-full p-3 rounded-2xl border-2 border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-300/50 outline-none text-xs leading-relaxed text-stone-900 font-medium"
            />

            {/* Quick Reason Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-500 block">
                Pilihan Catatan Pantas (Klik untuk isi):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REASON_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setReason(chip);
                    }}
                    className="text-[11px] bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-950 px-2.5 py-1 rounded-xl border border-stone-200 hover:border-amber-300 transition-colors text-left"
                  >
                    + {chip.slice(0, 48)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-400 text-rose-950 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 p-4 sm:p-5 border-t-2 border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              playSfx('click', soundEnabled);
              onClose();
            }}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-black transition-all cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer hover:scale-102"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : '💾 SIMPAN TP'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
