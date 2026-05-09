import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Zap, Layers } from 'lucide-react';
import { GameState } from '../types';

interface StatusBarProps {
  state: GameState;
  color: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ state, color }) => {
  return (
    <div className="w-full max-w-[500px] mx-auto mb-6 flex items-center justify-between px-2">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Score</span>
        <motion.span 
          key={state.score}
          initial={{ scale: 1.2, color: color }}
          animate={{ scale: 1, color: '#0f172a' }}
          className="text-4xl font-black tracking-tighter leading-none"
        >
          {state.score}
        </motion.span>
      </div>

      <div className="flex items-center gap-4">
        {state.combo > 1 && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-end"
          >
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-1">Combo</span>
            <div className="flex items-center">
              <Zap size={14} className="text-orange-500 mr-1 fill-current" />
              <span className="text-xl font-black text-orange-500 tracking-tighter">x{state.combo}</span>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Hi-Score</span>
          <div className="flex items-center">
            <Trophy size={14} className="text-yellow-500 mr-1" />
            <span className="text-xl font-black text-slate-900 tracking-tighter">{state.highScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
