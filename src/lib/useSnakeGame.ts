import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameState, GameStatus, GameMode, Point, Direction, 
} from '../types';
import { 
  MODE_CONFIGS, GRID_SIZE, INITIAL_SPEED, MIN_SPEED, 
  SPEED_INCREMENT, COMBO_TIMEOUT 
} from '../constants';
import { 
  getRandomPoint, getNextHead, wrapPoint, 
  isCollision, isOutOfBounds, saveHighScore, getHighScore 
} from './gameUtils';
import { audioManager } from './audioUtils';

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const useSnakeGame = (mode: GameMode) => {
  const [state, setState] = useState<GameState>({
    status: GameStatus.IDLE,
    mode,
    score: 0,
    highScore: getHighScore(mode),
    level: 1,
    snake: INITIAL_SNAKE,
    food: getRandomPoint(INITIAL_SNAKE),
    direction: 'UP',
    nextDirection: 'UP',
    speed: INITIAL_SPEED / (MODE_CONFIGS[mode]?.speedMultiplier || 1),
    combo: 0,
    lastEatTime: 0,
    powerUps: [],
    activePowerUps: { SPEED: 0, SHIELD: 0, MAGNET: 0, MULTIPLIER: 0 },
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  }, []);

  const resetGame = useCallback(() => {
    const highScore = getHighScore(mode);
    setState(s => ({
      ...s,
      status: GameStatus.IDLE,
      score: 0,
      highScore,
      level: 1,
      snake: INITIAL_SNAKE,
      food: getRandomPoint(INITIAL_SNAKE),
      direction: 'UP',
      nextDirection: 'UP',
      speed: INITIAL_SPEED / (MODE_CONFIGS[mode]?.speedMultiplier || 1),
      combo: 0,
      lastEatTime: 0,
    }));
  }, [mode]);

  const startGame = useCallback(() => {
    audioManager.init();
    setState(s => ({ ...s, status: GameStatus.PLAYING }));
  }, []);

  const pauseGame = useCallback(() => {
    setState(s => ({ 
      ...s, 
      status: s.status === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING 
    }));
  }, []);

  const gameOver = useCallback(() => {
    setState(s => {
      saveHighScore(s.mode, s.score);
      return { ...s, status: GameStatus.GAME_OVER };
    });
    triggerHaptic();
    audioManager.playGameOver();
  }, [triggerHaptic]);

  const moveSnake = useCallback(() => {
    setState(s => {
      if (s.status !== GameStatus.PLAYING) return s;

      const newDirection = s.nextDirection;
      let nextHead = getNextHead(s.snake[0], newDirection);

      const config = MODE_CONFIGS[s.mode];

      if (!config.hasBorders) {
        nextHead = wrapPoint(nextHead);
      } else if (isOutOfBounds(nextHead)) {
        gameOver();
        return s;
      }

      if (isCollision(nextHead, s.snake.slice(0, -1))) {
        gameOver();
        return s;
      }

      const didEat = nextHead.x === s.food.x && nextHead.y === s.food.y;
      const newSnake = [nextHead, ...s.snake];

      if (!didEat) {
        newSnake.pop();
      }

      let newScore = s.score;
      let newFood = s.food;
      let newSpeed = s.speed;
      let newCombo = s.combo;
      let newLastEatTime = s.lastEatTime;

      if (didEat) {
        triggerHaptic();
        audioManager.playEat();
        const now = Date.now();
        newCombo = (now - s.lastEatTime < COMBO_TIMEOUT) ? s.combo + 1 : 1;
        newLastEatTime = now;
        
        const points = 10 * newCombo * config.scoreMultiplier;
        newScore += points;
        newFood = getRandomPoint(newSnake);
        newSpeed = Math.max(MIN_SPEED, s.speed - SPEED_INCREMENT);
      }

      return {
        ...s,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: newDirection,
        speed: newSpeed,
        combo: newCombo,
        lastEatTime: newLastEatTime,
      };
    });
  }, [gameOver, triggerHaptic]);

  useEffect(() => {
    if (state.status !== GameStatus.PLAYING) return;

    const loop = (time: number) => {
      if (time - lastUpdateRef.current >= state.speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [state.status, state.speed, moveSnake]);

  const setDirection = useCallback((dir: Direction) => {
    setState(s => {
      const isOpposite = 
        (dir === 'UP' && s.direction === 'DOWN') ||
        (dir === 'DOWN' && s.direction === 'UP') ||
        (dir === 'LEFT' && s.direction === 'RIGHT') ||
        (dir === 'RIGHT' && s.direction === 'LEFT');
      
      if (isOpposite) return s;
      return { ...s, nextDirection: dir };
    });
  }, []);

  return {
    state,
    startGame,
    pauseGame,
    resetGame,
    setDirection,
  };
};
