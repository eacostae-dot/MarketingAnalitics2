export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  ARCADE = 'ARCADE',
  SURVIVAL = 'SURVIVAL',
  INFINITE = 'INFINITE',
  HARDCORE = 'HARDCORE',
}

export type Point = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type PowerUpType = 'SPEED' | 'SHIELD' | 'MAGNET' | 'MULTIPLIER';

export type PowerUp = {
  id: string;
  type: PowerUpType;
  position: Point;
  expiresAt: number;
};

export type GameState = {
  status: GameStatus;
  mode: GameMode;
  score: number;
  highScore: number;
  level: number;
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  speed: number;
  combo: number;
  lastEatTime: number;
  powerUps: PowerUp[];
  activePowerUps: Record<PowerUpType, number>; // type -> expiry timestamp
};

export type UserPreferences = {
  color: string;
  skin: string;
  haptic: boolean;
  sound: boolean;
  theme: 'light' | 'dark';
};
