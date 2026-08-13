import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Star,
  Heart,
  RotateCcw,
  MessageCircle,
  Lock,
  Play,
  Award,
  Sparkles,
  ChefHat,
  Utensils,
  Home,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { playSfx, togglePizzaBgm } from '../utils/audio';
import confetti from 'canvas-confetti';
import { FormattedMathText } from './MathFraction';

// Assets
import bannerDapur from '../assets/images/banner_dapur_pecahan_1785426792370.jpg';
import chefAlyaImg from '../assets/images/chef_mascot_1785465244177.jpg';

interface DapurPecahanGameplayProps {
  soundEnabled: boolean;
  onBackToHub: () => void;
  onToggleSound: () => void;
  onUpdateWorldProgress?: (worldId: string, starsEarned: number) => void;
  onCompleteChallenge?: (challengeId: string, starsEarned: number) => void;
}

const DAPUR_STORAGE_KEY = 'dapur_pecahan_progress_v1';

interface DapurStorageData {
  level1Complete: boolean;
  level2Complete: boolean;
  level3Complete: boolean;
  level1Stars: number;
  level2Stars: number;
  level3Stars: number;
}

const DEFAULT_DAPUR_STORAGE: DapurStorageData = {
  level1Complete: false,
  level2Complete: false,
  level3Complete: false,
  level1Stars: 0,
  level2Stars: 0,
  level3Stars: 0,
};

// Question type for Cooking Challenges
export interface CookingChallenge {
  id: string;
  ingredientName: string;
  ingredientIcon: string;
  chefInstruction: string;
  targetFractionText: string;
  targetNumerator: number;
  targetDenominator: number;
  visualType: 'measuring_cup' | 'pizza_slice' | 'chocolate' | 'apple' | 'text_prompt';
  options: { label: string; num: number; denom: number }[];
  correctIndex: number;
  explanation: string;
}

// Pool of Peringkat 1 Challenges (Sukat Bahan)
const PERINGKAT1_CHALLENGES: CookingChallenge[] = [
  {
    id: 'd1_c1',
    ingredientName: 'Susu Segar',
    ingredientIcon: '🥛',
    chefInstruction: 'Chef Alya: "Sila sukat 3/4 cawan susu segar ke dalam mangkuk adunan kek!"',
    targetFractionText: '3/4',
    targetNumerator: 3,
    targetDenominator: 4,
    visualType: 'measuring_cup',
    options: [
      { label: '1/4 Cawan', num: 1, denom: 4 },
      { label: '3/4 Cawan', num: 3, denom: 4 },
      { label: '2/4 Cawan', num: 2, denom: 4 },
    ],
    correctIndex: 1,
    explanation: '3/4 cawan memenuhi 3 daripada 4 garisan cawan penyukat!',
  },
  {
    id: 'd1_c2',
    ingredientName: 'Tepung Gandum',
    ingredientIcon: '🌾',
    chefInstruction: 'Chef Alya: "Masukkan 1/2 cawan tepung gandum untuk membuat biskut comel!"',
    targetFractionText: '1/2',
    targetNumerator: 1,
    targetDenominator: 2,
    visualType: 'measuring_cup',
    options: [
      { label: '1/4 Cawan', num: 1, denom: 4 },
      { label: '1/2 Cawan', num: 1, denom: 2 },
      { label: '3/4 Cawan', num: 3, denom: 4 },
    ],
    correctIndex: 1,
    explanation: '1/2 cawan memenuhi separuh (50%) daripada cawan penyukat!',
  },
  {
    id: 'd1_c3',
    ingredientName: 'Minyak Masak',
    ingredientIcon: '🪔',
    chefInstruction: 'Chef Alya: "Apakah pecahan cawan penyukat yang berisi cecair di bawah?"',
    targetFractionText: '2/4',
    targetNumerator: 2,
    targetDenominator: 4,
    visualType: 'measuring_cup',
    options: [
      { label: '1/4', num: 1, denom: 4 },
      { label: '2/4', num: 2, denom: 4 },
      { label: '4/4', num: 4, denom: 4 },
    ],
    correctIndex: 1,
    explanation: 'Paras cecair menyentuhi garisan 2 daripada 4 bahagian = 2/4.',
  },
  {
    id: 'd1_c4',
    ingredientName: 'Coklat Cair',
    ingredientIcon: '🍫',
    chefInstruction: 'Chef Alya: "Berapakah pecahan coklat yang diambil untuk topping kek?"',
    targetFractionText: '4/6',
    targetNumerator: 4,
    targetDenominator: 6,
    visualType: 'chocolate',
    options: [
      { label: '2/6', num: 2, denom: 6 },
      { label: '4/6', num: 4, denom: 6 },
      { label: '1/6', num: 1, denom: 6 },
    ],
    correctIndex: 1,
    explanation: '4 petak coklat dipotong daripada 6 petak keseluruhan = 4/6.',
  },
  {
    id: 'd1_c5',
    ingredientName: 'Gula Halus',
    ingredientIcon: '🍬',
    chefInstruction: 'Chef Alya: "Suka 1/4 cawan gula halus supaya kek tidak terlalu manis!"',
    targetFractionText: '1/4',
    targetNumerator: 1,
    targetDenominator: 4,
    visualType: 'measuring_cup',
    options: [
      { label: '1/4 Cawan', num: 1, denom: 4 },
      { label: '3/4 Cawan', num: 3, denom: 4 },
      { label: '2/4 Cawan', num: 2, denom: 4 },
    ],
    correctIndex: 0,
    explanation: '1 daripada 4 garisan cawan ialah 1/4 (satu perempat).',
  },
  {
    id: 'd1_c6',
    ingredientName: 'Buah Epal',
    ingredientIcon: '🍎',
    chefInstruction: 'Chef Alya: "Epal dibelah 4. Ambil 3 bahagian untuk pai epal. Berapakah pecahannya?"',
    targetFractionText: '3/4',
    targetNumerator: 3,
    targetDenominator: 4,
    visualType: 'apple',
    options: [
      { label: '1/4', num: 1, denom: 4 },
      { label: '2/4', num: 2, denom: 4 },
      { label: '3/4', num: 3, denom: 4 },
    ],
    correctIndex: 2,
    explanation: '3 hiris epal daripada 4 hiris keseluruhan = 3/4.',
  },
];

// Peringkat 2 Challenges (Campur & Bahagikan)
const PERINGKAT2_CHALLENGES: CookingChallenge[] = [
  {
    id: 'd2_c1',
    ingredientName: 'Mangkuk Kek',
    ingredientIcon: '🎂',
    chefInstruction: 'Chef Alya: "Campurkan 1/4 cawan susu dan 2/4 cawan susu. Berapakah jumlahnya?"',
    targetFractionText: '3/4',
    targetNumerator: 3,
    targetDenominator: 4,
    visualType: 'text_prompt',
    options: [
      { label: '2/4 Cawan', num: 2, denom: 4 },
      { label: '3/4 Cawan', num: 3, denom: 4 },
      { label: '4/4 Cawan', num: 4, denom: 4 },
    ],
    correctIndex: 1,
    explanation: '1/4 + 2/4 = 3/4 cawan (Penyebut sama 4, tambah pengangka 1+2=3)!',
  },
  {
    id: 'd2_c2',
    ingredientName: 'Potongan Pizza',
    ingredientIcon: '🍕',
    chefInstruction: 'Chef Alya: "Bahagikan pizza 8 keping kepada 2 orang murid secara sama banyak. Berapa pecahan setiap orang?"',
    targetFractionText: '4/8',
    targetNumerator: 4,
    targetDenominator: 8,
    visualType: 'pizza_slice',
    options: [
      { label: '2/8', num: 2, denom: 8 },
      { label: '4/8', num: 4, denom: 8 },
      { label: '6/8', num: 6, denom: 8 },
    ],
    correctIndex: 1,
    explanation: '8 bahagi 2 = 4 keping seorang, iaitu 4/8 (atau 1/2)!',
  },
  {
    id: 'd2_c3',
    ingredientName: 'Sirap Strawberi',
    ingredientIcon: '🍓',
    chefInstruction: 'Chef Alya: "Kecualikan 1/5 sirap daripada 5/5 mangkuk. Berapa baki sirap?"',
    targetFractionText: '4/5',
    targetNumerator: 4,
    targetDenominator: 5,
    visualType: 'measuring_cup',
    options: [
      { label: '4/5', num: 4, denom: 5 },
      { label: '3/5', num: 3, denom: 5 },
      { label: '2/5', num: 2, denom: 5 },
    ],
    correctIndex: 0,
    explanation: '5/5 - 1/5 = 4/5 baki sirap strawberi!',
  },
];

// Peringkat 3 Recipe Data Structures
export interface RecipeStep {
  title: string;
  ingredientName: string;
  ingredientIcon: string;
  instruction: string;
  targetFraction: string;
  fillPercent: number;
  options: { label: string; num: number; denom: number; isCorrect: boolean }[];
  explanation: string;
}

export interface DishRecipe {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: RecipeStep[];
}

