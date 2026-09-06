import React, { useState } from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, FileDown } from 'lucide-react';
import { InteractiveClassStudent } from '../../types/interactiveClass';
import { StudentAnswerCard } from './StudentAnswerCard';
import { downloadAllClassQrsZip } from '../../utils/studentQrManager';

interface PrintCardsModalProps {
  isOpen: boolean;
  classNameTitle: string;
  students: InteractiveClassStudent[];
  singleStudent?: InteractiveClassStudent | null;
  onClose: () => void;
}

export const PrintCardsModal: React.FC<PrintCardsModalProps> = ({
  isOpen,
  classNameTitle,
  students,
  singleStudent,
  onClose,
}) => {
  const [layoutMode, setLayoutMode] = useState<'single-page' | 'two-per-page'>('single-page');
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null);

  if (!isOpen) return null;

  const targetStudents = singleStudent ? [singleStudent] : students;

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    setZipProgress({ current: 0, total: targetStudents.length });

    try {
      await downloadAllClassQrsZip(targetStudents, classNameTitle, (curr, total) => {
        setZipProgress({ current: curr, total });
      });
    } catch (err) {
      console.warn('Gagal memuat turun zip:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#F4C95D] p-4 sm:p-6 flex flex-col max-h-[94vh] font-rounded print:max-w-none print:max-h-none print:border-none print:shadow-none print:p-0 print:bg-white">
        
        {/* Top Header - Screen Only */}
        <div className="print:hidden flex items-center justify-between gap-3 border-b-2 border-amber-200 pb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728]">
                {singleStudent
                  ? `🖨️ Cetak Kad 4 QR: ${singleStudent.studentName} (${singleStudent.studentId})`
                  : `🖨️ Cetak Semua Kad (4 QR Setiap Murid) — Kelas ${classNameTitle}`}
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                {targetStudents.length} murid ({targetStudents.length * 4} kod QR berasingan: A, B, C, D).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Batch ZIP download */}
            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="px-3.5 py-2 rounded-xl bg-[#D98262] hover:bg-[#c26e50] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              title="Muat turun fail ZIP mengandungi semua kad PNG dan QR berasingan"
            >
              <Download className="w-4 h-4" />
              <span>
                {isZipping && zipProgress
                  ? `Menjana ZIP (${zipProgress.current}/${zipProgress.total})...`
                  : '📥 Muat Turun Semua QR (ZIP)'}
              </span>
            </button>

            {/* Print / Save PDF button */}
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              title="Cetak atau simpan sebagai fail PDF"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Instruction Banner - Screen Only */}
        <div className="print:hidden my-3 p-3 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="text-base">💡</span>
            <span>
              <strong>Panduan Cetak A4:</strong> Dalam tetingkap cetakan pelayar, pilih <em>"Save as PDF"</em> untuk menjana fail PDF, atau pilih pencetak fizikal. Gunakan orientasi <strong>Potret (Portrait)</strong> dengan skala <strong>100%</strong>.
            </span>
          </div>

          {!singleStudent && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Susun Atur:</span>
              <button
                type="button"
                onClick={() => setLayoutMode('single-page')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  layoutMode === 'single-page'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-amber-300'
                }`}
              >
                1 Murid / Halaman A4
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('two-per-page')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  layoutMode === 'two-per-page'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-amber-300'
                }`}
              >
                2 Murid / Halaman
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Preview on Screen / Print Sheet with Page Breaks */}
        <div
          id="printable-cards-area"
          className="overflow-y-auto flex-1 p-3 bg-stone-100/90 rounded-2xl border-2 border-stone-200 print:bg-white print:border-none print:p-0 print:overflow-visible"
        >
          <style>{`
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              .page-break-always {
                page-break-after: always !important;
                break-after: page !important;
                padding-top: 15mm !important;
                padding-bottom: 15mm !important;
              }
              .page-break-two {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 15mm !important;
              }
            }
          `}</style>

          <div
            className={`w-full flex flex-col items-center gap-6 print:gap-0 ${
              layoutMode === 'two-per-page' ? 'print:block' : ''
            }`}
          >
            {targetStudents.map((st, index) => {
              const isPageBreak =
                layoutMode === 'single-page' ||
                (layoutMode === 'two-per-page' && (index + 1) % 2 === 0);

              return (
                <div
                  key={st.studentId}
                  className={`w-full flex flex-col items-center print:w-full ${
                    isPageBreak ? 'page-break-always' : 'page-break-two'
                  }`}
                >
                  <StudentAnswerCard
                    student={st}
                    scale={layoutMode === 'single-page' ? 'print' : 'compact'}
                    showPrintButton={false}
                    showDownloadButtons={true}
                  />

                  {/* Cut / Page Guide indicator on screen */}
                  <div className="print:hidden text-[11px] text-stone-400 font-mono mt-2 mb-4 flex items-center gap-1.5">
                    <span>✂️ Halaman #{index + 1}: {st.studentName} ({st.studentId})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info - Screen only */}
        <div className="print:hidden mt-3 flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-amber-200 flex-wrap gap-2">
          <span>
            Jumlah: <strong>{targetStudents.length}</strong> set kad murid ({targetStudents.length * 4} QR unik: A, B, C, D)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold cursor-pointer"
            >
              Tutup Pratonton
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
