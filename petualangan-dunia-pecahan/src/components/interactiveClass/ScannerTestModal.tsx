import React, { useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Play,
  Eye,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { AnswerOption, InteractiveClassStudent } from '../../types/interactiveClass';
import {
  parseQrCodeData,
  validateScannedStudent,
  buildQrPayload,
  generateQrDataUrl,
  OPTION_METADATA,
} from '../../utils/studentQrManager';
import { playSfx } from '../../utils/audio';

interface ScannerTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan: (studentId: string, answerOption: AnswerOption, angleDeg: number) => void;
  soundEnabled?: boolean;
  students?: InteractiveClassStudent[];
}

interface TestCaseItem {
  id: string;
  category: 'valid_adam' | 'valid_second' | 'legacy_printed' | 'invalid_student' | 'invalid_app' | 'invalid_answer';
  title: string;
  rawPayload: string;
  studentId?: string;
  expectedOption?: AnswerOption;
  expectedOutcome: 'VALID' | 'ERROR';
  expectedErrorSnippet?: string;
  detectedStudentId?: string;
  detectedOption?: AnswerOption;
  detectedError?: string;
  isPass: boolean;
  qrDataUrl?: string;
}

export const ScannerTestModal: React.FC<ScannerTestModalProps> = ({
  isOpen,
  onClose,
  onSimulateScan,
  soundEnabled = true,
  students = [],
}) => {
  const initialTestCases: TestCaseItem[] = [
    // ========================================================
    // TEST WAJIB: QR FIZIKAL / TERCETAK YANG DIGUNAKAN MURID
    // ========================================================
    {
      id: 'test-legacy-adam-a',
      category: 'legacy_printed',
      title: 'Kad Tercetak: KP-001-A → Adam Hakimi → A',
      rawPayload: 'KP-001-A',
      studentId: 'KP-001',
      expectedOption: 'A',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    {
      id: 'test-legacy-adam-b',
      category: 'legacy_printed',
      title: 'Kad Tercetak: KP-001-B → Adam Hakimi → B',
      rawPayload: 'KP-001-B',
      studentId: 'KP-001',
      expectedOption: 'B',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    {
      id: 'test-legacy-adam-c',
      category: 'legacy_printed',
      title: 'Kad Tercetak: KP-001-C → Adam Hakimi → C',
      rawPayload: 'KP-001-C',
      studentId: 'KP-001',
      expectedOption: 'C',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    {
      id: 'test-legacy-adam-d',
      category: 'legacy_printed',
      title: 'Kad Tercetak: KP-001-D → Adam Hakimi → D',
      rawPayload: 'KP-001-D',
      studentId: 'KP-001',
      expectedOption: 'D',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    // Murid 2 Kad Tercetak (KP-002)
    {
      id: 'test-legacy-student-2-a',
      category: 'valid_second',
      title: 'Murid 2 Tercetak: KP-002-A → Aisyah Sofea → A',
      rawPayload: 'KP-002-A',
      studentId: 'KP-002',
      expectedOption: 'A',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    {
      id: 'test-legacy-student-2-b',
      category: 'valid_second',
      title: 'Murid 2 Tercetak: KP-002-B → Aisyah Sofea → B',
      rawPayload: 'KP-002-B',
      studentId: 'KP-002',
      expectedOption: 'B',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    // Standard Pipe Format
    {
      id: 'test-pipe-adam-a',
      category: 'valid_adam',
      title: 'Format Paip: KEMBARA|KP-001|A → Adam Hakimi → A',
      rawPayload: buildQrPayload('KP-001', 'A'),
      studentId: 'KP-001',
      expectedOption: 'A',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    // Encoded JSON Format
    {
      id: 'test-json-adam-a',
      category: 'valid_adam',
      title: 'Format JSON: {"studentId":"KP-001","answer":"A"}',
      rawPayload: JSON.stringify({ studentId: 'KP-001', answer: 'A' }),
      studentId: 'KP-001',
      expectedOption: 'A',
      expectedOutcome: 'VALID',
      isPass: false,
    },
    // Test QR Salah: KP-999
    {
      id: 'test-invalid-student',
      category: 'invalid_student',
      title: 'Kad Murid Tidak Wujud (KP-999-A)',
      rawPayload: 'KP-999-A',
      expectedOutcome: 'ERROR',
      expectedErrorSnippet: 'Murid tidak dikenali',
      isPass: false,
    },
    // Test QR Salah: HELLO (bukan kad Kembara)
    {
      id: 'test-invalid-app',
      category: 'invalid_app',
      title: 'QR Bukan Kad Kembara (HELLO)',
      rawPayload: 'HELLO',
      expectedOutcome: 'ERROR',
      expectedErrorSnippet: 'bukan kad Kembara Dunia Pecahan',
      isPass: false,
    },
    // Test QR Salah: Jawapan X
    {
      id: 'test-invalid-answer',
      category: 'invalid_answer',
      title: 'Jawapan Tidak Sah (KP-001-X)',
      rawPayload: 'KP-001-X',
      expectedOutcome: 'ERROR',
      expectedErrorSnippet: 'Jawapan QR tidak sah',
      isPass: false,
    },
  ];

  const [testResults, setTestResults] = useState<TestCaseItem[]>(initialTestCases);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<TestCaseItem | null>(null);

  // Run automated decode & validation test
  const runSelfTest = async () => {
    setIsRunningTest(true);
    playSfx('click', soundEnabled);

    const updated: TestCaseItem[] = [];

    for (const item of initialTestCases) {
      try {
        // 1. Generate real QR data URL using app generator
        const dataUrl = await generateQrDataUrl(item.rawPayload, 260);

        // 2. Decode using bundled jsQR
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = dataUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          updated.push({ ...item, isPass: false, qrDataUrl: dataUrl });
          continue;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, 240, 240);
        const code = jsQR(imgData.data, 240, 240, { inversionAttempts: 'dontInvert' });

        if (!code || !code.data) {
          updated.push({
            ...item,
            isPass: false,
            qrDataUrl: dataUrl,
            detectedError: 'Gagal nyahkod imej QR',
          });
          continue;
        }

        const decodedRaw = code.data;

        // 3. Test parseQrCodeData
        const parsed = parseQrCodeData(decodedRaw);

        if (item.expectedOutcome === 'VALID') {
          // Check format
          if (!parsed.valid || !parsed.studentId || !parsed.answerOption) {
            updated.push({
              ...item,
              isPass: false,
              qrDataUrl: dataUrl,
              detectedError: parsed.error,
            });
            continue;
          }

          // Check student validation against class
          const stValidation = validateScannedStudent(parsed.studentId, students);
          const isPass =
            parsed.valid &&
            parsed.studentId === item.studentId &&
            parsed.answerOption === item.expectedOption &&
            stValidation.valid;

          updated.push({
            ...item,
            detectedStudentId: parsed.studentId,
            detectedOption: parsed.answerOption,
            isPass,
            qrDataUrl: dataUrl,
          });
        } else {
          // Expected outcome is ERROR
          if (!parsed.valid) {
            // Error in format (e.g. HELLO or X)
            const matchesExpected = item.expectedErrorSnippet
              ? (parsed.error || '').toLowerCase().includes(item.expectedErrorSnippet.toLowerCase())
              : true;
            updated.push({
              ...item,
              isPass: matchesExpected,
              detectedError: parsed.error,
              qrDataUrl: dataUrl,
            });
          } else {
            // Parsed syntax was valid, check student validation (e.g. KP-999)
            const stValidation = validateScannedStudent(parsed.studentId!, students);
            const matchesExpected =
              !stValidation.valid &&
              item.expectedErrorSnippet
                ? (stValidation.error || '').toLowerCase().includes(item.expectedErrorSnippet.toLowerCase())
                : !stValidation.valid;

            updated.push({
              ...item,
              isPass: matchesExpected,
              detectedError: stValidation.error,
              qrDataUrl: dataUrl,
            });
          }
        }
      } catch (err) {
        console.warn('Test error for', item.title, err);
        updated.push({ ...item, isPass: false, detectedError: String(err) });
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

  const passedCount = testResults.filter((t) => t.isPass).length;

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFF8E8] text-[#4A3728] rounded-3xl shadow-2xl border-4 border-[#F4C95D] p-5 sm:p-6 font-rounded max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D98262] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#4A3728]">
                🧪 Ujian Rasmi QR Scanner & Nyahkod
              </h3>
              <p className="text-xs text-stone-600 font-medium">
                Format: <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded">KEMBARA|studentId|answer</code>
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
            <span>{isRunningTest ? 'Sedang Menguji...' : 'Jalankan Ujian Semula 🔄'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                passedCount === testResults.length
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              Keputusan: {passedCount} / {testResults.length} LULUS
            </span>
          </div>
        </div>

        {/* Test Matrix */}
        <div className="overflow-y-auto flex-1 space-y-2.5 p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {testResults.map((item) => {
              const meta = item.expectedOption ? OPTION_METADATA[item.expectedOption] : null;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    item.isPass
                      ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                      : 'bg-red-50/90 border-red-400 text-red-950'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h5 className="font-bold text-xs flex items-center gap-1.5">
                        {item.expectedOutcome === 'VALID' ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                        <span>{item.title}</span>
                      </h5>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                          item.isPass
                            ? 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                            : 'bg-red-200 text-red-900 border border-red-400'
                        }`}
                      >
                        {item.isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.isPass ? 'LULUS' : 'GAGAL'}</span>
                      </span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl border border-stone-200 font-mono text-[11px] space-y-0.5">
                      <div className="text-stone-500 truncate">
                        <span className="font-semibold text-stone-700">QR:</span> {item.rawPayload}
                      </div>

                      {item.expectedOutcome === 'VALID' ? (
                        <>
                          <div>
                            <span className="font-semibold text-stone-700">Jangkaan:</span>{' '}
                            <span className="text-blue-700 font-bold">{item.studentId}</span> → Jawapan{' '}
                            <span className="text-emerald-700 font-bold">{item.expectedOption}</span>
                          </div>
                          {item.detectedOption && (
                            <div className="text-emerald-700 font-bold">
                              ✓ Dikesan: {item.detectedStudentId} → Jawapan {item.detectedOption}
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <span className="font-semibold text-stone-700">Mesej:</span>{' '}
                          <span className="text-rose-700 font-bold">{item.detectedError || item.expectedErrorSnippet}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
                    {item.qrDataUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(item)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Imej QR</span>
                      </button>
                    )}

                    {item.expectedOutcome === 'VALID' && item.studentId && item.expectedOption && (
                      <button
                        type="button"
                        onClick={() => {
                          playSfx('chime', soundEnabled);
                          onSimulateScan(item.studentId!, item.expectedOption!, 0);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>⚡ Imbas Masuk</span>
                      </button>
                    )}
                  </div>
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
                className="bg-white p-5 rounded-3xl border-4 border-slate-900 max-w-xs text-center flex flex-col items-center shadow-2xl"
              >
                <h4 className="font-bold text-sm text-slate-900 mb-1">{selectedPreview.title}</h4>
                {selectedPreview.qrDataUrl && (
                  <img
                    src={selectedPreview.qrDataUrl}
                    alt="Preview QR"
                    className="w-48 h-48 my-2 border-2 border-slate-900 rounded-xl p-1 bg-white"
                  />
                )}
                <p className="font-mono text-xs text-slate-600 mb-3 bg-stone-100 p-1.5 rounded-lg w-full break-all">
                  {selectedPreview.rawPayload}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
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
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
