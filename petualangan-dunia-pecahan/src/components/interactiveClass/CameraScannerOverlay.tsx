import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'motion/react';
import {
  CameraOff,
  RefreshCw,
  AlertCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  Lock,
  Camera,
  SwitchCamera,
} from 'lucide-react';
import { AnswerOption, InteractiveClassStudent } from '../../types/interactiveClass';
import {
  parseQrCodeData,
  validateScannedStudent,
  OPTION_METADATA,
} from '../../utils/studentQrManager';
import { playSfx } from '../../utils/audio';

interface RecentScanItem {
  studentId: string;
  studentName: string;
  answerOption: AnswerOption;
  timestamp: number;
}

interface CameraScannerOverlayProps {
  isActive: boolean;
  onScanResult: (result: {
    studentId: string;
    answerOption: AnswerOption;
    angleDeg?: number;
  }) => void;
  findStudentName?: (id: string) => string | null;
  students?: InteractiveClassStudent[];
  selectedClass?: string;
  isQuestionLocked?: boolean;
  answeredCount?: number;
  unansweredCount?: number;
  totalStudents?: number;
  soundEnabled?: boolean;
  onClose?: () => void;
  onBackToQuestion?: () => void;
  onRevealAnswer?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
  recentScanFeed?: RecentScanItem[];
  onOpenTestMode?: () => void;
}

interface LastSuccessScan {
  studentId: string;
  studentName: string;
  answerOption: AnswerOption;
  timestamp: number;
}

