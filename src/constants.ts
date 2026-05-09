import { GameMode } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 50;
export const SPEED_INCREMENT = 2;
export const COMBO_TIMEOUT = 3000;

export const MODE_CONFIGS = {
  [GameMode.CLASSIC]: {
    description: 'The traditional snake experience. Grow as long as you can.',
    hasBorders: true,
    speedMultiplier: 1,
    scoreMultiplier: 1,
  },
  [GameMode.ARCADE]: {
    description: 'Speed increases faster. Score more points with speed.',
    hasBorders: true,
    speedMultiplier: 1.2,
    scoreMultiplier: 1.5,
  },
  [GameMode.SURVIVAL]: {
    description: 'Avoid random obstacles that appear over time.',
    hasBorders: true,
    speedMultiplier: 1,
    scoreMultiplier: 2,
  },
  [GameMode.INFINITE]: {
    description: 'No borders. Warp through walls.',
    hasBorders: false,
    speedMultiplier: 0.9,
    scoreMultiplier: 0.8,
  },
  [GameMode.HARDCORE]: {
    description: 'Maximum speed, no room for errors.',
    hasBorders: true,
    speedMultiplier: 2,
    scoreMultiplier: 5,
  },
};

export const SNAKE_COLORS = [
  '#10b981', // Emerald (Theme Primary)
  '#0ea5e9', // Sky Blue
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#0f172a', // Slate 900
];
