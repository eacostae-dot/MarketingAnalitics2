import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface ParticleSystemProps {
  x: number;
  y: number;
  color: string;
  trigger: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ x, y, color, trigger }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const newParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      color,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [trigger, x, y, color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 1 }}
            animate={{ 
              opacity: 0, 
              x: p.x + p.vx * 20, 
              y: p.y + p.vy * 20,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
