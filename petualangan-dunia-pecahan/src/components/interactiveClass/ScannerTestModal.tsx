import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Eye,
  CreditCard,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { AnswerOption } from '../../types/interactiveClass';
import {
  parseQrCodeData,
  buildQrPayload,
  formatQrId,
  ANSWER_OPTIONS,
  OPTION_METADATA,
} from '../../utils/studentQrManager';
import { playSfx } from '../../utils/audio';

interface ScannerTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan: (studentId: string, answerOption: AnswerOption, angleDeg: number) => void;
  soundEnabled?: boolean;
}

interface TestCaseResult {
  studentId: string;
  expectedOption: AnswerOption;
  detectedOption?: AnswerOption;
  detectedStudentId?: string;
  isPass: boolean;
  qrPayload: string;
  qrDataUrl?: string;
}

export const ScannerTestModal: React.FC<ScannerTestModalProps> = ({
  isOpen,
  onClose,
  onSimulateScan,
  soundEnabled = true,
}) => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([
    {
      studentId: 'KP-001',
      expectedOption: 'A',
      isPass: false,
      qrPayload: buildQrPayload('KP-001', 'A'),
    },
    {
      studentId: 'KP-002',
      expectedOption: 'B',
      isPass: false,
      qrPayload: buildQrPayload('KP-002', 'B'),
    },
    {
      studentId: 'KP-003',
      expectedOption: 'C',
      isPass: false,
      qrPayload: buildQrPayload('KP-003', 'C'),
    },
    {
      studentId: 'KP-004',
      expectedOption: 'D',
      isPass: false,
      qrPayload: buildQrPayload('KP-004', 'D'),
    },
  ]);

  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<TestCaseResult | null>(null);

  // Run automated decode self-test
  const runSelfTest = async () => {
    setIsRunningTest(true);
    playSfx('click', soundEnabled);

    const updated: TestCaseResult[] = [];

    for (const item of testResults) {
      try {
        const dataUrl = await QRCode.toDataURL(item.qrPayload, {
          width: 240,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        });

        // Test jsQR decode on image
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = dataUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, 240, 240);
          const code = jsQR(imgData.data, 240, 240);

          if (code && code.data) {
            const parsed = parseQrCodeData(code.data);
            const isPass =
              parsed.valid &&
              parsed.studentId === item.studentId &&
              parsed.answerOption === item.expectedOption;

            updated.push({
              ...item,
              detectedOption: parsed.answerOption,
              detectedStudentId: parsed.studentId,
              isPass,
              qrDataUrl: dataUrl,
            });
          } else {
            updated.push({ ...item, isPass: false, qrDataUrl: dataUrl });
          }
        }
      } catch (err) {
        console.warn('Test failed for', item.studentId, err);
        updated.push({ ...item, isPass: false });
      }
    }

    setTestResults(updated);
    setIsRunningTest(false);
    playSfx('fanfare', soundEnabled);
  };

  useEffect(() => {
    if (isOpen) {
      runSelfTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#F4C95D] p-5 sm:p-6 font-rounded max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D98262] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728]">
                🧪 Simulator & Ujian Nyahkod 4 QR
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Sistem 4 QR bebas-orientasi: A, B, C dan D.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="my-3 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={runSelfTest}
            disabled={isRunningTest}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{isRunningTest ? 'Sedang Menguji...' : 'Uji Nyahkod Semua QR'}</span>
          </button>

          <span className="text-xs text-stone-600 font-bold">
            Keputusan: {testResults.filter((t) => t.isPass).length} / {testResults.length} Lulus
          </span>
        </div>

        {/* Test Matrix */}
        <div className="overflow-y-auto flex-1 space-y-3 p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {testResults.map((item) => {
              const meta = OPTION_METADATA[item.expectedOption];

              return (
                <div
                  key={`${item.studentId}-${item.expectedOption}`}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    item.isPass
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                      : 'bg-red-50/90 border-red-300 text-red-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                        <span className="bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded">
                          {item.studentId}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded font-black text-white text-[11px]"
                          style={{ backgroundColor: meta.color }}
                        >
                          QR {item.expectedOption}
                        </span>
                      </div>
                      <p className="text-xs mt-1 font-semibold">
                        Jangkaan: Jawapan {item.expectedOption}
                      </p>
                      {item.detectedOption && (
                        <p className="text-[11px] text-stone-600">
                          Dikesan: {item.detectedStudentId} — {item.detectedOption}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          item.isPass
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {item.isPass ? 'LULUS' : 'GAGAL'}
                      </span>

                      {item.qrDataUrl && (
                        <button
                          type="button"
                          onClick={() => setSelectedPreview(item)}
                          className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950 flex items-center gap-0.5 cursor-pointer mt-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat QR</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Simulate Scan Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playSfx('chime', soundEnabled);
                      onSimulateScan(item.studentId, item.expectedOption, 0);
                    }}
                    className="mt-2 w-full py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span>⚡ Simulasi Imbas Kad Ini</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal QR Code Preview */}
        <AnimatePresence>
          {selectedPreview && (
            <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/80">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-5 rounded-3xl border-4 border-slate-900 max-w-xs text-center flex flex-col items-center"
              >
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Kod QR: {selectedPreview.studentId} — Jawapan {selectedPreview.expectedOption}
                </h4>
                {selectedPreview.qrDataUrl && (
                  <img
                    src={selectedPreview.qrDataUrl}
                    alt="Preview QR"
                    className="w-48 h-48 my-2 border-2 border-slate-900 rounded-xl p-1"
                  />
                )}
                <p className="font-mono text-xs text-slate-500 mb-3">
                  Payload: {selectedPreview.qrPayload}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Tutup
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-amber-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
