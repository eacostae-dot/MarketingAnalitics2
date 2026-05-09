import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';

export const getRandomPoint = (exclude: Point[] = []): Point => {
  const newPoint = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  if (exclude.some(p => p.x === newPoint.x && p.y === newPoint.y)) {
    return getRandomPoint(exclude);
  }

  return newPoint;
};

export const getNextHead = (head: Point, direction: Direction): Point => {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
};

export const wrapPoint = (point: Point): Point => {
  return {
    x: (point.x + GRID_SIZE) % GRID_SIZE,
    y: (point.y + GRID_SIZE) % GRID_SIZE,
  };
};

export const isCollision = (point: Point, elements: Point[]): boolean => {
  return elements.some(e => e.x === point.x && e.y === point.y);
};

export const isOutOfBounds = (point: Point): boolean => {
  return point.x < 0 || point.x >= GRID_SIZE || point.y < 0 || point.y >= GRID_SIZE;
};

export const saveHighScore = (mode: string, score: number) => {
  const scores = JSON.parse(localStorage.getItem('snake_high_scores') || '{}');
  if (!scores[mode] || score > scores[mode]) {
    scores[mode] = score;
    localStorage.setItem('snake_high_scores', JSON.stringify(scores));
  }
};

export const getHighScore = (mode: string): number => {
  const scores = JSON.parse(localStorage.getItem('snake_high_scores') || '{}');
  return scores[mode] || 0;
};
