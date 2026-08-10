import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Heart,
  Star,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  X,
  Home,
  CheckCircle2,
  Lock,
  Coins,
  Award,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageCircle,
  Compass,
} from 'lucide-react';
import { playSfx, toggleDuniaPixelBgm } from '../utils/audio';
import confetti from 'canvas-confetti';
import { AlyaCharacter } from './AlyaCharacter';

import bannerDuniaPixel from '../assets/images/banner_dunia_pixel_1785426808447.jpg';
import mapDunia1Img from '../assets/images/map_dunia1_hutan_1785733906195.jpg';
import mapDunia2Img from '../assets/images/map_dunia2_gua_1785733923688.jpg';
import mapDunia3Img from '../assets/images/map_dunia3_gunung_1785733976521.jpg';

interface DuniaPixelGameplayProps {
  soundEnabled: boolean;
  onBackToHub: () => void;
  onToggleSound: () => void;
  onUpdateWorldProgress: (worldId: string, starsEarned: number) => void;
  onCompleteChallenge?: (challengeId: string, starsEarned: number) => void;
}

// Monster Definition Interface
export interface FractionMonster {
  id: string;
  name: string;
  type: 'rumput' | 'batu' | 'air' | 'api' | 'awan' | 'kristal';
  avatar: string;
  petAvatar: string; // Transformed cute pet animal avatar
  dialogText: string; // Initial storyline cry for help
  questionText: string; // e.g. "Monster ini perlukan 3/4 bahagian cahaya!" or "1/4 + 2/4 = ?"
  questionBadge: string; // e.g. "3/4" or "1/2 = ?" or "1/4 + 2/4"
  correctAnswer: string; // e.g. "3/4" or "2/4" or "3/4"
  options: string[]; // 3 inventory fraction choices, e.g. ["1/4", "2/4", "3/4"]
  explanation: string;
  gridVisual?: { filled: number; total: number }; // visual preview if applicable
  x: number; // percentage in world grid 0-100
  y: number; // percentage in world grid 0-100
  isSaved: boolean;
  actionState?: 'idle' | 'walking' | 'hopping' | 'sleeping';
}

export interface PixelRpgLevel {
  id: 1 | 2 | 3;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  description: string;
  bgGradient: string;
  monsters: FractionMonster[];
}

export const RPG_LEVELS: PixelRpgLevel[] = [
  {
    id: 1,
    title: '🌳 Dunia 1',
    subtitle: 'Hutan Pecahan',
    icon: '🌳',
    themeColor: 'emerald',
    description: 'Bantu raksasa dan selamatkan hutan.',
    bgGradient: 'from-emerald-950 via-teal-900 to-green-950',
    monsters: [
      {
        id: 'm1_1',
        name: 'Raksasa Rumput Comel',
        type: 'rumput',
        avatar: '🌿👾',
        petAvatar: '🐰',
        dialogText: 'Hai! Saya hilang 1 daripada 2 bahagian daun. Boleh bantu saya?',
        questionText: 'Saya hilang 1 daripada 2 bahagian daun! Apakah pecahan daun saya?',
        questionBadge: '1/2',
        correctAnswer: '1/2',
        options: ['1/2', '1/4', '3/4'],
        explanation: '1/2 bermaksud 1 daripada 2 bahagian yang sama besar! 🌿✨',
        gridVisual: { filled: 1, total: 2 },
        x: 25,
        y: 35,
        isSaved: false,
        actionState: 'walking',
      },
      {
        id: 'm1_2',
        name: 'Raksasa Air Biru',
        type: 'air',
        avatar: '💧👾',
        petAvatar: '🐥',
        dialogText: 'Bantu saya cari 3/4 bahagian air untuk gembira semula!',
        questionText: 'Saya perlukan 3/4 bahagian air untuk gembira!',
        questionBadge: '3/4',
        correctAnswer: '3/4',
        options: ['1/4', '2/4', '3/4'],
        explanation: '3/4 bermaksud 3 bahagian air daripada 4 bahagian! 💧✨',
        gridVisual: { filled: 3, total: 4 },
        x: 65,
        y: 25,
        isSaved: false,
        actionState: 'hopping',
      },
      {
        id: 'm1_3',
        name: 'Raksasa Batu Kecil',
        type: 'batu',
        avatar: '🪨👾',
        petAvatar: '🐼',
        dialogText: 'Tolong pilih pecahan 2/4 untuk susun batu ini!',
        questionText: 'Pilih pecahan 2/4 untuk menyusun batu saya!',
        questionBadge: '2/4',
        correctAnswer: '2/4',
        options: ['1/3', '2/4', '3/4'],
        explanation: '2/4 bermaksud 2 daripada 4 bahagian batu! 🪨✨',
        gridVisual: { filled: 2, total: 4 },
        x: 40,
        y: 70,
        isSaved: false,
        actionState: 'idle',
      },
      {
        id: 'm1_4',
        name: 'Raksasa Awan Lembut',
        type: 'awan',
        avatar: '☁️👾',
        petAvatar: '🕊️',
        dialogText: 'Beri saya 1/3 awan lembut untuk terbang gembira!',
        questionText: 'Saya perlukan 1/3 bahagian awan lembut!',
        questionBadge: '1/3',
        correctAnswer: '1/3',
        options: ['1/3', '2/3', '3/3'],
        explanation: '1/3 bermaksud 1 bahagian daripada 3 bahagian awan! ☁️✨',
        gridVisual: { filled: 1, total: 3 },
        x: 80,
        y: 65,
        isSaved: false,
        actionState: 'walking',
      },
    ],
  },
  {
    id: 2,
    title: '💎 Dunia 2',
    subtitle: 'Gua Kristal',
    icon: '💎',
    themeColor: 'cyan',
    description: 'Cari kristal dan bantu rakan baharu.',
    bgGradient: 'from-slate-950 via-indigo-950 to-cyan-950',
    monsters: [
      {
        id: 'm2_1',
        name: 'Raksasa Api',
        type: 'api',
        avatar: '🔥👾',
        petAvatar: '🦊',
        dialogText: 'Adakah 1/2 sama dengan 2/4? Mari bantu saya!',
        questionText: 'Adakah 1/2 sama nilai dengan 2/4?',
        questionBadge: '1/2 = 2/4 ?',
        correctAnswer: 'YA (1/2 = 2/4)',
        options: ['YA (1/2 = 2/4)', 'TIDAK (Tidak Setara)'],
        explanation: '1/2 dan 2/4 adalah pecahan setara kerana nilainya sama! 🔥✨',
        gridVisual: { filled: 2, total: 4 },
        x: 30,
        y: 30,
        isSaved: false,
        actionState: 'hopping',
      },
      {
        id: 'm2_2',
        name: 'Raksasa Kristal',
        type: 'kristal',
        avatar: '💎👾',
        petAvatar: '🐉',
        dialogText: 'Bantu saya cari pecahan setara untuk 2/3!',
        questionText: 'Manakah pecahan yang SETARA dengan 2/3?',
        questionBadge: '2/3 = ?',
        correctAnswer: '4/6',
        options: ['2/6', '4/6', '5/6'],
        explanation: '2/3 = 4/6! Darab atas dan bawah dengan 2! 💎✨',
        gridVisual: { filled: 4, total: 6 },
        x: 70,
        y: 35,
        isSaved: false,
        actionState: 'walking',
      },
      {
        id: 'm2_3',
        name: 'Raksasa Tasik',
        type: 'air',
        avatar: '🌊👾',
        petAvatar: '🐬',
        dialogText: 'Cari pecahan setara untuk 3/5 bahagian tasik ini!',
        questionText: 'Cari pecahan setara untuk 3/5 bahagian tasik!',
        questionBadge: '3/5 = ?',
        correctAnswer: '6/10',
        options: ['4/10', '5/10', '6/10'],
        explanation: '3/5 = 6/10! Darab atas dan bawah dengan 2! 🌊✨',
        gridVisual: { filled: 6, total: 10 },
        x: 50,
        y: 75,
        isSaved: false,
        actionState: 'idle',
      },
    ],
  },
  {
    id: 3,
    title: '🌈 Dunia 3',
    subtitle: 'Gunung Pelangi',
    icon: '🌈',
    themeColor: 'purple',
    description: 'Naik ke gunung dan selamatkan istana.',
    bgGradient: 'from-purple-950 via-pink-950 to-indigo-950',
    monsters: [
      {
        id: 'm3_1',
        name: 'Raksasa Perisai',
        type: 'batu',
        avatar: '🛡️👾',
        petAvatar: '🦁',
        dialogText: 'Mari tambah 1/4 + 2/4 untuk bantu saya!',
        questionText: 'Berapakah 1/4 + 2/4 bahagian perisai ini?',
        questionBadge: '1/4 + 2/4 = ?',
        correctAnswer: '3/4',
        options: ['2/4', '3/4', '4/4'],
        explanation: '1/4 + 2/4 = 3/4! Tambah nombor di atas: 1 + 2 = 3! 🛡️✨',
        x: 25,
        y: 30,
        isSaved: false,
        actionState: 'walking',
      },
      {
        id: 'm3_2',
        name: 'Raksasa Awan',
        type: 'awan',
        avatar: '☁️👾',
        petAvatar: '🦄',
        dialogText: 'Berapakah 2/8 + 4/8 untuk ceria semula?',
        questionText: 'Kirakan penambahan pecahan: 2/8 + 4/8!',
        questionBadge: '2/8 + 4/8 = ?',
        correctAnswer: '6/8',
        options: ['5/8', '6/8', '7/8'],
        explanation: '2/8 + 4/8 = 6/8! Nombor bawah kekal 8, nombor atas 2 + 4 = 6! ☁️✨',
        x: 75,
        y: 40,
        isSaved: false,
        actionState: 'hopping',
      },
      {
        id: 'm3_3',
        name: 'Raksasa Mahkota',
        type: 'kristal',
        avatar: '👑👾',
        petAvatar: '🦚',
        dialogText: 'Jom tambah 3/10 + 2/10 untuk mahkota pelangi ini!',
        questionText: 'Berapakah hasil tambah: 3/10 + 2/10?',
        questionBadge: '3/10 + 2/10 = ?',
        correctAnswer: '5/10',
        options: ['4/10', '5/10', '6/10'],
        explanation: '3/10 + 2/10 = 5/10! Mahkota pelangi bersinar semula! 👑✨',
        x: 50,
        y: 70,
        isSaved: false,
        actionState: 'idle',
      },
    ],
  },
];

