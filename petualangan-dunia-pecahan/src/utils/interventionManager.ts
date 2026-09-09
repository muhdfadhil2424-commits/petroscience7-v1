import { InteractiveClassQuestion, INTERACTIVE_CLASS_15_QUESTIONS } from '../data/interactiveClass30Questions';
import { ScannedStudentAnswer } from '../types/interactiveClass';
import { LearningProfile } from '../types/learningProfile';
import { StudentInterventionPlan, LaunchableActivityInfo, InterventionPhase, DskpMasteryItem } from '../types/intervention';
import { getStoredDemoSessionAnswers } from '../data/demoClass3AsahSession';

export const DSKP_INFO_MAP: Record<string, { title: string; shortDesc: string }> = {
  '3.1.1': {
    title: 'Mengenal pasti pecahan wajar',
    shortDesc: 'Mengenal pasti pecahan wajar sebagai sebahagian daripada satu kumpulan objek atau satu keseluruhan',
  },
  '3.1.2': {
    title: 'Mengenal pasti pecahan setara',
    shortDesc: 'Mengenal pasti pecahan setara bagi pecahan wajar yang penyebutnya hingga 10',
  },
  '3.1.3': {
    title: 'Menyatakan pecahan bentuk termudah',
    shortDesc: 'Menyatakan pecahan wajar dalam bentuk termudah (penyebut hingga 10)',
  },
  '3.1.4': {
    title: 'Menukar pecahan kepada peratus',
    shortDesc: 'Menukar pecahan wajar kepada peratus dan sebaliknya (penyebut 10 dan 100 / grid 100 petak)',
  },
  '3.1.5': {
    title: 'Menambah dua pecahan wajar',
    shortDesc: 'Menambah dua pecahan wajar yang melibatkan penyebut sama atau penyebut tidak sama (hingga 10)',
  },
  '3.1.6': {
    title: 'Menolak dua pecahan wajar',
    shortDesc: 'Menolak dua pecahan wajar yang melibatkan penyebut sama atau penyebut tidak sama (hingga 10)',
  },
  '3.1.7': {
    title: 'Menyelesaikan masalah harian pecahan',
    shortDesc: 'Menyelesaikan masalah harian yang melibatkan pecahan wajar dalam situasi sebenar',
  },
};

/**
 * Extract questions and answers for a specific student
 */
export function getStudentDetailedAnswers(
  studentId: string,
  studentName: string,
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  allAnswers?: Record<string, Record<string, ScannedStudentAnswer>>
): {
  answersMap: Record<string, ScannedStudentAnswer>;
  correctCount: number;
  totalCount: number;
  wrongQuestionIds: string[];
} {
  const dataset = allAnswers || getStoredDemoSessionAnswers();
  const answersMap: Record<string, ScannedStudentAnswer> = {};
  let correctCount = 0;
  const wrongQuestionIds: string[] = [];

  // Standardize student identifiers
  const cleanId = studentId.replace('MURID-3A', '').replace('MURID-', '').replace('KP-', '');
  const kpId = `KP-${cleanId.padStart(3, '0')}`;

  questions.forEach((q) => {
    const qAnswers = dataset[q.questionId] || {};
    // Look up by kpId, studentId, or studentName
    const ans = qAnswers[kpId] || qAnswers[studentId] || Object.values(qAnswers).find((a) => a.studentName.toLowerCase() === studentName.toLowerCase());

    if (ans) {
      answersMap[q.questionId] = ans;
      if (ans.isCorrect) {
        correctCount++;
      } else {
        wrongQuestionIds.push(q.questionId);
      }
    }
  });

  return {
    answersMap,
    correctCount,
    totalCount: questions.length,
    wrongQuestionIds,
  };
}

/**
 * Generate Individualized Intervention Plan for a student by Alya
 */
