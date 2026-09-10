import { CLASS_3_ASAH_STUDENTS, RAW_3ASAH } from '../src/data/class3AsahData';
import { CLASS_5_PIRUZ_STUDENTS, RAW_5PIRUZ } from '../src/data/class5PiruzData';
import { DEMO_600_RESPONSES_5PIRUZ, DEMO_SESSION_NESTED_ANSWERS_5PIRUZ } from '../src/data/demoClass5PiruzSession';
import { DEMO_600_RESPONSES } from '../src/data/demoClass3AsahSession';
import { INTERACTIVE_CLASS_15_QUESTIONS } from '../src/data/interactiveClass30Questions';
import { analyzeAllStudents, analyzeDskpStandards } from '../src/utils/interactiveDashboardAnalytics';
import { ALL_CLASSES } from '../src/utils/studentSessionManager';
import { INTERACTIVE_CLASSES, getAllInteractiveStudents } from '../src/utils/interactiveClassManager';
import { loadAnswersForDashboard } from '../src/utils/interactiveSessionManager';

console.log('=== VERIFIKASI SELEPAS OPERASI MOVE (LANGKAH 1 -> LANGKAH 2 -> LANGKAH 3) ===\n');

let pass = true;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ GAGAL: ${msg}`);
    pass = false;
  } else {
    console.log(`✅ LULUS: ${msg}`);
  }
}

// ==========================================
// 1. SEMAK DATA 5 PIRUZ (LANGKAH 1 & 2)
// ==========================================
console.log('--- 1. SEMAK KELAS 5 PIRUZ (40 MURID & DATA LENGKAP) ---');
assert(CLASS_5_PIRUZ_STUDENTS.length === 40, `5 Piruz mempunyai tepat 40 murid (didapati: ${CLASS_5_PIRUZ_STUDENTS.length})`);
assert(RAW_5PIRUZ.length === 40, `RAW_5PIRUZ mempunyai tepat 40 murid`);

// Semak nama dan id murid pertama dan terakhir
assert(CLASS_5_PIRUZ_STUDENTS[0].nama === 'Adam Hakimi', `Murid 1: Adam Hakimi`);
assert(CLASS_5_PIRUZ_STUDENTS[39].nama === 'Umar Hakimi', `Murid 40: Umar Hakimi`);

// Semak semua murid 5 Piruz
const all5PiruzClass = CLASS_5_PIRUZ_STUDENTS.every(s => s.kelas === '5 Piruz');
assert(all5PiruzClass, `Semua 40 murid mempunyai kelas '5 Piruz'`);

const allChallengesComplete = CLASS_5_PIRUZ_STUDENTS.every(s => s.progress?.completedChallenges === 9);
assert(allChallengesComplete, `Semua 40 murid telah selesai 9 cabaran (3 Arena, 3 Dapur, 3 Pixel)`);

const allCertsEarned = CLASS_5_PIRUZ_STUDENTS.every(s => s.progress?.certificateEarned === true);
assert(allCertsEarned, `Semua 40 murid layak menerima sijil`);

// ==========================================
// 2. SEMAK 15 SOALAN & 600 RESPONS 5 PIRUZ
// ==========================================
console.log('\n--- 2. SEMAK 15 SOALAN & 600 RESPONS 5 PIRUZ ---');
assert(INTERACTIVE_CLASS_15_QUESTIONS.length === 15, `Bank soalan mengandungi 15 soalan`);
assert(DEMO_600_RESPONSES_5PIRUZ.length === 600, `5 Piruz mempunyai tepat 600 respons (didapati: ${DEMO_600_RESPONSES_5PIRUZ.length})`);

const wrongClassResponses = DEMO_600_RESPONSES_5PIRUZ.filter(r => r.class !== '5 Piruz').length;
assert(wrongClassResponses === 0, `Semua 600 respons bertanda kelas '5 Piruz'`);

// ==========================================
// 3. SEMAK ANALISIS PRESTASI 5 PIRUZ
// ==========================================
console.log('\n--- 3. SEMAK ANALISIS PRESTASI 5 PIRUZ ---');
const studentInteractiveList = CLASS_5_PIRUZ_STUDENTS.map((st, idx) => ({
  studentId: `KP-${String(idx + 1).padStart(3, '0')}`,
  studentName: st.nama,
  class: '5 Piruz',
  cardId: `KP-${String(idx + 1).padStart(3, '0')}`,
  cardStatus: 'active' as const,
  createdAt: new Date().toISOString(),
}));

const analysisResults = analyzeAllStudents(studentInteractiveList, INTERACTIVE_CLASS_15_QUESTIONS, DEMO_SESSION_NESTED_ANSWERS_5PIRUZ);
assert(analysisResults.length === 40, `Analisis murid menghasilkan keputusan untuk 40 murid`);

const menguasaiCount = analysisResults.filter(r => r.totalAnswered > 0 && r.percentage >= 80).length;
const sedangMenguasaiCount = analysisResults.filter(r => r.totalAnswered > 0 && r.percentage >= 60 && r.percentage < 80).length;
const bimbinganCount = analysisResults.filter(r => r.totalAnswered > 0 && r.percentage < 60).length;

console.log(`📊 Taburan Prestasi 5 Piruz:`);
console.log(`🟢 Menguasai (>=80%): ${menguasaiCount}`);
console.log(`🟡 Sedang Menguasai (60-79%): ${sedangMenguasaiCount}`);
console.log(`🔴 Perlu Bimbingan (<60%): ${bimbinganCount}`);

assert(menguasaiCount >= 35, `Jumlah Menguasai memenuhi kriteria (35-36 murid)`);
assert(bimbinganCount === 0, `Tiada murid Perlu Bimbingan (0 murid)`);

const dskpAnalysis = analyzeDskpStandards(INTERACTIVE_CLASS_15_QUESTIONS, DEMO_SESSION_NESTED_ANSWERS_5PIRUZ);
assert(dskpAnalysis.length === 7, `Analisis DSKP meliputi 7 standard (3.1.1 - 3.1.7)`);

// ==========================================
// 4. SEMAK DATA 3 ASAH (LANGKAH 3)
// ==========================================
console.log('\n--- 4. SEMAK KELAS 3 ASAH (LANGKAH 3 - DATA DIPADAM TETAPI KELAS KEKAL) ---');
assert(CLASS_3_ASAH_STUDENTS.length === 0, `CLASS_3_ASAH_STUDENTS mempunyai 0 murid (didapati: ${CLASS_3_ASAH_STUDENTS.length})`);
assert(RAW_3ASAH.length === 0, `RAW_3ASAH mempunyai 0 murid (didapati: ${RAW_3ASAH.length})`);

// Pilihan kelas mesti kekal
assert(ALL_CLASSES.includes('3 Asah'), `'3 Asah' KEKAL dalam ALL_CLASSES`);
assert(ALL_CLASSES.includes('5 Piruz'), `'5 Piruz' ADA dalam ALL_CLASSES`);
assert(INTERACTIVE_CLASSES.includes('3 Asah'), `'3 Asah' KEKAL dalam INTERACTIVE_CLASSES (class selector)`);
assert(INTERACTIVE_CLASSES.includes('5 Piruz'), `'5 Piruz' ADA dalam INTERACTIVE_CLASSES (class selector)`);

// Respons untuk 3 Asah mesti 0
const answers3Asah = loadAnswersForDashboard('demo', '3 Asah');
const total3AsahAnswers = Object.keys(answers3Asah).length;
assert(total3AsahAnswers === 0, `Apabila memilih 3 Asah, respons adalah kosong (0 respons)`);

const answers5Piruz = loadAnswersForDashboard('demo', '5 Piruz');
let total5PiruzAnswers = 0;
Object.values(answers5Piruz).forEach(qMap => {
  total5PiruzAnswers += Object.keys(qMap).length;
});
assert(total5PiruzAnswers === 600, `Apabila memilih 5 Piruz, respons adalah 600 lengkap`);

// Semak seed kelas interaktif
const interactiveSeed = getAllInteractiveStudents();
const count5PiruzSeed = interactiveSeed.filter(s => s.class === '5 Piruz').length;
const count3AsahSeed = interactiveSeed.filter(s => s.class === '3 Asah').length;

assert(count5PiruzSeed === 40, `Murid 5 Piruz dalam Kelas Interaktif adalah tepat 40 orang`);
assert(count3AsahSeed === 0, `Murid 3 Asah dalam Kelas Interaktif adalah 0 orang`);

console.log('\n========================================');
if (pass) {
  console.log('🎉 SEMUA VERIFIKASI OPERASI MOVE BERJAYA DILAKSANAKAN DENGAN SEMPURNA!');
  console.log('✔️ Langkah 1: Copy data 3 Asah -> 5 Piruz (Berjaya)');
  console.log('✔️ Langkah 2: Verification data 5 Piruz lengkap dan tepat (Berjaya)');
  console.log('✔️ Langkah 3: Delete data murid 3 Asah, kelas 3 Asah kekal dengan 0 murid (Berjaya)');
} else {
  console.error('❌ Terdapat kegagalan semasa verifikasi.');
  process.exit(1);
}
