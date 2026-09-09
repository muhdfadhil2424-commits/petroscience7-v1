// Comprehensive Year-3 Friendly Explanation Data & Resolver for Alya Terangkan
import { InteractiveClassQuestion } from './interactiveClass30Questions';

export interface AlyaExplanationStep {
  stepNumber: number;
  label: string; // e.g. "LANGKAH 1"
  title: string;
  detail: string;
  mathExpression?: string; // e.g. "1/2 → 2/4" or "2/4 + 1/4"
  badgeColor?: string;
}

export interface AlyaQuestionExplanation {
  questionId: string;
  dskpCode: string;
  intro: string; // e.g. "Jom buat satu-satu! 😊"
  conceptNote: string;
  steps: AlyaExplanationStep[];
  conclusion: string; // e.g. "Jawapannya 3/4! 🎉"
  speechScript: string; // Tailored script for speech synthesis in proper Malay
}

export const ALYA_15_EXPLANATIONS: Record<string, AlyaQuestionExplanation> = {
  // Q01: 3.1.1 Epal Merah
  CLASS_Q01: {
    questionId: 'CLASS_Q01',
    dskpCode: '3.1.1',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Pecahan kumpulan objek: Pengangka di atas, penyebut di bawah.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Kira Jumlah Semua Objek',
        detail: 'Kira semua epal yang ada. Ada 8 biji epal kesemuanya.',
        mathExpression: 'Penyebut = 8',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Kira Epal Merah',
        detail: 'Kira epal berwarna merah yang ditanya. Ada 3 biji merah.',
        mathExpression: 'Pengangka = 3',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Tulis Pecahan',
        detail: 'Tulis 3 daripada 8 bahagian epal.',
        mathExpression: '3 daripada 8 = 3/8',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 3/8! 🎉 Pilihan [A].',
    speechScript:
      'Jom buat satu-satu! Pertama, kira semua epal dahulu. Ada lapan biji epal kesemuanya. Seterusnya kira epal merah, ada tiga biji. Tulis tiga daripada lapan bahagian. Jawapannya tiga per lapan! Pilihan A.',
  },

  // Q02: 3.1.1 Bola Biru
  CLASS_Q02: {
    questionId: 'CLASS_Q02',
    dskpCode: '3.1.1',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Kira bahagian dipilih berbanding jumlah keseluruhan bola.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Kira Jumlah Semua Bola',
        detail: 'Kira semua bola dalam kumpulan. Ada 6 biji bola.',
        mathExpression: 'Penyebut = 6',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Kira Bola Biru',
        detail: 'Kira bola yang berwarna biru. Ada 2 biji bola biru.',
        mathExpression: 'Pengangka = 2',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Tulis Pecahan',
        detail: 'Tulis 2 daripada 6 bola sebagai pecahan.',
        mathExpression: '2 daripada 6 = 2/6',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 2/6! 🌟 Pilihan [B].',
    speechScript:
      'Jom buat satu-satu! Kira semua bola, jumlahnya ada enam biji. Bola biru ada dua biji. Jadi, pecahan bola biru ialah dua per enam! Pilihan B.',
  },

  // Q03: 3.1.2 Setara 1/2 = 2/4
  CLASS_Q03: {
    questionId: 'CLASS_Q03',
    dskpCode: '3.1.2',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Pecahan setara mempunyai luas kawasan berlorek yang sama panjang.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Lihat Jalur 1/2',
        detail: 'Jalur pertama dibahagikan kepada 2 bahagian sama besar.',
        mathExpression: 'Jalur asal = 1/2',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Bandingkan dengan 2/4',
        detail: 'Darab nombor atas dan bawah dengan 2. Luas berlorek sama panjang!',
        mathExpression: '1/2 × 2/2 = 2/4',
        badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Nilainya Sama',
        detail: 'Nilainya sama. Jadi 1/2 dan 2/4 ialah pecahan setara.',
        mathExpression: '1/2 = 2/4',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 2/4! 🎉 Pilihan [C].',
    speechScript:
      'Jom buat satu-satu! Lihat jalur satu perdua. Nilainya sama panjang dengan dua per empat. Jadi, satu perdua setara dengan dua per empat! Pilihan C.',
  },

  // Q04: 3.1.4 Peratus 1/4 = 25%
  CLASS_Q04: {
    questionId: 'CLASS_Q04',
    dskpCode: '3.1.4',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Peratus bermaksud per seratus petak (grid 100).',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Fahami Maksud Peratus',
        detail: 'Peratus ialah bilangan petak daripada 100 petak penuh.',
        mathExpression: 'Jumlah petak = 100',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Bahagi Petak 100 Kepada 4',
        detail: '1 daripada 4 bahagian petak 100 ialah 25 petak.',
        mathExpression: '100 ÷ 4 = 25 petak',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Tulis Dalam Simbol %',
        detail: '25 daripada 100 ditulis sebagai 25 peratus.',
        mathExpression: '25/100 = 25%',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Satu per empat sama dengan 25 peratus! 🌟 Pilihan [D].',
    speechScript:
      'Jom buat satu-satu! Peratus bermaksud per seratus. Bahagikan seratus petak kepada empat bahagian, kita dapat dua puluh lima. Satu per empat sama dengan dua puluh lima peratus! Pilihan D.',
  },

  // Q05: 3.1.2 Setara 2/3 = 4/6
  CLASS_Q05: {
    questionId: 'CLASS_Q05',
    dskpCode: '3.1.2',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Darab nombor atas dan bawah dengan nombor yang sama.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Lihat Pecahan Asal',
        detail: 'Pecahan asal ialah 2/3 (dua bahagian daripada tiga).',
        mathExpression: 'Pecahan = 2/3',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Darab Atas dan Bawah',
        detail: 'Darab pengangka dan penyebut dengan nombor 2.',
        mathExpression: '2×2 = 4, 3×2 = 6 → 4/6',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Bandingkan Jalur',
        detail: 'Jalur 2/3 dan 4/6 mempunyai panjang yang sama.',
        mathExpression: '2/3 = 4/6',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 4/6! 🎉 Pilihan [A].',
    speechScript:
      'Jom buat satu-satu! Tengok pecahan dua pertiga. Kita darab atas dan bawah dengan dua. Dua darab dua sama dengan empat. Tiga darab dua sama dengan enam. Jawapannya empat per enam! Pilihan A.',
  },

  // Q06: 3.1.3 Bentuk Termudah 2/4 → 1/2
  CLASS_Q06: {
    questionId: 'CLASS_Q06',
    dskpCode: '3.1.3',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Bentuk termudah: Bahagi nombor atas dan bawah dengan nombor sama.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Cari Sifir Pembahagi',
        detail: 'Nombor 2 dan 4 ada dalam sifir 2.',
        mathExpression: 'Sifir 2',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Bahagi Atas dan Bawah',
        detail: 'Bahagikan kedua-dua nombor dengan 2.',
        mathExpression: '2÷2 = 1, 4÷2 = 2',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Bentuk Paling Ringkas',
        detail: '1/2 tidak boleh dibahagi lagi.',
        mathExpression: '2/4 → 1/2',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Bentuk termudah ialah 1/2! 🌟 Pilihan [B].',
    speechScript:
      'Jom buat satu-satu! Kita bahagi atas dan bawah dengan nombor yang sama iaitu dua. Dua bahagi dua dapat satu. Empat bahagi dua dapat dua. Bentuk termudahnya ialah satu perdua! Pilihan B.',
  },

  // Q07: 3.1.3 Bentuk Termudah 3/6 → 1/2
  CLASS_Q07: {
    questionId: 'CLASS_Q07',
    dskpCode: '3.1.3',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Gunakan sifir 3 untuk mengecilkan nombor atas dan bawah.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Kenal Pasti Sifir',
        detail: 'Nombor 3 dan 6 boleh dibahagi tepat dengan 3.',
        mathExpression: 'Sifir 3',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Bahagi dengan 3',
        detail: 'Bahagi pengangka dan penyebut dengan 3.',
        mathExpression: '3÷3 = 1, 6÷3 = 2',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Bentuk Termudah',
        detail: 'Hasilnya ialah pecahan paling ringkas.',
        mathExpression: '3/6 → 1/2',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Bentuk termudah ialah 1/2! 🎉 Pilihan [C].',
    speechScript:
      'Jom buat satu-satu! Bahagikan tiga dan enam dengan sifir tiga. Tiga bahagi tiga dapat satu. Enam bahagi tiga dapat dua. Bentuk termudah ialah satu perdua! Pilihan C.',
  },

  // Q08: 3.1.5 Tambah Penyebut Sama: 2/7 + 3/7 = 5/7
  CLASS_Q08: {
    questionId: 'CLASS_Q08',
    dskpCode: '3.1.5',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Bila nombor bawah (penyebut) sama, cuma tambah nombor atas.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Semak Penyebut',
        detail: 'Nombor bawah kedua-dua pecahan sudah sama iaitu 7.',
        mathExpression: 'Penyebut sama = 7',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tambah Pengangka Sahaja',
        detail: 'Tambah nombor atas: 2 tambah 3.',
        mathExpression: '2 + 3 = 5',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Penyebut Kekal',
        detail: 'Penyebut 7 kekal di bawah, tidak perlu ditambah.',
        mathExpression: '2/7 + 3/7 = 5/7',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 5/7! 🌟 Pilihan [D].',
    speechScript:
      'Jom buat satu-satu! Nombor bawah sudah sama iaitu tujuh. Jadi kita cuma perlu tambah nombor atas. Dua tambah tiga sama dengan lima. Jawapannya lima per tujuh! Pilihan D.',
  },

  // Q09: 3.1.6 Tolak Penyebut Sama: 6/8 − 2/8 = 4/8
  CLASS_Q09: {
    questionId: 'CLASS_Q09',
    dskpCode: '3.1.6',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Bila penyebut sama, tolak nombor atas dan kekalkan penyebut.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Lihat Nombor Bawah',
        detail: 'Kedua-dua pecahan mempunyai penyebut yang sama iaitu 8.',
        mathExpression: 'Penyebut sama = 8',
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tolak Nombor Atas',
        detail: 'Tolak pengangka: 6 tolak 2.',
        mathExpression: '6 − 2 = 4',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Baki Pecahan',
        detail: 'Baki bahagian yang tinggal ialah 4 daripada 8 bahagian.',
        mathExpression: '6/8 − 2/8 = 4/8',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 4/8! 🎉 Pilihan [A].',
    speechScript:
      'Jom buat satu-satu! Nombor bawah sama iaitu lapan. Tolak nombor atas, enam tolak dua sama dengan empat. Baki pecahan ialah empat per lapan! Pilihan A.',
  },

  // Q10: 3.1.7 Nombor Bercampur 1 dan 1/4 = 1 1/4
  CLASS_Q10: {
    questionId: 'CLASS_Q10',
    dskpCode: '3.1.7',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Nombor bercampur terdiri daripada nombor bulat dan pecahan wajar.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Kira Objek Penuh',
        detail: 'Tengok rajah: Ada 1 rajah yang berwarna penuh.',
        mathExpression: 'Nombor bulat = 1',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Kira Bahagian Pecahan',
        detail: 'Rajah sebelah ada 1 daripada 4 bahagian.',
        mathExpression: 'Pecahan = 1/4',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Tulis Bersama',
        detail: 'Tulis nombor bulat di hadapan dan pecahan di sebelahnya.',
        mathExpression: '1 + 1/4 = 1 1/4',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Nombor bercampurnya 1 1/4! 🌟 Pilihan [B].',
    speechScript:
      'Jom buat satu-satu! Ada satu bahagian penuh dan satu per empat bahagian pecahan. Kita gabungkan menjadi satu, satu per empat. Pilihan B.',
  },

  // Q11: 3.1.5 Tambah Penyebut Berbeza: 1/2 + 1/4 = 3/4
  CLASS_Q11: {
    questionId: 'CLASS_Q11',
    dskpCode: '3.1.5',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Samakan bahagian dahulu sebelum menambah pecahan.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Samakan Bahagian',
        detail: 'Penyebut tak sama. Tukar 1/2 kepada penyebut 4 dengan darab 2.',
        mathExpression: '1/2 → 2/4',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tambah',
        detail: 'Sekarang penyebut sudah sama 4. Tambah nombor atas.',
        mathExpression: '2/4 + 1/4',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Hasil Jawapan',
        detail: '2 tambah 1 sama dengan 3. Nombor bawah kekal 4.',
        mathExpression: '2 + 1 = 3 → 3/4',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 3/4! 🎉 Pilihan [C].',
    speechScript:
      'Jom buat satu-satu! Samakan bahagian dahulu. Satu perdua ditukar menjadi dua per empat. Kemudian tambah dua per empat dengan satu per empat. Dua tambah satu dapat tiga. Jawapannya tiga per empat! Pilihan C.',
  },

  // Q12: 3.1.5 Tambah Penyebut Berbeza: 1/3 + 2/9 = 5/9
  CLASS_Q12: {
    questionId: 'CLASS_Q12',
    dskpCode: '3.1.5',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Darab 1/3 dengan 3 untuk jadikan penyebut 9.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Samakan Bahagian',
        detail: 'Darab atas dan bawah 1/3 dengan 3.',
        mathExpression: '1/3 → 3/9',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tambah Pecahan',
        detail: 'Sekarang penyebut sudah sama 9.',
        mathExpression: '3/9 + 2/9',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Jumlahkan',
        detail: 'Tambah nombor atas: 3 tambah 2 sama dengan 5.',
        mathExpression: '3 + 2 = 5 → 5/9',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 5/9! 🌟 Pilihan [D].',
    speechScript:
      'Jom buat satu-satu! Samakan bahagian dahulu. Satu pertiga darab tiga menjadi tiga per sembilan. Kemudian tambah dengan dua per sembilan. Tiga tambah dua dapat lima. Jawapannya lima per sembilan! Pilihan D.',
  },

  // Q13: 3.1.6 Tolak Penyebut Berbeza: 3/4 − 1/2 = 1/4
  CLASS_Q13: {
    questionId: 'CLASS_Q13',
    dskpCode: '3.1.6',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Tukar 1/2 kepada 2/4 dahulu, kemudian tolak.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Samakan Bahagian',
        detail: 'Tukar 1/2 kepada penyebut 4 dengan darab 2.',
        mathExpression: '1/2 → 2/4',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tolak Pecahan',
        detail: 'Sekarang tolak bahagian yang sama.',
        mathExpression: '3/4 − 2/4',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Kira Baki',
        detail: 'Tolak nombor atas: 3 tolak 2 sama dengan 1.',
        mathExpression: '3 − 2 = 1 → 1/4',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 1/4! 🌟 Pilihan [A].',
    speechScript:
      'Jom buat satu-satu! Samakan bahagian dahulu. Satu perdua menjadi dua per empat. Kemudian tolak, tiga per empat tolak dua per empat. Tiga tolak dua sama dengan satu. Jawapannya satu per empat! Pilihan A.',
  },

  // Q14: 3.1.6 Tolak Penyebut Berbeza: 4/5 − 3/10 = 5/10
  CLASS_Q14: {
    questionId: 'CLASS_Q14',
    dskpCode: '3.1.6',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Darab 4/5 dengan 2 untuk jadikan penyebut 10.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Samakan Bahagian',
        detail: 'Tukar 4/5 kepada penyebut 10 dengan darab 2.',
        mathExpression: '4/5 → 8/10',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Tolak Pecahan',
        detail: 'Sekarang tolak pecahan yang berpenyebut 10.',
        mathExpression: '8/10 − 3/10',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Dapatkan Baki',
        detail: 'Tolak nombor atas: 8 tolak 3 sama dengan 5.',
        mathExpression: '8 − 3 = 5 → 5/10',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: 'Jawapannya 5/10! 🎉 Pilihan [B].',
    speechScript:
      'Jom buat satu-satu! Samakan bahagian dahulu. Empat perlima ditukar menjadi lapan per sepuluh. Kemudian lapan tolak tiga sama dengan lima. Baki pecahan ialah lima per sepuluh! Pilihan B.',
  },

  // Q15: 3.1.7 Pecahan Tak Wajar 7/5 = 1 2/5
  CLASS_Q15: {
    questionId: 'CLASS_Q15',
    dskpCode: '3.1.7',
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: 'Pengangka lebih besar daripada penyebut. Ini pecahan tak wajar!',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Kenali Pecahan Tak Wajar',
        detail: 'Pengangka (7) lebih besar daripada penyebut (5).',
        mathExpression: '7/5 ialah pecahan tak wajar',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Asingkan Bahagian Penuh',
        detail: '5 bahagian daripada 5 adalah 1 bulatan/objek penuh.',
        mathExpression: '5/5 = 1 keseluruhan',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Kira Baki Pecahan',
        detail: '7 tolak 5 tinggal 2 bahagian lagi (2/5).',
        mathExpression: '5/5 + 2/5 = 1 2/5',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: '7/5 = 1 2/5! 🌟 Pilihan [C].',
    speechScript:
      'Jom buat satu-satu! Pengangka lebih besar daripada penyebut. Ini pecahan tak wajar. Lima per lima bersamaan satu bahagian penuh. Baki dua bahagian lagi ialah dua per lima. Jadi, tujuh per lima sama dengan satu, dua per lima! Pilihan C.',
  },
};

