export interface InteractiveClassQuestion {
  questionId: string;
  dskpCode: string;
  difficultyLevel: 'mudah' | 'sederhana' | 'mencabar';
  difficultyName: string;
  difficulty?: 'mudah' | 'sederhana' | 'susah';
  questionType?: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  correctAnswerLetter: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  visualType: 'object_group' | 'fraction_bar' | 'equivalent_bars' | 'operation_bars' | 'percentage_grid' | 'mixed_or_improper' | 'pizza_fraction';
  visualData: Record<string, any>;
  hint?: string;
}

/**
 * BANK 15 SOALAN KSSR MATEMATIK TAHUN 3 (DSKP 3.1)
 * 
 * Pecahan Mengikut Standard Pembelajaran:
 * - 3.1.1 (2 soalan): Q01, Q02
 * - 3.1.2 (2 soalan): Q03, Q05
 * - 3.1.3 (2 soalan): Q06, Q07
 * - 3.1.4 (1 soalan): Q04
 * - 3.1.5 (3 soalan): Q08, Q11, Q12
 * - 3.1.6 (3 soalan): Q09, Q13, Q14
 * - 3.1.7 (2 soalan): Q10, Q15
 * 
 * Agihan Tahap Kesukaran:
 * 🟢 Mudah: 4 Soalan (Q01 - Q04)
 * 🟡 Sederhana: 6 Soalan (Q05 - Q10)
 * 🔴 Susah: 5 Soalan (Q11 - Q15)
 * Jumlah = 15 Soalan Tepat
 */
