export type GameId = 'arena' | 'dapur' | 'pixel';
export type ChallengeId = 1 | 2 | 3;
export type DskpCode = '3.1.1' | '3.1.2' | '3.1.3' | '3.1.4' | '3.1.5' | '3.1.6' | '3.1.7';
export type QuestionDifficulty = 'mudah' | 'sederhana' | 'mencabar';

export type VisualType =
  | 'object_group'
  | 'pizza_fraction'
  | 'fraction_bar'
  | 'equivalent_bars'
  | 'operation_bars'
  | 'percentage_grid'
  | 'mixed_or_improper'
  | 'measuring_cup'
  // Backward compatibility aliases
  | 'fraction_group'
  | 'pizza'
  | 'number_line'
  | 'mixed_number'
  | 'improper_fraction';

export interface ObjectGroupVisualData {
  objectType: 'ball' | 'apple' | 'gem' | 'star' | 'bottle' | 'cone' | 'fruit' | 'fish';
  totalObjects: number;
  highlightedObjects: number;
  objectLabel?: string;
  highlightLabel?: string;
  highlightColor?: string;
}

export interface PizzaFractionVisualData {
  totalParts: number;
  highlightedParts: number;
  itemType?: 'pizza' | 'cake' | 'pie';
}

export interface FractionBarVisualData {
  denominator: number;
  numerator: number;
  color?: string;
  label?: string;
}

export interface EquivalentBarsVisualData {
  bar1: { numerator: number; denominator: number; label?: string };
  bar2: { numerator: number; denominator: number; label?: string };
}

export interface OperationBarsVisualData {
  operation: '+' | '-';
  fraction1: { num: number; den: number };
  fraction2: { num: number; den: number };
  resultFraction?: { num: number; den: number };
  commonDenom?: number;
}

export interface PercentageGridVisualData {
  totalCells: 100;
  highlightedCells: number;
  label?: string;
}

export interface MixedOrImproperVisualData {
  whole: number;
  numerator: number;
  denominator: number;
  improperNumerator?: number;
  partsPerWhole: number;
  itemType?: 'circle' | 'bar';
}

export interface MeasuringCupVisualData {
  totalParts: number;
  filledParts: number;
  label?: string;
}

export type VisualData =
  | ObjectGroupVisualData
  | PizzaFractionVisualData
  | FractionBarVisualData
  | EquivalentBarsVisualData
  | OperationBarsVisualData
  | PercentageGridVisualData
  | MixedOrImproperVisualData
  | MeasuringCupVisualData
  | Record<string, any>;

export interface QuestionBankItem {
  questionId: string;
  gameId: GameId;
  challengeId: ChallengeId;
  dskpCode: DskpCode;
  difficulty: QuestionDifficulty;
  questionType: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  visualType: VisualType;
  visualData?: VisualData;
}

