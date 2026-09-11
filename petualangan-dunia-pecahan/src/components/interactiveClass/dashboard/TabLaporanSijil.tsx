import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileSpreadsheet,
  Award,
  Sparkles,
  CheckCircle2,
  Download,
  Calendar,
  Search,
} from 'lucide-react';
import { StudentAnalysisResult } from '../../../utils/interactiveDashboardAnalytics';
import { playSfx } from '../../../utils/audio';

interface TabLaporanSijilProps {
  students: StudentAnalysisResult[];
  selectedClass: string;
  currentDateStr: string;
  overallAccuracy: number;
  soundEnabled: boolean;
  isPrivacyMode: boolean;
  onOpenPrintModal: () => void;
  onExportCSV: () => void;
  onOpenCertificate: (student: StudentAnalysisResult) => void;
}

export const TabLaporanSijil: React.FC<TabLaporanSijilProps> = ({
  students,
  selectedClass,
  currentDateStr,
  overallAccuracy,
  soundEnabled,
  isPrivacyMode,
  onOpenPrintModal,
  onExportCSV,
  onOpenCertificate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getDisplayName = (realName: string, id: string) => {
    if (!isPrivacyMode) return realName;
    return `Murid #${id}`;
  };

  // Students eligible for Certificate: mastered (percentage >= 70% or effectiveTP >= 4)
  const eligibleStudents = students.filter((s) => s.percentage >= 70 || (s.effectiveTP ?? s.suggestedTP) >= 4);

  const filteredList = students.filter((s) => {
    const name = getDisplayName(s.studentName, s.studentId).toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || s.studentId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document 1: Laporan Rasmi Pentaksiran PBD */}
        <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-indigo-400 shadow-lg space-y-4 flex flex-col justify-between text-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-xs">
                📄
              </div>
              <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-2xs">
                PBD Formatif Rasmi
              </span>
            </div>
            <h3 className="font-serif-title text-base sm:text-lg font-black text-amber-300">
              Dokumen Pentaksiran Bilik Darjah (PBD)
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              Cetak atau simpan ke PDF dokumen laporan rasmi yang mengandungi perincian skor, cadangan Tahap Penguasaan (TP), standard DSKP 3.1, dan ruangan tanda tangan guru serta pentadbir.
            </p>
          </div>

          <div className="pt-3 border-t border-indigo-800/80 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-indigo-200 font-bold">
              Format: Siap Cetak (A4 / PDF)
            </span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenPrintModal();
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Pra-Tonton & Cetak Laporan</span>
            </button>
          </div>
        </section>

        {/* Document 2: Eksport Rekod CSV (Excel) */}
        <section className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 shadow-lg space-y-4 flex flex-col justify-between text-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-xs">
                📥
              </div>
              <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full shadow-2xs">
                Data Lengkap Excel
              </span>
            </div>
            <h3 className="font-serif-title text-base sm:text-lg font-black text-emerald-300">
              Eksport Fail CSV / Spreadsheet
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed font-medium">
              Muat turun rekod data mentah 40 murid, skor pecahan, status TP, kecenderungan pembelajaran, dan rekod respons untuk rujukan fail panitia dan pentaksiran luar talian.
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-emerald-200 font-bold">
              Fail: rekod_sesi_{selectedClass}.csv
            </span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onExportCSV();
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-2 transition-transform hover:scale-105"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Muat Turun Fail CSV</span>
            </button>
          </div>
        </section>
      </div>

      {/* Sijil Master Pecahan Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif-title text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>📜 Sijil Pencapaian Master Pecahan Murid</span>
              </h3>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                {eligibleStudents.length} / {students.length} Murid Layak
              </span>
            </div>
            <p className="text-xs text-stone-600 font-bold mt-1">
              Jana dan cetak Sijil Pencapaian bergrafik rasmi bagi murid yang menunjukkan penguasaan cemerlang
            </p>
          </div>

          {/* Search Murid for Certificate */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari murid untuk sijil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border-2 border-stone-200 text-xs font-semibold focus:border-amber-400 focus:outline-none bg-stone-50"
            />
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.map((student) => {
            const isEligible = student.percentage >= 70 || student.suggestedTP >= 4;

            return (
              <div
                key={student.studentId}
                className={`p-4 rounded-2xl border-2 space-y-2.5 transition-all flex flex-col justify-between ${
                  isEligible
                    ? 'bg-gradient-to-br from-amber-100/80 via-amber-50/40 to-white border-amber-400 shadow-xs'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-stone-900">
                      {getDisplayName(student.studentName, student.studentId)}
                    </h4>
                    <span className="font-mono text-[11px] text-stone-500 font-bold">{student.studentId}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-black ${
                        isEligible ? 'text-emerald-700' : 'text-stone-700'
                      }`}
                    >
                      {student.correctCount}/15
                    </span>
                    <span className="text-[10px] text-stone-500 font-bold block">({student.percentage}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span
                    className={`font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1 ${
                      isEligible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}
                  >
                    <span>
                      {isEligible
                        ? `🏆 Layak Sijil (TP ${student.effectiveTP ?? student.suggestedTP})`
                        : '⏳ Perlu Pengukuhan'}
                    </span>
                    {student.isTeacherOverride && (
                      <span className="text-[9px] bg-amber-200 text-amber-950 px-1 py-0.2 rounded font-black border border-amber-400">
                        Guru
                      </span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      onOpenCertificate(student);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1 cursor-pointer transition-all ${
                      isEligible
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white shadow-md hover:scale-105'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                    }`}
                  >
                    <span>📜 Buka Sijil</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