export const CHEF_RECIPES: DishRecipe[] = [
  {
    id: 'kek_coklat',
    name: 'Kek Coklat Leleh',
    icon: '🧁',
    description: 'Kek coklat manis dan lembut!',
    steps: [
      {
        title: 'Bahan 1: Tepung Gandum',
        ingredientName: 'Tepung Gandum',
        ingredientIcon: '🌾',
        instruction: 'Chef Alya: "Sukat 2/4 cawan tepung gandum ke dalam cawan penyukat!"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '1/4 Cawan (25%)', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan (50%)', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan (75%)', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '2/4 cawan memenuhi 50% cawan penyukat (2 daripada 4 garisan)!',
      },
      {
        title: 'Bahan 2: Susu Segar',
        ingredientName: 'Susu Segar',
        ingredientIcon: '🥛',
        instruction: 'Chef Alya: "Sukat 1/4 cawan susu segar!"',
        targetFraction: '1/4',
        fillPercent: 25,
        options: [
          { label: '1/4 Cawan (25%)', num: 1, denom: 4, isCorrect: true },
          { label: '2/4 Cawan (50%)', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan (75%)', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 cawan memenuhi garisan 1 daripada 4 garisan cawan penyukat!',
      },
      {
        title: 'Bahan 3: Serbuk Coklat',
        ingredientName: 'Serbuk Coklat',
        ingredientIcon: '🍫',
        instruction: 'Chef Alya: "Berapakah jumlah jika kita campurkan 1/4 coklat + 2/4 coklat?"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
          { label: '4/4 Cawan', num: 4, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 + 2/4 = 3/4 cawan coklat leleh (75% penuh)!',
      },
    ],
  },
  {
    id: 'pizza_keju',
    name: 'Pizza Keju Istimewa',
    icon: '🍕',
    description: 'Pizza keju meleleh beraroma!',
    steps: [
      {
        title: 'Bahan 1: Sos Tomat',
        ingredientName: 'Sos Tomat',
        ingredientIcon: '🍅',
        instruction: 'Chef Alya: "Sukat 3/4 cawan sos tomat pekat!"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
        ],
        explanation: '3/4 cawan sos memenuhi 3 daripada 4 bahagian cawan penyukat!',
      },
      {
        title: 'Bahan 2: Keju Mozzarella',
        ingredientName: 'Keju Mozzarella',
        ingredientIcon: '🧀',
        instruction: 'Chef Alya: "Manakah pecahan setara (sama nilai) dengan 2/4 cawan keju?"',
        targetFraction: '1/2',
        fillPercent: 50,
        options: [
          { label: '1/3 Cawan', num: 1, denom: 3, isCorrect: false },
          { label: '1/2 Cawan', num: 1, denom: 2, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '2/4 dan 1/2 adalah pecahan setara kerana kedua-duanya bernilai separuh!',
      },
      {
        title: 'Bahan 3: Minyak Zaitun',
        ingredientName: 'Minyak Zaitun',
        ingredientIcon: '🫒',
        instruction: 'Chef Alya: "Campurkan 1/4 minyak + 1/4 minyak. Berapakah jumlahnya?"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '2/4 Cawan (1/2)', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
          { label: '4/4 Cawan', num: 4, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 + 1/4 = 2/4 cawan (atau 1/2 cawan)!',
      },
    ],
  },
  {
    id: 'biskut_coklat',
    name: 'Biskut Chip Coklat',
    icon: '🍪',
    description: 'Biskut rangup berperisa coklat!',
    steps: [
      {
        title: 'Bahan 1: Mentega Cair',
        ingredientName: 'Mentega Cair',
        ingredientIcon: '🧈',
        instruction: 'Chef Alya: "Sukat 2/4 cawan mentega cair!"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '2/4 cawan mentega memenuhi separuh daripada cawan penyukat!',
      },
      {
        title: 'Bahan 2: Gula Perang',
        ingredientName: 'Gula Perang',
        ingredientIcon: '🍬',
        instruction: 'Chef Alya: "Sukat 1/4 cawan gula perang!"',
        targetFraction: '1/4',
        fillPercent: 25,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: true },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 cawan gula perang ialah 25% penuh!',
      },
      {
        title: 'Bahan 3: Coklat Chip',
        ingredientName: 'Coklat Chip',
        ingredientIcon: '🍫',
        instruction: 'Chef Alya: "Sukat 3/4 cawan coklat chip!"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
        ],
        explanation: '3/4 cawan coklat chip memenuhi garisan 75% cawan penyukat!',
      },
    ],
  },
  {
    id: 'lempeng_madu',
    name: 'Lempeng Madu',
    icon: '🥞',
    description: 'Lempeng lembut disirami madu manis!',
    steps: [
      {
        title: 'Bahan 1: Tepung Lempeng',
        ingredientName: 'Tepung Lempeng',
        ingredientIcon: '🌾',
        instruction: 'Chef Alya: "Sukat 3/4 cawan tepung lempeng!"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
        ],
        explanation: '3/4 cawan tepung lempeng memenuhi 3/4 bahagian cawan!',
      },
      {
        title: 'Bahan 2: Susu Segar',
        ingredientName: 'Susu Segar',
        ingredientIcon: '🥛',
        instruction: 'Chef Alya: "Sukat 2/4 cawan susu segar!"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: true },
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '4/4 Cawan', num: 4, denom: 4, isCorrect: false },
        ],
        explanation: '2/4 cawan susu menyentuhi garisan 50% cawan penyukat!',
      },
      {
        title: 'Bahan 3: Madu Manis',
        ingredientName: 'Madu Manis',
        ingredientIcon: '🍯',
        instruction: 'Chef Alya: "Campurkan 1/4 madu + 1/4 madu. Berapakah jumlahnya?"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 + 1/4 = 2/4 cawan madu lezat!',
      },
    ],
  },
  {
    id: 'sandwic_telur',
    name: 'Sandwic Telur',
    icon: '🥪',
    description: 'Sandwic segar berkhasiat!',
    steps: [
      {
        title: 'Bahan 1: Mayonis Segar',
        ingredientName: 'Mayonis',
        ingredientIcon: '🥛',
        instruction: 'Chef Alya: "Sukat 1/4 cawan mayonis!"',
        targetFraction: '1/4',
        fillPercent: 25,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: true },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 cawan mayonis memenuhi 25% cawan penyukat!',
      },
      {
        title: 'Bahan 2: Telur Hancur',
        ingredientName: 'Telur Hancur',
        ingredientIcon: '🥚',
        instruction: 'Chef Alya: "Sukat 3/4 cawan telur hancur!"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
        ],
        explanation: '3/4 cawan telur hancur menyentuhi garisan 75% cawan penyukat!',
      },
      {
        title: 'Bahan 3: Mentega',
        ingredientName: 'Mentega',
        ingredientIcon: '🧈',
        instruction: 'Chef Alya: "Campurkan 1/4 mentega + 2/4 mentega. Berapa jumlahnya?"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
          { label: '4/4 Cawan', num: 4, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 + 2/4 = 3/4 cawan mentega!',
      },
    ],
  },
  {
    id: 'salad_buah',
    name: 'Salad Buah Segar',
    icon: '🍓',
    description: 'Campuran buah-buahan manis berkhasiat!',
    steps: [
      {
        title: 'Bahan 1: Potongan Epal',
        ingredientName: 'Potongan Epal',
        ingredientIcon: '🍎',
        instruction: 'Chef Alya: "Sukat 2/4 cawan epal merah!"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '2/4 cawan epal memenuhi separuh daripada cawan penyukat!',
      },
      {
        title: 'Bahan 2: Strawberi Segar',
        ingredientName: 'Strawberi',
        ingredientIcon: '🍓',
        instruction: 'Chef Alya: "Sukat 3/4 cawan strawberi manis!"',
        targetFraction: '3/4',
        fillPercent: 75,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: false },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: true },
        ],
        explanation: '3/4 cawan strawberi memenuhi 3 daripada 4 bahagian cawan!',
      },
      {
        title: 'Bahan 3: Sirap Madu',
        ingredientName: 'Sirap Madu',
        ingredientIcon: '🍯',
        instruction: 'Chef Alya: "Campurkan 1/4 madu + 1/4 madu. Berapakah jumlahnya?"',
        targetFraction: '2/4',
        fillPercent: 50,
        options: [
          { label: '1/4 Cawan', num: 1, denom: 4, isCorrect: false },
          { label: '2/4 Cawan', num: 2, denom: 4, isCorrect: true },
          { label: '3/4 Cawan', num: 3, denom: 4, isCorrect: false },
        ],
        explanation: '1/4 + 1/4 = 2/4 cawan sirap madu!',
      },
    ],
  },
];

// Peringkat 3 Challenges (Cabaran Chef)
const PERINGKAT3_CHALLENGES: CookingChallenge[] = [
  {
    id: 'd3_c1',
    ingredientName: 'Kek Hari Jadi',
    ingredientIcon: '🧁',
    chefInstruction: 'Chef Alya: "Manakah pecahan setara (sama nilai) dengan 2/4 sukatan minyak?"',
    targetFractionText: '1/2',
    targetNumerator: 1,
    targetDenominator: 2,
    visualType: 'text_prompt',
    options: [
      { label: '1/3', num: 1, denom: 3 },
      { label: '1/2', num: 1, denom: 2 },
      { label: '3/4', num: 3, denom: 4 },
    ],
    correctIndex: 1,
    explanation: '2/4 dan 1/2 adalah pecahan setara (separuh daripada keseluruhan)!',
  },
  {
    id: 'd3_c2',
    ingredientName: 'Pai Coklat',
    ingredientIcon: '🥧',
    chefInstruction: 'Chef Alya: "Hitungkan 2/6 + 3/6 sukatan coklat cair!"',
    targetFractionText: '5/6',
    targetNumerator: 5,
    targetDenominator: 6,
    visualType: 'chocolate',
    options: [
      { label: '4/6', num: 4, denom: 6 },
      { label: '5/6', num: 5, denom: 6 },
      { label: '6/6', num: 6, denom: 6 },
    ],
    correctIndex: 1,
    explanation: '2/6 + 3/6 = 5/6 (2 + 3 = 5)!',
  },
];

