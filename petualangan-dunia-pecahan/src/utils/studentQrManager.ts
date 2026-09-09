import QRCode from 'qrcode';
import JSZip from 'jszip';
import { InteractiveClassStudent, AnswerOption, StudentQrEntry } from '../types/interactiveClass';
import { getAllInteractiveStudents } from './interactiveClassManager';

export const ANSWER_OPTIONS: AnswerOption[] = ['A', 'B', 'C', 'D'];

/**
 * Official application identifier prefix encoded inside all QR payloads
 */
export const OFFICIAL_QR_PREFIX = 'KEMBARA';

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
 * Creates unique formatted QR ID (e.g. KP-001-A)
 */
export function formatQrId(studentId: string, option: AnswerOption): string {
  return `${studentId.trim().toUpperCase()}-${option.trim().toUpperCase()}`;
}

/**
 * Creates standardized payload stored inside the QR code
 * 
 * FORMAT RASMI STANDARD:
 * KEMBARA|studentId|answer
 * 
 * Contoh:
 * KEMBARA|KP-001|A
 * KEMBARA|KP-001|B
 * KEMBARA|KP-001|C
 * KEMBARA|KP-001|D
 * KEMBARA|KP-002|A
 * 
 * JANGAN MASUKKAN DATA SENSITIF:
 * Tiada nama penuh, kelas, markah, kata laluan, atau data peribadi.
 */
export function buildQrPayload(studentId: string, option: AnswerOption): string {
  const cleanId = studentId.trim().toUpperCase();
  const cleanOption = option.trim().toUpperCase() as AnswerOption;
  return `${OFFICIAL_QR_PREFIX}|${cleanId}|${cleanOption}`;
}

export interface QrParseResult {
  valid: boolean;
  app?: string;
  studentId?: string;
  answerOption?: AnswerOption;
  qrId?: string;
  error?: string;
  rawText?: string;
}

/**
 * Parses raw decoded string from webcam or scanner.
 * Backwards compatible with 100% of legacy and printed QR formats:
 * 
 * 1. Direct Legacy Format (Sudah dicetak oleh guru/murid):
 *    - KP-001-A
 *    - KP-001-B
 *    - KP-001-C
 *    - KP-001-D
 *    - KP-002-A, dll.
 * 
 * 2. Delimited Format:
 *    - KP-001|A, KP-001:A, KP-001_A, KP-001 A
 * 
 * 3. Standard Pipe Format:
 *    - KEMBARA|KP-001|A
 * 
 * 4. Encoded JSON Format:
 *    - {"studentId": "KP-001", "answer": "A"}
 *    - {"id": "KP-001", "answer": "B"}
 *    - {"qrId": "KP-001-C"}
 * 
 * Strict Validation Rules:
 * - studentId MUST be identified (e.g. KP-001)
 * - Answer MUST be A, B, C, or D -> else "❌ Jawapan QR tidak sah."
 * - Invalid/Unrecognized QR -> "❌ QR bukan kad Kembara Dunia Pecahan."
 */
