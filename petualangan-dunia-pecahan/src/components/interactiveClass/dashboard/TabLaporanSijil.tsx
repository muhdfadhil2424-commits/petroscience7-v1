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

  // Students eligible for Certificate: mastered (percentage >= 70% or suggestedTP >= 4)
  const eligibleStudents = students.filter((s) => s.percentage >= 70 || s.suggestedTP >= 4);

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
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs">
                📄
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200">
                PBD Formatif Rasmi
              </span>
            </div>
            <h3 className="font-serif-title text-base sm:text-lg font-black text-slate-900">
              Dokumen Pentaksiran Bilik Darjah (PBD)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Cetak atau simpan ke PDF dokumen laporan rasmi yang mengandungi perincian skor, cadangan Tahap Penguasaan (TP), standard DSKP 3.1, dan ruangan tanda tangan guru serta pentadbir.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-stone-500 font-bold">
              Format: Siap Cetak (A4 / PDF)
            </span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenPrintModal();
              }}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-transform hover:scale-102"
            >
              <Printer className="w-4 h-4" />
              <span>Pra-Tonton & Cetak Laporan</span>
            </button>
          </div>
        </section>

        {/* Document 2: Eksport Rekod CSV (Excel) */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                📥
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Data Lengkap Excel
              </span>
            </div>
            <h3 className="font-serif-title text-base sm:text-lg font-black text-emerald-950">
              Eksport Fail CSV / Spreadsheet
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Muat turun rekod data mentah 40 murid, skor pecahan, status TP, kecenderungan pembelajaran, dan rekod respons untuk rujukan fail panitia dan pentaksiran luar talian.
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-emerald-800 font-bold">
              Fail: rekod_sesi_{selectedClass}.csv
            </span>
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onExportCSV();
              }}
              className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 transition-transform hover:scale-102"
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
              <h3 className="font-serif-title text-base sm:text-lg font-black text-[#4A3728] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>📜 Sijil Pencapaian Master Pecahan Murid</span>
              </h3>
              <span className="bg-amber-100 text-amber-950 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                {eligibleStudents.length} / {students.length} Murid Layak
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
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
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold focus:border-amber-400 focus:outline-none bg-stone-50"
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
                className={`p-3.5 rounded-2xl border-2 space-y-2.5 transition-all flex flex-col justify-between ${
                  isEligible
                    ? 'bg-gradient-to-br from-amber-50/70 to-white border-amber-300 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-[#4A3728]">
                      {getDisplayName(student.studentName, student.studentId)}
                    </h4>
                    <span className="font-mono text-[11px] text-stone-500">{student.studentId}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-black ${
                        isEligible ? 'text-emerald-800' : 'text-stone-600'
                      }`}
                    >
                      {student.correctCount}/15
                    </span>
                    <span className="text-[10px] text-stone-400 block">({student.percentage}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      isEligible
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {isEligible ? '🏆 Layak Sijil (TP ' + student.suggestedTP + ')' : '⏳ Perlu Pengukuhan'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      onOpenCertificate(student);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1 cursor-pointer transition-all ${
                      isEligible
                        ? 'bg-amber-500 hover:bg-amber-600 text-amber-950 hover:text-white'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
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
