// Enjin Kandungan Pedagogi Matematik Tahun 3: Penerangan Alya
// DSKP KSSR Semakan Matematik Tahun 3 (Bidang: Nombor dan Operasi - 3.1 Pecahan)
// Mematuhi sepenuhnya prinsip: Konkrit, Berbimbingan Soalan Kecil, Bebas Halusinasi, dan Adaptif Data Kelas

import { InteractiveClassQuestion } from './interactiveClass30Questions';
import { ClassroomQuestionStats } from '../utils/interactiveSessionManager';
import { AnswerOption } from '../types/interactiveClass';

export interface AlyaExplanationStep {
  stepNumber: number;
  label: string; // e.g. "LANGKAH 1"
  questionGuide?: string; // Soalan kecil pembimbing: "Apakah penyebutnya?", "Berapa bahagian yang kita ada?"
  title: string;
  detail: string; // Penerangan konkrit menggunakan nombor sebenar soalan
  mathExpression?: string; // Rumus / simbol matematik (18–22px, font-mono)
  badgeColor?: string;
}

export interface AdaptiveClassMistakeInsight {
  hasSignificantMistake: boolean;
  wrongOptionLetter?: AnswerOption;
  wrongOptionText?: string;
  wrongCount?: number;
  wrongPercent?: number;
  misconceptionExplanation?: string;
}

export interface AlyaQuestionExplanation {
  questionId: string;
  dskpCode: string;
  topicTitle: string; // Tajuk topik pecahan

  // 🌟 1. JAWAPAN
  correctAnswerBanner: string; // "Jawapan yang betul ialah..."
  correctAnswerLetter: AnswerOption;
  correctAnswerValue: string; // e.g. "3/8"

  // 💡 2. KITA FAHAM SOALAN
  understandQuestion: string; // Apa yang soalan minta secara ringkas & jelas

  // 🧩 3. LANGKAH DEMI LANGKAH (Maksimum 2–4 langkah konkrit, berbimbingan soalan)
  steps: AlyaExplanationStep[];

  // ⭐ 4. MENGAPA?
  whyReason: string; // Sebab matematik konkrit di sebalik jawapan

  // 🧠 5. INGAT!
  keyConceptRemember: string; // Satu ayat konsep utama

  // ⚠️ 6. KESALAHAN BIASA
  commonMistake: string; // Kesalahan lazim berkaitan soalan sebenar

  // Peta analisis salah faham mengikut setiap pilihan jawapan (A, B, C, D)
  optionMisconceptions?: Record<string, string>;

  // ⚠️ 7. ADAPTIF MENGIKUT KESALAHAN KELAS (Dipacu data imbasan sebenar)
  adaptiveClassInsight?: AdaptiveClassMistakeInsight;

  // Skrip Sebutan Audio (ms-MY) - lancar, bersopan, mesra murid Tahun 3
  speechScript: string;
}

