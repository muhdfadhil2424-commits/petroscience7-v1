import QRCode from 'qrcode';
import JSZip from 'jszip';
import { InteractiveClassStudent, AnswerOption, StudentQrEntry } from '../types/interactiveClass';

export const ANSWER_OPTIONS: AnswerOption[] = ['A', 'B', 'C', 'D'];

export const OPTION_METADATA: Record<
  AnswerOption,
  {
    label: string;
    letter: AnswerOption;
    color: string;
    textColor: string;
    borderColor: string;
    bgColor: string;
    badgeEmoji: string;
  }
> = {
  A: {
    label: 'JAWAPAN A',
    letter: 'A',
    color: '#2563eb', // Blue-600
    textColor: '#1e3a8a', // Blue-900
    borderColor: '#93c5fd', // Blue-300
    bgColor: '#eff6ff', // Blue-50
    badgeEmoji: '🅰️',
  },
  B: {
    label: 'JAWAPAN B',
    letter: 'B',
    color: '#059669', // Emerald-600
    textColor: '#064e3b', // Emerald-900
    borderColor: '#a7f3d0', // Emerald-200
    bgColor: '#ecfdf5', // Emerald-50
    badgeEmoji: '🅱️',
  },
  C: {
    label: 'JAWAPAN C',
    letter: 'C',
    color: '#d97706', // Amber-600
    textColor: '#78350f', // Amber-900
    borderColor: '#fde68a', // Amber-200
    bgColor: '#fffbeb', // Amber-50
    badgeEmoji: '🅲️',
  },
  D: {
    label: 'JAWAPAN D',
    letter: 'D',
    color: '#7c3aed', // Purple-600
    textColor: '#4c1d95', // Purple-900
    borderColor: '#ddd6fe', // Purple-200
    bgColor: '#faf5ff', // Purple-50
    badgeEmoji: '🅳️',
  },
};

/**
 * Creates formatted QR ID (e.g. KP-001-A)
 */
export function formatQrId(studentId: string, option: AnswerOption): string {
  return `${studentId.trim().toUpperCase()}-${option}`;
}

/**
 * Creates standardized payload stored inside the QR code
 * Minimum data: studentId + answer
 */
export function buildQrPayload(studentId: string, option: AnswerOption): string {
  return JSON.stringify({
    studentId: studentId.trim().toUpperCase(),
    answer: option,
  });
}

/**
 * Parses raw decoded string from webcam or scanner.
 * Supports:
 * 1. JSON format: {"studentId":"KP-001","answer":"A"} or {"sid":"KP-001","ans":"A"}
 * 2. String format: "KP-001-A", "KP-001:A", "KP-001_A"
 */
export function parseQrCodeData(rawData: string): {
  valid: boolean;
  studentId?: string;
  answerOption?: AnswerOption;
  qrId?: string;
  error?: string;
} {
  if (!rawData || typeof rawData !== 'string') {
    return { valid: false, error: 'Tiada data kod QR dikesan' };
  }

  const clean = rawData.trim();

  // 1. Try parsing JSON format
  if (clean.startsWith('{') && clean.endsWith('}')) {
    try {
      const parsed = JSON.parse(clean);
      const studentId = (parsed.studentId || parsed.sid || '').trim().toUpperCase();
      const answerRaw = (parsed.answer || parsed.ans || parsed.answerOption || '').trim().toUpperCase();

      if (studentId && (answerRaw === 'A' || answerRaw === 'B' || answerRaw === 'C' || answerRaw === 'D')) {
        return {
          valid: true,
          studentId,
          answerOption: answerRaw as AnswerOption,
          qrId: formatQrId(studentId, answerRaw as AnswerOption),
        };
      }
    } catch {
      // Fall through to regex
    }
  }

  // 2. Try parsing String format: "KP-001-A", "KP001-B", "KP-001:C"
  const regexMatch = clean.match(/^([A-Z0-9_-]+)[-:_ ]([ABCD])$/i);
  if (regexMatch) {
    const studentId = regexMatch[1].trim().toUpperCase();
    const answerOption = regexMatch[2].toUpperCase() as AnswerOption;
    return {
      valid: true,
      studentId,
      answerOption,
      qrId: formatQrId(studentId, answerOption),
    };
  }

  // Fallback for legacy format with only studentId (e.g. KP-001 without letter)
  if (/^KP-\d{3,4}$/i.test(clean)) {
    return {
      valid: false,
      error: 'Kod QR ini adalah kad lama (tiada label A/B/C/D). Sila cetak set 4 QR baharu.',
    };
  }

  return { valid: false, error: 'Format QR tidak dikenali.' };
}

