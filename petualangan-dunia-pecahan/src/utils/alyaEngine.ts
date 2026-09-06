// Alya Intelligent Local Fraction AI Learning Guide Engine for Year 3 Malaysia Curriculum

export interface AlyaContext {
  worldId?: string;
  currentGame?: string;
  currentStage?: string | number;
  currentQuestion?: string;
  studentAnswer?: string;
  mistakeCount?: number;
  hintCount?: number;
  challengeName?: string;
  questionText?: string;
  fractionData?: {
    numerator?: number;
    denominator?: number;
    topping?: string;
    item?: string;
    targetFraction?: string;
  };
  lastAttemptResult?: 'correct' | 'incorrect' | null;
}

/**
 * 4-Step Hint Hierarchy:
 * Step 1: HINT 1 (Soalan memancing fikiran tanpa berikan jawapan)
 * Step 2: HINT 2 (Bimbingan langkah demi langkah)
 * Step 3: PENERANGAN (Penerangan konsep berkaitan)
 * Step 4: CUBA SEMULA (Galakan cuba semula dengan keyakinan)
 */
export function getAlyaHint(context: AlyaContext, step: 1 | 2 | 3 | 4 = 1): string {
  const game = context.currentGame || context.worldId || 'hub';
  const den = context.fractionData?.denominator || 4;
  const num = context.fractionData?.numerator || 1;

  // 1. Dapur Pecahan / Pizza Pecahan
  if (game.includes('dapur') || game.includes('pizza')) {
    if (step === 1) {
      return `💡 **Hint 1:** Jom Alya tolong! 🩷 Tengok nombor bawah dulu. Ada berapa bahagian semuanya?`;
    }
    if (step === 2) {
      return `💡 **Hint 2:** Bagus! Nombor bawah ialah ${den}. Sekarang tengok nombor atas (${num}). Berapa bahagian yang diambil?`;
    }
    if (step === 3) {
      return `🧠 **Konsep:** Pecahan ${num}/${den} bermaksud ${num} daripada ${den} bahagian sama besar! 🍕`;
    }
    return `🔄 **Cuba Lagi:** Alya yakin kamu boleh buat! Pilih ${num} daripada ${den} bahagian ya. 🩷`;
  }

  // 2. Arena Pecahan
  if (game.includes('arena')) {
    if (step === 1) {
      return `💡 **Hint 1:** Jom Alya tolong! 🩷 Tengok nombor bawah (penyebut). Sama tak?`;
    }
    if (step === 2) {
      return `💡 **Hint 2:** Kalau nombor bawah sama, bandingkan nombor atas saja!`;
    }
    if (step === 3) {
      return `🧠 **Konsep:** Nombor atas lebih besar bermaksud nilai pecahan lebih besar!`;
    }
    return `🔄 **Cuba Lagi:** Hebat! Sekarang pilih jawapan yang betul. Kamu boleh! 🩷`;
  }

  // 3. Dunia Pixel
  if (game.includes('pixel')) {
    if (step === 1) {
      return `💡 **Hint 1:** Jom Alya tolong! 🩷 Cuba darab nombor atas dan bawah dengan nombor yang sama.`;
    }
    if (step === 2) {
      return `💡 **Hint 2:** Contoh: 1/2 bila darab 2 atas dan bawah jadi 2/4. Nilainya sama!`;
    }
    if (step === 3) {
      return `🧠 **Konsep:** Pecahan setara ialah pecahan berlainan nombor tapi saiz sama besar! ✨`;
    }
    return `🔄 **Cuba Lagi:** Pilih kad pecahan yang sama nilai. Alya tolong kamu! 🩷`;
  }

  // 4. Default / Hub
  if (step === 1) {
    return `💡 **Hint 1:** Jom Alya tolong! 🩷 Nombor atas ialah pengangka, nombor bawah ialah penyebut.`;
  }
  if (step === 2) {
    return `💡 **Hint 2:** Nombor bawah = semua bahagian. Nombor atas = bahagian yang kita pilih.`;
  }
  if (step === 3) {
    return `🧠 **Konsep:** Pecahan wajar: nombor atas lebih kecil daripada nombor bawah (contoh: 1/2, 2/3).`;
  }
  return `🔄 **Cuba Lagi:** Kamu pasti boleh! Jom cuba jawab soalan. 🩷`;
}

