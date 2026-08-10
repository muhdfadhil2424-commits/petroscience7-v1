import { Dish } from '../types';

export const DISHES_DATA: Dish[] = [
  {
    id: 'kek-coklat',
    title: 'Kek Coklat Bulat Mewah',
    subtitle: 'Kek Coklat Lembut & Lazat',
    description: 'Bantu Chef Alya mengumpul 5 bahan pecahan untuk membakar Kek Coklat Bulat yang amat lazat!',
    imageIcon: '🎂',
    realImage: '/assets/kek_coklat_1785319636702-NtF8PULh.jpg',
    accentColor: 'from-amber-600 to-amber-800',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-amber-100',
    difficulty: 'Sederhana',
    estimatedTime: '5 Minit',
    tasks: [
      {
        id: 'kek-1',
        name: 'Tepung Gandum',
        icon: '🌾',
        numerator: 2,
        denominator: 5,
        unit: 'peket tepung gandum',
        instructionText: 'Sila masukkan 2/5 peket tepung gandum ke dalam mangkuk!',
        dskpTopic: '3.1.1 - Pecahan Wajar',
        visualType: 'bar',
        equivalentText: '2/5 adalah nilai asas pecahan wajar.'
      },
      // ... (kekalkan tasks yang lain)
    ]
  },
  {
    id: 'ayam-crispy',
    title: 'Ayam Goreng Crispy',
    subtitle: 'Ayam Goreng Rangup Chef Alya',
    description: 'Sediakan bahan perapan, minyak goreng, dan kumpul peha ayam menggunakan penambahan pecahan!',
    imageIcon: '🍗',
    realImage: '/assets/ayam_crispy_1785319651198-B5yj7CCr.jpg',
    accentColor: 'from-orange-600 to-amber-700',
    bgGradient: 'bg-gradient-to-br from-orange-50 to-amber-100',
    difficulty: 'Mencabar',
    estimatedTime: '6 Minit',
    tasks: []
  },
  {
    id: 'karipap',
    title: 'Karipap Kentang Inti Mewah',
    subtitle: 'Karipap Inti Kentang Berempah',
    description: 'Sediakan doh dan inti karipap kentang yang cukup wangi dengan sukatan pecahan tepat!',
    imageIcon: '🥟',
    realImage: '/assets/karipap_1785319665862-D2TjfdUS.jpg',
    accentColor: 'from-amber-700 to-yellow-800',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    difficulty: 'Mudah',
    estimatedTime: '4 Minit',
    tasks: []
  },
  {
    id: 'sirap-bandung',
    title: 'Air Sirap Bandung Dingin',
    subtitle: 'Minuman Sirap Bandung Berkrim',
    description: 'Bancuh minuman sirap bandung segar yang manis berkrim dengan sukatan sirap, susu pekat, dan air!',
    imageIcon: '🥤',
    realImage: '/assets/sirap_bandung_178531_2382-CzRoHbMA.jpg',
    accentColor: 'from-pink-600 to-rose-700',
    bgGradient: 'bg-gradient-to-br from-pink-50 to-rose-100',
    difficulty: 'Mudah',
    estimatedTime: '3 Minit',
    tasks: []
  }
];