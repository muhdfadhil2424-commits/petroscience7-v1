import React, { useRef, useState, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CameraOff,
  FlipHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Lock,
  ScanLine,
} from 'lucide-react';
import { AnswerOption, InteractiveClassStudent } from '../../types/interactiveClass';
import { parseQrCodeData, OPTION_METADATA } from '../../utils/studentQrManager';
import { playSfx } from '../../utils/audio';

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
  isCompact?: boolean;
  onOpenTestMode?: () => void;
}

interface DetectedCardOverlay {
  id: string;
  studentId: string;
  studentName?: string;
  answerOption: AnswerOption;
  box: { x: number; y: number; width: number; height: number };
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
  isCompact = false,
  onOpenTestMode,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isMirrored, setIsMirrored] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [fps, setFps] = useState<number>(0);
  const [totalScansCount, setTotalScansCount] = useState<number>(0);
  const [recentDetected, setRecentDetected] = useState<DetectedCardOverlay[]>([]);

  // Throttling scan per student to prevent rapid-fire submissions (1 second per student)
  const lastScannedTimeRef = useRef<Record<string, number>>({});
  const lastScannedOptionRef = useRef<Record<string, AnswerOption>>({});
  const animationFrameRef = useRef<number | null>(null);

  const showWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    warningTimeoutRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 3000);
  }, []);

  // Stop camera tracks
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

  // Initialize Camera
  const startCamera = useCallback(
    async (deviceId?: string) => {
      setCameraError(null);
      stopCurrentStream();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Pelayar web ini tidak menyokong MediaDevices API untuk kamera.');
        return;
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }

        try {
          const devList = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devList.filter((d) => d.kind === 'videoinput');
          setDevices(videoDevs);
          if (!selectedDeviceId && videoDevs.length > 0) {
            setSelectedDeviceId(videoDevs[0].deviceId);
          }
        } catch (e) {
          console.warn('Cannot enumerate devices', e);
        }
      } catch (err: any) {
        console.warn('Camera access unavailable or permission denied:', err?.name, err?.message);
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
          errorMsg = '❌ Tiada kamera dikesan pada komputer ini.';
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          errorMsg = '❌ Kamera sedang digunakan oleh perisian lain (cth: Zoom, Teams, Meet).';
        } else if (err?.message) {
          errorMsg = `❌ Ralat kamera: ${err.message}`;
        }
        setCameraError(errorMsg);
      }
    },
    [selectedDeviceId, stopCurrentStream]
  );

  useEffect(() => {
    if (isActive) {
      startCamera(selectedDeviceId);
    } else {
      stopCurrentStream();
    }

    return () => {
      stopCurrentStream();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [isActive, startCamera, stopCurrentStream, selectedDeviceId]);

  // Continuous Scan Loop without orientation dependency
  useEffect(() => {
    if (!isActive || !stream || cameraError) return;

    let frameCount = 0;
    let lastFpsCheck = performance.now();
    let tickCount = 0;

    const processFrame = () => {
      if (!isActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas && overlayCanvas) {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (videoWidth > 0 && videoHeight > 0) {
          const targetWidth = Math.min(640, videoWidth);
          const targetHeight = Math.round((videoHeight / videoWidth) * targetWidth);

          if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
          }

          if (overlayCanvas.width !== videoWidth || overlayCanvas.height !== videoHeight) {
            overlayCanvas.width = videoWidth;
            overlayCanvas.height = videoHeight;
          }

          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const overlayCtx = overlayCanvas.getContext('2d');

          if (ctx && overlayCtx) {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            overlayCtx.clearRect(0, 0, videoWidth, videoHeight);

            const detectedInThisFrame: DetectedCardOverlay[] = [];

            const runScanOnImageData = (
              imgData: ImageData,
              offsetX = 0,
              offsetY = 0,
              scaleX = 1,
              scaleY = 1
            ) => {
              const code = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (code && code.data) {
                const parsed = parseQrCodeData(code.data);

                if (!parsed.valid || !parsed.studentId || !parsed.answerOption) {
                  // Unknown format
                  showWarning('❌ QR tidak dikenali.');
                  return;
                }

                const { studentId, answerOption } = parsed;

                // Validate student membership & status if student list is available
                let resolvedStudentName = '';
                if (students.length > 0) {
                  const studentObj = students.find(
                    (s) => s.studentId.toUpperCase() === studentId.toUpperCase()
                  );

                  if (!studentObj) {
                    showWarning(`⚠️ Kad ini bukan daripada kelas yang dipilih (${studentId}).`);
                    return;
                  }

                  if (studentObj.cardStatus === 'inactive') {
                    showWarning(`⚠️ Kad murid tidak aktif (${studentObj.studentName}).`);
                    return;
                  }

                  resolvedStudentName = studentObj.studentName;
                } else if (findStudentName) {
                  resolvedStudentName = findStudentName(studentId) || studentId;
                }

                // Check if question is locked
                if (isQuestionLocked) {
                  showWarning('🔒 Soalan dikunci. Perubahan jawapan tidak diterima.');
                  return;
                }

                // Calculate bounding box in video coordinates
                const pts = [
                  code.location.topLeftCorner || code.location.topLeftFinderPattern,
                  code.location.topRightCorner || code.location.topRightFinderPattern,
                  code.location.bottomLeftCorner || code.location.bottomLeftFinderPattern,
                  code.location.bottomRightCorner || code.location.topRightFinderPattern,
                ];

                const minX = Math.min(...pts.map((p) => (p.x + offsetX) * scaleX));
                const maxX = Math.max(...pts.map((p) => (p.x + offsetX) * scaleX));
                const minY = Math.min(...pts.map((p) => (p.y + offsetY) * scaleY));
                const maxY = Math.max(...pts.map((p) => (p.y + offsetY) * scaleY));

                const box = {
                  x: Math.round(minX),
                  y: Math.round(minY),
                  width: Math.round(maxX - minX),
                  height: Math.round(maxY - minY),
                };

                detectedInThisFrame.push({
                  id: `${studentId}_${answerOption}_${Date.now()}`,
                  studentId,
                  studentName: resolvedStudentName,
                  answerOption,
                  box,
                  timestamp: Date.now(),
                });

                // Duplicate scan throttle check:
                // Allow immediate update if student changes answer (e.g. A -> C),
                // otherwise throttle same-answer scans to once every 1200ms
                const now = Date.now();
                const lastTime = lastScannedTimeRef.current[studentId] || 0;
                const lastOption = lastScannedOptionRef.current[studentId];
                const isOptionChanged = lastOption && lastOption !== answerOption;

                if (isOptionChanged || now - lastTime > 1200) {
                  lastScannedTimeRef.current[studentId] = now;
                  lastScannedOptionRef.current[studentId] = answerOption;

                  playSfx('chime', soundEnabled);
                  setTotalScansCount((prev) => prev + 1);

                  onScanResult({
                    studentId,
                    answerOption,
                    angleDeg: 0,
                  });
                }
              }
            };

            // 1. Full frame scan
            const fullImg = ctx.getImageData(0, 0, targetWidth, targetHeight);
            const scaleToVideoX = videoWidth / targetWidth;
            const scaleToVideoY = videoHeight / targetHeight;
            runScanOnImageData(fullImg, 0, 0, scaleToVideoX, scaleToVideoY);

            // 2. Multi-region quadrant scanning on alternating ticks (to catch multiple students)
            tickCount++;
            const hw = Math.floor(targetWidth / 2);
            if (tickCount % 2 === 0) {
              const leftImg = ctx.getImageData(0, 0, hw, targetHeight);
              runScanOnImageData(leftImg, 0, 0, scaleToVideoX, scaleToVideoY);

              const rightImg = ctx.getImageData(hw, 0, hw, targetHeight);
              runScanOnImageData(rightImg, hw, 0, scaleToVideoX, scaleToVideoY);
            }

            // Draw visual detection overlays on the video
            if (detectedInThisFrame.length > 0) {
              detectedInThisFrame.forEach((det) => {
                const { box, answerOption, studentId, studentName } = det;
                const meta = OPTION_METADATA[answerOption];

                // Vibrant bounding box
                overlayCtx.strokeStyle = meta.color || '#10B981';
                overlayCtx.lineWidth = 5;
                overlayCtx.strokeRect(box.x, box.y, box.width, box.height);

                // Corner indicators
                overlayCtx.fillStyle = meta.color || '#059669';
                const cornerSize = 14;
                overlayCtx.fillRect(box.x - 2, box.y - 2, cornerSize, 5);
                overlayCtx.fillRect(box.x - 2, box.y - 2, 5, cornerSize);

                // Label pill above box: e.g. "Adam Hakimi [Jawapan: B]"
                const labelText = studentName
                  ? `${studentName} [Jawapan: ${answerOption}]`
                  : `${studentId} [Jawapan: ${answerOption}]`;

                overlayCtx.font = 'bold 16px "Comic Sans MS", Arial, sans-serif';
                const textWidth = overlayCtx.measureText(labelText).width;

                overlayCtx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                overlayCtx.roundRect(box.x, Math.max(0, box.y - 34), textWidth + 20, 30, 8);
                overlayCtx.fill();

                overlayCtx.fillStyle = meta.color;
                overlayCtx.roundRect(box.x + 4, Math.max(0, box.y - 30), 22, 22, 6);
                overlayCtx.fill();

                overlayCtx.fillStyle = '#ffffff';
                overlayCtx.font = 'bold 14px Arial, sans-serif';
                overlayCtx.fillText(answerOption, box.x + 9, Math.max(0, box.y - 14));

                overlayCtx.fillStyle = '#FDE047';
                overlayCtx.font = 'bold 15px "Comic Sans MS", Arial, sans-serif';
                overlayCtx.fillText(labelText, box.x + 32, Math.max(20, box.y - 14));
              });

              setRecentDetected((prev) => {
                const filtered = prev.filter((p) => Date.now() - p.timestamp < 3000);
                const uniqueNew = detectedInThisFrame.filter(
                  (d) =>
                    !filtered.some(
                      (f) => f.studentId === d.studentId && f.answerOption === d.answerOption
                    )
                );
                return [...uniqueNew, ...filtered].slice(0, 6);
              });
            }

            // FPS calculation
            frameCount++;
            const now = performance.now();
            if (now - lastFpsCheck >= 1000) {
              setFps(Math.round((frameCount * 1000) / (now - lastFpsCheck)));
              frameCount = 0;
              lastFpsCheck = now;
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isActive,
    stream,
    cameraError,
    isMirrored,
    soundEnabled,
    students,
    selectedClass,
    isQuestionLocked,
    findStudentName,
    onScanResult,
    showWarning,
  ]);

  return (
    <div
      className={`relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col ${
        isCompact ? 'h-[360px]' : 'h-[440px] sm:h-[480px]'
      }`}
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Header Bar */}
      <div className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-black/85 via-black/50 to-transparent p-3 sm:p-4 flex flex-col gap-2 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>📷 SCANNER AKTIF</span>
            </div>

            {isQuestionLocked && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/30 border border-red-400 text-red-300 text-[11px] font-bold">
                <Lock className="w-3 h-3" />
                <span>🔒 Soalan Dikunci</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playSfx('click', soundEnabled);
                setIsMirrored((m) => !m);
              }}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isMirrored
                  ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-md'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Cerminkan Paparan Kamera"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Cermin</span>
            </button>

            {onOpenTestMode && (
              <button
                type="button"
                onClick={() => {
                  playSfx('click', soundEnabled);
                  onOpenTestMode();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#D98262] hover:bg-[#c26e50] text-white border border-[#b85b3b] text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                title="Buka Simulator Kod QR"
              >
                <span>🧪</span>
                <span className="hidden sm:inline">Simulator</span>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Instructions & Status Badges */}
        <div className="flex items-center justify-between text-xs text-stone-300 flex-wrap gap-2">
          <p className="font-semibold text-amber-200 flex items-center gap-1">
            <span>✨ Angkat QR jawapan kamu. Pastikan QR menghadap kamera.</span>
          </p>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
              🟢 {answeredCount}/{totalStudents} murid sudah jawab
            </span>
            {unansweredCount > 0 && (
              <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800">
                🟡 {unansweredCount} belum jawab
              </span>
            )}
          </div>
        </div>

        {/* Warning Notification Banner */}
        <AnimatePresence>
          {warningMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-2 rounded-xl bg-red-900/90 border border-red-500 text-white text-xs font-bold shadow-lg flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
                <span>{warningMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setWarningMessage(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Video Viewfinder & Overlay */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center text-white max-w-md">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-300">
              <CameraOff className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-amber-200 mb-1">
              Kamera Memerlukan Kebenaran
            </h4>
            <p className="text-xs text-stone-300 mb-4">{cameraError}</p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => startCamera(selectedDeviceId)}
                className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cuba Semula 🔄</span>
              </button>

              {onOpenTestMode && (
                <button
                  type="button"
                  onClick={onOpenTestMode}
                  className="px-4 py-2 rounded-2xl bg-[#D98262] hover:bg-[#c26e50] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guna Simulator 🧪</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                isMirrored ? 'scale-x-[-1]' : ''
              }`}
            />

            <canvas
              ref={overlayCanvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
                isMirrored ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Target Reticle / Guide Center Box */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-amber-400/40 rounded-3xl relative flex items-center justify-center">
                <div className="text-center px-4 py-2 bg-black/60 backdrop-blur-xs rounded-xl border border-white/10 text-[11px] text-amber-200 font-bold">
                  Halakan kod QR A, B, C atau D ke hadapan kamera
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Scan Notification Stream Strip */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
          <span className="font-black text-amber-400 uppercase tracking-wider text-[10px] shrink-0">
            Dikesan:
          </span>

          {recentDetected.length === 0 ? (
            <span className="text-stone-400 text-[11px] italic">
              Sedang mengimbas QR murid dalam bilik darjah...
            </span>
          ) : (
            recentDetected.map((det) => (
              <motion.div
                key={det.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shrink-0 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-amber-300">{det.studentId}</span>
                {det.studentName && <span>({det.studentName})</span>}
                <span
                  className="px-1.5 py-0.2 rounded text-[10px] font-black text-white"
                  style={{
                    backgroundColor: OPTION_METADATA[det.answerOption]?.color || '#059669',
                  }}
                >
                  {det.answerOption}
                </span>
              </motion.div>
            ))
          )}
        </div>

        <div className="shrink-0 text-stone-300 font-bold text-[11px]">
          Imbasan: <span className="text-amber-400">{totalScansCount}</span>
        </div>
      </div>
    </div>
  );
};