export const INTERACTIVE_CLASS_15_QUESTIONS: InteractiveClassQuestion[] = [
  // =========================================================================
  // 🟢 4 SOALAN MUDAH (Q01 - Q04)
  // =========================================================================
  {
    questionId: 'CLASS_Q01',
    dskpCode: '3.1.1',
    difficultyLevel: 'mudah',
    difficultyName: 'Mudah',
    difficulty: 'mudah',
    questionType: 'identify_fraction',
    question: 'Ada 8 epal.\n3 berwarna merah.\n\nApakah pecahan epal merah?',
    options: ['3/8', '5/8', '3/5', '8/3'],
    correctAnswer: '3/8',
    correctAnswerLetter: 'A',
    explanation: '3 daripada 8 epal berwarna merah = 3/8.',
    hint: 'Kira semua epal dahulu.',
    visualType: 'object_group',
    visualData: {
      objectType: 'apple',
      totalObjects: 8,
      total: 8,
      highlightedObjects: 3,
      highlighted: 3,
      highlightLabel: 'merah',
    },
  },
  {
    questionId: 'CLASS_Q02',
    dskpCode: '3.1.1',
    difficultyLevel: 'mudah',
    difficultyName: 'Mudah',
    difficulty: 'mudah',
    questionType: 'identify_fraction',
    question: 'Ada 6 biji bola.\n2 biji berwarna biru.\n\nApakah pecahan bola biru?',
    options: ['4/6', '2/6', '2/4', '6/2'],
    correctAnswer: '2/6',
    correctAnswerLetter: 'B',
    explanation: '2 daripada 6 bola adalah biru = 2/6.',
    hint: 'Kira bilangan bola biru berbanding jumlah semua bola.',
    visualType: 'object_group',
    visualData: {
      objectType: 'ball',
      totalObjects: 6,
      total: 6,
      highlightedObjects: 2,
      highlighted: 2,
      highlightLabel: 'biru',
    },
  },
  {
    questionId: 'CLASS_Q03',
    dskpCode: '3.1.2',
    difficultyLevel: 'mudah',
    difficultyName: 'Mudah',
    difficulty: 'mudah',
    questionType: 'equivalent_fraction',
    question: 'Mana satu pecahan setara bagi 1/2?',
    options: ['1/4', '3/4', '2/4', '2/3'],
    correctAnswer: '2/4',
    correctAnswerLetter: 'C',
    explanation: '1/2 sama nilai dengan 2/4 (panjang kedua-dua bahagian adalah sama).',
    hint: 'Panjang jalur 1/2 sama dengan jalur 2/4.',
    visualType: 'equivalent_bars',
    visualData: {
      bar1: { numerator: 1, denominator: 2, label: '1/2' },
      bar2: { numerator: 2, denominator: 4, label: '2/4' },
    },
  },
  {
    questionId: 'CLASS_Q04',
    dskpCode: '3.1.4',
    difficultyLevel: 'mudah',
    difficultyName: 'Mudah',
    difficulty: 'mudah',
    questionType: 'percentage',
    question: 'Pecahan 1/4 bersamaan dengan berapa peratus?',
    options: ['50%', '75%', '10%', '25%'],
    correctAnswer: '25%',
    correctAnswerLetter: 'D',
    explanation: '1/4 bersamaan dengan 25 daripada 100 bahagian, iaitu 25%.',
    hint: '1 daripada 4 bahagian petak 100 ialah 25.',
    visualType: 'percentage_grid',
    visualData: {
      highlighted: 25,
      highlightedCells: 25,
      label: '25%',
    },
  },

  // =========================================================================
  // 🟡 6 SOALAN SEDERHANA (Q05 - Q10)
  // =========================================================================
  {
    questionId: 'CLASS_Q05',
    dskpCode: '3.1.2',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'equivalent_fraction',
    question: 'Mana satu pecahan setara bagi 2/3?',
    options: ['4/6', '2/6', '3/6', '5/6'],
    correctAnswer: '4/6',
    correctAnswerLetter: 'A',
    explanation: '2/3 sama nilai dengan 4/6 (darab 2 pada nombor atas dan bawah).',
    hint: 'Darab pengangka dan penyebut dengan 2.',
    visualType: 'equivalent_bars',
    visualData: {
      bar1: { numerator: 2, denominator: 3, label: '2/3' },
      bar2: { numerator: 4, denominator: 6, label: '4/6' },
    },
  },
  {
    questionId: 'CLASS_Q06',
    dskpCode: '3.1.3',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'simplest_form',
    question: 'Tukar 2/4 kepada bentuk termudah:',
    options: ['1/4', '1/2', '2/2', '3/4'],
    correctAnswer: '1/2',
    correctAnswerLetter: 'B',
    explanation: 'Bahagikan atas dan bawah dengan 2: 2÷2 = 1, 4÷2 = 2 (1/2).',
    hint: 'Bahagi 2/4 dengan nombor 2.',
    visualType: 'equivalent_bars',
    visualData: {
      bar1: { numerator: 2, denominator: 4, label: '2/4' },
      bar2: { numerator: 1, denominator: 2, label: '1/2 (Termudah)' },
    },
  },
  {
    questionId: 'CLASS_Q07',
    dskpCode: '3.1.3',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'simplest_form',
    question: 'Tukar 3/6 kepada bentuk termudah:',
    options: ['1/3', '2/3', '1/2', '1/6'],
    correctAnswer: '1/2',
    correctAnswerLetter: 'C',
    explanation: 'Bahagikan atas dan bawah dengan 3: 3÷3 = 1, 6÷3 = 2 (1/2).',
    hint: 'Bahagi pengangka dan penyebut dengan 3.',
    visualType: 'equivalent_bars',
    visualData: {
      bar1: { numerator: 3, denominator: 6, label: '3/6' },
      bar2: { numerator: 1, denominator: 2, label: '1/2 (Termudah)' },
    },
  },
  {
    questionId: 'CLASS_Q08',
    dskpCode: '3.1.5',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'addition',
    question: 'Hitungkan:\n2/7 + 3/7 = ?',
    options: ['5/14', '1/7', '6/7', '5/7'],
    correctAnswer: '5/7',
    correctAnswerLetter: 'D',
    explanation: 'Penyebut sama 7: tambah nombor atas 2 + 3 = 5/7.',
    hint: 'Penyebut kekal 7, cuma tambah nombor atas.',
    visualType: 'operation_bars',
    visualData: {
      operation: '+',
      fraction1: { num: 2, den: 7 },
      fraction2: { num: 3, den: 7 },
      commonDenom: 7,
      resultFraction: { num: 5, den: 7 },
    },
  },
  {
    questionId: 'CLASS_Q09',
    dskpCode: '3.1.6',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'subtraction',
    question: 'Hitungkan:\n6/8 − 2/8 = ?',
    options: ['4/8', '8/8', '4/0', '3/8'],
    correctAnswer: '4/8',
    correctAnswerLetter: 'A',
    explanation: 'Penyebut sama 8: tolak nombor atas 6 − 2 = 4/8.',
    hint: 'Penyebut kekal 8, cuma tolak nombor atas.',
    visualType: 'operation_bars',
    visualData: {
      operation: '-',
      fraction1: { num: 6, den: 8 },
      fraction2: { num: 2, den: 8 },
      commonDenom: 8,
      resultFraction: { num: 4, den: 8 },
    },
  },
  {
    questionId: 'CLASS_Q10',
    dskpCode: '3.1.7',
    difficultyLevel: 'sederhana',
    difficultyName: 'Sederhana',
    difficulty: 'sederhana',
    questionType: 'mixed_number',
    question: 'Rajah menunjukkan 1 bahagian penuh dan 1/4 bahagian.\n\nApakah nombor bercampurnya?',
    options: ['2 1/4', '1 1/4', '1 3/4', '5/4'],
    correctAnswer: '1 1/4',
    correctAnswerLetter: 'B',
    explanation: '1 objek penuh dan 1/4 objek ditulis sebagai 1 1/4.',
    hint: 'Tulis nombor bulat dahulu, kemudian pecahan wajar.',
    visualType: 'mixed_or_improper',
    visualData: {
      whole: 1,
      numerator: 1,
      denominator: 4,
      partsPerWhole: 4,
      improperNumerator: 5,
    },
  },

  // =========================================================================
  // 🔴 5 SOALAN SUSAH (Q11 - Q15)
  // =========================================================================
  {
    questionId: 'CLASS_Q11',
    dskpCode: '3.1.5',
    difficultyLevel: 'mencabar',
    difficultyName: 'Susah',
    difficulty: 'susah',
    questionType: 'addition',
    question: 'Hitungkan:\n1/2 + 1/4 = ?',
    options: ['2/6', '2/4', '3/4', '1/4'],
    correctAnswer: '3/4',
    correctAnswerLetter: 'C',
    explanation: 'Samakan penyebut: 1/2 = 2/4. Kemudian 2/4 + 1/4 = 3/4.',
    hint: 'Tukar 1/2 kepada penyebut 4 dahulu (darab 2).',
    visualType: 'operation_bars',
    visualData: {
      operation: '+',
      fraction1: { num: 1, den: 2 },
      fraction2: { num: 1, den: 4 },
      commonDenom: 4,
      resultFraction: { num: 3, den: 4 },
    },
  },
  {
    questionId: 'CLASS_Q12',
    dskpCode: '3.1.5',
    difficultyLevel: 'mencabar',
    difficultyName: 'Susah',
    difficulty: 'susah',
    questionType: 'addition',
    question: 'Hitungkan:\n1/3 + 2/9 = ?',
    options: ['3/12', '3/9', '4/9', '5/9'],
    correctAnswer: '5/9',
    correctAnswerLetter: 'D',
    explanation: 'Samakan penyebut: 1/3 = 3/9. Kemudian 3/9 + 2/9 = 5/9.',
    hint: 'Tukar 1/3 kepada penyebut 9 dahulu (darab 3).',
    visualType: 'operation_bars',
    visualData: {
      operation: '+',
      fraction1: { num: 1, den: 3 },
      fraction2: { num: 2, den: 9 },
      commonDenom: 9,
      resultFraction: { num: 5, den: 9 },
    },
  },
  {
    questionId: 'CLASS_Q13',
    dskpCode: '3.1.6',
    difficultyLevel: 'mencabar',
    difficultyName: 'Susah',
    difficulty: 'susah',
    questionType: 'subtraction',
    question: 'Hitungkan:\n3/4 − 1/2 = ?',
    options: ['1/4', '2/2', '2/4', '1/2'],
    correctAnswer: '1/4',
    correctAnswerLetter: 'A',
    explanation: 'Samakan penyebut: 1/2 = 2/4. Kemudian 3/4 − 2/4 = 1/4.',
    hint: 'Tukar 1/2 menjadi 2/4, kemudian tolak.',
    visualType: 'operation_bars',
    visualData: {
      operation: '-',
      fraction1: { num: 3, den: 4 },
      fraction2: { num: 1, den: 2 },
      commonDenom: 4,
      resultFraction: { num: 1, den: 4 },
    },
  },
  {
    questionId: 'CLASS_Q14',
    dskpCode: '3.1.6',
    difficultyLevel: 'mencabar',
    difficultyName: 'Susah',
    difficulty: 'susah',
    questionType: 'subtraction',
    question: 'Hitungkan:\n4/5 − 3/10 = ?',
    options: ['1/5', '5/10', '1/10', '7/10'],
    correctAnswer: '5/10',
    correctAnswerLetter: 'B',
    explanation: 'Samakan penyebut: 4/5 = 8/10. Kemudian 8/10 − 3/10 = 5/10.',
    hint: 'Tukar 4/5 menjadi penyebut 10 (darab 2).',
    visualType: 'operation_bars',
    visualData: {
      operation: '-',
      fraction1: { num: 4, den: 5 },
      fraction2: { num: 3, den: 10 },
      commonDenom: 10,
      resultFraction: { num: 5, den: 10 },
    },
  },
  {
    questionId: 'CLASS_Q15',
    dskpCode: '3.1.7',
    difficultyLevel: 'mencabar',
    difficultyName: 'Susah',
    difficulty: 'susah',
    questionType: 'mixed_or_improper',
    question: 'Tukar pecahan tak wajar 7/5 kepada nombor bercampur:',
    options: ['1 3/5', '2 1/5', '1 2/5', '1 1/5'],
    correctAnswer: '1 2/5',
    correctAnswerLetter: 'C',
    explanation: '7/5 = 5/5 + 2/5 = 1 2/5.',
    hint: '7 dibahagi 5 dapat 1 baki 2.',
    visualType: 'mixed_or_improper',
    visualData: {
      whole: 1,
      numerator: 2,
      denominator: 5,
      partsPerWhole: 5,
      improperNumerator: 7,
    },
  },
];

// Backwards compatibility alias:
export const INTERACTIVE_CLASS_30_QUESTIONS: InteractiveClassQuestion[] = INTERACTIVE_CLASS_15_QUESTIONS;

/**
 * Helper to shuffle the 15 questions order while preserving all data.
 */
export function shuffleQuestions(questions: InteractiveClassQuestion[]): InteractiveClassQuestion[] {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Helper to shuffle question options A/B/C/D while keeping correctAnswer string
 * and recalculating correctAnswerLetter.
 */
export function shuffleQuestionOptions(q: InteractiveClassQuestion): InteractiveClassQuestion {
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const shuffledOptions = [...q.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  const newIndex = shuffledOptions.indexOf(q.correctAnswer);
  const newLetter = newIndex >= 0 ? letters[newIndex] : q.correctAnswerLetter;

  return {
    ...q,
    options: shuffledOptions as [string, string, string, string],
    correctAnswerLetter: newLetter,
  };
}
