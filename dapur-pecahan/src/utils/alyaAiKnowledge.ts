/**
 * AI TEACHING ASSISTANT — PECAHAN DARJAH 3
 * Enjin Bimbingan Pedagogi Pintar Guru Matematik Sekolah Rendah:
 * Faham -> Visualkan -> Fikir -> Selesaikan -> Semak
 * 
 * Standard Kurikulum DSKP Matematik Tahun 3 - Topik Pecahan, Perpuluhan & Peratus
 */

export interface VisualDiagram {
  type: 'bar' | 'pizza' | 'cake' | 'circle_chart' | 'mixed' | 'comparison' | 'group';
  title: string;
  totalParts?: number;
  shadedParts?: number;
  selectedVisualMode?: 'circle' | 'pizza' | 'cake' | 'bar';
  emojiBlocks?: string; // e.g. "🟩 🟩 🟩 ⬜"
  explanation?: string;
  mixed?: {
    whole: number;
    numerator: number;
    denominator: number;
    totalUnits: number;
  };
  comparison?: {
    frac1: { label: string; num: number; den: number };
    frac2: { label: string; num: number; den: number };
    winner: string;
  };
  group?: {
    totalItems: number;
    groups: number;
    itemsPerGroup: number;
    selectedGroups: number;
    emoji: string;
  };
}

export interface MathWorkspace {
  problemTitle: string;
  category: string;
  problemEquation: string;
  formulaUsed: string;
  pedagogicalStage?: string; // FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK
  stepByStep: string[];
  finalAnswer: string;
  note?: string;
  socraticQuestion?: string;
}

export interface AlyaAIResult {
  identifiedTopic: string;
  confidenceTag: string;
  pedagogicalStageTag?: string;
  mathWorkspace?: MathWorkspace;
  visualDiagram?: VisualDiagram;
  explanationText: string;
  socraticPrompt?: string;
  proTip?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'alya' | 'user';
  text: string;
  timestamp: string;
  identifiedTopic?: string;
  pedagogicalStageTag?: string;
  mathWorkspace?: MathWorkspace;
  visualDiagram?: VisualDiagram;
  socraticPrompt?: string;
  proTip?: string;
}

export const PRESET_QUESTIONS = [
  {
    id: 'q_tambah_berlaku',
    label: '➕ Bagaimana Penambahan Pecahan Berlaku?',
    query: 'Bagaimana penambahan pecahan berlaku?',
  },
  {
    id: 'q_tolak_berlaku',
    label: '➖ Bagaimana Penolakan Pecahan Berlaku?',
    query: 'Bagaimana penolakan pecahan berlaku?',
  },
  {
    id: 'q_tukar_perpuluhan',
    label: '🔢 Tukarkan Pecahan Kepada Bentuk Perpuluhan',
    query: 'Tukarkan pecahan kepada bentuk perpuluhan.',
  },
  {
    id: 'q_perkataan_tambah',
    label: '🗣️ Soalan Perkataan: Lima per tiga tambah empat per dua',
    query: 'Lima per tiga tambah empat per dua',
  },
  {
    id: 'q_visual_3_4',
    label: '⚪ Rajah Bulatan Asas: Pecahan 3/4',
    query: 'Tunjukkan rajah bulatan untuk pecahan 3/4.',
  },
  {
    id: 'q_visual_5_8',
    label: '⚪ Rajah Bulatan Asas: Pecahan 5/8',
    query: 'Tunjukkan rajah bulatan untuk pecahan 5/8.',
  },
  {
    id: 'q_visual_bulatan',
    label: '⚪ Siri Rajah Bulatan 1 hingga 12 (Asas Pecahan)',
    query: 'Tunjukkan siri rajah bulatan pecahan 1 hingga 12 bahagian.',
  },
  {
    id: 'q_cerita',
    label: '📖 Soalan Cerita: Ali & Ahmad Kongsi Kek',
    query: 'Ali makan 1/4 kek dan Ahmad makan 2/4 kek. Berapakah jumlah kek yang dimakan?',
  },
  {
    id: 'q_tambah',
    label: '➕ Tambah Pecahan: 1/5 + 2/5',
    query: 'Berapakah hasil tambah 1/5 + 2/5 dan bagaimana cara fikirnya?',
  },
  {
    id: 'q_tolak',
    label: '➖ Tolak Pecahan: 3/4 - 1/4',
    query: 'Berapakah 3/4 - 1/4?',
  },
  {
    id: 'q_bercampur',
    label: '🍰 Tukar 2 1/3 -> Tak Wajar (Kenapa Darab?)',
    query: 'Bagaimana tukar nombor bercampur 2 1/3 kepada pecahan tak wajar dan kenapa kena darab?',
  },
  {
    id: 'q_tukar_imp',
    label: '🔄 Tukar 7/3 -> Nombor Bercampur',
    query: 'Bagaimana tukar pecahan tak wajar 7/3 kepada nombor bercampur?',
  },
  {
    id: 'q_salah',
    label: '⚠️ Kesilapan Biasa: 1/2 + 1/3 = 2/5?',
    query: 'Betulkah 1/2 + 1/3 bersamaan dengan 2/5?',
  },
  {
    id: 'q_takfaham',
    label: '❓ Saya Tak Faham Pecahan (Bimbingan Asas)',
    query: 'Puan Alya, saya tak faham tajuk pecahan. Boleh ajar saya?',
  },
  {
    id: 'q_banding',
    label: '⚖️ Banding: Mana Lebih Besar 2/3 vs 3/4?',
    query: 'Mana lebih besar antara 2/3 dan 3/4?',
  },
  {
    id: 'q_kumpulan',
    label: '🍗 Kumpulan: 3/5 daripada 15 Biji Telur',
    query: 'Berapakah 3/5 daripada 15?',
  },
  {
    id: 'q_adaptasi',
    label: '📶 🌐 Adaptasi Online & Offline',
    query: 'Bagaimanakah aplikasi beradaptasi dalam mod online dan offline?',
  },
];

/**
 * Menukar soalan pecahan dalam bentuk perkataan bahasa Melayu kepada format angka
 * Contoh: "lima per tiga tambah empat per dua" -> "5/3 + 4/2"
 * Contoh: "dua per empat tolak satu per empat" -> "2/4 - 1/4"
 * Contoh: "tiga per lima" -> "3/5"
 */
export function normalizeMalayFractionText(input: string): string {
  let text = input.trim();

  // Istilah khas pecahan lazim
  text = text.replace(/\btiga suku\b/gi, '3/4');
  text = text.replace(/\bseparuh\b/gi, '1/2');
  text = text.replace(/\bsetengah\b/gi, '1/2');
  text = text.replace(/\bsuku\b/gi, '1/4');
  text = text.replace(/\bseperdua belas\b/gi, '1/12');
  text = text.replace(/\bsebelas per dua belas\b/gi, '11/12');
  text = text.replace(/\bsepersepuluh\b/gi, '1/10');
  text = text.replace(/\bsepersembilan\b/gi, '1/9');
  text = text.replace(/\bseperlapan\b/gi, '1/8');
  text = text.replace(/\bsepertujuh\b/gi, '1/7');
  text = text.replace(/\bseperenam\b/gi, '1/6');
  text = text.replace(/\bseperlima\b/gi, '1/5');
  text = text.replace(/\bseperempat\b/gi, '1/4');
  text = text.replace(/\bsepertiga\b/gi, '1/3');
  text = text.replace(/\bseperdua\b/gi, '1/2');

  const wordMap: Record<string, string> = {
    'dua puluh satu': '21',
    'dua puluh': '20',
    'sembilan belas': '19',
    'lapan belas': '18',
    'tujuh belas': '17',
    'enam belas': '16',
    'lima belas': '15',
    'empat belas': '14',
    'tiga belas': '13',
    'dua belas': '12',
    'sebelas': '11',
    'sepuluh': '10',
    'sembilan': '9',
    'lapan': '8',
    'tujuh': '7',
    'enam': '6',
    'lima': '5',
    'empat': '4',
    'tiga': '3',
    'dua': '2',
    'satu': '1',
    'sifar': '0',
    'kosong': '0',
  };

  const numWords =
    '(?:dua puluh satu|dua puluh|sembilan belas|lapan belas|tujuh belas|enam belas|lima belas|empat belas|tiga belas|dua belas|sebelas|sepuluh|sembilan|lapan|tujuh|enam|lima|empat|tiga|dua|satu|sifar|kosong|\\d+)';
  const fracRegex = new RegExp(`(${numWords})\\s+per\\s+(${numWords})`, 'gi');

  text = text.replace(fracRegex, (_, p1, p2) => {
    const n1 = wordMap[p1.toLowerCase()] || p1;
    const n2 = wordMap[p2.toLowerCase()] || p2;
    return `${n1}/${n2}`;
  });

  // Operasi dalam perkataan
  text = text.replace(/\bcampur\b/gi, '+');
  text = text.replace(/\bdijumlahkan dengan\b/gi, '+');
  text = text.replace(/\bditolak dengan\b/gi, '-');
  text = text.replace(/\bkurang\b/gi, '-');

  return text;
}

// Helper: Greatest Common Divisor
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Helper: Simplify Fraction
function simplify(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num, den };
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

// Helper to generate visual block emojis (e.g. 🟩 🟩 🟩 ⬜)
function getEmojiBlocks(shaded: number, total: number): string {
  const safeTotal = Math.min(Math.max(total, 1), 12);
  const safeShaded = Math.min(Math.max(shaded, 0), safeTotal);
  let str = '';
  for (let i = 0; i < safeTotal; i++) {
    str += i < safeShaded ? '🟩 ' : '⬜ ';
  }
  return str.trim();
}

/**
 * Intelligent AI Teaching Assistant Reasoning Engine (Puan Alya)
 * Strictly adheres to the 5-Stage Method:
 * FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK
 */