// ============================================================================
// BANK PEDAGOGI TEPAT BAGI 15 SOALAN KELAS INTERAKTIF (DSKP 3.1)
// ============================================================================
export const ALYA_PEDAGOGICAL_BANK: Record<string, Omit<AlyaQuestionExplanation, 'adaptiveClassInsight'>> = {
  // --------------------------------------------------------------------------
  // Q01: Ada 8 epal. 3 berwarna merah. Apakah pecahan epal merah?
  // --------------------------------------------------------------------------
  CLASS_Q01: {
    questionId: 'CLASS_Q01',
    dskpCode: '3.1.1',
    topicTitle: 'Pecahan Kumpulan Objek',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [A] — 3/8.',
    correctAnswerLetter: 'A',
    correctAnswerValue: '3/8',
    understandQuestion:
      'Soalan ini meminta kita mencari pecahan epal merah daripada sejumlah semua epal di dalam bakul.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya? Berapa jumlah semua epal?',
        title: 'Kira Jumlah Semua Epal',
        detail: 'Kira semua epal yang ada di dalam bakul. Terdapat 8 biji epal kesemuanya. Jadi, penyebut di bawah ialah 8.',
        mathExpression: 'Penyebut (Semua) = 8',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Berapa bahagian yang kita cari?',
        title: 'Kira Epal Berwarna Merah',
        detail: 'Kira epal merah yang ditanya oleh soalan. Ada 3 biji epal merah. Jadi, pengangka di atas ialah 3.',
        mathExpression: 'Pengangka (Merah) = 3',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Bagaimana kita menulis pecahannya?',
        title: 'Gabungkan Pengangka dan Penyebut',
        detail: 'Tulis 3 bahagian daripada 8 bahagian. Pengangka 3 di atas dan penyebut 8 di bawah: 3/8.',
        mathExpression: '3 daripada 8 = 3/8',
      },
    ],
    whyReason:
      'Kerana terdapat 3 biji epal merah daripada jumlah keseluruhan 8 biji epal. Pengangka mewakili objek yang dipilih (3), manakala penyebut mewakili jumlah semua objek (8).',
    keyConceptRemember:
      'Pengangka menunjukkan bahagian yang dipilih, manakala penyebut menunjukkan jumlah semua bahagian!',
    commonMistake:
      'Murid kerap tersilap menulis 3/5 kerana membandingkan 3 epal merah dengan 5 epal baki yang bukan merah, bukannya jumlah keseluruhan epal.',
    optionMisconceptions: {
      B: 'Memilih pecahan epal yang bukan merah (5/8), sedangkan soalan meminta epal merah.',
      C: 'Membandingkan 3 epal merah dengan 5 epal baki (3/5). Ingat, penyebut mesti jumlah SEMUA epal iaitu 8!',
      D: 'Terbalik meletakkan nombor. Penyebut 8 diletak di atas dan pengangka 3 diletak di bawah.',
    },
    speechScript:
      'Hai kawan-kawan! Jawapan yang betul ialah pilihan A, tiga per lapan. Mari kita fahami soalan ini: Kita ada lapan biji epal kesemuanya, dan tiga daripadanya berwarna merah. Langkah satu: Apakah penyebutnya? Kira semua epal, ada lapan. Jadi penyebut di bawah ialah lapan. Langkah dua: Kira epal merah, ada tiga biji. Jadi pengangka di atas ialah tiga. Langkah tiga: Gabungkan keduanya menjadi tiga per lapan. Ingat! Pengangka ialah bahagian yang dipilih, penyebut ialah jumlah semua bahagian.',
  },

  // --------------------------------------------------------------------------
  // Q02: Ada 6 biji bola. 2 biji berwarna biru. Apakah pecahan bola biru?
  // --------------------------------------------------------------------------
  CLASS_Q02: {
    questionId: 'CLASS_Q02',
    dskpCode: '3.1.1',
    topicTitle: 'Pecahan Kumpulan Objek',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [B] — 2/6.',
    correctAnswerLetter: 'B',
    correctAnswerValue: '2/6',
    understandQuestion:
      'Soalan ini meminta kita menentukan nilai pecahan bola berwarna biru daripada sejumlah 6 biji bola.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya?',
        title: 'Kira Jumlah Keseluruhan Bola',
        detail: 'Kira semua bola dalam kumpulan: 2 bola biru + 4 bola putih = 6 bola kesemuanya. Jadi, penyebut ialah 6.',
        mathExpression: 'Penyebut = 6',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Berapa bilangan bola biru yang dipilih?',
        title: 'Kira Bola Berwarna Biru',
        detail: 'Terdapat 2 biji bola biru yang ditanyakan. Jadi, pengangka ialah 2.',
        mathExpression: 'Pengangka = 2',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tuliskan pecahan kumpulan:',
        title: 'Gabungkan Pengangka dan Penyebut',
        detail: '2 daripada 6 bola ditulis sebagai pecahan wajar 2/6 (dua per enam).',
        mathExpression: '2 daripada 6 = 2/6',
      },
    ],
    whyReason:
      '2 biji bola biru daripada sejumlah 6 biji bola membentuk pecahan 2/6. Nombor bawah sentiasa mewakili kumpulan penuh objek.',
    keyConceptRemember:
      'Nombor bawah (penyebut) ialah jumlah SEMUA objek dalam kumpulan, bukan baki objek warna lain!',
    commonMistake:
      'Murid kerap memilih 2/4 kerana mengasingkan 2 bola biru dan 4 bola putih secara berasingan tanpa mencampurkannya menjadi 6.',
    optionMisconceptions: {
      A: 'Memilih 4/6 iaitu pecahan bola bukan biru, bukannya bola biru.',
      C: 'Mengira 2 bola biru dan 4 bola warna lain lalu menulis 2/4. Ingat, penyebut mesti jumlah SEMUA bola iaitu 6!',
      D: 'Terbalik menulis nombor iaitu 6/2.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan B, dua per enam. Mari kita fahami soalan: Kita mahu cari pecahan bola biru. Langkah satu: Berapa semua bola? Ada enam biji bola kesemuanya, jadi penyebut ialah enam. Langkah dua: Berapa bola biru? Ada dua biji bola biru, jadi pengangka ialah dua. Langkah tiga: Tuliskan dua per enam. Ingat kawan-kawan, nombor bawah ialah jumlah semua objek dalam kumpulan!',
  },

  // --------------------------------------------------------------------------
  // Q03: Mana satu pecahan setara bagi 1/2?
  // --------------------------------------------------------------------------
  CLASS_Q03: {
    questionId: 'CLASS_Q03',
    dskpCode: '3.1.2',
    topicTitle: 'Pecahan Setara',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [C] — 2/4.',
    correctAnswerLetter: 'C',
    correctAnswerValue: '2/4',
    understandQuestion:
      'Soalan ini meminta kita mencari pecahan yang sama saiz dan nilai dengan satu perdua (1/2).',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah nilai pecahan asal?',
        title: 'Kenal Pasti Pecahan 1/2',
        detail: 'Pecahan 1/2 mewakili tepat separuh daripada satu bentuk keseluruhan.',
        mathExpression: 'Pecahan Asal = 1/2',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana membina pecahan setara?',
        title: 'Darab Pengangka dan Penyebut Dengan Nombor Yang Sama',
        detail: 'Kita darabkan pengangka dan penyebut dengan nombor 2: 1 × 2 = 2, dan 2 × 2 = 4.',
        mathExpression: '(1 × 2) / (2 × 2) = 2/4',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Bandingkan nilai kedua-dua pecahan:',
        title: 'Semak Saiz Bahagian',
        detail: '1 keping daripada 2 bahagian mempunyai saiz luas yang sama persis dengan 2 keping daripada 4 bahagian (2/4).',
        mathExpression: '1/2 = 2/4',
      },
    ],
    whyReason:
      '1/2 dan 2/4 mempunyai nilai yang sama kerana kedua-duanya mewakili tepat separuh daripada keseluruhan bentuk.',
    keyConceptRemember:
      'Pecahan setara mempunyai nilai yang sama walaupun pengangka dan penyebut berbeza nombornya!',
    commonMistake:
      'Murid kerap keliru memilih 1/4 kerana melihat pengangkanya sama-sama 1. Ingat, 1/4 hanya suku dan lebih kecil daripada separuh (1/2).',
    optionMisconceptions: {
      A: 'Menyangka 1/4 setara kerana pengangka sama 1. Sebenarnya 1/4 hanyalah suku bahagian dan bernilai separuh daripada 1/2.',
      B: 'Memilih 3/4 yang bernilai tiga suku, lebih besar daripada separuh (1/2).',
      D: 'Memilih 2/3 yang bernilai dua pertiga dan tidak setara dengan separuh.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan C, dua per empat. Soalan ini meminta kita mencari pecahan setara bagi satu perdua. Langkah satu: Lihat pecahan satu perdua yang mewakili separuh. Langkah dua: Kita darab pengangka dan penyebut dengan nombor dua. Satu darab dua dapat dua, dua darab dua dapat empat. Hasilnya dua per empat. Ingat! Pecahan setara mempunyai nilai yang sama besar walaupun nombornya berbeza.',
  },

  // --------------------------------------------------------------------------
  // Q04: Pecahan 1/4 bersamaan dengan berapa peratus?
  // --------------------------------------------------------------------------
  CLASS_Q04: {
    questionId: 'CLASS_Q04',
    dskpCode: '3.1.3',
    topicTitle: 'Hubungan Pecahan dan Peratus',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [D] — 25%.',
    correctAnswerLetter: 'D',
    correctAnswerValue: '25%',
    understandQuestion:
      'Soalan ini meminta kita menukarkan nilai pecahan suku (1/4) kepada nilai peratusan daripada 100%.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Berapakah nilai satu keseluruhan dalam peratus?',
        title: 'Fahami Nilai 1 Keseluruhan',
        detail: 'Satu bentuk penuh lengkap mewakili 100 peratus (100%).',
        mathExpression: '1 Keseluruhan = 100%',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Berapa bahagian pecahan 1/4 dibahagikan?',
        title: 'Bahagikan 100% Kepada 4 Bahagian Sama Banyak',
        detail: 'Kerana penyebut ialah 4, kita bahagikan 100% kepada 4 bahagian: 100 ÷ 4 = 25.',
        mathExpression: '100% ÷ 4 = 25%',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Berapakah nilai 1 bahagian suku?',
        title: 'Tentukan Peratusan Suku',
        detail: 'Setiap 1 bahagian daripada 4 bahagian bernilai 25%. Jadi, 1/4 bersamaan 25%.',
        mathExpression: '1/4 = 25%',
      },
    ],
    whyReason:
      'Kerana pecahan 1/4 mewakili satu perempat daripada 100 petak seratus, iaitu tepat 25 petak berlorek atau 25%.',
    keyConceptRemember:
      'Satu keseluruhan ialah 100%. Jadi 1/4 = 25%, 1/2 = 50%, dan 3/4 = 75%!',
    commonMistake:
      'Murid kerap tersilap memilih 10% kerana melihat angka 1 atau keliru dengan pecahan satu persepuluh (1/10).',
    optionMisconceptions: {
      A: 'Memilih 50%. 50% ialah separuh (1/2), bukan suku (1/4).',
      B: 'Memilih 75%. 75% ialah tiga suku (3/4), bukan satu suku (1/4).',
      C: 'Keliru memilih 10%. Pecahan yang bersamaan 10% ialah 1/10, bukan 1/4.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan D, dua puluh lima peratus. Kita mahu menukar satu per empat kepada peratus. Langkah satu: Satu keseluruhan penuh ialah seratus peratus. Langkah dua: Bahagikan seratus peratus kepada empat bahagian sama rata. Seratus bahagi empat ialah dua puluh lima. Langkah tiga: Jadi satu bahagian bernilai dua puluh lima peratus. Ingat! Satu per empat sentiasa bersamaan dua puluh lima peratus.',
  },

  // --------------------------------------------------------------------------
  // Q05: Mana satu pecahan setara bagi 2/3?
  // --------------------------------------------------------------------------
  CLASS_Q05: {
    questionId: 'CLASS_Q05',
    dskpCode: '3.1.2',
    topicTitle: 'Pecahan Setara',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [A] — 4/6.',
    correctAnswerLetter: 'A',
    correctAnswerValue: '4/6',
    understandQuestion:
      'Soalan ini meminta kita mencari pecahan setara yang mempunyai nilai yang sama dengan dua pertiga (2/3).',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah nombor pengangka dan penyebut asal?',
        title: 'Kenal Pasti Pecahan 2/3',
        detail: 'Pecahan asal mempunyai pengangka 2 dan penyebut 3.',
        mathExpression: 'Pecahan Asal = 2/3',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Apakah operasi untuk membina pecahan setara?',
        title: 'Darab Pengangka dan Penyebut Dengan Nombor 2',
        detail: 'Kita darabkan kedua-dua nombor atas dan bawah dengan 2: 2 × 2 = 4, dan 3 × 2 = 6.',
        mathExpression: '(2 × 2) / (3 × 2) = 4/6',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Bandingkan nilai pecahan baharu:',
        title: 'Sahkan Kesetaraan',
        detail: 'Pecahan 4/6 mempunyai nilai dan luas kawasan berlorek yang sama persis dengan 2/3.',
        mathExpression: '2/3 = 4/6',
      },
    ],
    whyReason:
      'Apabila kita mendarabkan kedua-dua pengangka dan penyebut dengan nombor yang sama (iaitu 2), nisbah nilainya kekal sama besar.',
    keyConceptRemember:
      'Untuk mencari pecahan setara, darab pengangka dan penyebut dengan nombor yang sama!',
    commonMistake:
      'Murid kerap memilih 2/6 kerana hanya mendarab nombor bawah dengan 2 tetapi terlupa mendarab nombor atas.',
    optionMisconceptions: {
      B: 'Hanya mendarab penyebut 3 × 2 = 6, tetapi membiarkan pengangka kekal 2 (menjadi 2/6). Nilai ini separuh lebih kecil!',
      C: 'Memilih 3/6. Pecahan 3/6 ialah separuh (1/2), bukan setara dengan 2/3.',
      D: 'Menambah nombor melulu seperti 2+3 atau 5/6, bukannya mendarab.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan A, empat per enam. Mari kita fahami soalan: Kita mahu cari pecahan setara bagi dua pertiga. Langkah satu: Pengangka ialah dua dan penyebut ialah tiga. Langkah dua: Darabkan atas dan bawah dengan nombor dua. Dua darab dua dapat empat, tiga darab dua dapat enam. Hasilnya empat per enam. Ingat! Bila mendarab penyebut, pengangka juga wajib didarab dengan nombor yang sama.',
  },

  // --------------------------------------------------------------------------
  // Q06: Tukar 2/4 kepada bentuk termudah:
  // --------------------------------------------------------------------------
  CLASS_Q06: {
    questionId: 'CLASS_Q06',
    dskpCode: '3.1.4',
    topicTitle: 'Bentuk Termudah',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [B] — 1/2.',
    correctAnswerLetter: 'B',
    correctAnswerValue: '1/2',
    understandQuestion:
      'Soalan ini meminta kita mempermudahkan pecahan 2/4 kepada pecahan yang paling ringkas.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah sifir yang mengandungi nombor 2 dan 4?',
        title: 'Cari Sifir Pembahagi Sepunya',
        detail: 'Kedua-dua nombor 2 dan 4 ada di dalam sifir 2. Jadi, kita boleh bahagikan dengan 2.',
        mathExpression: 'Sifir 2: 2 dan 4',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana kita mempermudahkan pecahan?',
        title: 'Bahagi Pengangka dan Penyebut Dengan 2',
        detail: 'Bahagi nombor atas: 2 ÷ 2 = 1. Bahagi nombor bawah: 4 ÷ 2 = 2.',
        mathExpression: '(2 ÷ 2) / (4 ÷ 2) = 1/2',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Adakah 1/2 boleh dibahagi lagi?',
        title: 'Semak Bentuk Termudah',
        detail: 'Nombor 1 dan 2 tidak boleh dibahagikan lagi. Maka 1/2 ialah bentuk paling mudah.',
        mathExpression: 'Bentuk Termudah = 1/2',
      },
    ],
    whyReason:
      '2 keping daripada 4 bahagian mewakili tepat separuh (1/2) daripada satu bulatan atau rajah penuh.',
    keyConceptRemember:
      'Mempermudahkan pecahan sentiasa menggunakan operasi BAHAGI pada nombor atas dan nombor bawah!',
    commonMistake:
      'Murid melakukan operasi tolak (4 − 2 = 2) lalu keliru memilih 2/2 atau 1/4.',
    optionMisconceptions: {
      A: 'Hanya membahagi nombor atas (2 ÷ 2 = 1) tetapi membiarkan penyebut 4 tidak dibahagi.',
      C: 'Menganggap jawapannya 2/2. Pecahan 2/2 bernilai 1 penuh, bukan separuh.',
      D: 'Memilih pecahan lain yang tidak berkaitan iaitu 3/4.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan B, satu perdua. Mari kita permudahkan pecahan dua per empat. Langkah satu: Nombor dua dan empat ada dalam sifir dua. Langkah dua: Bahagikan nombor atas dan bawah dengan dua. Dua bahagi dua dapat satu, empat bahagi dua dapat dua. Jawapan termudah ialah satu perdua. Ingat! Mempermudahkan pecahan sentiasa menggunakan operasi bahagi.',
  },

  // --------------------------------------------------------------------------
  // Q07: Tukar 3/6 kepada bentuk termudah:
  // --------------------------------------------------------------------------
  CLASS_Q07: {
    questionId: 'CLASS_Q07',
    dskpCode: '3.1.4',
    topicTitle: 'Bentuk Termudah',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [C] — 1/2.',
    correctAnswerLetter: 'C',
    correctAnswerValue: '1/2',
    understandQuestion:
      'Soalan ini meminta kita menukarkan pecahan 3/6 kepada bentuk yang paling ringkas menggunakan operasi bahagi.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah sifir yang mempunyai nombor 3 dan 6?',
        title: 'Kenal Pasti Sifir 3',
        detail: 'Nombor 3 dan 6 kedua-duanya ada dalam sifir 3. Jadi kita bahagi dengan 3.',
        mathExpression: 'Sifir 3: 3 dan 6',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bahagikan atas dan bawah:',
        title: 'Bahagi Pengangka dan Penyebut Dengan 3',
        detail: 'Bahagi nombor atas: 3 ÷ 3 = 1. Bahagi nombor bawah: 6 ÷ 3 = 2.',
        mathExpression: '(3 ÷ 3) / (6 ÷ 3) = 1/2',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Apakah pecahan termudahnya?',
        title: 'Tuliskan Bentuk Termudah',
        detail: 'Hasil akhirnya ialah 1/2 (satu perdua) yang tidak boleh dipermudahkan lagi.',
        mathExpression: '3/6 = 1/2',
      },
    ],
    whyReason:
      'Kerana 3 ialah separuh tepat daripada 6. Oleh itu, kawasan 3 daripada 6 bahagian bernilai tepat separuh (1/2).',
    keyConceptRemember:
      'Jika nombor pengangka ialah separuh tepat daripada penyebut, bentuk termudahnya PASTI 1/2!',
    commonMistake:
      'Murid kerap memilih 1/3 kerana melihat digit 3 pada soalan lalu meletakkannya sebagai penyebut.',
    optionMisconceptions: {
      A: 'Keliru meletakkan nombor pembahagi 3 sebagai penyebut lalu memilih 1/3. Ingat, 6 ÷ 3 = 2, jadi penyebut ialah 2!',
      B: 'Tersilap mengira hasil bahagi 6 ÷ 3 = 2 diletakkan di atas (2/3).',
      D: 'Hanya menukar nombor atas kepada 1 tanpa membahagi penyebut 6.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan C, satu perdua. Kita mahu permudahkan tiga per enam. Langkah satu: Nombor tiga dan enam ada dalam sifir tiga. Langkah dua: Bahagikan atas dan bawah dengan nombor tiga. Tiga bahagi tiga dapat satu, enam bahagi tiga dapat dua. Hasilnya satu perdua. Ingat! Tiga ialah separuh daripada enam, jadi bentuk termudahnya ialah satu perdua.',
  },

  // --------------------------------------------------------------------------
  // Q08: Hitungkan: 2/7 + 3/7 = ?
  // --------------------------------------------------------------------------
  CLASS_Q08: {
    questionId: 'CLASS_Q08',
    dskpCode: '3.1.5',
    topicTitle: 'Tambah Pecahan Sama Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [D] — 5/7.',
    correctAnswerLetter: 'D',
    correctAnswerValue: '5/7',
    understandQuestion:
      'Soalan ini meminta kita menambah dua pecahan wajar yang mempunyai penyebut yang sama iaitu 7.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya? Adakah kedua-dua pecahan mempunyai penyebut yang sama?',
        title: 'Semak Nombor Penyebut',
        detail: 'Kedua-dua pecahan mempunyai penyebut yang sama, iaitu 7. Jadi saiz bahagian sudah seragam.',
        mathExpression: 'Penyebut Sama = 7',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Apakah yang perlu ditambah?',
        title: 'Kekalkan Penyebut dan Tambah Pengangka',
        detail: 'Kekalkan penyebut 7 di bawah, dan tambah nombor atas sahaja: 2 + 3 = 5.',
        mathExpression: '2 + 3 = 5 (Pengangka Baharu)',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tuliskan hasil tambah pecahan:',
        title: 'Gabungkan Pengangka Baharu dan Penyebut Kekal',
        detail: 'Hasil tambahnya ialah 5/7 (lima per tujuh).',
        mathExpression: '2/7 + 3/7 = 5/7',
      },
    ],
    whyReason:
      'Kerana saiz setiap bahagian tetap sama (kepingan per tujuh). Kita cuma mengumpulkan 2 kepingan bersama 3 kepingan menjadi 5 kepingan per tujuh.',
    keyConceptRemember:
      'Apabila penyebut sudah sama, KEKALKAN penyebut di bawah dan tambah pengangka di atas sahaja!',
    commonMistake:
      'Jangan tambah penyebut! Murid kerap tersilap menambah kedua-dua nombor atas dan bawah: 2 + 3 = 5 dan 7 + 7 = 14 lalu menjawab 5/14.',
    optionMisconceptions: {
      A: 'Menambah nombor atas DAN nombor bawah (2+3=5, 7+7=14). Ingat, penyebut tidak boleh ditambah!',
      B: 'Melakukan operasi tolak (3 − 2 = 1) bukannya operasi tambah.',
      C: 'Mendarab nombor atas (2 × 3 = 6) bukannya menambah (2 + 3 = 5).',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan D, lima per tujuh. Mari kita fahami cara menambah pecahan ini. Langkah satu: Apakah penyebutnya? Kedua-dua pecahan mempunyai penyebut yang sama iaitu tujuh. Langkah dua: Kekalkan penyebut tujuh dan tambah nombor atas sahaja, dua tambah tiga dapat lima. Langkah tiga: Tuliskan lima per tujuh. Ingat! Jangan tambah penyebut, tambah nombor atas sahaja.',
  },

  // --------------------------------------------------------------------------
  // Q09: Hitungkan: 6/8 − 2/8 = ?
  // --------------------------------------------------------------------------
  CLASS_Q09: {
    questionId: 'CLASS_Q09',
    dskpCode: '3.1.6',
    topicTitle: 'Tolak Pecahan Sama Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [A] — 4/8.',
    correctAnswerLetter: 'A',
    correctAnswerValue: '4/8',
    understandQuestion:
      'Soalan ini meminta kita menolak dua pecahan yang mempunyai penyebut yang sama iaitu 8.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya? Adakah penyebutnya sama?',
        title: 'Semak Penyebut Pecahan',
        detail: 'Kedua-dua pecahan mempunyai penyebut 8 yang sama. Saiz kepingan adalah sama.',
        mathExpression: 'Penyebut Sama = 8',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Apakah yang perlu ditolak?',
        title: 'Kekalkan Penyebut dan Tolak Pengangka',
        detail: 'Kekalkan penyebut 8 di bawah, dan tolak nombor atas sahaja: 6 − 2 = 4.',
        mathExpression: '6 − 2 = 4 (Pengangka Baharu)',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tuliskan baki pecahan:',
        title: 'Tuliskan Jawapan Baki',
        detail: 'Gabungkan pengangka 4 dengan penyebut kekal 8: 4/8 (empat per lapan).',
        mathExpression: '6/8 − 2/8 = 4/8',
      },
    ],
    whyReason:
      'Daripada 6 kepingan bersaiz perlapan, kita keluarkan 2 kepingan. Baki kepingan yang tinggal ialah tepat 4 kepingan perlapan (4/8).',
    keyConceptRemember:
      'Apabila penyebut sama, tolak nombor atas sahaja. Penyebut TIDAK BOLEH ditolak!',
    commonMistake:
      'Murid kerap menolak penyebut (8 − 8 = 0) lalu menulis 4/0, iaitu pecahan yang tidak wujud dalam matematik.',
    optionMisconceptions: {
      B: 'Tersilap menambah nombor atas (6 + 2 = 8) menjadi 8/8 bukannya menolak.',
      C: 'Menolak penyebut (8 − 8 = 0) lalu menulis 4/0. Ingat, penyebut menunjukkan saiz bahagian dan tidak boleh ditolak!',
      D: 'Kesilapan congak nombor atas (tersilap kira 6 − 2 = 3).',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan A, empat per lapan. Mari kita tolak pecahan ini. Langkah satu: Kedua-dua pecahan mempunyai penyebut yang sama iaitu lapan. Langkah dua: Kekalkan penyebut lapan dan tolak nombor atas sahaja. Enam tolak dua dapat empat. Langkah tiga: Hasilnya ialah empat per lapan. Ingat! Penyebut tidak boleh ditolak, tolak nombor atas sahaja.',
  },

  // --------------------------------------------------------------------------
  // Q10: Rajah menunjukkan 1 bahagian penuh dan 1/4 bahagian. Apakah nombor bercampurnya?
  // --------------------------------------------------------------------------
  CLASS_Q10: {
    questionId: 'CLASS_Q10',
    dskpCode: '3.1.7',
    topicTitle: 'Nombor Bercampur',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [B] — 1 1/4.',
    correctAnswerLetter: 'B',
    correctAnswerValue: '1 1/4',
    understandQuestion:
      'Soalan ini meminta kita menulis gabungan objek penuh dan baki bahagian pecahan sebagai satu nombor bercampur.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Berapa objek penuh yang berlorek lengkap?',
        title: 'Kira Nombor Bulat (Penuh)',
        detail: 'Ada 1 bulatan yang berlorek penuh. Jadi nombor bulat di hadapan ialah 1.',
        mathExpression: 'Nombor Bulat = 1',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Berapa pecahan pada objek sebelah?',
        title: 'Kira Bahagian Pecahan Wajar',
        detail: 'Pada bulatan kedua, ada 1 daripada 4 bahagian yang berlorek. Jadi pecahannya ialah 1/4.',
        mathExpression: 'Pecahan = 1/4',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Bagaimana menulis nombor bercampur?',
        title: 'Tulis Nombor Bulat dan Pecahan Bersama',
        detail: 'Tulis nombor bulat 1 di hadapan diikuti pecahan wajar 1/4 di sebelahnya: 1 1/4 (satu, satu per empat).',
        mathExpression: '1 + 1/4 = 1 1/4',
      },
    ],
    whyReason:
      'Satu keseluruhan penuh dicantumkan dengan pecahan satu suku ditulis sebagai nombor bercampur 1 1/4.',
    keyConceptRemember:
      'Nombor bercampur terdiri daripada Nombor Bulat di hadapan dan Pecahan Wajar di sebelahnya!',
    commonMistake:
      'Murid keliru antara pecahan tak wajar (5/4) dengan nombor bercampur (1 1/4), atau tersilap mengira ada 2 bulatan penuh.',
    optionMisconceptions: {
      A: 'Mengira bulatan kedua sebagai satu lagi bulatan penuh lalu menulis 2 1/4.',
      C: 'Mengira 3 bahagian yang TIDAK berlorek bukannya 1 bahagian yang berlorek lalu memilih 1 3/4.',
      D: 'Menulis sebagai pecahan tak wajar 5/4 bukannya bentuk nombor bercampur yang diminta soalan.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan B, satu, satu per empat. Mari kita lihat rajah ini. Langkah satu: Kira objek penuh. Ada satu bulatan penuh, jadi nombor bulat ialah satu. Langkah dua: Kira bahagian pecahan di sebelahnya. Ada satu daripada empat bahagian berlorek, iaitu satu per empat. Langkah tiga: Tulis nombor bulat dan pecahan bersama menjadi satu, satu per empat. Ingat! Nombor bercampur ada nombor bulat dan pecahan wajar di sebelahnya.',
  },

  // --------------------------------------------------------------------------
  // Q11: Hitungkan: 1/2 + 1/4 = ?
  // --------------------------------------------------------------------------
  CLASS_Q11: {
    questionId: 'CLASS_Q11',
    dskpCode: '3.1.5',
    topicTitle: 'Tambah Pecahan Berbeza Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [C] — 3/4.',
    correctAnswerLetter: 'C',
    correctAnswerValue: '3/4',
    understandQuestion:
      'Soalan ini meminta kita menambah dua pecahan wajar yang mempunyai penyebut berbeza iaitu 2 dan 4.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Adakah penyebutnya sama? Apakah penyebutnya?',
        title: 'Kenal Pasti Penyebut Tidak Sama',
        detail: 'Penyebut pecahan pertama ialah 2, manakala penyebut pecahan kedua ialah 4. Kita mesti samakan penyebut dahulu!',
        mathExpression: 'Penyebut: 2 dan 4 (Tidak Sama)',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana menyamakan penyebut?',
        title: 'Tukar 1/2 Kepada Penyebut 4 Menggunakan Darab',
        detail: 'Darab pengangka dan penyebut 1/2 dengan 2: 1 × 2 = 2, dan 2 × 2 = 4. Pecahan 1/2 bertukar menjadi 2/4.',
        mathExpression: '(1 × 2) / (2 × 2) = 2/4',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Sekarang penyebut sudah sama, apa perlu kita buat?',
        title: 'Tambah Pengangka Sahaja',
        detail: 'Kedua-dua pecahan kini mempunyai penyebut 4. Kekalkan penyebut 4 dan tambah pengangka: 2/4 + 1/4 = 3/4 (2 + 1 = 3).',
        mathExpression: '2/4 + 1/4 = 3/4',
      },
    ],
    whyReason:
      'Kita tidak boleh menambah kepingan yang berlainan saiz. Selepas 1/2 ditukar kepada 2 suku (2/4), 2 suku ditambah 1 suku menghasilkan tepat 3 suku (3/4).',
    keyConceptRemember:
      'Wajib samakan penyebut terlebih dahulu sebelum menambah pecahan!',
    commonMistake:
      'Murid kerap terus menambah nombor atas dan bawah melulu: 1 + 1 = 2 dan 2 + 4 = 6 lalu memilih 2/6. Ini salah kerana penyebut belum sama!',
    optionMisconceptions: {
      A: 'Menambah terus atas dan bawah tanpa menyamakan penyebut (1+1=2, 2+4=6). Ingat, jangan tambah jika saiz penyebut berbeza!',
      B: 'Hanya menukar 1/2 kepada 2/4 tetapi terlupa menambah 1/4 yang kedua.',
      D: 'Hanya mengambil pecahan kedua 1/4 tanpa melakukan operasi tambah.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan C, tiga per empat. Mari kita lihat caranya. Langkah satu: Penyebut tidak sama iaitu dua dan empat. Kita mesti samakan penyebut dahulu. Langkah dua: Tukar satu perdua kepada penyebut empat dengan mendarab dua. Satu perdua menjadi dua per empat. Langkah tiga: Tambah nombor atas dengan penyebut empat yang sama. Dua per empat tambah satu per empat dapat tiga per empat. Ingat! Samakan penyebut dahulu sebelum menambah pecahan.',
  },

  // --------------------------------------------------------------------------
  // Q12: Hitungkan: 1/3 + 2/9 = ?
  // --------------------------------------------------------------------------
  CLASS_Q12: {
    questionId: 'CLASS_Q12',
    dskpCode: '3.1.5',
    topicTitle: 'Tambah Pecahan Berbeza Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [D] — 5/9.',
    correctAnswerLetter: 'D',
    correctAnswerValue: '5/9',
    understandQuestion:
      'Soalan ini meminta kita menambah pecahan 1/3 dan 2/9 yang mempunyai penyebut berbeza (3 dan 9).',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya? Bolehkah penyebut 3 ditukar menjadi 9?',
        title: 'Kenal Pasti Sifir Penyebut',
        detail: 'Penyebutnya 3 dan 9. Dalam sifir 3, ada nombor 9 kerana 3 × 3 = 9.',
        mathExpression: '3 × 3 = 9',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana menukar pecahan 1/3?',
        title: 'Tukar 1/3 Kepada Penyebut 9',
        detail: 'Darab nombor atas dan nombor bawah dengan 3: (1 × 3) / (3 × 3) = 3/9.',
        mathExpression: '(1 × 3) / (3 × 3) = 3/9',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tambah kedua-dua pecahan:',
        title: 'Kekalkan Penyebut 9 dan Tambah Pengangka',
        detail: 'Kedua-dua pecahan kini berpenyebut 9: 3/9 + 2/9 = 5/9 (3 + 2 = 5).',
        mathExpression: '3/9 + 2/9 = 5/9',
      },
    ],
    whyReason:
      '1/3 bersamaan dengan 3 bahagian persembilan (3/9). Apabila 3 bahagian ditambah dengan 2 bahagian, jumlahnya ialah 5 bahagian daripada 9 (5/9).',
    keyConceptRemember:
      'Tukar penyebut yang kecil kepada penyebut yang besar menggunakan sifir sebelum menambah!',
    commonMistake:
      'Murid kerap menambah terus tanpa menyamakan penyebut: 1 + 2 = 3 dan 3 + 9 = 12 lalu memilih 3/12.',
    optionMisconceptions: {
      A: 'Menambah melulu atas dan bawah tanpa menyamakan penyebut (1+2=3, 3+9=12).',
      B: 'Hanya menukar 1/3 menjadi 3/9 tetapi terlupa menambah 2/9.',
      C: 'Kesilapan congak nombor atas.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan D, lima per sembilan. Mari kita selesaikan soalan ini. Langkah satu: Penyebutnya tiga dan sembilan, jadi kita samakan penyebut. Langkah dua: Tukar satu pertiga kepada penyebut sembilan dengan mendarab tiga. Satu darab tiga dapat tiga, tiga darab tiga dapat sembilan, menjadi tiga per sembilan. Langkah tiga: Tambahkan tiga per sembilan dengan dua per sembilan dapat lima per sembilan. Ingat! Samakan penyebut sebelum menambah pecahan.',
  },

  // --------------------------------------------------------------------------
  // Q13: Hitungkan: 3/4 − 1/2 = ?
  // --------------------------------------------------------------------------
  CLASS_Q13: {
    questionId: 'CLASS_Q13',
    dskpCode: '3.1.6',
    topicTitle: 'Tolak Pecahan Berbeza Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [A] — 1/4.',
    correctAnswerLetter: 'A',
    correctAnswerValue: '1/4',
    understandQuestion:
      'Soalan ini meminta kita menolak pecahan 1/2 daripada 3/4 di mana penyebutnya tidak sama (4 dan 2).',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah penyebutnya? Adakah penyebutnya sama?',
        title: 'Kenal Pasti Penyebut 4 dan 2',
        detail: 'Penyebutnya 4 dan 2 tidak sama. Kita mesti menukar penyebut 2 kepada 4 dahulu.',
        mathExpression: 'Penyebut: 4 dan 2 (Perlu Disamakan)',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana menukar 1/2 kepada penyebut 4?',
        title: 'Tukar 1/2 Kepada Penyebut 4 Menggunakan Darab',
        detail: 'Darab pengangka dan penyebut 1/2 dengan 2: 1 × 2 = 2, dan 2 × 2 = 4 (menjadi 2/4).',
        mathExpression: '(1 × 2) / (2 × 2) = 2/4',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tolak pengangka selepas penyebut sama:',
        title: 'Kekalkan Penyebut 4 dan Tolak Pengangka',
        detail: 'Tolak nombor atas: 3/4 − 2/4 = 1/4 (3 − 2 = 1).',
        mathExpression: '3/4 − 2/4 = 1/4',
      },
    ],
    whyReason:
      '3 kepingan suku (3/4) ditolak dengan 2 kepingan suku (1/2 = 2/4) meninggalkan baki tepat 1 kepingan suku (1/4).',
    keyConceptRemember:
      'Wajib samakan penyebut terlebih dahulu sebelum menolak pecahan!',
    commonMistake:
      'Murid menolak terus nombor atas dan bawah melulu: 3 − 1 = 2 dan 4 − 2 = 2 lalu memilih 2/2 = 1. Penyebut tidak boleh ditolak!',
    optionMisconceptions: {
      B: 'Menolak terus nombor atas dan nombor bawah (3−1=2, 4−2=2). Ingat, penyebut tidak boleh ditolak!',
      C: 'Hanya menukar 1/2 kepada 2/4 dan tidak melakukan operasi tolak.',
      D: 'Kesilapan membandingkan pecahan.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan A, satu per empat. Mari kita tolak pecahan ini. Langkah satu: Penyebutnya empat dan dua tidak sama. Langkah dua: Tukar satu perdua kepada penyebut empat dengan mendarab dua. Satu perdua menjadi dua per empat. Langkah tiga: Sekarang tolak pengangka dengan penyebut empat yang sama. Tiga per empat tolak dua per empat dapat satu per empat. Ingat! Samakan penyebut dahulu sebelum menolak pecahan.',
  },

  // --------------------------------------------------------------------------
  // Q14: Hitungkan: 4/5 − 3/10 = ?
  // --------------------------------------------------------------------------
  CLASS_Q14: {
    questionId: 'CLASS_Q14',
    dskpCode: '3.1.6',
    topicTitle: 'Tolak Pecahan Berbeza Penyebut',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [B] — 5/10.',
    correctAnswerLetter: 'B',
    correctAnswerValue: '5/10',
    understandQuestion:
      'Soalan ini meminta kita menolak pecahan 3/10 daripada 4/5 yang berpenyebut 5 dan 10.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Bolehkah penyebut 5 ditukar menjadi 10?',
        title: 'Samakan Penyebut Kepada 10',
        detail: 'Dalam sifir 5, 5 × 2 = 10. Jadi kita tukar pecahan 4/5 kepada penyebut 10.',
        mathExpression: '5 × 2 = 10',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana mendarab pecahan 4/5?',
        title: 'Darab Atas dan Bawah Dengan 2',
        detail: 'Darabkan pengangka dan penyebut dengan 2: (4 × 2) / (5 × 2) = 8/10.',
        mathExpression: '(4 × 2) / (5 × 2) = 8/10',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Tolak nombor atas selepas penyebut sama:',
        title: 'Kekalkan Penyebut 10 dan Tolak Pengangka',
        detail: 'Kekalkan penyebut 10 dan tolak pengangka: 8/10 − 3/10 = 5/10 (8 − 3 = 5).',
        mathExpression: '8/10 − 3/10 = 5/10',
      },
    ],
    whyReason:
      '4/5 bersamaan 8 kepingan persepuluh. Apabila kita tolak 3 kepingan persepuluh, bakinya ialah 5 kepingan persepuluh (5/10).',
    keyConceptRemember:
      'Bila mendarab penyebut dengan 2, pengangka di atas juga WAJIB didarab dengan 2!',
    commonMistake:
      'Murid kerap terlupa mendarab pengangka dan hanya menukar penyebut 5 menjadi 10 (tersilap menulis 4/10 − 3/10 = 1/10).',
    optionMisconceptions: {
      A: 'Menolak terus nombor atas (4 − 3 = 1) dan mengekalkan penyebut 5 tanpa menyamakan penyebut.',
      C: 'Terlupa mendarab pengangka dengan 2 (tersilap kira 4/10 − 3/10 = 1/10).',
      D: 'Melakukan operasi tambah secara tidak sengaja.',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan B, lima per sepuluh. Mari kita fahami langkahnya. Langkah satu: Tukar penyebut lima kepada sepuluh dengan mendarab dua. Langkah dua: Darabkan empat darab dua dapat lapan, lima darab dua dapat sepuluh. Jadi empat per lima menjadi lapan per sepuluh. Langkah tiga: Tolak pengangka, lapan tolak tiga dapat lima. Jawapannya lima per sepuluh. Ingat! Bila darab penyebut, pengangka juga wajib didarab.',
  },

  // --------------------------------------------------------------------------
  // Q15: Tukar pecahan tak wajar 7/5 kepada nombor bercampur:
  // --------------------------------------------------------------------------
  CLASS_Q15: {
    questionId: 'CLASS_Q15',
    dskpCode: '3.1.7',
    topicTitle: 'Pecahan Tak Wajar Kepada Nombor Bercampur',
    correctAnswerBanner: 'Jawapan yang betul ialah Pilihan [C] — 1 2/5.',
    correctAnswerLetter: 'C',
    correctAnswerValue: '1 2/5',
    understandQuestion:
      'Soalan ini meminta kita menukarkan pecahan tak wajar 7/5 kepada bentuk nombor bercampur menggunakan operasi bahagi.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah maksud pecahan tak wajar 7/5?',
        title: 'Kenal Pasti Pengangka Lebih Besar Daripada Penyebut',
        detail: 'Nombor atas 7 lebih besar daripada nombor bawah 5. Ini bermakna ada lebih daripada 1 bentuk penuh.',
        mathExpression: '7/5 (7 > 5)',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana menukarnya menggunakan operasi bahagi?',
        title: 'Bahagi Pengangka 7 Dengan Penyebut 5',
        detail: '7 ÷ 5 = 1 (hasil bahagi), dengan baki 2 (kerana 1 × 5 = 5, baki 7 − 5 = 2).',
        mathExpression: '7 ÷ 5 = 1 baki 2',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        questionGuide: 'Bagaimana menyusun nombor bercampur?',
        title: 'Susun Hasil Bahagi, Baki, dan Penyebut',
        detail: 'Hasil bahagi 1 ialah nombor bulat, baki 2 ialah pengangka di atas, dan penyebut 5 kekal di bawah: 1 2/5.',
        mathExpression: 'Hasil Bahagi 1, Baki 2, Penyebut 5 = 1 2/5',
      },
    ],
    whyReason:
      '5 kepingan perlima membentuk 1 bulatan penuh (5/5 = 1), dan terdapat baki lebihan 2 kepingan perlima (2/5). Maka nilainya ialah 1 2/5.',
    keyConceptRemember:
      'Hasil bahagi menjadi nombor bulat di hadapan, baki menjadi pengangka di atas, dan penyebut sentiasa KEKAL!',
    commonMistake:
      'Murid kerap tersilap mengira baki (tersangka 7 − 5 = 3 lalu memilih 1 3/5) atau terbalik meletakkan baki sebagai nombor bulat di tepi (2 1/5).',
    optionMisconceptions: {
      A: 'Tersilap mengira baki tolak (tersangka 7 − 5 = 3 lalu memilih 1 3/5).',
      B: 'Terbalik meletakkan baki 2 sebagai nombor bulat di tepi (2 1/5).',
      D: 'Tersilap mengira baki sebagai 1 (1 1/5).',
    },
    speechScript:
      'Jawapan yang betul ialah pilihan C, satu, dua perlima. Mari kita tukar pecahan tak wajar tujuh per lima. Langkah satu: Nombor atas tujuh lebih besar daripada nombor bawah lima. Langkah dua: Bahagikan tujuh dengan lima. Tujuh bahagi lima dapat satu, dan ada baki dua. Langkah tiga: Hasil bahagi satu ialah nombor bulat, baki dua ialah nombor atas, dan penyebut lima kekal di bawah. Jawapannya satu, dua perlima. Ingat! Hasil bahagi jadi nombor bulat, baki jadi pengangka di atas.',
  },
};

