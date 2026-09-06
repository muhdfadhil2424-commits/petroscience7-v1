export interface NotaTopic {
  id: string;
  topicNumber: number;
  title: string;
  shortTitle: string;
  icon: string;
  subtitle: string;
  dskpCode: string;
  explanation: string[];
  keyConcept: string;
  visualType: 
    | 'apa-itu-pecahan' 
    | 'pengangka-dan-penyebut' 
    | 'pecahan-wajar' 
    | 'pecahan-setara' 
    | 'membandingkan-pecahan' 
    | 'menyusun-pecahan' 
    | 'garis-nombor';
  realLifeExample: {
    icon: string;
    name: string;
    story: string;
  };
  rememberBox: {
    title: string;
    points: string[];
  };
  tahukahKamu: string;
  tryPrompt: string;
}

export const NOTA_PECAHAN_DATA: NotaTopic[] = [
  {
    id: 'apa-itu-pecahan',
    topicNumber: 1,
    title: '🍕 APA ITU PECAHAN?',
    shortTitle: 'Apa Itu Pecahan?',
    icon: '🍕',
    subtitle: 'Fahami maksud pecahan sebagai sebahagian daripada satu objek keseluruhan.',
    dskpCode: 'DSKP 2.1.1',
    explanation: [
      'Pecahan ialah sebahagian daripada satu objek yang dibahagikan kepada beberapa bahagian yang sama besar.',
      'Contohnya, jika 1 biji pizza bulat dipotong kepada 4 keping yang sama saiz, dan kita ambil 3 keping, pecahannya ialah 3/4.',
      'Ayat matematik: 3 daripada 4 bahagian dipilih.',
      'Jika bahagian tidak sama saiz, ia BUKAN pecahan yang sah!',
    ],
    keyConcept: '3 daripada 4 bahagian dipilih = 3/4',
    visualType: 'apa-itu-pecahan',
    realLifeExample: {
      icon: '🍕',
      name: 'Pizza Sedap Dapur Pecahan',
      story: 'Satu pizza bulat dipotong sama rata kepada 4 keping. Kamu makan 3 keping bersama adik. Baki tinggal 1 keping lagi!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        'Semua bahagian MESTILAH SAMA BESAR dan sama saiz!',
        'Nombor atas menunjukkan berapa banyak bahagian yang dipilih.',
        'Nombor bawah menunjukkan jumlah semua potongan dalam satu objek.',
      ],
    },
    tahukahKamu: 'Pizza dan wafel bulat adalah cara paling sedap dan mudah untuk memahami konsep pecahan dalam dunia harian kita!',
    tryPrompt: 'Cuba tekan hirisan pizza di bawah untuk melihat bagaimana pecahan 1/4, 2/4, 3/4 atau 4/4 terbentuk!',
  },
  {
    id: 'pengangka-dan-penyebut',
    topicNumber: 2,
    title: '🔢 PENGANGKA DAN PENYEBUT',
    shortTitle: 'Pengangka & Penyebut',
    icon: '🔢',
    subtitle: 'Kenali nombor di atas dan nombor di bawah dalam pecahan bertingkat.',
    dskpCode: 'DSKP 2.1.1',
    explanation: [
      'Pecahan ditulis dengan dua nombor yang dipisahkan oleh satu garisan pembahagi.',
      'Nombor di ATAS dipanggil PENGANGKA: Menunjukkan bilangan bahagian yang diambil atau diwarnakan.',
      'Nombor di BAWAH dipanggil PENYEBUT: Menunjukkan jumlah bahagian yang sama besar dalam satu objek.',
      'Contoh bagi pecahan 3/5: Nombor 3 ialah pengangka, dan nombor 5 ialah penyebut.',
    ],
    keyConcept: '3 ialah Pengangka (atas). 5 ialah Penyebut (bawah).',
    visualType: 'pengangka-dan-penyebut',
    realLifeExample: {
      icon: '🍫',
      name: 'Coklat Bar 5 Petak',
      story: 'Satu bar coklat ada 5 petak sama saiz. Kamu beri 3 petak kepada kawan (3/5) dan simpan 2 petak (2/5).',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        'PENGANGKA di ATAS (fikirkan: "Pengantin di atas pelamin").',
        'PENYEBUT di BAWAH (fikirkan: "Penyelam di bawah laut").',
        'Garisan melintang di tengah bermaksud "dibahagikan dengan".',
      ],
    },
    tahukahKamu: 'Perkataan pecahan berasal daripada membahagi satu benda utuh menjadi bahagian-bahagian kecil yang sama rata!',
    tryPrompt: 'Tekan butang PENGANGKA atau PENYEBUT di bawah untuk melihat bahagian mana yang menyala bersinar!',
  },
  {
    id: 'pecahan-wajar',
    topicNumber: 3,
    title: '🥧 PECAHAN WAJAR',
    shortTitle: 'Pecahan Wajar',
    icon: '🥧',
    subtitle: 'Pecahan yang nilainya sentiasa kurang daripada satu objek penuh.',
    dskpCode: 'DSKP 2.1.1',
    explanation: [
      'Pecahan wajar ialah pecahan yang nombor pengangkanya LEBIH KECIL daripada nombor penyebutnya.',
      'Formula mudah: Pengangka < Penyebut (Nombor Atas < Nombor Bawah).',
      'Nilai pecahan wajar sentiasa KURANG daripada satu (kurang daripada 1 objek penuh).',
      'Contoh pecahan wajar: 1/2, 2/3, dan 3/4.',
    ],
    keyConcept: 'Pengangka < Penyebut (Contoh: 1/2, 2/3, 3/4 sentiasa kurang daripada 1).',
    visualType: 'pecahan-wajar',
    realLifeExample: {
      icon: '🎂',
      name: 'Potongan Kek Coklat',
      story: 'Sebiji kek dipotong kepada 4 keping. Jika kamu makan 3 keping (3/4), kamu belum makan sebiji kek penuh kerana 3 keping kurang daripada 4 keping!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        'Nombor atas MESTI lebih kecil daripada nombor bawah.',
        'Nilainya sentiasa kurang daripada 1 objek lengkap.',
        'Jika nombor atas sama dengan bawah (contoh: 4/4), ia bersamaan dengan 1 penuh!',
      ],
    },
    tahukahKamu: 'Pecahan wajar dinamakan "wajar" kerana secara semula jadi kita membahagikan satu benda dan mengambil sebahagian daripadanya, bukan lebih daripada apa yang ada!',
    tryPrompt: 'Tekan pilihan pecahan 1/2, 2/3, dan 3/4 untuk melihat bagaimana fraction bar dan potongan kek berubah saiz!',
  },
  {
    id: 'pecahan-setara',
    topicNumber: 4,
    title: '🧩 PECAHAN SETARA',
    shortTitle: 'Pecahan Setara',
    icon: '🧩',
    subtitle: 'Pecahan berbeza bentuk nombor tetapi mempunyai saiz dan nilai yang sama!',
    dskpCode: 'DSKP 2.1.2',
    explanation: [
      'Pecahan setara ialah pecahan-pecahan yang mempunyai NILAI YANG SAMA BESAR.',
      'Walaupun nombor pengangka dan penyebutnya berbeza, saiz bahagiannya tetap sama panjang!',
      'Contohnya: 1/2 = 2/4 = 3/6.',
      'Pecahan berbeza tetapi mempunyai nilai yang sama.',
      'Kita boleh mencipta pecahan setara dengan mendarab nombor atas dan nombor bawah dengan nombor yang sama.',
    ],
    keyConcept: '1/2 = 2/4 = 3/6 (Panjang bahagian berwarna adalah sama!).',
    visualType: 'pecahan-setara',
    realLifeExample: {
      icon: '🧇',
      name: 'Wafel Coklat Manis',
      story: 'Aiman potong wafel kepada 2 dan makan 1 keping (1/2). Sara potong wafel kepada 4 dan makan 2 keping (2/4). Jumlah wafel yang mereka makan adalah sama banyak!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        'Bentuk nombor berbeza, tetapi NILAINYA SAMA BESAR.',
        '1/2 sama besar dengan 2/4 dan 3/6.',
        'Panjang jalur yang berwarna berakhir pada garisan tegak yang sama!',
      ],
    },
    tahukahKamu: 'Kamu tidak akan rugi jika ibu kamu potong wafel kepada 4 bahagian dan beri kamu 2 keping, kerana 2/4 adalah sama banyak dengan separuh wafel (1/2)!',
    tryPrompt: 'Tekan butang "🔎 Lihat Hubungan" untuk melihat garis panduan laser membuktikan 1/2 = 2/4 = 3/6!',
  },
  {
    id: 'membandingkan-pecahan',
    topicNumber: 5,
    title: '⚖️ MEMBANDINGKAN PECAHAN',
    shortTitle: 'Membandingkan Pecahan',
    icon: '⚖️',
    subtitle: 'Tentukan pecahan mana yang lebih besar, lebih kecil, atau sama nilai.',
    dskpCode: 'DSKP 2.1.3',
    explanation: [
      'Kita boleh menggunakan jalur pecahan (fraction bars) untuk membandingkan dua nilai pecahan.',
      'Perhatikan perbandingan antara 1/2 dan 3/4:',
      '1/2 ialah bar separuh (50%), manakala 3/4 ialah bar tiga perempat (75%).',
      'Oleh kerana bar 3/4 lebih panjang daripada 1/2, maka 3/4 > 1/2 (3/4 lebih besar daripada 1/2).',
      'Gunakan simbol matematik: > (lebih besar), < (lebih kecil), atau = (sama dengan).',
    ],
    keyConcept: '3/4 > 1/2 (Bar 3/4 lebih panjang daripada bar 1/2).',
    visualType: 'membandingkan-pecahan',
    realLifeExample: {
      icon: '🍉',
      name: 'Tembikai Segar',
      story: 'Sebiji tembikai dibahagi 4. Jika kamu dapat 3 potong (3/4) dan adik dapat 2 potong atau separuh (1/2 = 2/4), kamu dapat bahagian yang lebih panjang dan banyak!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        '> bermaksud "LEBIH BESAR DARIPADA".',
        '< bermaksud "LEBIH KECIL DARIPADA".',
        '= bermaksud "SAMA DENGAN".',
        'Mulut simbol yang terbuka sentiasa menghadap nombor yang LEBIH BESAR!',
      ],
    },
    tahukahKamu: 'Petua buaya lapar: Simbol > dan < seperti mulut buaya yang sentiasa ingin membuka mulut memakan pecahan yang lebih besar!',
    tryPrompt: 'Tekan simbol >, <, atau = untuk menguji pemahaman perbandingan antara 3/4 dan 1/2!',
  },
  {
    id: 'menyusun-pecahan',
    topicNumber: 6,
    title: '📶 MENYUSUN PECAHAN',
    shortTitle: 'Menyusun Pecahan',
    icon: '📶',
    subtitle: 'Susun pecahan mengikut tertib menaik atau tertib menurun menggunakan fraction bars.',
    dskpCode: 'DSKP 2.1.3',
    explanation: [
      'Contoh pecahan: 1/4, 1/2, dan 3/4.',
      'Arahan: "Susun daripada yang paling kecil kepada yang paling besar (Tertib Menaik)."',
      'Kita tahu bahawa 1/2 bersamaan dengan 2/4.',
      'Jadi susunannya mengikut panjang bar: 1/4 ➔ 1/2 (2/4) ➔ 3/4.',
      'Perhatikan bagaimana panjang bar meningkat seperti anak tangga!',
    ],
    keyConcept: 'Tertib Menaik: 1/4 ➔ 1/2 ➔ 3/4 (Paling kecil ke paling besar).',
    visualType: 'menyusun-pecahan',
    realLifeExample: {
      icon: '🧱',
      name: 'Anak Tangga Menara',
      story: 'Di Dunia Pixel, kamu perlu menyusun blok dari ketinggian 1/4, kemudian 1/2, dan 3/4 untuk membina tangga yang sempurna ke istana!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        'Tertib MENAIK: Dari paling KECIL ke paling BESAR (naik tangga).',
        'Tertib MENURUN: Dari paling BESAR ke paling KECIL (turun tangga).',
        '1/4 paling pendek, 1/2 di tengah, dan 3/4 paling panjang.',
      ],
    },
    tahukahKamu: 'Menyusun pecahan menjadi sangat mudah apabila kamu membayangkan jalur pecahan seperti anak tangga yang semakin tinggi!',
    tryPrompt: 'Tekan butang "Susun Menaik" atau "Susun Menurun" untuk melihat animasi pertukaran kedudukan bar!',
  },
  {
    id: 'garis-nombor',
    topicNumber: 7,
    title: '📏 PECAHAN PADA GARIS NOMBOR',
    shortTitle: 'Garis Nombor',
    icon: '📏',
    subtitle: 'Lihat kedudukan pecahan pada garis nombor dari 0 hingga 1 dengan senggatan sama rata.',
    dskpCode: 'DSKP 2.1.1',
    explanation: [
      'Garis nombor pecahan bermula dari 0 (sifar) dan berakhir di 1 (satu penuh).',
      'Garis nombor: 0 ───── 1/4 ───── 1/2 ───── 3/4 ───── 1.',
      'Jarak antara setiap penanda senggatan mestilah SAMA PANJANG.',
      'Semakin ke kanan titik penanda bergerak, nilai pecahannya semakin bertambah besar!',
      'Penanda 1/2 terletak tepat di tengah-tengah antara 0 dan 1.',
    ],
    keyConcept: '0 ───── 1/4 ───── 1/2 ───── 3/4 ───── 1 (Jarak setiap bahagian sama rata).',
    visualType: 'garis-nombor',
    realLifeExample: {
      icon: '🏃',
      name: 'Pembaris & Trek Larian',
      story: 'Pembaris di dalam kotak pensel kamu menggunakan konsep garis nombor. Tanda 0 cm ialah pangkal dan senggatan membahagikan ukuran dengan sama tepat!',
    },
    rememberBox: {
      title: 'INGAT! ⭐',
      points: [
        '0 di sebelah kiri (paling kecil/tiada bahagian).',
        '1 di sebelah kanan (satu objek penuh lengkap).',
        '1/2 terletak tepat di separuh perjalanan (50%).',
        'Jarak antara setiap penanda senggatan mestilah SAMA TEPAT.',
      ],
    },
    tahukahKamu: 'Meter kelajuan kereta dan pembaris geometri semuanya direka menggunakan garis nombor matematik yang sama rata!',
    tryPrompt: 'Tekan mana-mana titik penanda (1/4, 1/2, 3/4, 0, atau 1) untuk melihat visual pecahan yang sepadan muncul!',
  },
];
