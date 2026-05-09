import React, { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  state: GameState;
  color: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ state, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    const foodX = state.food.x * cellSize + cellSize / 2;
    const foodY = state.food.y * cellSize + cellSize / 2;
    const foodRadius = (cellSize / 2) * 0.7;

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF0055';
    ctx.fillStyle = '#FF0055';
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    state.snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const isHead = index === 0;

      ctx.fillStyle = color;
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1 - (index / state.snake.length) * 0.7;
      }

      const padding = 1.5;
      const size = cellSize - padding * 2;
      
      const radius = isHead ? size / 3 : size / 5;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, size, size, radius);
      ctx.fill();

      // Add "eyes" to head
      if (isHead) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 0;
        const eyeSize = size / 6;
        const eyeOffset = size / 3.5;
        
        // Frontal eyes based on direction
        // This is simplified but adds character
        ctx.beginPath();
        ctx.arc(x + cellSize/2 - eyeOffset, y + cellSize/2 - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.arc(x + cellSize/2 + eyeOffset, y + cellSize/2 - eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    });

  }, [state, color]);

  return (
    <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full block"
      />
    </div>
  );
};