// ============================================================================
// DYNAMIC GENERATOR: Menjana penerangan berstruktur untuk sebarang soalan
// (Bebas Halusinasi, Menggunakan Nombor Sebenar Soalan)
// ============================================================================
export function generateDynamicAlyaExplanation(
  question: InteractiveClassQuestion
): Omit<AlyaQuestionExplanation, 'adaptiveClassInsight'> {
  const qText = question.question || '';
  const correctLetter = (question.correctAnswerLetter || 'A') as AnswerOption;
  const correctVal = question.correctAnswer || '';
  const dskp = question.dskpCode || '3.1';

  // 1. Soalan Tambah Pecahan
  if (qText.includes('+')) {
    const isSameDenom = !qText.includes('1/2 + 1/4') && !qText.includes('1/3 + 2/9');
    return {
      questionId: question.questionId,
      dskpCode: dskp,
      topicTitle: 'Operasi Tambah Pecahan',
      correctAnswerBanner: `Jawapan yang betul ialah Pilihan [${correctLetter}] — ${correctVal}.`,
      correctAnswerLetter: correctLetter,
      correctAnswerValue: correctVal,
      understandQuestion: `Soalan ini meminta kita menambah pecahan untuk mendapatkan jumlah keseluruhan: ${qText}.`,
      steps: [
        {
          stepNumber: 1,
          label: 'LANGKAH 1',
          questionGuide: 'Apakah penyebutnya? Adakah penyebutnya sama?',
          title: 'Kenal Pasti Penyebut',
          detail: isSameDenom
            ? 'Kedua-dua pecahan mempunyai penyebut yang sama. Saiz bahagian sudah seragam.'
            : 'Perhatikan penyebut kedua-dua pecahan. Jika penyebut berbeza, kita mesti samakan penyebut terlebih dahulu menggunakan darab.',
          mathExpression: qText,
        },
        {
          stepNumber: 2,
          label: 'LANGKAH 2',
          questionGuide: 'Apakah nombor yang perlu ditambah?',
          title: 'Kekalkan Penyebut dan Tambah Pengangka',
          detail: 'Kekalkan nilai penyebut yang seragam di bawah, dan tambahkan nilai pengangka di atas sahaja.',
          mathExpression: `Jawapan = ${correctVal}`,
        },
        {
          stepNumber: 3,
          label: 'LANGKAH 3',
          questionGuide: 'Adakah jawapan perlu dipermudahkan?',
          title: 'Semak Bentuk Pecahan Akhir',
          detail: `Hasil tambah pecahan ialah ${correctVal}. Semak sama ada jawapan berada dalam bentuk termudah.`,
          mathExpression: correctVal,
        },
      ],
      whyReason:
        'Penyebut mewakili saiz bahagian yang tidak berubah semasa penambahan. Kita hanya mengumpulkan bilangan bahagian (pengangka).',
      keyConceptRemember:
        'Apabila penyebut sama, kekalkan penyebut di bawah dan tambah pengangka di atas sahaja!',
      commonMistake:
        'Jangan tambah penyebut! Murid kerap menambah nombor bawah bersama-sama nombor atas.',
      speechScript: `Jawapan yang betul ialah pilihan ${correctLetter}, ${correctVal}. Dalam operasi tambah pecahan, kenal pasti penyebut dahulu. Jika penyebut sudah sama, kekalkan penyebut dan tambah nombor atas sahaja. Jawapannya ialah ${correctVal}.`,
    };
  }

  // 2. Soalan Tolak Pecahan
  if (qText.includes('−') || qText.includes('-')) {
    return {
      questionId: question.questionId,
      dskpCode: dskp,
      topicTitle: 'Operasi Tolak Pecahan',
      correctAnswerBanner: `Jawapan yang betul ialah Pilihan [${correctLetter}] — ${correctVal}.`,
      correctAnswerLetter: correctLetter,
      correctAnswerValue: correctVal,
      understandQuestion: `Soalan ini meminta kita menolak pecahan untuk mencari baki bahagian: ${qText}.`,
      steps: [
        {
          stepNumber: 1,
          label: 'LANGKAH 1',
          questionGuide: 'Apakah penyebutnya?',
          title: 'Kenal Pasti Penyebut',
          detail: 'Periksa penyebut pecahan. Pastikan penyebut sama sebelum menolak pengangka.',
          mathExpression: qText,
        },
        {
          stepNumber: 2,
          label: 'LANGKAH 2',
          questionGuide: 'Apakah nombor yang perlu ditolak?',
          title: 'Kekalkan Penyebut dan Tolak Pengangka',
          detail: 'Kekalkan penyebut di bawah dan tolakkan nombor pengangka di atas sahaja.',
          mathExpression: `Baki = ${correctVal}`,
        },
        {
          stepNumber: 3,
          label: 'LANGKAH 3',
          questionGuide: 'Tuliskan baki pecahan:',
          title: 'Tuliskan Jawapan Akhir',
          detail: `Baki bahagian yang tinggal ialah ${correctVal}.`,
          mathExpression: correctVal,
        },
      ],
      whyReason:
        'Kita hanya menolak bahagian yang dikeluarkan (pengangka). Saiz bahagian keseluruhan (penyebut) tetap kekal sama.',
      keyConceptRemember:
        'Tolak nombor atas sahaja apabila penyebut sama. Penyebut TIDAK BOLEH ditolak!',
      commonMistake:
        'Jangan tolak penyebut! Menolak penyebut yang sama menjadi sifar adalah kesilapan lazim murid.',
      speechScript: `Jawapan yang betul ialah pilihan ${correctLetter}, ${correctVal}. Untuk menolak pecahan, kekalkan nombor penyebut di bawah dan tolak nombor atas sahaja. Baki akhirnya ialah ${correctVal}.`,
    };
  }

  // 3. Fallback Umum yang Konkrit
  return {
    questionId: question.questionId,
    dskpCode: dskp,
    topicTitle: 'Konsep Pecahan Tahun 3',
    correctAnswerBanner: `Jawapan yang betul ialah Pilihan [${correctLetter}] — ${correctVal}.`,
    correctAnswerLetter: correctLetter,
    correctAnswerValue: correctVal,
    understandQuestion: `Soalan ini meminta kita memahami konsep pecahan: ${qText}.`,
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        questionGuide: 'Apakah yang ditanya dalam soalan?',
        title: 'Fahami Kehendak Soalan',
        detail: question.explanation || 'Kenal pasti maklumat yang diberikan dalam soalan dengan teliti.',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        questionGuide: 'Bagaimana mendapatkan jawapan?',
        title: 'Terapkan Kaedah Matematik',
        detail: `Pilihan jawapan yang tepat ialah ${correctVal}.`,
        mathExpression: correctVal,
      },
    ],
    whyReason: question.explanation || `Pilihan [${correctLetter}] iaitu ${correctVal} tepat dengan konsep matematik DSKP ${dskp}.`,
    keyConceptRemember: 'Sentiasa fahami maksud pengangka di atas dan penyebut di bawah dalam setiap konsep pecahan!',
    commonMistake: 'Baca soalan dengan teliti agar tidak terkeliru antara bahagian yang dipilih dengan baki bahagian.',
    speechScript: `Jawapan yang betul ialah pilihan ${correctLetter}, ${correctVal}. ${question.explanation || 'Bagus kawan-kawan, mari kita fahami konsep ini bersama-sama!'}`,
  };
}

