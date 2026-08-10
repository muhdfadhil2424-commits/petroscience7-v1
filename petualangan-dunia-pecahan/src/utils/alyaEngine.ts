// Alya Intelligent Local Fraction Tutor Engine for Year 3 Malaysia Curriculum

export interface AlyaContext {
  worldId?: string; // 'hub' | 'pizza_pecahan' | 'arena_pecahan' | 'dapur_pecahan' | 'dunia_pixel'
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

export function getAlyaHint(context: AlyaContext, level: 1 | 2 | 3): string {
  const { worldId, challengeName, questionText, fractionData } = context;

  // 1. Pizza Pecahan Hints
  if (worldId === 'pizza_pecahan') {
    const num = fractionData?.numerator || 3;
    const den = fractionData?.denominator || 4;
    const topping = fractionData?.topping || 'keju';

    if (level === 1) {
      return `💡 Cuba lihat nombor di bawah pecahan (${den}). Pizza itu perlu dibahagikan kepada berapa bahagian yang sama besar?`;
    }
    if (level === 2) {
      return `💡 Bagus! Mula-mula potong pizza kepada ${den} bahagian. Kemudian, fikirkan berapa bahagian yang perlu diletakkan ${topping}.`;
    }
    return `💡 Bimbingan: Potong pizza kepada ${den} keping, lalu pilih ${topping} dan letakkan pada ${num} daripada ${den} keping pizza tersebut! 🍕`;
  }

  // 2. Arena Pecahan Hints
  if (worldId === 'arena_pecahan') {
    if (level === 1) {
      return `💡 Lihat nombor di atas (pengangka) dan nombor di bawah (penyebut). Adakah penyebutnya sama?`;
    }
    if (level === 2) {
      return `💡 Jika penyebut sama, kamu hanya perlu bandingkan atau tambah/tolak nombor di atas sahaja!`;
    }
    return `💡 Bimbingan: Untuk soalan ini, fokus pada pengangka. Pilih jawapan yang mempunyai pengangka yang tepat! 🏟️`;
  }

  // 3. Dapur Pecahan Hints
  if (worldId === 'dapur_pecahan') {
    if (level === 1) {
      return `💡 Perhatikan cawan sukat resepi. Garis manakah yang menunjukkan pecahan yang dikehendaki?`;
    }
    if (level === 2) {
      return `💡 Tuangkan bahan ke dalam cawan sukat mengikut takat pengangka yang diminta.`;
    }
    return `💡 Bimbingan: Isikan cawan sehingga takat garis pecahan yang sama dengan resepi Chef! 🍳`;
  }

  // 4. Dunia Pixel Hints
  if (worldId === 'dunia_pixel') {
    if (level === 1) {
      return `💡 Raksasa ini perlukan serangan pecahan! Adakah nombor pecahan raksasa ini lebih besar atau setara?`;
    }
    if (level === 2) {
      return `💡 Tukarkan pecahan kepada penyebut yang sama untuk mencari kuasa serangan pecahan setara!`;
    }
    return `💡 Bimbingan: Gunakan kad pecahan setara untuk mematahkan pertahanan Raksasa Pixel! ⚔️`;
  }

  // 5. Default Hub Hints
  if (level === 1) {
    return `💡 Pecahan ialah bahagian daripada satu keseluruhan yang sama besar. Pengangka di atas, penyebut di bawah! 🍕`;
  }
  if (level === 2) {
    return `💡 Mulakan pengembaraan dengan Arena Pecahan untuk menguji kefahaman asas pecahan kamu! ⭐`;
  }
  return `💡 Selesaikan kesemua 9 cabaran merentasi 3 dunia untuk mendapat Lencana Master Pecahan! 🏆`;
}

export function answerAlyaQuestion(userQuery: string, context: AlyaContext): string {
  const query = userQuery.toLowerCase().trim();

  if (!query) {
    return 'Hai! Boleh Alya bantu awak belajar pecahan hari ini? 😊';
  }

  // Check off-topic / non-math
  const mathKeywords = [
    'pecahan', 'wajar', 'setara', 'pengangka', 'penyebut', 'tambah', 'tolak',
    'darab', 'bahagi', 'kek', 'pizza', 'ringkas', 'termudah', 'nombor',
    'sama', 'besar', 'kecil', 'maksud', 'bantu', 'tolong', 'apa', 'bagaimana', 'kenapa'
  ];

  const hasMathKeyword = mathKeywords.some(k => query.includes(k));

  if (!hasMathKeyword && (query.includes('suka') || query.includes('makan') || query.includes('siapa') || query.includes('nama') || query.includes('game'))) {
    return 'Hehe 😊 Alya boleh bantu awak belajar Matematik! Cuba tanya Alya tentang pecahan.';
  }

  // 1. Mengenal Pecahan / Maksud Pecahan
  if (query.includes('apa itu pecahan') || query.includes('maksud pecahan') || query.includes('maksud 3/4') || query.includes('maksud 1/2')) {
    return 'Pecahan ialah sebahagian daripada satu keseluruhan yang dibahagi kepada beberapa bahagian yang sama besar. 🍕\n\nContohnya **3/4** bermaksud **3 bahagian** yang diambil daripada **4 bahagian** keseluruhan!';
  }

  // 2. Pengangka & Penyebut
  if (query.includes('pengangka') || query.includes('penyebut') || query.includes('nombor atas') || query.includes('nombor bawah')) {
    return 'Dalam pecahan seperti 3/4:\n1️⃣ **Nombor di atas (3)** ialah **Pengangka** — bahagian yang kita ambil.\n2️⃣ **Nombor di bawah (4)** ialah **Penyebut** — jumlah semua bahagian sama besar! 😊';
  }

  // 3. Pecahan Wajar
  if (query.includes('pecahan wajar') || query.includes('2/5')) {
    return 'Pecahan wajar ialah pecahan yang nombor di atas (**pengangka**) LEBIH KECIL daripada nombor di bawah (**penyebut**). 😊\n\nContoh: 2/5 (2 lebih kecil daripada 5), jadi 2/5 ialah **pecahan wajar**!';
  }

  // 4. Pecahan Setara
  if (query.includes('setara') || query.includes('1/2 sama dengan 2/4') || query.includes('kenapa 1/2 sama')) {
    return 'Ya! **1/2** dan **2/4** ialah **pecahan setara**! ✨\n\nBermaksud saiz bahagiannya sama besar. Jika pengangka dan penyebut 1/2 didarab dengan 2, kita dapat 2/4! (1×2=2, 2×2=4)';
  }

  // 5. Meringkaskan / Bentuk Termudah
  if (query.includes('ringkas') || query.includes('termudah') || query.includes('4/8')) {
    return 'Untuk meringkaskan pecahan seperti 4/8:\n1️⃣ Bahagikan pengangka dan penyebut dengan nombor yang sama (iaitu 4).\n2️⃣ 4 ÷ 4 = 1\n3️⃣ 8 ÷ 4 = 2\n\nJadi, 4/8 dalam bentuk termudah ialah **1/2**! 🎉';
  }

  // 6. Membandingkan Pecahan
  if (query.includes('lebih besar') || query.includes('lebih kecil') || query.includes('banding') || query.includes('1/2 atau 1/4')) {
    return '1/2 adalah LEBIH BESAR daripada 1/4! 🍕\n\nBayangkan pizza: 1/2 ialah separuh pizza, manakala 1/4 ialah satu daripada 4 keping sahaja!';
  }

  // 7. Menambah Pecahan
  if (query.includes('tambah') || query.includes('1/4 + 2/4')) {
    return 'Untuk menambah pecahan dengan penyebut yang sama:\n1️⃣ Pastikan penyebut (bawah) sama: cth 4.\n2️⃣ Tambahkan pengangka (atas): 1 + 2 = 3.\n3️⃣ Jawapannya ialah **3/4**! 🌟';
  }

  // 8. Menolak Pecahan
  if (query.includes('tolak') || query.includes('3/4 - 1/4')) {
    return 'Untuk menolak pecahan dengan penyebut yang sama:\n1️⃣ Tolakkan pengangka (atas): 3 - 1 = 2.\n2️⃣ Kekalkan penyebut: 2/4.\n3️⃣ Ringkaskan 2/4 menjadi **1/2**! 😊';
  }

  // 9. Soalan Cerita (kek / pizza)
  if (query.includes('ibu') || query.includes('adik') || query.includes('makan') || query.includes('kek')) {
    return 'Mari kita kira bersama! 🎂\n1️⃣ Ibu makan: 1/4 kek\n2️⃣ Adik makan: 2/4 kek\n3️⃣ Jumlah = 1/4 + 2/4 = **3/4** bahagian kek yang telah dimakan!';
  }

  // 10. Meminta Jawapan Terus ("apa jawapannya")
  if (query.includes('jawapan') || query.includes('apa jawapan')) {
    return 'Cuba dahulu! 💡 Lihat penyebut di bawah, adakah kedua-duanya sama? Tekan butang **💡 Petunjuk** jika perlukan langkah bimbingan!';
  }

  // 11. Minta Bantuan Umum ("tolong saya", "tak faham")
  if (query.includes('tolong') || query.includes('tak faham') || query.includes('susah')) {
    return 'Tak mengapa kalau belum faham! Alya sedia bantu awak satu demi satu. 😊\n\nCuba tekan butang **💡 Petunjuk** di bawah, atau tanya Alya soalan seperti *"Apa itu pecahan?"*';
  }

  // Default friendly response
  return `Bagus! Untuk topik ini, ingat bahawa pecahan terdiri daripada pengangka di atas dan penyebut di bawah. Ada soalan lagi tentang pecahan? 😊`;
}