export const getSpawnPosForLevel = (levelId: 1 | 2 | 3) => {
  if (levelId === 1) return { x: 12, y: 82 }; // Forest main trail entrance at bottom left
  if (levelId === 2) return { x: 18, y: 22 }; // Crystal cave entrance doorway at top left
  return { x: 15, y: 22 }; // Sky mountain Rainbow Arch Portal at top left
};

export const getPortalPosForLevel = (levelId: 1 | 2 | 3) => {
  if (levelId === 1) return { left: '18%', top: '14%' }; // Forest cave mouth at top left leading into Gua Kristal
  if (levelId === 2) return { left: '84%', top: '20%' }; // Grand Crystal Altar at top right leading up to Sky Mountain
  return { left: '82%', top: '20%' }; // Sky Castle Entrance Gate at top right
};

export const DuniaPixelGameplay: React.FC<DuniaPixelGameplayProps> = ({
  soundEnabled,
  onBackToHub,
  onToggleSound,
  onUpdateWorldProgress,
  onCompleteChallenge,
}) => {
  // Navigation & Game State
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'level_select' | 'gameplay'>('welcome');
  const [activeLevelId, setActiveLevelId] = useState<1 | 2 | 3>(1);
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([1]);

  // Player position in the pixel world RPG grid (0 to 100 percentage)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>(getSpawnPosForLevel(1));
  const [playerFacing, setPlayerFacing] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Active level state & monsters
  const currentLevel = RPG_LEVELS.find((l) => l.id === activeLevelId) || RPG_LEVELS[0];
  const [monstersState, setMonstersState] = useState<FractionMonster[]>(currentLevel.monsters);
  const [storyDialogMonster, setStoryDialogMonster] = useState<FractionMonster | null>(null);
  const [activeEncounterMonster, setActiveEncounterMonster] = useState<FractionMonster | null>(null);

  // Selected fraction card from bottom inventory
  const [selectedFractionCard, setSelectedFractionCard] = useState<string | null>(null);

  // Player stats & Combo
  const [lives, setLives] = useState<number>(3);
  const [coins, setCoins] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboBanner, setComboBanner] = useState<string | null>(null);

  // Weather & Time of Day Cycle ('pagi' | 'petang' | 'malam')
  const [timeOfDay, setTimeOfDay] = useState<'pagi' | 'petang' | 'malam'>('pagi');

  // Transformed Saved Pets following/living in map
  const [savedPets, setSavedPets] = useState<{ id: string; petAvatar: string; name: string; x: number; y: number }[]>([]);

  // Alya Helper Banner Message
  const [showAlyaDialog, setShowAlyaDialog] = useState<boolean>(true);
  const [alyaMessage, setAlyaMessage] = useState<string>('Selamat datang! Gunakan butang pergerakan untuk mendekati Monster Pecahan!');

  // Modal / Feedback / Portal Cutscene
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [showLevelFinishModal, setShowLevelFinishModal] = useState<boolean>(false);
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [showPortalCutscene, setShowPortalCutscene] = useState<boolean>(false);
  const [interactiveToast, setInteractiveToast] = useState<string | null>(null);

  // World Animation Loop Counter for swaying grass, clouds, birds, butterflies
  const [animTick, setAnimTick] = useState<number>(0);

  // BGM Level Music Hook
  useEffect(() => {
    if (currentScreen === 'gameplay' && soundEnabled) {
      toggleDuniaPixelBgm(activeLevelId as 1 | 2 | 3, true);
    } else {
      toggleDuniaPixelBgm(null, false);
    }
    return () => {
      toggleDuniaPixelBgm(null, false);
    };
  }, [currentScreen, activeLevelId, soundEnabled]);

  // Load Saved Progress from localStorage
  useEffect(() => {
    try {
      const p1 = localStorage.getItem('pixelLevel1Complete') === 'true';
      const p2 = localStorage.getItem('pixelLevel2Complete') === 'true';
      const p3 = localStorage.getItem('pixelLevel3Complete') === 'true';

      const unlocked = [1];
      if (p1) unlocked.push(2);
      if (p2) unlocked.push(3);
      setUnlockedLevelIds(unlocked);

      const savedCoins = Number(localStorage.getItem('pixelCoins')) || 0;
      setCoins(savedCoins);

      setLevelStars({
        1: p1 ? 3 : 0,
        2: p2 ? 3 : 0,
        3: p3 ? 3 : 0,
      });
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Living World Animation Loop & Monster Wander Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimTick((prev) => {
        const nextTick = (prev + 1) % 100;
        // Shift time of day slowly
        if (nextTick % 30 === 0) {
          setTimeOfDay((curr) => (curr === 'pagi' ? 'petang' : curr === 'petang' ? 'malam' : 'pagi'));
        }
        return nextTick;
      });

      // Monster random living wander
      setMonstersState((prevMonsters) =>
        prevMonsters.map((m) => {
          if (m.isSaved) return m;
          // 30% chance for unsaved monster to wander a tiny bit
          if (Math.random() < 0.3) {
            const wanderX = (Math.random() - 0.5) * 3;
            const wanderY = (Math.random() - 0.5) * 3;
            return {
              ...m,
              x: Math.max(15, Math.min(85, m.x + wanderX)),
              y: Math.max(20, Math.min(80, m.y + wanderY)),
              actionState: Math.random() > 0.5 ? 'walking' : 'hopping',
            };
          }
          return m;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Keyboard Movement Listener (WASD & Arrow Keys)
  useEffect(() => {
    if (currentScreen !== 'gameplay' || storyDialogMonster || activeEncounterMonster || showGameOverModal || showLevelFinishModal) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      let dx = 0;
      let dy = 0;
      let facing: 'down' | 'up' | 'left' | 'right' = playerFacing;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        dy = -5;
        facing = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        dy = 5;
        facing = 'down';
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx = -5;
        facing = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx = 5;
        facing = 'right';
      }

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);
        setPlayerFacing(facing);
        setPlayerPos((prev) => {
          const nx = Math.max(10, Math.min(90, prev.x + dx));
          const ny = Math.max(15, Math.min(85, prev.y + dy));

          // Check proximity to monsters
          checkMonsterProximity(nx, ny);
          return { x: nx, y: ny };
        });

        setTimeout(() => setIsMoving(false), 200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, storyDialogMonster, activeEncounterMonster, showGameOverModal, showLevelFinishModal, playerFacing, monstersState]);

  // Check proximity to monsters
  const checkMonsterProximity = (px: number, py: number) => {
    if (storyDialogMonster || activeEncounterMonster) return;

    monstersState.forEach((m) => {
      if (!m.isSaved) {
        const dist = Math.hypot(px - m.x, py - m.y);
        if (dist < 12) {
          // Open RPG Story Dialog Modal first!
          playSfx('pop', soundEnabled);
          setStoryDialogMonster(m);
          setAlyaMessage(`Dah jumpa ${m.name}! Tekan 'Bantu Monster' untuk memulakan cabaran pecahan!`);
        }
      }
    });
  };

  // Move via D-Pad or On-screen Controls
  const handleMovePlayer = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (activeEncounterMonster || showGameOverModal || showLevelFinishModal) return;

    let dx = 0;
    let dy = 0;
    if (dir === 'up') dy = -7;
    if (dir === 'down') dy = 7;
    if (dir === 'left') dx = -7;
    if (dir === 'right') dx = 7;

    setPlayerFacing(dir);
    setIsMoving(true);
    playSfx('click', soundEnabled);

    setPlayerPos((prev) => {
      const nx = Math.max(10, Math.min(90, prev.x + dx));
      const ny = Math.max(15, Math.min(85, prev.y + dy));
      checkMonsterProximity(nx, ny);
      return { x: nx, y: ny };
    });

    setTimeout(() => setIsMoving(false), 200);
  };

  // Start a specific Level
  const handleStartLevel = (levelId: 1 | 2 | 3) => {
    if (!unlockedLevelIds.includes(levelId)) {
      playSfx('lock', soundEnabled);
      return;
    }

    playSfx('click', soundEnabled);
    setActiveLevelId(levelId);

    const targetLvl = RPG_LEVELS.find((l) => l.id === levelId) || RPG_LEVELS[0];
    setMonstersState(targetLvl.monsters.map((m) => ({ ...m, isSaved: false })));
    setPlayerPos(getSpawnPosForLevel(levelId));
    setLives(3);
    setActiveEncounterMonster(null);
    setFeedbackMessage(null);
    setShowGameOverModal(false);
    setShowLevelFinishModal(false);
    setCurrentScreen('gameplay');

    setAlyaMessage(`Selamat datang ke ${targetLvl.title}! Cari dan sembuhkan semua monster pecahan!`);
  };

  // Attempt to Heal Monster with selected fraction card
  const handleHealMonster = () => {
    if (!activeEncounterMonster || !selectedFractionCard) {
      playSfx('lock', soundEnabled);
      return;
    }

    const isCorrect = selectedFractionCard === activeEncounterMonster.correctAnswer;

    if (isCorrect) {
      // Correct answer!
      playSfx('coin', soundEnabled);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

      // Combo System calculation
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      let bonusCoins = 10;
      if (newCombo >= 3) {
        bonusCoins = 25;
        setComboBanner(`🔥 KOMBO ${newCombo}! HEBAT! +25 SYILING`);
      } else if (newCombo >= 2) {
        bonusCoins = 15;
        setComboBanner(`🔥 KOMBO ${newCombo}! +15 SYILING`);
      } else {
        setComboBanner(null);
      }

      // Mark monster as saved & transformed into cute pet
      setMonstersState((prev) =>
        prev.map((m) => (m.id === activeEncounterMonster.id ? { ...m, isSaved: true } : m))
      );

      // Add to transformed saved pets list
      const transformedPet = {
        id: activeEncounterMonster.id,
        petAvatar: activeEncounterMonster.petAvatar || '🐰',
        name: activeEncounterMonster.name.replace('Monster', 'Haiwan Comel'),
        x: activeEncounterMonster.x,
        y: activeEncounterMonster.y,
      };
      setSavedPets((prev) => [...prev, transformedPet]);

      setCoins((c) => {
        const nextCoins = c + bonusCoins;
        try {
          localStorage.setItem('pixelCoins', nextCoins.toString());
        } catch (e) {
          console.warn(e);
        }
        return nextCoins;
      });

      setFeedbackMessage({
        text: `✨ TERANSEFORMASI! ${activeEncounterMonster.name} kini berubah menjadi ${activeEncounterMonster.petAvatar} comel! (${activeEncounterMonster.explanation})`,
        isCorrect: true,
      });

      setAlyaMessage(`Tahniah! ${activeEncounterMonster.name} berterima kasih & menyertai kampung kita! 🐾✨`);

      // Check if all monsters in level are saved
      const updatedMonsters = monstersState.map((m) =>
        m.id === activeEncounterMonster.id ? { ...m, isSaved: true } : m
      );
      const remainingUnsaved = updatedMonsters.filter((m) => !m.isSaved);

      setTimeout(() => {
        setActiveEncounterMonster(null);
        setSelectedFractionCard(null);
        setFeedbackMessage(null);
        setComboBanner(null);

        if (remainingUnsaved.length === 0) {
          // Level Completed!
          handleFinishLevel();
        }
      }, 2200);
    } else {
      // Wrong answer! Reset combo
      playSfx('lock', soundEnabled);
      setComboCount(0);
      setComboBanner(null);
      const nextLives = lives - 1;
      setLives(nextLives);

      setFeedbackMessage({
        text: `😢 Monster sedih... Jawapan belum tepat. (Petunjuk: ${activeEncounterMonster.explanation})`,
        isCorrect: false,
      });

      setAlyaMessage('Jangan risau, cuba lagi! Perhatikan pengangka dan penyebutnya.');

      if (nextLives <= 0) {
        setTimeout(() => {
          setActiveEncounterMonster(null);
          setShowGameOverModal(true);
        }, 1500);
      }
    }
  };

  // Finish Level Logic with Portal & Cutscene Trigger
  const handleFinishLevel = () => {
    playSfx('fanfare', soundEnabled);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });

    // Unlock next level
    const nextLevelId = activeLevelId + 1;
    if (nextLevelId <= 3 && !unlockedLevelIds.includes(nextLevelId)) {
      setUnlockedLevelIds((prev) => [...prev, nextLevelId]);
    }

    const updatedStars = { ...levelStars, [activeLevelId]: 3 };
    setLevelStars(updatedStars);

    const totalPixelStars = (Object.values(updatedStars) as number[]).reduce((sum, s) => sum + s, 0);
    setStars(totalPixelStars);

    try {
      localStorage.setItem(`pixelLevel${activeLevelId}Complete`, 'true');
      if (activeLevelId >= 1) localStorage.setItem('pixelLevel1Complete', 'true');
      if (activeLevelId >= 2) localStorage.setItem('pixelLevel2Complete', 'true');
      if (activeLevelId >= 3) localStorage.setItem('pixelLevel3Complete', 'true');
      localStorage.setItem('pixelStars', totalPixelStars.toString());
    } catch (e) {
      console.warn(e);
    }

    onUpdateWorldProgress('pixel', totalPixelStars);
    if (onCompleteChallenge) {
      onCompleteChallenge(`pixel-${activeLevelId}`, 3);
    }

    // Open portal animation & trigger cutscene modal
    setIsPortalOpen(true);
    setShowPortalCutscene(true);
  };

  // Transition to Next Area via Portal
  const handleEnterNextLevelFromPortal = () => {
    playSfx('chime', soundEnabled);
    setShowPortalCutscene(false);

    if (activeLevelId < 3) {
      const nextLvl = (activeLevelId + 1) as 1 | 2 | 3;
      setActiveLevelId(nextLvl);
      const nextLvlData = RPG_LEVELS.find((l) => l.id === nextLvl) || RPG_LEVELS[0];
      setMonstersState(nextLvlData.monsters.map((m) => ({ ...m, isSaved: false })));
      setPlayerPos(getSpawnPosForLevel(nextLvl));
      setIsPortalOpen(false);
      setAlyaMessage(`Selamat datang ke ${nextLvlData.title}! Terokai persekitaran baharu & selamatkan monster di kawasan ini!`);
    } else {
      setShowLevelFinishModal(true);
    }
  };

  const totalPixelStars = (Object.values(levelStars) as number[]).reduce((sum, s) => sum + s, 0);

  return (
    <div className="min-h-screen bg-[#111827] text-amber-50 flex flex-col font-rounded relative overflow-x-hidden select-none">
      {/* TOP HEADER / HUD BAR */}
      <header className="bg-slate-900/95 border-b-4 border-amber-500 px-4 py-3 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSfx('click', soundEnabled);
              if (currentScreen === 'gameplay') {
                setCurrentScreen('level_select');
              } else if (currentScreen === 'level_select') {
                setCurrentScreen('welcome');
              } else {
                onBackToHub();
              }
            }}
            className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border-2 border-slate-600 transition flex items-center gap-1.5 text-sm font-extrabold cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">
              {currentScreen === 'gameplay'
                ? 'Pilih Dunia'
                : currentScreen === 'level_select'
                ? 'Kembali ke Pengenalan'
                : 'Hub Utama'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <div>
              <h1 className="font-extrabold text-base sm:text-2xl text-[#FFD54A] leading-tight">
                DUNIA PIXEL
              </h1>
              <p className="text-xs sm:text-sm text-[#FFF8E8] font-bold">Mari bantu raksasa!</p>
            </div>
          </div>
        </div>

        {/* HUD Stats */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-2xl border-2 border-red-600/70">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${
                  h <= lives ? 'fill-red-500 text-red-500 animate-pulse' : 'text-slate-700 fill-slate-900'
                }`}
              />
            ))}
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border-2 border-amber-500/70 text-sm font-black text-amber-300">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>{coins}</span>
          </div>

          {/* Total Stars */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border-2 border-yellow-500/70 text-sm font-black text-yellow-300">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>{totalPixelStars}/9</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border-2 border-slate-600 cursor-pointer"
            title="Siri Bunyi"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative">
        {/* SCREEN 0: WELCOME SCREEN (PENGENALAN DUNIA PIXEL) */}
        {currentScreen === 'welcome' && (
          <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full bg-slate-900/95 rounded-3xl p-6 sm:p-10 border-4 border-purple-500 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
            >
              {/* Background Image Accent */}
              <img
                src={bannerDuniaPixel}
                alt="Dunia Pixel RPG"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
              />

              {/* Magical Rainbow Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-fuchsia-900/20 to-indigo-950/60 pointer-events-none" />

              {/* Floating Moving Clouds ☁️ */}
              <div className="absolute top-3 left-0 w-full flex justify-around opacity-70 pointer-events-none z-10">
                <motion.span
                  animate={{ x: [-20, 20, -20] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                  className="text-3xl"
                >
                  ☁️
                </motion.span>
                <motion.span
                  animate={{ x: [20, -20, 20] }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                  className="text-4xl"
                >
                  ☁️
                </motion.span>
                <motion.span
                  animate={{ x: [-15, 15, -15] }}
                  transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
                  className="text-2xl"
                >
                  ☁️
                </motion.span>
              </div>

              {/* Pixel Butterflies 🦋 & Glowing Crystals 💎 */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <motion.span
                  animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-8 left-10 text-xl"
                >
                  🦋
                </motion.span>
                <motion.span
                  animate={{ y: [0, -12, 0], rotate: [10, -10, 10] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute bottom-10 left-1/4 text-2xl"
                >
                  🦋
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-12 right-12 text-2xl text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                >
                  💎
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2.2, delay: 0.4 }}
                  className="absolute bottom-12 right-1/3 text-2xl text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                >
                  💎
                </motion.span>
              </div>

              {/* Twinkling Stars ✨ & Shining Rainbow 🌈 */}
              <div className="absolute inset-0 pointer-events-none z-10 flex justify-between px-8 items-center opacity-75">
                <motion.span
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="text-amber-300 text-2xl"
                >
                  ✨
                </motion.span>
                <div className="absolute top-2 right-1/4 text-5xl opacity-40 filter drop-shadow-md">
                  🌈
                </div>
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.3 }}
                  className="text-fuchsia-300 text-2xl"
                >
                  ✨
                </motion.span>
              </div>

              {/* Alya Character Mascot */}
              <div className="relative z-20 shrink-0 flex items-center justify-center p-2 bg-slate-950/60 rounded-3xl border-2 border-amber-400">
                <AlyaCharacter size="lg" mood="happy" showSpeechBubble={false} />
              </div>

              {/* Welcome Dialogue & Message */}
              <div className="relative z-20 flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/90 border border-purple-400 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                  <span className="text-base">🌈</span>
                  <span>DUNIA 3 — MISI PENGEMBARAN PIXEL</span>
                </div>

                <h1 className="font-extrabold text-3xl sm:text-4xl text-[#FFD54A] leading-tight">
                  🌈 Selamat Datang ke Dunia Pixel!
                </h1>

                <div className="bg-slate-950/90 p-4 rounded-2xl border-2 border-purple-400/60 shadow-inner space-y-2">
                  <p className="font-extrabold text-base text-yellow-300">
                    "Hari ini kita akan membantu rakan-rakan di Dunia Pixel!"
                  </p>
                  <p className="font-extrabold text-xs sm:text-sm text-[#FFF8E8]/90 leading-relaxed">
                    Cari raksasa yang memerlukan bantuan dan selesaikan cabaran pecahan untuk menyelamatkan setiap dunia. Kumpulkan semua 9 bintang!
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    playSfx('fanfare', soundEnabled);
                    setCurrentScreen('level_select');
                  }}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 border-b-4 border-purple-900 cursor-pointer"
                >
                  <span>⚔️ MULAKAN MISI</span>
                  <span className="text-xl">⭐</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {currentScreen === 'level_select' && (
          /* ================= LEVEL SELECT SCREEN ================= */
          <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full flex flex-col justify-center space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-purple-950 border-2 border-purple-400 text-[#FFD54A] font-black text-sm shadow-md">
                ✨ MISI DUNIA PIXEL ✨
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#FFD54A] tracking-wide">
                PILIH DUNIA KAMU
              </h2>
              <p className="text-base sm:text-xl text-[#FFF8E8] font-bold max-w-lg mx-auto">
                Mari bantu raksasa dan kumpul bintang!
              </p>
            </div>

            {/* Level Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RPG_LEVELS.map((lvl) => {
                const isUnlocked = unlockedLevelIds.includes(lvl.id);
                const isCompleted = levelStars[lvl.id] > 0;

                return (
                  <motion.div
                    key={lvl.id}
                    whileHover={isUnlocked ? { scale: 1.04 } : {}}
                    whileTap={isUnlocked ? { scale: 0.96 } : {}}
                    onClick={() => handleStartLevel(lvl.id)}
                    className={`rounded-3xl p-6 border-4 transition-all relative overflow-hidden flex flex-col justify-between shadow-2xl cursor-pointer ${
                      isUnlocked
                        ? 'bg-slate-900/95 border-amber-400/90 hover:border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                        : 'bg-slate-950 border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Background glow */}
                    <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-5xl">{lvl.icon}</span>
                        {isCompleted ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-300 text-xs font-black flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SELESAI
                          </span>
                        ) : !isUnlocked ? (
                          <span className="p-2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                            <Lock className="w-5 h-5" />
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-950 border-2 border-amber-400 text-[#FFD54A] text-xs font-black">
                            TERBUKA
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-black text-2xl sm:text-3xl text-white">{lvl.title}</h3>
                        <p className="text-base sm:text-lg text-yellow-300 font-extrabold mt-1">{lvl.subtitle}</p>
                      </div>

                      {/* Map Image Preview Thumbnail */}
                      <div className="w-full h-24 rounded-2xl overflow-hidden relative border-2 border-amber-500/40 shadow-inner my-2 group-hover:scale-102 transition-transform">
                        <img
                          src={lvl.id === 1 ? mapDunia1Img : lvl.id === 2 ? mapDunia2Img : mapDunia3Img}
                          alt={lvl.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      </div>

                      <p className="text-base sm:text-lg text-[#FFF8E8] leading-relaxed font-bold">
                        "{lvl.description}"
                      </p>
                    </div>

                    <div className="pt-4 border-t-2 border-slate-800 mt-5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-1.5 text-sm text-yellow-300 font-black">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span>{levelStars[lvl.id] || 0} / 3 Bintang</span>
                      </div>

                      <button
                        disabled={!isUnlocked}
                        className={`px-5 py-2.5 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2 shadow-lg cursor-pointer ${
                          isUnlocked
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.6)] border-b-4 border-amber-700'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>MAIN</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Overall Player Badge Status */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border-2 border-slate-700 text-center space-y-2 shadow-xl">
              <span className="text-xs sm:text-sm text-[#FFD54A] font-black uppercase tracking-wider">
                🏅 LENCANA PECAHAN KAMU
              </span>
              <div className="flex justify-center items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span className="text-base sm:text-xl font-black text-white">
                  {totalPixelStars === 9
                    ? '🏆 JAGUH PECAHAN'
                    : totalPixelStars >= 7
                    ? '🥇 BINTANG EMAS'
                    : totalPixelStars >= 5
                    ? '🥈 BINTANG PERAK'
                    : '🥉 BINTANG GANGSA'}
                </span>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'gameplay' && (
          /* ================= PIXEL RPG GAMEPLAY SCREEN ================= */
          <div className="flex-1 flex flex-col justify-between relative overflow-hidden bg-slate-950">
            {/* LIVING PIXEL RPG MAP WORLD */}
            <div
              className={`relative w-full h-[60vh] sm:h-[65vh] overflow-hidden border-b-4 border-slate-800 transition-colors duration-1000 shadow-inner ${
                activeLevelId === 1
                  ? timeOfDay === 'pagi'
                    ? 'bg-gradient-to-b from-sky-900 via-emerald-950 to-green-950'
                    : 'bg-gradient-to-b from-teal-950 via-emerald-950 to-slate-950'
                  : activeLevelId === 2
                  ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-cyan-950'
                  : 'bg-gradient-to-b from-purple-950 via-pink-950 to-amber-950'
              }`}
            >
              {/* Level Identity Badge */}
              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/50 text-[10px] font-extrabold text-amber-300 flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                <span>{currentLevel.icon} {currentLevel.title}</span>
                {comboCount >= 2 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white font-extrabold animate-bounce">
                    🔥 KOMBO x{comboCount}
                  </span>
                )}
              </div>

              {/* Combo Multiplier Banner Overlay */}
              <AnimatePresence>
                {comboBanner && (
                  <motion.div
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-slate-950 font-black text-xs sm:text-sm border-2 border-yellow-200 shadow-2xl flex items-center gap-2 animate-bounce pointer-events-none"
                  >
                    <span>🔥</span>
                    <span>{comboBanner}</span>
                    <span>✨</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Object Toast Banner */}
              <AnimatePresence>
                {interactiveToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400 text-amber-200 font-extrabold text-xs shadow-xl flex items-center gap-2"
                  >
                    <span>✨</span>
                    <span>{interactiveToast}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BACKGROUND MAP IMAGE FOR SPECIFIC LEVEL */}
              <img
                src={activeLevelId === 1 ? mapDunia1Img : activeLevelId === 2 ? mapDunia2Img : mapDunia3Img}
                alt={`Peta Dunia Pixel ${activeLevelId}`}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
                referrerPolicy="no-referrer"
              />

              {/* Time of Day Atmospheric Lighting Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none transition-colors duration-1000 z-1 ${
                  timeOfDay === 'pagi'
                    ? 'bg-amber-300/5'
                    : timeOfDay === 'petang'
                    ? 'bg-amber-700/15'
                    : 'bg-indigo-950/30'
                }`}
              />

              {/* Living Pixel Ground Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-1" />

              {/* ================= LEVEL 1: 🌿 HUTAN PECAHAN ================= */}
              {activeLevelId === 1 && (
                <>
                  {/* Sky Drifting Clouds & Butterflies */}
                  <div
                    className="absolute top-4 left-0 w-full flex justify-around opacity-60 pointer-events-none transition-transform duration-1000 ease-linear z-2"
                    style={{ transform: `translateX(${(animTick * 3) % 100}px)` }}
                  >
                    <span className="text-3xl drop-shadow">☁️</span>
                    <span className="text-4xl drop-shadow">☁️</span>
                    <span className="text-2xl drop-shadow">☁️</span>
                  </div>

                  <div
                    className="absolute top-12 left-0 w-full flex justify-between pointer-events-none transition-transform duration-700 z-2"
                    style={{ transform: `translate(${(animTick * 4) % 120}px, ${Math.sin(animTick) * 8}px)` }}
                  >
                    <span className="text-xl">🦋</span>
                    <span className="text-base">🐝</span>
                    <span className="text-lg">🦋</span>
                  </div>

                  {/* Interactive Item Badges on Forest Map */}
                  <div className="absolute inset-0 z-10">
                    {/* Interactive Mushroom near left path */}
                    <button
                      onClick={() => {
                        playSfx('pop', soundEnabled);
                        setCoins((c) => c + 5);
                        setInteractiveToast('🍄 SPORA MUSHROOM AJAIB! +5 SYILING!');
                        setTimeout(() => setInteractiveToast(null), 1800);
                      }}
                      className="absolute text-2xl top-1/2 left-1/4 hover:scale-125 transition cursor-pointer animate-pulse z-20"
                      title="Tekan Cendawan Ajaib!"
                    >
                      🍄
                    </button>

                    {/* Interactive Flower near garden area */}
                    <button
                      onClick={() => {
                        playSfx('pop', soundEnabled);
                        setInteractiveToast('🌸 BUNGA HUTAN WANGI BERCAHAYA!');
                        setTimeout(() => setInteractiveToast(null), 1800);
                      }}
                      className="absolute text-2xl bottom-1/3 right-1/3 hover:scale-125 transition cursor-pointer animate-bounce z-20"
                      title="Tekan Bunga Wani!"
                    >
                      🌸
                    </button>
                  </div>
                </>
              )}

              {/* ================= LEVEL 2: 💎 GUA KRISTAL BAWAH TANAH ================= */}
              {activeLevelId === 2 && (
                <>
                  {/* Floating Glowing Crystal Dust Sparkles */}
                  <div
                    className="absolute inset-0 flex justify-around pointer-events-none opacity-70 z-2"
                    style={{ transform: `translateY(${-((animTick * 2) % 40)}px)` }}
                  >
                    <span className="text-xl animate-pulse text-cyan-300">✨</span>
                    <span className="text-2xl animate-ping text-purple-300">🔮</span>
                    <span className="text-xl animate-pulse text-cyan-300">✨</span>
                    <span className="text-2xl animate-pulse text-amber-300">💎</span>
                  </div>

                  {/* Wise Cave Owl NPC & Interactive Crystals */}
                  <div className="absolute inset-0 z-10">
                    {/* Wise Cave Owl NPC on stone ledge */}
                    <button
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        setAlyaMessage('🦉 Burung Hantu Gua: "Gunakan Kuasa Pecahan Setara untuk membebaskan kristal!"');
                        setInteractiveToast('🦉 BURUNG HANTU GUA BERSUARA!');
                        setTimeout(() => setInteractiveToast(null), 2000);
                      }}
                      className="absolute text-3xl top-1/3 left-1/3 hover:scale-125 transition cursor-pointer z-20"
                    >
                      🦉
                    </button>

                    {/* Interactive Crystal Gem Deposit */}
                    <button
                      onClick={() => {
                        playSfx('chime', soundEnabled);
                        setCoins((c) => c + 5);
                        setInteractiveToast('💎 KRISTAL PERMATA GUA! +5 SYILING!');
                        setTimeout(() => setInteractiveToast(null), 1800);
                      }}
                      className="absolute text-3xl bottom-1/4 right-1/4 hover:scale-125 transition cursor-pointer animate-bounce z-20"
                    >
                      💎
                    </button>
                  </div>
                </>
              )}

              {/* ================= LEVEL 3: 🌈 GUNUNG PELANGI & ISTANA SKY ================= */}
              {activeLevelId === 3 && (
                <>
                  {/* Fluffy Golden Sky Clouds */}
                  <div
                    className="absolute top-6 left-0 w-full flex justify-around pointer-events-none opacity-80 transition-transform duration-1000 ease-linear z-2"
                    style={{ transform: `translateX(${(animTick * 4) % 100}px)` }}
                  >
                    <span className="text-4xl">☁️</span>
                    <span className="text-5xl">⛅</span>
                    <span className="text-4xl">☁️</span>
                  </div>

                  {/* Flying Mythical Pegasus / Dragon */}
                  <div
                    className="absolute top-12 left-0 w-full flex justify-between pointer-events-none transition-transform duration-700 z-2"
                    style={{ transform: `translate(${(animTick * 6) % 150}px, ${Math.sin(animTick) * 12}px)` }}
                  >
                    <span className="text-2xl">🦄</span>
                    <span className="text-2xl">🐉</span>
                  </div>

                  {/* Interactive Cloud Platforms & Crown */}
                  <div className="absolute inset-0 z-10">
                    <button
                      onClick={() => {
                        playSfx('chime', soundEnabled);
                        setInteractiveToast('☁️ AWAN GEBU TERAPUNG! RASA RINGAN!');
                        setTimeout(() => setInteractiveToast(null), 1800);
                      }}
                      className="absolute text-3xl bottom-1/3 left-1/3 hover:scale-125 transition cursor-pointer animate-pulse z-20"
                    >
                      ☁️
                    </button>

                    <button
                      onClick={() => {
                        playSfx('chime', soundEnabled);
                        setCoins((c) => c + 5);
                        setInteractiveToast('👑 MAHKOTA PELANGI AJAIB! +5 SYILING!');
                        setTimeout(() => setInteractiveToast(null), 1800);
                      }}
                      className="absolute text-3xl top-1/3 right-1/3 hover:scale-125 transition cursor-pointer animate-bounce z-20"
                    >
                      👑
                    </button>
                  </div>
                </>
              )}

              {/* ANIMATED OPEN PORTAL ON MAP (Appears when level is completed!) */}
              {isPortalOpen && (
                <div
                  onClick={handleEnterNextLevelFromPortal}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group"
                  style={getPortalPosForLevel(activeLevelId)}
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="flex flex-col items-center"
                  >
                    <div className="px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold animate-bounce mb-1 border-2 border-white shadow-2xl">
                      🌀 TEKAN PORTAL AJAIB!
                    </div>
                    <div className="text-5xl filter drop-shadow-[0_0_25px_rgba(6,182,212,0.95)]">
                      🌀
                    </div>
                  </motion.div>
                </div>
              )}

              {/* MONSTERS ON MAP */}
              {monstersState.map((monster) => {
                const distToPlayer = Math.hypot(playerPos.x - monster.x, playerPos.y - monster.y);
                const isNear = distToPlayer < 14;

                return (
                  <div
                    key={monster.id}
                    onClick={() => {
                      playSfx('click', soundEnabled);
                      if (!monster.isSaved) {
                        setStoryDialogMonster(monster);
                      }
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                    style={{ left: `${monster.x}%`, top: `${monster.y}%` }}
                  >
                    <motion.div
                      animate={
                        monster.isSaved
                          ? { scale: [1, 1.15, 1], y: [0, -4, 0] }
                          : { y: [0, -6, 0] }
                      }
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex flex-col items-center group"
                    >
                      {/* Speech Bubble Icon 💬 if near */}
                      {!monster.isSaved && isNear && (
                        <div className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold animate-bounce shadow-lg flex items-center gap-1 mb-1">
                          <span>💬 TEKAN UNTUK CAKAP</span>
                        </div>
                      )}

                      {/* Question Badge above Monster Head */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shadow-lg flex items-center gap-1 ${
                          monster.isSaved
                            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                            : 'bg-amber-950/90 border-amber-400 text-amber-200 animate-bounce'
                        }`}
                      >
                        <span>{monster.isSaved ? `✨ HAIWAN ${monster.petAvatar}` : monster.questionBadge}</span>
                      </div>

                      {/* Avatar (Transforms into cute petAvatar when saved!) */}
                      <div className="text-4xl filter drop-shadow-lg relative my-1">
                        {monster.isSaved ? monster.petAvatar : monster.avatar}
                        {monster.isSaved && (
                          <span className="absolute -top-1 -right-1 text-sm animate-spin">💖</span>
                        )}
                      </div>

                      {/* Monster/Pet Name Tag */}
                      <span className="text-[9px] font-extrabold text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
                        {monster.isSaved ? monster.name.replace('Monster', 'Haiwan Comel') : monster.name}
                      </span>
                    </motion.div>
                  </div>
                );
              })}

              {/* PLAYER CHARACTER AVATAR */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-20"
                style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-extrabold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600 shadow-sm">
                    PENGEMBARA
                  </span>
                  <motion.div
                    animate={isMoving ? { y: [0, -4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="text-4xl filter drop-shadow-xl"
                  >
                    🧙‍♂️
                  </motion.div>
                </div>
              </div>
            </div>

            {/* INVENTORY & CONTROLS SECTION (BOTTOM PANEL) */}
            <div className="p-4 bg-slate-900/95 border-t-4 border-amber-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
              {/* D-Pad Directional Controls for Movement */}
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-3 gap-1 w-32 h-32 bg-slate-950 p-2 rounded-2xl border-2 border-slate-700 shadow-inner">
                  <div />
                  <button
                    onClick={() => handleMovePlayer('up')}
                    className="bg-slate-800 hover:bg-amber-500 active:bg-amber-600 text-amber-300 hover:text-slate-950 rounded-xl flex items-center justify-center active:scale-90 transition cursor-pointer border border-slate-700"
                    title="Atas"
                  >
                    <ChevronUp className="w-6 h-6" />
                  </button>
                  <div />
                  <button
                    onClick={() => handleMovePlayer('left')}
                    className="bg-slate-800 hover:bg-amber-500 active:bg-amber-600 text-amber-300 hover:text-slate-950 rounded-xl flex items-center justify-center active:scale-90 transition cursor-pointer border border-slate-700"
                    title="Kiri"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="bg-slate-900 rounded-xl flex items-center justify-center text-[10px] text-[#FFD54A] font-black">
                    JALAN
                  </div>
                  <button
                    onClick={() => handleMovePlayer('right')}
                    className="bg-slate-800 hover:bg-amber-500 active:bg-amber-600 text-amber-300 hover:text-slate-950 rounded-xl flex items-center justify-center active:scale-90 transition cursor-pointer border border-slate-700"
                    title="Kanan"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div />
                  <button
                    onClick={() => handleMovePlayer('down')}
                    className="bg-slate-800 hover:bg-amber-500 active:bg-amber-600 text-amber-300 hover:text-slate-950 rounded-xl flex items-center justify-center active:scale-90 transition cursor-pointer border border-slate-700"
                    title="Bawah"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>
                  <div />
                </div>
              </div>

              {/* Instruction Banner / Proximity Hint */}
              <div className="flex-1 text-center bg-slate-950/90 p-3.5 rounded-2xl border-2 border-slate-700 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-sm text-[#FFD54A] font-black">
                  <Compass className="w-5 h-5 text-amber-400" />
                  <span>ARAHAN</span>
                </div>
                <p className="text-sm sm:text-base text-[#FFF8E8] font-bold leading-relaxed">
                  {activeEncounterMonster
                    ? `Sedang berhadapan dengan ${activeEncounterMonster.name}! Pilih jawapan yang betul.`
                    : 'Gunakan D-Pad atau kekunci anak panah untuk bergerak dan bantu raksasa!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RAKSASA STORY DIALOG MODAL */}
      <AnimatePresence>
        {storyDialogMonster && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border-4 border-amber-400 shadow-2xl space-y-4 text-center relative"
            >
              <button
                onClick={() => setStoryDialogMonster(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-6xl animate-bounce pt-2">{storyDialogMonster.avatar}</div>

              <div className="space-y-2">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-950 border-2 border-amber-400 text-[#FFD54A] font-black text-sm inline-block">
                  💬 {storyDialogMonster.name} BERKATA:
                </span>
                <p className="text-base sm:text-lg text-[#FFF8E8] bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 font-bold leading-relaxed">
                  "{storyDialogMonster.dialogText}"
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStoryDialogMonster(null)}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-base border border-slate-700 cursor-pointer"
                >
                  LARI DULU
                </button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setActiveEncounterMonster(storyDialogMonster);
                    setStoryDialogMonster(null);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-[0_0_15px_rgba(251,191,36,0.6)] border-b-4 border-amber-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span>BANTU RAKSASA</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RAKSASA ENCOUNTER MODAL */}
      <AnimatePresence>
        {activeEncounterMonster && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-slate-900 rounded-3xl p-6 max-w-lg w-full border-4 border-amber-400 shadow-2xl space-y-4 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  playSfx('click', soundEnabled);
                  setActiveEncounterMonster(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Raksasa Encounter Header */}
              <div className="text-center space-y-2">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-950 border-2 border-amber-400 text-[#FFD54A] font-black text-sm">
                  👾 BANTU RAKSASA INI!
                </span>

                <div className="flex justify-center items-center gap-3 py-2">
                  <div className="text-6xl animate-bounce">{activeEncounterMonster.avatar}</div>
                  <div className="text-left">
                    <h3 className="font-black text-xl text-white">
                      {activeEncounterMonster.name}
                    </h3>
                    <p className="text-sm text-[#FFD54A] font-bold">
                      Keperluan: {activeEncounterMonster.questionBadge}
                    </p>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-[#FFF8E8] bg-slate-950/90 p-4 rounded-2xl border-2 border-slate-800 leading-relaxed font-bold">
                  "{activeEncounterMonster.questionText}"
                </p>
              </div>

              {/* Visual Grid representation if available */}
              {activeEncounterMonster.gridVisual && (
                <div className="bg-slate-950 p-3 rounded-2xl border-2 border-slate-800 flex flex-col items-center justify-center gap-2">
                  <span className="text-xs text-[#FFD54A] font-black">GAMBARAN BLOK PECAHAN:</span>
                  <div className="flex gap-2">
                    {Array.from({ length: activeEncounterMonster.gridVisual.total }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-11 h-11 rounded-xl border-2 transition-all flex items-center justify-center font-black text-sm ${
                          idx < activeEncounterMonster.gridVisual!.filled
                            ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-md'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INVENTORY FRACTION CARDS SELECTION */}
              <div className="space-y-2">
                <span className="text-sm font-black text-[#FFD54A] flex items-center gap-1.5">
                  <span>🧰</span>
                  <span>PILIH JAWAPAN YANG BETUL:</span>
                </span>

                <div className="grid grid-cols-3 gap-3">
                  {activeEncounterMonster.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        setSelectedFractionCard(opt);
                      }}
                      className={`py-4 px-2 rounded-2xl border-2 font-black text-base sm:text-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedFractionCard === opt
                          ? 'bg-purple-600 border-amber-300 text-white shadow-lg scale-105'
                          : 'bg-slate-800 border-slate-700 text-white hover:border-amber-400'
                      }`}
                    >
                      <span className="text-xl">🟪</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Alert if answered */}
              {feedbackMessage && (
                <div
                  className={`p-3.5 rounded-2xl text-sm font-black border leading-relaxed ${
                    feedbackMessage.isCorrect
                      ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
                      : 'bg-red-950/95 border-red-400 text-red-200'
                  }`}
                >
                  {feedbackMessage.text}
                </div>
              )}

              {/* HEAL BUTTON */}
              <button
                onClick={handleHealMonster}
                disabled={!selectedFractionCard}
                className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 cursor-pointer border-b-4 ${
                  selectedFractionCard
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                    : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 fill-current" />
                <span>✨ BANTU RAKSASA INI</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GAME OVER MODAL */}
      <AnimatePresence>
        {showGameOverModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full border-4 border-red-600 text-center shadow-2xl space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center text-4xl mx-auto shadow-inner">
                😢
              </div>

              <h2 className="font-black text-3xl text-red-400">
                JOM CUBA LAGI!
              </h2>

              <p className="text-base text-[#FFF8E8] font-bold leading-relaxed">
                Nyawa kamu telah habis. Jangan putus asa, mari cuba semula!
              </p>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleStartLevel(activeLevelId)}
                  className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>🔄 MAIN SEMULA DUNIA INI</span>
                </button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowGameOverModal(false);
                    setCurrentScreen('level_select');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                >
                  <Home className="w-5 h-5" />
                  <span>🏠 PILIH DUNIA LAIN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEVEL / WORLD FINISH MODAL */}
      <AnimatePresence>
        {showLevelFinishModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-400 text-center shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full bg-amber-950 border-4 border-amber-400 flex items-center justify-center text-5xl mx-auto shadow-inner">
                🏆
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-950 border-2 border-amber-400 text-[#FFD54A] font-black text-sm">
                {activeLevelId === 3 ? '🏆 DUNIA PIXEL SELAMAT!' : `🎉 DUNIA ${activeLevelId} SELESAI!`}
              </span>

              <h2 className="font-black text-3xl text-white">
                HEBAT! KAMU BERJAYA!
              </h2>

              <p className="text-base sm:text-lg text-[#FFF8E8] font-bold leading-relaxed">
                {activeLevelId === 3
                  ? 'Syabas! Kamu berjaya menyelamatkan seluruh Dunia Pixel! Semua raksasa kini gembira!'
                  : 'Semua raksasa di dunia ini telah berjaya dibantu!'}
              </p>

              {/* Stars Earned */}
              <div className="space-y-1.5 bg-slate-950 p-4 rounded-2xl border-2 border-slate-800">
                <div className="flex justify-center gap-3 py-1">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className="w-10 h-10 fill-amber-400 text-amber-400 drop-shadow-md animate-bounce"
                    />
                  ))}
                </div>
                <p className="text-base font-black text-[#FFD54A]">
                  ⭐ JUMLAH BINTANG: {totalPixelStars} / 9
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {activeLevelId < 3 ? (
                  <button
                    onClick={() => handleStartLevel((activeLevelId + 1) as 1 | 2 | 3)}
                    className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>DUNIA SETERUSNYA ➡️</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartLevel(3)}
                    className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>🔄 MAIN SEMULA DUNIA 3</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowLevelFinishModal(false);
                    setCurrentScreen('level_select');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                >
                  <Home className="w-5 h-5" />
                  <span>🏠 PILIH DUNIA LAIN</span>
                </button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowLevelFinishModal(false);
                    onBackToHub();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-900"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>🌎 KEMBALI KE HUB UTAMA</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PORTAL OPENING & CUTSCENE MODAL */}
      <AnimatePresence>
        {showPortalCutscene && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 30 }}
              className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border-4 border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)] space-y-5 text-center relative"
            >
              {/* Spinning Portal Icon */}
              <div className="relative flex justify-center py-2">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="text-7xl filter drop-shadow-[0_0_30px_rgba(6,182,212,0.9)]"
                >
                  🌀
                </motion.div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse">
                  ✨
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1.5 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-300 font-black text-xs inline-block">
                  🌀 PORTAL DIBUKA!
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-white">
                  DUNIA {activeLevelId} SELESAI!
                </h3>
                <p className="text-base text-[#FFF8E8] font-bold leading-relaxed">
                  {activeLevelId === 1 && 'Syabas! Semua raksasa di Hutan Pecahan telah gembira! Portal ke Gua Kristal kini terbuka!'}
                  {activeLevelId === 2 && 'Hebat sekali! Semua raksasa di Gua Kristal bersinar semula! Portal ke Gunung Pelangi sedia dimasuki!'}
                  {activeLevelId === 3 && 'TAHNIAH! Kamu telah menyelamatkan seluruh Dunia Pixel!'}
                </p>
              </div>

              {/* Story Cutscene Character Dialogue */}
              <div className="bg-slate-950/90 p-4 rounded-2xl border-2 border-cyan-500/50 flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-cyan-400 shrink-0 bg-amber-200 flex items-center justify-center">
                  <AlyaCharacter size="sm" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-amber-300">👧 ALYA</h4>
                  <p className="text-xs sm:text-sm text-white font-bold leading-snug">
                    {activeLevelId < 3
                      ? '"Jom masuk ke dalam Portal Ajaib untuk meneroka dunia baharu!"'
                      : '"Dunia Pixel kini selamat! Kamu jaguh pecahan sebenar!"'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                {activeLevelId < 3 ? (
                  <button
                    onClick={handleEnterNextLevelFromPortal}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 cursor-pointer border-b-4 border-cyan-800 animate-pulse"
                  >
                    <span>🌀 MASUK PORTAL AJAIB ➡️</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowPortalCutscene(false);
                      setShowLevelFinishModal(true);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-800"
                  >
                    <span>🏆 LIHAT ANUGERAH</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