// ============================================================================
// ENJIN KANDUNGAN UTAMA: getAlyaQuestionExplanation
// Menyambungkan data soalan dengan analitik data imbasan kelas sebenar
// ============================================================================
export function getAlyaQuestionExplanation(
  question: InteractiveClassQuestion,
  classStats?: ClassroomQuestionStats
): AlyaQuestionExplanation {
  // 1. Ambil data pedagogi statik jika ada dalam bank, atau jana secara dinamik
  const baseData =
    ALYA_PEDAGOGICAL_BANK[question.questionId] ||
    generateDynamicAlyaExplanation(question);

  // 2. Analisis Data Imbasan Kelas Sebenar (Item 14 Prompt: Adaptif Mengikut Kesalahan Kelas)
  let adaptiveClassInsight: AdaptiveClassMistakeInsight = {
    hasSignificantMistake: false,
  };

  if (classStats && classStats.totalAnswered >= 3) {
    const letters: AnswerOption[] = ['A', 'B', 'C', 'D'];
    const wrongLetters = letters.filter((l) => l !== baseData.correctAnswerLetter);

    // Cari pilihan salah yang paling banyak dipilih murid
    let highestWrongLetter: AnswerOption | null = null;
    let highestWrongCount = 0;

    wrongLetters.forEach((letter) => {
      const count = classStats.counts[letter] || 0;
      if (count > highestWrongCount) {
        highestWrongCount = count;
        highestWrongLetter = letter;
      }
    });

    // Syarat ketat: Ramai murid (sekurang-kurangnya 3 orang DAN sekurang-kurangnya 25% murid menjawab)
    const wrongPercentage =
      classStats.totalAnswered > 0
        ? Math.round((highestWrongCount / classStats.totalAnswered) * 100)
        : 0;

    if (highestWrongLetter && highestWrongCount >= 3 && wrongPercentage >= 25) {
      const optIdx = ['A', 'B', 'C', 'D'].indexOf(highestWrongLetter);
      const optText = question.options[optIdx] || highestWrongLetter;

      // Cari huraian salah faham yang khusus untuk pilihan ini
      const specificMisconception =
        baseData.optionMisconceptions?.[highestWrongLetter] ||
        `Pilihan [${highestWrongLetter}] kurang tepat kerana tidak menepati peraturan pecahan yang sedang dipelajari.`;

      adaptiveClassInsight = {
        hasSignificantMistake: true,
        wrongOptionLetter: highestWrongLetter,
        wrongOptionText: optText,
        wrongCount: highestWrongCount,
        wrongPercent: wrongPercentage,
        misconceptionExplanation: specificMisconception,
      };
    }
  }

  // 3. Gabungkan skrip audio dengan maklum balas kelas jika ada salah faham ketara
  let finalSpeechScript = baseData.speechScript;
  if (adaptiveClassInsight.hasSignificantMistake) {
    finalSpeechScript += ` Perhatian kelas, cikgu dapati ramai murid memilih pilihan ${adaptiveClassInsight.wrongOptionLetter}, ${adaptiveClassInsight.wrongOptionText}. Ingat! ${adaptiveClassInsight.misconceptionExplanation}`;
  }

  return {
    ...baseData,
    adaptiveClassInsight,
    speechScript: finalSpeechScript,
  };
}