export const DapurPecahanGameplay: React.FC<DapurPecahanGameplayProps> = ({
  soundEnabled,
  onBackToHub,
  onToggleSound,
  onUpdateWorldProgress,
  onCompleteChallenge,
}) => {
  // LocalStorage Progress
  const [dapurProgress, setDapurProgress] = useState<DapurStorageData>(() => {
    try {
      const saved = localStorage.getItem(DAPUR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DAPUR_STORAGE;
    } catch {
      return DEFAULT_DAPUR_STORAGE;
    }
  });

  // Current View Screen: 'welcome' | 'level_select' | 'gameplay'
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'level_select' | 'gameplay'>('welcome');
  const [activeLevelId, setActiveLevelId] = useState<1 | 2 | 3>(1);

  // Gameplay state
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [liquidFillPercent, setLiquidFillPercent] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [earnedStarsCurrentLevel, setEarnedStarsCurrentLevel] = useState<number>(3);

  // Peringkat 2 (Campur & Bahagikan) Interactive Gameplay State
  const [p2Score, setP2Score] = useState<number>(0);
  const [p2Combo, setP2Combo] = useState<number>(1);
  const [p2Step, setP2Step] = useState<number>(0); // 0: Cut Pizza, 1: Topping, 2: Equivalent, 3: Add Fractions
  const [isPizzaCut, setIsPizzaCut] = useState<boolean>(false);
  const [selectedToppingSlices, setSelectedToppingSlices] = useState<boolean[]>([false, false, false, false]);
  const [hasAddedP1, setHasAddedP1] = useState<boolean>(false);
  const [hasAddedP2, setHasAddedP2] = useState<boolean>(false);
  const [bowlFillLevel, setBowlFillLevel] = useState<number>(0); // 0: empty, 1: 1/4, 3: 3/4

  // Peringkat 3 (Cabaran Chef) Interactive Cooking State
  const [p3RecipeIndex, setP3RecipeIndex] = useState<number>(0);
  const [p3Step, setP3Step] = useState<number>(0);
  const [p3AddedIngredients, setP3AddedIngredients] = useState<string[]>([]);
  const [p3CookingPhase, setP3CookingPhase] = useState<'measuring' | 'ready_to_cook' | 'mixing' | 'baking' | 'cooked'>('measuring');
  const [bakingProgress, setBakingProgress] = useState<number>(0);

  // Active Challenges array
  const activeChallenges =
    activeLevelId === 1 ? PERINGKAT1_CHALLENGES : activeLevelId === 2 ? PERINGKAT2_CHALLENGES : PERINGKAT3_CHALLENGES;

  const currentC = activeChallenges[currentChallengeIndex] || activeChallenges[0];

  // Sync liquid fill percent when challenge changes
  useEffect(() => {
    if (currentC && activeLevelId !== 2) {
      setSelectedOptionIndex(null);
      setIsPouring(false);
      const instr = currentC.chefInstruction.toLowerCase();
      if (instr.includes('apakah pecahan') || instr.includes('berapakah sukatan')) {
        const initialPct = Math.round((currentC.targetNumerator / currentC.targetDenominator) * 100);
        setLiquidFillPercent(initialPct);
      } else {
        setLiquidFillPercent(0);
      }
    }
  }, [currentChallengeIndex, activeLevelId]);

  // Sound BGM sync
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);

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

  // Helper to save progress
  const saveDapurProgress = (updated: DapurStorageData) => {
    setDapurProgress(updated);
    localStorage.setItem(DAPUR_STORAGE_KEY, JSON.stringify(updated));

    const totalStars = updated.level1Stars + updated.level2Stars + updated.level3Stars;
    if (onUpdateWorldProgress) {
      onUpdateWorldProgress('dapur', totalStars);
    }
  };

  // Start Level
  const handleStartLevel = (levelId: 1 | 2 | 3) => {
    playSfx('click', soundEnabled);
    setActiveLevelId(levelId);
    setCurrentChallengeIndex(0);
    setLives(3);
    setSelectedOptionIndex(null);
    setLiquidFillPercent(0);
    setIsPouring(false);
    setShowGameOverModal(false);
    setShowFinishModal(false);
    setCurrentScreen('gameplay');

    if (levelId === 3) {
      setP3RecipeIndex(0);
      setP3Step(0);
      setP3AddedIngredients([]);
      setP3CookingPhase('measuring');
      setBakingProgress(0);
      setFeedback({
        text: 'Cabaran Chef: Pilih hidangan resepi dan sukat bahan-bahan dengan cawan penyukat!',
        type: 'info',
      });
    } else if (levelId === 2) {
      setP2Score(0);
      setP2Combo(1);
      setP2Step(0);
      setIsPizzaCut(false);
      setSelectedToppingSlices([false, false, false, false]);
      setHasAddedP1(false);
      setHasAddedP2(false);
      setBowlFillLevel(0);
      setFeedback({
        text: 'Cabaran 1: Bahagikan pizza kepada 4 bahagian sama besar!',
        type: 'info',
      });
    } else {
      setFeedback({
        text: `Cabaran 1: Sila semak sukatan bahan yang diminta oleh Chef Alya!`,
        type: 'info',
      });
    }
  };

  // Peringkat 3 Recipe Selection
  const handleP3SelectRecipe = (idx: number) => {
    if (p3CookingPhase !== 'measuring' && p3CookingPhase !== 'ready_to_cook') return;
    playSfx('click', soundEnabled);
    setP3RecipeIndex(idx);
    setP3Step(0);
    setP3AddedIngredients([]);
    setP3CookingPhase('measuring');
    setSelectedOptionIndex(null);
    setLiquidFillPercent(0);
    setFeedback({
      text: `Resepi dipilih: ${CHEF_RECIPES[idx].name}. Sukat bahan pertama!`,
      type: 'info',
    });
  };

  // Peringkat 3 Option Choice Handler
  const handleP3OptionChoose = (optionIdx: number) => {
    if (selectedOptionIndex !== null || lives <= 0 || p3CookingPhase !== 'measuring') return;

    const currentRecipe = CHEF_RECIPES[p3RecipeIndex];
    const currentStep = currentRecipe.steps[p3Step];
    const chosen = currentStep.options[optionIdx];

    setSelectedOptionIndex(optionIdx);
    setLiquidFillPercent(chosen.num && chosen.denom ? Math.round((chosen.num / chosen.denom) * 100) : currentStep.fillPercent);
    setIsPouring(true);
    playSfx('pop', soundEnabled);

    setTimeout(() => {
      setIsPouring(false);

      if (chosen.isCorrect) {
        playSfx('chime', soundEnabled);
        const ingredientBadge = `${currentStep.ingredientIcon} ${currentStep.ingredientName} (${currentStep.targetFraction})`;
        setP3AddedIngredients((prev) => [...prev, ingredientBadge]);

        setFeedback({
          text: `✨ SYABAS! ${currentStep.explanation}`,
          type: 'success',
        });

        try {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }

        setTimeout(() => {
          setSelectedOptionIndex(null);
          setLiquidFillPercent(0);

          if (p3Step + 1 < currentRecipe.steps.length) {
            setP3Step((prev) => prev + 1);
            setFeedback({
              text: `Pilih sukatan untuk Bahan ${p3Step + 2}: ${currentRecipe.steps[p3Step + 1].ingredientName}!`,
              type: 'info',
            });
          } else {
            // All 3 ingredients added! Ready to cook!
            setP3CookingPhase('ready_to_cook');
            setFeedback({
              text: '✨ SEMUA BAHAN TELAH SELESAI DISUKAT! Tekan 🔥 MASAK SEKARANG untuk memasak hidangan!',
              type: 'success',
            });
          }
        }, 1500);
      } else {
        // Wrong option
        playSfx('lock', soundEnabled);
        const newLives = lives - 1;
        setLives(newLives);

        setFeedback({
          text: `Belum tepat. ${currentStep.explanation}`,
          type: 'error',
        });

        if (newLives <= 0) {
          setTimeout(() => setShowGameOverModal(true), 1200);
        } else {
          setTimeout(() => {
            setSelectedOptionIndex(null);
            setLiquidFillPercent(0);
          }, 1600);
        }
      }
    }, 600);
  };

  // Peringkat 3 Cooking Sequence Handler
  const handleP3StartCooking = () => {
    playSfx('pop', soundEnabled);
    playSfx('chime', soundEnabled);
    setP3CookingPhase('mixing');
    setFeedback({
      text: '🥣 Mengadun bahan-bahan masakan...',
      type: 'info',
    });

    setTimeout(() => {
      setP3CookingPhase('baking');
      setFeedback({
        text: '🔥 Membakar hidangan di dalam ketuhar...',
        type: 'info',
      });

      // Animate baking progress bar
      let prog = 0;
      const interval = setInterval(() => {
        prog += 20;
        setBakingProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setP3CookingPhase('cooked');
            playSfx('fanfare', soundEnabled);
            setFeedback({
              text: `✨ HIDANGAN SIAP! ${CHEF_RECIPES[p3RecipeIndex].name} sedia untuk dihidangkan!`,
              type: 'success',
            });

            try {
              confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
            } catch {
              // ignore
            }
          }, 300);
        }
      }, 300);
    }, 1200);
  };

  // Peringkat 2 Step 0: Cut Pizza
  const handleCutPizza = () => {
    if (isPizzaCut) return;
    setIsPizzaCut(true);
    playSfx('pop', soundEnabled);
    playSfx('chime', soundEnabled);
    setP2Score((prev) => prev + 10);
    setP2Combo(1);
    setFeedback({
      text: '✨ BAGUS! Pizza kini dibahagikan kepada 4 bahagian sama besar (1/4 setiap keping).',
      type: 'success',
    });

    try {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setP2Step(1);
      setFeedback({ text: 'Cabaran 2: Letakkan keju pada 2/4 pizza!', type: 'info' });
    }, 2000);
  };

  // Peringkat 2 Step 1: Toggle Topping
  const handleToggleToppingSlice = (sliceIndex: number) => {
    playSfx('pop', soundEnabled);
    setSelectedToppingSlices((prev) => {
      const next = [...prev];
      next[sliceIndex] = !next[sliceIndex];
      return next;
    });
  };

  const handleConfirmTopping = () => {
    const cheeseCount = selectedToppingSlices.filter(Boolean).length;
    if (cheeseCount === 2) {
      // Correct!
      playSfx('chime', soundEnabled);
      setP2Score((prev) => prev + 10);
      setP2Combo(2);
      setFeedback({
        text: '✨ BAGUS! Kamu telah memilih 2 daripada 4 bahagian (2/4).',
        type: 'success',
      });

      try {
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setP2Step(2);
        setFeedback({ text: 'Cabaran 3: Bandingkan pecahan setara!', type: 'info' });
      }, 2000);
    } else {
      // Wrong!
      playSfx('lock', soundEnabled);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        text: `Belum tepat. Chef Alya minta keju pada 2 daripada 4 bahagian (2/4). Kamu telah memilih ${cheeseCount} bahagian.`,
        type: 'error',
      });

      if (newLives <= 0) {
        setTimeout(() => setShowGameOverModal(true), 1200);
      }
    }
  };

  // Peringkat 2 Step 2: Equivalent Choice
  const handleEquivalentChoice = (isEqualChosen: boolean) => {
    if (isEqualChosen) {
      // Correct!
      playSfx('chime', soundEnabled);
      setP2Score((prev) => prev + 10);
      setP2Combo(3);
      setFeedback({
        text: '✨ SYABAS! 2/4 dan 1/2 adalah pecahan setara kerana kedua-duanya bernilai separuh!',
        type: 'success',
      });

      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setP2Step(3);
        setFeedback({ text: 'Cabaran 4: Campurkan 1/4 gula dan 2/4 gula ke dalam mangkuk!', type: 'info' });
      }, 2000);
    } else {
      // Wrong!
      playSfx('lock', soundEnabled);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        text: 'Belum tepat. 2/4 dan 1/2 adalah pecahan setara kerana kedua-duanya bernilai separuh.',
        type: 'error',
      });

      if (newLives <= 0) {
        setTimeout(() => setShowGameOverModal(true), 1200);
      }
    }
  };

  // Peringkat 2 Step 3: Add Fractions
  const handleAddIngredientToBowl = (type: '1/4' | '2/4') => {
    let nextP1 = hasAddedP1;
    let nextP2 = hasAddedP2;
    let nextFill = bowlFillLevel;

    if (type === '1/4' && !hasAddedP1) {
      nextP1 = true;
      setHasAddedP1(true);
      nextFill += 1;
      setBowlFillLevel(nextFill);
      playSfx('pop', soundEnabled);
    } else if (type === '2/4' && !hasAddedP2) {
      nextP2 = true;
      setHasAddedP2(true);
      nextFill += 2;
      setBowlFillLevel(nextFill);
      playSfx('pop', soundEnabled);
    }

    if (nextP1 && nextP2) {
      // Both ingredients added!
      setP2Score((prev) => prev + 10);
      setP2Combo(4);
      playSfx('fanfare', soundEnabled);
      setFeedback({
        text: '✨ TAHNIAH! 1/4 + 2/4 = 3/4 gula berjaya dicampurkan ke dalam mangkuk adunan!',
        type: 'success',
      });

      try {
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      } catch {
        // ignore
      }

      setTimeout(() => {
        handleLevelComplete();
      }, 2000);
    }
  };

  // Option Choose Handler
  const handleOptionChoose = (optionIdx: number) => {
    if (selectedOptionIndex !== null || lives <= 0) return;

    setSelectedOptionIndex(optionIdx);
    const chosen = currentC.options[optionIdx];
    const isCorrect = optionIdx === currentC.correctIndex;

    // Calculate percentage fill based on chosen fraction
    const fillPct = Math.round((chosen.num / chosen.denom) * 100);
    setLiquidFillPercent(fillPct);
    setIsPouring(true);
    playSfx('pop', soundEnabled);

    setTimeout(() => {
      setIsPouring(false);

      if (isCorrect) {
        playSfx('chime', soundEnabled);
        setFeedback({
          text: `✨ BAGUS, CHEF! ${currentC.explanation}`,
          type: 'success',
        });

        try {
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }

        // Delay then move to next challenge
        setTimeout(() => {
          setSelectedOptionIndex(null);
          setLiquidFillPercent(0);

          if (currentChallengeIndex + 1 < activeChallenges.length) {
            setCurrentChallengeIndex((prev) => prev + 1);
            setFeedback({ text: 'Cabaran bahan seterusnya!', type: 'info' });
          } else {
            // Level Complete!
            handleLevelComplete();
          }
        }, 1600);
      } else {
        // WRONG ANSWER -> deduct 1 life
        playSfx('lock', soundEnabled);
        const newLives = lives - 1;
        setLives(newLives);

        setFeedback({
          text: `Belum tepat. ${currentC.explanation}`,
          type: 'error',
        });

        if (newLives <= 0) {
          // GAME OVER
          setTimeout(() => {
            setShowGameOverModal(true);
          }, 1200);
        } else {
          // Reset selection after feedback delay so user can try again or move forward
          setTimeout(() => {
            setSelectedOptionIndex(null);
            setLiquidFillPercent(0);
          }, 1800);
        }
      }
    }, 600);
  };

  // Level Complete logic
  const handleLevelComplete = () => {
    playSfx('fanfare', soundEnabled);
    try {
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    // Stars based on remaining lives
    let starsEarned = 3;
    if (lives === 2) starsEarned = 2;
    else if (lives === 1) starsEarned = 1;

    setEarnedStarsCurrentLevel(starsEarned);

    const updated = { ...dapurProgress };
    if (activeLevelId === 1) {
      updated.level1Complete = true;
      updated.level1Stars = Math.max(updated.level1Stars, starsEarned);
    } else if (activeLevelId === 2) {
      updated.level2Complete = true;
      updated.level2Stars = Math.max(updated.level2Stars, starsEarned);
    } else if (activeLevelId === 3) {
      updated.level3Complete = true;
      updated.level3Stars = Math.max(updated.level3Stars, starsEarned);
    }

    saveDapurProgress(updated);
    if (onCompleteChallenge) {
      onCompleteChallenge(`dapur-${activeLevelId}`, starsEarned);
    }
    setShowFinishModal(true);
  };

  const totalDapurStars = dapurProgress.level1Stars + dapurProgress.level2Stars + dapurProgress.level3Stars;

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#4A3728] flex flex-col relative overflow-x-hidden selection:bg-amber-200">
      
      {/* STICKY TOP HUD NAVBAR */}
      <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-[#4A3728] text-white shadow-md border-b-2 border-amber-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSfx('click', soundEnabled);
                setShowFinishModal(false);
                setShowGameOverModal(false);
                if (currentScreen === 'gameplay') {
                  setCurrentScreen('level_select');
                } else if (currentScreen === 'level_select') {
                  setCurrentScreen('welcome');
                } else {
                  onBackToHub();
                }
              }}
              className="flex items-center gap-1.5 bg-amber-950 hover:bg-amber-900 text-amber-200 px-3 py-1.5 rounded-xl border border-amber-700 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {currentScreen === 'gameplay'
                  ? 'KEMBALI KE PERINGKAT DAPUR'
                  : currentScreen === 'level_select'
                  ? 'KEMBALI KE UTAMA DAPUR'
                  : 'KEMBALI KE DUNIA PENGEMBARAAN'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl leading-none">🍳</span>
              <div>
                <span className="font-serif-title font-bold text-base text-amber-200 tracking-wide block leading-none">
                  DAPUR PECAHAN
                </span>
                <span className="text-[10px] text-amber-300 font-medium block leading-tight">
                  Dunia 2 — Sukat, Campur & Siapkan Hidangan!
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Stars Count */}
            <div className="flex items-center gap-1.5 bg-amber-950 px-3 py-1.5 rounded-xl border border-amber-700 text-xs sm:text-sm font-bold text-amber-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalDapurStars} / 9 Bintang</span>
            </div>

            {/* Sound BGM Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setBgmEnabled(!bgmEnabled);
                playSfx('click', soundEnabled);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                bgmEnabled
                  ? 'bg-amber-700 border-amber-500 text-amber-100'
                  : 'bg-amber-950 border-amber-800 text-gray-400'
              }`}
            >
              {bgmEnabled ? <Volume2 className="w-4 h-4 text-amber-200" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* SCREEN 1: WELCOME SCREEN (PEMBUKAAN GAME) */}
      {currentScreen === 'welcome' && (
        <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full bg-white rounded-3xl p-6 sm:p-10 border-4 border-[#F6C7A8] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
          >
            {/* Background Image Accent */}
            <img
              src={bannerDapur}
              alt="Dapur Pecahan Kitchen"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
            />

            {/* Chef Alya Mascot Image */}
            <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-[#F4C95D] shadow-xl shrink-0 bg-amber-100">
              <img
                src={chefAlyaImg}
                alt="Chef Alya"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-xl py-1 text-center">
                <span className="text-xs font-serif-title font-bold text-amber-300">
                  Chef Alya 👩🍳
                </span>
              </div>
            </div>

            {/* Welcome Dialogue & Message */}
            <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D98262]/10 border border-[#D98262]/30 text-[#D98262] font-rounded font-extrabold text-xs uppercase tracking-wider">
                <ChefHat className="w-4 h-4 text-[#D98262]" />
                <span>DUNIA 2 — PEMASAKAN MATEMATIK</span>
              </div>

              <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-[#4A3728] leading-tight">
                Selamat Datang ke Dapur Pecahan! 🍳
              </h1>

              <div className="bg-[#FFF8E8] p-4 rounded-2xl border-2 border-amber-300 shadow-inner space-y-2">
                <p className="font-rounded font-bold text-base text-[#D98262]">
                  "Hari ini kita akan memasak hidangan lazat sambil belajar pecahan!"
                </p>
                <p className="font-rounded font-medium text-xs sm:text-sm text-[#4A3728]/80 leading-relaxed">
                  Bantu Chef Alya menyukat susu, tepung, gula, dan bahan-bahan dengan cawan penyukat pecahan yang tepat. Kumpul kesemua 9 bintang!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playSfx('fanfare', soundEnabled);
                  setCurrentScreen('level_select');
                }}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#D98262] hover:from-amber-600 hover:to-[#c87253] text-white font-rounded font-extrabold text-lg shadow-xl flex items-center justify-center gap-3 border-b-4 border-amber-800 cursor-pointer"
              >
                <span>🍳 MULAKAN MEMASAK</span>
              </motion.button>
            </div>
          </motion.div>
        </main>
      )}

      {/* SCREEN 2: LEVEL SELECT HUB (3 PERINGKAT KAD) */}
      {currentScreen === 'level_select' && (
        <main className="max-w-7xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col gap-6">
          
          {/* Header Graphic Banner */}
          <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-amber-900 text-white min-h-[180px] sm:min-h-[220px] flex items-center">
            <img
              src={bannerDapur}
              alt="Dapur Pecahan Kitchen"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-amber-900/80 to-transparent" />

            <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400 text-amber-200 font-rounded font-bold text-xs uppercase tracking-wider">
                <span>👩🍳 DUNIA 2 — DAPUR PECAHAN</span>
              </div>

              <h1 className="font-serif-title font-extrabold text-3xl sm:text-4xl text-amber-300 tracking-tight leading-tight">
                PILIH PERINGKAT MEMASAK
              </h1>

              <p className="font-rounded font-medium text-xs sm:text-sm text-amber-100 leading-relaxed">
                Pilih peringkat untuk mula menyukat dan memasak hidangan! Selesaikan Peringkat 1 untuk membuka Peringkat 2.
              </p>
            </div>
          </div>

          {/* 3 LEVEL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PERINGKAT 1 CARD — SUKAT BAHAN */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border-3 border-amber-400 shadow-lg flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">
                    PERINGKAT 1
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= dapurProgress.level1Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
                    🥣
                  </div>
                  <div>
                    <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">SUKAT BAHAN</h3>
                    <p className="text-xs text-gray-500 font-medium">Pengenalan Cawan Penyukat</p>
                  </div>
                </div>

                <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                  Sukat bahan resipi menggunakan cawan penyukat pecahan (1/4, 1/2, 3/4) untuk membuat adunan kek dan biskut!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartLevel(1)}
                className="w-full mt-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{dapurProgress.level1Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 1'}</span>
              </motion.button>
            </motion.div>

            {/* PERINGKAT 2 CARD — CAMPUR & BAHAGIKAN */}
            {(() => {
              const isUnlocked = dapurProgress.level1Complete;
              return (
                <motion.div
                  whileHover={isUnlocked ? { y: -4 } : {}}
                  className={`bg-white rounded-3xl p-6 border-3 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                    isUnlocked ? 'border-amber-400' : 'border-gray-300 opacity-80 bg-gray-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-extrabold text-xs px-3 py-1 rounded-full border ${
                          isUnlocked
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        PERINGKAT 2
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= dapurProgress.level2Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                          isUnlocked ? 'bg-[#D98262] text-white' : 'bg-gray-400 text-gray-200'
                        }`}
                      >
                        🍕
                      </div>
                      <div>
                        <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">CAMPUR & BAHAGIKAN</h3>
                        <p className="text-xs text-gray-500 font-medium">Penambahan & Pembahagian</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                      Campurkan cecair dan bahagikan potongan pizza dan kek kepada rakan-rakan di dapur secara adil!
                    </p>
                  </div>

                  {isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartLevel(2)}
                      className="w-full mt-6 py-3 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#9a4b2e]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{dapurProgress.level2Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 2'}</span>
                    </motion.button>
                  ) : (
                    <div className="w-full mt-6 py-3 rounded-2xl bg-gray-200 text-gray-500 font-rounded font-bold text-xs flex items-center justify-center gap-2 border border-gray-300">
                      <Lock className="w-4 h-4" />
                      <span>SELESAIKAN PERINGKAT 1 DAHULU</span>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* PERINGKAT 3 CARD — CABARAN CHEF */}
            {(() => {
              const isUnlocked = dapurProgress.level2Complete;
              return (
                <motion.div
                  whileHover={isUnlocked ? { y: -4 } : {}}
                  className={`bg-white rounded-3xl p-6 border-3 shadow-lg flex flex-col justify-between relative overflow-hidden ${
                    isUnlocked ? 'border-amber-400' : 'border-gray-300 opacity-80 bg-gray-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-extrabold text-xs px-3 py-1 rounded-full border ${
                          isUnlocked
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-gray-200 text-gray-600 border-gray-300'
                        }`}
                      >
                        PERINGKAT 3
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= dapurProgress.level3Stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                          isUnlocked ? 'bg-[#A9C5A0] text-emerald-950' : 'bg-gray-400 text-gray-200'
                        }`}
                      >
                        🍰
                      </div>
                      <div>
                        <h3 className="font-serif-title font-bold text-xl text-[#4A3728]">CABARAN CHEF</h3>
                        <p className="text-xs text-gray-500 font-medium">Pecahan Setara & Penyebut Sama</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A3728]/80 leading-relaxed">
                      Uji kemahiran memasak tahap tinggi! Cari pecahan setara dan selesaikan resipi rahsia Chef Alya!
                    </p>
                  </div>

                  {isUnlocked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartLevel(3)}
                      className="w-full mt-6 py-3 rounded-2xl bg-[#A9C5A0] hover:bg-emerald-600 text-emerald-950 hover:text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-700 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{dapurProgress.level3Complete ? 'MAIN SEMULA' : 'MULA PERINGKAT 3'}</span>
                    </motion.button>
                  ) : (
                    <div className="w-full mt-6 py-3 rounded-2xl bg-gray-200 text-gray-500 font-rounded font-bold text-xs flex items-center justify-center gap-2 border border-gray-300">
                      <Lock className="w-4 h-4" />
                      <span>SELESAIKAN PERINGKAT 2 DAHULU</span>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </div>
        </main>
      )}

      {/* SCREEN 3: ACTIVE GAMEPLAY (PERINGKAT 1 / 2 / 3) */}
      {currentScreen === 'gameplay' && (
        <main className="max-w-6xl mx-auto w-full px-4 py-4 sm:py-6 pb-32 flex-1 flex flex-col gap-5">
          
          {/* PERINGKAT 3 INTERACTIVE CHEF CHALLENGE */}
          {activeLevelId === 3 ? (
            <div className="space-y-5">
              {/* LEVEL 3 HUD BAR */}
              <div className="bg-white rounded-3xl p-4 border-3 border-amber-400 shadow-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                    <span>🍰 PERINGKAT 3 — CABARAN CHEF</span>
                  </span>
                  <span className="text-xs font-bold text-[#D98262]">
                    {CHEF_RECIPES[p3RecipeIndex].icon} {CHEF_RECIPES[p3RecipeIndex].name}
                  </span>
                </div>

                {/* Lives Counter */}
                <div className="flex items-center gap-2 bg-[#FFF8E8] px-3 py-1.5 rounded-2xl border border-amber-300 shadow-inner">
                  <span className="text-xs font-bold text-[#4A3728]">Nyawa:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((hIndex) => (
                      <motion.div
                        key={hIndex}
                        animate={hIndex > lives ? { scale: [1, 1.3, 0.8], opacity: 0.3 } : { scale: 1, opacity: 1 }}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            hIndex <= lives ? 'fill-red-500 text-red-500' : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DISH RECIPE SELECTION BAR */}
              <div className="bg-white p-4 rounded-3xl border-3 border-amber-300 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif-title font-extrabold text-amber-900 uppercase">
                    👩🍳 PILIH HIDANGAN RESIPI CHEF ALYA:
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    6 Hidangan
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CHEF_RECIPES.map((rec, rIdx) => {
                    const isSelected = p3RecipeIndex === rIdx;
                    return (
                      <button
                        key={rec.id}
                        disabled={p3CookingPhase !== 'measuring' && p3CookingPhase !== 'ready_to_cook'}
                        onClick={() => handleP3SelectRecipe(rIdx)}
                        className={`px-3 py-2 rounded-2xl border-2 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-105'
                            : 'bg-amber-50 text-[#4A3728] border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span className="text-lg">{rec.icon}</span>
                        <span>{rec.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CHEF ALYA INSTRUCTION BOX */}
              <div className="bg-gradient-to-r from-amber-50 to-[#FFF8E8] rounded-3xl p-5 border-3 border-amber-400 shadow-lg relative flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#F4C95D] shadow-md shrink-0 bg-amber-100">
                  <img src={chefAlyaImg} alt="Chef Alya" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-xs font-serif-title font-extrabold text-[#D98262] uppercase tracking-wider block">
                    ARAHAN RESIPI {CHEF_RECIPES[p3RecipeIndex].name.toUpperCase()} 👩🍳
                  </span>
                  <p className="font-rounded font-bold text-base sm:text-lg text-[#4A3728]">
                    {p3CookingPhase === 'measuring'
                      ? CHEF_RECIPES[p3RecipeIndex].steps[p3Step].instruction
                      : p3CookingPhase === 'ready_to_cook'
                      ? 'Chef Alya: "Bahan-bahan telah lengkap! Tekan 🔥 MASAK SEKARANG untuk membakar hidangan di ketuhar!"'
                      : p3CookingPhase === 'mixing' || p3CookingPhase === 'baking'
                      ? 'Chef Alya: "Sedang mengadun & membakar di dalam ketuhar..."'
                      : 'Chef Alya: "Wah! Sedapnya! Tahniah, chef!"'}
                  </p>
                </div>
              </div>

              {/* COOKING STAGE / MEASURING CUP & BOWL & OVEN */}
              <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl relative min-h-[320px] flex flex-col md:flex-row items-center justify-around gap-8">
                {/* MEASURING CUP VISUAL (WHEN MEASURING) */}
                <div className="flex flex-col items-center justify-center gap-3">
                  {p3CookingPhase === 'measuring' ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        {/* Glass Handle */}
                        <div className="w-6 h-36 border-4 border-r-0 border-amber-800/80 rounded-l-2xl bg-amber-200/40 -mr-1 z-0 shadow-sm" />

                        {/* Cup Body */}
                        <div className="relative w-48 h-64 bg-white/80 backdrop-blur-md rounded-b-3xl rounded-t-lg border-4 border-amber-800 shadow-2xl flex flex-col justify-end overflow-hidden z-10">
                          <div className="absolute top-0 inset-x-0 h-4 bg-amber-700/20 border-b border-amber-800/50 z-30" />

                          {/* Markings */}
                          <div className="absolute inset-x-0 top-0 h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              <FormattedMathText text="4/4" size="xs" /> (100%)
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-1 rounded">Penuh</span>
                          </div>
                          <div className="absolute inset-x-0 top-[25%] h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              <FormattedMathText text="3/4" size="xs" /> (75%)
                            </span>
                          </div>
                          <div className="absolute inset-x-0 top-[50%] h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              <FormattedMathText text="2/4" size="xs" /> (50%)
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-1 rounded"><FormattedMathText text="1/2" size="xs" /></span>
                          </div>
                          <div className="absolute inset-x-0 top-[75%] h-[25%] z-20 flex items-start justify-between px-2 pt-1">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300">
                              <FormattedMathText text="1/4" size="xs" /> (25%)
                            </span>
                          </div>

                          {/* Liquid Fill */}
                          <motion.div
                            animate={{ height: `${liquidFillPercent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 relative z-10 border-t-2 border-amber-100 overflow-hidden shadow-inner"
                          >
                            <div className="absolute top-0 inset-x-0 h-2 bg-white/50 animate-pulse" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400 shadow-sm">
                        🥛 Sukatan Bahan {p3Step + 1}: {CHEF_RECIPES[p3RecipeIndex].steps[p3Step].ingredientName} ({liquidFillPercent}%)
                      </div>
                    </div>
                  ) : p3CookingPhase === 'mixing' || p3CookingPhase === 'baking' ? (
                    /* OVEN & BAKING ANIMATION */
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-56 h-48 bg-amber-950 rounded-3xl border-4 border-amber-800 shadow-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-amber-500/20 to-transparent animate-pulse" />
                        <span className="text-6xl z-10 filter drop-shadow-lg animate-bounce">🔥</span>
                        <span className="text-xs font-extrabold text-amber-200 z-10 bg-black/60 px-3 py-1 rounded-full mt-2 border border-amber-500">
                          {p3CookingPhase === 'mixing' ? '🥣 Mengadun Bahan...' : '🔥 Membakar di Ketuhar...'}
                        </span>

                        {/* Progress bar */}
                        <div className="w-full bg-amber-900 rounded-full h-3 mt-3 overflow-hidden border border-amber-700 z-10">
                          <motion.div
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-full"
                            style={{ width: `${bakingProgress}%` }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* COOKED DISH DISPLAY */
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        initial={{ scale: 0.5, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-56 h-48 bg-white/90 rounded-3xl border-4 border-amber-400 shadow-2xl p-4 flex flex-col items-center justify-center gap-2 relative"
                      >
                        <span className="text-7xl filter drop-shadow-xl">{CHEF_RECIPES[p3RecipeIndex].icon}</span>
                        <span className="font-serif-title font-extrabold text-lg text-amber-950">
                          {CHEF_RECIPES[p3RecipeIndex].name}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                          ✨ HIDANGAN SIAP!
                        </span>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* MIXING BOWL & ADDED INGREDIENTS LIST */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-48 h-36 bg-amber-100 rounded-b-full border-4 border-amber-800 shadow-xl flex items-center justify-center">
                    <span className={`text-5xl filter drop-shadow-md ${p3CookingPhase === 'mixing' ? 'animate-spin' : ''}`}>
                      🥣
                    </span>

                    {/* Pouring stream */}
                    {isPouring && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '70px' }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-4 bg-amber-400 rounded-full shadow-lg z-30"
                      />
                    )}
                  </div>

                  {/* Added Ingredients Badges */}
                  <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                    {p3AddedIngredients.length === 0 ? (
                      <span className="text-xs text-gray-500 font-medium italic">Belum ada bahan dicampur</span>
                    ) : (
                      p3AddedIngredients.map((ing, iIdx) => (
                        <span
                          key={iIdx}
                          className="text-[11px] font-extrabold text-amber-950 bg-white px-2.5 py-1 rounded-full border border-amber-300 shadow-xs"
                        >
                          {ing}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* FEEDBACK BANNER */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition-all ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : feedback.type === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-[#FFF8E8] border-amber-300 text-[#4A3728]'
                  }`}
                >
                  <FormattedMathText text={feedback.text} size="sm" />
                </div>
              )}

              {/* MEASUREMENT SELECTION BUTTONS / COOK BUTTON */}
              {p3CookingPhase === 'measuring' && (
                <div className="space-y-2">
                  <h4 className="font-rounded font-extrabold text-xs text-[#D98262] uppercase tracking-wider text-center">
                    PILIH SUKATAN {CHEF_RECIPES[p3RecipeIndex].steps[p3Step].ingredientName.toUpperCase()} UNTUK DIMASUKKAN:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CHEF_RECIPES[p3RecipeIndex].steps[p3Step].options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      const isCorrect = opt.isCorrect;

                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleP3OptionChoose(idx)}
                          className={`py-4 px-4 rounded-2xl border-3 font-serif-title font-extrabold text-base sm:text-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-700 ring-4 ring-emerald-300'
                                : 'bg-rose-500 text-white border-rose-700'
                              : 'bg-white text-[#4A3728] border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          <span>🥛</span>
                          <FormattedMathText text={opt.label} size="lg" />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {p3CookingPhase === 'ready_to_cook' && (
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleP3StartCooking}
                    className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-[#D98262] hover:from-amber-600 hover:to-[#c87253] text-white font-rounded font-extrabold text-lg shadow-xl flex items-center gap-3 border-b-4 border-amber-800 cursor-pointer animate-pulse"
                  >
                    <span>🔥 MASAK HIDANGAN SEKARANG (KETUHAR)</span>
                  </motion.button>
                </div>
              )}

              {p3CookingPhase === 'cooked' && (
                <div className="flex justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLevelComplete()}
                    className="py-4 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-rounded font-extrabold text-lg shadow-xl flex items-center gap-3 border-b-4 border-emerald-800 cursor-pointer"
                  >
                    <span>✨ HIDANGKAN & KUMPUL BINTANG 🏆</span>
                  </motion.button>
                </div>
              )}
            </div>
          ) : activeLevelId === 2 ? (
            <div className="space-y-5">
              {/* LEVEL 2 HUD BAR */}
              <div className="bg-white rounded-3xl p-4 border-3 border-amber-400 shadow-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                    <span>🍕 PERINGKAT 2 — CABARAN {p2Step + 1} / 4</span>
                  </span>
                  <span className="text-xs font-bold text-[#D98262]">
                    {p2Step === 0 && '🍕 Bahagikan Pizza'}
                    {p2Step === 1 && '🧀 Topping Keju'}
                    {p2Step === 2 && '🔢 Pecahan Setara'}
                    {p2Step === 3 && '➕ Tambah Pecahan'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Score & Combo Badges */}
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-2xl border border-amber-300 text-xs font-extrabold text-amber-900">
                    <span>⭐ Skor: {p2Score}</span>
                    {p2Combo > 1 && (
                      <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px] animate-bounce">
                        🔥 ×{p2Combo}
                      </span>
                    )}
                  </div>

                  {/* Lives Counter */}
                  <div className="flex items-center gap-2 bg-[#FFF8E8] px-3 py-1.5 rounded-2xl border border-amber-300 shadow-inner">
                    <span className="text-xs font-bold text-[#4A3728]">Nyawa:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((hIndex) => (
                        <motion.div
                          key={hIndex}
                          animate={hIndex > lives ? { scale: [1, 1.3, 0.8], opacity: 0.3 } : { scale: 1, opacity: 1 }}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              hIndex <= lives ? 'fill-red-500 text-red-500' : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CHEF ALYA INSTRUCTION BOX */}
              <div className="bg-gradient-to-r from-amber-50 to-[#FFF8E8] rounded-3xl p-5 border-3 border-amber-400 shadow-lg relative flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#F4C95D] shadow-md shrink-0 bg-amber-100">
                  <img src={chefAlyaImg} alt="Chef Alya" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-xs font-serif-title font-extrabold text-[#D98262] uppercase tracking-wider block">
                    ARAHAN RESIPI CHEF ALYA 👩🍳
                  </span>
                  <p className="font-rounded font-bold text-base sm:text-lg text-[#4A3728]">
                    {p2Step === 0 && 'Chef Alya: "Bahagikan pizza kepada 4 bahagian sama besar."'}
                    {p2Step === 1 && 'Chef Alya: "Letakkan keju pada 2/4 pizza."'}
                    {p2Step === 2 && 'Chef Alya: "Adakah 2/4 sama nilai dengan 1/2?"'}
                    {p2Step === 3 && 'Chef Alya: "Campurkan 1/4 gula dan 2/4 gula ke dalam mangkuk."'}
                  </p>
                </div>
              </div>

              {/* STEP 0: BAHAGIKAN PIZZA 🍕 */}
              {p2Step === 0 && (
                <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl text-center space-y-6 flex flex-col items-center">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-amber-100/60 rounded-full border-4 border-amber-800 p-4 shadow-2xl flex items-center justify-center overflow-hidden">
                    {!isPizzaCut ? (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCutPizza}
                        className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#D98262] via-[#E54B4B] to-[#F4C95D] border-8 border-amber-900 shadow-inner flex flex-col items-center justify-center cursor-pointer group"
                      >
                        <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform">🍕</span>
                        <span className="mt-2 text-xs font-black bg-amber-950/80 text-amber-200 px-3 py-1 rounded-full border border-amber-400 shadow-md">
                          PIZZA PENUH (1)
                        </span>
                      </motion.div>
                    ) : (
                      <div className="relative w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-1">
                        {[1, 2, 3, 4].map((sliceNum) => (
                          <motion.div
                            key={sliceNum}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 * sliceNum }}
                            className="bg-gradient-to-tr from-[#D98262] to-[#F4C95D] rounded-2xl border-3 border-amber-900 flex flex-col items-center justify-center shadow-md relative overflow-hidden"
                          >
                            <span className="text-3xl">🍕</span>
                            <span className="text-[11px] font-extrabold text-amber-950 bg-amber-200 px-2 py-0.5 rounded-md mt-1 border border-amber-400">
                              1/4
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isPizzaCut ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCutPizza}
                      className="py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-extrabold text-base shadow-lg flex items-center gap-2 cursor-pointer border-b-4 border-amber-700"
                    >
                      <span>✂️ POTONG PIZZA KEPADA 4 BAHAGIAN</span>
                    </motion.button>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-300 font-extrabold text-sm shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>PIZZA BERJAYA DIBAHAGIKAN (4/4)</span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: CABARAN TOPPING 🧀 */}
              {p2Step === 1 && (
                <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl text-center space-y-6">
                  <div className="flex items-center justify-center gap-2 bg-amber-100/90 py-2 px-4 rounded-2xl border border-amber-300 max-w-sm mx-auto shadow-xs">
                    <span className="text-xs font-extrabold text-amber-950">Topping Keju Dipilih:</span>
                    <div className="flex gap-1.5 text-lg">
                      {selectedToppingSlices.map((hasCheese, idx) => (
                        <span key={idx}>{hasCheese ? '🧀' : '⬜'}</span>
                      ))}
                    </div>
                    <span className="text-xs font-black bg-amber-300 text-amber-950 px-2 py-0.5 rounded-lg border border-amber-400">
                      {selectedToppingSlices.filter(Boolean).length} / 4
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {selectedToppingSlices.map((hasCheese, sliceIdx) => (
                      <motion.button
                        key={sliceIdx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleToppingSlice(sliceIdx)}
                        className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 shadow-lg transition-all cursor-pointer relative overflow-hidden ${
                          hasCheese
                            ? 'bg-amber-200 border-amber-500 ring-4 ring-amber-300'
                            : 'bg-white border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-4xl">{hasCheese ? '🍕🧀' : '🍕'}</span>
                        <span className="text-xs font-extrabold text-[#4A3728]">Kepingan {sliceIdx + 1}</span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            hasCheese
                              ? 'bg-amber-500 text-white border-amber-700'
                              : 'bg-gray-100 text-gray-500 border-gray-300'
                          }`}
                        >
                          {hasCheese ? '🧀 Dengan Keju' : '⬜ Kosong'}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmTopping}
                    className="py-3.5 px-8 rounded-2xl bg-[#D98262] hover:bg-[#c87253] text-white font-rounded font-extrabold text-base shadow-lg flex items-center gap-2 cursor-pointer border-b-4 border-[#9a4b2e] mx-auto"
                  >
                    <span>🧀 SAHKAN TOPPING (2/4)</span>
                  </motion.button>
                </div>
              )}

              {/* STEP 2: PECAHAN SETARA 🔢 */}
              {p2Step === 2 && (
                <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Visual 2/4 */}
                    <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col items-center gap-3">
                      <span className="font-extrabold text-sm text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                        Pecahan A: 2/4
                      </span>
                      <div className="grid grid-cols-4 gap-2 w-full max-w-xs bg-amber-950 p-2.5 rounded-2xl border-2 border-amber-800">
                        <div className="h-12 bg-amber-400 rounded-xl border border-amber-200 flex items-center justify-center font-bold text-amber-950 text-xs">🟨 1</div>
                        <div className="h-12 bg-amber-400 rounded-xl border border-amber-200 flex items-center justify-center font-bold text-amber-950 text-xs">🟨 2</div>
                        <div className="h-12 bg-amber-100/30 rounded-xl border border-amber-300/40 flex items-center justify-center font-bold text-amber-100/50 text-xs">⬜ 3</div>
                        <div className="h-12 bg-amber-100/30 rounded-xl border border-amber-300/40 flex items-center justify-center font-bold text-amber-100/50 text-xs">⬜ 4</div>
                      </div>
                      <p className="text-xs text-gray-600 font-bold">2 daripada 4 bahagian (50%)</p>
                    </div>

                    {/* Visual 1/2 */}
                    <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col items-center gap-3">
                      <span className="font-extrabold text-sm text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                        Pecahan B: 1/2
                      </span>
                      <div className="grid grid-cols-2 gap-2 w-full max-w-xs bg-amber-950 p-2.5 rounded-2xl border-2 border-amber-800">
                        <div className="h-12 bg-amber-400 rounded-xl border border-amber-200 flex items-center justify-center font-bold text-amber-950 text-xs">🟨 1</div>
                        <div className="h-12 bg-amber-100/30 rounded-xl border border-amber-300/40 flex items-center justify-center font-bold text-amber-100/50 text-xs">⬜ 2</div>
                      </div>
                      <p className="text-xs text-gray-600 font-bold">1 daripada 2 bahagian (50%)</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEquivalentChoice(true)}
                      className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-rounded font-extrabold text-base shadow-lg border-b-4 border-emerald-700 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Ya, sama nilai.</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEquivalentChoice(false)}
                      className="flex-1 py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-rounded font-extrabold text-base shadow-lg border-b-4 border-rose-700 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Tidak sama nilai.</span>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* STEP 3: TAMBAH PECAHAN ➕ */}
              {p2Step === 3 && (
                <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
                    {/* Ingredient 1/4 */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`p-5 rounded-3xl border-3 flex flex-col items-center gap-3 shadow-md ${
                        hasAddedP1 ? 'bg-amber-100 border-amber-400 opacity-80' : 'bg-white border-amber-300'
                      }`}
                    >
                      <span className="text-4xl">🥛</span>
                      <span className="font-extrabold text-sm text-amber-950">1/4 Gula</span>
                      <div className="flex gap-1">
                        <span className="w-6 h-6 rounded bg-amber-400 border border-amber-500" />
                        <span className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
                        <span className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
                        <span className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
                      </div>
                      <button
                        disabled={hasAddedP1}
                        onClick={() => handleAddIngredientToBowl('1/4')}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer border ${
                          hasAddedP1
                            ? 'bg-emerald-500 text-white border-emerald-700'
                            : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700'
                        }`}
                      >
                        {hasAddedP1 ? '✔️ Sudah Dicampur' : '➕ TAMBAH 1/4 GULA'}
                      </button>
                    </motion.div>

                    {/* PLUS ICON & EQUATION */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl font-extrabold text-amber-800 bg-amber-200 w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center shadow-inner">
                        ➕
                      </span>
                      <span className="text-xs font-black text-amber-950 bg-white/90 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
                        1/4 + 2/4 = {bowlFillLevel === 3 ? '3/4 🎉' : '?'}
                      </span>
                    </div>

                    {/* Ingredient 2/4 */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`p-5 rounded-3xl border-3 flex flex-col items-center gap-3 shadow-md ${
                        hasAddedP2 ? 'bg-amber-100 border-amber-400 opacity-80' : 'bg-white border-amber-300'
                      }`}
                    >
                      <span className="text-4xl">🥛</span>
                      <span className="font-extrabold text-sm text-amber-950">2/4 Gula</span>
                      <div className="flex gap-1">
                        <span className="w-6 h-6 rounded bg-amber-400 border border-amber-500" />
                        <span className="w-6 h-6 rounded bg-amber-400 border border-amber-500" />
                        <span className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
                        <span className="w-6 h-6 rounded bg-gray-200 border border-gray-300" />
                      </div>
                      <button
                        disabled={hasAddedP2}
                        onClick={() => handleAddIngredientToBowl('2/4')}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer border ${
                          hasAddedP2
                            ? 'bg-emerald-500 text-white border-emerald-700'
                            : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700'
                        }`}
                      >
                        {hasAddedP2 ? '✔️ Sudah Dicampur' : '➕ TAMBAH 2/4 GULA'}
                      </button>
                    </motion.div>
                  </div>

                  {/* BOWL IN CENTER */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-48 h-36 bg-amber-100 rounded-b-full border-4 border-amber-800 shadow-xl flex items-center justify-center overflow-hidden">
                      <span className="text-5xl filter drop-shadow-md z-20">🥣</span>
                      <motion.div
                        animate={{ height: bowlFillLevel === 0 ? '0%' : bowlFillLevel === 1 ? '35%' : '75%' }}
                        transition={{ duration: 0.5 }}
                        className="absolute bottom-0 inset-x-0 bg-amber-400/80 z-10 border-t-2 border-amber-200"
                      />
                    </div>
                    <span className="text-xs font-bold text-amber-950 bg-white px-3 py-1 rounded-full border border-amber-300 shadow-xs">
                      Isi Mangkuk Gula: <FormattedMathText text={`${bowlFillLevel}/4 (${bowlFillLevel === 3 ? '3/4 Penuh' : bowlFillLevel === 1 ? '1/4 Penuh' : 'Kosong'})`} size="xs" />
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback Banner */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition-all ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : feedback.type === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-[#FFF8E8] border-amber-300 text-[#4A3728]'
                  }`}
                >
                  <FormattedMathText text={feedback.text} size="sm" />
                </div>
              )}
            </div>
          ) : (
            /* STANDARD GAMEPLAY FOR PERINGKAT 1 & 3 */
            <>
              {/* TOP GAMEPLAY HUD BAR: LIVES + CHALLENGE STEP */}
              <div className="bg-white rounded-3xl p-4 border-3 border-[#F6C7A8] shadow-md flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                    <span>🥣 CABARAN {currentChallengeIndex + 1} / {activeChallenges.length}</span>
                  </span>
                  <span className="text-xs font-bold text-[#D98262]">
                    {currentC.ingredientIcon} {currentC.ingredientName}
                  </span>
                </div>

                {/* LIVES COUNTER (3 HEARTS) */}
                <div className="flex items-center gap-2 bg-[#FFF8E8] px-3.5 py-1.5 rounded-2xl border border-amber-300 shadow-inner">
                  <span className="text-xs font-bold text-[#4A3728]">Nyawa:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((hIndex) => (
                      <motion.div
                        key={hIndex}
                        animate={hIndex > lives ? { scale: [1, 1.3, 0.8], opacity: 0.3 } : { scale: 1, opacity: 1 }}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            hIndex <= lives ? 'fill-red-500 text-red-500' : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CHEF ALYA INSTRUCTION BOX */}
              <div className="bg-gradient-to-r from-amber-50 to-[#FFF8E8] rounded-3xl p-5 border-3 border-amber-400 shadow-lg relative flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#F4C95D] shadow-md shrink-0 bg-amber-100">
                  <img src={chefAlyaImg} alt="Chef Alya" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-xs font-serif-title font-extrabold text-[#D98262] uppercase tracking-wider block">
                    ARAHAN RESIPI CHEF ALYA 👩🍳
                  </span>
                  <p className="font-rounded font-bold text-base sm:text-lg text-[#4A3728]">
                    {currentC.chefInstruction}
                  </p>
                </div>
              </div>

              {/* COOKING TABLE & ANIMATED MEASURING CUP STAGE */}
              <div className="bg-gradient-to-b from-[#FFFBF5] via-[#FFF3E0] to-[#FFE0B2] rounded-3xl border-4 border-amber-400 p-6 shadow-xl relative min-h-[320px] flex flex-col md:flex-row items-center justify-around gap-8">
                
                {/* Visual Display Graphic (Visual Types) */}
                <div className="flex flex-col items-center justify-center">
                  
                  {/* MEASURING CUP VISUAL (3D ANIMATED CUP WITH GLASS HANDLE & CLEAR TICK MARKS) */}
                  {(currentC.visualType === 'measuring_cup' || currentC.visualType === 'text_prompt') && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        
                        {/* Glass Handle on Left */}
                        <div className="w-6 h-36 border-4 border-r-0 border-amber-800/80 rounded-l-2xl bg-amber-200/40 -mr-1 z-0 shadow-sm" />

                        {/* Glass Cup Body */}
                        <div className="relative w-48 h-64 bg-white/80 backdrop-blur-md rounded-b-3xl rounded-t-lg border-4 border-amber-800 shadow-2xl flex flex-col justify-end overflow-hidden z-10">
                          
                          {/* Top Rim of Cup */}
                          <div className="absolute top-0 inset-x-0 h-4 bg-amber-700/20 border-b border-amber-800/50 z-30" />

                          {/* 4/4 (100% Penuh) Line */}
                          <div className="absolute inset-x-0 top-0 h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-xs">
                              4/4 (100%)
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-1 rounded">Penuh</span>
                          </div>

                          {/* 3/4 (75%) Line */}
                          <div className="absolute inset-x-0 top-[25%] h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-xs">
                              <FormattedMathText text="3/4" size="xs" /> (75%)
                            </span>
                          </div>

                          {/* 2/4 (50%) Line */}
                          <div className="absolute inset-x-0 top-[50%] h-[25%] border-b border-dashed border-amber-800/60 z-20 flex items-center justify-between px-2">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-xs">
                              <FormattedMathText text="2/4" size="xs" /> (50%)
                            </span>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-1 rounded"><FormattedMathText text="1/2" size="xs" /></span>
                          </div>

                          {/* 1/4 (25%) Line */}
                          <div className="absolute inset-x-0 top-[75%] h-[25%] z-20 flex items-start justify-between px-2 pt-1">
                            <span className="text-[10px] font-extrabold text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shadow-xs">
                              <FormattedMathText text="1/4" size="xs" /> (25%)
                            </span>
                          </div>

                          {/* DYNAMIC LIQUID FILLING */}
                          <motion.div
                            animate={{ height: `${liquidFillPercent}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="w-full bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 relative z-10 border-t-2 border-amber-100 overflow-hidden shadow-inner"
                          >
                            {/* Wave Surface Animation */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-white/50 animate-pulse" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Cup Base Badge */}
                      <div className="text-xs font-bold text-amber-950 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400 shadow-sm">
                        🥛 Cawan Penyukat Pecahan ({liquidFillPercent}%)
                      </div>
                    </div>
                  )}

                  {/* CHOCOLATE BAR VISUAL */}
                  {currentC.visualType === 'chocolate' && (
                    <div className="grid grid-cols-3 gap-1.5 bg-amber-950 p-3 rounded-2xl shadow-xl border-3 border-amber-900">
                      {Array.from({ length: currentC.targetDenominator }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-lg ${
                            i < currentC.targetNumerator
                              ? 'bg-amber-400 border-amber-200 text-amber-950 shadow-inner'
                              : 'bg-amber-100/40 border-amber-300 text-amber-900/40'
                          }`}
                        >
                          🍫
                        </div>
                      ))}
                    </div>
                  )}

                  {/* APPLE SLICES VISUAL */}
                  {currentC.visualType === 'apple' && (
                    <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border-2 border-red-300 shadow-md">
                      {Array.from({ length: currentC.targetDenominator }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl ${
                            i < currentC.targetNumerator
                              ? 'bg-red-100 border-red-400'
                              : 'bg-gray-100 border-gray-300 opacity-30'
                          }`}
                        >
                          🍎
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PIZZA SLICE VISUAL */}
                  {currentC.visualType === 'pizza_slice' && (
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                        <circle cx="100" cy="100" r="90" fill="#D98262" stroke="#a35032" strokeWidth="4" />
                        <circle cx="100" cy="100" r="80" fill="#E54B4B" stroke="#b82a2a" strokeWidth="2" />
                        {Array.from({ length: currentC.targetDenominator }).map((_, i) => {
                          const angle = (360 / currentC.targetDenominator) * i - 90;
                          const nextAngle = (360 / currentC.targetDenominator) * (i + 1) - 90;
                          const rad1 = (angle * Math.PI) / 180;
                          const rad2 = (nextAngle * Math.PI) / 180;
                          const x1 = 100 + 75 * Math.cos(rad1);
                          const y1 = 100 + 75 * Math.sin(rad1);
                          const x2 = 100 + 75 * Math.cos(rad2);
                          const y2 = 100 + 75 * Math.sin(rad2);
                          const path = `M 100 100 L ${x1} ${y1} A 75 75 0 0 1 ${x2} ${y2} Z`;
                          const isHighlighted = i < currentC.targetNumerator;
                          return (
                            <path
                              key={i}
                              d={path}
                              fill={isHighlighted ? '#F4C95D' : '#FFF8E8'}
                              stroke="#4A3728"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </div>

                {/* MIXING BOWL & POURING STAGE */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-44 h-36 bg-amber-100 rounded-b-full border-4 border-amber-800 shadow-xl flex items-center justify-center">
                    <span className="text-5xl filter drop-shadow-md">🥣</span>

                    {/* Pouring Liquid Stream Animation */}
                    {isPouring && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '70px' }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 w-4 bg-amber-400 rounded-full shadow-lg z-30"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-white/80 px-3 py-1 rounded-full border border-amber-300">
                    Mangkuk Adunan Resipi
                  </span>
                </div>
              </div>

              {/* Feedback Banner */}
              {feedback && (
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border text-center transition-all ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : feedback.type === 'error'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-[#FFF8E8] border-amber-300 text-[#4A3728]'
                  }`}
                >
                  <FormattedMathText text={feedback.text} size="sm" />
                </div>
              )}

              {/* MEASUREMENT SELECTION BUTTONS */}
              <div className="space-y-2">
                <h4 className="font-rounded font-extrabold text-xs text-[#D98262] uppercase tracking-wider text-center">
                  PILIH SUKATAN UNTUK DIMASUKKAN KE DALAM MANGKUK:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentC.options.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    const isCorrect = idx === currentC.correctIndex;

                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOptionChoose(idx)}
                        className={`py-4 px-4 rounded-2xl border-3 font-serif-title font-extrabold text-lg sm:text-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-700 ring-4 ring-emerald-300'
                              : 'bg-rose-500 text-white border-rose-700'
                            : 'bg-white text-[#4A3728] border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        <span>🥛</span>
                        <FormattedMathText text={opt.label} size="lg" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      {/* GAME OVER MODAL (WHEN LIVES = 0) */}
      <AnimatePresence>
        {showGameOverModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-rose-500 text-center shadow-2xl relative overflow-hidden space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-rose-100 border-4 border-rose-400 flex items-center justify-center text-4xl mx-auto shadow-inner">
                ☠️
              </div>

              <h2 className="font-serif-title font-extrabold text-2xl text-rose-900">
                GAME OVER
              </h2>

              <p className="font-rounded font-bold text-sm text-[#4A3728]">
                "Jangan risau, chef! Cuba lagi untuk mengasah sukatan pecahan kamu."
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleStartLevel(activeLevelId)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>🔄 CUBA LAGI</span>
                </button>

                <button
                  onClick={() => {
                    playSfx('click', soundEnabled);
                    setShowGameOverModal(false);
                    setShowFinishModal(false);
                    setCurrentScreen('level_select');
                  }}
                  className="w-full py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-[#4A3728] font-rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>🏠 KEMBALI KE PERINGKAT DAPUR</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FINISH STAGE / WORLD COMPLETE MODAL */}
      <AnimatePresence>
        {showFinishModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="bg-[#FFFBF5] rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-500 text-center shadow-2xl relative overflow-hidden space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl mx-auto shadow-inner">
                {activeLevelId === 3 ? '👨🍳' : '🏆'}
              </div>

              {activeLevelId === 3 ? (
                <>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                    🎉 TAHNIAH! DUNIA 2 SELESAI
                  </span>

                  <h2 className="font-serif-title font-extrabold text-2xl text-[#4A3728]">
                    🍳 DAPUR PECAHAN SELESAI
                  </h2>

                  <p className="font-rounded font-bold text-xs sm:text-sm text-[#D98262]">
                    "Kamu telah menamatkan Dapur Pecahan dengan cemerlang!"
                  </p>

                  {/* Award Badge */}
                  <div className="py-2 bg-amber-100/80 rounded-2xl border-2 border-amber-300">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Ganjaran Gelaran:</span>
                    <span className="font-serif-title font-extrabold text-lg text-amber-950 block mt-1">
                      {totalDapurStars === 9
                        ? '🏆 MASTER CHEF PECAHAN'
                        : totalDapurStars >= 7
                        ? '🥇 CHEF EMAS'
                        : totalDapurStars >= 5
                        ? '🥈 CHEF PERAK'
                        : '🥉 CHEF GANGSA'}
                    </span>
                    <span className="text-xs font-bold text-amber-800 block mt-0.5">
                      ⭐ {totalDapurStars} / 9 Bintang Terkumpul
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={() => handleStartLevel(3)}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>🔄 MAIN SEMULA PERINGKAT 3</span>
                    </button>

                    <button
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        setShowFinishModal(false);
                        setShowGameOverModal(false);
                        setCurrentScreen('level_select');
                      }}
                      className="w-full py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-[#4A3728] font-rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Home className="w-4 h-4" />
                      <span>🏠 KEMBALI KE PERINGKAT DAPUR</span>
                    </button>

                    <button
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        setShowFinishModal(false);
                        setShowGameOverModal(false);
                        onBackToHub();
                      }}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-rounded font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-800"
                    >
                      <span>➡️ TERUSKAN KEMBARA</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
                    🎉 PERINGKAT {activeLevelId} SELESAI!
                  </span>

                  <h2 className="font-serif-title font-extrabold text-2xl text-[#4A3728]">
                    TAHNIAH, CHEF!
                  </h2>

                  <p className="font-rounded font-medium text-xs sm:text-sm text-[#4A3728]/80">
                    Kamu berjaya menyukat semua bahan masakan dengan tepat!
                  </p>

                  {/* Stars Earned */}
                  <div className="flex justify-center gap-2 py-2">
                    {[1, 2, 3].map((star) => (
                      <motion.div
                        key={star}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * star }}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= earnedStarsCurrentLevel
                              ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    {activeLevelId < 3 && (
                      <button
                        onClick={() => handleStartLevel((activeLevelId + 1) as 1 | 2 | 3)}
                        className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-rounded font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer border-b-4 border-amber-700"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>PERINGKAT SETERUSNYA ➡️</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playSfx('click', soundEnabled);
                        setShowFinishModal(false);
                        setShowGameOverModal(false);
                        setCurrentScreen('level_select');
                      }}
                      className="w-full py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 text-[#4A3728] font-rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Home className="w-4 h-4" />
                      <span>🏠 KEMBALI KE SENARAI PERINGKAT DAPUR</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