/**
 * Feedback for student mistakes, strictly adhering to positive encouragement:
 * "Belum tepat lagi. Tak mengapa! 🩷" + tailored hint.
 */
export function getIncorrectFeedback(context: AlyaContext): string {
  const game = context.currentGame || context.worldId || 'hub';

  if (game.includes('arena')) {
    return 'Belum tepat lagi. Tak mengapa! 🩷 Tengok nombor bawah dulu ya.';
  }
  if (game.includes('dapur') || game.includes('pizza')) {
    return 'Belum tepat lagi. Tak mengapa! 🩷 Kira potongan pizza dengan teliti. Jom cuba!';
  }
  if (game.includes('pixel')) {
    return 'Belum tepat lagi. Tak mengapa! 🩷 Cari pecahan yang sama nilai ya.';
  }
  return 'Belum tepat lagi. Tak mengapa! 🩷 Jom cuba sekali lagi!';
}

/**
 * Intelligent Answer Engine for Alya AI Learning Guide
 */
export function answerAlyaQuestion(userQuery: string, context: AlyaContext = {}): string {
  const query = userQuery.toLowerCase().trim();

  if (!query) {
    return 'Hai! Saya Alya! 🩷 Ada soalan tentang pecahan? Jom tanya Alya!';
  }

  // 1. Check for Out-of-Scope Questions
  // Whitelisted math & fraction words
  const fractionMathKeywords = [
    'pecahan', 'pengangka', 'penyebut', 'setara', 'wajar', 'tak wajar', 'bercampur',
    'separuh', 'suku', 'setengah', 'bahagian', 'jumlah', 'tambah', 'tolak',
    'banding', 'besar', 'kecil', 'sama', 'termudah', 'ringkas', 'potong',
    'pizza', 'kek', 'cawan', 'sukat', '1/2', '1/4', '3/4', '2/4', '1/3', '2/3',
    'jawapan', 'hint', 'petunjuk', 'bantu', 'tolong', 'apa', 'kenapa', 'mengapa',
    'bagaimana', 'macam mana', 'maksud', 'erti', 'siapa alya', 'hai', 'hello',
    'salam', 'terima kasih', 'tq', 'thank'
  ];

  const containsMath = fractionMathKeywords.some((kw) => query.includes(kw));

  // If asking irrelevant off-topic questions (e.g. weather, games outside fractions, movies, politics)
  const isClearlyOffTopic =
    query.includes('cuaca') ||
    query.includes('presiden') ||
    query.includes('kereta') ||
    query.includes('lagu') ||
    query.includes('roblox') ||
    query.includes('minecraft') ||
    query.includes('bola sepak') ||
    query.includes('formula 1') ||
    query.includes('siapa perdana menteri');

  if (isClearlyOffTopic || (!containsMath && query.length > 8)) {
    return 'Alya sedia tolong tentang pecahan saja ya! 🩷';
  }

  // 2. Salam & Greeting
  if (query === 'hai' || query === 'hello' || query.startsWith('hai alya') || query.startsWith('salam')) {
    return 'Hai! Jom belajar pecahan dengan Alya! 🩷 Apa yang nak ditanya?';
  }

  // 3. Asking for Direct Answers ("Jawapan dia apa?", "Apa jawapan soalan ni?")
  if (
    query.includes('jawapan dia apa') ||
    query.includes('jawapan soalan ni') ||
    query.includes('apa jawapannya') ||
    query.includes('bagi jawapan') ||
    query.includes('beritahu jawapan') ||
    query.includes('apakah jawapan') ||
    query.includes('jawapan apa') ||
    query === 'jawapan'
  ) {
    return 'Jom Alya tolong! 🩷\n\nTengok nombor bawah dulu.\nAda berapa bahagian semuanya?';
  }

  // 4. "Apa itu pecahan?" / Maksud Pecahan
  if (
    query.includes('apa itu pecahan') ||
    query.includes('apa pecahan') ||
    query.includes('maksud pecahan') ||
    query.includes('erti pecahan') ||
    query === 'pecahan'
  ) {
    return 'Pecahan ialah bahagian daripada satu benda yang dipotong sama besar. 🩷\n\n• Nombor atas = Pengangka\n• Nombor bawah = Penyebut';
  }

  // 5. "Apa maksud 1/2?" / "Apa itu 1/2?"
  if (
    query.includes('apa maksud 1/2') ||
    query.includes('maksud 1/2') ||
    query.includes('apa itu 1/2') ||
    query.includes('erti 1/2')
  ) {
    return '1/2 maksudnya 1 daripada 2 bahagian sama besar (separuh)! 🍕';
  }

  // 6. "Apa itu pengangka?"
  if (
    query.includes('apa itu pengangka') ||
    query.includes('apa pengangka') ||
    query.includes('maksud pengangka') ||
    query.includes('nombor atas')
  ) {
    return 'Pengangka ialah nombor di atas! 🩷\n\nIa tunjuk bilangan bahagian yang kita pilih.';
  }

  // 7. "Apa itu penyebut?"
  if (
    query.includes('apa itu penyebut') ||
    query.includes('apa penyebut') ||
    query.includes('maksud penyebut') ||
    query.includes('nombor bawah')
  ) {
    return 'Penyebut ialah nombor di bawah! 🩷\n\nIa tunjuk jumlah semua bahagian yang sama besar.';
  }

  // 8. "Kenapa 1/2 lebih besar daripada 1/4?" / "1/2 atau 1/4 lebih besar"
  if (
    query.includes('kenapa 1/2 lebih besar') ||
    query.includes('1/2 lebih besar daripada 1/4') ||
    query.includes('kenapa 1/2 > 1/4') ||
    query.includes('1/2 atau 1/4')
  ) {
    return 'Kalau pizza potong 2, kepingannya lebih besar daripada potong 4! Jadi 1/2 lebih besar daripada 1/4. 🩷';
  }

  // 9. "Macam mana nak cari pecahan setara?" / Pecahan Setara
  if (
    query.includes('pecahan setara') ||
    query.includes('cari pecahan setara') ||
    query.includes('macam mana nak cari pecahan setara') ||
    query.includes('apa itu pecahan setara')
  ) {
    return 'Pecahan setara ialah pecahan berlainan nombor tapi sama saiz! ✨\n\nContoh: 1/2 darab 2 atas dan bawah jadi 2/4. Nilainya sama! 🩷';
  }

  // 10. "Macam mana nak bandingkan pecahan?" / Bandingkan Pecahan
  if (
    query.includes('banding') ||
    query.includes('macam mana nak bandingkan pecahan') ||
    query.includes('cara banding pecahan') ||
    query.includes('mana lebih besar')
  ) {
    return 'Kalau nombor bawah sama, tengok nombor atas. Nombor atas lebih besar = pecahan lebih besar! 🩷';
  }

  // 11. Pecahan Wajar
  if (query.includes('pecahan wajar')) {
    return 'Pecahan wajar ialah nombor atas LEBIH KECIL daripada nombor bawah. Contoh: 1/2, 2/3, 3/4. 🩷';
  }

  // 12. Menambah & Menolak Pecahan
  if (query.includes('tambah') || query.includes('tolak')) {
    return 'Kalau nombor bawah sama, tambah atau tolak nombor atas sahaja! Nombor bawah kekal. 🩷\n\nContoh: 1/4 + 2/4 = 3/4!';
  }

  // 13. Kinestetik / Cuba Sendiri
  if (query.includes('cuba sendiri') || query.includes('kinestetik') || query.includes('nak cuba') || query.includes('aktiviti')) {
    return 'Sekarang kamu cuba sendiri! 🩷\n\nTekan tab **✋ Cuba Sekarang** di atas untuk membuka aktiviti interaktif. Kamu boleh tekan, pilih bahagian, padankan pecahan setara, bandingkan dan susun pecahan!';
  }

  // 14. Ucapan Terima Kasih
  if (query.includes('terima kasih') || query.includes('tq') || query.includes('thanks')) {
    return 'Sama-sama! 🩷 Alya gembira dapat belajar bersama kamu. Teruskan usaha hebat kamu ya! 🌟';
  }

  // 14. Friendly Fraction Guidance Default
  return 'Jom kita fikir bersama! 🩷 Dalam pecahan, ingat bahawa pengangka berada di atas dan penyebut berada di bawah. Ada bahagian yang ingin kamu tanyakan kepada Alya?';
}