export function parseQrCodeData(rawData: string): QrParseResult {
  if (!rawData || typeof rawData !== 'string') {
    return {
      valid: false,
      error: '❌ QR bukan kad Kembara Dunia Pecahan.',
      rawText: String(rawData || ''),
    };
  }

  let clean = rawData.trim();

  // Strip surrounding quotes if present (e.g. "KP-001-A")
  if (
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }

  let extractedStudentId: string | null = null;
  let extractedAnswer: string | null = null;

  // ========================================================
  // 1. Check JSON format: e.g. {"studentId": "KP-001", "answer": "A"}
  // ========================================================
  if (
    (clean.startsWith('{') && clean.endsWith('}')) ||
    clean.includes('"studentId"') ||
    clean.includes('"answer"')
  ) {
    try {
      const parsedJson = JSON.parse(clean);
      const rawId =
        parsedJson.studentId ||
        parsedJson.id ||
        parsedJson.student_id ||
        parsedJson.student;
      const rawAns =
        parsedJson.answer ||
        parsedJson.answerOption ||
        parsedJson.ans ||
        parsedJson.option ||
        parsedJson.letter;

      if (rawId && rawAns) {
        extractedStudentId = String(rawId).trim();
        extractedAnswer = String(rawAns).trim();
      } else if (parsedJson.qrId) {
        clean = String(parsedJson.qrId).trim();
      }
    } catch {
      // Continue to pattern checks
    }
  }

  // ========================================================
  // 2. Check Pipe format: KEMBARA|KP-001|A or KP-001|A
  // ========================================================
  if (!extractedStudentId && clean.includes('|')) {
    const parts = clean.split('|').map((p) => p.trim());
    if (parts.length >= 3) {
      // KEMBARA|KP-001|A
      const app = parts[0].toUpperCase();
      const stId = parts[1];
      const ans = parts[2];
      if (app === OFFICIAL_QR_PREFIX || /^KP-?\d+/i.test(stId)) {
        extractedStudentId = stId;
        extractedAnswer = ans;
      }
    } else if (parts.length === 2) {
      // KP-001|A
      extractedStudentId = parts[0];
      extractedAnswer = parts[1];
    }
  }

  // ========================================================
  // 3. Check Hyphen / Colon / Underscore / Space Format:
  //    Contoh Utama Kad Tercetak:
  //    KP-001-A, KP-001-B, KP-001-C, KP-001-D
  //    KEMBARA-KP-001-A, KP-001:A, KP-001_A, KP-001 A
  // ========================================================
  if (!extractedStudentId) {
    // Matches optional prefix (KEMBARA[-_:]?), studentId (KP-001 or KP\d+), and answer letter [ABCD]
    const legacyKpMatch = clean.match(
      /^(?:KEMBARA[-_:|\s]+)?(KP-?\d+)[-_:|\s]+([A-Za-z])$/i
    );

    if (legacyKpMatch) {
      extractedStudentId = legacyKpMatch[1];
      extractedAnswer = legacyKpMatch[2];
    } else {
      // General format: [STUDENT_ID]-[ANSWER] e.g. STU001-A, 3A001-A, etc.
      const generalMatch = clean.match(
        /^(?:KEMBARA[-_:|\s]+)?([A-Za-z0-9_-]+)[-_:|\s]+([ABCD])$/i
      );
      if (generalMatch && generalMatch[1].length >= 2) {
        extractedStudentId = generalMatch[1];
        extractedAnswer = generalMatch[2];
      }
    }
  }

  // ========================================================
  // 4. URL / Query string fallback: ?studentId=KP-001&answer=A
  // ========================================================
  if (!extractedStudentId && (clean.includes('?') || clean.includes('&'))) {
    try {
      const url = new URL(clean.startsWith('http') ? clean : `https://dummy.app/${clean}`);
      const stId =
        url.searchParams.get('studentId') ||
        url.searchParams.get('id') ||
        url.searchParams.get('sid');
      const ans =
        url.searchParams.get('answer') ||
        url.searchParams.get('ans') ||
        url.searchParams.get('opt');
      if (stId && ans) {
        extractedStudentId = stId;
        extractedAnswer = ans;
      }
    } catch {
      // continue
    }
  }

  // If nothing matched, this QR is completely unrecognized
  if (!extractedStudentId || !extractedAnswer) {
    return {
      valid: false,
      error: '❌ QR bukan kad Kembara Dunia Pecahan.',
      rawText: clean,
    };
  }

  // Normalize student ID:
  // e.g. kp-001 -> KP-001
  // e.g. KP-1 -> KP-001
  // e.g. KP1 -> KP-001
  const upperStudentId = extractedStudentId.trim().toUpperCase();
  let normalizedStudentId = upperStudentId;
  const numMatch = upperStudentId.match(/^KP-?(\d+)$/i);
  if (numMatch && numMatch[1]) {
    normalizedStudentId = `KP-${numMatch[1].padStart(3, '0')}`;
  }

  // Validate answer: Must be A, B, C, or D
  const upperAnswer = extractedAnswer.trim().toUpperCase();
  if (!['A', 'B', 'C', 'D'].includes(upperAnswer)) {
    return {
      valid: false,
      app: OFFICIAL_QR_PREFIX,
      studentId: normalizedStudentId,
      error: '❌ Jawapan QR tidak sah.',
      rawText: clean,
    };
  }

  const answerOption = upperAnswer as AnswerOption;
  const qrId = formatQrId(normalizedStudentId, answerOption);

  return {
    valid: true,
    app: OFFICIAL_QR_PREFIX,
    studentId: normalizedStudentId,
    answerOption,
    qrId,
    rawText: clean,
  };
}

