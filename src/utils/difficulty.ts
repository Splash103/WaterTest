export type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultySettings {
  initialSpeed: number;
  speedIncrease: number;
  maxSpeed: number;
  pointMultiplier: number;
  timeBonus: number;
  waterReduction: number;
  timePenalty: number;
  penaltyEnabled: boolean;
  description: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    initialSpeed: 1000,
    speedIncrease: 50,
    maxSpeed: 200,
    pointMultiplier: 1,
    timeBonus: 2,
    waterReduction: 15,
    timePenalty: 1,
    penaltyEnabled: false,
    description: 'More time, no penalties'
  },
  normal: {
    initialSpeed: 800,
    speedIncrease: 75,
    maxSpeed: 150,
    pointMultiplier: 2,
    timeBonus: 1.5,
    waterReduction: 10,
    timePenalty: 2,
    penaltyEnabled: true,
    description: 'Balanced challenge'
  },
  hard: {
    initialSpeed: 600,
    speedIncrease: 100,
    maxSpeed: 100,
    pointMultiplier: 3,
    timeBonus: 1,
    waterReduction: 5,
    timePenalty: 3,
    penaltyEnabled: true,
    description: 'Less time, harsh penalties'
  }
};