export interface FractionVisualData {
  numerator: number;
  denominator: number;
  type?: 'bar' | 'pizza' | 'number-line' | 'shape';
  comparison?: {
    numerator: number;
    denominator: number;
  };
  comparisonTitle?: string;
  caption?: string;
}

/**
 * Intelligent detector to automatically generate Visual Fraction representations
 * for Alya's replies and student queries (Visual Mode / Visual Learning)
 */
export function detectVisualForAlya(
  rawQuery: string,
  rawReplyText: string,
  context?: AlyaContext
): FractionVisualData | null {
  const q = rawQuery.toLowerCase();
  const r = rawReplyText.toLowerCase();

  // 1. Check for specific comparison (e.g. "Kenapa 1/2 lebih besar daripada 1/4?")
  if (
    (q.includes('1/2') && q.includes('1/4')) ||
    (r.includes('1/2') && r.includes('1/4') && (r.includes('lebih besar') || q.includes('lebih besar')))
  ) {
    return {
      numerator: 1,
      denominator: 2,
      type: 'bar',
      comparison: { numerator: 1, denominator: 4 },
      comparisonTitle: 'Perbandingan Saiz: 1/2 berbanding 1/4',
      caption: 'Kepingan 1/2 adalah 2 kali ganda lebih besar daripada kepingan 1/4 kerana dibahagi kepada lebih sedikit bahagian! 🍕',
    };
  }

  // 2. Generic comparison between two fractions a/b and c/d
  const compMatch = (q + ' ' + r).match(/(\d+)\/(\d+)[\s\S]{1,40}(?:lebih besar|lebih kecil|banding|berbanding|atau)[\s\S]{1,40}(\d+)\/(\d+)/i);
  if (compMatch) {
    const n1 = parseInt(compMatch[1], 10);
    const d1 = parseInt(compMatch[2], 10);
    const n2 = parseInt(compMatch[3], 10);
    const d2 = parseInt(compMatch[4], 10);
    if (d1 >= 1 && d1 <= 12 && d2 >= 1 && d2 <= 12) {
      return {
        numerator: n1,
        denominator: d1,
        type: 'bar',
        comparison: { numerator: n2, denominator: d2 },
        comparisonTitle: `Perbandingan: ${n1}/${d1} berbanding ${n2}/${d2}`,
        caption: `Membandingkan bahagian ${n1}/${d1} dengan ${n2}/${d2}.`,
      };
    }
  }

  // 3. Question: "Apa itu pengangka?"
  if (q.includes('pengangka')) {
    return {
      numerator: 1,
      denominator: 4,
      type: 'bar',
      caption: 'Pengangka (nombor 1 di atas): 1 bahagian yang diambil atau dipilih daripada 4 bahagian keseluruhan.',
    };
  }

  // 4. Question: "Apa itu penyebut?"
  if (q.includes('penyebut')) {
    return {
      numerator: 4,
      denominator: 4,
      type: 'pizza',
      caption: 'Penyebut (nombor 4 di bawah): Jumlah SEMUA 4 bahagian yang sama besar dalam satu keseluruhan.',
    };
  }

  // 5. Check if query asks for a specific fraction "Apa maksud X/Y?" or contains "X/Y"
  const fractionMatch = q.match(/(\d+)\/(\d+)/) || r.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1], 10);
    const den = parseInt(fractionMatch[2], 10);
    if (den >= 1 && den <= 12 && num <= den) {
      const isPizzaPreferred = q.includes('pizza') || q.includes('maksud 1/2') || (context?.currentGame || '').includes('pizza');
      return {
        numerator: num,
        denominator: den,
        type: isPizzaPreferred ? 'pizza' : 'bar',
        caption: `${num} daripada ${den} bahagian yang sama besar.`,
      };
    }
  }

  // 6. Question: "Apa itu pecahan?"
  if (q.includes('apa itu pecahan') || q.includes('maksud pecahan')) {
    return {
      numerator: 1,
      denominator: 2,
      type: 'pizza',
      caption: 'Pecahan 1/2: 1 daripada 2 bahagian pizza yang sama besar (separuh).',
    };
  }

  // 7. Context fraction data (if current game level has active fractions)
  if (context?.fractionData?.denominator) {
    const den = context.fractionData.denominator;
    const num = context.fractionData.numerator || 1;
    if (den >= 1 && den <= 12) {
      return {
        numerator: num,
        denominator: den,
        type: (context.currentGame || '').includes('pizza') ? 'pizza' : 'bar',
        caption: `Soalan Semasa: ${num} daripada ${den} bahagian yang sama besar.`,
      };
    }
  }

  return null;
}