/**
 * Get detailed explanation tailored specifically for the question.
 * If question is customized or randomized, automatically derives from question metadata.
 */
export function getAlyaQuestionExplanation(
  question: InteractiveClassQuestion
): AlyaQuestionExplanation {
  if (ALYA_15_EXPLANATIONS[question.questionId]) {
    return ALYA_15_EXPLANATIONS[question.questionId];
  }

  // Dynamic fallback for any other question
  const dskp = question.dskpCode;
  const ans = question.correctAnswer;
  const letter = question.correctAnswerLetter;

  if (dskp === '3.1.1') {
    return {
      questionId: question.questionId,
      dskpCode: dskp,
      intro: 'Jom buat satu-satu! 😊',
      conceptNote: 'Kira jumlah keseluruhan sebagai nombor bawah (penyebut).',
      steps: [
        {
          stepNumber: 1,
          label: 'LANGKAH 1',
          title: 'Kira Jumlah Objek',
          detail: 'Kira semua bahagian atau objek yang ada.',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        },
        {
          stepNumber: 2,
          label: 'LANGKAH 2',
          title: 'Kira Bahagian Ditanya',
          detail: 'Kira bahagian yang berlorek atau dipilih.',
          badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
        },
        {
          stepNumber: 3,
          label: 'LANGKAH 3',
          title: 'Tulis Pecahan',
          detail: `Pecahan ialah ${ans}.`,
          mathExpression: `Jawapan = ${ans}`,
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        },
      ],
      conclusion: `Jawapannya ${ans}! Pilihan [${letter}].`,
      speechScript: `Jom buat satu-satu! Kira jumlah semua objek, kemudian kira objek yang ditanya. Jawapan yang betul ialah ${ans}! Pilihan ${letter}.`,
    };
  }

  if (dskp === '3.1.2') {
    return {
      questionId: question.questionId,
      dskpCode: dskp,
      intro: 'Jom buat satu-satu! 😊',
      conceptNote: 'Pecahan setara mempunyai luas yang sama panjang.',
      steps: [
        {
          stepNumber: 1,
          label: 'LANGKAH 1',
          title: 'Lihat Saiz Bahagian',
          detail: 'Bandingkan panjang kedua-dua jalur pecahan.',
          badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        },
        {
          stepNumber: 2,
          label: 'LANGKAH 2',
          title: 'Samakan Nilai',
          detail: 'Darab nombor atas dan bawah dengan nombor yang sama.',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        },
        {
          stepNumber: 3,
          label: 'LANGKAH 3',
          title: 'Nilainya Sama',
          detail: `Pecahan setara yang sama nilai ialah ${ans}.`,
          mathExpression: `Setara = ${ans}`,
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        },
      ],
      conclusion: `Jawapannya ${ans}! Pilihan [${letter}].`,
      speechScript: `Jom buat satu-satu! Nilainya sama panjang. Jadi ini pecahan setara. Jawapannya ${ans}! Pilihan ${letter}.`,
    };
  }

  // General fallback
  return {
    questionId: question.questionId,
    dskpCode: dskp,
    intro: 'Jom buat satu-satu! 😊',
    conceptNote: question.hint || 'Ikuti langkah mudah ini untuk selesaikan soalan.',
    steps: [
      {
        stepNumber: 1,
        label: 'LANGKAH 1',
        title: 'Fahami Kehendak Soalan',
        detail: 'Perhatikan maklumat dan nombor yang diberi.',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        stepNumber: 2,
        label: 'LANGKAH 2',
        title: 'Lakukan Operasi Betul',
        detail: question.explanation,
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      },
      {
        stepNumber: 3,
        label: 'LANGKAH 3',
        title: 'Dapatkan Jawapan Tepat',
        detail: `Hasil penyelesaian akhir ialah ${ans}.`,
        mathExpression: `Jawapan = ${ans}`,
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      },
    ],
    conclusion: `Jawapannya ${ans}! 🎉 Pilihan [${letter}].`,
    speechScript: `Jom buat satu-satu! ${question.explanation}. Jadi jawapannya ialah ${ans}! Pilihan ${letter}.`,
  };
}