export function getAlyaResponse(userQuery: string): AlyaAIResult {
  const raw = userQuery.trim();
  const normalizedRaw = normalizeMalayFractionText(raw);
  const q = normalizedRaw.toLowerCase();
  const originalQ = raw.toLowerCase();

  // =========================================================================
  // 0A. BAGAIMANA PENAMBAHAN PECAHAN BERLAKU (DSKP 3.1.5)
  // (Tanpa visual diagram kerana soalan berkaitan penambahan pecahan)
  // =========================================================================
  const isHowAdditionWorks =
    (originalQ.includes('bagaimana') ||
      originalQ.includes('bagaimanakah') ||
      originalQ.includes('cara') ||
      originalQ.includes('macam mana') ||
      originalQ.includes('terangkan') ||
      originalQ.includes('apa itu')) &&
    (originalQ.includes('penambahan') ||
      (originalQ.includes('tambah') && originalQ.includes('pecahan'))) &&
    (originalQ.includes('berlaku') ||
      originalQ.includes('beroperasi') ||
      originalQ.includes('dilakukan') ||
      originalQ.includes('konsep') ||
      originalQ.includes('kaedah') ||
      !originalQ.match(/\d/));

  if (isHowAdditionWorks) {
    return {
      identifiedTopic: 'Konsep Pedagogi: Bagaimana Penambahan Pecahan Berlaku (DSKP 3.1.5)',
      confidenceTag: 'Kategori: Konsep Operasi Tambah DSKP',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Panduan Lengkap: Cara & Konsep Penambahan Pecahan',
        category: 'Operasi Tambah Pecahan (DSKP 3.1.5)',
        problemEquation: '(Pengangka 1 + Pengangka 2) / Penyebut Sama',
        formulaUsed: '1. Semak Penyebut -> 2. Tambah Pengangka Sahaja -> 3. Penyebut KEKAL -> 4. Permudahkan',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Semak Saiz Potongan / Penyebut): Lihat nombor di BAWAH (penyebut). Adakah saiz potongan loyang sama atau berbeza?',
          'Langkah 2 (Jika Penyebut SAMA - Contoh: 1/5 + 2/5): Kita HANYA menambah nombor di ATAS (pengangka): 1 + 2 = 3. Nombor penyebut 5 di bawah KEKAL sama! Jawapannya ialah 3/5.',
          'Langkah 3 (Kenapa Nombor Bawah Tak Boleh Ditambah?): Nombor penyebut di bawah melambangkan "nama saiz potongan loyang". Saiz loyang tidak bertambah menjadi 10 petak, yang bertambah hanyalah bilangan kepingan yang kita kumpulkan!',
          'Langkah 4 (Jika Penyebut BERBEZA - Contoh: 1/2 + 1/4): Kita mesti samakan saiz potongan dahulu menggunakan sifir sepunya: 1/2 ditukar menjadi 2/4. Kemudian barulah ditambah: 2/4 + 1/4 = 3/4.',
          'Langkah 5 (Semak & Permudahkan): Jika jawapan boleh dibahagikan sama rata (contoh: 2/4), permudahkan kepada bentuk termudah (1/2).',
        ],
        finalAnswer: 'Penyebut sama -> Tambah nombor atas sahaja. Nombor bawah kekal sama!',
        note: 'Prinsip Emas: Jangan sesekali menambah nombor di bawah (penyebut)!',
        socraticQuestion: 'Cuba adik bayangkan: Jika adik ada 1 keping pizza daripada loyang 6 potong (1/6) dan kawan beri lagi 2 keping (2/6), berapa keping pizza yang adik ada sekarang? Adakah saiz loyang berubah?',
      },
      explanationText: `Hai adik! Mari Puan Alya terangkan **bagaimana operasi penambahan pecahan berlaku** dengan sangat mudah difahami 👩‍🍳✨\n\nPenambahan pecahan berlaku melalui **4 prinsip utama** mengikut sukatan Matematik Tahun 3:\n\n1. **Semak Nombor Bawah (Penyebut)**:\n• Nombor bawah menunjukkan **saiz potongan loyang**.\n• Kita mesti pastikan saiz potongannya sama sebelum boleh menambah.\n\n2. **Jika Nombor Bawah SAMA (Paling Kerap Keluar!)**:\n• Kita **HANYA TAMBAH NOMBOR ATAS (Pengangka)** sahaja!\n• **Nombor bawah KEKAL SAMA**, jangan ditambah!\n• *Contoh*: **1/5 + 2/5 = 3/5** *(1 keping + 2 keping = 3 keping daripada loyang 5 petak)*.\n\n3. **Jika Nombor Bawah BERBEZA**:\n• Kita perlu cari sifir sepunya untuk samakan saiz potongan dahulu.\n• *Contoh*: 1/2 + 1/4 -> Tukar 1/2 kepada 2/4, maka **2/4 + 1/4 = 3/4**.\n\n4. **Permudahkan Jawapan**:\n• Jika jawapan boleh dibahagi, permudahkan ke bentuk termudah (contoh: 2/4 = 1/2).\n\nIngat petua Chef Alya: **"Penyebut sama, campur yang atas sahaja!"** 😊`,
      socraticPrompt: 'Uji diri: Kenapa 1/4 + 2/4 = 3/4 dan BUKAN 3/8? Kerana saiz loyang kekal 4 bahagian!',
      proTip: 'Prinsip Emas: Anggap nombor bawah seperti nama buah: 1 epal + 2 epal = 3 epal (bukan 3 epal berganda)!',
    };
  }

  // =========================================================================
  // 0B. BAGAIMANA PENOLAKAN PECAHAN BERLAKU (DSKP 3.1.6)
  // (Tanpa visual diagram kerana soalan berkaitan penolakan pecahan)
  // =========================================================================
  const isHowSubtractionWorks =
    (originalQ.includes('bagaimana') ||
      originalQ.includes('bagaimanakah') ||
      originalQ.includes('cara') ||
      originalQ.includes('macam mana') ||
      originalQ.includes('terangkan') ||
      originalQ.includes('apa itu')) &&
    (originalQ.includes('penolakan') ||
      (originalQ.includes('tolak') && originalQ.includes('pecahan'))) &&
    (originalQ.includes('berlaku') ||
      originalQ.includes('beroperasi') ||
      originalQ.includes('dilakukan') ||
      originalQ.includes('konsep') ||
      originalQ.includes('kaedah') ||
      !originalQ.match(/\d/));

  if (isHowSubtractionWorks) {
    return {
      identifiedTopic: 'Konsep Pedagogi: Bagaimana Penolakan Pecahan Berlaku (DSKP 3.1.6)',
      confidenceTag: 'Kategori: Konsep Operasi Tolak DSKP',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Panduan Lengkap: Cara & Konsep Penolakan Pecahan',
        category: 'Operasi Tolak Pecahan (DSKP 3.1.6)',
        problemEquation: '(Pengangka 1 - Pengangka 2) / Penyebut Sama',
        formulaUsed: '1. Semak Penyebut -> 2. Tolak Pengangka Sahaja -> 3. Penyebut KEKAL -> 4. Permudahkan',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Semak Penyebut): Periksa nombor di BAWAH (penyebut). Pastikan kedua-dua pecahan mempunyai saiz potongan yang sama.',
          'Langkah 2 (Jika Penyebut SAMA - Contoh: 3/4 - 1/4): Tolakkan nombor di ATAS sahaja: 3 - 1 = 2. Penyebut 4 di bawah KEKAL sama: 2/4.',
          'Langkah 3 (Permudahkan Bentuk Termudah): 2/4 boleh dibahagi dengan 2 pada atas dan bawah: 2 ÷ 2 = 1, 4 ÷ 2 = 2. Jawapan akhir = 1/2.',
          'Langkah 4 (Tolak Daripada 1 Objek Penuh - Contoh: 1 - 2/5): Tukarkan nombor bulat 1 kepada pecahan sama penyebut: 1 = 5/5. Kemudian tolakkan pengangka: 5/5 - 2/5 = 3/5.',
          'Langkah 5 (Semak): Pastikan baki adalah munasabah dan lebih kecil daripada bilangan kepingan awal.',
        ],
        finalAnswer: 'Tolak nombor atas sahaja. Nombor penyebut di bawah kekal sama!',
        note: 'Penolakan pecahan bermaksud mengambil sebahagian potongan daripada jumlah loyang sedia ada.',
        socraticQuestion: 'Cuba adik bayangkan: Ada 4 potong kek coklat di atas meja (4/5 loyang). Adik makan 1 potong (1/5). Berapakah baki potongan kek yang tinggal di atas meja?',
      },
      explanationText: `Jom kita pelajari **bagaimana operasi penolakan pecahan berlaku** langkah demi langkah 👩‍🍳✨\n\nPenolakan pecahan adalah proses mengambil atau menolak sebahagian kepingan daripada jumlah yang ada:\n\n1. **Semak Nombor Bawah (Penyebut)**:\n• Pastikan nombor bawah adalah sama kerana ia mewakili saiz kepingan loyang.\n\n2. **Tolak Nombor Atas Sahaja (Pengangka)**:\n• Apabila nombor bawah sama, kita **HANYA TOLAK NOMBOR ATAS**:\n• **Nombor bawah KEKAL SAMA!**\n• *Contoh*: **3/4 - 1/4 = 2/4** (atau dipermudahkan menjadi **1/2**).\n\n3. **Penolakan Daripada 1 Objek Penuh (Contoh: 1 - 2/5)**:\n• Ingat: 1 loyang penuh boleh ditukar kepada pecahan berpenyebut sama, iaitu **1 = 5/5**.\n• Jadi: **5/5 - 2/5 = 3/5**! Sangat mudah, kan?\n\n4. **Permudahkan Kepada Bentuk Termudah**:\n• Jika nombor atas dan bawah boleh dibahagi nombor sama, kecilkan (contoh: 2/4 = 1/2).\n\nIngat peraturan emas Chef Alya: **"Nombor bawah kekal saiznya, tolak nombor atas yang kita ambil!"** 😊`,
      socraticPrompt: 'Ingat kunci mudah: Tolak bahagian yang diambil, saiz loyang tidak pernah berkurang!',
      proTip: 'Situasi Dapur: 7/10 loyang karipap diambil 3/10 oleh pelanggan, baki tinggal 4/10 = 2/5 loyang karipap!',
    };
  }

  // =========================================================================
  // 0C. TUKAR PECAHAN KEPADA BENTUK PERPULUHAN (DSKP 3.2.1 & 3.2.2)
  // =========================================================================
  const isConvertToDecimal =
    (originalQ.includes('tukar') ||
      originalQ.includes('tukarkan') ||
      originalQ.includes('bagaimana') ||
      originalQ.includes('cara') ||
      originalQ.includes('macam mana')) &&
    (originalQ.includes('perpuluhan') || originalQ.includes('titik perpuluhan')) &&
    (originalQ.includes('pecahan') ||
      originalQ.includes('bentuk') ||
      originalQ.includes('kepada') ||
      originalQ.includes('ke'));

  if (isConvertToDecimal) {
    return {
      identifiedTopic: 'Penukaran Pecahan Kepada Bentuk Perpuluhan (DSKP 3.2.1 & 3.2.2)',
      confidenceTag: 'Kategori: Hubungan Pecahan & Perpuluhan DSKP',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Ruang Panduan: Cara Tukar Pecahan Kepada Bentuk Perpuluhan',
        category: 'Pecahan ke Perpuluhan (Tahun 3)',
        problemEquation: 'Pecahan (Pengangka / Penyebut) = Pengangka ÷ Penyebut = Nombor Perpuluhan (0._)',
        formulaUsed: 'Kaedah 1: Jadikan Penyebut 10 atau 100 | Kaedah 2: Operasi Bahagi',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Faham Konsep): Titik perpuluhan memisahkan nilai saiz pecahan. Pecahan persepuluh (/10) ditulis dengan 1 tempat perpuluhan (cth: 1/10 = 0.1, 7/10 = 0.7). Pecahan perseratus (/100) ditulis dengan 2 tempat perpuluhan (cth: 25/100 = 0.25).',
          'Langkah 2 (Kaedah Terpantas - Jadikan Penyebut 10): Jika penyebut ialah 2 atau 5, darabkan nombor atas dan bawah supaya penyebut menjadi 10:',
          '   • 1/2 = (1 × 5) / (2 × 5) = 5/10 = 0.5 (Separuh)',
          '   • 3/5 = (3 × 2) / (5 × 2) = 6/10 = 0.6',
          '   • 4/5 = (4 × 2) / (5 × 2) = 8/10 = 0.8',
          'Langkah 3 (Jadikan Penyebut 100): Jika penyebut ialah 4, darabkan nombor atas dan bawah dengan 25 supaya penyebut menjadi 100:',
          '   • 1/4 = (1 × 25) / (4 × 25) = 25/100 = 0.25 (Suku)',
          '   • 3/4 = (3 × 25) / (4 × 25) = 75/100 = 0.75 (Tiga Suku)',
          'Langkah 4 (Kaedah Bahagi Terus): Garis palang pecahan bermaksud operasi bahagi. 1/2 = 1 ÷ 2 = 0.5. 1/4 = 1 ÷ 4 = 0.25.',
          'Langkah 5 (Semak Jadual Pecahan Emas): Hafal pecahan lazim yang kerap diuji dalam peperiksaan Tahun 3.',
        ],
        finalAnswer: 'Darabkan penyebut menjadi 10 atau 100, kemudian tukar kepada titik perpuluhan!',
        note: 'Pecahan Asas: 1/10 = 0.1, 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75.',
        socraticQuestion: 'Cuba adik fikir: Jika 1/10 ialah 0.1, berapakah nilai perpuluhan untuk 8/10? Ya, tepat sekali: 0.8!',
      },
      explanationText: `Hai adik! Menukar pecahan kepada nombor perpuluhan adalah kemahiran penting dalam Matematik Tahun 3 👩‍🏫✨\n\nAda **dua cara paling mudah** untuk menukarkannya:\n\n### Kaedah 1: Jadikan Penyebut 10 atau 100 (Paling Digalakkan)\nKita darabkan nombor atas dan nombor bawah dengan angka yang sama supaya penyebut di bawah menjadi **10** atau **100**:\n\n• **Contoh 1 (Penyebut 2)**:\n  1/2 = (1 × 5) / (2 × 5) = 5/10 = **0.5**\n\n• **Contoh 2 (Penyebut 5)**:\n  3/5 = (3 × 2) / (5 × 2) = 6/10 = **0.6**\n  4/5 = (4 × 2) / (5 × 2) = 8/10 = **0.8**\n\n• **Contoh 3 (Penyebut 4)**:\n  1/4 = (1 × 25) / (4 × 25) = 25/100 = **0.25**\n  3/4 = (3 × 25) / (4 × 25) = 75/100 = **0.75**\n\n---\n\n### Kaedah 2: Operasi Bahagi (Pengangka ÷ Penyebut)\nPalang pecahan sebenarnya bermaksud **BAHAGI**:\n• 1/2 = 1 ÷ 2 = **0.5**\n• 1/4 = 1 ÷ 4 = **0.25**\n• 3/4 = 3 ÷ 4 = **0.75**\n\n⭐ **Jadual Rujukan Pantas Murid Cemerlang**:\n• 1/10 = 0.1 | 2/10 = 0.2 | 5/10 = 0.5 | 9/10 = 0.9\n• 1/2 = 0.5 (Separuh)\n• 1/4 = 0.25 (Suku)\n• 3/4 = 0.75 (Tiga Suku)`,
      socraticPrompt: 'Petua mudah: Ingat duit syiling 50 sen = RM0.50 (1/2 ringgit) dan 25 sen = RM0.25 (1/4 ringgit)!',
      proTip: 'Hafal 3 Pecahan Emas: 1/2 = 0.5 | 1/4 = 0.25 | 3/4 = 0.75! Ini soalan kegemaran cikgu sekolah.',
    };
  }

  // =========================================================================
  // 1. STUDENT MISCONCEPTION & ERROR DETECTION (PEMBELAJARAN BERASASKAN KESILAPAN)
  // e.g. "1/2 + 1/3 = 2/5", "1/4 + 2/4 = 3/8", "3/5 + 1/5 = 4/10"
  // (Tanpa visual diagram kerana soalan berkaitan penambahan pecahan)
  // =========================================================================
  const isMistakeAddingDenom =
    q.includes('2/5') && (q.includes('1/2 + 1/3') || q.includes('1/2+1/3') || q.includes('betul tak 1/2'));
  const isDenomAddedGeneric =
    q.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)\s*=\s*(\d+)\/(\d+)/);

  if (isMistakeAddingDenom || (isDenomAddedGeneric && parseInt(isDenomAddedGeneric[6], 10) === parseInt(isDenomAddedGeneric[2], 10) * 2)) {
    return {
      identifiedTopic: 'Deteksi Kesilapan Murid: Menambah Penyebut di Bawah',
      confidenceTag: 'Kategori: Pembelajaran Berasaskan Kesilapan',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Ruang Analisis Kesilapan Matematik',
        category: 'Pembetulan Miskonsepsi Pecahan',
        problemEquation: 'Adakah 1/2 + 1/3 = 2/5? (TIDAK TEPAT)',
        formulaUsed: 'Penyebut Menunjukkan Saiz Potongan (Mesti Disamakan Dahulu)',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Faham): Ramai orang mula-mula terfikir macam ni 👍 Sebab kita terbiasa tambah nombor atas dan bawah.',
          'Langkah 2 (Visualkan): Tetapi, bayangkan 1/2 pizza (setengah loyang besar) dicampur 1/3 pizza (sepertiga loyang). Kedua-duanya mempunyai SAIZ POTONGAN YANG BERBEZA!',
          'Langkah 3 (Fikir): Kalau saiz potongan tak sama, adilkah kita terus jumlahkan nombor bawah? Mestilah tidak adil!',
          'Langkah 4 (Selesaikan): Kita mesti samakan saiz potongan dengan mencari sifir sepunya (6): 1/2 = 3/6 dan 1/3 = 2/6. Maka 3/6 + 2/6 = 5/6!',
          'Langkah 5 (Semak): Nilai 5/6 hampir 1 loyang penuh, manakala 2/5 lebih kecil daripada separuh! Jadi jawapan 2/5 tidak masuk akal secara matematik.',
        ],
        finalAnswer: '1/2 + 1/3 = 5/6 (Bukan 2/5)',
        note: 'Penyebut adalah "saiz potongan", jadi penyebut tidak boleh ditambah secara terus!',
        socraticQuestion: 'Cuba adik bayangkan: Kalau ada 1 loyang kek dipotong 5 keping dan adik makan 2 keping (2/5), adakah ia lebih banyak daripada separuh (1/2)?',
      },
      explanationText: `Almost! 😄 Ramai orang mula-mula fikir macam ni 👍\n\nTapi kita **tak boleh terus tambah nombor atas dan nombor bawah**, sebab bahagian 1/2 dan 1/3 mempunyai **saiz yang berbeza**.\n\nBayangkan adik ada separuh (1/2) pizza besar, kawan beri lagi satu potongan sepertiga (1/3). Bila digabungkan, pizza adik hampir penuh iaitu **5/6**, bukan 2/5!\n\nNice cuba! Kesilapan ni sebenarnya bagus sebab sekarang adik dah nampak kenapa saiz potongan mesti disamakan dulu! 💡✨`,
      socraticPrompt: 'Ingat pesan Puan Alya: Penyebut di bawah ibarat nama saiz loyang. Saiz loyang tidak boleh ditambahkan!',
      proTip: 'Prinsip Emas: Bila tambah pecahan berpenyebut sama (cth: 1/5 + 2/5), nombor 5 di bawah KEKAL sama!',
    };
  }

  // Check if student just gave a correct answer or positive confirmation
  if (q === 'betul' || q === 'yes' || q === 'faham' || q === 'dah faham' || q === 'oh faham' || q === 'terima kasih' || q === 'tq') {
    return {
      identifiedTopic: 'Pengukuhan Kefahaman Murid',
      confidenceTag: 'Kategori: Respon Socratic & Maklum Balas Positif',
      explanationText: `Yes! Betul 🔥 Ha! Nampak dah kan? 😆\n\nBagus sangat adik berusaha memahami konsep sebenar dan bukan sekadar hafal formula! Bila adik dah kuasai konsep pizza dan loyang potongan sama rata ni, sebarang soalan pecahan Tahun 3 pasti kacang je adik selesaikan.\n\nAda soalan pecahan lain yang adik nak uji Puan Alya atau nak kita bincang sama-sama? 👩‍🍳✨`,
      proTip: 'Amalan Terbaik: Sentiasa visualkan makanan kegemaran adik (pizza/kek/coklat) bila jumpa soalan pecahan!',
    };
  }

  // =========================================================================
  // 2. MOD "SAYA TAK FAHAM" / BANTUAN ASAS (SECTION 5 SPEC)
  // e.g. "saya tak faham", "susah", "keliru", "tak reti", "ajar dari mula"
  // =========================================================================
  if (
    q.includes('tak faham') ||
    q.includes('tidak faham') ||
    q.includes('susah') ||
    q.includes('keliru') ||
    q.includes('tak reti') ||
    q.includes('pening') ||
    q.includes('ajar saya')
  ) {
    return {
      identifiedTopic: 'Bimbingan Asas & Mod "Saya Tak Faham" (Konsep 1/2)',
      confidenceTag: 'Kategori: Bimbingan Pemulihan & Pembinaan Asas',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'pizza',
        title: 'Asas Pecahan Paling Mudah: 1/2 Pizza',
        totalParts: 2,
        shadedParts: 1,
        emojiBlocks: '🟩 ⬜',
        explanation: '1 keping diambil daripada 2 kepingan sama saiz = 1/2 (Separuh).',
      },
      mathWorkspace: {
        problemTitle: 'Ruang Bina Semula Kefahaman (Asas Pecahan)',
        category: 'Bimbingan Konsep Sifar',
        problemEquation: 'Pecahan = Bahagian Diambil (Atas) / Jumlah Bahagian Sama Besar (Bawah)',
        formulaUsed: 'Membina Konsep Daripada Makanan Sebenar (Pizza)',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Faham): Tak apa 😆 jangan risau, kita relaks dan jangan guna nombor susah dulu. Kita cuba nombor paling asas iaitu 1/2.',
          'Langkah 2 (Visualkan): Bayangkan 1 biji pizza 🍕 lazat yang Puan Alya baru keluarkan dari ketuhar. Puan Alya potong tepat di tengah kepada 2 bahagian sama besar.',
          'Langkah 3 (Fikir): Kalau adik ambil 1 keping untuk dimakan, berapa keping yang adik ambil? Ya, 1 keping!',
          'Langkah 4 (Selesaikan): Jadi nombor 1 letak di ATAS (pengangka). Berapa semua keping tadi? Ada 2 keping, jadi nombor 2 letak di BAWAH (penyebut). Pecahannya ialah 1/2!',
          'Langkah 5 (Semak): 1 keping daripada 2 keping = 1/2 (separuh). Mudah kan?',
        ],
        finalAnswer: '1/2 = Satu Perdua (Separuh)',
        note: 'Nombor atas = apa yang adik ambil. Nombor bawah = berapa semua potongan sama saiz.',
        socraticQuestion: 'Cuba adik fikir satu soalan kecil ni: Kalau ada kek dipotong kepada 4 keping, dan adik makan 1 keping... nombor apa yang patut duduk di atas dan nombor apa di bawah?',
      },
      explanationText: `Tak apa adik 😆 kita jangan guna nombor yang susah dulu. Jom kita buat perlahan-lahan sama-sama.\n\nCuba bayangkan satu pizza 🍕 dipotong kepada **2 bahagian sama besar**:\n• Adik ambil **1 keping**.\n• Jumlah semua kepingan ada **2**.\n• Jadi pecahan kepingan adik ialah **1/2** (satu perdua atau separuh)!\n\nNombor atas (Pengangka) = bilangan keping yang kita ambil.\nNombor bawah (Penyebut) = jumlah semua kepingan yang ada.\n\nCuba adik jawab soalan kecil Puan Alya ni: Kalau sebiji kek dipotong kepada 4 bahagian sama besar dan adik ambil 3 bahagian, pecahan apa namanya? Cuba teka! 👀`,
      socraticPrompt: 'Soalan kecil: Kalau 3 bahagian diambil daripada 4 bahagian... nombor mana duduk di atas?',
      proTip: 'Petua Puan Alya: Ingat "Angkasa di atas" (Pengangka) dan "Bumi di bawah" (Penyebut)!',
    };
  }

  // =========================================================================
  // 3. MOD VISUAL / GAMBAR (RAJAH BULATAN PECAHAN DSKP)
  // Hanya diberikan ketika bertanyakan soalan berkaitan asas pecahan
  // (Jangan beri jika soalan berkaitan penambahan atau penolakan pecahan)
  // =========================================================================
  const isArithmetic =
    q.includes('+') ||
    q.includes('-') ||
    q.includes('tambah') ||
    q.includes('tolak') ||
    q.includes('campur') ||
    q.includes('minus') ||
    q.includes('penambahan') ||
    q.includes('penolakan');

  const wantsVisual =
    !isArithmetic &&
    (q.includes('gambar') ||
      q.includes('visual') ||
      q.includes('lukis') ||
      q.includes('rajah') ||
      q.includes('diagram') ||
      q.includes('bentuk') ||
      q.includes('bulatan') ||
      q.includes('pizza') ||
      q.includes('kek'));

  const fracExtract = q.match(/(\d+)\s*\/\s*(\d+)/);

  if (wantsVisual) {
    let num = 3;
    let den = 4;
    if (fracExtract) {
      num = parseInt(fracExtract[1], 10);
      den = parseInt(fracExtract[2], 10);
    } else if (q.includes('5/8') || q.includes('5')) {
      num = 5;
      den = 8;
    }

    if (den > 0) {
      const isProper = num <= den;
      return {
        identifiedTopic: `Mod Visual Interaktif: Rajah Bulatan ${num}/${den}`,
        confidenceTag: 'Kategori: Visual Rajah Bulatan DSKP (1 - 12 Bahagian)',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        visualDiagram: {
          type: 'circle_chart',
          selectedVisualMode: 'circle',
          title: `Rajah Bulatan Pecahan: ${num}/${den}`,
          totalParts: den,
          shadedParts: num,
          emojiBlocks: isProper ? getEmojiBlocks(num, den) : undefined,
          mixed: !isProper
            ? {
                whole: Math.floor(num / den),
                numerator: num % den,
                denominator: den,
                totalUnits: num,
              }
            : undefined,
          explanation: `Rajah bulatan dipotong kepada ${den} bahagian sama rata dengan ${num} bahagian diwarnakan hijau. Baki bahagian putih yang belum diwarnakan ialah ${Math.max(0, den - num)}/${den}.`,
        },
        mathWorkspace: {
          problemTitle: `Ruang Visual Matematik: Pecahan ${num}/${den}`,
          category: 'Mod Visual Rajah Bulatan Interaktif',
          problemEquation: `Visualkan Pecahan: ${num}/${den}`,
          formulaUsed: 'Rajah Bulatan Pecahan DSKP (Siri 1 hingga 12 Bahagian)',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            `Langkah 1 (Faham): Adik mahu melihat gambaran visual bagi pecahan ${num}/${den}.`,
            `Langkah 2 (Visualkan): Lihat rajah bulatan di atas yang dipotong kepada ${den} bahagian sama rata.`,
            `Langkah 3 (Fikir): Nombor bawah (${den} - penyebut) menunjukkan jumlah semua potongan sama rata. Nombor atas (${num} - pengangka) menunjukkan bahagian hijau yang diambil/diwarnakan.`,
            `Langkah 4 (Selesaikan): ${num} bahagian hijau daripada ${den} bahagian keseluruhan ditulis sebagai pecahan ${num}/${den}.`,
            `Langkah 5 (Semak): Bahagian putih baki ialah ${Math.max(0, den - num)}/${den}. Jumlah kedua-duanya (${num}/${den} + ${Math.max(0, den - num)}/${den}) melengkapkan 1 bulatan penuh!`,
          ],
          finalAnswer: `${num}/${den} bahagian`,
          note: 'Adik boleh klik kepingan bulatan atau butang nombor di bawah rajah untuk meneroka pecahan lain secara langsung!',
          socraticQuestion: `Cuba adik perhatikan rajah bulatan di atas: Berapakah bahagian putih yang tinggal untuk melengkapkan satu bulatan penuh?`,
        },
        explanationText: `Ini dia rajah bulatan yang adik minta untuk **${num}/${den}**! 🎨✨\n\n• 🟢 **${num} Bahagian Hijau (Pengangka)**: Bilangan potongan yang diambil atau diwarnakan.\n• ⚪ **${den} Potongan Sama Rata (Penyebut)**: Jumlah semua kepingan yang membentuk satu bulatan penuh.\n\nAdik boleh klik terus pada kepingan bulatan atau butang nombor di bawah rajah untuk mengubah dan meneroka pecahan lain! 😊`,
        socraticPrompt: `Berapa baki bahagian putih yang belum diwarnakan? Ya, ada ${Math.max(0, den - num)}/${den} bahagian baki!`,
        proTip: 'Petua Visual: Dalam rajah bulatan, setiap potongan mesti sama saiz supaya adil dan tepat mengikut konsep pecahan!',
      };
    }
  }

  // =========================================================================
  // 4. SOALAN CERITA (STORY PROBLEMS - SECTION 9 SPEC)
  // e.g. "Ali makan 1/4 kek dan Ahmad makan 2/4 kek" or cooking scenarios
  // =========================================================================
  const isStoryProblem =
    (q.includes('makan') || q.includes('ali') || q.includes('ahmad') || q.includes('siti') || q.includes('ibu') || q.includes('loyang') || q.includes('tepung')) &&
    fracExtract;

  if (isStoryProblem && (q.includes('dan') || q.includes('tambah') || q.includes('jumlah') || q.includes('baki'))) {
    const fractions = [...q.matchAll(/(\d+)\s*\/\s*(\d+)/g)];
    if (fractions.length >= 2) {
      const n1 = parseInt(fractions[0][1], 10);
      const d1 = parseInt(fractions[0][2], 10);
      const n2 = parseInt(fractions[1][1], 10);
      const d2 = parseInt(fractions[1][2], 10);

      if (d1 === d2) {
        const isBaki = q.includes('baki') || q.includes('tinggal') || q.includes('tolak');
        const resNum = isBaki ? n1 - n2 : n1 + n2;
        const opName = isBaki ? 'Penolakan (Cari Baki)' : 'Penambahan (Gabungkan)';
        const opSign = isBaki ? '-' : '+';
        const simp = simplify(resNum, d1);

        return {
          identifiedTopic: `Penyelesaian Masalah Soalan Cerita (${opName})`,
          confidenceTag: 'Kategori: Soalan Cerita & Masalah Harian DSKP 3.1.8',
          pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
          mathWorkspace: {
            problemTitle: 'Ruang Kerja Penyelesaian Soalan Cerita',
            category: 'Aplikasi Harian Matematik',
            problemEquation: `${n1}/${d1} ${opSign} ${n2}/${d2} = ${resNum}/${d1}`,
            formulaUsed: isBaki
              ? 'Baki = Bahagian Awal - Bahagian Digunakan'
              : 'Jumlah = Bahagian 1 + Bahagian 2',
            pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
            stepByStep: [
              `Langkah 1 (Faham): Kenal pasti maklumat penting. Ada 2 pecahan iaitu ${n1}/${d1} dan ${n2}/${d2}. Soalan meminta kita mencari ${isBaki ? 'baki yang tinggal' : 'jumlah keseluruhan'}.`,
              `Langkah 2 (Visualkan): Bayangkan satu kek loyang yang dipotong kepada ${d1} keping sama besar.`,
              `Langkah 3 (Fikir): Sebab soalan nak ${isBaki ? 'baki' : 'jumlah'}, operasi yang tepat ialah ${opName}. Saiz potongan (${d1}) adalah sama.`,
              `Langkah 4 (Selesaikan): Kira nombor di atas: ${n1} ${opSign} ${n2} = ${resNum}. Kekalkan penyebut ${d1}: ${resNum}/${d1}.`,
              ...(simp.num !== resNum ? [`Langkah 5 (Semak & Permudahkan): ${resNum}/${d1} dipermudahkan menjadi ${simp.num}/${simp.den}.`] : ['Langkah 5 (Semak): Pengiraan telah disemak secara matematik dan tepat.']),
            ],
            finalAnswer: `${resNum}/${d1}${simp.num !== resNum ? ` (atau ${simp.num}/${simp.den})` : ''}`,
            note: `Jawapan dalam konteks: ${isBaki ? 'Baki kek yang tinggal' : 'Jumlah kek yang dimakan'} ialah ${resNum}/${d1} kek.`,
            socraticQuestion: `Kalau kek itu ada ${d1} keping semuanya, berapa keping yang masih belum dimakan?`,
          },
          explanationText: `Okay, jom kita tengok soalan cerita ni dulu 👀\n\n1. **Maklumat Penting:**\n• Bahagian pertama: ${n1}/${d1} kek.\n• Bahagian kedua: ${n2}/${d2} kek.\n\n2. **Kenapa kita guna operasi ${opName}?**\nKerana soalan nak tahu ${isBaki ? 'baki selepas sebahagian diambil' : 'gabungan kedua-dua bahagian kek tersebut'}.\n\n3. **Penyelesaian:**\nOleh sebab penyebut kedua-duanya sama (${d1}), kita selesaikan bahagian atas sahaja:\n${n1} ${opSign} ${n2} = ${resNum}.\n\n**Jadi, jawapannya dalam konteks soalan ialah:**\n${isBaki ? 'Baki kek yang masih ada' : 'Jumlah kek yang telah dimakan'} ialah **${resNum}/${d1} kek** (atau ${simp.num}/${simp.den} kek)! 🍰✨`,
          proTip: 'Tips Menjawab Soalan Cerita: Sentiasa tulis jawapan akhir bersama unitnya (contoh: "... kek").',
        };
      }
    }
  }

  // =========================================================================
  // 5. TOPIK UTAMA A: PECAHAN WAJAR (SECTION 2A SPEC)
  // e.g. "pecahan wajar", "apa itu pecahan wajar", "1/2", "3/4"
  // =========================================================================
  if (
    q.includes('pecahan wajar') ||
    (q.includes('wajar') && !q.includes('tak wajar') && !q.includes('tidak wajar')) ||
    q.includes('apa itu pecahan')
  ) {
    return {
      identifiedTopic: 'Pecahan Wajar (Proper Fractions)',
      confidenceTag: 'Kategori: Konsep Asas DSKP 3.1.1',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'pizza',
        title: 'Contoh Visual Pecahan Wajar: 3/4 Pizza',
        totalParts: 4,
        shadedParts: 3,
        emojiBlocks: '🟩 🟩 🟩 ⬜',
        explanation: '3 daripada 4 bahagian diambil. Pembilang (3) lebih kecil daripada penyebut (4).',
      },
      mathWorkspace: {
        problemTitle: 'Ruang Konsep: Ciri-Ciri Pecahan Wajar',
        category: 'Klasifikasi Pecahan DSKP',
        problemEquation: 'Pengangka (Atas) < Penyebut (Bawah)',
        formulaUsed: 'Nilai Pecahan Wajar Sentiasa KURANG daripada 1 Keseluruhan',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Faham): Pecahan wajar ialah pecahan di mana nombor di ATAS (pembilang/pengangka) LEBIH KECIL daripada nombor di BAWAH (penyebut).',
          'Langkah 2 (Visualkan): Bayangkan pizza 🍕 dipotong 4 bahagian. Adik makan 3 bahagian (3/4). Masih ada 1 bahagian lagi berbaki!',
          'Langkah 3 (Fikir): Kenapa ia dipanggil "wajar"? Kerana nilainya wajar (logik) diambil daripada SATU objek sahaja, tidak lebih daripada 1.',
          'Langkah 4 (Selesaikan): Contoh pecahan wajar: 1/2, 2/3, 3/4, 4/5, 7/10.',
          'Langkah 5 (Semak): Sahkan: 3 < 4 (Betul, pembilang lebih kecil).',
        ],
        finalAnswer: 'Pembilang < Penyebut (Contoh: 1/2, 2/3, 3/4)',
        note: 'Pecahan wajar sentiasa lebih kecil daripada nombor 1.',
        socraticQuestion: 'Cuba adik fikir: Adakah 5/4 pecahan wajar? Kenapa ya?',
      },
      explanationText: `Hai adik! Jom kita fahami **Pecahan Wajar** bersama-sama 👩‍🍳\n\n**Maksudnya:**\nPecahan wajar ialah pecahan yang mempunyai **pembilang (nombor atas) LEBIH KECIL daripada penyebut (nombor bawah)**.\n\n**Cara bayangkan:**\nBayangkan satu loyang pizza 🍕 dipotong 4 bahagian sama besar:\n• Kalau adik ambil 3 bahagian, pecahannya ialah **3/4**.\n• Adik belum habiskan 1 pizza penuh kan? Nilainya masih **kurang daripada 1 objek penuh**.\n\n**Contoh Pecahan Wajar:**\n1/2, 2/3, 3/4, 4/5, 7/10.\n\nPuan Alya suka sebut: Pecahan wajar ni "sopan" sebab nombor kecil duduk elok di atas nombor besar! 😊`,
      socraticPrompt: 'Uji minda: Antara 2/5 dan 5/2, yang mana satukah pecahan wajar?',
      proTip: 'Objek harian yang seronok dibayangkan: Pizza, coklat bar 4 petak, dan loyang kek cawan!',
    };
  }

  // =========================================================================
  // 6. TOPIK UTAMA B: PECAHAN TAK WAJAR (SECTION 2B SPEC)
  // e.g. "pecahan tak wajar", "5/3", "7/4", "9/5"
  // =========================================================================
  if (
    q.includes('tak wajar') ||
    q.includes('tidak wajar') ||
    q.includes('improper') ||
    (q.includes('kenapa') && q.includes('lebih besar'))
  ) {
    return {
      identifiedTopic: 'Pecahan Tak Wajar (Improper Fractions)',
      confidenceTag: 'Kategori: Konsep Lanjutan DSKP 3.1.7',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'mixed',
        title: 'Visual Pecahan Tak Wajar: 5/3 = 1 2/3 Loyang',
        mixed: {
          whole: 1,
          numerator: 2,
          denominator: 3,
          totalUnits: 5,
        },
        explanation: '5 bahagian pertiga memerlukan LEBIH daripada 1 loyang penuh (1 loyang penuh 3/3 + 2 keping lagi = 5/3).',
      },
      mathWorkspace: {
        problemTitle: 'Ruang Konsep: Kenapa Pembilang Boleh Lebih Besar?',
        category: 'Pecahan Tak Wajar',
        problemEquation: 'Pengangka (Atas) ≥ Penyebut (Bawah) (Contoh: 5/3)',
        formulaUsed: 'Nilai Pecahan Tak Wajar LEBIH daripada 1 Objek Penuh',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          'Langkah 1 (Faham): Pecahan tak wajar ialah pecahan di mana nombor di ATAS (pembilang) LEBIH BESAR atau sama dengan nombor di BAWAH (penyebut). Contoh: 5/3.',
          'Langkah 2 (Visualkan): Kenapa boleh jadi 5/3? Bayangkan setiap loyang kek cawan hanya ada 3 ruang potongan.',
          'Langkah 3 (Fikir): Kalau adik makan 5 potong kek bersaiz satu pertiga, adakah 1 loyang cukup? Tidak cukup! Adik perlukan 1 loyang penuh (3 keping) DAN 2 keping lagi dari loyang kedua!',
          'Langkah 4 (Selesaikan): Jadi 5 keping potongan satu pertiga = 5/3 = 1 biji penuh dan 2/3 biji kek (1 2/3)!',
          'Langkah 5 (Semak): Nilai 5/3 = 1.67, terbukti lebih besar daripada 1 keseluruhan.',
        ],
        finalAnswer: '5/3 = 1 2/3 (Nilainya melebihi 1 objek penuh)',
        note: 'Jangan hanya hafal formula: Fahami bahawa ia melibatkan lebih daripada 1 loyang!',
        socraticQuestion: 'Kalau adik ada 7 keping pizza yang dipotong 4 setiap loyang (7/4), berapa loyang penuh yang adik dah makan?',
      },
      explanationText: `Soalan yang sangat hebat! Jom kita fahamkan **Pecahan Tak Wajar** tanpa hafalan formula semata-mata 🥞\n\n**Kenapa pembilang boleh lebih besar daripada penyebut?**\nContohnya **5/3**:\n• Penyebut (3) bermaksud satu loyang kek dipotong kepada **3 kepingan sama saiz**.\n• Pembilang (5) bermaksud adik mengambil sebanyak **5 keping potongan tersebut**!\n\n**Cara bayangkan:**\n1 loyang kek cuma ada 3 keping (3/3). Mana datang lagi 2 keping? Dari loyang kedua!\nJadi adik telah makan:\n**1 loyang penuh (3 keping) + 2 keping lagi = 5/3 (iaitu 1 2/3)!**\n\n**Kesimpulan:**\nPecahan tak wajar berlaku apabila jumlah bahagian yang diambil **MELEBIHI satu keseluruhan**! 🌟`,
      socraticPrompt: 'Cuba fikir: Kalau 4/4, adakah ia pecahan tak wajar? Ya! Sebab ia bersamaan dengan 1 objek penuh.',
      proTip: 'Contoh lain: 7/4 (1 3/4 loyang), 9/5 (1 4/5 loyang).',
    };
  }

  // =========================================================================
  // 7. TOPIK UTAMA C & E: NOMBOR BERCAMPUR -> PECAHAN TAK WAJAR (SECTION 2C & 2E)
  // e.g. "tukar 2 1/3 kepada pecahan tak wajar", "kenapa darab", "nombor bercampur"
  // =========================================================================
  const mixedMatch = q.match(/(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (
    mixedMatch &&
    (q.includes('tak wajar') || q.includes('tidak wajar') || q.includes('tukar') || q.includes('kenapa darab') || q.includes('bagaimana'))
  ) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    const totalParts = (whole * den) + num;

    return {
      identifiedTopic: `Penukaran Nombor Bercampur (${whole} ${num}/${den}) -> Pecahan Tak Wajar`,
      confidenceTag: 'Kategori: Penukaran Pecahan Berkonsep DSKP 3.1.7',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'mixed',
        title: `Visual Konsep: ${whole} ${num}/${den} = ${totalParts}/${den}`,
        mixed: {
          whole,
          numerator: num,
          denominator: den,
          totalUnits: totalParts,
        },
        explanation: `${whole} loyang penuh (${whole} × ${den} = ${whole * den} keping) + ${num} keping lagi = ${totalParts} keping semuanya!`,
      },
      mathWorkspace: {
        problemTitle: `Ruang Kerja Penukaran Berkonsep: ${whole} ${num}/${den}`,
        category: 'Nombor Bercampur ke Pecahan Tak Wajar',
        problemEquation: `${whole} ${num}/${den} = ? / ${den}`,
        formulaUsed: 'Pecahan Tak Wajar = [(Nombor Bulat × Penyebut) + Pengangka] / Penyebut',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          `Langkah 1 (Faham): Nombor bercampur terdiri daripada NOMBOR BULAT (${whole}) + PECAHAN WAJAR (${num}/${den}).`,
          `Langkah 2 (Visualkan): Adik ada ${whole} loyang kek penuh dan sepinggan kek yang ada ${num}/${den} potong. Setiap loyang dipotong kepada ${den} keping sama besar.`,
          `Langkah 3 (Fikir MENGAPA KENA DARAB): Kenapa kita darab ${whole} × ${den}? Sebab setiap 1 loyang ada ${den} keping. Jadi ${whole} loyang ada: ${whole} × ${den} = ${whole * den} keping!`,
          `Langkah 4 (Selesaikan): Sekarang tambahkan ${num} keping lagi: ${whole * den} + ${num} = ${totalParts} keping.`,
          `Langkah 5 (Semak): Tuliskan jumlah semua kepingan di atas penyebut asal: ${totalParts}/${den}.`,
        ],
        finalAnswer: `${totalParts}/${den}`,
        note: `Maksudnya: Ada ${totalParts} kepingan bersaiz satu per-${den}.`,
        socraticQuestion: `Cuba adik fikir: Kalau adik ada 3 loyang penuh kek (3 1/2), berapa keping separuh yang ada semuanya?`,
      },
      explanationText: `Mari kita buat langkah demi langkah, dan yang paling penting: **faham KENAPA kita buat begitu** 👇\n\n**Soalan:** Tukarkan **${whole} ${num}/${den}** kepada pecahan tak wajar.\n\n1. **Kenapa kita darab nombor bulat dengan penyebut (${whole} × ${den} = ${whole * den})?**\nKerana adik ada ${whole} biji kek penuh. Setiap kek dipotong ${den} bahagian. Jadi dalam ${whole} kek itu ada ${whole} × ${den} = **${whole * den} keping**.\n\n2. **Kenapa kita tambah pengangka (${whole * den} + ${num} = ${totalParts})?**\nKerana kita ada lagi ${num} keping dalam piring. Jadi jumlah semua keping ialah ${whole * den} + ${num} = **${totalParts} keping**!\n\n3. **Kesimpulan:**\nOleh kerana semua potongan bersaiz 1/${den}, jawapannya ialah **${totalParts}/${den}**! 🍰✨`,
      socraticPrompt: 'Ingat konsepnya: Darab untuk cari jumlah kepingan dalam kek penuh, tambah untuk kepingan lebihan!',
      proTip: 'Semakan pantas: Formula "Darab Bawah, Tambah Atas" berasaskan bilangan kepingan sebenar!',
    };
  }

  // =========================================================================
  // 8. TOPIK UTAMA D: PECAHAN TAK WAJAR -> NOMBOR BERCAMPUR (SECTION 2D SPEC)
  // e.g. "tukar 7/3 kepada nombor bercampur", "pecahan tak wajar ke bercampur"
  // =========================================================================
  const impToMixMatch = q.match(/(\d+)\s*\/\s*(\d+)/);
  if (
    impToMixMatch &&
    (q.includes('nombor bercampur') || q.includes('bercampur') || q.includes('bahagi'))
  ) {
    const num = parseInt(impToMixMatch[1], 10);
    const den = parseInt(impToMixMatch[2], 10);

    if (num >= den && den > 0) {
      const whole = Math.floor(num / den);
      const rem = num % den;

      return {
        identifiedTopic: `Penukaran Pecahan Tak Wajar (${num}/${den}) -> Nombor Bercampur`,
        confidenceTag: 'Kategori: Operasi Bahagi & Baki DSKP 3.1.7',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        visualDiagram: {
          type: 'mixed',
          title: `Visual Hasil Bahagi & Baki: ${num}/${den} = ${whole} ${rem}/${den}`,
          mixed: {
            whole,
            numerator: rem,
            denominator: den,
            totalUnits: num,
          },
          explanation: `${num} potong kek dibungkus ke dalam kotak (setiap kotak muat ${den} keping). Dapat ${whole} kotak penuh dan baki ${rem} keping!`,
        },
        mathWorkspace: {
          problemTitle: `Ruang Kerja Penukaran: ${num}/${den} ke Nombor Bercampur`,
          category: 'Operasi Bahagi & Baki',
          problemEquation: `${num}/${den} = ? (Nombor Bercampur)`,
          formulaUsed: 'Nombor Bercampur = Hasil Bahagi (Nombor Bulat) + [Baki / Penyebut]',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            `Langkah 1 (Faham): Kita ada ${num} kepingan kek, dan setiap 1 loyang penuh memerlukan ${den} keping.`,
            `Langkah 2 (Visualkan): Bayangkan memasukkan ${num} keping kek ke dalam loyang kosong (setiap loyang muat ${den} keping).`,
            `Langkah 3 (Fikir): Untuk tahu berapa loyang penuh, kita bahagikan: ${num} ÷ ${den}.`,
            `Langkah 4 (Selesaikan): ${num} ÷ ${den} = ${whole} dengan baki ${rem} (kerana ${whole} × ${den} = ${whole * den}, baki ${num} - ${whole * den} = ${rem}).`,
            `Langkah 5 (Semak): Gabungkan: ${whole} ialah jumlah keseluruhan (nombor bulat), ${rem} ialah baki (pembilang), dan ${den} ialah penyebut kekal -> ${whole} ${rem}/${den}.`,
          ],
          finalAnswer: rem === 0 ? `${whole} (Nombor Bulat Tepat)` : `${whole} ${rem}/${den}`,
          note: `2 = jumlah keseluruhan, 1 = baki, 3 = penyebut.`,
          socraticQuestion: `Cuba semak semula: Darabkan (${whole} × ${den}) + ${rem}, dapat balik tak nombor ${num}? Tepat!`,
        },
        explanationText: `Mari kita selesaikan langkah demi langkah 👇\n\n**Soalan:** Tukarkan **${num}/${den}** kepada nombor bercampur.\n\n1. **Operasi Bahagi:**\nKita bahagikan pengangka dengan penyebut: **${num} ÷ ${den} = ${whole} baki ${rem}**.\n\n2. **Maksud Setiap Nombor:**\n• **${whole}** = Jumlah loyang penuh yang berjaya dipenuhi (Nombor Bulat).\n• **${rem}** = Baki kepingan kek yang tinggal (Pembilang).\n• **${den}** = Saiz kepingan loyang yang kekal sama (Penyebut).\n\n**Jadi, jawapannya ialah:**\n**${whole} ${rem}/${den}**! 🥞✨`,
        socraticPrompt: 'Ingat 3 kunci: Hasil bahagi = nombor bulat besar, baki = nombor atas, penyebut kekal!',
        proTip: 'Semakan: Cuba darab balik (2 × 3) + 1 = 7. Bila nombor asal diperoleh, jawapan adik 100% tepat!',
      };
    }
  }

  // =========================================================================
  // 9. TOPIK UTAMA F: OPERASI TAMBAH PECAHAN (SECTION 2F SPEC)
  // e.g. "1/5 + 2/5", "3/8 + 2/8", "lima per tiga tambah empat per dua"
  // (Tanpa visual diagram kerana arahan menetapkan tiada visual untuk penambahan)
  // =========================================================================
  const addRegex = /(\d+)\s*\/\s*(\d+)\s*(\+|\btambah\b|\bplus\b)\s*(\d+)\s*\/\s*(\d+)/i;
  const addMatch = q.match(addRegex);
  const wasWordQuery = /per\s+(?:dua|tiga|empat|lima|enam|tujuh|lapan|sembilan|sepuluh|sebelas|dua belas|\d+)/i.test(raw);

  if (addMatch) {
    const num1 = parseInt(addMatch[1], 10);
    const den1 = parseInt(addMatch[2], 10);
    const num2 = parseInt(addMatch[4], 10);
    const den2 = parseInt(addMatch[5], 10);

    if (den1 === den2 && den1 > 0) {
      const sumNum = num1 + num2;
      const simp = simplify(sumNum, den1);
      const isImproper = sumNum > den1;
      const whole = Math.floor(sumNum / den1);
      const rem = sumNum % den1;

      return {
        identifiedTopic: wasWordQuery
          ? `Penambahan Pecahan (Soalan Perkataan: ${num1}/${den1} + ${num2}/${den2})`
          : 'Operasi Penambahan Pecahan (Penyebut Sama)',
        confidenceTag: 'Kategori: Operasi Asas DSKP 3.1.5',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        mathWorkspace: {
          problemTitle: wasWordQuery
            ? `Penyelesaian Soalan Perkataan: "${raw}"`
            : 'Ruang Kerja Pengiraan Penambahan Pecahan',
          category: 'Operasi Tambah (Penyebut Sama)',
          problemEquation: wasWordQuery
            ? `${num1}/${den1} + ${num2}/${den2} = ? ("${raw}")`
            : `${num1}/${den1} + ${num2}/${den2} = ?`,
          formulaUsed: '(Pengangka 1 + Pengangka 2) / Penyebut Sama',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            ...(wasWordQuery
              ? [`Langkah 1 (Terjemah Perkataan): Soalan perkataan "${raw}" ditulis dalam bentuk angka pecahan sebagai ${num1}/${den1} + ${num2}/${den2}.`]
              : [`Langkah 1 (Faham): Perhatikan penyebut (nombor bawah). Kedua-duanya sama iaitu ${den1}. Saiz kepingan loyang adalah serupa.`]),
            `Langkah 2 (Semak Penyebut): Penyebut ${den1} di bawah adalah sama rata.`,
            `Langkah 3 (Fikir): Perlukah kita tambah nombor bawah? TIDAK! Sebab saiz loyang kek tetap sama iaitu ${den1}. Kita hanya jumlahkan kepingan di atas.`,
            `Langkah 4 (Selesaikan): Tambahkan nombor di atas sahaja: ${num1} + ${num2} = ${sumNum}. Jawapan = ${sumNum}/${den1}.`,
            ...(simp.num !== sumNum && simp.den !== den1
              ? [`Langkah 5 (Semak & Bentuk Termudah): Permudahkan dengan membahagi ${gcd(sumNum, den1)} -> ${simp.num}/${simp.den}.`]
              : [`Langkah 5 (Semak): Pengiraan telah disemak secara matematik dan tepat.`]),
            ...(isImproper && rem > 0
              ? [`Langkah Tambahan (Nombor Bercampur): ${sumNum} ÷ ${den1} = ${whole} ${rem}/${den1}.`]
              : []),
          ],
          finalAnswer: `${sumNum}/${den1}${simp.num !== sumNum ? ` = ${simp.num}/${simp.den}` : ''}`,
          note: wasWordQuery
            ? `Soalan perkataan "${raw}" bersamaan dengan ayat matematik ${num1}/${den1} + ${num2}/${den2}.`
            : 'Penyebut menunjukkan jumlah bahagian yang sama, manakala pembilang menunjukkan berapa bahagian yang diambil.',
          socraticQuestion: `Kenapa nombor ${den1} di bawah tidak berubah menjadi ${den1 + den2}? Cuba terangkan dengan analogi loyang kek!`,
        },
        explanationText: `${
          wasWordQuery
            ? `Adik bertanya dalam bentuk perkataan: **"${raw}"**.\nDalam ayat matematik pecahan, ia ditulis sebagai **${num1}/${den1} + ${num2}/${den2}**! 👏\n\n`
            : ''
        }Mari kita buat langkah demi langkah 👇\n\n**Soalan:** Berapakah hasil tambah **${num1}/${den1} + ${num2}/${den2}**?\n\n1. **Langkah 1 (Faham):**\nKedua-dua pecahan mempunyai penyebut yang sama iaitu **${den1}**. Ini bermakna saiz potongan loyang kek adalah sama rata!\n\n2. **Langkah 2 (Fikir & Selesaikan):**\nOleh kerana penyebutnya sama, kita **hanya perlu menambah pembilang (nombor di atas)** sahaja:\n**${num1} + ${num2} = ${sumNum}**.\nNombor penyebut ${den1} di bawah kekal sama!\n\n**Jadi, jawapannya ialah:**\n**${sumNum}/${den1}**${simp.num !== sumNum ? ` (dipermudahkan menjadi ${simp.num}/${simp.den})` : ''}! 🍕✨`,
        socraticPrompt: 'Ingat peraturan emas Chef Alya: Penyebut sama, campur yang atas sahaja!',
        proTip: 'Jangan sesekali menambahkan nombor bawah ya! Saiz potongan loyang tidak bertambah besar.',
      };
    } else if (den1 > 0 && den2 > 0) {
      // Different denominators (e.g. 5/3 + 4/2)
      const commonDen = (den1 * den2) / gcd(den1, den2);
      const mult1 = commonDen / den1;
      const mult2 = commonDen / den2;
      const newNum1 = num1 * mult1;
      const newNum2 = num2 * mult2;
      const totalNum = newNum1 + newNum2;
      const simp = simplify(totalNum, commonDen);
      const isImproper = totalNum > commonDen;
      const whole = Math.floor(totalNum / commonDen);
      const rem = totalNum % commonDen;
      const simpRem = simplify(rem, commonDen);

      return {
        identifiedTopic: wasWordQuery
          ? `Penambahan Pecahan Penyebut Berbeza (Soalan Perkataan: ${num1}/${den1} + ${num2}/${den2})`
          : 'Penambahan Pecahan Penyebut Berbeza (Samakan Penyebut)',
        confidenceTag: 'Kategori: Pengiraan Lanjutan DSKP',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        mathWorkspace: {
          problemTitle: wasWordQuery
            ? `Penyelesaian Soalan Perkataan: "${raw}"`
            : 'Ruang Kerja Tambah Pecahan Penyebut Berbeza',
          category: 'Operasi Tambah (Penyebut Berbeza)',
          problemEquation: wasWordQuery
            ? `${num1}/${den1} + ${num2}/${den2} = ? ("${raw}")`
            : `${num1}/${den1} + ${num2}/${den2} = ?`,
          formulaUsed: 'Samakan Penyebut Terlebih Dahulu (Gandaan Sepunya)',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            ...(wasWordQuery
              ? [`Langkah 1 (Terjemah Perkataan): Soalan perkataan "${raw}" ditulis dalam bentuk nombor pecahan sebagai ${num1}/${den1} + ${num2}/${den2}.`]
              : [`Langkah 1 (Faham): Penyebut ${den1} dan ${den2} tidak sama. Kita tidak boleh terus menambah nombor atas sebab saiz kepingan berbeza.`]),
            `Langkah 2 (Samakan Penyebut): Cari sifir sepunya untuk ${den1} dan ${den2}, iaitu ${commonDen}.`,
            `Langkah 3 (Tukar Pecahan Pertama): (${num1} × ${mult1}) / (${den1} × ${mult1}) = ${newNum1}/${commonDen}.`,
            `Langkah 4 (Tukar Pecahan Kedua): (${num2} × ${mult2}) / (${den2} × ${mult2}) = ${newNum2}/${commonDen}.`,
            `Langkah 5 (Selesaikan): Tambahkan pengangka sahaja: ${newNum1} + ${newNum2} = ${totalNum}/${commonDen}.`,
            ...(simp.num !== totalNum && simp.den !== commonDen
              ? [`Langkah 6 (Permudahkan): Bahagikan dengan sifir ${gcd(totalNum, commonDen)} -> ${simp.num}/${simp.den}.`]
              : []),
            ...(isImproper && rem > 0
              ? [`Langkah 7 (Tukar ke Nombor Bercampur): ${totalNum} ÷ ${commonDen} = ${whole} ${rem}/${commonDen}${simpRem.num !== rem ? ` = ${whole} ${simpRem.num}/${simpRem.den}` : ''}.`]
              : isImproper && rem === 0
              ? [`Langkah 7 (Nombor Bulat): ${totalNum} ÷ ${commonDen} = ${whole}.`]
              : []),
          ],
          finalAnswer: `${totalNum}/${commonDen}${simp.num !== totalNum ? ` = ${simp.num}/${simp.den}` : ''}${
            isImproper && rem > 0
              ? ` (${whole} ${simpRem.num}/${simpRem.den})`
              : isImproper && rem === 0
              ? ` (= ${whole})`
              : ''
          }`,
          note: wasWordQuery
            ? `Soalan perkataan "${raw}" bersamaan dengan ayat matematik ${num1}/${den1} + ${num2}/${den2}.`
            : 'Mesti samakan saiz kepingan terlebih dahulu sebelum menambah.',
          socraticQuestion: `Kenapa kita tak boleh terus tambah ${num1} + ${num2} atas dan ${den1} + ${den2} bawah?`,
        },
        explanationText: `${
          wasWordQuery
            ? `Adik bertanya dalam perkataan: **"${raw}"**.\nDalam ayat matematik pecahan, ia ditulis sebagai **${num1}/${den1} + ${num2}/${den2}**! 👏\n\n`
            : ''
        }Jom kita selesaikan langkah demi langkah 👀\n\nPenyebutnya berbeza iaitu **${den1}** dan **${den2}**. Kita tak boleh terus tambah sebab saiz potongan berbeza!\n\n1. Kita samakan saiz potongan dengan mencari sifir sepunya iaitu **${commonDen}**.\n2. **${num1}/${den1}** ditukar menjadi **${newNum1}/${commonDen}**.\n3. **${num2}/${den2}** ditukar menjadi **${newNum2}/${commonDen}**.\n4. Sekarang bila penyebut dah sama, kita tambah nombor atas:\n**${newNum1} + ${newNum2} = ${totalNum}/${commonDen}**${
          simp.num !== totalNum ? ` (dipermudahkan kepada **${simp.num}/${simp.den}**)` : ''
        }${
          isImproper && rem > 0
            ? ` atau nombor bercampur **${whole} ${simpRem.num}/${simpRem.den}**`
            : isImproper && rem === 0
            ? ` (iaitu **${whole}**)`
            : ''
        }! 💡✨`,
        socraticPrompt: 'Nice! Sekarang adik dah faham kenapa saiz potongan mesti disamakan.',
      };
    }
  }

  // =========================================================================
  // 10. TOPIK UTAMA G: OPERASI TOLAK PECAHAN (SECTION 2G SPEC)
  // e.g. "3/4 - 1/4", "7/10 - 3/10", "1 - 1/4"
  // (Tanpa visual diagram kerana arahan menetapkan tiada visual untuk penolakan)
  // =========================================================================
  const subOneRegex = /(?:1|satu)\s*(-|\btolak\b|\bminus\b)\s*(\d+)\s*\/\s*(\d+)/i;
  const subOneMatch = q.match(subOneRegex);
  if (subOneMatch) {
    const num = parseInt(subOneMatch[2], 10);
    const den = parseInt(subOneMatch[3], 10);
    const remNum = den - num;
    const simp = simplify(remNum, den);

    return {
      identifiedTopic: 'Operasi Penolakan Pecahan daripada 1 Objek Penuh',
      confidenceTag: 'Kategori: Operasi Tolak DSKP 3.1.6',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Ruang Kerja Tolak Daripada 1 Objek Penuh',
        category: 'Operasi Tolak (1 - Pecahan)',
        problemEquation: `1 - ${num}/${den} = ?`,
        formulaUsed: `Tukarkan 1 kepada ${den}/${den}, kemudian tolakkan pengangka`,
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          `Langkah 1 (Faham): Nombor 1 bermaksud 1 biji objek penuh (contohnya 1 biji pizza penuh atau 1 kek penuh).`,
          `Langkah 2 (Tukar 1 Penuh): Oleh kerana kita nak tolak bahagian per-${den}, kita potong 1 kek penuh itu kepada ${den} keping: 1 = ${den}/${den}.`,
          `Langkah 3 (Fikir): Sekarang ayat matematiknya menjadi: ${den}/${den} - ${num}/${den}.`,
          `Langkah 4 (Selesaikan): Tolakkan pengangka sahaja: ${den} - ${num} = ${remNum}. Kekalkan penyebut ${den}.`,
          `Langkah 5 (Semak): Hasilnya ialah ${remNum}/${den}${simp.num !== remNum ? ` = ${simp.num}/${simp.den}` : ''}.`,
        ],
        finalAnswer: `${remNum}/${den}${simp.num !== remNum ? ` = ${simp.num}/${simp.den}` : ''}`,
        note: `1 objek penuh sentiasa bersamaan dengan pengangka dan penyebut yang serupa (${den}/${den}).`,
        socraticQuestion: `Kalau 1 botol minyak (5/5) dituang 2/5 bahagian ke dalam kuali, berapa baki minyak dalam botol?`,
      },
      explanationText: `Mari kita selesaikan langkah demi langkah 👇\n\n**Soalan:** Berapakah **1 - ${num}/${den}**?\n\n1. **Tukar 1 Kepada Pecahan:**\nNombor 1 bermaksud 1 loyang penuh. Sebab penyebutnya ${den}, 1 loyang penuh = **${den}/${den}**.\n\n2. **Tolak Pengangka:**\nDaripada ${den} kepingan yang ada, kita makan ${num} keping: **${den} - ${num} = ${remNum}**.\n\nPenyebut ${den} di bawah kekal sama.\n\n**Jadi, jawapannya ialah:**\n**${remNum}/${den}**${simp.num !== remNum ? ` (dipermudahkan kepada ${simp.num}/${simp.den})` : ''}! 🍕✨`,
      socraticPrompt: 'Kunci mudah: 1 biji kek sentiasa sama dengan nombor atas dan bawah yang sama!',
      proTip: 'Contoh dapur: 1 loyang piza (4/4) dimakan 1/4 keping, tinggal 3/4 keping!',
    };
  }

  const subRegex = /(\d+)\s*\/\s*(\d+)\s*(-|\btolak\b|\bminus\b)\s*(\d+)\s*\/\s*(\d+)/i;
  const subMatch = q.match(subRegex);
  if (subMatch) {
    const num1 = parseInt(subMatch[1], 10);
    const den1 = parseInt(subMatch[2], 10);
    const num2 = parseInt(subMatch[4], 10);
    const den2 = parseInt(subMatch[5], 10);

    if (den1 === den2 && den1 > 0) {
      const diffNum = num1 - num2;
      const simp = simplify(Math.abs(diffNum), den1);

      return {
        identifiedTopic: wasWordQuery
          ? `Penolakan Pecahan (Soalan Perkataan: ${num1}/${den1} - ${num2}/${den2})`
          : 'Operasi Penolakan Pecahan Wajar (Penyebut Sama)',
        confidenceTag: 'Kategori: Operasi Tolak DSKP 3.1.6',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        mathWorkspace: {
          problemTitle: wasWordQuery
            ? `Penyelesaian Soalan Perkataan: "${raw}"`
            : 'Ruang Kerja Pengiraan Penolakan Pecahan',
          category: 'Operasi Tolak (Penyebut Sama)',
          problemEquation: wasWordQuery
            ? `${num1}/${den1} - ${num2}/${den2} = ? ("${raw}")`
            : `${num1}/${den1} - ${num2}/${den2} = ?`,
          formulaUsed: '(Pengangka 1 - Pengangka 2) / Penyebut Sama',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            ...(wasWordQuery
              ? [`Langkah 1 (Terjemah Perkataan): Soalan perkataan "${raw}" ditulis dalam bentuk angka pecahan sebagai ${num1}/${den1} - ${num2}/${den2}.`]
              : [`Langkah 1 (Faham): Kedua-dua pecahan mempunyai penyebut yang sama iaitu ${den1}.`]),
            `Langkah 2 (Periksa Penyebut): Nombor bawah (${den1}) adalah serupa.`,
            `Langkah 3 (Fikir): Kita hanya tolak bilangan kepingan di atas. Penyebut di bawah tidak boleh ditolak!`,
            `Langkah 4 (Selesaikan): Tolakkan nombor di atas sahaja: ${num1} - ${num2} = ${diffNum}. Jawapan = ${diffNum}/${den1}.`,
            ...(simp.num !== diffNum && diffNum > 0
              ? [`Langkah 5 (Semak & Bentuk Termudah): Permudahkan kepada ${simp.num}/${simp.den}.`]
              : [`Langkah 5 (Semak): Pengiraan tepat secara matematik.`]),
          ],
          finalAnswer: `${diffNum}/${den1}${simp.num !== diffNum && diffNum > 0 ? ` = ${simp.num}/${simp.den}` : ''}`,
          note: wasWordQuery
            ? `Soalan perkataan "${raw}" bersamaan dengan ayat matematik ${num1}/${den1} - ${num2}/${den2}.`
            : 'Proses penolakan menunjukkan mengambil sebahagian daripada keseluruhan yang ada.',
          socraticQuestion: `Adakah penyebut di bawah menjadi ${den1 - den2}? Kenapa tidak boleh tolak nombor bawah?`,
        },
        explanationText: `${
          wasWordQuery
            ? `Adik bertanya dalam perkataan: **"${raw}"**.\nDalam ayat matematik pecahan, ia ditulis sebagai **${num1}/${den1} - ${num2}/${den2}**! 👏\n\n`
            : ''
        }Mari kita buat langkah demi langkah 👇\n\n**Soalan:** Berapakah **${num1}/${den1} - ${num2}/${den2}**?\n\n1. **Perhatikan Penyebut:**\nKedua-dua pecahan mempunyai penyebut yang sama iaitu **${den1}**.\n\n2. **Tolak Pembilang (Atas) Sahaja:**\nKita tolak kepingan yang diambil: **${num1} - ${num2} = ${diffNum}**.\nNombor bawah kekal ${den1}!\n\n**Jadi, jawapannya ialah:**\n**${diffNum}/${den1}**${simp.num !== diffNum && diffNum > 0 ? ` (dipermudahkan kepada ${simp.num}/${simp.den})` : ''}! 🍰✨`,
        socraticPrompt: 'Ingat konsep: Ambil sebahagian kepingan, saiz loyang tidak pernah berubah!',
        proTip: 'Contoh Dapur: 3/4 loyang kek dimakan 1/4, baki tinggal 2/4 = 1/2 loyang kek!',
      };
    } else if (den1 > 0 && den2 > 0) {
      // Different denominators subtraction
      const commonDen = (den1 * den2) / gcd(den1, den2);
      const mult1 = commonDen / den1;
      const mult2 = commonDen / den2;
      const newNum1 = num1 * mult1;
      const newNum2 = num2 * mult2;
      const diffNum = newNum1 - newNum2;
      const simp = simplify(Math.abs(diffNum), commonDen);

      return {
        identifiedTopic: wasWordQuery
          ? `Penolakan Pecahan Penyebut Berbeza (Soalan Perkataan: ${num1}/${den1} - ${num2}/${den2})`
          : 'Operasi Penolakan Pecahan Penyebut Berbeza',
        confidenceTag: 'Kategori: Pengiraan Lanjutan DSKP 3.1.6',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        mathWorkspace: {
          problemTitle: wasWordQuery
            ? `Penyelesaian Soalan Perkataan: "${raw}"`
            : 'Ruang Kerja Tolak Pecahan Penyebut Berbeza',
          category: 'Operasi Tolak (Penyebut Berbeza)',
          problemEquation: wasWordQuery
            ? `${num1}/${den1} - ${num2}/${den2} = ? ("${raw}")`
            : `${num1}/${den1} - ${num2}/${den2} = ?`,
          formulaUsed: 'Samakan Penyebut Terlebih Dahulu (Gandaan Sepunya)',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            ...(wasWordQuery
              ? [`Langkah 1 (Terjemah Perkataan): Soalan perkataan "${raw}" ditulis dalam bentuk angka pecahan sebagai ${num1}/${den1} - ${num2}/${den2}.`]
              : [`Langkah 1 (Faham): Penyebut ${den1} dan ${den2} tidak sama. Kita tidak boleh terus menolak nombor atas kerana saiz kepingan berbeza.`]),
            `Langkah 2 (Samakan Penyebut): Cari sifir sepunya untuk ${den1} dan ${den2}, iaitu ${commonDen}.`,
            `Langkah 3 (Tukar Pecahan 1): (${num1} × ${mult1}) / (${den1} × ${mult1}) = ${newNum1}/${commonDen}.`,
            `Langkah 4 (Tukar Pecahan 2): (${num2} × ${mult2}) / (${den2} × ${mult2}) = ${newNum2}/${commonDen}.`,
            `Langkah 5 (Selesaikan): Tolakkan pengangka: ${newNum1} - ${newNum2} = ${diffNum}/${commonDen}.`,
            ...(simp.num !== Math.abs(diffNum) && diffNum > 0
              ? [`Langkah 6 (Semak & Bentuk Termudah): Permudahkan kepada ${simp.num}/${simp.den}.`]
              : [`Langkah 6 (Semak): Pengiraan telah disemak secara tepat.`]),
          ],
          finalAnswer: `${diffNum}/${commonDen}${simp.num !== Math.abs(diffNum) && diffNum > 0 ? ` = ${simp.num}/${simp.den}` : ''}`,
          note: wasWordQuery
            ? `Soalan perkataan "${raw}" bersamaan dengan ayat matematik ${num1}/${den1} - ${num2}/${den2}.`
            : 'Mesti samakan saiz kepingan terlebih dahulu sebelum menolak.',
          socraticQuestion: `Kenapa kita tidak boleh menolak ${num1} - ${num2} dan ${den1} - ${den2}?`,
        },
        explanationText: `${
          wasWordQuery
            ? `Adik bertanya dalam perkataan: **"${raw}"**.\nDalam ayat matematik pecahan, ia ditulis sebagai **${num1}/${den1} - ${num2}/${den2}**! 👏\n\n`
            : ''
        }Penyebut pecahan ini berbeza (${den1} dan ${den2})! 🧐\n\n1. Kita samakan penyebut kepada **${commonDen}**.\n2. **${num1}/${den1}** menjadi **${newNum1}/${commonDen}**.\n3. **${num2}/${den2}** menjadi **${newNum2}/${commonDen}**.\n4. Sekarang tolakkan nombor atas: **${newNum1} - ${newNum2} = ${diffNum}**.\n\n**Jawapannya ialah:** **${diffNum}/${commonDen}**${simp.num !== Math.abs(diffNum) && diffNum > 0 ? ` (${simp.num}/${simp.den})` : ''}! ✨`,
        socraticPrompt: 'Kunci: Samakan penyebut, tolak pengangka sahaja!',
        proTip: 'Gunakan sifir darab untuk mencari gandaan sepunya terkecil!',
      };
    }
  }

  // =========================================================================
  // 11. TOPIK UTAMA: PECAHAN KUMPULAN OBJEK (DSKP 3.1.1)
  // e.g. "3/5 daripada 15", "2/3 daripada 12"
  // =========================================================================
  const groupRegex = /(\d+)\s*\/\s*(\d+)\s*(?:daripada|of|times|\*)\s*(\d+)/i;
  const groupMatch = q.match(groupRegex);
  if (groupMatch) {
    const num = parseInt(groupMatch[1], 10);
    const den = parseInt(groupMatch[2], 10);
    const total = parseInt(groupMatch[3], 10);

    if (den > 0) {
      const perGroup = total / den;
      const isInteger = Number.isInteger(perGroup);
      const resultVal = perGroup * num;

      return {
        identifiedTopic: `Pecahan Daripada Kumpulan Objek (${num}/${den} daripada ${total})`,
        confidenceTag: 'Kategori: Kumpulan Objek DSKP 3.1.1',
        pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
        visualDiagram: {
          type: 'group',
          title: `Visual Kumpulan Objek: ${num}/${den} daripada ${total} Unit`,
          group: {
            totalItems: total,
            groups: den,
            itemsPerGroup: Math.round(perGroup),
            selectedGroups: num,
            emoji: '🥚',
          },
          explanation: `${total} biji telur dibahagi sama rata ke dalam ${den} buah bakul. ${num} bakul diambil = ${resultVal} biji!`,
        },
        mathWorkspace: {
          problemTitle: `Ruang Kerja Kumpulan Objek: ${num}/${den} daripada ${total}`,
          category: 'Pecahan Kumpulan Objek',
          problemEquation: `${num}/${den} × ${total} = ?`,
          formulaUsed: 'Jawapan = (Jumlah Objek ÷ Penyebut) × Pengangka',
          pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
          stepByStep: [
            `Langkah 1 (Faham): Kita ada sejumlah ${total} objek (contohnya telur atau biskut). Kita perlu cari nilai ${num}/${den} daripadanya.`,
            `Langkah 2 (Visualkan): Bayangkan ada ${den} buah bakul kosong. Kita bahagikan ${total} objek sama banyak: ${total} ÷ ${den} = ${isInteger ? perGroup : perGroup.toFixed(1)} biji setiap bakul.`,
            `Langkah 3 (Fikir): Sekarang, ambil ${num} buah bakul daripadanya.`,
            `Langkah 4 (Selesaikan): Darabkan: ${num} bakul × ${perGroup} biji = ${resultVal} biji.`,
            `Langkah 5 (Semak): Sahkan: ${resultVal} daripada ${total} bersamaan dengan ${num}/${den}. Tepat!`,
          ],
          finalAnswer: `${resultVal} objek`,
          note: 'Kaedah mudah ingat: (Bahagi Bawah, Darab Atas)!',
          socraticQuestion: `Kalau 1 bakul ada ${perGroup} biji, berapa biji telur yang tinggal dalam bakul yang belum diambil?`,
        },
        explanationText: `Mari kita buat langkah demi langkah 👇\n\n**Soalan:** Berapakah **${num}/${den} daripada ${total}**?\n\n1. **Langkah 1 (Bahagikan ke dalam kumpulan):**\nKita agihkan ${total} objek sama banyak ke dalam **${den} kumpulan**:\n**${total} ÷ ${den} = ${perGroup} objek setiap kumpulan**.\n\n2. **Langkah 2 (Ambil bilangan kumpulan yang dimahukan):**\nKita mahu **${num} kumpulan**, jadi kita darabkan:\n**${num} × ${perGroup} = ${resultVal} objek**!\n\n**Jadi, jawapannya ialah:**\n**${resultVal} objek**! 🥚✨`,
        socraticPrompt: 'Kaedah pantas: Bahagi nombor bawah, darab nombor atas!',
        proTip: 'Situasi Dapur: 15 biji telur dalam resipi kuih Chef Alya dibahagi 5 mangkuk, ambil 3 mangkuk = 9 biji telur!',
      };
    }
  }

  // =========================================================================
  // 12. PERBANDINGAN PECAHAN (KBAT & PERBANDINGAN - SECTION 10 SPEC)
  // e.g. "mana lebih besar 2/3 atau 3/4"
  // =========================================================================
  const compareRegex = /(\d+)\s*\/\s*(\d+)\s*(?:dan|dengan|atau|vs)\s*(\d+)\s*\/\s*(\d+)/i;
  const compMatch = q.match(compareRegex);
  if (compMatch && (q.includes('besar') || q.includes('kecil') || q.includes('banding') || q.includes('mana') || q.includes('lebih'))) {
    const n1 = parseInt(compMatch[1], 10);
    const d1 = parseInt(compMatch[2], 10);
    const n2 = parseInt(compMatch[3], 10);
    const d2 = parseInt(compMatch[4], 10);

    const val1 = n1 / d1;
    const val2 = n2 / d2;
    const cross1 = n1 * d2;
    const cross2 = n2 * d1;

    const bigger = val1 > val2 ? `${n1}/${d1}` : val1 < val2 ? `${n2}/${d2}` : 'Sama Nilai (Setara)';

    return {
      identifiedTopic: `Perbandingan Nilai Pecahan: ${n1}/${d1} vs ${n2}/${d2}`,
      confidenceTag: 'Kategori: Membandingkan Nilai Pecahan DSKP 3.1.3',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'comparison',
        title: `Visual Perbandingan Saiz: ${n1}/${d1} vs ${n2}/${d2}`,
        comparison: {
          frac1: { label: `Pecahan Pertama (${n1}/${d1})`, num: n1, den: d1 },
          frac2: { label: `Pecahan Kedua (${n2}/${d2})`, num: n2, den: d2 },
          winner: bigger,
        },
        explanation: 'Jalur kedua-duanya mempunyai panjang keseluruhan yang sama. Perhatikan jalur mana yang lebih panjang diwarnakan!',
      },
      mathWorkspace: {
        problemTitle: `Ruang Kerja Perbandingan: ${n1}/${d1} dan ${n2}/${d2}`,
        category: 'Perbandingan Pecahan (KBAT)',
        problemEquation: `Bandingkan nilai antara ${n1}/${d1} dan ${n2}/${d2}`,
        formulaUsed: 'Kaedah Darab Silang (Cross-Multiplication) / Samakan Penyebut',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          `Langkah 1 (Faham): Kita mahu bandingkan mana yang lebih besar antara ${n1}/${d1} dan ${n2}/${d2}.`,
          `Langkah 2 (Visualkan): Bayangkan dua jalur coklat sama panjang. Satu dipotong ${d1} bahagian, satu lagi dipotong ${d2} bahagian.`,
          `Langkah 3 (Fikir & Strategi): Kaedah paling pantas dan tepat ialah "Darab Silang".`,
          `Langkah 4 (Selesaikan): Sebelah kiri (${n1} × ${d2} = ${cross1}) manakala sebelah kanan (${n2} × ${d1} = ${cross2}).`,
          `Langkah 5 (Semak): Oleh kerana ${cross1} ${cross1 > cross2 ? '>' : cross1 < cross2 ? '<' : '='} ${cross2}, maka ${bigger} adalah lebih besar!`,
        ],
        finalAnswer: `${bigger} adalah lebih besar`,
        note: `Nilai perpuluhan: ${n1}/${d1} = ${val1.toFixed(2)} manakala ${n2}/${d2} = ${val2.toFixed(2)}.`,
        socraticQuestion: `Cuba adik bayangkan: Kalau kedua-dua pecahan penyebutnya sama (cth 2/4 vs 3/4), mana yang lebih besar dan kenapa?`,
      },
      explanationText: `Mari kita buat langkah demi langkah 👇\n\n**Soalan:** Mana lebih besar antara **${n1}/${d1}** dan **${n2}/${d2}**?\n\n**Cara Cepat & Tepat (Kaedah Darab Silang):**\n1. Darab silang pembilang pertama dengan penyebut kedua:\n**${n1} × ${d2} = ${cross1}**.\n\n2. Darab silang pembilang kedua dengan penyebut pertama:\n**${n2} × ${d1} = ${cross2}**.\n\n3. **Bandingkan:**\nNombor **${Math.max(cross1, cross2)}** lebih besar daripada **${Math.min(cross1, cross2)}**.\n\n**Kesimpulan:**\nPecahan **${bigger} adalah LEBIH BESAR**! ⚖️✨`,
      socraticPrompt: 'Tips Chef Alya: Kalau pembilang sama (cth: 1/2 vs 1/4), penyebut yang kecil sebenarnya memberi potongan pizza yang lebih besar!',
      proTip: 'Semakan Visual: 3/4 = 0.75 manakala 2/3 = 0.67, jelas 3/4 lebih besar!',
    };
  }

  // =========================================================================
  // 13. ADAPTASI RANGKAIAN (ONLINE & OFFLINE)
  // =========================================================================
  if (
    q.includes('offline') ||
    q.includes('luar talian') ||
    q.includes('online') ||
    q.includes('dalam talian') ||
    q.includes('internet')
  ) {
    return {
      identifiedTopic: 'Adaptasi Dwi-Mod: Luar Talian (Offline) & Dalam Talian (Online)',
      confidenceTag: 'Kategori: Keupayaan Rangkaian & Adaptasi Mod',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      mathWorkspace: {
        problemTitle: 'Ruang Kerja Struktur Dwi-Mod Pembelajaran',
        category: 'Adaptasi Sistem (Online & Offline)',
        problemEquation: 'Mod Dalam Talian (Online) <---> Mod Luar Talian (Offline)',
        formulaUsed: 'Service Worker Caching + Storan Tempatan + Enjin AI Terbina Dalam',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          '1. Keadaan Dalam Talian (Online): Sambungan internet aktif membolehkan penyegerakan automatik dan kemas kini pantas.',
          '2. Keadaan Luar Talian (Offline): Enjin AI Puan Alya dan semua 4 hidangan masakan beroperasi 100% tanpa internet.',
          '3. Storan Data: Bintang, hidangan yang siap, dan sejarah sembang disimpan secara automatik dalam peranti adik.',
        ],
        finalAnswer: 'Sedia Berfungsi Lancar Pada Bila-bila Masa!',
      },
      explanationText: `Aplikasi Dapur Pecahan Chef Alya direka khas dengan keupayaan **Adaptasi 2 Keadaan (Online & Offline)**:\n\n🌐 **Keadaan 1 - Mod Dalam Talian (Online)**:\n• Segerak automatik dan kemas kini pantas dengan sambungan internet.\n\n📶 **Keadaan 2 - Mod Luar Talian (Offline)**:\n• Beroperasi 100% tanpa internet menggunakan enjin logik matematik terbina dalam peranti.\n• Sesuai untuk kegunaan bilik darjah sekolah, kawasan tanpa WiFi, atau luar talian di rumah!\n\nAdik boleh belajar pecahan pada bila-bila masa dengan tenang! 👩‍🍳✨`,
      proTip: 'Klik butang status rangkaian di bahagian atas untuk melihat butiran atau mencuba simulasi mod offline!',
    };
  }

  // =========================================================================
  // 14. PERATUS & PERPULUHAN (DSKP 3.2 & 3.3)
  // =========================================================================
  if (q.includes('peratus') || q.includes('%')) {
    const fracMatch = q.match(/(\d+)\s*\/\s*(\d+)/);
    const num = fracMatch ? parseInt(fracMatch[1], 10) : 3;
    const den = fracMatch ? parseInt(fracMatch[2], 10) : 4;
    const pct = (num / den) * 100;

    return {
      identifiedTopic: `Penukaran Pecahan (${num}/${den}) -> Peratusan (%)`,
      confidenceTag: 'Kategori: Hubungan Pecahan & Peratus DSKP 3.3',
      pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
      visualDiagram: {
        type: 'bar',
        title: `Visual Perseratus: ${num}/${den} = ${pct}%`,
        totalParts: 10,
        shadedParts: Math.round(pct / 10),
        emojiBlocks: getEmojiBlocks(Math.round(pct / 10), 10),
        explanation: `Peratus bermaksud per seratus (/100). ${num}/${den} bersamaan dengan ${pct} petak daripada 100 petak!`,
      },
      mathWorkspace: {
        problemTitle: `Ruang Kerja Penukaran Pecahan ke Peratus`,
        category: 'Pecahan ke Peratus (%)',
        problemEquation: `${num}/${den} = ? %`,
        formulaUsed: 'Pecahan × 100% ATAU Jadikan Penyebut 100',
        pedagogicalStage: 'FAHAM -> VISUALKAN -> FIKIR -> SELESAIKAN -> SEMAK',
        stepByStep: [
          `Langkah 1 (Faham): Peratus (%) bermaksud "per seratus" atau pecahan dengan penyebut 100.`,
          `Langkah 2 (Visualkan): Bayangkan grid 100 petak perseratus.`,
          `Langkah 3 (Fikir): Untuk tukar ${num}/${den}, kita jadikan penyebutnya 100: ${den} × ${100 / den} = 100.`,
          `Langkah 4 (Selesaikan): Darab nombor atas dengan nombor yang sama: ${num} × ${100 / den} = ${pct}.`,
          `Langkah 5 (Semak): ${pct}/100 = ${pct}%.`,
        ],
        finalAnswer: `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`,
        note: 'Simbol % sentiasa merujuk kepada nilai per 100.',
      },
      explanationText: `Mari kita buat langkah demi langkah 👇\n\nPeratus bermaksud **per seratus** (/100).\nUntuk tukarkan **${num}/${den}** kepada peratus:\n• Kita jadikan penyebutnya 100 dengan mendarab ${100 / den}.\n• Pembilang juga didarab nombor sama: ${num} × ${100 / den} = **${pct}**.\n\n**Jadi, jawapannya ialah:**\n**${pct}%**! 📊✨`,
      proTip: 'Pecahan Emas: 1/2 = 50%, 1/4 = 25%, 3/4 = 75%, 1/5 = 20%, 1/10 = 10%!',
    };
  }

  // =========================================================================
  // 15. DEFAULT / ADAPTIVE PEDAGOGICAL SOCRATIC FALLBACK
  // =========================================================================
  return {
    identifiedTopic: 'Bimbingan Matematik & Perbualan Interaktif Pecahan Tahun 3',
    confidenceTag: 'Kategori: AI Teaching Assistant Puan Alya',
    pedagogicalStageTag: 'FAHAM → VISUALKAN → FIKIR → SELESAIKAN → SEMAK',
    explanationText: `Hai adik! Puan Alya sedia membantu adik menguasai tajuk **Pecahan Tahun 3 (DSKP)** dengan mudah dan seronok! 👩‍🍳✨\n\nAdik boleh tanya apa saja atau taip soalan pengiraan, contohnya:\n• 🎨 **Visual:** "Boleh buat gambar visual 3/4?"\n• ➕ **Operasi Tambah:** "Berapa 1/5 + 2/5?"\n• ➖ **Operasi Tolak:** "Berapa 3/4 - 1/4 atau 1 - 2/5?"\n• 🍰 **Nombor Bercampur:** "Tukar 2 1/3 kepada pecahan tak wajar dan kenapa kena darab?"\n• 🔄 **Pecahan Tak Wajar:** "Tukar 7/3 kepada nombor bercampur"\n• 📖 **Soalan Cerita:** "Ali makan 1/4 kek dan Ahmad makan 2/4 kek"\n• ❓ **Bantuan Asas:** "Puan Alya, saya tak faham pecahan"\n\nJom kita buat sama-sama! Taipkan soalan adik di bawah 👇`,
    socraticPrompt: 'Matlamat kita: Bukan sekadar tahu jawapan, tapi benar-benar faham kenapa jawapan itu betul!',
    proTip: 'Klik mana-mana butang soalan pantas di atas untuk melihat langkah kerja pengiraan terperinci.',
  };
}
