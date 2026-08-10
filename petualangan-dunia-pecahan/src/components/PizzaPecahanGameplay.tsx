import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft as ArrowLeftIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  Star as StarIcon,
  Trophy as TrophyIcon,
  Coins as CoinsIcon,
  Flame as FlameIcon,
  RotateCcw as RotateCcwIcon,
  MessageCircle as MessageCircleIcon,
  Check as CheckIcon,
  Sparkles as SparklesIcon,
  Heart as HeartIcon,
  AlertTriangle as AlertTriangleIcon,
  Home as HomeIcon,
} from 'lucide-react';
import { playSfx, togglePizzaBgm } from '../utils/audio';
import confetti from 'canvas-confetti';

// Import assets
import customerGirlImg from '../assets/images/customer_girl_1785465257470.jpg';
import customerBoyImg from '../assets/images/customer_boy_avatar_1785465559016.jpg';
import customerMomImg from '../assets/images/customer_mom_avatar_1785465573756.jpg';
import chefMascotImg from '../assets/images/chef_mascot_1785465244177.jpg';

interface PizzaPecahanGameplayProps {
  soundEnabled: boolean;
  onBackToCover: () => void;
  onToggleSound: () => void;
}

const RECORDS_STORAGE_KEY = 'pizza_pecahan_records_v1';

interface ShopRecords {
  pizzasMade: number;
  stars: number;
  coins: number;
  bestScore: number;
  bestCombo: number;
}

const DEFAULT_RECORDS: ShopRecords = {
  pizzasMade: 0,
  stars: 0,
  coins: 0,
  bestScore: 0,
  bestCombo: 0,
};

// Customers
interface Customer {
  id: string;
  name: string;
  title: string;
  image: string;
  bgGradient: string;
}

const CUSTOMERS: Customer[] = [
  { id: 'maya', name: 'Maya', title: 'Murid Tahun 3', image: customerGirlImg, bgGradient: 'from-pink-100 to-rose-200' },
  { id: 'adam', name: 'Adam', title: 'Murid Tahun 3', image: customerBoyImg, bgGradient: 'from-emerald-100 to-teal-200' },
  { id: 'ibu_aina', name: 'Ibu Aina', title: 'Ibu Penyayang', image: customerMomImg, bgGradient: 'from-amber-100 to-[#F6C7A8]' },
  { id: 'che_guru', name: 'Tukang Masak Cilik', title: 'Pembantu Kedai', image: chefMascotImg, bgGradient: 'from-orange-100 to-amber-200' },
];

// Toppings
interface Topping {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
}

