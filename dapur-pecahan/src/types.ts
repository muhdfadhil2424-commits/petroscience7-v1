export type DishId = 'kek-coklat' | 'ayam-crispy' | 'karipap' | 'sirap-bandung';

export type VisualType = 'set' | 'bar' | 'circle' | 'egg-groups' | 'addition-fraction' | 'liquid-gauge';

export interface IngredientTask {
  id: string;
  name: string;
  icon: string;
  numerator: number;
  denominator: number;
  unit: string;
  instructionText: string;
  dskpTopic: string;
  visualType: VisualType;
  totalItems?: number; // E.g., for 15 eggs
  groupSize?: number;  // E.g., 3 eggs per group (5 groups total)
  equivalentText?: string; // E.g., "2/4 sama nilai dengan 1/2"
  simplifiedText?: string; // E.g., "6/10 dalam bentuk termudah ialah 3/5"
  additionParams?: {
    firstFraction: { num: number; den: number };
    secondFraction: { num: number; den: number };
    targetNumerator: number;
  };
}

export interface Dish {
  id: DishId;
  title: string;
  subtitle: string;
  description: string;
  imageIcon: string;
  realImage?: string;
  accentColor: string;
  bgGradient: string;
  tasks: IngredientTask[];
  difficulty: 'Mudah' | 'Sederhana' | 'Mencabar';
  estimatedTime: string;
}

export interface UserProgress {
  completedDishes: Record<DishId, boolean>;
  dishScores: Record<DishId, number>;
  totalStars: number;
  currentDishId: DishId | null;
  currentTaskIndex: number;
}