/**
 * Generates the 4 QR entries for a student (A, B, C, D)
 */
export function getStudentFourQrs(student: InteractiveClassStudent): StudentQrEntry[] {
  return ANSWER_OPTIONS.map((option) => ({
    studentId: student.studentId,
    studentName: student.studentName,
    class: student.class,
    qrId: formatQrId(student.studentId, option),
    answerOption: option,
    status: student.cardStatus,
    createdAt: student.createdAt,
    qrPayload: buildQrPayload(student.studentId, option),
  }));
}

/**
 * Generates a data URL for a specific QR payload
 */
export async function generateQrDataUrl(
  payload: string,
  size = 280,
  darkColor = '#0f172a'
): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: size,
    margin: 1,
    color: {
      dark: darkColor,
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });
}

/**
 * Downloads a data URL as a file in the browser
 */
export function triggerFileDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a single QR image download for a student (e.g. KP-001-A)
 */
export async function downloadSingleQr(
  student: InteractiveClassStudent,
  option: AnswerOption
): Promise<void> {
  const payload = buildQrPayload(student.studentId, option);
  const dataUrl = await generateQrDataUrl(payload, 500);

  // Clean filename: KP-001_Adam_Hakimi_QR_A.png
  const safeName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${student.studentId}_${safeName}_QR_${option}.png`;

  triggerFileDownload(dataUrl, filename);
}

/**
 * Generates and downloads a complete, high-resolution 4-QR card sheet (PNG) for a student.
 * Layout matches standard A4 card layout:
 * - Header: KEMBARA DUNIA PECAHAN & KAD JAWAPAN KELAS INTERAKTIF
 * - Student Name, ID, Class
 * - 2x2 Grid of QRs (A, B, C, D) with distinct colored badges and labels
 */
export async function generateStudentCardCanvas(
  student: InteractiveClassStudent
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2D canvas context');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Outer border with rounded corners
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#1e293b'; // slate-800
  roundRect(ctx, 30, 30, width - 60, height - 60, 48);
  ctx.stroke();

  // Top Title Banner
  ctx.fillStyle = '#fffbeb'; // Amber-50
  roundRect(ctx, 50, 50, width - 100, 220, 32);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fde68a';
  ctx.stroke();

  // Title Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#b45309'; // Amber-700
  ctx.font = 'bold 34px "Comic Sans MS", "Arial Rounded MT Bold", sans-serif';
  ctx.fillText('🍕 KEMBARA DUNIA PECAHAN', width / 2, 110);

  ctx.fillStyle = '#0f172a'; // Slate-900
  ctx.font = 'bold 44px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
  ctx.fillText(student.studentName.toUpperCase(), width / 2, 180);

  // Subtitle / ID & Class Badge
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(
    `ID: ${student.studentId}   •   KELAS: ${student.class.toUpperCase()}   •   STATUS: AKTIF`,
    width / 2,
    232
  );

  // Load the 4 QRs
  const qrPromises = ANSWER_OPTIONS.map((opt) => {
    const payload = buildQrPayload(student.studentId, opt);
    return generateQrDataUrl(payload, 360);
  });

  const qrDataUrls = await Promise.all(qrPromises);
  const images = await Promise.all(
    qrDataUrls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        })
    )
  );

  // 2x2 Grid Coordinates
  // Grid row 1: A (left), B (right)
  // Grid row 2: C (left), D (right)
  const cellWidth = 500;
  const cellHeight = 560;
  const colLeft = 85;
  const colRight = 615;
  const rowTop = 310;
  const rowBottom = 920;

  const positions = [
    { x: colLeft, y: rowTop, opt: 'A' as AnswerOption, img: images[0] },
    { x: colRight, y: rowTop, opt: 'B' as AnswerOption, img: images[1] },
    { x: colLeft, y: rowBottom, opt: 'C' as AnswerOption, img: images[2] },
    { x: colRight, y: rowBottom, opt: 'D' as AnswerOption, img: images[3] },
  ];

  positions.forEach(({ x, y, opt, img }) => {
    const meta = OPTION_METADATA[opt];

    // Card cell box
    ctx.fillStyle = meta.bgColor;
    roundRect(ctx, x, y, cellWidth, cellHeight, 36);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = meta.color;
    ctx.stroke();

    // Top Label Banner for Option
    ctx.fillStyle = meta.color;
    roundRect(ctx, x + 20, y + 20, cellWidth - 40, 70, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${meta.badgeEmoji}  JAWAPAN ${opt}`, x + cellWidth / 2, y + 68);

    // QR Code Container with white background & shadow
    const qrBoxSize = 350;
    const qrBoxX = x + (cellWidth - qrBoxSize) / 2;
    const qrBoxY = y + 110;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Draw QR image
    ctx.drawImage(img, qrBoxX + 15, qrBoxY + 15, qrBoxSize - 30, qrBoxSize - 30);

    // Bottom pill under QR
    ctx.fillStyle = meta.textColor;
    ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
    ctx.fillText(`KOD: ${student.studentId}-${opt}`, x + cellWidth / 2, y + 510);
  });

  // Footer Instructions
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 24px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    '💡 Arahan Murid: Angkat kod QR pilihan (A, B, C atau D) menghadap kamera laptop guru.',
    width / 2,
    1530
  );

  return canvas;
}