/**
 * Validates a scanned studentId against the selected class and all registered students.
 * Rules:
 * - If studentId is in selected class -> valid (✓ diterima)
 * - If studentId exists but belongs to another class -> "⚠️ Kad bukan daripada kelas ini."
 * - If studentId does not exist at all -> "⚠️ Murid tidak dikenali."
 */
export function validateScannedStudent(
  studentId: string,
  classStudents: InteractiveClassStudent[],
  allStudents?: InteractiveClassStudent[]
): {
  valid: boolean;
  student?: InteractiveClassStudent;
  studentName?: string;
  error?: string;
} {
  const cleanId = studentId.trim().toUpperCase();

  // Normalize KP-1 or KP-01 to KP-001
  let normalizedId = cleanId;
  const matchNum = cleanId.match(/^KP-?(\d+)$/i);
  if (matchNum && matchNum[1]) {
    normalizedId = `KP-${matchNum[1].padStart(3, '0')}`;
  }

  // 1. Check in currently selected class (match either exact or normalized)
  const inClass = classStudents.find((s) => {
    const sId = s.studentId.trim().toUpperCase();
    return sId === cleanId || sId === normalizedId;
  });

  if (inClass) {
    if (inClass.cardStatus === 'inactive') {
      return {
        valid: false,
        student: inClass,
        studentName: inClass.studentName,
        error: `⚠️ Kad murid tidak aktif (${inClass.studentName}).`,
      };
    }
    return {
      valid: true,
      student: inClass,
      studentName: inClass.studentName,
    };
  }

  // 2. If not found in current class, check if student exists in another class
  const pool = allStudents && allStudents.length > 0 ? allStudents : getAllInteractiveStudents();
  const elsewhere = pool.find((s) => {
    const sId = s.studentId.trim().toUpperCase();
    return sId === cleanId || sId === normalizedId;
  });

  if (elsewhere) {
    return {
      valid: false,
      student: elsewhere,
      studentName: elsewhere.studentName,
      error: '⚠️ Kad bukan daripada kelas ini.',
    };
  }

  // 3. Not found anywhere (e.g. KP-999)
  return {
    valid: false,
    error: '⚠️ Murid tidak dikenali.',
  };
}

/**
 * Generates the 4 QR entries for a student (A, B, C, D)
 * Each combination (studentId + answer) is strictly unique.
 * Metadata contains complete descriptors while QR payload contains minimal standardized format.
 */
export function getStudentFourQrs(student: InteractiveClassStudent): StudentQrEntry[] {
  return ANSWER_OPTIONS.map((option) => {
    const qrId = formatQrId(student.studentId, option);
    const qrPayload = buildQrPayload(student.studentId, option);

    return {
      studentId: student.studentId.trim().toUpperCase(),
      studentName: student.studentName,
      class: student.class,
      qrId,
      answerOption: option,
      status: student.cardStatus,
      createdAt: student.createdAt,
      qrPayload,
      type: 'answer-card',
      app: 'kembara-dunia-pecahan',
      metadata: {
        studentId: student.studentId.trim().toUpperCase(),
        answer: option,
        qrId,
        type: 'answer-card',
        app: 'kembara-dunia-pecahan',
        status: student.cardStatus,
      },
    };
  });
}