const TOPPINGS: Topping[] = [
  { id: 'keju', name: 'Keju', emoji: '🧀', color: '#F4C95D', borderColor: '#dca625' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', color: '#E54B4B', borderColor: '#b82a2a' },
  { id: 'cendawan', name: 'Cendawan', emoji: '🍄', color: '#A08060', borderColor: '#6b5137' },
  { id: 'ayam', name: 'Ayam', emoji: '🍗', color: '#D98262', borderColor: '#a35032' },
  { id: 'jagung', name: 'Jagung', emoji: '🌽', color: '#F7D070', borderColor: '#c49c37' },
];

// Fraction Database for Order Generator with progressive difficulty
interface FractionOrder {
  numerator: number;
  denominator: number;
  topping: Topping;
  isAdditionMode?: boolean;
  additionParts?: { num: number; topping: Topping }[];
  isSubtractionMode?: boolean;
}

// Generate a random order based on progressive difficulty
function generateOrder(runCount: number): FractionOrder {
  const selectedTopping = TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)];

  // Stage 4: High difficulty (16+ completed pizzas) -> Addition/Subtraction
  if (runCount >= 15 && Math.random() < 0.4) {
    const denom = 4;
    const num1 = 1;
    const num2 = 2;
    const topping2 = TOPPINGS.find((t) => t.id !== selectedTopping.id) || TOPPINGS[1];
    return {
      numerator: num1 + num2,
      denominator: denom,
      topping: selectedTopping,
      isAdditionMode: true,
      additionParts: [
        { num: num1, topping: selectedTopping },
        { num: num2, topping: topping2 },
      ],
    };
  }

  // Stage 3: Medium-High difficulty (11-15 pizzas) -> Equivalent fractions (e.g. 1/2, 2/4, 2/6)
  if (runCount >= 10 && Math.random() < 0.45) {
    const eqOptions = [
      { num: 1, denom: 2 },
      { num: 2, denom: 4 },
      { num: 2, denom: 6 },
    ];
    const picked = eqOptions[Math.floor(Math.random() * eqOptions.length)];
    return {
      numerator: picked.num,
      denominator: picked.denom,
      topping: selectedTopping,
    };
  }

  // Stage 2: Medium difficulty (6-10 pizzas)
  if (runCount >= 5) {
    const medFractions = [
      { num: 2, denom: 3 },
      { num: 3, denom: 5 },
      { num: 4, denom: 5 },
      { num: 1, denom: 6 },
      { num: 3, denom: 6 },
      { num: 5, denom: 6 },
    ];
    const picked = medFractions[Math.floor(Math.random() * medFractions.length)];
    return {
      numerator: picked.num,
      denominator: picked.denom,
      topping: selectedTopping,
    };
  }

  // Stage 1: Basic fractions (0-5 pizzas)
  const baseFractions = [
    { num: 1, denom: 2 },
    { num: 1, denom: 3 },
    { num: 1, denom: 4 },
    { num: 2, denom: 4 },
    { num: 3, denom: 4 },
  ];

  const picked = baseFractions[Math.floor(Math.random() * baseFractions.length)];
  return {
    numerator: picked.num,
    denominator: picked.denom,
    topping: selectedTopping,
  };
}

