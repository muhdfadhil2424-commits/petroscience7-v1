import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { InteractiveClassStudent, AnswerOption } from '../../types/interactiveClass';
import { parseStudentIdIndex } from '../../utils/interactiveClassManager';
import {
  ANSWER_OPTIONS,
  OPTION_METADATA,
  buildQrPayload,
  downloadSingleQr,
  downloadStudentCardPng,
} from '../../utils/studentQrManager';
import { Printer, Download, CheckCircle2 } from 'lucide-react';

interface StudentAnswerCardProps {
  student: InteractiveClassStudent;
  showPrintButton?: boolean;
  showDownloadButtons?: boolean;
  onPrintSingle?: (student: InteractiveClassStudent) => void;
  scale?: 'normal' | 'compact' | 'print';
}

export const StudentAnswerCard: React.FC<StudentAnswerCardProps> = ({
  student,
  showPrintButton = false,
  showDownloadButtons = true,
  onPrintSingle,
  scale = 'normal',
}) => {
  const [qrUrls, setQrUrls] = useState<Record<AnswerOption, string>>({
    A: '',
    B: '',
    C: '',
    D: '',
  });

  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const qrSize = scale === 'print' ? 240 : scale === 'compact' ? 140 : 180;

    Promise.all(
      ANSWER_OPTIONS.map((opt) => {
        const payload = buildQrPayload(student.studentId, opt);
        return QRCode.toDataURL(payload, {
          width: qrSize,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        }).then((url) => ({ opt, url }));
      })
    ).then((results) => {
      if (isMounted) {
        const map: Record<AnswerOption, string> = { A: '', B: '', C: '', D: '' };
        results.forEach((r) => {
          map[r.opt] = r.url;
        });
        setQrUrls(map);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [student.studentId, scale]);

  const studentNum = parseStudentIdIndex(student.studentId);
  const formattedNum = String(studentNum).padStart(2, '0');

  const isPrint = scale === 'print';
  const isCompact = scale === 'compact';

  const handleDownloadFullCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadStudentCardPng(student);
    } catch (err) {
      console.warn('Download card error', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSingle = (e: React.MouseEvent, opt: AnswerOption) => {
    e.stopPropagation();
    downloadSingleQr(student, opt);
  };

  return (
    <div
      className={`relative bg-white text-slate-900 border-4 border-slate-900 rounded-3xl shadow-xl flex flex-col justify-between select-none transition-all ${
        isPrint
          ? 'w-full max-w-[620px] p-6 m-auto print:shadow-none print:break-inside-avoid print:border-4 print:border-black'
          : isCompact
          ? 'w-full max-w-[340px] p-4'
          : 'w-full max-w-[420px] p-5'
      }`}
    >
      {/* CARD HEADER */}
      <div className="text-center border-b-2 border-amber-200 pb-2 mb-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase text-amber-700 tracking-wider">
          <span>🍕 KEMBARA DUNIA PECAHAN</span>
        </div>
        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">
          KAD JAWAPAN 4 QR — KELAS INTERAKTIF
        </h3>
      </div>

      {/* STUDENT IDENTITY BANNER */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-2.5 text-center mb-3">
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-amber-900">
          <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-mono">
            MURID #{formattedNum}
          </span>
          <span className="font-mono bg-slate-900 text-amber-300 px-2 py-0.5 rounded-md">
            {student.studentId}
          </span>
          <span>•</span>
          <span className="text-slate-700 font-semibold">{student.class}</span>
        </div>

        <h4 className="text-base sm:text-lg font-black text-slate-900 uppercase truncate max-w-full mt-1">
          {student.studentName}
        </h4>
      </div>

      {/* 2X2 GRID OF 4 QR CODES (A, B, C, D) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-1">
        {ANSWER_OPTIONS.map((opt) => {
          const meta = OPTION_METADATA[opt];
          const url = qrUrls[opt];

          return (
            <div
              key={opt}
              className={`flex flex-col items-center justify-between p-2.5 rounded-2xl border-3 transition-all ${
                opt === 'A'
                  ? 'bg-blue-50/80 border-blue-500'
                  : opt === 'B'
                  ? 'bg-emerald-50/80 border-emerald-500'
                  : opt === 'C'
                  ? 'bg-amber-50/80 border-amber-500'
                  : 'bg-purple-50/80 border-purple-500'
              }`}
            >
              {/* Option Banner */}
              <div
                className="w-full text-center py-1 px-2 rounded-xl text-white font-black text-xs sm:text-sm tracking-wide shadow-sm flex items-center justify-center gap-1 mb-1.5"
                style={{ backgroundColor: meta.color }}
              >
                <span>{meta.badgeEmoji}</span>
                <span>JAWAPAN {opt}</span>
              </div>

              {/* QR Image Box */}
              <div className="bg-white p-1.5 rounded-xl border-2 border-slate-900 shadow-sm flex items-center justify-center my-0.5">
                {url ? (
                  <img
                    src={url}
                    alt={`QR Kod ${student.studentId}-${opt}`}
                    className={
                      isPrint
                        ? 'w-36 h-36'
                        : isCompact
                        ? 'w-24 h-24'
                        : 'w-28 h-28'
                    }
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center bg-slate-100 text-slate-400 font-mono text-[10px] ${
                      isCompact ? 'w-24 h-24' : 'w-28 h-28'
                    }`}
                  >
                    Menjana...
                  </div>
                )}
              </div>

              {/* QR Code Identifier under each QR */}
              <span className="font-mono font-bold text-[10px] text-slate-700 mt-1">
                {student.studentId}-{opt}
              </span>

              {/* Single Download button for this QR (Screen only) */}
              {showDownloadButtons && !isPrint && (
                <button
                  type="button"
                  onClick={(e) => handleDownloadSingle(e, opt)}
                  className="print:hidden mt-1 text-[9px] font-bold text-slate-600 hover:text-slate-950 underline flex items-center gap-0.5 cursor-pointer"
                  title={`Muat turun fail imej QR ${opt}`}
                >
                  <Download className="w-2.5 h-2.5" />
                  <span>QR {opt}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER INSTRUCTIONS */}
      <div className="mt-3 text-center border-t border-slate-200 pt-2">
        <p className="text-[10px] font-bold text-slate-600">
          💡 Angkat salah satu kod QR (A / B / C / D) menghadap kamera laptop guru.
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              student.cardStatus === 'active'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-2.5 h-2.5" />
            {student.cardStatus === 'active' ? 'Kad Aktif' : 'Nyahaktif'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            4 QR Berasingan
          </span>
        </div>
      </div>

      {/* SCREEN ACTION BUTTONS */}
      {!isPrint && (
        <div className="print:hidden mt-3 pt-2 border-t border-amber-200 flex flex-wrap items-center justify-center gap-2">
          {showDownloadButtons && (
            <button
              type="button"
              onClick={handleDownloadFullCard}
              disabled={isDownloading}
              className="py-1.5 px-3 rounded-xl bg-[#D98262] hover:bg-[#c26e50] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Muat turun imej PNG kad 4 QR penuh murid ini"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Menjana...' : '📥 Muat Turun Set QR'}</span>
            </button>
          )}

          {showPrintButton && onPrintSingle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrintSingle(student);
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>🖨️ Cetak Kad</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