/**
 * Generates a data URL for a specific QR payload with high contrast and quiet zone
 * Quality rules:
 * - margin: 3 (guarantees clear white margin / quiet zone for fast camera recognition)
 * - dark: #000000 (pure black modules for maximum contrast)
 * - light: #ffffff (pure white background)
 * - errorCorrectionLevel: 'M' (15% error recovery)
 */
export async function generateQrDataUrl(
  payload: string,
  size = 360,
  darkColor = '#000000'
): Promise<string> {
  return QRCode.toDataURL(payload, {
    width: size,
    margin: 3,
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
 * Generates a high-resolution, printable single QR Card Canvas for a student (A, B, C or D).
 * Layout:
 * ADAM HAKIMI
 * A
 * [ QR CODE ]
 * KP-001
 * 
 * Dimensions: 800 x 1100 px (crisp for screen, download and print)
 */
export async function generateSingleQrCardCanvas(
  student: InteractiveClassStudent,
  option: AnswerOption
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2D canvas context');

  const meta = OPTION_METADATA[option];
  const payload = buildQrPayload(student.studentId, option);

  // Background: Pure White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Outer border with card color
  ctx.lineWidth = 12;
  ctx.strokeStyle = meta.color;
  roundRect(ctx, 24, 24, width - 48, height - 48, 36);
  ctx.stroke();

  // Header Banner: App Title & Student Name
  ctx.fillStyle = meta.bgColor;
  roundRect(ctx, 44, 44, width - 88, 150, 24);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = meta.borderColor;
  ctx.stroke();

  // App Title
  ctx.textAlign = 'center';
  ctx.fillStyle = meta.textColor;
  ctx.font = 'bold 22px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
  ctx.fillText('🍕 KEMBARA DUNIA PECAHAN • KELAS INTERAKTIF', width / 2, 85);

  // Student Full Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
  ctx.fillText(student.studentName.toUpperCase(), width / 2, 135);

  // Subtitle: Class & Status
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(`KELAS: ${student.class.toUpperCase()}   •   KAD JAWAPAN INDIVIDU`, width / 2, 172);

  // Large Prominent Letter Label: "A", "B", "C", "D"
  ctx.fillStyle = meta.color;
  roundRect(ctx, width / 2 - 160, 215, 320, 85, 24);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Arial Black", sans-serif';
  ctx.fillText(`${meta.badgeEmoji}  JAWAPAN  ${option}`, width / 2, 275);

  // QR Code Box (generous white container with shadow and quiet zone)
  const qrBoxSize = 510;
  const qrBoxX = (width - qrBoxSize) / 2;
  const qrBoxY = 325;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 28);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();

  // Load high-resolution QR image (500x500 px with quiet zone)
  const qrDataUrl = await generateQrDataUrl(payload, 480);
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });

  // Draw QR code with clean margin inside box (no overlaps, no text on top)
  const qrInnerPad = 25;
  ctx.drawImage(
    qrImg,
    qrBoxX + qrInnerPad,
    qrBoxY + qrInnerPad,
    qrBoxSize - qrInnerPad * 2,
    qrBoxSize - qrInnerPad * 2
  );

  // Student ID Section below QR Code
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 48px "Arial Black", monospace';
  ctx.fillText(student.studentId, width / 2, 905);

  ctx.fillStyle = meta.textColor;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(`KOD: ${student.studentId}-${option}`, width / 2, 945);

  // Standard payload note (verifiable on card)
  ctx.fillStyle = '#64748b';
  ctx.font = '16px monospace';
  ctx.fillText(`FORMAT: ${payload}`, width / 2, 980);

  // Instruction Footer
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
  ctx.fillText(
    `💡 Angkat kad kod QR ini menghadap kamera guru untuk menjawab pilihan ${option}`,
    width / 2,
    1040
  );

  return canvas;
}