/**
 * Downloads a complete 4-QR card sheet as a PNG
 */
export async function downloadStudentCardPng(student: InteractiveClassStudent): Promise<void> {
  const canvas = await generateStudentCardCanvas(student);
  const dataUrl = canvas.toDataURL('image/png');
  const safeName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${student.studentId}_${safeName}_Kad_4_QR.png`;
  triggerFileDownload(dataUrl, filename);
}

/**
 * Packages all students' 4-QR cards and individual QRs into a single .zip download
 */
export async function downloadAllClassQrsZip(
  students: InteractiveClassStudent[],
  className: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const safeClassName = className.replace(/[^a-zA-Z0-9]/g, '_');
  const rootFolder = zip.folder(`KembaraPecahan_Kad_QR_${safeClassName}`) || zip;

  const cardsFolder = rootFolder.folder('Kad_Lengkap_4_QR');
  const singleQrFolder = rootFolder.folder('QR_Individu_A_B_C_D');

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (onProgress) {
      onProgress(i + 1, students.length);
    }

    const safeName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');

    // 1. Generate full student card PNG
    try {
      const cardCanvas = await generateStudentCardCanvas(student);
      const cardDataUrl = cardCanvas.toDataURL('image/png');
      const cardBase64 = cardDataUrl.replace(/^data:image\/png;base64,/, '');
      cardsFolder?.file(`${student.studentId}_${safeName}_Kad_4_QR.png`, cardBase64, {
        base64: true,
      });
    } catch (e) {
      console.warn('Failed to render card for', student.studentId, e);
    }

    // 2. Generate the 4 individual QRs
    for (const opt of ANSWER_OPTIONS) {
      try {
        const payload = buildQrPayload(student.studentId, opt);
        const qrUrl = await generateQrDataUrl(payload, 400);
        const qrBase64 = qrUrl.replace(/^data:image\/png;base64,/, '');
        singleQrFolder?.file(`${student.studentId}_${safeName}_QR_${opt}.png`, qrBase64, {
          base64: true,
        });
      } catch (e) {
        console.warn('Failed to render single QR for', student.studentId, opt, e);
      }
    }
  }

  // Generate and download zip
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `KembaraPecahan_Semua_Kad_QR_${safeClassName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Canvas rounded rect helper
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