export const PizzaPecahanGameplay: React.FC<PizzaPecahanGameplayProps> = ({
  soundEnabled,
  onBackToCover,
  onToggleSound,
}) => {
  // Saved Records
  const [records, setRecords] = useState<ShopRecords>(() => {
    try {
      const saved = localStorage.getItem(RECORDS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
    } catch {
      return DEFAULT_RECORDS;
    }
  });

  // Current Run Session States
  const [lives, setLives] = useState<number>(3);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentRunPizzas, setCurrentRunPizzas] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [bestRunCombo, setBestRunCombo] = useState<number>(0);
  const [coinsEarnedInRun, setCoinsEarnedInRun] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [heartShakeIndex, setHeartShakeIndex] = useState<number | null>(null);

  // BGM State
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pizza_pecahan_bgm_v1');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (bgmEnabled && soundEnabled) {
      togglePizzaBgm(true);
    } else {
      togglePizzaBgm(false);
    }
    return () => {
      togglePizzaBgm(false);
    };
  }, [bgmEnabled, soundEnabled]);

  const handleToggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    localStorage.setItem('pizza_pecahan_bgm_v1', JSON.stringify(next));
    playSfx('click', soundEnabled);
  };

  // Current Order & Customer State
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(CUSTOMERS[0]);
  const [order, setOrder] = useState<FractionOrder>(() => generateOrder(0));

  // Gameplay Steps: 1: Potong, 2: Pilih, 3: Topping, 4: Bakar, 5: Siap
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Pizza Slicing state
  const [slicedDenominator, setSlicedDenominator] = useState<number>(4);
  const [selectedSliceIndices, setSelectedSliceIndices] = useState<number[]>([]);
  const [addedTopping, setAddedTopping] = useState<Topping | null>(null);
  const [isBaked, setIsBaked] = useState<boolean>(false);

  // Feedback banner state
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>({
    text: 'Sila potong pizza mengikut pesanan penyebut!',
    type: 'info',
  });

  // Update localStorage helper
  const saveRecords = (newPizzasMadeInRun: number, newCoinsInRun: number, newCombo: number) => {
    setRecords((prev) => {
      const isNewBest = newPizzasMadeInRun > prev.bestScore;
      if (isNewBest) {
        setIsNewRecord(true);
      }
      const updated = {
        ...prev,
        pizzasMade: prev.pizzasMade + 1,
        coins: prev.coins + newCoinsInRun,
        bestScore: Math.max(prev.bestScore, newPizzasMadeInRun),
        bestCombo: Math.max(prev.bestCombo, newCombo),
      };
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Handle Heart Deduction on Mistake
  const handleDeductLife = (errorMessage: string) => {
    playSfx('lock', soundEnabled);
    setCombo(0); // Reset combo on mistake

    const nextLives = lives - 1;
    setHeartShakeIndex(nextLives);
    setTimeout(() => setHeartShakeIndex(null), 600);

    setLives(nextLives);

    if (nextLives <= 0) {
      // GAME OVER
      setIsGameOver(true);
      setFeedbackMessage({
        text: 'Masa bermain sudah tamat. Kamu telah kehabisan nyawa.',
        type: 'error',
      });
    } else {
      const lifeWarning = nextLives === 1 ? ' ⚠️ Hati-hati! Tinggal 1 nyawa.' : ` (Nyawa tinggal ${nextLives})`;
      setFeedbackMessage({
        text: `${errorMessage}${lifeWarning}`,
        type: 'error',
      });
    }
  };

  // Next order initialization
  const startNextOrder = () => {
    const nextCust = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const nextOrder = generateOrder(currentRunPizzas);
    setCurrentCustomer(nextCust);
    setOrder(nextOrder);
    setCurrentStep(1);
    setSlicedDenominator(nextOrder.denominator);
    setSelectedSliceIndices([]);
    setAddedTopping(null);
    setIsBaked(false);
    setFeedbackMessage({
      text: 'Pesanan baharu tiba! Potong pizza mengikut penyebut.',
      type: 'info',
    });
  };

  // Reset & Retry Game
  const handleRetryGame = () => {
    playSfx('click', soundEnabled);
    setLives(3);
    setCurrentScore(0);
    setCurrentRunPizzas(0);
    setCombo(0);
    setBestRunCombo(0);
    setCoinsEarnedInRun(0);
    setIsGameOver(false);
    setIsNewRecord(false);
    const firstOrder = generateOrder(0);
    setOrder(firstOrder);
    setCurrentStep(1);
    setSlicedDenominator(firstOrder.denominator);
    setSelectedSliceIndices([]);
    setAddedTopping(null);
    setIsBaked(false);
    setFeedbackMessage({
      text: 'Permainan diset semula! Pesanan pertama menunggu.',
      type: 'info',
    });
  };

  // STEP 1: Cut Pizza Action
  const handleCutPizza = (denom: number) => {
    const targetVal = order.numerator / order.denominator;
    // Check if the chosen denominator can accurately form the target fraction
    const possibleNumerator = targetVal * denom;

    if (Math.abs(Math.round(possibleNumerator) - possibleNumerator) > 0.001) {
      // Invalid slice count for this fraction!
      handleDeductLife(`Potongan ${denom} bahagian tidak sesuai untuk pecahan ${order.numerator}/${order.denominator}.`);
      return;
    }

    setSlicedDenominator(denom);
    setSelectedSliceIndices([]);
    playSfx('slice', soundEnabled);
    setCurrentStep(2);
    setFeedbackMessage({
      text: `Pizza dipotong kepada ${denom} bahagian! Sekarang pilih bahagian yang betul.`,
      type: 'info',
    });
  };

  // STEP 2: Toggle Slice Selection
  const handleSliceClick = (index: number) => {
    if (currentStep !== 2) return;
    playSfx('pop', soundEnabled);

    setSelectedSliceIndices((prev) => {
      const exists = prev.includes(index);
      let updated: number[];
      if (exists) {
        updated = prev.filter((i) => i !== index);
      } else {
        updated = [...prev, index];
      }

      setFeedbackMessage({
        text: `Kamu memilih ${updated.length}/${slicedDenominator} bahagian.`,
        type: 'info',
      });
      return updated;
    });
  };

  // STEP 2: Confirm Selected Slices
  const handleConfirmSlices = () => {
    const selectedCount = selectedSliceIndices.length;

    if (selectedCount === 0) {
      setFeedbackMessage({
        text: 'Sila klik kepingan pizza untuk memilih bahagian terlebih dahulu.',
        type: 'info',
      });
      return;
    }

    const currentFractionVal = selectedCount / slicedDenominator;
    const targetFractionVal = order.numerator / order.denominator;

    if (Math.abs(currentFractionVal - targetFractionVal) < 0.001) {
      playSfx('chime', soundEnabled);
      setCurrentStep(3);
      setFeedbackMessage({
        text: `Tepat sekali! Pecahan ${selectedCount}/${slicedDenominator} adalah betul. Tambah topping ${order.topping.name}!`,
        type: 'success',
      });
    } else if (currentFractionVal < targetFractionVal) {
      handleDeductLife(`Belum tepat. Kamu memilih terlalu sedikit bahagian (${selectedCount}/${slicedDenominator}).`);
    } else {
      handleDeductLife(`Ops! Kamu memilih terlalu banyak bahagian (${selectedCount}/${slicedDenominator}).`);
    }
  };

  // STEP 3: Add Topping
  const handleAddTopping = (topping: Topping) => {
    if (currentStep !== 3) return;
    playSfx('pop', soundEnabled);
    setAddedTopping(topping);

    if (topping.id === order.topping.id) {
      setFeedbackMessage({
        text: `Topping ${topping.name} ${topping.emoji} ditambah! Tekan "MASUKKAN KE KETUHAR".`,
        type: 'success',
      });
    } else {
      handleDeductLife(`Topping salah! Pelanggan minta ${order.topping.name} ${order.topping.emoji}.`);
    }
  };

  // STEP 4: Bake Pizza Action
  const handleBakePizza = () => {
    if (!addedTopping || addedTopping.id !== order.topping.id) {
      handleDeductLife(`Sila tambah topping ${order.topping.name} ${order.topping.emoji} dahulu.`);
      return;
    }

    playSfx('oven', soundEnabled);
    setCurrentStep(4);
    setFeedbackMessage({
      text: 'Pizza sedang dibakar dalam ketuhar... 🔥',
      type: 'info',
    });

    setTimeout(() => {
      setIsBaked(true);
      playSfx('chime', soundEnabled);
      setCurrentStep(5);
      handleDeliverOrder();
    }, 1300);
  };

  // STEP 5: Deliver Order & Update Stats
  const handleDeliverOrder = () => {
    playSfx('coin', soundEnabled);
    const newCombo = combo + 1;
    setCombo(newCombo);

    if (newCombo > bestRunCombo) {
      setBestRunCombo(newCombo);
    }

    const pizzaPoints = 15 + newCombo * 5;
    const coinsEarned = 5 + (newCombo > 1 ? newCombo * 2 : 0);

    const updatedRunPizzas = currentRunPizzas + 1;
    setCurrentRunPizzas(updatedRunPizzas);
    setCurrentScore((prev) => prev + pizzaPoints);
    setCoinsEarnedInRun((prev) => prev + coinsEarned);

    saveRecords(updatedRunPizzas, coinsEarned, newCombo);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setFeedbackMessage({
      text: `Pesanan Siap! +${pizzaPoints} Mata ⭐ +${coinsEarned} Syiling 🪙 (Kombo 🔥 x${newCombo})`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#4A3728] flex flex-col relative overflow-x-hidden selection:bg-[#F6C7A8]">
      
      {/* 1. TOP HEADER WITH LIVES, SCORE & STATS */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-[#3c4233] text-white shadow-md border-b border-[#2d3226]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left branding & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                onBackToCover();
              }}
              className="flex items-center gap-1.5 bg-[#2d3226] hover:bg-[#23271e] text-amber-200 px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>KEMBALI KE DUNIA PENGEMBARAAN</span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl leading-none">🍕</span>
              <div>
                <span className="font-serif-title font-bold text-base text-white tracking-wide block leading-none">
                  PIZZA PECAHAN
                </span>
                <span className="text-[10px] text-amber-200/90 font-medium block leading-tight">
                  Kedai Pizza Tak Pernah Tutup!
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right Game HUD: LIVES, SCORE, COMBO, COINS */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            
            {/* LIVES BAR (3 HEARTS) */}
            <div className="flex items-center gap-1 bg-[#23271e] px-3 py-1.5 rounded-xl border border-rose-900/60 shadow-inner">
              {[0, 1, 2].map((idx) => {
                const isAlive = idx < lives;
                const isShaking = heartShakeIndex === idx;
                return (
                  <motion.span
                    key={idx}
                    animate={isShaking ? { scale: [1, 1.4, 0.8, 1], rotate: [0, -15, 15, 0] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg leading-none"
                  >
                    {isAlive ? '❤️' : '🖤'}
                  </motion.span>
                );
              })}
            </div>

            {/* Current Score / Pizzas */}
            <div className="flex items-center gap-1 bg-[#2d3226] px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold text-amber-300">
              <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{currentScore} Mata</span>
            </div>

            {/* Combo Counter */}
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
              combo > 0 ? 'bg-orange-950/80 border-orange-600 text-orange-400 animate-pulse' : 'bg-[#2d3226] border-[#4d5442] text-gray-400'
            }`}>
              <FlameIcon className={`w-4 h-4 ${combo > 0 ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} />
              <span>Kombo ×{combo}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 bg-[#2d3226] px-3 py-1.5 rounded-xl border border-[#4d5442] text-xs sm:text-sm font-bold text-amber-400">
              <CoinsIcon className="w-4 h-4 text-amber-400" />
              <span>{records.coins + coinsEarnedInRun}</span>
            </div>

            {/* Audio Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleBgm}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                bgmEnabled
                  ? 'bg-emerald-800/80 border-emerald-600 text-emerald-100'
                  : 'bg-[#2d3226] border-[#4d5442] text-gray-400'
              }`}
            >
              {bgmEnabled ? <Volume2Icon className="w-4 h-4 text-emerald-300" /> : <VolumeXIcon className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* GAMEPLAY CONTENT MAIN WRAPPER */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-5">
        
        {/* TOP SECTION: CUSTOMER SPEECH BUBBLE & ORDER */}
        <section className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#F6C7A8] shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Customer Avatar & Badge */}
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#F4C95D] shadow-md bg-gradient-to-br ${currentCustomer.bgGradient} flex-shrink-0`}>
                <img
                  src={currentCustomer.image}
                  alt={currentCustomer.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#D98262] bg-[#D98262]/10 px-2.5 py-0.5 rounded-md">
                  PESANAN #{currentRunPizzas + 1}
                </span>
                <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#4A3728]">
                  {currentCustomer.name}
                </h2>
                <span className="text-xs text-[#4A3728]/70 font-medium block">
                  {currentCustomer.title}
                </span>
              </div>
            </div>

            {/* Customer Speech Order */}
            <div className="flex-1 w-full bg-[#FFF8E8] p-4 rounded-2xl border-2 border-[#F4C95D] relative shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  <p className="font-serif-title font-bold text-lg sm:text-xl text-[#4A3728]">
                    “Saya mahu{' '}
                    <span className="text-[#D98262] font-black underline decoration-wavy text-2xl px-1">
                      {order.numerator}/{order.denominator}
                    </span>{' '}
                    pizza {order.topping.name} {order.topping.emoji}!”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE & PIZZA CANVAS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* LEFT: STEP BY STEP CONTROLS */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-2 border-[#F6C7A8] shadow-lg flex flex-col gap-4">
            <h3 className="font-serif-title font-bold text-lg text-[#4A3728] flex items-center gap-2">
              <span className="text-xl">👩‍🍳</span> LANGKAH MEMBUAT PIZZA
            </h3>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                { step: 1, label: 'Potong' },
                { step: 2, label: 'Pilih' },
                { step: 3, label: 'Topping' },
                { step: 4, label: 'Bakar' },
                { step: 5, label: 'Siap' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`py-1.5 rounded-xl font-rounded font-bold text-[11px] transition-all ${
                    currentStep === s.step
                      ? 'bg-[#D98262] text-white shadow-md ring-2 ring-[#D98262]/30'
                      : currentStep > s.step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#FFF8E8] text-[#4A3728]/50 border border-[#F6C7A8]'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* STEP 1: CUT PIZZA */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3 bg-[#FFF8E8] rounded-2xl border border-[#F4C95D] text-xs font-medium text-[#4A3728]">
                  <p className="font-bold text-[#D98262] text-sm mb-1">🔪 LANGKAH 1: POTONG PIZZA</p>
                  Pilih berapa bahagian pizza nak dipotong. Penyebut pesanan ialah <strong>{order.denominator}</strong>.
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4A3728] block">Pilih Bilangan Bahagian (Penyebut):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 3, 4, 5, 6, 8].map((denom) => (
                      <button
                        key={denom}
                        onClick={() => setSlicedDenominator(denom)}
                        className={`py-2.5 rounded-xl font-rounded font-bold text-sm border-2 cursor-pointer transition-all ${
                          slicedDenominator === denom
                            ? 'bg-[#F4C95D] border-[#dca625] text-[#4A3728] shadow-md scale-105'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50'
                        }`}
                      >
                        {denom} Bahagian
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCutPizza(slicedDenominator)}
                  className="w-full py-3.5 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-base shadow-md border-b-4 border-[#9a4b2e] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-xl">🔪</span>
                  <span>POTONG PIZZA SEKARANG</span>
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: SELECT SLICES */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3 bg-[#FFF8E8] rounded-2xl border border-[#F4C95D] text-xs font-medium text-[#4A3728]">
                  <p className="font-bold text-[#D98262] text-sm mb-1">🟨 LANGKAH 2: PILIH BAHAGIAN</p>
                  Klik pada kepingan pizza untuk memilih. Sasaran: <strong>{order.numerator}/{order.denominator}</strong>.
                </div>

                <div className="p-3 bg-white rounded-xl border-2 border-[#F6C7A8] text-center">
                  <span className="text-xs font-bold text-gray-500 block">Kiraan Bahagian Dipilih</span>
                  <span className="font-serif-title font-extrabold text-3xl text-[#D98262]">
                    {selectedSliceIndices.length} / {slicedDenominator}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      setSelectedSliceIndices([]);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-rounded font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcwIcon className="w-4 h-4" />
                    <span>BATAL PILIHAN</span>
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmSlices}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-rounded font-bold text-xs shadow-md border-b-4 border-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>SAHKAN PECAHAN</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ADD TOPPING */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-3 bg-[#FFF8E8] rounded-2xl border border-[#F4C95D] text-xs font-medium text-[#4A3728]">
                  <p className="font-bold text-[#D98262] text-sm mb-1">🧀 LANGKAH 3: TAMBAH TOPPING</p>
                  Pelanggan minta topping <strong>{order.topping.name} {order.topping.emoji}</strong>.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {TOPPINGS.map((top) => {
                    const isTarget = top.id === order.topping.id;
                    const isSelected = addedTopping?.id === top.id;
                    return (
                      <button
                        key={top.id}
                        onClick={() => handleAddTopping(top)}
                        className={`p-2.5 rounded-2xl border-2 font-rounded font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#D98262] text-white border-[#9a4b2e] shadow-md scale-105'
                            : isTarget
                            ? 'bg-amber-100 border-[#F4C95D] text-[#4A3728] ring-2 ring-[#F4C95D]'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{top.emoji}</span>
                        <span>{top.name}</span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBakePizza}
                  className="w-full py-3.5 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-base shadow-md border-b-4 border-[#9a4b2e] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="text-xl">🔥</span>
                  <span>MASUKKAN KE KETUHAR</span>
                </motion.button>
              </motion.div>
            )}

            {/* STEP 4 & 5: BAKING & DELIVERED */}
            {(currentStep === 4 || currentStep === 5) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-4">
                {currentStep === 4 ? (
                  <div className="space-y-3">
                    <div className="text-5xl animate-bounce">🔥</div>
                    <h4 className="font-serif-title font-bold text-xl text-[#D98262]">PIZZA SEDANG DIBAKAR...</h4>
                    <p className="text-xs text-gray-500">Ketuhar sedang membakar keju sehingga keperangan!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-5xl">📦 ✨</div>
                    <h4 className="font-serif-title font-bold text-2xl text-emerald-600">PESANAN SIAP!</h4>
                    <p className="text-sm font-bold text-[#4A3728]">“Terima kasih! Sedapnya! 😋”</p>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        startNextOrder();
                      }}
                      className="w-full py-3.5 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-base shadow-lg border-b-4 border-[#9a4b2e] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <SparklesIcon className="w-5 h-5 text-amber-200 animate-spin" />
                      <span>PESANAN SETERUSNYA</span>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Feedback Banner */}
            {feedbackMessage && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold border flex items-start gap-2 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : feedbackMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-[#FFF8E8] border-[#F4C95D] text-[#4A3728]'
                }`}
              >
                <span className="text-base flex-shrink-0">
                  {feedbackMessage.type === 'success' ? '🎉' : feedbackMessage.type === 'error' ? '💔' : 'ℹ️'}
                </span>
                <span>{feedbackMessage.text}</span>
              </div>
            )}
          </div>

          {/* RIGHT / CENTER: DYNAMIC PIZZA CANVAS */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border-2 border-[#F6C7A8] shadow-lg flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
            {/* Background Canvas Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8E8]/40 to-[#F6C7A8]/20 pointer-events-none" />

            {/* Instruction Banner above Canvas */}
            <div className="mb-4 text-center z-10">
              <span className="bg-[#4A3728] text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                MEJA MEMBUAT PIZZA
              </span>
              <p className="text-xs text-[#4A3728]/70 font-medium mt-1">
                {currentStep === 1
                  ? 'Potong pizza mengikut bilangan bahagian!'
                  : currentStep === 2
                  ? `Klik kepingan pizza untuk memilih (${selectedSliceIndices.length}/${slicedDenominator})`
                  : currentStep === 3
                  ? 'Tambah topping pada bahagian yang dipotong!'
                  : currentStep === 4
                  ? 'Pizza sedang dibakar...'
                  : 'Pizza sudah siap dibakar!'}
              </p>
            </div>

            {/* Interactive SVG Pizza Rendering */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center z-10">
              <svg viewBox="0 0 300 300" className="w-full h-full filter drop-shadow-2xl">
                {/* Outer Crust Ring */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="#D98262"
                  stroke="#a35032"
                  strokeWidth="6"
                />
                {/* Inner Sauce Base */}
                <circle
                  cx="150"
                  cy="150"
                  r="126"
                  fill={isBaked ? '#e86237' : '#E54B4B'}
                  stroke="#b82a2a"
                  strokeWidth="3"
                />

                {/* Slices rendering */}
                {Array.from({ length: slicedDenominator }).map((_, i) => {
                  const anglePerSlice = 360 / slicedDenominator;
                  const startAngle = i * anglePerSlice - 90;
                  const endAngle = (i + 1) * anglePerSlice - 90;

                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = 150 + 120 * Math.cos(startRad);
                  const y1 = 150 + 120 * Math.sin(startRad);
                  const x2 = 150 + 120 * Math.cos(endRad);
                  const y2 = 150 + 120 * Math.sin(endRad);

                  const isSelected = selectedSliceIndices.includes(i);
                  const pathData = `M 150 150 L ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} Z`;

                  // Center point of slice for topping sprinkles
                  const midAngle = startAngle + anglePerSlice / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const toppingX = 150 + 75 * Math.cos(midRad);
                  const toppingY = 150 + 75 * Math.sin(midRad);

                  return (
                    <g key={i} onClick={() => handleSliceClick(i)} className="cursor-pointer group">
                      <path
                        d={pathData}
                        fill={
                          isSelected
                            ? isBaked
                              ? '#F7D070'
                              : '#F4C95D'
                            : isBaked
                            ? '#f2b57c'
                            : '#FFF8E8'
                        }
                        stroke="#4A3728"
                        strokeWidth="2.5"
                        className="transition-all duration-200 group-hover:opacity-90"
                        style={{
                          transformOrigin: '150px 150px',
                          transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                        }}
                      />

                      {/* Selected Highlight Overlay */}
                      {isSelected && (
                        <path
                          d={pathData}
                          fill="rgba(244, 201, 93, 0.35)"
                          stroke="#D98262"
                          strokeWidth="3"
                        />
                      )}

                      {/* Render Topping Icons on selected slices */}
                      {addedTopping && isSelected && (
                        <text
                          x={toppingX}
                          y={toppingY}
                          fontSize="24"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="pointer-events-none select-none drop-shadow-md"
                        >
                          {addedTopping.emoji}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Center Circle */}
                <circle cx="150" cy="150" r="8" fill="#4A3728" />
              </svg>

              {/* Fraction Badge Overlay on Pizza */}
              <div className="absolute -bottom-3 bg-[#4A3728] text-amber-200 px-4 py-1.5 rounded-full shadow-lg border-2 border-[#F4C95D] font-serif-title font-bold text-sm">
                {selectedSliceIndices.length} / {slicedDenominator} Bahagian Dipilih
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 7. GAME OVER MODAL SCREEN */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="bg-[#FFF8E8] rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-[#D98262] text-center shadow-2xl relative overflow-hidden"
            >
              {/* Mascot / Pizza Surprised Graphic */}
              <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-[#F4C95D] mx-auto flex items-center justify-center text-5xl mb-3 shadow-inner relative">
                <img src={chefMascotImg} alt="Chef" className="w-full h-full object-cover rounded-xl" />
                <span className="absolute -bottom-2 -right-2 text-2xl">🍕</span>
              </div>

              <h3 className="font-serif-title font-extrabold text-2xl sm:text-3xl text-[#4A3728] mb-1">
                🍕 OPS! MASA BERMAIN SUDAH TAMAT
              </h3>

              {/* Empty Hearts readout */}
              <div className="flex items-center justify-center gap-1 my-2">
                <span className="text-2xl">🖤</span>
                <span className="text-2xl">🖤</span>
                <span className="text-2xl">🖤</span>
              </div>

              <p className="text-xs sm:text-sm text-[#4A3728]/80 font-bold mb-4">
                “Kamu telah kehabisan nyawa. Tidak mengapa! Cuba lagi, chef! 🍕”
              </p>

              {/* New Record Banner */}
              {isNewRecord && (
                <div className="mb-4 py-2 px-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-xl font-bold text-xs shadow-md animate-bounce flex items-center justify-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-amber-200" />
                  <span>🎉 REKOD BAHARU! Hebat, kamu telah memecahkan rekod sendiri!</span>
                </div>
              )}

              {/* Run Summary Statistics Card */}
              <div className="grid grid-cols-2 gap-2 bg-white p-4 rounded-2xl border-2 border-[#F6C7A8] text-center mb-6 shadow-inner">
                <div className="p-2 bg-[#FFF8E8] rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-gray-500 block">⭐ Mata</span>
                  <span className="font-serif-title font-extrabold text-lg text-[#4A3728]">{currentScore}</span>
                </div>

                <div className="p-2 bg-[#FFF8E8] rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-gray-500 block">🍕 Pizza Siap</span>
                  <span className="font-serif-title font-extrabold text-lg text-[#D98262]">{currentRunPizzas}</span>
                </div>

                <div className="p-2 bg-[#FFF8E8] rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-gray-500 block">🔥 Kombo Terbaik</span>
                  <span className="font-serif-title font-extrabold text-lg text-orange-600">×{bestRunCombo}</span>
                </div>

                <div className="p-2 bg-[#FFF8E8] rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-gray-500 block">🪙 Syiling Terkumpul</span>
                  <span className="font-serif-title font-extrabold text-lg text-amber-700">{records.coins}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRetryGame}
                  className="w-full py-3.5 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-extrabold text-sm sm:text-base shadow-lg border-b-4 border-[#9a4b2e] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcwIcon className="w-5 h-5" />
                  <span>🔄 CUBA LAGI</span>
                </motion.button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    onBackToCover();
                  }}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-amber-50 text-[#4A3728] font-rounded font-bold text-xs sm:text-sm border-2 border-[#F6C7A8] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <HomeIcon className="w-4 h-4 text-[#D98262]" />
                  <span>🏠 KEMBALI KE DUNIA PENGEMBARAAN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