/**
 * Generates a single high-resolution QR card download for a student (e.g. KP-001-A) in PNG format
 */
export async function downloadSingleQr(
  student: InteractiveClassStudent,
  option: AnswerOption
): Promise<void> {
  const canvas = await generateSingleQrCardCanvas(student, option);
  const dataUrl = canvas.toDataURL('image/png');

  // Clean filename: KP-001_Adam_Hakimi_QR_A.png
  const safeName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${student.studentId}_${safeName}_QR_${option}.png`;

  triggerFileDownload(dataUrl, filename);
}

/**
 * Generates a complete, high-resolution 4-QR card sheet (PNG) for a student.
 * Layout matches standard A4 card layout:
 * - Header: KEMBARA DUNIA PECAHAN & KAD JAWAPAN KELAS INTERAKTIF
 * - Student Name, ID, Class
 * - 2x2 Grid of QRs (A | B over C | D) with distinct colored badges and labels
 * - Large QR codes with clear quiet zone, no text overlapping QR
 */
export async function generateStudentCardCanvas(
  student: InteractiveClassStudent
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1300;
  const height = 1750;
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
  ctx.font = 'bold 32px "Arial Rounded MT Bold", sans-serif';
  ctx.fillText('🍕 KEMBARA DUNIA PECAHAN • KAD JAWAPAN KELAS INTERAKTIF', width / 2, 105);

  ctx.fillStyle = '#0f172a'; // Slate-900
  ctx.font = 'bold 46px "Arial Rounded MT Bold", "Trebuchet MS", sans-serif';
  ctx.fillText(student.studentName.toUpperCase(), width / 2, 175);

  // Subtitle / ID & Class Badge
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(
    `ID: ${student.studentId}   •   KELAS: ${student.class.toUpperCase()}   •   KAD 4 QR RASMI`,
    width / 2,
    230
  );

  // Load the 4 QRs with generous quiet zone
  const qrPromises = ANSWER_OPTIONS.map((opt) => {
    const payload = buildQrPayload(student.studentId, opt);
    return generateQrDataUrl(payload, 400);
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

  // 2x2 Grid Coordinates:
  // Row 1: A (left) | B (right)
  // Row 2: C (left) | D (right)
  const cellWidth = 550;
  const cellHeight = 630;
  const colLeft = 70;
  const colRight = 680;
  const rowTop = 300;
  const rowBottom = 970;

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

    // Top Label Banner for Option (Large and bold)
    ctx.fillStyle = meta.color;
    roundRect(ctx, x + 25, y + 22, cellWidth - 50, 75, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${meta.badgeEmoji}  JAWAPAN ${opt}`, x + cellWidth / 2, y + 74);

    // QR Code Container with pure white background & quiet zone
    const qrBoxSize = 400;
    const qrBoxX = x + (cellWidth - qrBoxSize) / 2;
    const qrBoxY = y + 115;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Draw QR image (centered, no obstructions)
    const pad = 20;
    ctx.drawImage(img, qrBoxX + pad, qrBoxY + pad, qrBoxSize - pad * 2, qrBoxSize - pad * 2);

    // Bottom info under QR: ID and Code
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px "Arial Black", monospace';
    ctx.fillText(student.studentId, x + cellWidth / 2, y + 560);

    ctx.fillStyle = meta.textColor;
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`KOD: ${student.studentId}-${opt}`, x + cellWidth / 2, y + 595);
  });

  // Footer Instructions
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    '💡 Arahan Murid: Angkat kod QR jawapan pilihan (A, B, C atau D) menghadap kamera laptop guru.',
    width / 2,
    1665
  );

  ctx.fillStyle = '#64748b';
  ctx.font = '16px monospace';
  ctx.fillText(
    `FORMAT RASMI QR: KEMBARA|${student.studentId}|[A/B/C/D]   •   RESOLUSI TINGGI • QUIET ZONE AKTIF`,
    width / 2,
    1705
  );

  return canvas;
}