export function generateStudentInterventionPlan(
  studentName: string,
  studentId: string = 'KP-001',
  studentClass: string = '3 Asah',
  profile: LearningProfile | null,
  questions: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS,
  customAnswers?: Record<string, Record<string, ScannedStudentAnswer>>
): StudentInterventionPlan {
  const { answersMap, correctCount, totalCount, wrongQuestionIds } = getStudentDetailedAnswers(
    studentId,
    studentName,
    questions,
    customAnswers
  );

  const score = correctCount;
  const scorePercentage = Math.round((score / (totalCount || 1)) * 100);

  const dominantMode = profile?.dominantMode || 'visual';
  const dominantModeLabel = profile?.dominantLabel || (dominantMode === 'visual' ? '👀 Visual' : dominantMode === 'kinesthetic' ? '🖐️ Kinestetik' : dominantMode === 'auditory' ? '🎧 Auditori' : '🌈 Gabungan');
  const confidence = profile?.confidence || 78;

  // 1. Analyze DSKP Mastery
  const dskpStats: Record<string, { total: number; correct: number; qIds: string[] }> = {};
  questions.forEach((q) => {
    if (!dskpStats[q.dskpCode]) {
      dskpStats[q.dskpCode] = { total: 0, correct: 0, qIds: [] };
    }
    dskpStats[q.dskpCode].total++;
    dskpStats[q.dskpCode].qIds.push(q.questionId);

    const ans = answersMap[q.questionId];
    if (ans?.isCorrect) {
      dskpStats[q.dskpCode].correct++;
    }
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const weakDskpList: string[] = [];

  Object.entries(dskpStats).forEach(([code, stat]) => {
    const info = DSKP_INFO_MAP[code] || { title: `Standard ${code}` };
    const passRate = stat.correct / stat.total;

    if (passRate >= 0.8) {
      strengths.push(`${code} ${info.title}`);
    } else {
      weaknesses.push(`${code} ${info.title}`);
      weakDskpList.push(code);
    }
  });

  // If no weaknesses, praise full mastery
  if (weaknesses.length === 0) {
    if (scorePercentage >= 90) {
      weaknesses.push('Tiada kelemahan ketara — sedia untuk pengayaan aras tinggi (KBAT)');
    } else {
      weaknesses.push('Ketepatan pengiraan dalam soalan rutin bertingkat');
    }
  }

  // If strengths empty, ensure positive encouragement
  if (strengths.length === 0) {
    strengths.push('Kesediaan mencuba dan menjawab semua soalan pecahan');
  }

  // 2. Determine Approach Ordering (Visual, Kinestetik, Auditori)
  let approachOrder: ('visual' | 'kinesthetic' | 'auditory')[] = ['visual', 'kinesthetic', 'auditory'];
  if (dominantMode === 'kinesthetic') {
    approachOrder = ['kinesthetic', 'visual', 'auditory'];
  } else if (dominantMode === 'auditory') {
    approachOrder = ['auditory', 'visual', 'kinesthetic'];
  } else if (dominantMode === 'combined') {
    const vScore = profile?.visualScore ?? 70;
    const kScore = profile?.kinestheticScore ?? 65;
    const aScore = profile?.auditoryScore ?? 50;
    const sorted = [
      { mode: 'visual' as const, score: vScore },
      { mode: 'kinesthetic' as const, score: kScore },
      { mode: 'auditory' as const, score: aScore },
    ].sort((a, b) => b.score - a.score);
    approachOrder = sorted.map((s) => s.mode);
  }

  // 3. Select primary weak topic for targeted intervention
  const primaryWeakDskp = weakDskpList.length > 0 ? weakDskpList[0] : (score < 15 ? '3.1.5' : '3.1.7');

  // 4. Generate Alya's Summary (Bahasa Melayu standard yang mudah difahami guru)
  let alyaSummary = '';
  if (dominantMode === 'visual') {
    alyaSummary = `${studentName} menunjukkan kecenderungan visual berpandukan corak interaksi dan prestasinya. Guru disyorkan menggunakan representasi visual seperti fraction bar dan rajah berwarna sebagai pendekatan utama, kemudian digabungkan dengan manipulasi kepingan objek untuk mengukuhkan konsep secara menyeluruh.`;
  } else if (dominantMode === 'kinesthetic') {
    alyaSummary = `${studentName} menunjukkan kecenderungan kinestetik yang tinggi melalui interaksi aktif dan pergerakan hands-on. Guru disyorkan mendahulukan aktiviti seret-dan-lepas (drag-and-drop) atau menyusun kepingan pecahan fizikal sebelum mengaitkannya dengan rajah visual.`;
  } else if (dominantMode === 'auditory') {
    alyaSummary = `${studentName} memberi respons sangat baik kepada bimbingan audio dan arahan berstruktur. Pendekatan pengajaran disyorkan dimulakan dengan penerangan lisan, dialog bimbingan rakan sebaya (think-pair-share), dan sebutan jelas nama pecahan sebelum latihan bertulis.`;
  } else {
    alyaSummary = `${studentName} mempamerkan kecenderungan gabungan (multimodal) yang seimbang. Menggabungkan rangsangan visual bersama aktiviti manipulasi praktikal akan memberi impak pemahaman yang paling berkesan untuk murid ini.`;
  }

  // 5. Generate ⭐ Cadangan Utama Alya
  let primaryRecommendation = '';
  if (primaryWeakDskp === '3.1.6') {
    // Tolak pecahan
    if (dominantMode === 'visual') {
      primaryRecommendation = `Gunakan fraction bar berwarna untuk menunjukkan proses menolak pecahan dengan penyebut yang sama secara jelas. Seterusnya, gunakan aktiviti seret-dan-lepas (drag-and-drop) untuk mengasingkan bahagian yang ditolak sebelum meminta ${studentName} menerangkan baki pecahan yang tinggal.`;
    } else if (dominantMode === 'kinesthetic') {
      primaryRecommendation = `Minta ${studentName} mengasingkan dan mengeluarkan kepingan pecahan fizikal/digital secara langsung bagi merasai konsep pengurangan nilai pecahan. Selepas itu, sahkan jawapan menggunakan fraction bar dan minta murid menyebut hasil tolak.`;
    } else {
      primaryRecommendation = `Bimbing ${studentName} melalui penerangan lisan langkah demi langkah: sebut penyebut yang kekal sama, kemudian tolak nilai pengangka. Gandingkan dengan visual fraction bar untuk menyokong kefahamannya.`;
    }
  } else if (primaryWeakDskp === '3.1.4') {
    // Pecahan peratus
    primaryRecommendation = `Gunakan grid 100 petak interaktif untuk menunjukkan secara langsung hubungan antara pecahan per seratus dan simbol peratus (%). Minta ${studentName} mewarnakan atau menandakan petak mengikut nilai pecahan sebelum menyebut padanan peratusnya.`;
  } else if (primaryWeakDskp === '3.1.2') {
    // Pecahan setara
    primaryRecommendation = `Mulakan dengan memaparkan jalur pecahan (fraction bar) bertindih secara visual untuk menunjukkan pecahan berlainan penyebut yang mempunyai panjang yang sama. Kemudian minta ${studentName} memadankan kepingan pecahan setara sebelum menerangkan sebab 1/2 bersamaan dengan 2/4 atau 3/6.`;
  } else if (primaryWeakDskp === '3.1.3') {
    // Bentuk termudah
    primaryRecommendation = `Tunjukkan pembahagian kepingan pecahan daripada saiz kecil kepada bahagian berkumpulan yang lebih besar menggunakan rajah bulatan atau fraction bar. Bimbing ${studentName} mencari faktor sepunya terkecil secara visual dan hands-on.`;
  } else if (primaryWeakDskp === '3.1.5') {
    // Tambah pecahan
    primaryRecommendation = `Gunakan kepingan pizza atau fraction bar untuk mencantumkan dua bahagian pecahan dengan penyebut yang sama secara visual. Setelah ${studentName} mencantumkan bahagian secara praktikal, minta murid menulis ayat matematik dan menyebut jawapan akhir.`;
  } else if (primaryWeakDskp === '3.1.1') {
    // Kenal pecahan wajar
    primaryRecommendation = `Mulakan dengan objek maujud atau kepingan bentuk berasingan (contoh: 3 biji epal merah daripada 8 biji epal). Tegaskan perbezaan antara pengangka (bahagian yang diambil) dan penyebut (jumlah keseluruhan objek).`;
  } else {
    // Pengayaan (15/15)
    primaryRecommendation = `Oleh kerana ${studentName} telah menguasai konsep asas dengan cemerlang, berikan cabaran penyelesaian masalah harian bukan rutin (KBAT) dan libatkan murid dalam aktiviti bimbingan rakan sebaya (peer tutoring).`;
  }

  // 6. 3 Approaches Content
  const visualApproach = {
    title: 'Aktiviti Pendekatan Visual',
    activities: [
      'Fraction Bar: Bandingkan panjang jalur pecahan secara visual untuk melihat perkaitan nilai.',
      'Gambar Pizza Pecahan: Gunakan potongan pizza berwarna untuk menunjukkan pecahan bahagian daripada keseluruhan.',
      'Garis Nombor Pecahan: Letakkan kedudukan pecahan antara 0 hingga 1 pada garis nombor.',
      'Rajah Bahagian & Keseluruhan: Gunakan rajah petak berbayang untuk mengenal pasti pengangka dan penyebut.',
      'Kad Pecahan Bergambar: Gunakan kad imbasan visual yang memadankan nombor pecahan dengan gambar rajah.',
    ],
    example: primaryWeakDskp === '3.1.6'
      ? `Gunakan fraction bar berwarna untuk menunjukkan penolakan 5/8 - 2/8 = 3/8 secara visual.`
      : primaryWeakDskp === '3.1.4'
      ? `Gunakan grid 100 petak berbayang untuk menunjukkan 25/100 bersamaan dengan 25%.`
      : `Gunakan fraction bar bertindih untuk membuktikan mengapa 1/2 bersamaan dengan 2/4.`,
  };

  const kinestheticApproach = {
    title: 'Aktiviti Pendekatan Kinestetik',
    activities: [
      'Drag-and-Drop Digital: Seret kepingan pecahan untuk melengkapkan satu bahagian penuh.',
      'Susun Fraction Bar: Susun blok atau jalur pecahan fizikal/digital daripada saiz kecil ke besar.',
      'Padankan Pecahan dengan Objek: Pasangkan kad pecahan dengan kepingan puzzle yang sepadan.',
      'Bahagikan Objek Sebenar: Bahagikan kertas lipat atau kepingan manipulatif kepada bahagian sama rata.',
      'Manipulasi Digital: Gerakkan penanda pada gelongsor pecahan untuk menguji nilai setara.',
    ],
    example: primaryWeakDskp === '3.1.6'
      ? `Minta ${studentName} menyeret keluar 2 kepingan daripada jalur 5 kepingan untuk melihat baki 3 kepingan.`
      : `Minta ${studentName} menyeret dan menyusun kepingan pecahan untuk membentuk 1 keseluruhan.`,
  };

  const auditoryApproach = {
    title: 'Aktiviti Pendekatan Auditori',
    activities: [
      'Dengar Penerangan Alya: Dengar penjelasan bersuara Alya bagi setiap langkah pecahan.',
      'Sebut Nama Pecahan: Sebut pecahan secara berirama (contoh: "satu per dua", "tiga per empat").',
      'Think-Pair-Share: Terangkan cara penyelesaian kepada rakan dalam aktiviti berpasangan.',
      'Soalan Lisan Guru: Jawab soalan rangsangan lisan guru secara spontan berpandukan kad pecahan.',
      'Verbalisasi Langkah: Minta murid menyebut dengan kuat mengapa sesuatu jawapan itu dipilih.',
    ],
    example: primaryWeakDskp === '3.1.2'
      ? `Minta ${studentName} menerangkan dengan kuat mengapa 2/4 mempunyai nilai luas yang sama dengan 1/2.`
      : `Minta ${studentName} menyebut nama penyebut sebelum dan selepas operasi pecahan dijalankan.`,
  };

  // 7. Launchable Activity Configuration
  let launchableActivity: LaunchableActivityInfo = {
    id: 'act_pecahan_setara',
    title: 'Padankan Pecahan Setara',
    dskpCode: '3.1.2',
    topicName: 'Pecahan Setara',
    description: 'Aktiviti interaktif memadankan dua pecahan yang mempunyai nilai setara menggunakan jalur pecahan.',
    previewType: 'equivalent_bars',
    launchable: true,
    gameRoute: 'arena',
    challengeId: 'arena-2',
  };

  if (primaryWeakDskp === '3.1.4') {
    launchableActivity = {
      id: 'act_pecahan_peratus',
      title: 'Pecahan kepada Peratus',
      dskpCode: '3.1.4',
      topicName: 'Hubungan Pecahan & Peratus',
      description: 'Aktiviti interaktif grid 100 petak untuk memahami pertukaran pecahan perseratus kepada simbol peratus.',
      previewType: 'percentage_grid',
      launchable: true,
      gameRoute: 'dapur',
      challengeId: 'dapur-1',
    };
  } else if (primaryWeakDskp === '3.1.5') {
    launchableActivity = {
      id: 'act_tambah_pecahan',
      title: 'Tambah Pecahan Bersama Alya',
      dskpCode: '3.1.5',
      topicName: 'Operasi Tambah Pecahan',
      description: 'Aktiviti mencantumkan kepingan pecahan berpenyebut sama dan memudahkan jawapan akhir.',
      previewType: 'addition_bars',
      launchable: true,
      gameRoute: 'dapur',
      challengeId: 'dapur-2',
    };
  } else if (primaryWeakDskp === '3.1.6') {
    launchableActivity = {
      id: 'act_tolak_pecahan',
      title: 'Tolak Pecahan Menggunakan Jalur',
      dskpCode: '3.1.6',
      topicName: 'Operasi Tolak Pecahan',
      description: 'Aktiviti interaktif menolak kepingan pecahan dengan mengasingkan bahagian yang ditolak.',
      previewType: 'subtraction_bars',
      launchable: true,
      gameRoute: 'dapur',
      challengeId: 'dapur-3',
    };
  } else if (primaryWeakDskp === '3.1.3') {
    launchableActivity = {
      id: 'act_bentuk_termudah',
      title: 'Kecilkan Pecahan Bentuk Termudah',
      dskpCode: '3.1.3',
      topicName: 'Pecahan Bentuk Termudah',
      description: 'Aktiviti mengelompokkan bahagian kecil kepada bahagian yang lebih besar untuk mendapatkan bentuk termudah.',
      previewType: 'simplification',
      launchable: true,
      gameRoute: 'arena',
      challengeId: 'arena-3',
    };
  } else if (primaryWeakDskp === '3.1.1') {
    launchableActivity = {
      id: 'act_kenal_pecahan',
      title: 'Kenal Pasti Pecahan Wajar',
      dskpCode: '3.1.1',
      topicName: 'Konsep Asas Pecahan',
      description: 'Aktiviti mengira objek berwarna dan menyatakan bahagian pengangka serta penyebut.',
      previewType: 'fraction_bar',
      launchable: true,
      gameRoute: 'arena',
      challengeId: 'arena-1',
    };
  }

  // 8. 4-Phase Intervention Plan
  const phases: InterventionPhase[] = [
    {
      phase: 1,
      title: 'Fasa 1: Visualkan Konsep',
      focus: 'Membina gambaran mental',
      description: `Gunakan fraction bar atau rajah bergambar untuk memperlihatkan konsep ${DSKP_INFO_MAP[primaryWeakDskp]?.title || 'pecahan'} secara jelas dan nyata.`,
    },
    {
      phase: 2,
      title: 'Fasa 2: Manipulasi Pecahan',
      focus: 'Aktiviti Hands-on / Interaktif',
      description: `Minta ${studentName} menyusun, mengasingkan, atau memadankan kepingan pecahan menggunakan aktiviti manipulatif digital/fizikal.`,
    },
    {
      phase: 3,
      title: 'Fasa 3: Latihan Terbimbing',
      focus: 'Pengukuhan & Latih Tubi',
      description: `Berikan 2 hingga 3 soalan berperingkat daripada tahap mudah kepada sederhana dengan sokongan hint sekiranya murid menghadapi kesukaran.`,
    },
    {
      phase: 4,
      title: 'Fasa 4: Semak Kefahaman',
      focus: 'Penilaian Formatif & Refleksi',
      description: `Minta ${studentName} menerangkan secara lisan cara jawapan diperoleh bagi memastikan kefahaman kukuh dan bukan sekadar menghafal formula.`,
    },
  ];

  return {
    studentId,
    studentName,
    studentClass,
    score,
    totalQuestions: totalCount,
    scorePercentage,
    dominantModeLabel,
    dominantMode,
    confidence,
    alyaSummary,
    strengths,
    weaknesses,
    primaryRecommendation,
    approachOrder,
    visualApproach,
    kinestheticApproach,
    auditoryApproach,
    launchableActivity,
    phases,
    disclaimer: 'Profil ini ialah anggaran kecenderungan berdasarkan data interaksi murid. Ia bukan penentuan gaya pembelajaran secara mutlak. Guru digalakkan menggunakan gabungan pendekatan mengikut keperluan murid.',
  };
}
