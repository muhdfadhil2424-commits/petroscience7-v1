import { WorldInfo } from '../types';
import bannerArena from '../assets/images/banner_arena_pecahan_1785426776474.jpg';
import bannerDapur from '../assets/images/banner_dapur_pecahan_1785426792370.jpg';
import bannerPixel from '../assets/images/banner_dunia_pixel_1785426808447.jpg';

export const WORLDS_DATA: WorldInfo[] = [
  {
    id: 'arena',
    number: 1,
    title: 'ARENA PECAHAN',
    subtitle: 'Lari, lompat dan kumpul pecahan!',
    description: 'Jom belajar pecahan sambil bersukan!',
    icon: '🏃',
    badge: '3 CABARAN',
    bannerImage: bannerArena,
    themeColor: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-400',
      text: 'text-emerald-800',
      accent: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-600',
    },
    visualElements: ['⚽', '🏅', '👟', '📣', '🏆'],
    isLockedDefault: false, // World 1 is unlocked initially
  },
  {
    id: 'dapur',
    number: 2,
    title: 'DAPUR PECAHAN',
    subtitle: 'Masak resipi dengan sukatan pecahan!',
    description: 'Jom masak dan belajar pecahan!',
    icon: '👩‍🍳',
    badge: '3 CABARAN',
    bannerImage: bannerDapur,
    themeColor: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-400',
      text: 'text-amber-800',
      accent: 'bg-amber-500',
      gradient: 'from-amber-500 to-orange-600',
    },
    visualElements: ['🎂', '🥣', '🧪', '🥧', '👨‍🍳'],
    isLockedDefault: true, // Locked until Arena is completed
  },
  {
    id: 'pixel',
    number: 3,
    title: 'DUNIA PIXEL',
    subtitle: 'Selamatkan dunia pixel dengan kuasa pecahan!',
    description: 'Jom selesaikan cabaran pecahan!',
    icon: '🟪',
    badge: '3 CABARAN',
    bannerImage: bannerPixel,
    themeColor: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-400',
      text: 'text-purple-900',
      accent: 'bg-purple-600',
      gradient: 'from-purple-600 to-indigo-700',
    },
    visualElements: ['🕹️', '💎', '👾', '🎮', '⚡'],
    isLockedDefault: true, // Locked until Dapur is completed
  },
];
