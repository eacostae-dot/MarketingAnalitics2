import React, { useEffect, useRef } from 'react';
import { Direction } from '../types';

interface SwipeControlProps {
  onSwipe: (direction: Direction) => void;
  children: React.ReactNode;
}

export const SwipeControl: React.FC<SwipeControlProps> = ({ onSwipe, children }) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 30;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const distanceX = touchEnd.x - touchStart.current.x;
      const distanceY = touchEnd.y - touchStart.current.y;

      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        // Horizontal swipe
        if (Math.abs(distanceX) > minSwipeDistance) {
          onSwipe(distanceX > 0 ? 'RIGHT' : 'LEFT');
        }
      } else {
        // Vertical swipe
        if (Math.abs(distanceY) > minSwipeDistance) {
          onSwipe(distanceY > 0 ? 'DOWN' : 'UP');
        }
      }

      touchStart.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onSwipe('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onSwipe('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onSwipe('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onSwipe('RIGHT');
          break;
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSwipe]);

  return <div className="w-full h-full">{children}</div>;
};