/**
 * Downloads a complete 4-QR card sheet as a high-resolution PNG
 */
export async function downloadStudentCardPng(student: InteractiveClassStudent): Promise<void> {
  const canvas = await generateStudentCardCanvas(student);
  const dataUrl = canvas.toDataURL('image/png');
  const safeName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${student.studentId}_${safeName}_Set_4_QR.png`;
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
      cardsFolder?.file(`${student.studentId}_${safeName}_Set_4_QR.png`, cardBase64, {
        base64: true,
      });
    } catch (e) {
      console.warn('Failed to render card for', student.studentId, e);
    }

    // 2. Generate the 4 individual QR cards (A, B, C, D)
    for (const opt of ANSWER_OPTIONS) {
      try {
        const singleCanvas = await generateSingleQrCardCanvas(student, opt);
        const singleDataUrl = singleCanvas.toDataURL('image/png');
        const singleBase64 = singleDataUrl.replace(/^data:image\/png;base64,/, '');
        singleQrFolder?.file(`${student.studentId}_${safeName}_QR_${opt}.png`, singleBase64, {
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

/**
 * Automated verification test helper to validate BOTH:
 * 1. Legacy printed formats (KP-001-A, KP-001-B, KP-001-C, KP-001-D)
 * 2. Standard pipe format (KEMBARA|KP-001|A)
 * 3. JSON format ({"studentId": "KP-001", "answer": "A"})
 */
export function verifyStandardQrPayloads(): {
  allPassed: boolean;
  results: {
    formatName: string;
    studentId: string;
    answer: AnswerOption;
    payload: string;
    parsedValid: boolean;
    parsedStudentId?: string;
    parsedAnswer?: AnswerOption;
    isCorrect: boolean;
  }[];
} {
  const testCases: {
    formatName: string;
    studentId: string;
    answer: AnswerOption;
    payload: string;
  }[] = [
    // 1. Printed Legacy Format (KP-001-A, B, C, D)
    {
      formatName: 'Legacy Printed Card A',
      studentId: 'KP-001',
      answer: 'A',
      payload: 'KP-001-A',
    },
    {
      formatName: 'Legacy Printed Card B',
      studentId: 'KP-001',
      answer: 'B',
      payload: 'KP-001-B',
    },
    {
      formatName: 'Legacy Printed Card C',
      studentId: 'KP-001',
      answer: 'C',
      payload: 'KP-001-C',
    },
    {
      formatName: 'Legacy Printed Card D',
      studentId: 'KP-001',
      answer: 'D',
      payload: 'KP-001-D',
    },
    {
      formatName: 'Legacy Printed Murid 2 A',
      studentId: 'KP-002',
      answer: 'A',
      payload: 'KP-002-A',
    },
    // 2. Standard pipe format
    {
      formatName: 'Standard Pipe A',
      studentId: 'KP-001',
      answer: 'A',
      payload: buildQrPayload('KP-001', 'A'),
    },
    {
      formatName: 'Standard Pipe B',
      studentId: 'KP-001',
      answer: 'B',
      payload: buildQrPayload('KP-001', 'B'),
    },
    // 3. Encoded JSON format
    {
      formatName: 'JSON Format A',
      studentId: 'KP-001',
      answer: 'A',
      payload: JSON.stringify({ studentId: 'KP-001', answer: 'A' }),
    },
  ];

  const results = testCases.map(({ formatName, studentId, answer, payload }) => {
    const parsed = parseQrCodeData(payload);

    const isCorrect =
      parsed.valid &&
      parsed.studentId === studentId &&
      parsed.answerOption === answer;

    return {
      formatName,
      studentId,
      answer,
      payload,
      parsedValid: parsed.valid,
      parsedStudentId: parsed.studentId,
      parsedAnswer: parsed.answerOption,
      isCorrect,
    };
  });

  return {
    allPassed: results.every((r) => r.isCorrect),
    results,
  };
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