export const CameraScannerOverlay: React.FC<CameraScannerOverlayProps> = ({
  isActive,
  onScanResult,
  findStudentName,
  students = [],
  selectedClass = '',
  isQuestionLocked = false,
  answeredCount = 0,
  unansweredCount = 0,
  totalStudents = 0,
  soundEnabled = true,
  onClose,
  onBackToQuestion,
  onRevealAnswer,
  questionNumber = 1,
  totalQuestions = 15,
  recentScanFeed = [],
  onOpenTestMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available camera devices (for laptop + external USB webcam switching)
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  // Minimal toast notification when a student scans:
  // ✓ QR Dikesan
  // Adam Hakimi
  // Jawapan B
  // (Camera stays active, does not close)
  const [lastSuccessScan, setLastSuccessScan] = useState<LastSuccessScan | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Native BarcodeDetector reference
  const barcodeDetectorRef = useRef<any>(null);

  // Throttling scan per student (500–1000ms cooldown, e.g. 750ms)
  // Ensures student duplicate scans do NOT inflate count, and does NOT block other students
  const lastScannedTimeRef = useRef<Record<string, number>>({});
  const lastScannedOptionRef = useRef<Record<string, AnswerOption>>({});
  const isProcessingFrameRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate live percentage of unique students answered
  const effectiveTotal = Math.max(1, totalStudents);
  const livePercent = Math.min(100, Math.round((answeredCount / effectiveTotal) * 100));

  // Request Fullscreen API with graceful fallback to 100vw x 100vh
  const requestFullscreenIfSupported = useCallback(async () => {
    try {
      const elem = containerRef.current;
      if (!elem) return;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch {
      // Graceful fallback to 100vw x 100vh CSS layout
    }
  }, []);

  // Exit Fullscreen API
  const exitFullscreenIfActive = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if ((document as any).webkitFullscreenElement) {
        await (document as any).webkitExitFullscreen();
      }
    } catch {
      // ignore
    }
  }, []);

  // Initialize BarcodeDetector API if available, else fallback to bundled jsQR
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        barcodeDetectorRef.current = new (window as any).BarcodeDetector({
          formats: ['qr_code'],
        });
      } catch (e) {
        console.warn('BarcodeDetector format qr_code not supported, falling back to jsQR', e);
        barcodeDetectorRef.current = null;
      }
    } else {
      barcodeDetectorRef.current = null;
    }
  }, []);

  const showWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 2800);
  }, []);

  // Stop camera tracks cleanly
  const stopCurrentStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setStream(null);
  }, []);

  // Enumerate camera devices
  const refreshCameraDevices = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setCameraDevices(videoInputs);
      } catch (err) {
        console.warn('enumerateDevices error', err);
      }
    }
  }, []);

  // Initialize Camera with progressive fallback:
  // 1. If explicit deviceId selected, use deviceId
  // 2. Fallback to facingMode user (standard laptop webcam)
  // 3. Fallback to facingMode environment
  // 4. Fallback to basic { video: true, audio: false }
  const startCamera = useCallback(async (forcedDeviceId?: string) => {
    setCameraError(null);
    stopCurrentStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Pelayar web ini tidak menyokong MediaDevices API untuk kamera.');
      return;
    }

    let mediaStream: MediaStream | null = null;
    const targetId = forcedDeviceId || selectedCameraId;

    // 1. Specific deviceId if chosen
    if (targetId) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: targetId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (eDev) {
        console.warn('Failed to open selected camera device, trying defaults...', eDev);
      }
    }

    // 2. Standard laptop webcam (user)
    if (!mediaStream) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (eUser) {
        console.warn('FacingMode user failed, trying environment...', eUser);
      }
    }

    // 3. Environment camera
    if (!mediaStream) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (eEnv) {
        console.warn('Environment camera failed, falling back to generic video constraint...', eEnv);
      }
    }

    // 4. Final fallback: simple { video: true, audio: false }
    if (!mediaStream) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err: any) {
        console.warn('All camera attempts failed:', err);
        let errorMsg = '❌ Kamera tidak dapat diakses.';
        const errName = err?.name || '';
        const errMsg = (err?.message || '').toLowerCase();

        if (
          errName === 'NotAllowedError' ||
          errName === 'PermissionDeniedError' ||
          errMsg.includes('permission denied') ||
          errMsg.includes('denied') ||
          errMsg.includes('not allowed')
        ) {
          errorMsg = '❌ Akses kamera disekat atau belum dibenarkan oleh pelayar.';
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          errorMsg = '❌ Tiada kamera dikesan pada komputer/laptop ini.';
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          errorMsg = '❌ Kamera sedang digunakan oleh perisian lain (cth: Zoom, Teams, Meet).';
        } else if (err?.message) {
          errorMsg = `❌ Ralat kamera: ${err.message}`;
        }
        setCameraError(errorMsg);
        return;
      }
    }

    streamRef.current = mediaStream;
    setStream(mediaStream);

    // Refresh devices list after granting permission so labels and IDs are visible
    refreshCameraDevices();

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('autoplay', 'true');
      videoRef.current.muted = true;
      try {
        await videoRef.current.play();
      } catch (e) {
        console.warn('Video play warning:', e);
      }
    }
  }, [stopCurrentStream, selectedCameraId, refreshCameraDevices]);

  // Switch to next available camera if multiple devices exist
  const handleToggleCamera = useCallback(() => {
    if (cameraDevices.length <= 1) return;
    const currentIndex = cameraDevices.findIndex((d) => d.deviceId === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    const nextDevice = cameraDevices[nextIndex];
    if (nextDevice && nextDevice.deviceId) {
      setSelectedCameraId(nextDevice.deviceId);
      startCamera(nextDevice.deviceId);
    }
  }, [cameraDevices, selectedCameraId, startCamera]);

  // Lifecycle when isActive changes: start camera and request fullscreen
  useEffect(() => {
    if (isActive) {
      startCamera();
      requestFullscreenIfSupported();
    } else {
      stopCurrentStream();
      exitFullscreenIfActive();
    }

    return () => {
      stopCurrentStream();
      exitFullscreenIfActive();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [isActive, startCamera, stopCurrentStream, requestFullscreenIfSupported, exitFullscreenIfActive]);

  // Handler for back button
  const handleBack = useCallback(() => {
    stopCurrentStream();
    exitFullscreenIfActive();
    if (onBackToQuestion) {
      onBackToQuestion();
    } else if (onClose) {
      onClose();
    }
  }, [stopCurrentStream, exitFullscreenIfActive, onBackToQuestion, onClose]);

  // Handler for reveal button
  const handleReveal = useCallback(() => {
    playSfx('chime', soundEnabled);
    stopCurrentStream();
    exitFullscreenIfActive();
    if (onRevealAnswer) {
      onRevealAnswer();
    }
  }, [soundEnabled, stopCurrentStream, exitFullscreenIfActive, onRevealAnswer]);

  // Handler when a raw QR string is detected
  const handleRawQrDetected = useCallback(
    (rawText: string) => {
      if (!rawText) return;

      // 1. Parse QR payload format
      // Standard: KEMBARA|studentId|answer
      const parsed = parseQrCodeData(rawText);

      if (!parsed.valid || !parsed.studentId || !parsed.answerOption) {
        const err = parsed.error || '❌ QR tidak sah.';
        showWarning(err);
        return;
      }

      const { studentId, answerOption } = parsed;

      // 2. Validate student against selected class
      const stValidation = validateScannedStudent(studentId, students);

      if (!stValidation.valid) {
        const err = stValidation.error || '⚠️ Kad bukan daripada kelas ini.';
        showWarning(err);
        return;
      }

      const resolvedStudentName =
        stValidation.studentName ||
        (findStudentName ? findStudentName(studentId) : null) ||
        studentId;

      // 3. Check if question is locked
      if (isQuestionLocked) {
        showWarning('🔒 Soalan dikunci. Perubahan jawapan tidak diterima.');
        return;
      }

      // 4. Duplicate scan throttle per student (500–1000ms cooldown)
      // If student changes answer (e.g. B -> C), allow immediate update!
      // If same answer, throttle with 750ms cooldown
      const now = Date.now();
      const lastTime = lastScannedTimeRef.current[studentId] || 0;
      const lastOption = lastScannedOptionRef.current[studentId];
      const isOptionChanged = lastOption && lastOption !== answerOption;

      if (isOptionChanged || now - lastTime >= 750) {
        lastScannedTimeRef.current[studentId] = now;
        lastScannedOptionRef.current[studentId] = answerOption;

        playSfx('chime', soundEnabled);

        // Flash small confirmation toast (does NOT close camera)
        setLastSuccessScan({
          studentId,
          studentName: resolvedStudentName,
          answerOption,
          timestamp: now,
        });

        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
          setLastSuccessScan(null);
        }, 2200);

        // Submit to database/session manager
        onScanResult({
          studentId,
          answerOption,
          angleDeg: 0,
        });
      }
    },
    [
      students,
      findStudentName,
      isQuestionLocked,
      soundEnabled,
      onScanResult,
      showWarning,
    ]
  );

  // Continuous Scan Loop with single requestAnimationFrame
  useEffect(() => {
    if (!isActive || !stream || cameraError) return;

    let tickCount = 0;

    const processFrame = async () => {
      if (!isActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Ensure camera stream is truly active
      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        canvas
      ) {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (!isProcessingFrameRef.current) {
          isProcessingFrameRef.current = true;

          try {
            let detectionFound = false;

            // 1. Keutamaan: BarcodeDetector API jika tersedia
            if (barcodeDetectorRef.current) {
              try {
                const barcodes = await barcodeDetectorRef.current.detect(video);
                if (barcodes && barcodes.length > 0) {
                  detectionFound = true;
                  for (const barcode of barcodes) {
                    if (barcode.rawValue) {
                      handleRawQrDetected(barcode.rawValue);
                    }
                  }
                }
              } catch (detectErr) {
                console.warn('BarcodeDetector error, fallback to jsQR', detectErr);
              }
            }

            // 2. Fallback: jsQR yang dibundle (100% offline)
            if (!detectionFound) {
              const targetWidth = Math.min(800, videoWidth);
              const targetHeight = Math.round((videoHeight / videoWidth) * targetWidth);

              if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
                canvas.width = targetWidth;
                canvas.height = targetHeight;
              }

              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              if (ctx) {
                ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
                const fullImg = ctx.getImageData(0, 0, targetWidth, targetHeight);

                // 'attemptBoth' handles light reflections and inverted contrast under classroom lights
                const code = jsQR(fullImg.data, targetWidth, targetHeight, {
                  inversionAttempts: 'attemptBoth',
                });

                if (code && code.data) {
                  handleRawQrDetected(code.data);
                } else {
                  // Alternating quadrant check to catch multiple students in class
                  tickCount++;
                  if (tickCount % 2 === 0) {
                    const hw = Math.floor(targetWidth / 2);
                    const leftImg = ctx.getImageData(0, 0, hw, targetHeight);
                    const leftCode = jsQR(leftImg.data, hw, targetHeight, {
                      inversionAttempts: 'attemptBoth',
                    });
                    if (leftCode && leftCode.data) {
                      handleRawQrDetected(leftCode.data);
                    } else {
                      const rightImg = ctx.getImageData(hw, 0, hw, targetHeight);
                      const rightCode = jsQR(rightImg.data, hw, targetHeight, {
                        inversionAttempts: 'attemptBoth',
                      });
                      if (rightCode && rightCode.data) {
                        handleRawQrDetected(rightCode.data);
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.warn('Scan frame processing exception', err);
          } finally {
            isProcessingFrameRef.current = false;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, stream, cameraError, handleRawQrDetected]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-50 bg-black flex flex-col overflow-hidden select-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* ======================================================== */}
      {/* MINIMAL TOP HEADER */}
      {/* 📷 SCANNER • SOALAN X / 15 • [← Kembali] */}
      {/* ======================================================== */}
      <div className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-black/85 via-black/50 to-transparent px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-black tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>📷 SCANNER</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm sm:text-base text-amber-300">
              SOALAN {questionNumber} / {totalQuestions}
            </span>
            {selectedClass && (
              <span className="text-[11px] font-bold text-stone-300 bg-white/10 px-2 py-0.5 rounded-md hidden md:inline">
                {selectedClass}
              </span>
            )}
          </div>

          {isQuestionLocked && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-rose-300 text-[11px] font-bold">
              <Lock className="w-3 h-3" />
              <span>Dikunci</span>
            </div>
          )}
        </div>

        {/* Minimal Actions: Tukar Kamera (if multiple) + Ujian (optional) + ← Kembali */}
        <div className="flex items-center gap-2">
          {cameraDevices.length > 1 && (
            <button
              type="button"
              onClick={handleToggleCamera}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Tukar Kamera"
            >
              <SwitchCamera className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Tukar Kamera</span>
            </button>
          )}

          {onOpenTestMode && (
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                onOpenTestMode();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20 text-xs font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1"
              title="Buka Ujian QR"
            >
              <span>🧪</span>
              <span>Ujian QR</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Keluar dan kembali ke paparan soalan"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Kembali</span>
          </button>
        </div>
      </div>

      {/* Warning Notification Toast */}
      <AnimatePresence>
        {warningMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 sm:top-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 bg-rose-950/95 border-2 border-rose-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{warningMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MAIN FULL SCREEN CAMERA VIEW (CLEAN - TIADA OVERLAY / RETICLE) */}
      {/* ======================================================== */}
      <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center text-white max-w-md z-20">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-300">
              <CameraOff className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base sm:text-lg text-amber-200 mb-1">
              Kamera Memerlukan Kebenaran
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 mb-4">{cameraError}</p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Cuba Semula 🔄</span>
              </button>

              {onOpenTestMode && (
                <button
                  type="button"
                  onClick={onOpenTestMode}
                  className="px-4 py-2.5 rounded-2xl bg-[#D98262] hover:bg-[#c26e50] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Guna Simulator 🧪</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Small live scan detection badge toast (Clean & floating) */}
        <AnimatePresence>
          {lastSuccessScan && Date.now() - lastSuccessScan.timestamp < 2200 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -15 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 sm:top-20 z-40 bg-slate-950/90 border-2 border-emerald-400 text-white rounded-2xl px-5 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 ring-4 ring-emerald-500/20"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-white truncate max-w-[200px]">
                  {lastSuccessScan.studentName}
                </div>
                <div className="text-xs font-black text-amber-300">
                  Jawapan {lastSuccessScan.answerOption}
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md ml-1 shrink-0"
                style={{
                  backgroundColor:
                    OPTION_METADATA[lastSuccessScan.answerOption]?.color || '#10b981',
                }}
              >
                {lastSuccessScan.answerOption}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM CONTROL BAR & PROGRESS BAR (WAJIB) */}
      {/* 🟢 32 / 40 MURID SUDAH JAWAB | ████████ 80% | 👁️ TUNJUK JAWAPAN */}
      {/* ======================================================== */}
      <div className="absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-5 flex flex-col gap-2.5">
        {/* Live response ticker (horizontal scrollable badges) */}
        {recentScanFeed && recentScanFeed.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            <span className="font-black text-amber-400 text-[11px] uppercase shrink-0">
              Diterima:
            </span>
            {recentScanFeed.slice(0, 15).map((scan, idx) => (
              <div
                key={`${scan.studentId}-${scan.timestamp}-${idx}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-bold shrink-0 shadow-xs"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-stone-200">{scan.studentName || scan.studentId}</span>
                <span className="text-stone-400">—</span>
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white"
                  style={{
                    backgroundColor: OPTION_METADATA[scan.answerOption]?.color || '#10b981',
                  }}
                >
                  {scan.answerOption}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main Progress Bar & Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 bg-slate-900/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-700 shadow-2xl">
          {/* Progress Bar & Counter (WAJIB) */}
          <div className="w-full sm:flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>
                  🟢 {answeredCount} / {totalStudents} MURID SUDAH JAWAB
                </span>
              </span>
              <span className="font-mono text-amber-300 text-sm sm:text-base font-black">
                {livePercent}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-slate-800 rounded-full h-4 sm:h-5 overflow-hidden border border-slate-700 p-0.5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${livePercent}%` }}
              />
            </div>
          </div>

          {/* Action Button: 👁️ TUNJUK JAWAPAN (WAJIB) */}
          <button
            type="button"
            onClick={handleReveal}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] shrink-0"
          >
            <Eye className="w-5 h-5" />
            <span>👁️ TUNJUK JAWAPAN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
